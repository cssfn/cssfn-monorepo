// cssfn:
import type {
    // types:
    OptionalOrBoolean,
    SingleOrDeepArray,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssRule,
    CssRuleCollection,
    
    CssStyle,
    CssStyleCollection,
    
    CssClassEntry,
    CssClassList,
    
    CssScopeName,
    CssScopeEntry,
    CssScopeMap,
    
    CssSelector,
    CssSelectorCollection,
}                           from '@cssfn/css-types'
import {
    // types:
    SimpleSelector    as SimpleSelectorModel,
    Combinator,
    Selector          as SelectorModel,
    SelectorGroup     as SelectorModelGroup,
    PureSelector      as PureSelectorModel,
    PureSelectorGroup as PureSelectorModelGroup,
    
    
    
    // parses:
    parseSelectors,
    
    
    
    // creates & tests:
    parentSelector,
    pseudoClassSelector,
    isSimpleSelector,
    isParentSelector,
    isClassOrPseudoClassSelector,
    isPseudoElementSelector,
    isNotPseudoElementSelector,
    isCombinator,
    createSelector,
    createSelectorGroup,
    isNotEmptySelectorEntry,
    isNotEmptySelector,
    isNotEmptySelectors,
    
    
    
    // renders:
    selectorsToString,
    
    
    
    // transforms:
    groupSelectors,
    groupSelector,
    ungroupSelector,
    
    
    
    // measures:
    calculateSpecificity,
}                           from '@cssfn/css-selectors'

// internals:
import {
    flat,
}                           from './utilities'



// processors:

export const mergeLiteral = (style: CssStyle, newStyle: CssStyle): void => {
    //#region merge normal props
    for (const propName in newStyle) { // loop through `newStyle`'s props
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
export const mergeNested  = (style: CssStyle): CssStyle => {
    //#region group (nested) Rule(s) by selector name
    const groupByNested = (
        Object.getOwnPropertySymbols(style)
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
                ['@media', '@supports', '@document', '@global'].some((at) => nestedSelector.startsWith(at))
            ) {
                let group = accum.get(nestedSelector);             // get an existing collector
                if (!group) accum.set(nestedSelector, group = []); // create a new collector
                group.push(sym);
            } // if
            return accum;
    }, new Map<string, symbol[]>()));
    //#endregion group (nested) Rule(s) by selector name
    
    
    
    //#region merge duplicates (nested) Rule(s) to unique ones
    for (const group of Array.from(groupByNested.values())) {
        if (group.length <= 1) continue; // filter out groups with single/no member
        
        
        
        const mergedStyles = mergeStyles(
            group.map((sym) => style[sym])
        );
        
        
        
        if (mergedStyles) {
            // update last member
            style[group[group.length - 1]] = mergedStyles; // merge all member's style to the last member
        }
        else {
            // mergedStyles is empty => delete last member
            delete style[group[group.length - 1]];
        } // if
        for (const sym of group.slice(0, -1)) delete style[sym]; // delete first member to second last member
    } // for
    //#endregion merge duplicates (nested) Rule to unique ones
    
    
    
    //#region merge only_parentSelector to current style
    let moveNestedRules = false;
    for (const sym of Object.getOwnPropertySymbols(style)) {
        if (sym.description === '&') {
            /* move the CssProps and (nested)Rules from only_parentSelector to current style */
            
            
            
            const parentStyles       = style[sym];
            const mergedParentStyles = mergeStyles(parentStyles);
            if (mergedParentStyles) {
                if (!moveNestedRules) {
                    const hasNestedRule  = !!Object.getOwnPropertySymbols(mergedParentStyles).length;
                    if (hasNestedRule) moveNestedRules = true;
                } // if
                
                
                
                mergeLiteral(style, mergedParentStyles); // merge into current style
                delete style[sym];                       // merged => delete source
            } // if
        }
        else if (moveNestedRules) {
            /* preserve the order of another (nested)Rules */
            
            
            
            const nestedStyles = style[sym]; // backup
            delete style[sym];               // delete
            style[sym] = nestedStyles;       // restore (re-insert at the last order)
        } // if
    } // for
    //#endregion merge only_parentSelector to current style
    
    
    
    return style;
}

/**
 * Merges the (sub) component's composition to single `CssStyle`.
 * @returns A `CssStyle` represents the merged (sub) component's composition  
 * -or-  
 * `null` represents an empty `CssStyle`.
 */
export const mergeStyles = (styles: CssStyleCollection): CssStyle|null => {
    /*
        CssStyleCollection = ProductOrFactoryOrDeepArray<OptionalOrBoolean<CssStyle>>
        CssStyleCollection = ProductOrFactory<OptionalOrBoolean<CssStyle>> | ProductOrFactoryDeepArray<OptionalOrBoolean<CssStyle>>
        typeof             = ---------------- not an array --------------- | -------------------- is an array ---------------------
    */
    
    
    
    if (!Array.isArray(styles)) {
        // not an array => ProductOrFactory<OptionalOrBoolean<CssStyle>>
        
        const styleValue: OptionalOrBoolean<CssStyle> = (
            (typeof(styles) === 'function')
            ?
            styles() // a function => Factory<OptionalOrBoolean<CssStyle>>
            :
            styles   // a product  => OptionalOrBoolean<CssStyle>
        );
        if (!styleValue || (styleValue === true)) return null; // `null` or `undefined` => return `null`
        
        
        
        const mergedStyles: CssStyle = styleValue;
        mergeNested(mergedStyles);
        
        
        
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
            // final element => might be a function or a product
            (
                // not an array => ProductOrFactory<OptionalOrBoolean<CssStyle>>
                
                (typeof(subStyles) === 'function')
                ?
                subStyles() // a function => Factory<OptionalOrBoolean<CssStyle>>
                :
                subStyles   // a product  => OptionalOrBoolean<CssStyle>
            )
        );
        if (!subStyleValue || (subStyleValue === true)) continue; // `null` or `undefined` => skip
        
        
        
        // merge current style to single big style (string props + symbol props):
        mergeLiteral(mergedStyles, subStyleValue);
        mergeNested(mergedStyles); // merge nested immediately after literal, to preserve prop order in mergedStyles and in mergedStyles[Symbol('&')]
    } // for
    
    
    
    // do not return an empty style, instead return null:
    if ((!Object.keys(mergedStyles).length) && (!Object.getOwnPropertySymbols(mergedStyles).length)) return null; // an empty object => return `null`
    
    // return non empty style:
    return mergedStyles;
}
