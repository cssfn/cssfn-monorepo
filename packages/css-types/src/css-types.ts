// cssfn:
import type {
    OptionalOrBoolean,
    SingleOrDeepArray,
    ProductOrFactoryOrDeepArray,
    
    PartialNullish,
    
    MapOf,
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
export type CssCustomSimpleRef    = `var(${CssCustomName})` // single value
export type CssCustomRef          =
    | CssCustomSimpleRef                                    // single value
    | `var(${CssCustomName}, ${CssCustomSimpleRef})`        // with shallow fallback
 // | `var(${CssCustomName}, ${CssCustomRef})`              // with nested  fallback(s), can't circular
 // | `var(${CssCustomName}, ${string})`                    // use string for nested fallback(s), not ideal but works

export type CssCustomValue        = CssComplexValueOf<CssSimpleValue>

export type CssCustomProps = PartialNullish<{
    [name: CssCustomName     ] : CssCustomValue
    [name: CssCustomSimpleRef] : CssCustomValue
}>
export type CssCustomPropsMap = MapOf<CssCustomProps>
//#endregion css custom properties



//#region css known (standard) properties
export type CssLength   = (string & {}) | 0
export type CssDuration = (string & {})

export type CssKnownBaseProps<TLength = CssLength, TDuration = CssDuration> = Properties<TLength, TDuration>
type ShorthandProperties = PartialNullish<{
    /**
     * Alias of **`color`**.  
     * The **`color`** CSS property sets the foreground color value of an element's text and text decorations, and sets the `<currentcolor>` value. `currentcolor` may be used as an indirect value on _other_ properties and is the default for other color properties, such as `border-color`.
     *
     * **Syntax**: `<color>`
     *
     * **Initial value**: `canvastext`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **3** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/color
     */
    foreg       : CssKnownBaseProps['color']
    /**
     * Alias of **`background`**.  
     * The **`background`** shorthand CSS property sets all background style properties at once, such as color, image, origin and size, or repeat method.
     *
     * **Syntax**: `[ <bg-layer> , ]* <final-bg-layer>`
     *
     * | Chrome | Firefox | Safari |  Edge  |  IE   |
     * | :----: | :-----: | :----: | :----: | :---: |
     * | **1**  |  **1**  | **1**  | **12** | **4** |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/background
     */
    backg       : CssKnownBaseProps['background']
    /**
     * Alias of **`background-clip`**.  
     * The **`background-clip`** CSS property sets whether an element's background extends underneath its border box, padding box, or content box.
     *
     * **Syntax**: `<box>#`
     *
     * **Initial value**: `border-box`
     *
     * | Chrome | Firefox | Safari  |  Edge  |  IE   |
     * | :----: | :-----: | :-----: | :----: | :---: |
     * | **1**  |  **4**  | **14**  | **12** | **9** |
     * |        |         | 3 _-x-_ |        |       |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/background-clip
     */
    'backgClip' : CssKnownBaseProps['backgroundClip']
    
    /**
     * Alias of **`animation`**.  
     * The **`animation`** shorthand CSS property applies an animation between styles. It is a shorthand for `animation-name`, `animation-duration`, `animation-timing-function`, `animation-delay`, `animation-iteration-count`, `animation-direction`, `animation-fill-mode`, and `animation-play-state`.
     *
     * **Syntax**: `<single-animation>#`
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **43**  | **16**  |  **9**  | **12** | **10** |
     * | 3 _-x-_ | 5 _-x-_ | 4 _-x-_ |        |        |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/animation
     */
    anim        : CssKnownBaseProps['animation']
    /**
     * Alias of **`transform`**.  
     * The **`transform`** CSS property lets you rotate, scale, skew, or translate an element. It modifies the coordinate space of the CSS visual formatting model.
     *
     * **Syntax**: `none | <transform-list>`
     *
     * **Initial value**: `none`
     *
     * | Chrome  | Firefox |  Safari   |  Edge  |   IE    |
     * | :-----: | :-----: | :-------: | :----: | :-----: |
     * | **36**  | **16**  |   **9**   | **12** | **10**  |
     * | 1 _-x-_ |         | 3.1 _-x-_ |        | 9 _-x-_ |
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/transform
     */
    transf      : CssKnownBaseProps['transform']
    
    /**
     * Alias of **`column-gap`**.  
     * The **`column-gap`** CSS property sets the size of the gap (gutter) between an element's columns.
     *
     * **Syntax**: `normal | <length-percentage>`
     *
     * **Initial value**: `normal`
     *
     * ---
     *
     * _Supported in Flex Layout_
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **84** | **63**  | **14.1** | **84** | No  |
     *
     * ---
     *
     * _Supported in Grid Layout_
     *
     * |         Chrome         |        Firefox         |          Safari          |  Edge  | IE  |
     * | :--------------------: | :--------------------: | :----------------------: | :----: | :-: |
     * |         **66**         |         **61**         |          **12**          | **16** | No  |
     * | 57 _(grid-column-gap)_ | 52 _(grid-column-gap)_ | 10.1 _(grid-column-gap)_ |        |     |
     *
     * ---
     *
     * _Supported in Multi-column Layout_
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **50**  | **52**  | **10**  | **12** | **10** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |        |
     *
     * ---
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/column-gap
     */
    'gapX'      : CssKnownBaseProps['columnGap']
    /**
     * Alias of **`row-gap`**.  
     * The **`row-gap`** CSS property sets the size of the gap (gutter) between an element's grid rows.
     *
     * **Syntax**: `normal | <length-percentage>`
     *
     * **Initial value**: `normal`
     *
     * ---
     *
     * _Supported in Flex Layout_
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **84** | **63**  | **14.1** | **84** | No  |
     *
     * ---
     *
     * _Supported in Grid Layout_
     *
     * |       Chrome        |       Firefox       |        Safari         |  Edge  | IE  |
     * | :-----------------: | :-----------------: | :-------------------: | :----: | :-: |
     * |       **66**        |       **61**        |        **12**         | **16** | No  |
     * | 57 _(grid-row-gap)_ | 52 _(grid-row-gap)_ | 10.1 _(grid-row-gap)_ |        |     |
     *
     * ---
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/row-gap
     */
    'gapY'      : CssKnownBaseProps['rowGap']
    /**
     * Alias of **`column-gap`**.  
     * The **`column-gap`** CSS property sets the size of the gap (gutter) between an element's columns.
     *
     * **Syntax**: `normal | <length-percentage>`
     *
     * **Initial value**: `normal`
     *
     * ---
     *
     * _Supported in Flex Layout_
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **84** | **63**  | **14.1** | **84** | No  |
     *
     * ---
     *
     * _Supported in Grid Layout_
     *
     * |         Chrome         |        Firefox         |          Safari          |  Edge  | IE  |
     * | :--------------------: | :--------------------: | :----------------------: | :----: | :-: |
     * |         **66**         |         **61**         |          **12**          | **16** | No  |
     * | 57 _(grid-column-gap)_ | 52 _(grid-column-gap)_ | 10.1 _(grid-column-gap)_ |        |     |
     *
     * ---
     *
     * _Supported in Multi-column Layout_
     *
     * | Chrome  | Firefox | Safari  |  Edge  |   IE   |
     * | :-----: | :-----: | :-----: | :----: | :----: |
     * | **50**  | **52**  | **10**  | **12** | **10** |
     * | 1 _-x-_ |         | 3 _-x-_ |        |        |
     *
     * ---
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/column-gap
     */
    'gapInline' : CssKnownBaseProps['columnGap']
    /**
     * Alias of **`row-gap`**.  
     * The **`row-gap`** CSS property sets the size of the gap (gutter) between an element's grid rows.
     *
     * **Syntax**: `normal | <length-percentage>`
     *
     * **Initial value**: `normal`
     *
     * ---
     *
     * _Supported in Flex Layout_
     *
     * | Chrome | Firefox |  Safari  |  Edge  | IE  |
     * | :----: | :-----: | :------: | :----: | :-: |
     * | **84** | **63**  | **14.1** | **84** | No  |
     *
     * ---
     *
     * _Supported in Grid Layout_
     *
     * |       Chrome        |       Firefox       |        Safari         |  Edge  | IE  |
     * | :-----------------: | :-----------------: | :-------------------: | :----: | :-: |
     * |       **66**        |       **61**        |        **12**         | **16** | No  |
     * | 57 _(grid-row-gap)_ | 52 _(grid-row-gap)_ | 10.1 _(grid-row-gap)_ |        |     |
     *
     * ---
     *
     * @see https://developer.mozilla.org/docs/Web/CSS/row-gap
     */
    'gapBlock'  : CssKnownBaseProps['rowGap']
}>
export type CssKnownBaseExProps  = CssKnownBaseProps & ShorthandProperties

export type CssKnownName         = keyof   CssKnownBaseExProps
export type CssKnownValueOf
    <TName extends CssKnownName> = Exclude<CssKnownBaseExProps[TName], undefined|null>



export type CssKnownPropsOf<TName extends CssKnownName, multiValue extends boolean = false> = PartialNullish<Pick<{
    [name in keyof CssKnownBaseExProps] ?: multiValue extends false ? CssComplexSingleValueOf<CssKnownValueOf<name>|CssCustomKeyframesRef> : CssComplexValueOf<CssKnownValueOf<name>|CssCustomKeyframesRef>
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
    
    & PartialNullish<{
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
    & Omit<CssKnownPropsOf<keyof StandardLonghandProperties , true>, keyof CssLonghandFontFaceProps>  // some_props like boxShadow, filter are comma/space separated values
    & CssLonghandFontFaceProps
export type CssKnownStandardShorthandProps =
    & Omit<CssKnownPropsOf<keyof StandardShorthandProperties, true>, keyof CssShorthandFontFaceProps> // all_props are comma/space separated values
    & CssShorthandFontFaceProps
export type CssKnownStandardProps          = CssKnownStandardLonghandProps & CssKnownStandardShorthandProps

export type CssKnownShorthandProps         = CssKnownPropsOf<keyof ShorthandProperties , true> // some_props are comma/space separated values

export type CssKnownVendorLonghandProps    = CssKnownPropsOf<keyof VendorLonghandProperties , true> // some_props are comma/space separated values
export type CssKnownVendorShorthandProps   = CssKnownPropsOf<keyof VendorShorthandProperties, true> // all_props  are comma/space separated values
export type CssKnownVendorProps            = CssKnownVendorLonghandProps & CssKnownVendorShorthandProps

export type CssKnownObsoleteProps          = CssKnownPropsOf<keyof ObsoleteProperties, true>

export type CssKnownSvgProps               =
    & Omit<CssKnownPropsOf<keyof SvgProperties, true>, keyof CssFontFaceProps>
    & CssFontFaceProps

export type CssKnownProps =
    & CssKnownStandardProps
    & CssKnownShorthandProps
    & CssKnownVendorProps
    & CssKnownObsoleteProps
    & CssKnownSvgProps
//#endregion css known (standard) properties



//#region cssfn properties
export type CssProps                   = CssCustomProps    & CssKnownProps
export type CssPropsMap                = CssCustomPropsMap & MapOf<CssKnownProps>

export type CssRuleData                = readonly [CssRawSelector|CssFinalSelector, CssStyleCollection]
export type CssFinalRuleData           = readonly [               CssFinalSelector, CssFinalStyleMap  ]
export type CssRule                    = { // do not use Record<symbol, CssRuleData> => doesn't support circular ref
    [name: symbol] : CssRuleData
}
export type CssFinalRule               = {
    [name: symbol] : CssFinalRuleData
}
export type CssRuleMap                 = MapOf<CssRule>
export type CssFinalRuleMap            = MapOf<CssFinalRule>
export type CssRuleCollection          = ProductOrFactoryOrDeepArray<OptionalOrBoolean<CssRule>>

export type CssStyle                   = CssProps    & CssRule
export type CssStyleMap                = CssPropsMap & CssRuleMap & CssFinalRuleMap
export type CssFinalStyleMap           = CssPropsMap & CssFinalRuleMap
export type CssStyleCollection         = ProductOrFactoryOrDeepArray<OptionalOrBoolean<CssStyle>>
export type CssFontFaceStyleCollection = ProductOrFactoryOrDeepArray<OptionalOrBoolean<CssFontFaceProps>>

export interface CssCustomKeyframesRef {
    value      : string|null
    toString() : string
}
export type CssKeyframes               = {
    [name: string] : CssStyleCollection
}
export type CssKeyframesMap            = MapOf<CssKeyframes>
export type CssKeyframesRule           = CssRule & {
    [name: symbol] : readonly [`@keyframes ${string}`, CssRuleCollection]
}
export type CssKeyframesRuleMap        = MapOf<CssKeyframesRule>



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
