// cssfn:
import type {
    // types:
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
    
    RawCssSelector,
}                           from '@cssfn/css-types'

// internals:
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
 * @returns A `Rule` represents a conditional style(s).
 */
export const rule = (selectors: CssSelectorCollection, styles: CssStyleCollection, options?: CssSelectorOptions): CssRule => ({
    [Symbol()] : [
        [selectors, options] as RawCssSelector,
        styles
    ] as CssRuleData,
});