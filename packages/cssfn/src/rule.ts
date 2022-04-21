// cssfn:
import type {
    // cssfn properties:
    CssRuleData,
    CssRule,
    
    CssStyleCollection,
    
    CssSelectorCollection,
    CssSelectorOptions,
    
    RawCssSelector,
}                           from '@cssfn/css-types'



// rules:

/**
 * Defines a conditional style(s) that is applied when the specified `selectors` meets the conditions.
 * @returns A `Rule` represents a conditional style(s).
 */
export const rule = (selectors: CssSelectorCollection, styles: CssStyleCollection, options?: CssSelectorOptions): CssRule => {
    return {
        [Symbol()] : [
            [selectors, options] as RawCssSelector,
            styles
        ] as CssRuleData,
    };
}
