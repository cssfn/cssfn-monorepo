// cssfn:
import type {
    Dictionary,
}                           from '@cssfn/types'       // cssfn's types

// others libs:
import type {
    Properties,
    StandardLonghandProperties,
    StandardShorthandProperties,
    VendorLonghandProperties,
    VendorShorthandProperties,
    ObsoleteProperties,
    SvgProperties,
}                           from 'csstype'       // ts defs support for cssfn



// types:

export type CssSimpleValue                  = (string & {}) | (number & {})

//#region complex values
export type CssComplexBaseValueOf<TValue>   =
    | TValue                                               // final_value
    | CustomCssRef                                         // css_variable
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
//#endregion complex values



//#region custom css properties
export type CustomCssName         = `--${string}`

export type CustomCssSingleRef    = `var(${CustomCssName})`
export type CustomCssRef          = CustomCssSingleRef|`var(${CustomCssName},${CustomCssSingleRef})`|`var(${CustomCssName},${string})`
export type CustomCssKeyframesRef = (string & {})


export type CustomCssValue        = CssComplexValueOf<CssSimpleValue>

export interface CustomCssProps {
    [name: CustomCssName] : CustomCssValue
}
//#endregion custom css properties



//#region standard css properties
export type CssLength   = (string & {}) | 0
export type CssDuration = (string & {})

export type BasicKnownCssProps<TLength = CssLength, TDuration = CssDuration> = Properties<TLength, TDuration>

export type KnownCssName         = keyof BasicKnownCssProps
export type KnownCssValueOf
    <TName extends KnownCssName> = Exclude<BasicKnownCssProps[TName], undefined|null>



export type KnownCssPropsOf
    <TName extends KnownCssName> = {
    [name in TName ] ?: KnownCssValueOf<name>
}
export type KnownStandardLonghandCssProps  = KnownCssPropsOf<keyof StandardLonghandProperties>
export type KnownStandardShorthandCssProps = KnownCssPropsOf<keyof StandardShorthandProperties>
export type KnownStandardCssProps          = KnownStandardLonghandCssProps & KnownStandardShorthandCssProps

export type KnownVendorLonghandCssProps    = KnownCssPropsOf<keyof VendorLonghandProperties>
export type KnownVendorShorthandCssProps   = KnownCssPropsOf<keyof VendorShorthandProperties>
export type KnownVendorCssProps            = KnownVendorLonghandCssProps & KnownVendorShorthandCssProps

export type KnownObsoleteCssProps          = KnownCssPropsOf<keyof ObsoleteProperties>

export type KnownSvgCssProps               = KnownCssPropsOf<keyof SvgProperties>

export type KnownCssProps                  = KnownStandardCssProps & KnownVendorCssProps & KnownObsoleteCssProps & KnownSvgCssProps
//#endregion standard css properties



//#region cssfn properties
export type CssKeyframes  = Dictionary<{}> // TODO: <Style>
export type GeneralCssValue = (string & {}) | (number & {}) | CssKeyframes
export type CssValue      = undefined | null | GeneralCssValue | GeneralCssValue[] | (GeneralCssValue|GeneralCssValue[]|'!important')[]

export interface CssProps extends KnownCssProps, CustomCssProps {
}
//#endregion cssfn properties
