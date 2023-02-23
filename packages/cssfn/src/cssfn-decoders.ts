// cssfn:
import type {
    // optionals:
    OptionalOrBoolean,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
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
import {
    cssStyleToMap,
}                           from './CssStyleMapImpl.js'



const isNativeMap = (style: OptionalOrBoolean<EncodedCssStyle>|Map<keyof CssStyle, CssStyle[keyof CssStyle]>): style is Map<keyof CssStyle, CssStyle[keyof CssStyle]> => {
    return (Object.getPrototypeOf(style) === Map.prototype);
}
export const decodeStyle = (style: OptionalOrBoolean<EncodedCssStyle>): OptionalOrBoolean<CssStyle> => {
    if (!style || (style === true)) return undefined;              // ignore : falsy style
    
    
    
    if (isNativeMap(style)) {
        /*
            A rendered `CssStyleMapImpl` object when transferred to WebWorker causes to reconstructured back as native `Map` object.
            The `Map` object causes a premature render process.
            To workaround this problem, the `Map` object need to transformed back to `CssStyleMapImpl` object.
        */
        return cssStyleToMap(                                // transform to `CssStyleMapImpl` object
            decodeStyle(                                     // recursively search for `Map` object
                Object.fromEntries(style) as EncodedCssStyle // convert `Map` object to literal `{}` object
            )
        ) as unknown as CssStyle; // it's okay to have a/some `CssStyleMapImpl` object inside the `CssStyle(Collection)`. The renderer will treat `CssStyleMapImpl` object as `CssFinalStyleMap`
    } // if
    
    
    
    type CssRuleEntry = readonly [symbol, CssRuleData];
    const nestedRules : (EncodedCssRuleData|CssRuleEntry|undefined)[]|null|undefined = style['']; // an empty string key is a special property for storing (nested) rules
    if (nestedRules /* ignore null|undefined marker */ && nestedRules.length) {
        delete style['']; // expensive op! causing chrome's to re-create hidden class
        
        
        
        type MutableEncodedCssRuleData = [...EncodedCssRuleData]|[...CssRuleData];
        for (let index = 0, max = nestedRules.length, encodedRuleData: MutableEncodedCssRuleData; index < max; index++) {
            encodedRuleData = nestedRules[index] as MutableEncodedCssRuleData;
            
            
            
            const decodedStyles = decodeStyles(                 // mutate    : EncodedCssStyleCollection => CssStyleCollection
                (encodedRuleData as EncodedCssRuleData)[1]      // type      : EncodedCssStyleCollection
            );
            if (!decodedStyles || (decodedStyles === true)) {
                nestedRules[index] = undefined;                 // mutate    : falsy style => undefined (delete)
            }
            else {
             // encodedRuleData[0] = encodedRuleData[0];        // unchanged : undefined|CssRawSelector|CssFinalSelector
                encodedRuleData[1] = decodedStyles;             // mutate    : EncodedCssStyleCollection => CssStyleCollection
                
                nestedRules[index] = [
                    Symbol()
                    ,
                    encodedRuleData as CssRuleData
                ] as CssRuleEntry;
            } // if
        } // for
        
        
        
        // cleanup blank entries:
        for (let index = nestedRules.length - 1; index >= 0; index--) {
            if (!nestedRules[index]) nestedRules.splice(index, 1);
        } // for
        
        
        
        // expensive op! causing chrome's to re-create hidden class:
        Object.assign(
            style,
            Object.fromEntries(
                nestedRules as CssRuleEntry[]
            )
        );
    } // if
    
    
    
    return style as CssStyle;
}
const unwrapStyles = (styles: Extract<EncodedCssStyleCollection, any[]>): void => {
    for (let index = 0, max = styles.length, style : typeof styles[number]; index < max; index++) {
        style = styles[index];
        
        
        
        // handle falsy item:
        if (!style || (style === true)) {
            styles[index] = undefined;                           // mutate : falsy style => undefined (delete)
            continue; // handled => continue to next loop
        } // if
        
        
        
        // handle single item:
        if (!Array.isArray(style)) {
            const decodedStyle = decodeStyle(style);             // mutate : EncodedCssStyle => CssStyle
            
            
            
            if (!decodedStyle || (decodedStyle === true)) {
                styles[index] = undefined;                       // mutate : falsy style => undefined (delete)
            }
            else {
                styles[index] = decodedStyle as CssStyle as any; // mutate : EncodedCssStyle => CssStyle
            } // if
            
            
            
            continue; // handled => continue to next loop
        } // if
        
        
        
        // handle multi item(s):
        unwrapStyles(style);                                     // mutate : EncodedCssStyle(s) => CssStyle(s)
    } // for
}
export const decodeStyles = (styles: EncodedCssStyleCollection): CssStyleCollection => {
    // statically handle single item:
    if (!Array.isArray(styles)) {
        return decodeStyle(styles);                              // mutate : EncodedCssStyle => CssStyle
    } // if
    
    
    
    // dynamically handle multi item(s):
    unwrapStyles(styles);                                        // mutate : EncodedCssStyle(s) => CssStyle(s)
    return styles as CssStyle[];
}
