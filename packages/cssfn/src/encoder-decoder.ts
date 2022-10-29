// cssfn:
import type {
    OptionalOrBoolean,
    SingleOrDeepArray,
    ProductOrFactory,
    ProductOrFactoryOrDeepArray,
    
    PartialNullish,
    
    MapOf,
}                           from '@cssfn/types'
import type {
    // css values:
    CssSimpleValue,
    CssComplexBaseValueOf,
    
    
    
    // css custom properties:
    CssCustomValue,
    CssCustomProps,
    
    
    
    // css known (standard) properties:
    CssKnownProps,
    
    
    
    // cssfn properties:
    CssProps,
    CssPropsMap,
    
    CssRuleData,
    CssRule,
    CssRuleMap,
    CssFinalRuleMap,
    
    CssStyle,
    CssStyleMap,
    CssFinalStyleMap,
    CssStyleCollection,
    
    CssSelector,
    
    CssFinalSelector,
}                           from '@cssfn/css-types'

// internals:
import type {
    // css values:
    EncodedCssSimpleValue,
    
    
    
    // css custom properties:
    EncodedCssCustomValue,
    EncodedCssCustomProps,
    
    
    
    // css known (standard) properties:
    EncodedCssKnownProps,
    
    
    
    // cssfn properties:
    EncodedCssProps,
    EncodedCssRuleData,
    EncodedCssRule,
    EncodedCssStyle,
    EncodedCssStyleCollection,
}                           from './encoded-types.js'



const encodePropSimpleValue = (propValue: CssComplexBaseValueOf<CssSimpleValue>): CssComplexBaseValueOf<EncodedCssSimpleValue> => {
    if (typeof(propValue) === 'number') return propValue; // CssSimpleNumericValue              => number
    if (typeof(propValue) === 'string') return propValue; // CssSimpleLiteralValue|CssCustomRef => string
    return propValue.toString();                          // CssCustomKeyframesRef              => .toString()
}
const encodePropSubValue = (propSubValue: Extract<CssCustomValue, any[]>[number]): Extract<EncodedCssCustomValue, any[]>[number] => {
    if (!Array.isArray(propSubValue)) return encodePropSimpleValue(propSubValue);
    
    
    
    return (
        propSubValue
        .map(encodePropSimpleValue)
    );
}
const encodePropValue = (propValue: CssCustomValue|undefined|null): EncodedCssCustomValue|undefined|null => {
    if ((propValue === undefined) || (propValue === null)) return propValue;
    
    
    
    if (!Array.isArray(propValue)) return encodePropSimpleValue(propValue); // CssComplexBaseValueOf<CssSimpleValue>
    
    
    
    return (
        propValue
        .map(encodePropSubValue)
    ) as EncodedCssCustomValue;
}
const encodeProp = ([key, value] : [string, CssCustomValue|undefined|null]): readonly [keyof EncodedCssStyle, EncodedCssCustomValue|undefined|null] => {
    return [key as keyof CssProps, encodePropValue(value)];
}
const encodeRuleData = (ruleData: CssRuleData): EncodedCssRuleData => {
    const [selector, styles] = ruleData;
    return [
        selector,
        encodeStyles(styles)
    ];
}
export const encodeStyle = (style: ProductOrFactory<OptionalOrBoolean<CssStyle>>): OptionalOrBoolean<EncodedCssStyle> => {
    const styleValue = (typeof(style) === 'function') ? style() : style;
    if (!styleValue || (styleValue === true)) return styleValue; // boolean|null|undefined => ignore
    
    
    
    const encodedStyle = Object.fromEntries(
        Object.entries(styleValue) // take all string keys (excluding symbol keys)
        .map(encodeProp)
    ) as EncodedCssProps as EncodedCssStyle;
    
    
    
    const symbolProps = Object.getOwnPropertySymbols(styleValue);
    if (symbolProps.length) {
        encodedStyle[''] = (
            symbolProps
            .map((symbolProp) => encodeRuleData(styleValue[symbolProp]))
        );
    } // if
    
    
    
    return encodedStyle;
}
export const encodeStyles = (styles: CssStyleCollection): EncodedCssStyleCollection => {
    if (!Array.isArray(styles)) {
        return encodeStyle(styles);
    } // if
    
    
    
    return (
        ((styles as any).flat(Infinity) as ProductOrFactory<OptionalOrBoolean<CssStyle>>[])
        .map(encodeStyle)
    );
}