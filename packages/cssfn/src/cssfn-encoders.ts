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
    if (propValue === undefined) return true; // undefined => *transferable*
    if (propValue === null     ) return true; // null      => *transferable*
    switch (typeof(propValue)) {
        case 'string':                        // string    => *transferable*
        case 'number':                        // number    => *transferable*
            return true;
    } // switch
    
    
    
    return false; // unknown => assumes as *NON-transferable*
}
export const encodeStyle = (style: ProductOrFactory<OptionalOrBoolean<CssStyle>>): OptionalOrBoolean<EncodedCssStyle> => {
    if (!style || (style === true))           return undefined; // falsy style => ignore
    const styleValue = (typeof(style) === 'function') ? style() : style;
    if (!styleValue || (styleValue === true)) return undefined; // falsy style => ignore
    
    
    
    // an empty string key is a special property for storing (nested) rules
    // if exists => assumes as already encoded:
    if (styleValue['' as any] !== undefined) return styleValue as EncodedCssStyle;
    
    
    
    for (const propName in styleValue) { // iterates string keys, ignoring symbol keys
        const propValue : CssCustomValue|undefined|null = styleValue[propName as keyof CssProps];
        
        
        
        if (!Array.isArray(propValue)) {
            if (isTransferablePrimitive(propValue)) continue; // ignore *transferable* propValue
            
            
            
            styleValue[propName as any] = propValue.toString() as any; // mutate CssCustomKeyframesRef with CssCustomKeyframesRef.toString()
        }
        else {
            for (let index = 0, max = propValue.length, propSubValue : typeof propValue[number]; index < max; index++) {
                propSubValue = propValue[index];
                
                
                
                if (!Array.isArray(propSubValue)) {
                    if (isTransferablePrimitive(propSubValue)) continue; // ignore *transferable* propSubValue
                    
                    
                    
                    propValue[index] = propSubValue.toString(); // mutate CssCustomKeyframesRef with CssCustomKeyframesRef.toString()
                }
                else {
                    for(let subIndex = 0, subMax = propSubValue.length, propSubSubValue : typeof propSubValue[number]; subIndex < subMax; subIndex++) {
                        propSubSubValue = propSubValue[subIndex];
                        
                        
                        
                        if (isTransferablePrimitive(propSubSubValue)) continue; // ignore *transferable* propSubSubValue
                        
                        
                        
                        propSubValue[subIndex] = propSubSubValue.toString(); // mutate CssCustomKeyframesRef with CssCustomKeyframesRef.toString()
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
            
            
            
            const encodedStyles = encodeStyles((ruleData as CssRuleData)[1]); // mutate CssStyleCollection with EncodedCssStyleCollection
            if (!encodedStyles || (encodedStyles === true)) {
                nestedRules[index] = undefined; // mutate : falsy style => undefined (delete)
            }
            else {
                ruleData[1] = encodedStyles; // EncodedCssStyleCollection
             // ruleData[0] = ruleData[0];   // unchanged : undefined|CssRawSelector|CssFinalSelector
                
                
                
                nestedRules[index] = ruleData as EncodedCssRuleData; // mutate symbol with EncodedCssRuleData
            } // if
        } // for
        
        
        
        // expensive op! causing chrome's to re-create hidden class:
        styleValue['' as any] = nestedRules as any; // an empty string key is a special property for storing (nested) rules
    } // if
    
    
    
    return styleValue as EncodedCssStyle;
}
const unwrapStyles = (styles: Extract<CssStyleCollection, any[]>): void => {
    for (let index = 0, max = styles.length, style : typeof styles[number]; index < max; index++) {
        style = styles[index];
        
        
        
        if (!style || (style === true)) {
            styles[index] = undefined; // mutate : falsy style => undefined (delete)
            continue;
        } // if
        
        
        
        // handle single item:
        if (!Array.isArray(style)) {
            const encodedStyle = encodeStyle(style); // mutate CssStyle with EncodedCssStyle
            
            
            
            if (!encodedStyle || (encodedStyle === true)) {
                styles[index] = undefined; // mutate : falsy style => undefined (delete)
            }
            else {
                styles[index] = encodedStyle as EncodedCssStyle as any; // mutate CssStyle with EncodedCssStyle
            } // if
            
            
            
            continue; // handled => continue to next loop
        } // if
        
        
        
        // handle multi item(s):
        unwrapStyles(style); // mutate each CssStyle with EncodedCssStyle
    } // for
}
export const encodeStyles = (styles: CssStyleCollection): EncodedCssStyleCollection => {
    // statically handle single item:
    if (!Array.isArray(styles)) {
        return encodeStyle(styles); // mutate CssStyle with EncodedCssStyle
    } // if
    
    
    
    // dynamically handle multi item(s):
    unwrapStyles(styles); // mutate each CssStyle with EncodedCssStyle
    return styles as EncodedCssStyle[];
}
