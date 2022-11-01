// cssfn:
import type {
    // types:
    ValueOf,
}                           from '@cssfn/types'
import type {
    // css values:
    CssSimpleValue,
    CssComplexBaseValueOf,
    
    
    
    // css custom properties:
    CssCustomValue,
    
    
    
    // cssfn properties:
    CssProps,
    CssPropsMap,
    
    CssFinalRuleData,
    CssFinalRule,
    
    CssRuleCollection,
    
    CssFinalStyleMap,
    
    CssFinalSelector,
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
import type {
    // types:
    createCssPropAutoPrefix,
}                           from '@cssfn/css-prop-auto-prefix'

// internals:
import {
    filterOnlyRuleKeys,
    filterOnlyPropKeys,
    hasPropKeys,
    mergeStyles,
}                           from './mergeStyles.js'

// other libs:
import {
    default as hyphenate,
}                           from 'hyphenate-style-name'



// utilities:
const nestedAtRules = ['@media', '@supports', '@layer', '@document'];
export const isNestedAtRule = (finalSelector: CssFinalSelector) => nestedAtRules.some((at) => finalSelector.startsWith(at));

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

const shortProps = new Map<keyof CssProps, keyof CssProps>(Object.entries({
    foreg      : 'color',
    foreground : 'color',
    
    backg      : 'background',
    backgClip  : 'backgroundClip',
    
    anim       : 'animation',
    transf     : 'transform',
    
    gapX       : 'columnGap',
    gapY       : 'rowGap',
    gapInline  : 'columnGap',
    gapBlock   : 'rowGap',
}) as [keyof CssProps, keyof CssProps][]);



export interface RenderRuleOptions {
    cssPropAutoPrefix ?: ReturnType<typeof createCssPropAutoPrefix>
}
class RenderRule {
    //#region private fields
    #options : RenderRuleOptions|undefined
    //#endregion private fields
    
    //#region public fields
    rendered : string
    //#endregion public fields
    
    
    
    //#region private methods
    #renderPropName(propName: keyof CssProps): string {
        if (propName.startsWith('--')) return propName; // css custom prop
        if (propName.startsWith('var(')) return propName.slice(4, -1); // fix: var(--customProp) => --customProp
        
        
        
        const unshortPropName    = shortProps.get(propName) ?? propName;
        const cssPropAutoPrefix = this.#options?.cssPropAutoPrefix;
        const prefixedPropName   = cssPropAutoPrefix ? cssPropAutoPrefix(unshortPropName) : unshortPropName;
        const camelCasedPropName = hyphenate(prefixedPropName);
        return camelCasedPropName;
    }
    #renderPropSimpleValue(propValue: CssComplexBaseValueOf<CssSimpleValue>): string {
        if (typeof(propValue) === 'number') return `${propValue}`; // CssSimpleNumericValue              => number => string
        if (typeof(propValue) === 'string') return propValue;      // CssSimpleLiteralValue|CssCustomRef => string
        return propValue.toString();                               // CssCustomKeyframesRef              => .toString()
    }
    #renderPropValue(propValue: CssCustomValue): string {
        if (!Array.isArray(propValue)) return this.#renderPropSimpleValue(propValue); // CssComplexBaseValueOf<CssSimpleValue>
        
        
        
        let hasImportant = false;
        return (
            propValue
            .map((propSubValue, index, array): string|null => {
                if (!Array.isArray(propSubValue)) {
                    if (typeof(propSubValue) === 'number') return `${propSubValue}`; // CssSimpleNumericValue              => number => string
                    if ((index === (array.length - 1)) && (propSubValue === '!important')) {
                        hasImportant = true;
                        return null; // do not comma_separated_!important
                    }
                    if (typeof(propSubValue) === 'string') return propSubValue;      // CssSimpleLiteralValue|CssCustomRef => string
                    return propSubValue.toString();                                  // CssCustomKeyframesRef              => .toString()
                } // if
                
                
                
                return (
                    propSubValue
                    .map(this.#renderPropSimpleValue)
                    .join(' ') // space_separated_values
                );
            })
            .filter((propSubValue): propSubValue is string => (propSubValue !== null))
            .join(', ') // comma_separated_values
            +
            (hasImportant ? ' !important' : '')
        );
    }
    #renderProp(propName: keyof CssProps, propValue: CssCustomValue|undefined|null): void {
        if ((propValue === undefined) || (propValue === null)) return;
        
        
        
        this.rendered += '\n';
        const renderedPropName = this.#renderPropName(propName);
        this.rendered += renderedPropName;
        this.rendered += ': ';
        this.rendered += this.#renderPropValue(propValue);
        this.rendered += ';';
    }
    
    #hasPropRule(finalStyle: CssFinalStyleMap): boolean {
        for (const symbolProp of filterOnlyRuleKeys(finalStyle.keys())) {
            const ruleData = finalStyle.get(symbolProp)!;
            const [finalSelector] = ruleData;
            if (finalSelector[0] === ' ') return true; // found a PropRule
        } // for
        return false; // not found any PropRule
    }
    #renderSelector(finalSelector: CssFinalSelector|null, finalStyle: CssFinalStyleMap|null): void {
        if (
            !finalSelector?.startsWith('@keyframes ') // an empty `@keyframes noAnimation {}` is allowed
            &&
            (
                !finalStyle // no style defined
                ||
                // a style defined, but doesn't have any property:
                (
                    // there is no any prop:
                    // in case of the parentRule is only containing nestedRule(s)
                    !hasPropKeys(finalStyle.keys())
                    
                    &&
                    
                    // there is no any PropRule:
                    // in case of a something like @keyframes rule, that is always contains PropRule(s) but not contains nestedRule(s)
                    !this.#hasPropRule(finalStyle)
                )
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
    #renderNestedSelector(finalSelector: CssFinalSelector, nestedRules: CssFinalStyleMap|null): void {
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
    #renderStyle(finalStyle: CssFinalStyleMap|null): void {
        this.#renderFallbacksRules(finalStyle);
        
        
        
        if (!finalStyle) return;
        for (const propName of filterOnlyPropKeys(finalStyle.keys())) {
            this.#renderProp(
                propName,
                (finalStyle as CssPropsMap).get(propName as any) as CssCustomValue|undefined|null
            );
        } // for
        
        
        
        this.#renderPropRules(finalStyle);
    }
    
    #renderFallbacksRules(nestedRules: CssFinalStyleMap|null): void {
        if (!nestedRules) return;
        for (const symbolProp of Array.from(filterOnlyRuleKeys(nestedRules.keys())).reverse()) { // reverse the @fallbacks order
            const ruleData = nestedRules.get(symbolProp)!;
            const [finalSelector, finalStyle] = ruleData;
            if (finalSelector !== '@fallbacks') continue; // only interested in @fallbacks
            
            
            
            this.#renderStyle(finalStyle);
        } // for
    }
    #renderPropRules(nestedRules: CssFinalStyleMap|null): void {
        if (!nestedRules) return;
        for (const symbolProp of filterOnlyRuleKeys(nestedRules.keys())) {
            const ruleData = nestedRules.get(symbolProp)!;
            const [finalSelector, finalStyle] = ruleData;
            if (finalSelector[0] !== ' ') continue; // only interested in PropRule
            
            
            
            this.rendered += (new RenderRule(
                finalSelector.slice(1), // remove PropRule token (single prefix space)
                finalStyle,
                this.#options
            )).rendered;
        } // for
    }
    #renderNestedRules(finalParentSelector: CssFinalSelector|null, nestedRules: CssFinalStyleMap|null): void {
        if (!nestedRules) return;
        for (const symbolProp of filterOnlyRuleKeys(nestedRules.keys())) {
            const ruleData = nestedRules.get(symbolProp)!;
            const [finalSelector, finalStyle] = ruleData;
            if (finalSelector[0] === ' ') continue; // skip PropRule
            if (finalSelector === '@fallbacks') continue; // skip @fallbacks
            
            
            
            if (finalSelector === '@global') { // special @global rule
                this.rendered += (new RenderRule(null, finalStyle, this.#options)).rendered;
            }
            else if (isNestedAtRule(finalSelector)) {
                /*
                    for non-@global parent:
                    
                    from:
                    .parent {                                // parentRule
                        color: black;
                        .awesome { fontSize: 'small' }
                        @media (min-width: 1024px) {         // nested at rule
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
                        @media (min-width: 1024px) {         // nested at rule
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
                    this.#renderNestedSelector(finalSelector, finalStyle);
                }
                else {
                    // top_level at rule with nestedRules
                    
                    this.#renderNestedSelector(finalSelector,
                        //#region wrap the style with a duplicated parentRule selector
                        new Map<keyof CssFinalRule, ValueOf<CssFinalRule>>([
                            [Symbol(), [
                                finalParentSelector,
                                finalStyle
                            ] as CssFinalRuleData],
                        ]) as CssFinalStyleMap
                        //#endregion wrap the style with a duplicated parentRule selector
                    );
                } // if
            }
            else if (finalSelector[0] === '@') {
                // top_level at rule  , eg: @keyframes, @font-face
                
                this.rendered += (new RenderRule(finalSelector, finalStyle, this.#options)).rendered;
            }
            else {
                // nested rule, eg: &.boo, &>:foo, .bleh>&>.feh
                
                // replace parentSelector (&) with finalParentSelector:
                const combinedSelector = combineSelector(
                    (!finalParentSelector || (finalParentSelector[0] === '@')) ? null : finalParentSelector,
                    finalSelector
                ) ?? finalSelector;
                
                this.rendered += (new RenderRule(combinedSelector, finalStyle, this.#options)).rendered;
            } // if
        } // for
    }
    //#endregion private methods
    
    
    
    constructor(finalSelector: CssFinalSelector|null, finalStyle: CssFinalStyleMap|null, options: RenderRuleOptions|undefined) {
        // configs:
        this.#options = options;
        
        
        
        // reset:
        this.rendered = '';
        
        
        
        // render:
        if ((finalSelector !== null) || (finalStyle !== null)) {
            this.#renderSelector(finalSelector, finalStyle);
            this.#renderNestedRules(finalSelector, finalStyle);
        } // if
    }
}



// processors:
export const renderRule = (rules: CssRuleCollection, options?: RenderRuleOptions): string|null => {
    // merge the rules to styleMap:
    const finalStyleMap   = mergeStyles(rules);
    
    
    
    // finally, render the structures:
    return (new RenderRule(null, finalStyleMap, options)).rendered || null;
}
