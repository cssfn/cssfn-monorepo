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
    
    
    
    delete style[''];
    const decodedStyle = style as CssStyle; // no need to clone to improve performance
    
    
    
    if (ruleDatas && ruleDatas.length) {
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
function* unwrapStyles(styles: Extract<EncodedCssStyleCollection, any[]>): Generator<CssStyle> {
    for (const style of styles) {
        if (!style || (style === true)) continue; // falsy style(s) => ignore
        
        
        
        if (!Array.isArray(style)) {
            const decodedStyle = decodeStyle(style);
            if (!decodedStyle || (decodedStyle === true)) continue; // falsy style(s) => ignore
            yield decodedStyle;
            continue;
        } // if
        
        
        
        for (const subStyle of unwrapStyles(style)) {
            yield subStyle;
        } // for
    } // for
}
export const decodeStyles = (styles: EncodedCssStyleCollection): CssStyleCollection => {
    if (!Array.isArray(styles)) {
        return decodeStyle(styles);
    } // if
    
    
    
    return Array.from(unwrapStyles(styles));
}
