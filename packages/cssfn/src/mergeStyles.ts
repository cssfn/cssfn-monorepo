// cssfn:
import type {
    // types:
    OptionalOrBoolean,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssStyle,
    CssStyleCollection,
}                           from '@cssfn/css-types'



// processors:

export const mergeLiteral = (style: CssStyle, newStyle: CssStyle): void => {
    //#region merge normal props
    // for (const propName in newStyle) { // loop through `newStyle`'s props
    for (const propName of Object.keys(newStyle)) { // loop through `newStyle`'s props // capture keys before iterating & mutate
        const newPropValue = (newStyle as any)[propName];
        
        
        
        // add/overwrite `newPropValue` into `style`:
        delete (style as any)[propName]; // delete the old prop (if any), so the new prop always placed at the end of LiteralObject
        (style as any)[propName] = newPropValue as any; // add/overwrite
    } // for
    //#endregion merge normal props
    
    
    
    //#region merge symbol props
    for (const propName of Object.getOwnPropertySymbols(newStyle)) { // loop through `newStyle`'s props
        const newPropValue = (newStyle as any)[propName];
        
        
        
        // add/overwrite `newPropValue` into `style`:
        delete (style as any)[propName]; // delete the old prop (if any), so the new prop always placed at the end of LiteralObject
        (style as any)[propName] = newPropValue as any; // add/overwrite
    } // for
    //#endregion merge symbol props
}



export const mergeParent  = (style: CssStyle): void => {
    const symbolProps = Object.getOwnPropertySymbols(style);
    if (!symbolProps.length) return; // there's no (nested) Rule => nothing to do
    
    
    
    let needToReorderOtherSymbolProps = false;
    for (const sym of symbolProps) {
        if (sym.description === '&') {
            /* move the CssProps and (nested)Rules from only_parentSelector to current style */
            
            
            
            const parentStyles       = style[sym];
            const mergedParentStyles = mergeStyles(parentStyles);
            if (mergedParentStyles) {
                if (!needToReorderOtherSymbolProps) {
                    /* if mergedParentStyles has any (nested) Rule => all (nested) Rule in current style need to rearrange to preserve the order */
                    const hasNestedRule  = !!Object.getOwnPropertySymbols(mergedParentStyles).length;
                    if (hasNestedRule) needToReorderOtherSymbolProps = true;
                } // if
                
                
                
                mergeLiteral(style, mergedParentStyles); // merge into current style
            } // if
            delete style[sym];                           // merged => delete source
        }
        else if (needToReorderOtherSymbolProps) {
            /* preserve the order of another (nested)Rules */
            
            
            
            const nestedStyles = style[sym]; // backup
            delete style[sym];               // delete
            style[sym] = nestedStyles;       // restore (re-insert at the last order)
        } // if
    } // for
}
const nestedAtRules = ['@media', '@supports', '@document', '@global'];
export const mergeNested  = (style: CssStyle): void => {
    const symbolProps = Object.getOwnPropertySymbols(style);
    if (!symbolProps.length) return; // there's no (nested) Rule => nothing to do
    
    
    
    //#region group (nested) Rule(s) by selector name
    const groupByNested = (
        symbolProps
        .reduce((accum, sym) => {
            const nestedSelector = sym.description ?? '';
            if (
                // nested rules:
                (
                    (nestedSelector !== '&')     // ignore only_parentSelector
                    &&
                    nestedSelector.includes('&') // nested rule
                )
                ||
                // conditional rules & globals:
                nestedAtRules.some((at) => nestedSelector.startsWith(at))
            ) {
                let group = accum.get(nestedSelector);             // get an existing collector
                if (!group) accum.set(nestedSelector, group = []); // create a new collector
                group.push(sym);
            } // if
            return accum;
        }, new Map<string, symbol[]>())
    );
    //#endregion group (nested) Rule(s) by selector name
    
    
    
    //#region merge duplicates (nested) Rule(s) to unique ones
    for (const group of groupByNested.values()) {
        // merge styles from group's members to single style
        const multipleStyles = group.map((sym) => style[sym]);
        const mergedStyles   = mergeStyles(multipleStyles);
        
        
        
        if (mergedStyles) {
            // update last member
            style[group[group.length - 1]] = mergedStyles; // assign mergedStyles to the last member
        }
        else {
            // mergedStyles is empty => delete last member
            delete style[group[group.length - 1]];
        } // if
        for (const sym of group.slice(0, -1)) delete style[sym]; // delete first member to second last member
    } // for
    //#endregion merge duplicates (nested) Rule to unique ones
}



/**
 * Merges `CssStyleCollection` to single `CssStyle`.
 * @returns A `CssStyle` represents the merged `CssStyleCollection`.
 * -or-  
 * `null` represents an empty `CssStyle`.
 */
export const mergeStyles = (styles: CssStyleCollection): CssStyle|null => {
    /*
        CssStyleCollection = ProductOrFactoryOrDeepArray<OptionalOrBoolean<CssStyle>>
        CssStyleCollection = ProductOrFactory<OptionalOrBoolean<CssStyle>> | ProductOrFactoryDeepArray<OptionalOrBoolean<CssStyle>>
        typeof             = -------- nullable_object or function -------- | ---------------------- an array ----------------------
    */
    
    
    
    if (!Array.isArray(styles)) {
        // nullable_object or function => ProductOrFactory<OptionalOrBoolean<CssStyle>>
        
        const styleValue: OptionalOrBoolean<CssStyle> = (
            (typeof(styles) === 'function')
            ?
            styles() // a function => Factory<OptionalOrBoolean<CssStyle>>
            :
            styles   // a product  => OptionalOrBoolean<CssStyle>
        );
        if (!styleValue || (styleValue === true)) return null; // undefined|null|false|true => return `null`
        
        
        
        const mergedStyles: CssStyle = (styleValue === styles) ? styleValue : { ...styleValue }; // shallow clone before mutate
        mergeParent(mergedStyles); // mutate
        mergeNested(mergedStyles); // mutate
        
        
        
        // do not return an empty style, instead return null:
        if ((!Object.keys(mergedStyles).length) && (!Object.getOwnPropertySymbols(mergedStyles).length)) return null; // an empty object => return `null`
        
        // return non empty style:
        return mergedStyles;
    } // if
    
    
    
    const mergedStyles: CssStyle = {};
    for (const subStyles of styles) { // shallow iterating array
        const subStyleValue: OptionalOrBoolean<CssStyle> = (
            Array.isArray(subStyles)
            ?
            // deep iterating array
            mergeStyles(subStyles) // an array => ProductOrFactoryDeepArray<OptionalOrBoolean<CssStyle>> => recursively `mergeStyles()`
            :
            // not an array => nullable_object or function => ProductOrFactory<OptionalOrBoolean<CssStyle>>
            (
                (typeof(subStyles) === 'function')
                ?
                subStyles() // a function => Factory<OptionalOrBoolean<CssStyle>>
                :
                subStyles   // a product  => OptionalOrBoolean<CssStyle>
            )
        );
        if (!subStyleValue || (subStyleValue === true)) continue; // undefined|null|false|true => skip
        
        
        
        // merge current style to single big style (string props + symbol props):
        mergeLiteral(mergedStyles, subStyleValue); // mutate
        
        // to preserve the order sequence of only_parentSelector
        // we need to unwrap the only_parentSelector before merging with next subStyles
        // by calling `mergeParent()`, the only_parentSelector are unwrapped
        mergeParent(mergedStyles); // mutate
    } // for
    mergeNested(mergedStyles); // mutate
    
    
    
    // do not return an empty style, instead return null:
    if ((!Object.keys(mergedStyles).length) && (!Object.getOwnPropertySymbols(mergedStyles).length)) return null; // an empty object => return `null`
    
    // return non empty style:
    return mergedStyles;
}
