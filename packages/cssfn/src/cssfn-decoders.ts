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
export const decodeStyle = (styles: OptionalOrBoolean<EncodedCssStyle>): OptionalOrBoolean<CssStyle> => {
    if (!styles || (styles === true)) return styles; // boolean|null|undefined => ignore
    
    
    
    const ruleDatas = styles['']; // an empty string key is a special property for storing (nested) rules
    
    
    
    delete styles[''];
    const decodedStyle = styles as CssStyle; // no need to clone to improve performance
    
    
    
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
export const decodeStyles = (styles: EncodedCssStyleCollection): CssStyleCollection => {
    if (!Array.isArray(styles)) {
        return decodeStyle(styles);
    } // if
    
    
    
    return (
        ((styles as any).flat(Infinity) as OptionalOrBoolean<EncodedCssStyle>[]) // no need to *exactly* match the deep_array structure, a simple_array is enough
        .map(decodeStyle)
    );
}
