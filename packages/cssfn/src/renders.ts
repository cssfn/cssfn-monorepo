// cssfn:
import type {
    // cssfn properties:
    CssCustomValue,
    
    CssRule,
    
    CssStyle,
    
    CssFinalSelector,
    
    CssClassName,
    
    CssScopeName,
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
    // rules:
    rule,
    
    
    
    // rule groups:
    rules,
    
    
    
    // rule shortcuts:
    atGlobal,
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
    #renderSelector(finalSelector: CssFinalSelector|null, finalStyle: CssStyle|null): void {
        if (
            !finalStyle // no style defined
            ||
            // a style defined, but:
            (
                // there is no any prop:
                // in case of the parentRule is only containing nestedRule(s)
                !Object.keys(finalStyle).length
                
                &&
                
                // there is no any PropRule:
                // in case of the @keyframes rule is always contains PropRule(s) but not contains nestedRule(s)
                !this.#hasPropRule(finalStyle)
            )
        )
        {
            return; // empty style => no need to render the .selector { /* empty style */ }
        } // if
        
        
        
        if (!finalSelector) {
            this.#renderStyle(finalStyle); // just render the style without selector, eg: @global rule => no selector but has style
            return;
        } // if
        
        
        
        //#region render complete .selector { style }
        this.rendered += '\n';
        this.rendered += finalSelector;
        this.rendered += ' {';
        {
            this.#renderStyle(finalStyle);
        }
        this.rendered += '\n}\n';
        //#endregion render complete .selector { style }
    }
    #renderConditionalSelector(finalSelector: CssFinalSelector, nestedRules: CssRule|null): void {
        if (!nestedRules) return;
        
        
        
        //#region render complete .selector { style }
        this.rendered += '\n';
        this.rendered += finalSelector;
        this.rendered += ' {';
        {
            this.#renderNestedRules(null, nestedRules);
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
                        color: black;
                        .awesome { fontSize: 'small' }
                        @media (min-width: 1024px) {         // nested conditional
                            color: red;                      // the nestedStyles
                            .awesome { fontSize: 'large' }   // the nestedRules
                        }
                    }
                    
                    to:
                    .parent {
                        color: black;
                        .awesome { fontSize: 'small' }
                    }
                    @media (min-width: 1024px) {             // move up the nestedSelectorStr
                        .parent {                            // __duplicate__ the parentRule selector
                            color: red; // valid             // __move_in__ the nestedStyles
                            .awesome { fontSize: 'large' }   // __move_in__ the nestedRules
                        }
                    }
                    
                    
                    
                    for @global parent:
                    
                    from:
                    @global {                                // parentRule
                        color: black;
                        .awesome { fontSize: 'small' }
                        @media (min-width: 1024px) {         // nested conditional
                            color: red;                      // the nestedStyles
                            .awesome { fontSize: 'large' }   // the nestedRules
                        }
                    }
                    
                    to:
                    @global {
                        color: black; // invalid
                        .awesome { fontSize: 'small' }
                    }
                    @media (min-width: 1024px) {             // move up the nestedSelectorStr
                        color: red; // invalid               // __not_needed__ the nestedStyles
                        .awesome { fontSize: 'large' }       // __keep__ the nestedRules
                    }
                */
                if (finalParentSelector === null) { // RenderRule(null, finalStyle) by @global
                    // top_level at rule with nestedRules
                    
                    // this.rendered += (new RenderRule(finalSelector, finalStyle)).rendered; doesn't work, the nested will automatically unnested
                    this.#renderConditionalSelector(finalSelector, finalStyle);
                }
                else {
                    // top_level at rule with nestedRules
                    
                    this.#renderConditionalSelector(finalSelector,
                        //#region wrap the style with a duplicated parentRule selector
                        {
                            [Symbol()] : [
                                finalParentSelector,
                                finalStyle
                            ],
                        }
                        //#endregion wrap the style with a duplicated parentRule selector
                    );
                } // if
            }
            else if (finalSelector[0] === '@') {
                // top_level at rule  , eg: @keyframes, @font-face
                
                this.rendered += (new RenderRule(finalSelector, finalStyle)).rendered;
            }
            else {
                // nested rule, eg: &.boo, &>:foo, .bleh>&>.feh
                
                // replace parentSelector (&) with finalParentSelector:
                const combinedSelector = combineSelector(
                    (!finalParentSelector || (finalParentSelector[0] === '@')) ? null : finalParentSelector,
                    finalSelector
                ) ?? finalSelector;
                
                this.rendered += (new RenderRule(combinedSelector, finalStyle)).rendered;
            } // if
        } // for
    }
    //#endregion private methods
    
    
    
    constructor(finalSelector: CssFinalSelector|null, finalStyle: CssStyle|null) {
        // reset:
        this.rendered = '';
        
        
        
        // render:
        if ((finalSelector !== null) || (finalStyle !== null)) {
            this.#renderSelector(finalSelector, finalStyle);
            this.#renderNestedRules(finalSelector, finalStyle);
        } // if
    }
}



export const render = <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): string|null => {
    if (!styleSheet.enabled) return null;
    
    
    
    const scopesFactory = styleSheet.scopes;
    const scopeList = (typeof(scopesFactory) === 'function') ? scopesFactory() : scopesFactory;
    
    const scopeMap     = styleSheet.classes;
    
    const scopeRules : CssRule[] = scopeList.map(([scopeName, styles, options]): CssRule|null => {
        if (scopeName === '') { // globalScope => aliased to @global rule
            return atGlobal(
                styles
            );
        } // if
        
        
        
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
