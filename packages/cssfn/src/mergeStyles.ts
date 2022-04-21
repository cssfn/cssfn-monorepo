// cssfn:
import type {
    // types:
    OptionalOrBoolean,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssRuleData,
    
    CssStyle,
    CssStyleCollection,
    
    CssSelector,
    CssSelectorCollection,
    CssSelectorOptions,
    
    RawCssSelector,
    FinalCssSelector,
}                           from '@cssfn/css-types'
import {
    // types:
    SimpleSelector,
    Combinator,
    Selector,
    SelectorGroup,
    PureSelector,
    PureSelectorGroup,
    
    
    
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
    createPureSelector,
    createSelectorGroup,
    createPureSelectorGroup,
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
import {
    mergeSelectors,
}                           from './mergeSelectors'



// processors:

const enum RuleType {
    SelectorRule, // &.foo   .boo&   .foo&.boo
    AtRule,       // for `@media`
    PropRule,     // for `from`, `to`, `25%`
}
const getRuleType = (selector: CssSelector): RuleType|null => {
    if (selector.startsWith('@')) return RuleType.AtRule;
    if (selector.startsWith(' ')) return RuleType.PropRule;
    if (selector.includes('&'))   return RuleType.SelectorRule;
    return null;
}

type GroupByRuleType  = Map<RuleType, CssSelector[]>
const groupByRuleType = (accum: Map<RuleType, CssSelector[]>, selector: CssSelector): GroupByRuleType => {
    let ruleType = getRuleType(selector);
    switch (ruleType) {
        case RuleType.PropRule:
            selector = selector.slice(1); // remove prefixed space
            break;
        
        case null: // unknown RuleType
            ruleType = RuleType.SelectorRule; // default to (nested) SelectorRule
            selector = `&${selector}`;        // :active => &:active
            break;
    } // switch
    
    
    
    let group = accum.get(ruleType);             // get an existing collector
    if (!group) accum.set(ruleType, group = []); // create a new collector
    group.push(selector);
    return accum;
}

const isFinalSelector  = (selector: RawCssSelector|FinalCssSelector): selector is FinalCssSelector => (typeof(selector) === 'string');
const finalizeSelector = (style: CssStyle, symbolProp: symbol): FinalCssSelector|null => {
    const symbolPropValue    = style[symbolProp]; // get existing prop (if any)
    if (symbolPropValue === undefined) return null;
    const [selector, styles] = symbolPropValue;
    if (isFinalSelector(selector)) return selector;
    
    
    
    // extract raw selector:
    const [selectors, options] = selector;
    
    
    
    // group selectors by rule type:
    const selectorsString = (
        flat(selectors)
        .filter((selector): selector is CssSelector => (!!selector || (selector === '')) && (selector !== true))
    );
    const selectorGroupByRuleType = selectorsString.reduce(
        groupByRuleType,
        new Map<RuleType, CssSelector[]>()
    );
    
    
    
    // parse selectors:
    const selectorGroup : SelectorGroup = (
        (selectorGroupByRuleType.get(RuleType.SelectorRule) ?? []) // take only the SelectorRule(s)
        .flatMap((selectorString) => {
            const selectorGroup = parseSelectors(selectorString);
            if (!selectorGroup) throw Error(`parse selector error: ${selectorString}`);
            return selectorGroup;
        })
    );
    // merge selectors:
    const mergedSelectors = mergeSelectors(selectorGroup, options);
    // render back to string:
    const finalSelector   = isNotEmptySelectors(mergedSelectors) ? (selectorsToString(mergedSelectors) as FinalCssSelector) : null;
    
    
    
    //#region update (mutate) styles
    // FinalCssSelector of SelectorRule:
    if (finalSelector) {
        style[symbolProp] = [ // update existing RawCssSelector to FinalCssSelector
            finalSelector,
            styles
        ] as CssRuleData;
    } else {
        delete style[symbolProp]; // delete existing RawCssSelector
    } // if
    
    
    
    // FinalCssSelector of AtRule|PropRule === `@media`|`from`|`to`|`25%`:
    const additionalSymbolProps : FinalCssSelector[] = [ // take all rules except SelectorRule(s):
        ...(selectorGroupByRuleType.get(RuleType.AtRule   ) ?? []),
        ...(selectorGroupByRuleType.get(RuleType.PropRule ) ?? []),
    ];
    for (const otherFinalSelector in additionalSymbolProps) {
        style[Symbol()] = [
            otherFinalSelector,
            styles
        ] as CssRuleData;
    } // for
    //#endregion update (mutate) styles
    
    
    
    // return the result:
    return finalSelector;
}



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



const ensureSymbolPropsUpdated = (style: CssStyle): symbol[] => {
    const symbolProps = Object.getOwnPropertySymbols(style);
    if (!symbolProps.length) return symbolProps; // there's no (nested) Rule => nothing to do
    
    
    
    // render RawCssSelector to FinalCssSelector (if any)
    for (const symbolProp of symbolProps) {
        finalizeSelector(style, symbolProp);
    } // for
    
    
    
    return Object.getOwnPropertySymbols(style); // refresh the `symbolProps`
}
export const mergeParent  = (style: CssStyle): void => {
    const symbolProps = ensureSymbolPropsUpdated(style);
    if (!symbolProps.length) return; // there's no (nested) Rule => nothing to do
    
    
    
    let needToReorderOtherSymbolProps = false;
    for (const symbolProp of symbolProps) {
        const finalSelector = finalizeSelector(style, symbolProp);
        if (finalSelector === '&') { // found only_parentSelector
            /* move the CssProps and (nested)Rules from only_parentSelector to current style */
            
            
            
            const [, styles]         = style[symbolProp];
            const mergedParentStyles = mergeStyles(styles);
            if (mergedParentStyles) {
                if (!needToReorderOtherSymbolProps) {
                    /* if mergedParentStyles has any (nested) Rule => all (nested) Rule in current style need to rearrange to preserve the order */
                    const hasNestedRule  = !!Object.getOwnPropertySymbols(mergedParentStyles).length;
                    if (hasNestedRule) needToReorderOtherSymbolProps = true;
                } // if
                
                
                
                mergeLiteral(style, mergedParentStyles); // merge into current style
            } // if
            delete style[symbolProp];                    // merged => delete source
        }
        else if (needToReorderOtherSymbolProps) {
            /* preserve the order of another (nested)Rules */
            
            
            
            const nestedRuleData = style[symbolProp]; // backup
            delete style[symbolProp];                 // delete
            style[symbolProp] = nestedRuleData;       // restore (re-insert at the last order)
        } // if
    } // for
}

const nestedAtRules = ['@media', '@supports', '@document', '@global'];
type GroupByNestedEntry = readonly [symbol, FinalCssSelector|null];
const groupByNested = (accum: Map<FinalCssSelector, symbol[]>, [symbolProp, finalSelector]: GroupByNestedEntry) => {
    if (!finalSelector) return accum; // skip empty entry
    
    
    
    if (
        // nested rules:
        (
            (finalSelector !== '&')     // ignore only_parentSelector
            &&
            finalSelector.includes('&') // nested rule
        )
        ||
        // conditional rules & globals:
        nestedAtRules.some((at) => finalSelector.startsWith(at))
    ) {
        let group = accum.get(finalSelector);             // get an existing collector
        if (!group) accum.set(finalSelector, group = []); // create a new collector
        group.push(symbolProp);
    } // if
    return accum;
}
export const mergeNested  = (style: CssStyle): void => {
    const symbolProps = ensureSymbolPropsUpdated(style);
    if (!symbolProps.length) return; // there's no (nested) Rule => nothing to do
    
    
    
    // group (nested) Rule(s) by selector name:
    const symbolPropGroupByNested = (
        symbolProps
        .map((symbolProp): GroupByNestedEntry => [
            symbolProp,
            finalizeSelector(style, symbolProp)
        ])
        .reduce(
            groupByNested,
            new Map<FinalCssSelector, symbol[]>()
        )
    );
    
    
    
    //#region merge duplicates (nested) Rule(s) to unique ones
    for (const symbolGroup of symbolPropGroupByNested.values()) {
        // merge styles from symbolGroup's members to single style
        const multipleStyles = symbolGroup.map((symbolProp) => style[symbolProp][1]);
        const mergedStyles   = mergeStyles(multipleStyles);
        
        
        
        if (mergedStyles) {
            // update last member
            const lastMember = symbolGroup[symbolGroup.length - 1];
            style[lastMember] = [ // assign mergedStyles to the last member
                style[lastMember][0],
                mergedStyles
            ] as CssRuleData;
        }
        else {
            // mergedStyles is empty => delete last member
            delete style[symbolGroup[symbolGroup.length - 1]];
        } // if
        for (const symbolProp of symbolGroup.slice(0, -1)) delete style[symbolProp]; // delete first member to second last member
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
