// cssfn:
import type {
    OptionalOrBoolean,
    
    ProductOrFactory,
}                           from '@cssfn/types'
import type {
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
    // cssfn properties:
    EncodedCssRuleData,
    EncodedCssStyle,
    EncodedCssStyleCollection,
}                           from './cssfn-encoded-types.js'



// types:
type TransferablePrimitive = undefined|null|string|number



const isTransferablePrimitive = <TPropValue extends CssCustomValue|undefined|null>(propValue : TPropValue): propValue is (TPropValue & TransferablePrimitive) => {
    if (propValue === null) return true; // null object      => *transferable*     // the only object that transferable
    switch (typeof(propValue)) {
        case 'object':                   // any object       => *NON-transferable*
        case 'symbol':                   // primitive symbol => *NON-transferable* // the only primitive that NON-transferable
            return false;
        
        default:
            return true;                 // any primitive    => *transferable*
    } // switch
}
export const encodeStyle = (style: ProductOrFactory<OptionalOrBoolean<CssStyle>>): OptionalOrBoolean<EncodedCssStyle> => {
    if (!style || (style === true))           return undefined;                 // ignore : falsy style
    const styleValue = (typeof(style) === 'function') ? style() : style;
    if (!styleValue || (styleValue === true)) return undefined;                 // ignore : falsy style
    
    
    
    // an empty string key is a special property for storing (nested) rules
    // if exists => assumes as already encoded:
    if (styleValue['' as any] !== undefined) return styleValue as EncodedCssStyle;
    
    
    
    for (const propName in styleValue) { // iterates string keys, ignoring symbol keys
        const propValue : CssCustomValue|undefined|null = styleValue[propName as keyof CssProps];
        
        
        
        if (!Array.isArray(propValue)) {
            if (isTransferablePrimitive(propValue)) continue;                   // ignore : *transferable* propValue
            
            
            
            styleValue[propName as any] = propValue.toString() as any;          // mutate : CssCustomKeyframesRef => .toString()
        }
        else {
            for (let subIndex = 0, subMax = propValue.length, propSubValue : typeof propValue[number]; subIndex < subMax; subIndex++) {
                propSubValue = propValue[subIndex];
                
                
                
                if (!Array.isArray(propSubValue)) {
                    if (isTransferablePrimitive(propSubValue)) continue;        // ignore : *transferable* propSubValue
                    
                    
                    
                    propValue[subIndex] = propSubValue.toString();              // mutate : CssCustomKeyframesRef => .toString()
                }
                else {
                    for (let subSubIndex = 0, subSubMax = propSubValue.length, propSubSubValue : typeof propSubValue[number]; subSubIndex < subSubMax; subSubIndex++) {
                        propSubSubValue = propSubValue[subSubIndex];
                        
                        
                        
                        if (isTransferablePrimitive(propSubSubValue)) continue; // ignore : *transferable* propSubSubValue
                        
                        
                        
                        propSubValue[subSubIndex] = propSubSubValue.toString(); // mutate : CssCustomKeyframesRef => .toString()
                    } // for
                } // if
            } // for
        } // if
    } // for
    
    
    
    const nestedRules : (symbol|EncodedCssRuleData|undefined)[] = Object.getOwnPropertySymbols(styleValue); // take all symbol keys
    if (nestedRules.length) {
        type MutableCssRuleData = [...CssRuleData]|[...EncodedCssRuleData];
        for (let index = 0, max = nestedRules.length, ruleData: MutableCssRuleData; index < max; index++) {
            ruleData = styleValue[nestedRules[index] as symbol] as MutableCssRuleData;
            
            
            
            const encodedStyles = encodeStyles(                         // mutate : CssStyleCollection => EncodedCssStyleCollection
                (ruleData as CssRuleData)[1]                            // type   : CssStyleCollection
            );
            if (!encodedStyles || (encodedStyles === true)) {
                nestedRules[index] = undefined;                         // mutate : falsy style => undefined (delete)
            }
            else {
                ruleData[1] = encodedStyles;                            // mutate : CssStyleCollection => EncodedCssStyleCollection
             // ruleData[0] = ruleData[0];                              // unchanged : undefined|CssRawSelector|CssFinalSelector
                
                
                
                nestedRules[index] = ruleData as EncodedCssRuleData;    // mutate : symbol => EncodedCssRuleData
            } // if
        } // for
        
        
        
        // mark as already converted & store the nestedRules:
        // expensive op! causing chrome's to re-create hidden class:
        styleValue['' as any] = nestedRules as any; // an empty string key is a special property for storing (nested) rules
    }
    else {
        // mark as already converted:
        // expensive op! causing chrome's to re-create hidden class:
        styleValue['' as any] = null as any;        // an empty string key is a special property for storing (nested) rules
    } // if
    
    
    
    return styleValue as EncodedCssStyle;
}
const unwrapStyles = (styles: Extract<CssStyleCollection, any[]>): void => {
    for (let index = 0, max = styles.length, style : typeof styles[number]; index < max; index++) {
        style = styles[index];
        
        
        
        // handle falsy item:
        if (!style || (style === true)) {
            styles[index] = undefined;                                  // mutate : falsy style => undefined (delete)
            continue; // handled => continue to next loop
        } // if
        
        
        
        // handle single item:
        if (!Array.isArray(style)) {
            const encodedStyle = encodeStyle(style);                    // mutate : CssStyle => EncodedCssStyle
            
            
            
            if (!encodedStyle || (encodedStyle === true)) {
                styles[index] = undefined;                              // mutate : falsy style => undefined (delete)
            }
            else {
                styles[index] = encodedStyle as EncodedCssStyle as any; // mutate : CssStyle => EncodedCssStyle
            } // if
            
            
            
            continue; // handled => continue to next loop
        } // if
        
        
        
        // handle multi item(s):
        unwrapStyles(style);                                            // mutate : CssStyle(s) => EncodedCssStyle(s)
    } // for
}
export const encodeStyles = (styles: CssStyleCollection): EncodedCssStyleCollection => {
    // statically handle single item:
    if (!Array.isArray(styles)) {
        return encodeStyle(styles);                                     // mutate : CssStyle => EncodedCssStyle
    } // if
    
    
    
    // dynamically handle multi item(s):
    unwrapStyles(styles);                                               // mutate : CssStyle(s) => EncodedCssStyle(s)
    return styles as EncodedCssStyle[];
}
