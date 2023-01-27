// cssfn:
import type {
    // cssfn properties:
    CssFinalRuleMap,
    
    CssStyleMap,
    CssFinalStyleMap,
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
    isNotFalsySelector,
    isNotFalsyStyles,
    isStyle,
    isFinalStyleMap,
}                           from './utilities.js'
import {
    CssStyleMapImpl,
    cssStyleToMap,
}                           from './CssStyleMapImpl.js'
import {
    mergeSelectors,
}                           from './mergeSelectors.js'



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

const parseSelectorsFromString = (selectorString: CssSelector): SelectorGroup => {
    const selectorGroup = parseSelectors(selectorString);
    if (!selectorGroup) throw Error(`parse selector error: ${selectorString}`);
    return selectorGroup;
}
const finalizeSelector = (style: CssStyleMap, symbolProp: symbol): CssFinalSelector|null => {
    const ruleData = style.get(symbolProp); // get existing prop (if any)
    if (ruleData === undefined) return null;
    const [selector] = ruleData;
    if (isFinalSelector(selector)) return selector;
    
    
    
    // extract raw selector:
    const [selectors, options] = selector ?? ['&', undefined]; // selector of `undefined` is the shortcut of '&' without any options
    
    
    
    // group selectors by rule type:
    const selectorsString : CssSelector[] = (
        flat(selectors)
        .filter(isNotFalsySelector)
    );
    const selectorGroupByRuleType = selectorsString.reduce(
        groupByRuleType,
        new Map<RuleType, CssSelector[]>()
    );
    
    
    
    // parse selectors:
    const selectorGroup : SelectorGroup = (
        (selectorGroupByRuleType.get(RuleType.SelectorRule) ?? []) // take only the SelectorRule(s)
        .flatMap(parseSelectorsFromString)
    );
    // merge selectors:
    const mergedSelectors = mergeSelectors(selectorGroup, options);
    // render back to string:
    const finalSelector : CssFinalSelector|null = isNotEmptySelectors(mergedSelectors) ? selectorsToString(mergedSelectors) : null;
    
    
    
    const [, styles] = ruleData;
    
    
    
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
    for (const [propName, propValue] of newStyle) {
        // `undefined` => preserves existing prop (if any)
        // `null`      => delete    existing prop (if any)
        if (propValue === undefined) continue;
        
        
        
        style.delete(propName as any);                // delete the old prop (if any), so the new prop always placed at the end of LiteralObject
        style.set(propName as any, propValue as any); // add/overwrite
    } // for
}



const ensureSymbolPropsUpdated = (style: CssStyleMap): void => {
    // render CssRawSelector to CssFinalSelector (if any)
    for (const symbolProp of style.ruleKeys) {
        finalizeSelector(style, symbolProp);
    } // for
}
const containsOnlyParentSelector = (styles: CssStyleCollection|CssFinalStyleMap): CssStyleCollection => {
    // conditions:
    if (!isStyle(styles))         return undefined; // not a CssStyle object => ignore
    const stringPropsCount = Object.keys(styles).length;
    if (
        stringPropsCount            // has any_props  : 1, 2, 3, -or- many
        &&
        (
            (stringPropsCount >= 2) // has many_props :    2, 3, -or- many => ignore
            ||
            (!('' in styles))       // has one_prop of non_empty_string    => ignore
        )
    ) {
        return undefined; // ignore
    } // if
    const symbolProps = Object.getOwnPropertySymbols(styles);
    if (symbolProps.length !== 1) return undefined; // not exactly one nested_prop => ignore
    
    
    
    const symbolProp = symbolProps[0];
    const [selector, nestedStyles] = styles[symbolProp];
    if ((selector !== undefined) && (selector !== '&')) return undefined; // not a parentSelector (`undefined` => a shortcut of '&') => ignore
    return nestedStyles ?? null; // if `undefined` => convert to `null` to make different than *`undefined` means not_found*
}
let   mergedParentStylesCache = new WeakMap<Exclude<CssStyleCollection, undefined|null|boolean>, CssStyleMap|null>();
let   scheduleCleanupMergedParentStylesCacheToken = 0;
let   cancelCleanupMergedParentStylesCache : ReturnType<typeof setTimeout>|undefined = undefined;
const scheduleCleanupMergedParentStylesCache = (): void => {
    const scheduleCleanupMergedParentStylesCacheTokenLocal = (scheduleCleanupMergedParentStylesCacheToken === Number.MAX_SAFE_INTEGER) ? 0 : (++scheduleCleanupMergedParentStylesCacheToken);
    scheduleCleanupMergedParentStylesCacheToken = scheduleCleanupMergedParentStylesCacheTokenLocal;
    Promise.resolve().then(() => {
        // conditions:
        if (scheduleCleanupMergedParentStylesCacheToken !== scheduleCleanupMergedParentStylesCacheTokenLocal) return; // token changed => a newer `scheduleCleanupMergedParentStylesCache()` call was made
        
        
        
        // actions:
        if (cancelCleanupMergedParentStylesCache) clearTimeout(cancelCleanupMergedParentStylesCache);
        cancelCleanupMergedParentStylesCache = setTimeout(scheduledCleanupMergedParentStylesCache, 10 * 1000);
    })
}
const scheduledCleanupMergedParentStylesCache = (): void => {
    mergedParentStylesCache = new WeakMap<Exclude<CssStyleCollection, undefined|null|boolean>, CssStyleMap|null>();
}
export const mergeParent  = (style: CssStyleMap): void => {
    let needToReorderTheRestSymbolProps              = false;
    let needToScheduleCleanupMergedParentStylesCache = false;
    try {
        for (const symbolProp of style.ruleKeys) {
            const finalSelector = finalizeSelector(style, symbolProp);
            if (finalSelector === '&') { // found only_parentSelector
                /* move the CssProps and (nested)Rules from only_parentSelector to current style */
                
                
                
                let [, styles]         = style.get(symbolProp)!;
                if (isNotFalsyStyles(styles)) {
                    const parentStyleKeys : Exclude<CssStyleCollection, undefined|null|boolean>[] = [];
                    if (!isFinalStyleMap(styles)) parentStyleKeys.push(styles);
                    
                    
                    
                    // efficiently dealing with *deep nested* only_parentSelector:
                    let deepStyles : CssStyleCollection = undefined;
                    while((deepStyles = containsOnlyParentSelector(styles)) !== undefined) {
                        styles = deepStyles;
                        if (isNotFalsyStyles(styles) && !isFinalStyleMap(styles)) parentStyleKeys.push(styles);
                    } // while
                    
                    
                    
                    if (isNotFalsyStyles(styles)) {
                        let mergedParentStyles: CssStyleMap|null;
                        if (isFinalStyleMap(styles)) {
                            mergedParentStyles = styles as unknown as CssStyleMap; // de-finalize
                        }
                        else {
                            const cached = mergedParentStylesCache.get(styles);
                            if (cached !== undefined) {
                                mergedParentStyles = cached;
                            }
                            else {
                                mergedParentStyles = mergeStyles(styles) as unknown as (CssStyleMap|null); // de-finalize
                                
                                
                                
                                // add to cache:
                                for (const parentStyleKey of parentStyleKeys) {
                                    mergedParentStylesCache.set(parentStyleKey, mergedParentStyles);
                                } // for
                                needToScheduleCleanupMergedParentStylesCache = true;
                            } // if
                        } // if
                        
                        
                        
                        if (mergedParentStyles) {
                            if (!needToReorderTheRestSymbolProps) {
                                /* if mergedParentStyles has any (nested) Rule => all the rest of (nested) Rule need to rearrange to preserve the order */
                                if (mergedParentStyles.hasRuleKeys) {
                                    needToReorderTheRestSymbolProps = true;
                                } // if
                            } // if
                            
                            
                            
                            mergeLiteral(style, mergedParentStyles); // merge into current style
                        } // if
                    } // if
                } // if
                style.delete(symbolProp);                      // merged => delete source
            }
            else if (needToReorderTheRestSymbolProps) {
                /* preserve the order of another (nested)Rules */
                
                
                
                const nestedRuleData = style.get(symbolProp)!; // backup
                style.delete(symbolProp);                      // delete
                style.set(symbolProp, nestedRuleData);         // restore (re-insert at the last order)
            } // if
        } // for
    }
    finally {
        if (needToScheduleCleanupMergedParentStylesCache) {
            scheduleCleanupMergedParentStylesCache();
        } // if
    } // try
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
    const symbolProps = style.ruleKeys;
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
            const styles       = ruleData[1]; // [0]: CssRawSelector|CssFinalSelector // [1]: CssStyleCollection|CssFinalStyleMap
            const mergedStyles = isFinalStyleMap(styles) ? styles : mergeStyles(styles);
            
            
            
            if (mergedStyles) {
                // update:
                (style as unknown as CssFinalRuleMap).set(symbolProp, [
                    // already been finalizeSelector() => CssRawSelector|CssFinalSelector => CssFinalSelector
                    ruleData[0] as CssFinalSelector, // [0]: CssRawSelector|CssFinalSelector // [1]: CssStyleCollection|CssFinalStyleMap
                    
                    mergedStyles // update CssStyleCollection to CssFinalStyleMap
                ]);
            }
            else if ((ruleData[0] as CssFinalSelector).startsWith('@keyframes ')) {
                // the @keyframes is allowed to have an empty style
                // update:
                (style as unknown as CssFinalRuleMap).set(symbolProp, [
                    // already been finalizeSelector() => CssRawSelector|CssFinalSelector => CssFinalSelector
                    ruleData[0] as CssFinalSelector, // [0]: CssRawSelector|CssFinalSelector // [1]: CssStyleCollection|CssFinalStyleMap
                    
                    new CssStyleMapImpl() as unknown as CssFinalStyleMap // an empty style
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
        const multipleStyles = (
            mergeableSymbolGroup
            .map((symbolProp) => {
                const ruleData = style.get(symbolProp)!;
                return ruleData[1]; // [0]: CssRawSelector|CssFinalSelector // [1]: CssStyleCollection|CssFinalStyleMap
            })
        );
        const mergedStyles = (
            ((multipleStyles.length === 1) && isFinalStyleMap(multipleStyles[0])) // a singular CssFinalStyleMap
            ?
            multipleStyles[0]           // a singular CssFinalStyleMap
            :
            mergeStyles(multipleStyles) // a multiple (CssStyleCollection|CssFinalStyleMap)
        );
        
        
        
        const lastMember = mergeableSymbolGroup[mergeableSymbolGroup.length - 1];
        if (mergedStyles) {
            const ruleData = style.get(lastMember)!;
            
            // update last member:
            (style as unknown as CssFinalRuleMap).set(lastMember, [
                // already been finalizeSelector() => CssRawSelector|CssFinalSelector => CssFinalSelector
                ruleData[0] as CssFinalSelector, // [0]: CssRawSelector|CssFinalSelector // [1]: CssStyleCollection|CssFinalStyleMap
                
                mergedStyles // update CssStyleCollection to CssFinalStyleMap
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



/**
 * Merges `CssStyleCollection` to single `CssStyle`.
 * @returns A `CssStyle` represents the merged `CssStyleCollection`.
 * -or-  
 * `null` represents an empty `CssStyle`.
 */
export const mergeStyles = (styles: CssStyleCollection | (CssStyleCollection|CssFinalStyleMap)[]): CssFinalStyleMap|null => {
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
        return mergedStyles as unknown as CssFinalStyleMap;
    } // if
    
    
    
    const mergedStyles : CssStyleMap = new CssStyleMapImpl();
    for (const subStyles of styles) { // shallow iterating array
        const subStyleValue: CssStyleMap|null = (
            Array.isArray(subStyles)
            ?
            // deep iterating array
            (mergeStyles(subStyles) as unknown as (CssStyleMap|null)) // de-finalize // an array of CssFinalStyleMap|ProductOrFactoryDeepArray<OptionalOrBoolean<CssStyle>> => recursively `mergeStyles()`
            :
            // not an array => CssFinalStyleMap or nullable_object or function => CssFinalStyleMap|ProductOrFactory<OptionalOrBoolean<CssStyle>>
            (
                isFinalStyleMap(subStyles)
                ?
                (subStyles as unknown as CssStyleMap) // de-finalize
                :
                cssStyleToMap(
                    (typeof(subStyles) === 'function')
                    ?
                    subStyles() // a function => Factory<OptionalOrBoolean<CssStyle>>
                    :
                    subStyles   // a product  => OptionalOrBoolean<CssStyle>
                )
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
    return mergedStyles as unknown as CssFinalStyleMap;
}
