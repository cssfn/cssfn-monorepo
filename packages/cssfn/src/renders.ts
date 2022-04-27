// cssfn:
import type {
    // cssfn properties:
    CssCustomValue,
    CssCustomProps,
    
    CssKnownValueOf,
    
    CssProps,
    
    CssRuleData,
    CssRule,
    CssRuleCollection,
    
    CssStyle,
    CssStyleCollection,
    CssFontFaceStyleCollection,
    
    CssKeyframes,
    
    CssSelector,
    CssSelectorCollection,
    CssSelectorOptions,
    
    CssRawSelector,
    CssFinalSelector,
    
    CssClassName,
    
    CssScopeName,
    CssScopeEntry,
}                           from '@cssfn/css-types'

// internals:
import type {
    // types:
    StyleSheet,
}                           from './styleSheets.js'
import {
    mergeStyles,
}                           from './mergeStyles.js'
import {
    rule,
    rules,
}                           from './cssfn.js'

// other libs:
import {
    default as hyphenate,
}                           from 'hyphenate-style-name' // faster than camel-case



// utilities:
const conditionalNestedAtRules = ['@media', '@supports', '@document'];
export const isConditionalNestedAtRules = (finalSelector: CssFinalSelector) => conditionalNestedAtRules.some((at) => finalSelector.startsWith(at));



type RuleEntry = readonly [CssFinalSelector, CssStyle]
class RenderRule {
    //#region private fields
    readonly #rendered : string[]
    //#endregion private fields
    
    
    
    //#region private methods
    #appendRendered(rendered: string|null): void {
        if (!rendered) return;
        this.#rendered.push(rendered);
    }
    
    #renderPropName(propName: string): string {
        if (propName.startsWith('--')) return propName; // css custom prop
        if (propName.startsWith('var(')) return propName.slice(4, -1); // fix: var(--customProp) => --customProp
        
        
        
        return hyphenate(propName); // faster than camelCase
    }
    #renderPropValue(propValue: CssCustomValue): string {
        if (!Array.isArray(propValue)) {
            if (typeof(propValue) === 'number') return `${propValue}`; // CssSimpleNumericValue => number => convert to string
            return propValue; // CssSimpleLiteralValue|CssCustomRef => string
        } // if
        
        
        
        let hasImportant = false;
        return (
            propValue
            .map((propSubValue, index, array): string|null => {
                if (!Array.isArray(propSubValue)) {
                    if (typeof(propSubValue) === 'number') return `${propSubValue}`; // CssSimpleNumericValue => number => convert to string
                    if ((index === (array.length - 1)) && (propSubValue === '!important')) {
                        hasImportant = true;
                        return null; // do not comma_separated_!important
                    }
                    return propSubValue; // CssSimpleLiteralValue|CssCustomRef => string
                } // if
                
                
                
                return (
                    propSubValue
                    .map((propSubSubValue): string => {
                        if (typeof(propSubSubValue) === 'number') return `${propSubSubValue}`; // CssSimpleNumericValue => number => convert to string
                        return propSubSubValue; // CssSimpleLiteralValue|CssCustomRef => string
                    })
                    .join(' ') // space_separated_values
                );
            })
            .filter((propSubValue): propSubValue is string => (propSubValue !== null))
            .join(', ') // comma_separated_values
            +
            (hasImportant ? ' !important' : '')
        );
    }
    #renderProp(propName: string, propValue: CssCustomValue): void {
        const rendered = this.#rendered;
        rendered.push(this.#renderPropName(propName));
        rendered.push(': ');
        rendered.push(this.#renderPropValue(propValue));
        rendered.push(';\n');
    }
    
    #renderSelector(finalSelector: CssFinalSelector|null, renderfinalStyle: () => void): void {
        if (!finalSelector) {
            renderfinalStyle();
            return;
        } // if
        
        
        
        const rendered = this.#rendered;
        rendered.push(finalSelector);
        rendered.push(' {\n');
        {
            renderfinalStyle();
        }
        rendered.push('\n}\n\n');
    }
    #renderStyle(finalStyle: CssStyle|null): void {
        this.#renderFallbacksRules(finalStyle);
        
        
        
        if (!finalStyle) return;
        for (const propName in finalStyle) {
            this.#renderProp(propName, (finalStyle as any)[propName])
        } // for
    }
    #renderRule(finalSelector: CssFinalSelector|null, finalStyle: CssStyle|null): void {
        this.#renderSelector(finalSelector, () => {
            this.#renderStyle(finalStyle);
        });
    }
    
    #renderFallbacksRules(nestedRules: CssRule|null): void {
        if (!nestedRules) return;
        for (const symbolProp of Object.getOwnPropertySymbols(nestedRules)) {
            const ruleData = nestedRules[symbolProp];
            if (ruleData === undefined) continue;
            const [finalSelector, finalStyle] = ruleData;
            if (finalSelector === '@fallbacks') continue;
            if ((finalStyle === null) || (typeof(finalStyle) !== 'object') || Array.isArray(finalStyle)) continue;
            
            
            
            this.#renderStyle(finalStyle);
        } // for
    }
    #renderNestedRules(finalParentSelector: CssFinalSelector|null, nestedRules: CssRule|null): void {
        if (!nestedRules) return;
        for (const symbolProp of Object.getOwnPropertySymbols(nestedRules)) {
            const ruleData = nestedRules[symbolProp];
            if (ruleData === undefined) continue;
            const [finalSelector, finalStyle] = ruleData;
            if (typeof(finalSelector) !== 'string') continue;
            if (finalSelector === '@fallbacks') continue;
            if ((finalStyle === null) || (typeof(finalStyle) !== 'object') || Array.isArray(finalStyle)) continue;
            
            
            
            if (finalSelector === '@global') { // special @global rule
                this.#appendRendered(
                    (new RenderRule(null, finalStyle)).toString()
                );
            }
            else if (isConditionalNestedAtRules(finalSelector)) {
                /*
                    for non-@global parent:
                    
                    from:
                    .parent {                                // parentRule
                        .awesome { fontSize: 'small' }
                        @media (min-width: 1024px) {         // nested conditional
                            .awesome { fontSize: 'large' }   // the nestedStyles
                        }
                    }
                    
                    to:
                    .parent {
                        .awesome { fontSize: 'small' }
                    }
                    @media (min-width: 1024px) {             // move up the nestedSelectorStr
                        .parent {                            // duplicate the parentRule selector
                            .awesome { fontSize: 'large' }   // move the nestedStyles
                        }
                    }
                    
                    
                    
                    for @global parent:
                    
                    from:
                    @global {                                // parentRule
                        .awesome { fontSize: 'small' }
                        @media (min-width: 1024px) {         // nested conditional
                            .awesome { fontSize: 'large' }   // the nestedStyles
                        }
                    }
                    
                    to:
                    @global {
                        .awesome { fontSize: 'small' }
                    }
                    @media (min-width: 1024px) {             // move up the nestedSelectorStr
                        .awesome { fontSize: 'large' }       // keep the nestedStyles
                    }
                */
            }
            else {
                // at rule  , eg: @keyframes, @font-face
                // prop rule, eg: `from`, `to`, `25%`
                
                this.#appendRendered(
                    (new RenderRule(finalSelector, finalStyle)).toString()
                );
            } // if
        } // for
    }
    //#endregion private methods
    
    
    
    //#region public methods
    toString() : string|null {
        return this.#rendered.join('');
    }
    //#endregion public methods
    
    
    
    constructor(finalSelector: CssFinalSelector|null, finalStyle: CssStyle|null) {
        this.#rendered = [];
        this.#renderRule(finalSelector, finalStyle);
        this.#renderNestedRules(finalSelector, finalStyle);
    }
}



export const render = (styleSheet: StyleSheet): string|null => {
    if (!styleSheet.enabled) return null;
    
    
    
    const scopesFactory = styleSheet.scopes;
    const scopeList = (typeof(scopesFactory) === 'function') ? scopesFactory() : scopesFactory;
    
    const scopeMap     = styleSheet.classes;
    
    const scopeRules : CssRule[] = scopeList.map(([scopeName, styles]): CssRule|null => {
        // calculate unique class:
        const uniqueClass    : CssClassName     = scopeMap[scopeName];
        const uniqueSelector : CssFinalSelector = `.${uniqueClass}`;
        
        
        
        // the top level rule (scope rule):
        return rule(
            uniqueSelector,
            styles
        );
    }).filter((rule): rule is CssRule => !!rule);
    const styleSheetRule       = rules(scopeRules);
    const mergedStyleSheetRule = mergeStyles(styleSheetRule);
    
    
    
    // finally, render the structures:
    return (new RenderRule(null, mergedStyleSheetRule)).toString();
}