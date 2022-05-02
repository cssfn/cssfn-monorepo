// cssfn:
import type {
    // types:
    SingleOrArray,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssStyle,
    
    CssSelector,
    
    CssFinalSelector,
}                           from '@cssfn/css-types'
import {
    // types:
    SelectorGroup,
    
    
    
    // parses:
    parseSelectors,
    
    
    
    // creates & tests:
    isNotEmptySelectors,
    
    
    
    // renders:
    selectorsToString,
}                           from '@cssfn/css-selectors'

// internals:
import {
    flat,
    isFinalSelector,
}                           from './utilities.js'
import {
    mergeSelectors,
}                           from './mergeSelectors.js'



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

const finalizeSelector = (style: CssStyle, symbolProp: symbol): CssFinalSelector|null => {
    const ruleData = style[symbolProp]; // get existing prop (if any)
    if (ruleData === undefined) return null;
    const [selector, nestedStyle] = ruleData;
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
    const finalSelector : CssFinalSelector|null = isNotEmptySelectors(mergedSelectors) ? selectorsToString(mergedSelectors) : null;
    
    
    
    //#region update (mutate) nestedStyle
    //#region update (primary) SelectorRule
    if (finalSelector) {
        style[symbolProp] = [
            finalSelector, // update CssRawSelector to CssFinalSelector
            nestedStyle    // still the same nestedStyle
        ];
    }
    else {
        delete style[symbolProp]; // delete existing CssRawSelector
    } // if
    //#endregion update (primary) SelectorRule
    
    
    
    //#region update (additional) AtRule|PropRule
    const additionalFinalProps : CssFinalSelector[] = [ // take all rules except SelectorRule(s):
        ...(selectorGroupByRuleType.get(RuleType.AtRule   ) ?? []), // eg: @keyframes, @font-face (unmergeable nested @rule)
        ...(selectorGroupByRuleType.get(RuleType.PropRule ) ?? []), // eg: from, to, 25% (special properties of @keyframes rule)
    ];
    for (const additionalFinalProp of additionalFinalProps) {
        style[Symbol()] = [
            additionalFinalProp, // update CssRawSelector to CssFinalSelector
            nestedStyle          // still the same nestedStyle
        ];
    } // for
    //#endregion update (additional) AtRule|PropRule
    //#endregion update (mutate) nestedStyle
    
    
    
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



const ensureSymbolPropsUpdated = (style: CssStyle): void => {
    const symbolProps = Object.getOwnPropertySymbols(style);
    if (!symbolProps.length) return; // there's no (nested) Rule => nothing to do
    
    
    
    // render CssRawSelector to CssFinalSelector (if any)
    for (const symbolProp of symbolProps) {
        finalizeSelector(style, symbolProp);
    } // for
}
export const mergeParent  = (style: CssStyle): void => {
    const symbolProps = Object.getOwnPropertySymbols(style);
    if (!symbolProps.length) return; // there's no (nested) Rule => nothing to do
    
    
    
    let needToReorderOtherSymbolProps = false;
    for (const symbolProp of symbolProps) {
        const finalSelector = finalizeSelector(style, symbolProp);
        if (finalSelector === '&') { // found only_parentSelector
            /* move the CssProps and (nested)Rules from only_parentSelector to current style */
            
            
            
            const [, parentStyle]   = style[symbolProp];
            const mergedParentStyle = mergeStyles(parentStyle);
            if (mergedParentStyle) {
                if (!needToReorderOtherSymbolProps) {
                    /* if mergedParentStyle has any (nested) Rule => all (nested) Rule in current style need to rearrange to preserve the order */
                    const hasNestedRule  = !!Object.getOwnPropertySymbols(mergedParentStyle).length;
                    if (hasNestedRule) needToReorderOtherSymbolProps = true;
                } // if
                
                
                
                mergeLiteral(style, mergedParentStyle); // merge into current style
            } // if
            delete style[symbolProp];                   // merged => delete source
        }
        else if (needToReorderOtherSymbolProps) {
            /* preserve the order of another (nested)Rules */
            
            
            
            const nestedRuleData = style[symbolProp]; // backup
            delete style[symbolProp];                 // delete
            style[symbolProp] = nestedRuleData;       // restore (re-insert at the last order)
        } // if
    } // for
}

const mergeableNestedAtRules = ['@media', '@supports', '@document', '@global'];
// const unmergeableNestedAtRules = ['@keyframes', '@font-face', '@fallbacks'];
export const isMergeableNestedAtRule = (finalSelector: CssFinalSelector) => mergeableNestedAtRules.some((at) => finalSelector.startsWith(at));

type GroupByFinalSelectorEntry = readonly [symbol, CssFinalSelector|null];
const groupByFinalSelector = (accum: Map<CssFinalSelector|null, symbol[]>, [symbolProp, finalSelector]: GroupByFinalSelectorEntry) => {
    if (!finalSelector)        return accum; // skip empty entry
    if (finalSelector === '&') return accum; // ignore only_parentSelector
    
    
    
    if (
        // nested rules:
        finalSelector.includes('&')
        ||
        // conditional rules & globals:
        isMergeableNestedAtRule(finalSelector)
    ) {
        // mergeable rules:
        let group = accum.get(finalSelector);             // get an existing collector
        if (!group) accum.set(finalSelector, group = []); // create a new collector
        group.push(symbolProp);
    }
    else {
        // unmergeable rules:
        let group = accum.get(null);             // get an existing collector
        if (!group) accum.set(null, group = []); // create a new collector
        group.push(symbolProp);
    }
    return accum;
}
export const mergeNested  = (style: CssStyle): void => {
    const symbolProps = Object.getOwnPropertySymbols(style);
    if (!symbolProps.length) return; // there's no (nested) Rule => nothing to do
    
    
    
    // group (nested) Rule(s) by final selector:
    const symbolPropGroupByFinalSelector = (
        symbolProps
        .map((symbolProp): GroupByFinalSelectorEntry => [
            symbolProp,
            finalizeSelector(style, symbolProp)
        ])
        .reduce(
            groupByFinalSelector,
            new Map<CssFinalSelector|null, symbol[]>()
        )
    );
    
    
    
    const unmergeableSymbolGroup = symbolPropGroupByFinalSelector.get(null);
    if (unmergeableSymbolGroup) {
        symbolPropGroupByFinalSelector.delete(null); // remove from the Map, so it wouldn't be grouped later
        
        for (const symbolProp of unmergeableSymbolGroup) {
            const nestedStyle       = style[symbolProp][1]; // [0]: CssRawSelector|CssFinalSelector // [1]: CssStyle
            const mergedNestedStyle = mergeStyles(nestedStyle);
            
            
            
            if (mergedNestedStyle) {
                // update:
                style[symbolProp] = [
                    style[symbolProp][0], // still the same // [0]: CssRawSelector|CssFinalSelector // [1]: CssStyle
                    mergedNestedStyle     // update CssStyle to mergedNestedStyle
                ];
            }
            else {
                // delete:
                delete style[symbolProp];
            } // if
        } // for
    } // if
    
    
    
    //#region merge duplicates (nested) mergeable Rule(s) to unique ones
    for (const mergeableSymbolGroup of symbolPropGroupByFinalSelector.values()) {
        // merge multiple styles from mergeableSymbolGroup's members to single style:
        const nestedStyles       = mergeableSymbolGroup.map((symbolProp) => style[symbolProp][1]); // [0]: CssRawSelector|CssFinalSelector // [1]: CssStyle
        const mergedNestedStyles = mergeStyles(nestedStyles);
        
        
        
        const lastMember = mergeableSymbolGroup[mergeableSymbolGroup.length - 1];
        if (mergedNestedStyles) {
            // update last member
            style[lastMember] = [
                style[lastMember][0], // still the same // [0]: CssRawSelector|CssFinalSelector // [1]: CssStyle
                mergedNestedStyles    // update CssStyle to mergedNestedStyles
            ];
        }
        else {
            // mergedNestedStyles is empty => delete last member
            delete style[lastMember];
        } // if
        
        // delete first member to second last member:
        for (const symbolProp of mergeableSymbolGroup.slice(0, -1)) delete style[symbolProp];
    } // for
    //#endregion merge duplicates (nested) mergeable Rule(s) to unique ones
}



/**
 * Merges `SingleOrArray<CssStyle>` to single `CssStyle`.
 * @returns A `CssStyle` represents the merged `styles`.
 * -or-  
 * `null` represents an empty `CssStyle`.
 */
export const mergeStyles = (styles: SingleOrArray<CssStyle>): CssStyle|null => {
    if (!Array.isArray(styles)) {
        const mergedStyles: CssStyle = { ...styles }; // shallow clone before mutate
        ensureSymbolPropsUpdated(mergedStyles); // mutate
        mergeParent(mergedStyles);              // mutate
        mergeNested(mergedStyles);              // mutate
        
        
        
        // do not return an empty style, instead return null:
        if ((!Object.keys(mergedStyles).length) && (!Object.getOwnPropertySymbols(mergedStyles).length)) return null; // an empty object => return `null`
        
        // return non empty style:
        return mergedStyles;
    } // if
    
    
    
    const mergedStyles: CssStyle = {};
    for (const style of styles) { // shallow iterating array
        ensureSymbolPropsUpdated(style);   // mutate
        
        // merge current style to single big style (string props + symbol props):
        mergeLiteral(mergedStyles, style); // mutate
        
        // to preserve the order sequence of only_parentSelector
        // we need to unwrap the only_parentSelector before merging with next style
        // by calling `mergeParent()`, the only_parentSelector are unwrapped
        mergeParent(mergedStyles);         // mutate
    } // for
    mergeNested(mergedStyles);             // mutate
    
    
    
    // do not return an empty style, instead return null:
    if ((!Object.keys(mergedStyles).length) && (!Object.getOwnPropertySymbols(mergedStyles).length)) return null; // an empty object => return `null`
    
    // return non empty style:
    return mergedStyles;
}
