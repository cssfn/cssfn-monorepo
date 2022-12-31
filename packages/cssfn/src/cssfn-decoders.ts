// cssfn:
import type {
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



export const decodeStyle = (style: OptionalOrBoolean<EncodedCssStyle>): OptionalOrBoolean<CssStyle> => {
    if (!style || (style === true)) return undefined;              // ignore : falsy style
    
    
    
    type CssRuleEntry = readonly [symbol, CssRuleData];
    const nestedRules : (EncodedCssRuleData|CssRuleEntry|undefined)[]|null|undefined = style['']; // an empty string key is a special property for storing (nested) rules
    if (nestedRules && nestedRules.length) {
        // delete style[''];   // expensive op! causing chrome's to re-create hidden class
        style[''] = undefined; // assigning to undefined instead of deleting, to improve performance
        
        
        
        type MutableEncodedCssRuleData = [...EncodedCssRuleData]|[...CssRuleEntry];
        for (let index = 0, max = nestedRules.length, encodedCssRuleData: MutableEncodedCssRuleData; index < max; index++) {
            encodedCssRuleData = nestedRules[index] as MutableEncodedCssRuleData;
            
            
            
            const decodedStyles = decodeStyles(                    // mutate : EncodedCssStyleCollection => CssStyleCollection
                (encodedCssRuleData as EncodedCssRuleData)[1]
            );
            if (!decodedStyles || (decodedStyles === true)) {
                nestedRules[index] = undefined;                    // mutate : falsy style => undefined (delete)
            }
            else {
                encodedCssRuleData[1] = [                          // mutate : EncodedCssStyleCollection => CssRuleData
                    (encodedCssRuleData as EncodedCssRuleData)[0], // undefined|CssRawSelector|CssFinalSelector
                    decodedStyles                                  // CssStyleCollection
                ] as CssRuleData;
                encodedCssRuleData[0] = Symbol();                  // mutate : undefined|CssRawSelector|CssFinalSelector => symbol
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
        
        
        
        if (!style || (style === true)) {
            styles[index] = undefined;                           // mutate : falsy style => undefined (delete)
            continue;
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
