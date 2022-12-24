// cssfn:
import type {
    OptionalOrBoolean,
    
    DeepArray,
    
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
    // EncodedCssProps,
    EncodedCssRuleData,
    EncodedCssStyle,
    EncodedCssStyleCollection,
}                           from './cssfn-encoded-types.js'



// types:
type TransferablePrimitive = undefined|null|string|number
type TransferableDeepArray = DeepArray<TransferablePrimitive>



const isTransferablePrimitive = <TPropValue extends CssCustomValue|undefined|null>(propValue : TPropValue): propValue is (TPropValue & TransferablePrimitive) => {
    if (propValue === undefined) return true; // undefined => *transferable*
    if (propValue === null     ) return true; // null      => *transferable*
    switch (typeof(propValue)) {
        case 'string':                        // string    => *transferable*
        case 'number':                        // number    => *transferable*
            return true;
    } // switch
    
    
    
    return false; // unknown => assumes as *NON-transferable*
}
const isTransferableDeepArray = <TPropValue extends Extract<CssCustomValue, any[]>>(propValue : TPropValue): propValue is (TPropValue & TransferableDeepArray) => {
    for (const propSubValue of propValue) {
        if (Array.isArray(propSubValue)) {
            if (!isTransferableDeepArray(propSubValue)) return false;
        }
        else {
            if (!isTransferablePrimitive(propSubValue)) return false;
        } // if
    } // for
    
    
    
    return true; // all subValues are passed -or- empty array
}
const isTransferableProp = <TPropValue extends CssCustomValue|undefined|null>(propValue : TPropValue): propValue is ((TPropValue & TransferablePrimitive) | (TPropValue & TransferableDeepArray)) => {
    if (isTransferablePrimitive(propValue)) return true;
    
    
    
    if (Array.isArray(propValue)) return isTransferableDeepArray(propValue);
    
    
    
    return false; // CssCustomKeyframesRef => *NON-transferable* => false
}

const encodePropSimpleValue = (propValue: CssComplexBaseValueOf<CssSimpleValue>): CssComplexBaseValueOf<EncodedCssSimpleValue> => {
    if (isTransferablePrimitive(propValue)) return propValue;
    
    return propValue.toString(); // CssCustomKeyframesRef => *NON-transferable* => make *transferable* => .toString()
}
const encodePropSubValue = (propSubValue: Extract<CssCustomValue, any[]>[number]): Extract<EncodedCssCustomValue, any[]>[number] => {
    if (!Array.isArray(propSubValue)) return encodePropSimpleValue(propSubValue);
    
    
    
    if (propSubValue.every(isTransferablePrimitive)) return propSubValue; // all items in the array are *transferable* -or- empty array => no need to mutate
    
    
    
    // some item(s) in the array is/are *NON-transferable* => NEED to mutate the array with *encoded* value(s):
    return (
        propSubValue
        .map(encodePropSimpleValue) // expensive op!
    );
}
const encodeRuleData = (ruleData: CssRuleData): EncodedCssRuleData => {
    // SLOW:
    // const [selector, styles] = ruleData;
    // return [
    //     selector,
    //     encodeStyles(styles) // expensive op!
    // ];
    
    // FASTER:
    return [
        ruleData[0],
        encodeStyles(ruleData[1]) // expensive op!
    ];
}
export function encodeNestedRule(this: CssStyle, symbolProp: symbol): EncodedCssRuleData {
    return encodeRuleData(this[symbolProp]); // expensive op!
}
export const encodeStyle = (style: ProductOrFactory<OptionalOrBoolean<CssStyle>>): OptionalOrBoolean<EncodedCssStyle> => {
    if (!style || (style === true))           return undefined; // falsy style => ignore
    const styleValue = (typeof(style) === 'function') ? style() : style;
    if (!styleValue || (styleValue === true)) return undefined; // falsy style => ignore
    
    
    
    // an empty string key is a special property for storing (nested) rules
    // if exists => assumes as already encoded:
    if ('' in style) return style as EncodedCssStyle;
    
    
    
    // SLOW:
    // const encodedStyle = Object.fromEntries(
    //     Object.entries(styleValue) // take all string keys (excluding symbol keys)
    //     .map(encodeProp) // expensive op!
    // ) as EncodedCssProps as EncodedCssStyle;
    
    // FASTER:
    const encodedStyle = styleValue; // hack: re-use the style object as encoded object; the symbol keys will be ignored when transfering
    for (const propName in encodedStyle) { // iterates string keys, ignoring symbol keys
        const propValue : CssCustomValue|undefined|null = encodedStyle[propName as keyof CssProps];
        
        
        
        if (propValue === '') continue; // an empty string key is a special property for storing (nested) rules => ignore
        if (isTransferableProp(propValue)) continue; // ignore *transferable* prop, no need to mutate
        
        
        
        // *NON-transferable* => NEED to mutate the array with *encoded* value(s):
        encodedStyle[propName as any] = (
            Array.isArray(propValue)
            ?
            // some item(s) in the array is/are *NON-transferable* => NEED to mutate the array with *encoded* value(s):
            (propValue.map(encodePropSubValue) as any) // expensive op!
            :
            (propValue.toString() as any) // CssCustomKeyframesRef => *NON-transferable* => make *transferable* => .toString()
        );
    } // for
    
    
    
    const symbolProps = Object.getOwnPropertySymbols(styleValue); // take all symbol keys
    if (symbolProps.length) {
        const nestedRules = (
            symbolProps
            .map(encodeNestedRule.bind(styleValue)) // expensive op!
        );
        
        
        
        // expensive op! causing chrome's to re-create hidden class:
        encodedStyle['' as any] = nestedRules as any; // an empty string key is a special property for storing (nested) rules
    } // if
    
    
    
    return encodedStyle as EncodedCssStyle;
}
function* unwrapStyles(styles: Extract<CssStyleCollection, any[]>): Generator<EncodedCssStyle> {
    for (const style of styles) {
        if (!style || (style === true)) continue; // falsy style(s) => ignore
        
        
        
        if (!Array.isArray(style)) {
            const encodedStyle = encodeStyle(style); // expensive op!
            if (!encodedStyle || (encodedStyle === true)) continue; // falsy style(s) => ignore
            yield encodedStyle;
            continue;
        } // if
        
        
        
        for (const subStyle of unwrapStyles(style)) { // expensive op!
            yield subStyle;
        } // for
    } // for
}
export const encodeStyles = (styles: CssStyleCollection): EncodedCssStyleCollection => {
    if (!Array.isArray(styles)) {
        return encodeStyle(styles); // expensive op!
    } // if
    
    
    
    return Array.from(unwrapStyles(styles)); // expensive op!
}
