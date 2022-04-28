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
import {
    // types:
    SelectorGroup,
    
    
    
    // parses:
    parseSelectors,
    
    
    
    // SelectorEntry creates & tests:
    isParentSelector,
    
    
    
    // SimpleSelector & Selector creates & tests:
    createSelector,
    createSelectorGroup,
    
    
    
    // renders:
    selectorsToString,
    
    
    
    // transforms:
    replaceSelectors,
}                           from '@cssfn/css-selectors'

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

const combineSelector = (parentSelector: CssFinalSelector|null, nestedSelector: CssFinalSelector): CssFinalSelector|null => {
    //#region parse parentSelector & nestedSelector
    const parentSelectors : SelectorGroup|null = (
        parentSelector
        ?
        parseSelectors(parentSelector)
        :
        createSelectorGroup(
            createSelector(
                /* an empty Selector */
            )
        )
    );
    if (!parentSelectors) return null; // parsing error => invalid parentSelector
    
    const nestedSelectors : SelectorGroup|null = parseSelectors(nestedSelector);
    if (!nestedSelectors) return null; // parsing error => invalid nestedSelector
    //#endregion parse parentSelector & nestedSelector
    
    
    
    //#region combine parentSelector & nestedSelector
    const combinedSelectors : SelectorGroup = (
        parentSelectors
        .flatMap((parentSelector) =>
            replaceSelectors(nestedSelectors, (selectorEntry) => {
                // we're only interested of ParentSelector:
                if (isParentSelector(selectorEntry)) return parentSelector;
                
                // preserve the another selectorEntry:
                return selectorEntry;
            })
        )
    );
    //#endregion combine parentSelector & nestedSelector
    
    
    
    // convert back the parsed_object_tree to string:
    return selectorsToString(combinedSelectors);
};



type RuleEntry = readonly [CssFinalSelector, CssStyle]
class RenderRule {
    //#region public fields
    rendered : string
    //#endregion public fields
    
    
    
    //#region private methods
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
        this.rendered += '\n';
        this.rendered += this.#renderPropName(propName);
        this.rendered += ': ';
        this.rendered += this.#renderPropValue(propValue);
        this.rendered += ';';
    }
    
    #hasPropRule(finalStyle: CssStyle): boolean {
        for (const symbolProp of Object.getOwnPropertySymbols(finalStyle)) {
            const ruleData = finalStyle[symbolProp];
            const [finalSelector] = ruleData;
            if (typeof(finalSelector) !== 'string') continue;
            if (finalSelector[0] === ' ') return true; // found a PropRule
        } // for
        return false; // not found any PropRule
    }
    #renderSelector(finalSelector: CssFinalSelector|null, finalStyle: CssStyle|null, renderStyle: (finalStyle: CssStyle|null) => void): void {
        if (
            !finalStyle // no style defined
            ||
            // a style defined, but:
            (
                // there is no any prop:
                !Object.keys(finalStyle).length)
                &&
                // there is no any PropRule:
                !this.#hasPropRule(finalStyle)
            )
        {
            return; // empty style => no need to render the .selector { /* empty style */ }
        } // if
        if (!finalSelector) {
            renderStyle.call(this, finalStyle); // just render the style without selector, eg: @global rule => no selector but has style
            return;
        } // if
        
        
        
        //#region render complete .selector { style }
        this.rendered += '\n';
        this.rendered += finalSelector;
        this.rendered += ' {';
        {
            renderStyle.call(this, finalStyle);
        }
        this.rendered += '\n}\n';
        //#endregion render complete .selector { style }
    }
    #renderStyle(finalStyle: CssStyle|null): void {
        this.#renderFallbacksRules(finalStyle);
        
        
        
        if (!finalStyle) return;
        for (const propName in finalStyle) {
            this.#renderProp(propName, (finalStyle as any)[propName])
        } // for
        
        
        
        this.#renderPropRules(finalStyle);
    }
    #renderRule(finalSelector: CssFinalSelector|null, finalStyle: CssStyle|null): void {
        this.#renderSelector(finalSelector, finalStyle, this.#renderStyle);
    }
    
    #renderFallbacksRules(nestedRules: CssRule|null): void {
        if (!nestedRules) return;
        for (const symbolProp of Object.getOwnPropertySymbols(nestedRules).reverse()) { // reverse the @fallbacks order
            const ruleData = nestedRules[symbolProp];
            const [finalSelector, finalStyle] = ruleData;
            if (finalSelector !== '@fallbacks') continue; // only interested in @fallbacks
            if ((finalStyle === null) || (typeof(finalStyle) !== 'object') || Array.isArray(finalStyle)) continue;
            
            
            
            this.#renderStyle(finalStyle);
        } // for
    }
    #renderPropRules(nestedRules: CssRule|null): void {
        if (!nestedRules) return;
        for (const symbolProp of Object.getOwnPropertySymbols(nestedRules)) {
            const ruleData = nestedRules[symbolProp];
            const [finalSelector, finalStyle] = ruleData;
            if (typeof(finalSelector) !== 'string') continue;
            if (finalSelector[0] !== ' ') continue; // only interested in PropRule
            if ((finalStyle === null) || (typeof(finalStyle) !== 'object') || Array.isArray(finalStyle)) continue;
            
            
            
            this.rendered += (new RenderRule(
                finalSelector.slice(1), // remove PropRule token (single prefix space)
                finalStyle
            )).rendered;
        } // for
    }
    #renderNestedRules(finalParentSelector: CssFinalSelector|null, nestedRules: CssRule|null): void {
        if (!nestedRules) return;
        for (const symbolProp of Object.getOwnPropertySymbols(nestedRules)) {
            const ruleData = nestedRules[symbolProp];
            const [finalSelector, finalStyle] = ruleData;
            if (typeof(finalSelector) !== 'string') continue;
            if (finalSelector[0] === ' ') continue; // skip PropRule
            if (finalSelector === '@fallbacks') continue; // skip @fallbacks
            if ((finalStyle === null) || (typeof(finalStyle) !== 'object') || Array.isArray(finalStyle)) continue;
            
            
            
            if (finalSelector === '@global') { // special @global rule
                this.rendered += (new RenderRule(null, finalStyle)).rendered;
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
            else if (finalSelector[0] === '@') {
                // top_level at rule  , eg: @keyframes, @font-face
                
                this.rendered += (new RenderRule(finalSelector, finalStyle)).rendered;
            }
            else {
                // nested rule, eg: &.boo, &>:foo, .bleh>&>.feh
                
                const combinedSelector = combineSelector(finalParentSelector, finalSelector) ?? finalSelector;
                this.rendered += (new RenderRule(combinedSelector, finalStyle)).rendered;
            } // if
        } // for
    }
    //#endregion private methods
    
    
    
    constructor(finalSelector: CssFinalSelector|null, finalStyle: CssStyle|null) {
        this.rendered = '';
        this.#renderRule(finalSelector, finalStyle);
        this.#renderNestedRules(finalSelector, finalStyle);
    }
}



export const render = <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): string|null => {
    if (!styleSheet.enabled) return null;
    
    
    
    const scopesFactory = styleSheet.scopes;
    const scopeList = (typeof(scopesFactory) === 'function') ? scopesFactory() : scopesFactory;
    
    const scopeMap     = styleSheet.classes;
    
    const scopeRules : CssRule[] = scopeList.map(([scopeName, styles, options]): CssRule|null => {
        // calculate unique class:
        const uniqueClass    : CssClassName     = scopeMap[scopeName];
        const uniqueSelector : CssFinalSelector = `.${uniqueClass}`;
        
        
        
        // the top level rule (scope rule):
        return rule(
            uniqueSelector,
            styles,
            { ...options, performGrouping: false }
        );
    }).filter((rule): rule is CssRule => !!rule);
    const styleSheetRule       = rules(scopeRules);
    const mergedStyleSheetRule = mergeStyles(styleSheetRule);
    
    
    
    // finally, render the structures:
    return (new RenderRule(null, mergedStyleSheetRule)).rendered || null;
}