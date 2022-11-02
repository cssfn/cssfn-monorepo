// cssfn:
import type {
    OptionalOrBoolean,
    ProductOrFactory,
}                           from '@cssfn/types'
import type {
    // css values:
    CssSimpleValue,
    CssComplexBaseValueOf,
    
    
    
    // css custom properties:
    CssCustomValue,
    
    
    
    // cssfn properties:
    CssProps,
    
    CssRuleData,
    
    CssStyle,
    CssStyleCollection,
}                           from '@cssfn/css-types'

// internals:
import type {
    // css values:
    EncodedCssSimpleValue,
    
    
    
    // css custom properties:
    EncodedCssCustomValue,
    
    
    
    // cssfn properties:
    EncodedCssProps,
    EncodedCssRuleData,
    EncodedCssStyle,
    EncodedCssStyleCollection,
}                           from './cssfn-encoded-types.js'



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
const encodeProp = ([key, value] : readonly [string, CssCustomValue|undefined|null]): readonly [keyof EncodedCssProps, EncodedCssCustomValue|undefined|null] => {
    return [key as keyof CssProps, encodePropValue(value)];
}
const encodeRuleData = (ruleData: CssRuleData): EncodedCssRuleData => {
    const [selector, styles] = ruleData;
    return [
        selector,
        encodeStyles(styles)
    ];
}
export function encodeNestedRule(this: CssStyle, symbolProp: symbol): EncodedCssRuleData {
    return encodeRuleData(this[symbolProp]);
}
export const encodeStyle = (style: ProductOrFactory<OptionalOrBoolean<CssStyle>>): OptionalOrBoolean<EncodedCssStyle> => {
    const styleValue = (typeof(style) === 'function') ? style() : style;
    if (!styleValue || (styleValue === true)) return undefined; // boolean|null|undefined => ignore
    
    
    
    const encodedStyle = Object.fromEntries(
        Object.entries(styleValue) // take all string keys (excluding symbol keys)
        .map(encodeProp)
    ) as EncodedCssProps as EncodedCssStyle;
    
    
    
    const symbolProps = Object.getOwnPropertySymbols(styleValue); // take all symbol keys
    if (symbolProps.length) {
        const nestedRules = (
            symbolProps
            .map(encodeNestedRule.bind(styleValue))
        );
        encodedStyle[''] = nestedRules; // an empty string key is a special property for storing (nested) rules
    } // if
    
    
    
    return encodedStyle;
}
function* unwrapStyles(styles: Extract<CssStyleCollection, any[]>): Generator<EncodedCssStyle> {
    for (const style of styles) {
        if (!style || (style === true)) continue; // falsy style(s) => ignore
        
        
        
        if (!Array.isArray(style)) {
            const encodedStyle = encodeStyle(style);
            if (!encodedStyle || (encodedStyle === true)) continue; // falsy style(s) => ignore
            yield encodedStyle;
            continue;
        } // if
        
        
        
        for (const subStyle of unwrapStyles(style)) {
            yield subStyle;
        } // for
    } // for
}
export const encodeStyles = (styles: CssStyleCollection): EncodedCssStyleCollection => {
    if (!Array.isArray(styles)) {
        return encodeStyle(styles);
    } // if
    
    
    
    return Array.from(unwrapStyles(styles));
}
