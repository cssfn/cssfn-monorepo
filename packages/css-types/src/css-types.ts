// cssfn:
import type {
    OptionalOrBoolean,
    SingleOrDeepArray,
    ProductOrFactoryOrDeepArray,
    
    Dictionary,
}                           from '@cssfn/types'

// others libs:
import type {
    Properties,
    StandardLonghandProperties,
    StandardShorthandProperties,
    VendorLonghandProperties,
    VendorShorthandProperties,
    ObsoleteProperties,
    SvgProperties,
}                           from 'csstype'



//#region css values
//#region simple values
export type CssSimpleNumericValue           = (number & {})
export type CssSimpleLiteralValue           = (string & {})
export type CssSimpleValue                  =
    | CssSimpleNumericValue
    | CssSimpleLiteralValue
//#endregion simple values

//#region generic complex values
export type CssComplexBaseValueOf<TValue>   =
    | TValue                                               // final_value
    | CssCustomRef                                         // css_variable
export type CssComplexSingleValueOf<TValue> =
    | CssComplexBaseValueOf<TValue>                        // single_value
    | [CssComplexBaseValueOf<TValue>, '!important']        // single_value with !important
export type CssComplexMultiValueOf<TValue>  =
    | CssComplexBaseValueOf<TValue>[]                      // comma_separated_values
    | CssComplexBaseValueOf<TValue>[][]                    // space_separated_values
    | [...CssComplexBaseValueOf<TValue>[]  , '!important'] // comma_separated_values with !important
    | [...CssComplexBaseValueOf<TValue>[][], '!important'] // space_separated_values with !important
export type CssComplexValueOf<TValue>       =
    | CssComplexSingleValueOf<TValue>
    | CssComplexMultiValueOf<TValue>
//#endregion generic complex values
//#endregion css values



//#region css custom properties
// declaration:
export type CssCustomName         = `--${string}`

// values:
export type CssCustomKeyframesRef = (string & {})           // special value, not included to `CssCustomRef`
export type CssCustomSingleRef    = `var(${CssCustomName})` // single value
export type CssCustomRef          =
    | CssCustomSingleRef                                    // single value
    | `var(${CssCustomName}, ${CssCustomSingleRef})`        // with shallow fallback
 // | `var(${CssCustomName}, ${CssCustomRef})`              // with nested  fallback(s), can't circular
 // | `var(${CssCustomName}, ${string})`                    // use string for nested fallback(s), not ideal but works

export type CssCustomValue        = CssComplexValueOf<CssSimpleValue>

export type CssCustomProps = {
    [name: CssCustomName] : CssCustomValue
}
//#endregion css custom properties



//#region css known (standard) properties
export type CssLength   = (string & {}) | 0
export type CssDuration = (string & {})

export type CssKnownBaseProps<TLength = CssLength, TDuration = CssDuration> = Properties<TLength, TDuration>

export type CssKnownName         = keyof   CssKnownBaseProps
export type CssKnownValueOf
    <TName extends CssKnownName> = Exclude<CssKnownBaseProps[TName], undefined|null>



export type CssKnownPropsOf<TName extends CssKnownName, multiValue extends boolean = false> = {
    [name in TName] ?: multiValue extends false ? CssComplexSingleValueOf<CssKnownValueOf<name>> : CssComplexValueOf<CssKnownValueOf<name>>
}
export type CssKnownStandardLonghandProps  = CssKnownPropsOf<keyof StandardLonghandProperties, true>  // some_props like boxShadow, filter are comma/space separated values
export type CssKnownStandardShorthandProps = CssKnownPropsOf<keyof StandardShorthandProperties, true> // all_props are comma/space separated values
export type CssKnownStandardProps          = CssKnownStandardLonghandProps & CssKnownStandardShorthandProps

export type CssKnownVendorLonghandProps    = CssKnownPropsOf<keyof VendorLonghandProperties, true>  // some_props are comma/space separated values
export type CssKnownVendorShorthandProps   = CssKnownPropsOf<keyof VendorShorthandProperties, true> // all_props  are comma/space separated values
export type CssKnownVendorProps            = CssKnownVendorLonghandProps & CssKnownVendorShorthandProps

export type CssKnownObsoleteProps          = CssKnownPropsOf<keyof ObsoleteProperties>

export type CssKnownSvgProps               = CssKnownPropsOf<keyof SvgProperties>

export type CssKnownProps                  = CssKnownStandardProps & CssKnownVendorProps & CssKnownObsoleteProps & CssKnownSvgProps
//#endregion css known (standard) properties



//#region cssfn properties
export type CssProps           = CssCustomProps & CssKnownProps

export type CssRuleData        = readonly [CssSelector|RawCssSelector, CssStyleCollection]
export type CssRule = { // do not use Record<symbol, CssStyleCollection> => doesn't support circular ref
    [name: symbol] : CssRuleData
}
export type CssRuleCollection  = ProductOrFactoryOrDeepArray<OptionalOrBoolean<CssRule>>

export type CssStyle           = CssProps & CssRule
export type CssStyleCollection = ProductOrFactoryOrDeepArray<OptionalOrBoolean<CssStyle>>

export type CssKeyframes       = Dictionary<CssStyle>



export type CssClassName = string & {} // not a really string: [A-Z_a-z-]+
export type CssClassEntry
    <TCssClassName extends CssClassName> = readonly [TCssClassName, CssStyleCollection]
export type CssClassList
    <TCssClassName extends CssClassName> = CssClassEntry<TCssClassName>[]



export type CssScopeName = CssClassName & {}
export type CssScopeEntry
    <TCssScopeName extends CssScopeName> = readonly [TCssScopeName, CssStyleCollection]
export type CssScopeList
    <TCssScopeName extends CssScopeName> = CssScopeEntry<TCssScopeName>[]
export type CssScopeMap<TCssScopeName extends CssScopeName> = {
    [name in TCssScopeName] : CssClassName
}



export type CssSelector           = (string & {})
export type CssSelectorCollection = SingleOrDeepArray<OptionalOrBoolean<CssSelector>>

export interface CssSelectorOptions {
    groupSelectors       ?: boolean
    
    specificityWeight    ?: number|null
    minSpecificityWeight ?: number|null
    maxSpecificityWeight ?: number|null
}

export type RawCssSelector        = readonly [CssSelector, CssSelectorOptions]
//#endregion cssfn properties
