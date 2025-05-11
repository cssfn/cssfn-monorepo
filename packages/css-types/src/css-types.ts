// Cssfn:
import {
    // Optionals:
    type OptionalOrBoolean,
    
    
    
    // Arrays:
    type MaybeDeepArray,
    
    
    
    // Lazies:
    type MaybeLazyDeepArray,
    
    
    
    // Dictionaries/maps:
    type PartialNullish,
    type MapOf,
}                           from '@cssfn/types'

// Others libs:
import {
    type Properties,
    type StandardLonghandProperties,
    type StandardShorthandProperties,
    type VendorLonghandProperties,
    type VendorShorthandProperties,
    type ObsoleteProperties,
    type SvgProperties,
}                           from 'csstype'



//#region CSS values
//#region Simple values
export type CssSimpleNumericValue           = (number & {})
export type CssSimpleLiteralValue           = (string & {})
export type CssSimpleValue                  =
    | CssSimpleNumericValue
    | CssSimpleLiteralValue
    | CssCustomKeyframesRef
//#endregion Simple values

//#region Generic complex values
export type CssComplexBaseValueOf<TValue>   =
    | TValue                                               // Final_value
    | CssCustomRef                                         // CSS_variable
export type CssComplexSingleValueOf<TValue> =
    | CssComplexBaseValueOf<TValue>                        // Single_value
    | [CssComplexBaseValueOf<TValue>, '!important']        // Single_value with !important
export type CssComplexMultiValueOf<TValue>  =
    | CssComplexBaseValueOf<TValue>[]                      // Comma_separated_values
    | CssComplexBaseValueOf<TValue>[][]                    // Space_separated_values
    | [...CssComplexBaseValueOf<TValue>[]  , '!important'] // Comma_separated_values with !important
    | [...CssComplexBaseValueOf<TValue>[][], '!important'] // Space_separated_values with !important
export type CssComplexValueOf<TValue>       =
    | CssComplexSingleValueOf<TValue>
    | CssComplexMultiValueOf<TValue>
//#endregion Generic complex values
//#endregion CSS values



//#region CSS custom properties
// Declaration:
export type CssCustomName         = `--${string}`

// Values:
export type CssCustomSimpleRef    = `var(${CssCustomName})` // Single value
export type CssCustomRef          =
    | CssCustomSimpleRef                                    // Single value
    | `var(${CssCustomName}, ${CssCustomSimpleRef})`        // With shallow fallback
 // | `var(${CssCustomName}, ${CssCustomRef})`              // With nested  fallback(s), can't circular
 // | `var(${CssCustomName}, ${string})`                    // Use string for nested fallback(s), not ideal but works

export type CssCustomValue        = CssComplexValueOf<CssSimpleValue>

export type CssCustomProps = PartialNullish<{
    [name: CssCustomName     ] : CssCustomValue
    [name: CssCustomSimpleRef] : CssCustomValue
}>
export type CssCustomPropsMap = MapOf<CssCustomProps>
//#endregion CSS custom properties



//#region CSS known (standard) properties
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
    foreg      : CssKnownBaseProps['color']
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
    foreground : CssKnownBaseProps['color']
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
    backg      : CssKnownBaseProps['background']
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
    backgClip  : CssKnownBaseProps['backgroundClip']
    
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
    anim       : CssKnownBaseProps['animation']
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
    transf     : CssKnownBaseProps['transform']
    
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
    gapX       : CssKnownBaseProps['columnGap']
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
    gapY       : CssKnownBaseProps['rowGap']
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
    gapInline  : CssKnownBaseProps['columnGap']
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
    gapBlock   : CssKnownBaseProps['rowGap']
}>
export type CssKnownBaseExProps  = CssKnownBaseProps & ShorthandProperties

export type CssKnownName         = keyof   CssKnownBaseExProps
export type CssKnownValueOf
    <TName extends CssKnownName> = Exclude<CssKnownBaseExProps[TName], undefined|null>



export type CssKnownPropsOf<TName extends CssKnownName, multiValue extends boolean = false> = PartialNullish<Pick<{
    [name in keyof CssKnownBaseExProps] ?: multiValue extends false ? CssComplexSingleValueOf<CssKnownValueOf<name>|CssCustomKeyframesRef> : CssComplexValueOf<CssKnownValueOf<name>|CssCustomKeyframesRef>
}, TName>>

//#region CSS special properties
export type CssLonghandFontFaceProps =
    // Required props:
    // Forced to optional because it may spreaded in partial style(s).
    // & Required<CssKnownPropsOf<'fontFamily', true>>
    & CssKnownPropsOf<'fontFamily', true>
    
    // Longhand single-value props:
    & CssKnownPropsOf<
        | 'fontVariantCaps'
        | 'fontVariantLigatures'
        | 'fontVariantPosition'
        
        | 'fontStretch'
        | 'fontWeight'
    , false>
    
    // Longhand multi-value props:
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
        // Additional required props:
        // Forced to optional ( ?: ) because it may spreaded in partial style(s).
        src             ?: CssComplexValueOf<CssSimpleLiteralValue|`url(${string})`>
        
        
        
        // Additional optional props:
        unicodeRange    ?: CssComplexValueOf<CssSimpleLiteralValue>
        
        ascentOverride  ?: CssComplexSingleValueOf<CssSimpleLiteralValue|'normal'>
        descentOverride ?: CssComplexSingleValueOf<CssSimpleLiteralValue|'normal'>
        lineGapOverride ?: CssComplexSingleValueOf<CssSimpleLiteralValue|'normal'>
    }>
export type CssShorthandFontFaceProps = CssKnownPropsOf<'fontVariant', true>
export type CssFontFaceProps =
    & CssLonghandFontFaceProps
    & CssShorthandFontFaceProps

export type CssPropertyProps = PartialNullish<{
    syntax       :
        |'"<length>"'
        |'"<number>"'
        |'"<percentage>"'
        |'"<length-percentage>"'
        |'"<color>"'
        |'"<image>"'
        |'"<url>"'
        |'"<integer>"'
        |'"<angle>"'
        |'"<time>"'
        |'"<resolution>"'
        |'"<transform-function>"'
        |'"<custom-ident>"'
        |'"<transform-list>"'
        |'"*"'
        |(string & {})
    
    inherits     : boolean
    initialValue : string
}>
//#endregion CSS special properties

export type CssKnownStandardLonghandProps  =
    & Omit<CssKnownPropsOf<keyof StandardLonghandProperties , true>, keyof CssLonghandFontFaceProps>  // Some_props like boxShadow, filter are comma/space separated values.
    & CssLonghandFontFaceProps
export type CssKnownStandardShorthandProps =
    & Omit<CssKnownPropsOf<keyof StandardShorthandProperties, true>, keyof CssShorthandFontFaceProps> // All_props are comma/space separated values.
    & CssShorthandFontFaceProps
export type CssKnownStandardProps          = CssKnownStandardLonghandProps & CssKnownStandardShorthandProps

export type CssKnownShorthandProps         = CssKnownPropsOf<keyof ShorthandProperties , true> // Some_props are comma/space separated values.

export type CssKnownVendorLonghandProps    = CssKnownPropsOf<keyof VendorLonghandProperties , true> // Some_props are comma/space separated values.
export type CssKnownVendorShorthandProps   = CssKnownPropsOf<keyof VendorShorthandProperties, true> // All_props  are comma/space separated values.
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
//#endregion CSS known (standard) properties



//#region Cssfn properties
export type CssProps                   = CssCustomProps    & CssKnownProps
export type CssPropsMap                = CssCustomPropsMap & MapOf<CssKnownProps>

export type CssRuleData                = readonly [undefined|CssRawSelector|CssFinalSelector, CssStyleCollection]
export type CssFinalRuleData           = readonly [                         CssFinalSelector, CssFinalStyleMap  ]
export type CssRule                    = { // Do not use Record<symbol, CssRuleData> => doesn't support circular ref.
    [name: symbol] : CssRuleData
}
export type CssFinalRule               = {
    [name: symbol] : CssFinalRuleData
}
export type CssRuleMap                 = MapOf<CssRule>
export type CssFinalRuleMap            = MapOf<CssFinalRule>
export type CssRuleCollection          = MaybeLazyDeepArray<OptionalOrBoolean<CssRule>>

export type CssStyle                   = CssProps & CssRule
export type CssFinalStyle              = CssProps & CssFinalRule

export type CssUnionKey                =
    | keyof CssCustomProps
    | keyof CssKnownProps
    | keyof CssRule

export type CssUnionValue              =
    | CssCustomProps[keyof CssCustomProps]
    | CssKnownProps[keyof CssKnownProps]
    | CssRule[keyof CssRule]

export type CssUnionFinalValue         =
    | CssCustomProps[keyof CssCustomProps]
    | CssKnownProps[keyof CssKnownProps]
    | CssFinalRule[keyof CssFinalRule]

export type CssStyleMapExcludeMembers  =
    | symbol
    |'entries'
    |'keys'
    |'values'
    
    |'delete'
    // |'forEach' // Conflict with vanilla Map!
    |'get'
    |'has'
    |'set'

export interface CssStyleMapFilteredKeys
    extends
        Omit<Map<keyof CssStyle, CssStyle[keyof CssStyle]>, CssStyleMapExcludeMembers>
{
    // Filtered iterators:
    get ruleKeys()      : Array<keyof CssRule>
    get propKeys()      : Array<keyof CssCustomProps|keyof CssKnownProps>
    get hasRuleKeys()   : boolean
    get hasPropKeys()   : boolean
    
    
    
    // Miscs:
    readonly [Symbol.toStringTag]: string
}
export interface CssStyleMapOverloads
    extends
        Omit<Map<keyof CssStyle, CssStyle[keyof CssStyle]>, CssStyleMapExcludeMembers>
{
    // Filtered iterators:
    get rules() : Array<CssRuleData>
    
    
    
    // Iterators:
    [Symbol.iterator]() : MapIterator<[CssUnionKey, CssUnionValue]>
    entries()           : MapIterator<[CssUnionKey, CssUnionValue]>
    get keysAsArray()   : Array<CssUnionKey>
    keys()              : MapIterator<CssUnionKey>
    values()            : MapIterator<CssUnionValue>
    
    
    
    // Deletes:
    delete(key: keyof CssCustomProps): boolean
    delete(key: keyof CssKnownProps ): boolean
    delete(key: keyof CssRule       ): boolean
    
    
    
    // forEach:
    // Conflict with vanilla Map!
    // forEach(callbackfn: ((value: CssUnionValue, key: CssUnionKey, map: CssStyleMap) => void), thisArg?: any): void
    
    
    
    // Gets:
    get(key: keyof CssCustomProps): CssCustomProps[keyof CssCustomProps] | undefined
    get(key: keyof CssKnownProps ): CssKnownProps[keyof CssKnownProps]   | undefined
    get(key: keyof CssRule       ): CssRule[keyof CssRule]               | undefined
    
    
    
    // Hases:
    has(key: keyof CssCustomProps): boolean
    has(key: keyof CssKnownProps ): boolean
    has(key: keyof CssRule       ): boolean
    
    
    
    // Sets:
    set(key: keyof CssCustomProps | keyof CssKnownProps, value: CssCustomProps[keyof CssCustomProps] | CssKnownProps[keyof CssKnownProps]): this
    set(key: keyof CssCustomProps, value: CssCustomProps[keyof CssCustomProps]): this
    set(key: keyof CssKnownProps , value: CssKnownProps[keyof CssKnownProps]  ): this
    set(key: keyof CssRule       , value: CssRule[keyof CssRule]              ): this
}
export interface CssFinalStyleMapOverloads
    extends
        Omit<Map<keyof CssFinalStyle, CssFinalStyle[keyof CssFinalStyle]>, CssStyleMapExcludeMembers>
{
    // Filtered iterators:
    get rules() : Array<CssFinalRuleData>
    
    
    
    // Iterators:
    [Symbol.iterator]() : MapIterator<[CssUnionKey, CssUnionFinalValue]>
    entries()           : MapIterator<[CssUnionKey, CssUnionFinalValue]>
    get keysAsArray()   : Array<CssUnionKey>
    keys()              : MapIterator<CssUnionKey>
    values()            : MapIterator<CssUnionFinalValue>
    
    
    
    // Deletes:
    delete(key: keyof CssCustomProps): boolean
    delete(key: keyof CssKnownProps ): boolean
    delete(key: keyof CssFinalRule  ): boolean
    
    
    
    // forEach:
    // Conflict with vanilla Map!
    // forEach(callbackfn: ((value: CssUnionFinalValue, key: CssUnionKey, map: CssStyleMap) => void), thisArg?: any): void
    
    
    
    // Gets:
    get(key: keyof CssCustomProps): CssCustomProps[keyof CssCustomProps] | undefined
    get(key: keyof CssKnownProps ): CssKnownProps[keyof CssKnownProps]   | undefined
    get(key: keyof CssFinalRule  ): CssFinalRule[keyof CssFinalRule]     | undefined
    
    
    
    // Hases:
    has(key: keyof CssCustomProps): boolean
    has(key: keyof CssKnownProps ): boolean
    has(key: keyof CssFinalRule  ): boolean
    
    
    
    // Sets:
    set(key: keyof CssCustomProps | keyof CssKnownProps, value: CssCustomProps[keyof CssCustomProps] | CssKnownProps[keyof CssKnownProps]): this
    set(key: keyof CssCustomProps, value: CssCustomProps[keyof CssCustomProps]): this
    set(key: keyof CssKnownProps , value: CssKnownProps[keyof CssKnownProps]  ): this
    set(key: keyof CssFinalRule  , value: CssFinalRule[keyof CssFinalRule]    ): this
}
export type CssStyleMap                = CssStyleMapFilteredKeys & CssStyleMapOverloads      & Omit<CssPropsMap & CssRuleMap & CssFinalRuleMap, CssStyleMapExcludeMembers>
export type CssFinalStyleMap           = CssStyleMapFilteredKeys & CssFinalStyleMapOverloads & Omit<CssPropsMap              & CssFinalRuleMap, CssStyleMapExcludeMembers>
export type CssStyleCollection         = MaybeLazyDeepArray<OptionalOrBoolean<CssStyle>>
export type CssFontFaceStyleCollection = MaybeLazyDeepArray<OptionalOrBoolean<CssFontFaceProps>>
export type CssPropertyStyleCollection = MaybeLazyDeepArray<OptionalOrBoolean<CssPropertyProps>>

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
export type CssSelectorCollection = MaybeDeepArray<OptionalOrBoolean<CssSelector>>

export interface CssSelectorOptions {
    performGrouping      ?: boolean
    
    specificityWeight    ?: number|null
    minSpecificityWeight ?: number|null
    maxSpecificityWeight ?: number|null
}

export type CssRawSelector        = readonly [CssSelectorCollection, CssSelectorOptions|undefined]
export type CssFinalSelector      = CssSelector & {}



export type CssClassName = string & {} // Not a really string: [A-Z_a-z-]+



export type CssScopeName    = string & {} // Not a really string: [A-Z_a-z-]+
export type CssScopeOptions = Omit<CssSelectorOptions, 'performGrouping'>
export type CssScopeEntry
    <TCssScopeName extends CssScopeName> = readonly [TCssScopeName, CssStyleCollection, CssScopeOptions|undefined]
export type CssScopeList
    <TCssScopeName extends CssScopeName> = CssScopeEntry<TCssScopeName>[]
export type CssScopeMap<TCssScopeName extends CssScopeName> = {
    [name in TCssScopeName] : CssClassName
}
//#endregion Cssfn properties
