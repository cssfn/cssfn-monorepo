// cssfn:
import type {
    // types:
    OptionalOrBoolean,
    
    Factory,
    ProductOrFactory,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssRuleData,
    CssRule,
    CssRuleCollection,
    
    CssStyleCollection,
    
    CssClassEntry,
    CssClassList,
    
    CssScopeName,
    CssScopeEntry,
    CssScopeMap,
    
    CssSelector,
    CssSelectorCollection,
    CssSelectorOptions,
    
    CssRawSelector,
    CssFinalSelector,
}                           from '@cssfn/css-types'

// internals:
import {
    flat,
    isFinalSelector,
    normalizeSelectorOptions,
}                           from './utilities'
export {
    StyleSheet,
    styleSheet,
}                           from './styleSheet'



// scopes:
/**
 * Defines an additional scoped styleSheet.
 * @returns A `CssScopeEntry` represents a scoped styleSheet.
 */
export const scopeOf     = <TCssScopeName extends CssScopeName>(scopeName: TCssScopeName, ...styles: CssStyleCollection[]): CssScopeEntry<TCssScopeName> => [
    scopeName,
    styles
];
/**
 * Defines the main styleSheet.
 * @returns A `CssScopeEntry` represents a main styleSheet.
 */
export const mainScope   = (...styles: CssStyleCollection[]) => scopeOf('main' , ...styles);
/**
 * Defines an unscoped styleSheet (applied to a whole document).
 * @returns A `CssScopeEntry` represents an unscoped styleSheet.
 */
export const globalScope = (...rules :  CssRuleCollection[]) => scopeOf(''     , ...rules );



// rules:
/**
 * Defines a conditional style(s) that is applied when the specified `selectors` meets the conditions.
 * @returns A `CssRule` represents a conditional style(s).
 */
export const rule = (selectors: CssSelectorCollection, styles: CssStyleCollection, options?: CssSelectorOptions): CssRule => ({
    [Symbol()] : [
        [selectors, options],
        styles
    ],
});



// rule groups:
const overwriteSelectorOptions = (selector: CssRawSelector|CssFinalSelector, options: CssSelectorOptions): CssRawSelector => {
    if (isFinalSelector(selector)) {
        return [
            selector,
            options
        ];
    } // if
    
    
    
    // extract raw selector:
    const [selectors, oldOptions] = selector;
    
    const performGrouping      =                      options.performGrouping      ?? oldOptions?.performGrouping;
    const specificityWeight    =                      options.specificityWeight    ?? oldOptions?.specificityWeight;
    const minSpecificityWeight = specificityWeight ?? options.minSpecificityWeight ?? oldOptions?.minSpecificityWeight;
    const maxSpecificityWeight = specificityWeight ?? options.maxSpecificityWeight ?? oldOptions?.maxSpecificityWeight;
    
    return [
        selectors,
        {
            performGrouping,
            
            specificityWeight,
            minSpecificityWeight,
            maxSpecificityWeight,
        }
    ];
}
export const rules    = (rules   : CssRuleCollection, options?: CssSelectorOptions): CssRule => {
    const result = (
        flat(rules)
        .filter((rule): rule is CssRule|Factory<OptionalOrBoolean<CssRule>> => !!rule && (rule !== true))
        .map((ruleOrFactory): OptionalOrBoolean<CssRule> => {
            if (typeof(ruleOrFactory) === 'function') return ruleOrFactory();
            return ruleOrFactory;
        })
        .filter((optionalRule): optionalRule is CssRule => !!optionalRule && (optionalRule !== true))
    );
    if (!options) return Object.assign({}, ...result); // merge multiple CssRule objects to single CssRule object
    
    
    
    return Object.fromEntries(
        result
        .flatMap((rule): (readonly [symbol, CssRuleData])[] => (
            Object.getOwnPropertySymbols(rule)
            .map((symbolProp): readonly [symbol, CssRuleData] => {
                const [selector, styles] = rule[symbolProp];
                const rawSelector : CssRawSelector = overwriteSelectorOptions(selector, options);
                const ruleData    : CssRuleData    = [rawSelector, styles];
                
                return [
                    symbolProp,
                    ruleData
                ];
            })
        ))
    );
};

const defaultVariantOptions : CssSelectorOptions = {
    maxSpecificityWeight : 2,
}
/**
 * Defines style variants.
 * @returns A `CssRule` represents a style variants.
 */
export const variants = (variants: CssRuleCollection, options?: CssSelectorOptions) => rules(variants, normalizeSelectorOptions(options, defaultVariantOptions));

const defaultStateOptions : CssSelectorOptions = {
    minSpecificityWeight : 3,
}
/**
 * Defines style states.
 * @returns A `CssRule` represents a style states.
 */
export const states   = (states  : CssRuleCollection, options?: CssSelectorOptions) => rules(states  , normalizeSelectorOptions(options, defaultStateOptions  ));
