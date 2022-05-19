// cssfn:
import type {
    // types:
    OptionalOrBoolean,
    
    ValueOf,
}                           from '@cssfn/types'
import type {
    // css custom properties:
    CssCustomProps,
    
    
    
    // css known (standard) properties:
    CssKnownProps,
    
    
    
    // cssfn properties:
    CssRule,
    CssRuleMap,
    
    CssStyle,
    CssStyleMap,
    CssStyleCollection,
    
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

export function* filterOnlyRuleKeys(keys: IterableIterator<keyof CssCustomProps|keyof CssKnownProps|keyof CssRule>): Generator<keyof CssRule> {
    for (const propName of keys) {
        if (typeof(propName) === 'symbol') yield propName; // found a symbol prop
    } // for
}
export function* filterOnlyPropKeys(keys: IterableIterator<keyof CssCustomProps|keyof CssKnownProps|keyof CssRule>): Generator<keyof CssCustomProps|keyof CssKnownProps> {
    for (const propName of keys) {
        if (typeof(propName) !== 'symbol') yield propName; // found a symbol prop
    } // for
}
export const hasRuleKeys = (keys: IterableIterator<keyof CssCustomProps|keyof CssKnownProps|keyof CssRule>): boolean => {
    for (const propName of keys) {
        if (typeof(propName) === 'symbol') return true; // found a symbol prop
    } // for
    
    return false; // not found
}
export const hasPropKeys = (keys: IterableIterator<keyof CssCustomProps|keyof CssKnownProps|keyof CssRule>): boolean => {
    for (const propName of keys) {
        if (typeof(propName) !== 'symbol') return true; // found a symbol prop
    } // for
    
    return false; // not found
}



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

const finalizeSelector = (style: CssRuleMap, symbolProp: symbol): CssFinalSelector|null => {
    const ruleData = style.get(symbolProp); // get existing prop (if any)
    if (ruleData === undefined) return null;
    const [selector, styles] = ruleData;
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
    
    
    
    //#region update (mutate) styles
    //#region update (primary) SelectorRule
    if (finalSelector) {
        style.set(symbolProp, [
            finalSelector, // update CssRawSelector to CssFinalSelector
            styles         // still the same styles
        ]);
    }
    else {
        style.delete(symbolProp); // delete existing CssRawSelector
    } // if
    //#endregion update (primary) SelectorRule
    
    
    
    //#region update (additional) AtRule|PropRule
    const additionalFinalProps : CssFinalSelector[] = [ // take all rules except SelectorRule(s):
        ...(selectorGroupByRuleType.get(RuleType.AtRule   ) ?? []), // eg: @keyframes, @font-face (unmergeable nested @rule)
        ...(selectorGroupByRuleType.get(RuleType.PropRule ) ?? []), // eg: from, to, 25% (special properties of @keyframes rule)
    ];
    for (const additionalFinalProp of additionalFinalProps) {
        style.set(Symbol(), [
            additionalFinalProp, // update CssRawSelector to CssFinalSelector
            styles               // still the same styles
        ]);
    } // for
    //#endregion update (additional) AtRule|PropRule
    //#endregion update (mutate) styles
    
    
    
    // return the result:
    return finalSelector;
}



export const mergeLiteral = (style: CssStyleMap, newStyle: CssStyleMap): void => {
    for (const [propName, propValue] of (newStyle as Map<keyof CssStyle, ValueOf<CssStyle>>)) {
        style.delete(propName as any);                // delete the old prop (if any), so the new prop always placed at the end of LiteralObject
        style.set(propName as any, propValue as any); // add/overwrite
    } // for
}



const ensureSymbolPropsUpdated = (style: CssStyleMap): void => {
    // render CssRawSelector to CssFinalSelector (if any)
    for (const symbolProp of filterOnlyRuleKeys(style.keys())) {
        finalizeSelector(style, symbolProp);
    } // for
}
export const mergeParent  = (style: CssStyleMap): void => {
    let needToReorderOtherSymbolProps = false;
    for (const symbolProp of Array.from(filterOnlyRuleKeys(style.keys()))) { // convert to Array to prevent infinite loop caused by `style.set()`
        const finalSelector = finalizeSelector(style, symbolProp);
        if (finalSelector === '&') { // found only_parentSelector
            /* move the CssProps and (nested)Rules from only_parentSelector to current style */
            
            
            
            const [, styles]         = style.get(symbolProp)!;
            const mergedParentStyles = mergeStyles(styles);
            if (mergedParentStyles) {
                if (!needToReorderOtherSymbolProps) {
                    /* if mergedParentStyles has any (nested) Rule => all (nested) Rule in current style need to rearrange to preserve the order */
                    if (hasRuleKeys(mergedParentStyles.keys())) needToReorderOtherSymbolProps = true;
                } // if
                
                
                
                mergeLiteral(style, mergedParentStyles); // merge into current style
            } // if
            style.delete(symbolProp);                    // merged => delete source
        }
        else if (needToReorderOtherSymbolProps) {
            /* preserve the order of another (nested)Rules */
            
            
            
            const nestedRuleData = style.get(symbolProp)!; // backup
            style.delete(symbolProp);                      // delete
            style.set(symbolProp, nestedRuleData);         // restore (re-insert at the last order)
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
export const mergeNested  = (style: CssStyleMap): void => {
    const symbolProps = Array.from(filterOnlyRuleKeys(style.keys()));
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
            const ruleData     = style.get(symbolProp)!;
            const styles       = ruleData[1]; // [0]: CssRawSelector|CssFinalSelector // [1]: CssStyleCollection
            const mergedStyles = mergeStyles(styles);
            
            
            
            if (mergedStyles) {
                // update:
                style.set(symbolProp, [
                    ruleData[0], // still the same // [0]: CssRawSelector|CssFinalSelector // [1]: CssStyleCollection
                    
                    // TODO: make more efficient by eliminating type conversion:
                    Object.fromEntries(mergedStyles) as unknown as CssStyle // update CssStyleCollection to mergedStyles
                ]);
            }
            else {
                // delete:
                style.delete(symbolProp);
            } // if
        } // for
    } // if
    
    
    
    //#region merge duplicates (nested) mergeable Rule(s) to unique ones
    for (const mergeableSymbolGroup of symbolPropGroupByFinalSelector.values()) {
        // merge styles from mergeableSymbolGroup's members to single style:
        const multipleStyles = mergeableSymbolGroup.map((symbolProp) => style.get(symbolProp)![1]); // [0]: CssRawSelector|CssFinalSelector // [1]: CssStyleCollection
        const mergedStyles   = mergeStyles(multipleStyles);
        
        
        
        const lastMember = mergeableSymbolGroup[mergeableSymbolGroup.length - 1];
        if (mergedStyles) {
            const ruleData = style.get(lastMember)!;
            
            // update last member
            style.set(lastMember, [
                ruleData[0], // still the same // [0]: CssRawSelector|CssFinalSelector // [1]: CssStyleCollection
                
                // TODO: make more efficient by eliminating type conversion:
                Object.fromEntries(mergedStyles) as unknown as CssStyle // update CssStyleCollection to mergedStyles
            ]);
        }
        else {
            // mergedStyles is empty => delete last member
            style.delete(lastMember);
        } // if
        
        // delete first member to second last member:
        for (const symbolProp of mergeableSymbolGroup.slice(0, -1)) style.delete(symbolProp);
    } // for
    //#endregion merge duplicates (nested) mergeable Rule(s) to unique ones
}



// TODO: not for export soon:
export const cssStyleToMap = (style: OptionalOrBoolean<CssStyle>): CssStyleMap|null => {
    if (!style || (style === true)) return null;
    
    
    
    // fetch string props:
    // const map = new Map(Object.entries(style)) as CssStyleMap; // slow!
    const map = new Map() as CssStyleMap;
    for (const propName in style) { // faster!
        const propName2 = propName as keyof Omit<CssStyle, symbol>;
        map.set(propName2 as any, style[propName2]);
    } //
    
    // fetch symbol props:
    for (const propName of Object.getOwnPropertySymbols(style)) {
        map.set(propName, style[propName]);
    } // for
    
    
    
    if (!map.size) return null;
    return map;
}



/**
 * Merges `CssStyleCollection` to single `CssStyle`.
 * @returns A `CssStyle` represents the merged `CssStyleCollection`.
 * -or-  
 * `null` represents an empty `CssStyle`.
 */
export const mergeStyles = (styles: CssStyleCollection): CssStyleMap|null => {
    /*
        CssStyleCollection = ProductOrFactoryOrDeepArray<OptionalOrBoolean<CssStyle>>
        CssStyleCollection = ProductOrFactory<OptionalOrBoolean<CssStyle>> | ProductOrFactoryDeepArray<OptionalOrBoolean<CssStyle>>
        typeof             = -------- nullable_object or function -------- | ---------------------- an array ----------------------
    */
    
    
    
    if (!Array.isArray(styles)) {
        // nullable_object or function => ProductOrFactory<OptionalOrBoolean<CssStyle>>
        
        const styleValue: CssStyleMap|null = cssStyleToMap(
            (typeof(styles) === 'function')
            ?
            styles() // a function => Factory<OptionalOrBoolean<CssStyle>>
            :
            styles   // a product  => OptionalOrBoolean<CssStyle>
        );
        if (!styleValue?.size) return null; // empty style => return `null`
        
        
        
        const mergedStyles = styleValue;
        ensureSymbolPropsUpdated(mergedStyles); // mutate
        mergeParent(mergedStyles);              // mutate
        mergeNested(mergedStyles);              // mutate
        
        
        
        // do not return an empty style, instead return null:
        if (!mergedStyles?.size) return null; // an empty style => return `null`
        
        // return non empty style:
        return mergedStyles;
    } // if
    
    
    
    const mergedStyles = new Map() as CssStyleMap;
    for (const subStyles of styles) { // shallow iterating array
        const subStyleValue: CssStyleMap|null = (
            Array.isArray(subStyles)
            ?
            // deep iterating array
            mergeStyles(subStyles) // an array => ProductOrFactoryDeepArray<OptionalOrBoolean<CssStyle>> => recursively `mergeStyles()`
            :
            // not an array => nullable_object or function => ProductOrFactory<OptionalOrBoolean<CssStyle>>
            cssStyleToMap(
                (typeof(subStyles) === 'function')
                ?
                subStyles() // a function => Factory<OptionalOrBoolean<CssStyle>>
                :
                subStyles   // a product  => OptionalOrBoolean<CssStyle>
            )
        );
        if (!subStyleValue?.size) continue; // empty style => skip
        
        
        
        ensureSymbolPropsUpdated(subStyleValue);   // mutate
        
        // merge current style to single big style (string props + symbol props):
        mergeLiteral(mergedStyles, subStyleValue); // mutate
        
        // to preserve the order sequence of only_parentSelector
        // we need to unwrap the only_parentSelector before merging with next subStyles
        // by calling `mergeParent()`, the only_parentSelector are unwrapped
        mergeParent(mergedStyles);                 // mutate
    } // for
    mergeNested(mergedStyles);                     // mutate
    
    
    
    // do not return an empty style, instead return null:
    if (!mergedStyles?.size) return null; // an empty style => return `null`
    
    // return non empty style:
    return mergedStyles;
}
