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



//#region custom css properties
export type CustomCssName         = `--${string}`

export type CustomCssSingleRef    = `var(${CustomCssName})`
export type CustomCssRef          = CustomCssSingleRef|`var(${CustomCssName},${CustomCssSingleRef})`|`var(${CustomCssName},${string})`
export type CustomCssKeyframesRef = (string & {})

export type GeneralCssValue       = (string & {}) | (number & {})
export type CustomCssValue        = GeneralCssValue|CustomCssRef | (GeneralCssValue|CustomCssRef)[] | ((GeneralCssValue|CustomCssRef)|(GeneralCssValue|CustomCssRef)[]|'!important')[]

export interface CustomCssProps {
    [name: CustomCssName] : CustomCssValue
}
//#endregion custom css properties



//#region cssfn properties
export type CssKeyframes  = Dictionary<{}> // TODO: <Style>
export type BasicCssValue = (string & {}) | (number & {}) | CssKeyframes
export type CssValue      = undefined | null | BasicCssValue | BasicCssValue[] | (BasicCssValue|BasicCssValue[]|'!important')[]

export interface CssProps extends KnownCssProps, CustomCssProps {
}
//#endregion cssfn properties
