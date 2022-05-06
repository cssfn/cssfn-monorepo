// cssfn:
import type {
    OptionalOrBoolean,
    SingleOrDeepArray,
    ProductOrFactoryOrDeepArray,
    
    Nullable,
    
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
    | CssCustomKeyframesRef
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
export type CssCustomSimpleRef    = `var(${CssCustomName})` // single value
export type CssCustomRef          =
    | CssCustomSimpleRef                                    // single value
    | `var(${CssCustomName}, ${CssCustomSimpleRef})`        // with shallow fallback
 // | `var(${CssCustomName}, ${CssCustomRef})`              // with nested  fallback(s), can't circular
 // | `var(${CssCustomName}, ${string})`                    // use string for nested fallback(s), not ideal but works

export type CssCustomValue        = CssComplexValueOf<CssSimpleValue>

export type CssCustomProps = Nullable<{
    [name: CssCustomName     ] : CssCustomValue
    [name: CssCustomSimpleRef] : CssCustomValue
}>
//#endregion css custom properties



//#region css known (standard) properties
export type CssLength   = (string & {}) | 0
export type CssDuration = (string & {})

export type CssKnownBaseProps<TLength = CssLength, TDuration = CssDuration> = Properties<TLength, TDuration>

export type CssKnownName         = keyof   CssKnownBaseProps
export type CssKnownValueOf
    <TName extends CssKnownName> = Exclude<CssKnownBaseProps[TName], undefined|null>



export type CssKnownPropsOf<TName extends CssKnownName, multiValue extends boolean = false> = Nullable<Pick<{
    [name in keyof CssKnownBaseProps] ?: multiValue extends false ? CssComplexSingleValueOf<CssKnownValueOf<name>> : CssComplexValueOf<CssKnownValueOf<name>>
}, TName>>

//#region css special properties
export type CssLonghandFontFaceProps =
    // required props:
    // forced to optional because it may spreaded in partial style(s)
    // & Required<CssKnownPropsOf<'fontFamily', true>>
    & CssKnownPropsOf<'fontFamily', true>
    
    // longhand single-value props:
    & CssKnownPropsOf<
        | 'fontVariantCaps'
        | 'fontVariantLigatures'
        | 'fontVariantPosition'
        
        | 'fontStretch'
        | 'fontWeight'
    , false>
    
    // longhand multi-value props:
    & CssKnownPropsOf<
        | 'fontVariantAlternates'
        | 'fontVariantEastAsian'
        | 'fontVariantNumeric'
        
        | 'fontStyle'
        
        | 'fontFeatureSettings'
        | 'fontVariationSettings'
        
        | 'fontSizeAdjust'
    , true>
    
    & Nullable<{
        // additional required props:
        // forced to optional ( ?: ) because it may spreaded in partial style(s)
        src             ?: CssComplexValueOf<CssSimpleLiteralValue|`url(${string})`>
        
        
        
        // additional optional props:
        unicodeRange    ?: CssComplexValueOf<CssSimpleLiteralValue>
        
        ascentOverride  ?: CssComplexSingleValueOf<CssSimpleLiteralValue|'normal'>
        descentOverride ?: CssComplexSingleValueOf<CssSimpleLiteralValue|'normal'>
        lineGapOverride ?: CssComplexSingleValueOf<CssSimpleLiteralValue|'normal'>
    }>
export type CssShorthandFontFaceProps = CssKnownPropsOf<'fontVariant', true>
export type CssFontFaceProps =
    & CssLonghandFontFaceProps
    & CssShorthandFontFaceProps
//#endregion css special properties

export type CssKnownStandardLonghandProps  =
    & Omit<CssKnownPropsOf<keyof StandardLonghandProperties , true>, keyof CssLonghandFontFaceProps>
    & CssLonghandFontFaceProps  // some_props like boxShadow, filter are comma/space separated values
export type CssKnownStandardShorthandProps =
    & Omit<CssKnownPropsOf<keyof StandardShorthandProperties, true>, keyof CssShorthandFontFaceProps>
    & CssShorthandFontFaceProps // all_props are comma/space separated values
export type CssKnownStandardProps          = CssKnownStandardLonghandProps & CssKnownStandardShorthandProps

export type CssKnownVendorLonghandProps    = CssKnownPropsOf<keyof VendorLonghandProperties , true> // some_props are comma/space separated values
export type CssKnownVendorShorthandProps   = CssKnownPropsOf<keyof VendorShorthandProperties, true> // all_props  are comma/space separated values
export type CssKnownVendorProps            = CssKnownVendorLonghandProps & CssKnownVendorShorthandProps

export type CssKnownObsoleteProps          = CssKnownPropsOf<keyof ObsoleteProperties, true>

export type CssKnownSvgProps               =
    & Omit<CssKnownPropsOf<keyof SvgProperties, true>, keyof CssFontFaceProps>
    & CssFontFaceProps

export type CssKnownProps =
    & CssKnownStandardProps
    & CssKnownVendorProps
    & CssKnownObsoleteProps
    & CssKnownSvgProps
//#endregion css known (standard) properties



//#region cssfn properties
export type CssProps                   = CssCustomProps & CssKnownProps

export type CssRuleData                = readonly [CssRawSelector|CssFinalSelector, CssStyleCollection]
export type CssRule = { // do not use Record<symbol, CssRuleData> => doesn't support circular ref
    [name: symbol] : CssRuleData
}
export type CssRuleCollection          = ProductOrFactoryOrDeepArray<OptionalOrBoolean<CssRule>>

export type CssStyle                   = CssProps & CssRule
export type CssStyleCollection         = ProductOrFactoryOrDeepArray<OptionalOrBoolean<CssStyle>>
export type CssFontFaceStyleCollection = ProductOrFactoryOrDeepArray<OptionalOrBoolean<CssFontFaceProps>>

export type CssKeyframes               = Dictionary<CssStyleCollection>
export type CssKeyframesRule = CssRule & {
    [name: symbol] : readonly [`@keyframes ${string}`, CssRuleCollection]
}



export type CssSelector           = (string & {})
export type CssSelectorCollection = SingleOrDeepArray<OptionalOrBoolean<CssSelector>>

export interface CssSelectorOptions {
    performGrouping      ?: boolean
    
    specificityWeight    ?: number|null
    minSpecificityWeight ?: number|null
    maxSpecificityWeight ?: number|null
}

export type CssRawSelector        = readonly [CssSelectorCollection, CssSelectorOptions|undefined]
export type CssFinalSelector      = CssSelector & {}



export type CssClassName = string & {} // not a really string: [A-Z_a-z-]+



export type CssScopeName    = string & {} // not a really string: [A-Z_a-z-]+
export type CssScopeOptions = Omit<CssSelectorOptions, 'performGrouping'>
export type CssScopeEntry
    <TCssScopeName extends CssScopeName> = readonly [TCssScopeName, CssStyleCollection, CssScopeOptions|undefined]
export type CssScopeList
    <TCssScopeName extends CssScopeName> = CssScopeEntry<TCssScopeName>[]
export type CssScopeMap<TCssScopeName extends CssScopeName> = {
    [name in TCssScopeName] : CssClassName
}
//#endregion cssfn properties
