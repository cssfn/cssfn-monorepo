// cssfn:
import type {
    // optionals:
    OptionalOrBoolean,
    
    
    
    // arrays:
    MaybeDeepArray,
    
    
    
    // dictionaries/maps:
    PartialNullish,
}                           from '@cssfn/types'

import type {
    // css values:
    CssSimpleValue,
    CssComplexValueOf,
    
    
    
    // css custom properties:
    CssCustomProps,
    
    
    
    // css known (standard) properties:
    CssKnownProps,
    
    
    
    // cssfn properties:
    CssRawSelector,
    CssFinalSelector,
}                           from '@cssfn/css-types'



// css values:
export type EncodedCssSimpleValue = Extract<CssSimpleValue, string|number>



// css custom properties:
export type EncodedCssCustomValue = CssComplexValueOf<EncodedCssSimpleValue>

export type EncodedCssCustomProps = PartialNullish<{
    [name in keyof CssCustomProps] : EncodedCssCustomValue
}>



// css known (standard) properties:
export type EncodedCssKnownProps = {
    [name in keyof CssKnownProps] : EncodedCssCustomValue
}



// cssfn properties:
export type EncodedCssProps           = EncodedCssCustomProps & EncodedCssKnownProps

export type EncodedCssRuleData        = readonly [undefined|CssRawSelector|CssFinalSelector, EncodedCssStyleCollection]
export type EncodedCssRule            = {
    '' ?: EncodedCssRuleData[] | null
}

export type EncodedCssStyle           = EncodedCssProps & EncodedCssRule
export type EncodedCssStyleCollection = MaybeDeepArray<OptionalOrBoolean<EncodedCssStyle>>
