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
    // css custom properties:
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



const encodeValue = ([key, value] : [string, CssProps[keyof CssProps]]): readonly [keyof EncodedCssStyle, EncodedCssStyle[keyof EncodedCssStyle]] => {
    if (typeof(value) === 'object') return [key as keyof CssProps, `${value}`];
    return [key as keyof CssProps, value];
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
        .map(encodeValue)
    ) as EncodedCssStyle;
    
    
    
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
    if (Array.isArray(styles)) {
        return (
            ((styles as any).flat(Infinity) as ProductOrFactory<OptionalOrBoolean<CssStyle>>[])
            .map(encodeStyle)
        );
    } // if
    
    
    
    return encodeStyle(styles);
}