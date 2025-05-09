// Cssfn:
import {
    // Cssfn properties:
    type CssRuleData,
    
    type CssFinalRuleMap,
    
    type CssUnionKey,
    type CssUnionValue,
    
    type CssStyleMap,
    type CssFinalStyleMap,
    type CssStyleCollection,
    
    type CssSelector,
    type CssSelectorCollection,
    
    type CssRawSelector,
    type CssFinalSelector,
}                           from '@cssfn/css-types'
import {
    // Types:
    type SelectorGroup,
    
    
    
    // Parses:
    parseSelectors,
    
    
    
    // Creates & tests:
    isNotEmptySelectors,
    
    
    
    // Renders:
    selectorsToString,
}                           from '@cssfn/css-selectors'

// Internals:
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



const finalizeSelector = (style: CssStyleMap, ruleKey: symbol): CssFinalSelector|null => {
    const ruleData = style.get(ruleKey); // get existing prop (if any)
    if (ruleData === undefined) return null;
    const selector = ruleData[0]; // [0]: undefined|CssRawSelector|CssFinalSelector // [1]: CssStyleCollection
    if (isFinalSelector(selector)) return selector;
    
    
    
    /*
        Because `finalizeSelector()` is frequently called and the `selector` is mostly already *finalized*,
        to improve performance: split the common logic at the above and the complex logic to a separate `finalizeSelectorFurther()` call.
    */
    return finalizeSelectorFurther(style, selector, ruleData, ruleKey);
}

const enum RuleType {
    SelectorRule, // &.foo  .boo&  .foo&.boo
    AtRule,       // `@media`
    PropRule,     // `from`, `to`, `25%`
    Shorthand,    // .foo, :hover
}
const getRuleType = (selector: CssSelector): RuleType => {
    if (selector[0] === '@')    return RuleType.AtRule;
    if (selector[0] === ' ')    return RuleType.PropRule;
    if (selector.includes('&')) return RuleType.SelectorRule;
    return RuleType.Shorthand;
}
interface GroupedSelectorsByRuleType {
    selectors : CssSelector[]|undefined,
    others    : CssSelector[]|undefined,
}
const groupSelectorsByRuleType = (selectors: CssSelectorCollection) : GroupedSelectorsByRuleType => {
    const grouped : GroupedSelectorsByRuleType = { selectors: undefined, others: undefined };
    for (let selector of flat(selectors)) {
        // conditions:
        if (!isNotFalsySelector(selector)) continue; // falsy selector => ignore
        
        
        
        // determine the type of the selector:
        let ruleType = getRuleType(selector);
        
        
        
        // normalize the selector:
        switch (ruleType) {
            case RuleType.PropRule:
                selector = selector.slice(1);     // remove prefixed space
                break;
            
            case RuleType.Shorthand:              // shorthand of SelectorRule
                ruleType = RuleType.SelectorRule; // default to (nested) SelectorRule
                selector = `&${selector}`;        // :active => &:active
                break;
            
            // case RuleType.SelectorRule:
            // case RuleType.AtRule:
            //     // no need to normalize
            //     break;
        } // switch
        
        
        
        // grouping:
        const groupKey : keyof GroupedSelectorsByRuleType = (
            (ruleType === RuleType.SelectorRule)
            ?
            'selectors' // &.foo  .boo&  .foo&.boo
            :
            'others'    // `@media` // `from`, `to`, `25%`
        );
        const group = grouped[groupKey];    // get an existing collector (if any)
        if (!group) {
            grouped[groupKey] = [selector]; // create a new collector
        }
        else {
            group.push(selector);           // append to the existing collector
        } // if
    } // for
    return grouped;
}

const parseSelectorsFromString = (selectorString: CssSelector): SelectorGroup => {
    const selectorGroup = parseSelectors(selectorString);
    if (!selectorGroup) throw Error(`parse selector error: ${selectorString}`);
    return selectorGroup;
}

const finalizeSelectorFurther = (style: CssStyleMap, rawSelector: CssRawSelector|undefined, ruleData: CssRuleData, ruleKey: symbol): CssFinalSelector|null => {
    // extract raw selector:
    const [selectors, options] = rawSelector ?? ['&', undefined]; // selector of `undefined` is the shortcut of '&' without any options
    
    
    
    // group selectors by rule type:
    const groupedSelectorsByRuleType = groupSelectorsByRuleType(selectors);
    
    
    
    // parse & populate selectors:
    let populatedSelectors: SelectorGroup|null = null;
    const selectorRules = groupedSelectorsByRuleType.selectors;
    if (selectorRules) {
        for (const cssSelectorString of selectorRules) { // take only the SelectorRule(s)
            const selectors = parseSelectorsFromString(cssSelectorString);
            if (!populatedSelectors) {
                populatedSelectors = selectors;
            }
            else {
                populatedSelectors.push(...selectors);
                // HINT: prevent the `selectors` object to GC at time_expensive_moment
            } // if
        } // for
    } // if
    
    // merge selectors & adjust specificityWeight, performGrouping, etc:
    const mergedSelectors = populatedSelectors ? mergeSelectors(populatedSelectors, options) : null;
    // HINT: prevent the `populatedSelectors` object to GC at time_expensive_moment
    
    // render back to string:
    const finalSelector : CssFinalSelector|null = isNotEmptySelectors(mergedSelectors) ? selectorsToString(mergedSelectors) : null;
    // HINT: prevent the `mergedSelectors` object to GC at time_expensive_moment
    
    
    
    //#region update (mutate) styles
    const styles = ruleData[1]; // [0]: undefined|CssRawSelector|CssFinalSelector // [1]: CssStyleCollection
    
    
    
    //#region update (primary) SelectorRule
    if (finalSelector) {
        style.set(ruleKey, [
            finalSelector, // update CssRawSelector to CssFinalSelector
            styles         // still the same styles
        ]);
    }
    else {
        style.delete(ruleKey); // delete existing CssRawSelector
    } // if
    //#endregion update (primary) SelectorRule
    
    
    
    //#region update (additional) AtRule|PropRule
    const otherRules = groupedSelectorsByRuleType.others;
    if (otherRules) { // `@media` // `from`, `to`, `25%`
        for (const additionalFinalProp of (otherRules as CssFinalSelector[])) {
            style.set(Symbol(), [
                additionalFinalProp, // update CssRawSelector to CssFinalSelector
                styles               // still the same styles
            ]);
        } // for
    } // if
    //#endregion update (additional) AtRule|PropRule
    //#endregion update (mutate) styles
    
    
    
    // return the result:
    return finalSelector;
}



export const mergeLiteral = (style: CssStyleMap, newStyle: CssStyleMap): void => {
    // for (const [propName, propValue] of newStyle) { // slow
    let propName  : CssUnionKey;
    let propValue : CssUnionValue;
    for (propName of newStyle.keys()) { // non cached enumerator, optimized for enumerating ONE TIMES
        propValue = newStyle.get(propName as any);
        // `undefined` => preserves existing prop (if any)
        // `null`      => delete    existing prop (if any)
        if (propValue === undefined) continue;
        
        
        
        style.delete(propName as any);                // delete the old prop (if any), so the new prop always placed at the end of CssStyleMap
        style.set(propName as any, propValue as any); // add/overwrite
    } // for
}



const ensureRulesUpdated = (style: CssStyleMap): void => {
    // render CssRawSelector to CssFinalSelector (if any)
    for (const ruleKey of style.ruleKeys) {
        finalizeSelector(style, ruleKey);
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
    const ruleKeys = Object.getOwnPropertySymbols(styles);
    if (ruleKeys.length !== 1) return undefined; // not exactly one nested_prop => ignore
    
    
    
    const ruleKey = ruleKeys[0];
    const [selector, nestedStyles] = styles[ruleKey];
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
    let   needToReorderTheRestRules                    = false;
    let   needToScheduleCleanupMergedParentStylesCache = false;
    let   ruleKey                                      : symbol;
    const parentStyleKeys                              : Exclude<CssStyleCollection, undefined|null|boolean>[] = [];
    try {
        for (ruleKey of style.ruleKeys) { // the `style.ruleKeys` is an array, and wouldn't changed even if we mutate the `style` during iteration
            const finalSelector = finalizeSelector(style, ruleKey);
            if (finalSelector === '&') { // found only_parentSelector
                /* move the CssProps and (nested)Rules from only_parentSelector to current style */
                
                
                
                const parentRuleData = style.get(ruleKey)!;
                let styles           = parentRuleData[1]; // [0]: undefined|CssRawSelector|CssFinalSelector // [1]: CssStyleCollection
                if (isNotFalsyStyles(styles)) {
                    parentStyleKeys.splice(0); // clear
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
                            if (!needToReorderTheRestRules) {
                                /* if mergedParentStyles has any (nested) Rule => all the rest of (nested) Rule need to rearrange to preserve the order */
                                if (mergedParentStyles.hasRuleKeys) {
                                    needToReorderTheRestRules = true;
                                } // if
                            } // if
                            
                            
                            
                            mergeLiteral(style, mergedParentStyles); // merge into current style
                            // HINT: prevent the `mergedParentStyles` object to GC at time_expensive_moment
                        } // if
                    } // if
                } // if
                style.delete(ruleKey);                      // merged => delete source
                // HINT: prevent the `parentRuleData` object to GC at time_expensive_moment
            }
            else if (needToReorderTheRestRules) {
                /* preserve the order of another (nested)Rules */
                
                
                
                const nestedRuleData = style.get(ruleKey)!; // backup
                style.delete(ruleKey);                      // delete
                style.set(ruleKey, nestedRuleData);         // restore (re-insert at the last order)
            } // if
        } // for
    }
    finally {
        if (needToScheduleCleanupMergedParentStylesCache) {
            scheduleCleanupMergedParentStylesCache();
        } // if
    } // try
}

const mergeableNestedAtRules = [
    // conditional responsives:
    '@media',
    '@container',
    
    // conditional compatibility:
    '@supports',
    
    // conditional deprecated:
    '@document',
    
    // grouping:
    // '@layer', // do not merge anonymous layers, the orders are important
    
    // unscope selector:
    '@global',
];
// const unmergeableNestedAtRules = ['@keyframes', '@font-face', '@property', '@fallback'];
export const isMergeableNestedAtRule = (finalSelector: CssFinalSelector) => mergeableNestedAtRules.some((at) => finalSelector.startsWith(at));

type GroupedRules = readonly [symbol, CssFinalSelector, CssStyleCollection]
const groupRulesByFinalSelector = (style: CssStyleMap) : Map<CssFinalSelector|null, GroupedRules[]> => {
    const grouped = new Map<CssFinalSelector|null, GroupedRules[]>();
    for (const ruleKey of style.ruleKeys) {
        // conditions:
        const finalSelector = finalizeSelector(style, ruleKey);
        if (!finalSelector)        continue; // skip empty finalSelector
        if (finalSelector === '&') continue; // ignore only_parentSelector
        
        
        
        const styles = style.get(ruleKey)![1]; // [0]: undefined|CssRawSelector|CssFinalSelector // [1]: CssStyleCollection
        
        
        
        // grouping:
        const groupKey : CssFinalSelector|null = (
            (
                // nested rules:
                finalSelector.includes('&')
                ||
                // conditional rules & globals:
                isMergeableNestedAtRule(finalSelector)
            )
            ?
            finalSelector // mergeable rules
            :
            null          // unmergeable rules
        );
        const group = grouped.get(groupKey);                           // get an existing collector (if any)
        if (!group) {
            grouped.set(groupKey, [[ruleKey, finalSelector, styles]]); // create a new collector
        }
        else {
            group.push([ruleKey, finalSelector, styles]);              // append to the existing collector
        } // if
    } // for
    return grouped;
}
const selectStylesFromGroupedRules = (mergeableRule: GroupedRules) => mergeableRule[2]; // [0]: ruleKey // [1]: finalSelector // [2]: styles
export const mergeNested  = (style: CssStyleMap): void => {
    if (!style.hasRuleKeys) return; // there's no (nested) Rule => nothing to do
    
    
    
    // group (nested) Rule(s) by final selector:
    const groupedRulesByFinalSelector = groupRulesByFinalSelector(style);
    
    
    
    // simplify un-mergeable Rule(s):
    const unmergeableRules = groupedRulesByFinalSelector.get(null);
    if (unmergeableRules) {
        groupedRulesByFinalSelector.delete(null); // remove from the Map, so it wouldn't be grouped later
        
        for (const [ruleKey, finalSelector, styles] of unmergeableRules) {
            const mergedStyles = isFinalStyleMap(styles) ? styles : mergeStyles(styles);
            
            
            
            // HINT: prevent the `style.get(ruleKey)` object to GC at time_expensive_moment
            if (mergedStyles) {
                // update:
                (style as unknown as CssFinalRuleMap).set(ruleKey, [
                    finalSelector,
                    mergedStyles // update CssStyleCollection to CssFinalStyleMap
                ]);
            }
            else if (finalSelector.startsWith('@keyframes ')) {
                // the @keyframes is allowed to have an empty style
                // update:
                (style as unknown as CssFinalRuleMap).set(ruleKey, [
                    finalSelector,
                    new CssStyleMapImpl() as unknown as CssFinalStyleMap // an empty style
                ]);
            }
            else {
                // delete:
                style.delete(ruleKey);
            } // if
        } // for
    } // if
    
    
    
    // simplify & merge some Rule(s) within the same selector to single Rule:
    for (const mergeableRules of groupedRulesByFinalSelector.values()) {
        // merge styles from mergeableRules's members to single style:
        const populatedStyles = (
            mergeableRules
            .map(selectStylesFromGroupedRules)
        );
        const mergedStyles = (
            ((populatedStyles.length === 1) && isFinalStyleMap(populatedStyles[0])) // a singular CssFinalStyleMap
            ?
            populatedStyles[0]           // a singular CssFinalStyleMap
            :
            mergeStyles(populatedStyles) // a multiple (CssStyleCollection|CssFinalStyleMap)
        );
        
        
        
        const lastMember  = mergeableRules[mergeableRules.length - 1];
        const lastRuleKey = lastMember[0]; // [0]: ruleKey // [1]: finalSelector // [2]: styles
        if (mergedStyles) {
            // update last member:
            (style as unknown as CssFinalRuleMap).set(lastRuleKey, [
                lastMember[1], // [0]: ruleKey // [1]: finalSelector // [2]: styles
                mergedStyles // update CssStyleCollection to CssFinalStyleMap
            ]);
        }
        else {
            // mergedStyles is empty => delete last member
            style.delete(lastRuleKey);
        } // if
        
        // delete first member to second_last_member:
        for (const [ruleKey] of mergeableRules.slice(0, -1)) style.delete(ruleKey);
        // HINT: prevent the `ruleKey(s)` object to GC at time_expensive_moment
        // for (const [ruleKey] of mergeableRules) { /*defer*/ }
    } // for
}



/**
 * Merges `CssStyleCollection` to single `CssStyle`.
 * @returns A `CssStyle` represents the merged `CssStyleCollection`.
 * -or-  
 * `null` represents an empty `CssStyle`.
 */
export const mergeStyles = (styles: CssStyleCollection | (CssStyleCollection|CssFinalStyleMap)[]): CssFinalStyleMap|null => {
    if (!Array.isArray(styles)) {
        // nullable_object or function => MaybeLazy<OptionalOrBoolean<CssStyle>>
        
        const styleValue: CssStyleMap|null = cssStyleToMap(
            (typeof(styles) === 'function')
            ?
            styles() // a function => Lazy<OptionalOrBoolean<CssStyle>>
            :
            styles   // a product  => OptionalOrBoolean<CssStyle>
        );
        if (!styleValue?.size) return null; // empty style => return `null`
        
        
        
        const mergedStyles = styleValue;
        ensureRulesUpdated(mergedStyles);       // mutate
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
            (mergeStyles(subStyles) as unknown as (CssStyleMap|null)) // de-finalize // an array of CssFinalStyleMap|DeepArrayMaybeLazy<OptionalOrBoolean<CssStyle>> => recursively `mergeStyles()`
            :
            // not an array => CssFinalStyleMap or nullable_object or function => CssFinalStyleMap|MaybeLazy<OptionalOrBoolean<CssStyle>>
            (
                isFinalStyleMap(subStyles)
                ?
                (subStyles as unknown as CssStyleMap) // de-finalize
                :
                cssStyleToMap(
                    (typeof(subStyles) === 'function')
                    ?
                    subStyles() // a function => Lazy<OptionalOrBoolean<CssStyle>>
                    :
                    subStyles   // a product  => OptionalOrBoolean<CssStyle>
                )
            )
        );
        if (!subStyleValue?.size) continue; // empty style => skip
        
        
        
        ensureRulesUpdated(subStyleValue);         // mutate
        
        // merge current style to single big style (string props + symbol props):
        mergeLiteral(mergedStyles, subStyleValue); // mutate
        // HINT: prevent the `subStyleValue` object to GC at time_expensive_moment
        
        // to preserve the order sequence of only_parentSelector
        // we need to unwrap the only_parentSelector before merging with next `subStyleValue`
        // by calling `mergeParent()`, the only_parentSelector are unwrapped
        mergeParent(mergedStyles);                 // mutate
    } // for
    mergeNested(mergedStyles);                     // mutate
    
    
    
    // do not return an empty style, instead return null:
    if (!mergedStyles?.size) return null; // an empty style => return `null`
    
    // return non empty style:
    return mergedStyles as unknown as CssFinalStyleMap;
}
