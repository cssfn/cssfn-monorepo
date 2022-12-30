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



const decodeRuleData = (ruleData: EncodedCssRuleData): CssRuleData => {
    const [selector, styles] = ruleData;
    return [
        selector,
        decodeStyles(styles)
    ];
}
const decodeNestedRule = (ruleData: EncodedCssRuleData): readonly [symbol, CssRuleData] => {
    return [
        Symbol(),
        decodeRuleData(ruleData)
    ];
}
export const decodeStyle = (style: OptionalOrBoolean<EncodedCssStyle>): OptionalOrBoolean<CssStyle> => {
    if (!style || (style === true)) return undefined; // falsy style => ignore
    
    
    
    const ruleDatas = style['']; // an empty string key is a special property for storing (nested) rules
    const decodedStyle = style as CssStyle; // no need to clone to improve performance
    
    
    
    if (ruleDatas && ruleDatas.length) {
        // delete style[''];   // expensive op! causing chrome's to re-create hidden class
        style[''] = undefined; // assigning to undefined instead of deleting, to improve performance
        
        
        
        const nestedRules = (
            ruleDatas
            .map(decodeNestedRule)
        );
        Object.assign(
            decodedStyle,
            Object.fromEntries(nestedRules)
        );
    } // if
    
    
    
    return decodedStyle;
}
function unwrapStyles(styles: Extract<EncodedCssStyleCollection, any[]>, result: CssStyle[]): void {
    for (const style of styles) {
        if (!style || (style === true)) continue; // falsy style(s) => ignore
        
        
        
        // handle single item:
        if (!Array.isArray(style)) {
            const decodedStyle = decodeStyle(style);
            if (!decodedStyle || (decodedStyle === true)) continue; // falsy style(s) => ignore
            result.push(decodedStyle);
            continue;
        } // if
        
        
        
        // handle multi item(s):
        unwrapStyles(style, result);
    } // for
}
export const decodeStyles = (styles: EncodedCssStyleCollection): CssStyleCollection => {
    // statically handle single item:
    if (!Array.isArray(styles)) {
        return decodeStyle(styles);
    } // if
    
    
    
    // dynamically handle multi item(s):
    const result: CssStyle[] = [];
    unwrapStyles(styles, result);
    return result;
}
