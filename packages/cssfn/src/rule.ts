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
    CssSelectorOptions,
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



// rules:
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

/**
 * Defines a conditional style(s) that is applied when the specified `selectors` meets the conditions.
 * @returns A `Rule` represents a conditional style(s).
 */
export const rule = (selectors: CssSelectorCollection, styles: CssStyleCollection, options?: CssSelectorOptions): CssRule => {
    const selectorsString = (
        flat(selectors)
        .filter((selector): selector is CssSelector => (!!selector || (selector === '')) && (selector !== true))
    );
    const selectorGroupByRuleType = selectorsString.reduce(
        groupByRuleType,
        new Map<RuleType, CssSelector[]>()
    );
    
    
    
    const selectorGroup : SelectorGroup = (
        (selectorGroupByRuleType.get(RuleType.SelectorRule) ?? []) // take only the SelectorRule(s)
        .flatMap((selectorString) => {
            const selectorGroup = parseSelectors(selectorString);
            if (!selectorGroup) throw Error(`parse selector error: ${selectorString}`);
            return selectorGroup;
        })
    );
    const mergedSelectors = mergeSelectors(selectorGroup, options);
    
    
    
    return {
        ...(isNotEmptySelectors(mergedSelectors) ? {
            [Symbol(
                selectorsToString(mergedSelectors) // render back to string // TODO: render lazily
            )] : styles
        } : {}),
        
        ...Object.fromEntries(
            [ // take all rules except SelectorRule(s):
                ...(selectorGroupByRuleType.get(RuleType.AtRule   ) ?? []),
                ...(selectorGroupByRuleType.get(RuleType.PropRule ) ?? []),
            ]
            .map((selector) => [
                Symbol(
                    selector
                ),
                styles
            ]),
        ),
    };
}
