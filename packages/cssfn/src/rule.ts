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



// processors:

const enum SpecificityWeightStatus {
    Fit,
    TooBig,
    TooSmall,
}
const calculateSpecificityWeightStatus = (pureSelector: PureSelector, minSpecificityWeight: number|null, maxSpecificityWeight: number|null): readonly [number, SpecificityWeightStatus] => {
    const specificityWeight = calculateSpecificity(pureSelector)[1];
    
    
    
    if ((minSpecificityWeight !== null) && (specificityWeight < minSpecificityWeight)) {
        return [specificityWeight, SpecificityWeightStatus.TooSmall];
    } // if
    
    
    
    if ((maxSpecificityWeight !== null) && (specificityWeight > maxSpecificityWeight)) {
        return [specificityWeight, SpecificityWeightStatus.TooBig];
    } // if
    
    
    
    return [specificityWeight, SpecificityWeightStatus.Fit];
}

const nthChildNSelector = pseudoClassSelector('nth-child', 'n');
export const adjustSpecificityWeight = (pureSelectorGroup: PureSelector[], minSpecificityWeight: number|null, maxSpecificityWeight: number|null): PureSelector[] => {
    if (
        (minSpecificityWeight == null)
        &&
        (maxSpecificityWeight == null)
    ) return pureSelectorGroup; // nothing to adjust
    
    
    
    //#region group selectors by specificity weight status
    type GroupBySpecificityWeightStatus = Map<SpecificityWeightStatus, { selector: PureSelector, specificityWeight: number }[]>
    const selectorGroupBySpecificityWeightStatus = pureSelectorGroup.reduce(
        (accum, pureSelector): GroupBySpecificityWeightStatus => {
            const [specificityWeight, weightStatus] = calculateSpecificityWeightStatus(pureSelector, minSpecificityWeight, maxSpecificityWeight);
            
            
            
            let group = accum.get(weightStatus);             // get an existing collector
            if (!group) accum.set(weightStatus, group = []); // create a new collector
            group.push({ selector: pureSelector, specificityWeight });
            return accum;
        },
        new Map<SpecificityWeightStatus, { selector: PureSelector, specificityWeight: number }[]>()
    );
    //#endregion group selectors by specificity weight status
    
    const fitSelectors      = selectorGroupBySpecificityWeightStatus.get(SpecificityWeightStatus.Fit     ) ?? [];
    const tooSmallSelectors = selectorGroupBySpecificityWeightStatus.get(SpecificityWeightStatus.TooSmall) ?? [];
    const tooBigSelectors   = selectorGroupBySpecificityWeightStatus.get(SpecificityWeightStatus.TooBig  ) ?? [];
    
    
    
    return createPureSelectorGroup(
        ...fitSelectors.map((group) => group.selector),
        
        ...tooSmallSelectors.map((group) => createPureSelector(
            ...group.selector,
            ...(new Array<SimpleSelector>((minSpecificityWeight ?? 1) - group.specificityWeight)).fill(
                group.selector
                .filter(isClassOrPseudoClassSelector) // only interested to class selector -or- pseudo class selector
                .filter((simpleSelector) => {         // pseudo class selector without parameters
                    const [
                        /*
                            selector tokens:
                            '&'  = parent         selector
                            '*'  = universal      selector
                            '['  = attribute      selector
                            ''   = element        selector
                            '#'  = ID             selector
                            '.'  = class          selector
                            ':'  = pseudo class   selector
                            '::' = pseudo element selector
                        */
                        // selectorToken
                        ,
                        
                        /*
                            selector name:
                            string = the name of [element, ID, class, pseudo class, pseudo element] selector
                        */
                        // selectorName
                        ,
                        
                        /*
                            selector parameter(s):
                            string        = the parameter of pseudo class selector, eg: nth-child(2n+3) => '2n+3'
                            array         = [name, operator, value, options] of attribute selector, eg: [data-msg*="you & me" i] => ['data-msg', '*=', 'you & me', 'i']
                            SelectorGroup = nested selector(s) of pseudo class [:is(...), :where(...), :not(...)]
                        */
                        selectorParams,
                    ] = simpleSelector;
                    
                    return (selectorParams === undefined);
                })
                .pop()            // take the last interested selector. It's okay to mutate the `selector` because it was cloned by `filter()`
                ??
                nthChildNSelector // or use `nth-child(n)`
            )
        )),
        
        ...tooBigSelectors.flatMap((group) => {
            const reversedSelector : PureSelector = group.selector.reverse(); // reverse & mutate the current `group.selector` array. It's okay to mutate the `selector` because it was cloned by `selector.filter()` when grouped
            
            type SelectorAccum = { remaining: number, eaten: PureSelector }
            const { eaten: reversedEatenSelector, remaining: remainingSpecificityWeight } : SelectorAccum = (
                reversedSelector.slice(0) // clone the `reversedSelector` because the `reduce()` uses `splice()` to break the iteration and we still need the `reversedSelector` later
                .reduce((accum, selectorEntry, index, array): SelectorAccum => {
                    if (accum.remaining <= 0) {
                        array.splice(1); // eject early by mutating iterated copy - it's okay to **mutate** the `array` because it already cloned at `slice(0)`
                        return accum;    // the final accumulation result
                    } // if
                    
                    
                    
                    if (isSimpleSelector(selectorEntry)) { // only interested of SimpleSelector, ignore the Combinator
                        const [
                            /*
                                selector tokens:
                                '&'  = parent         selector
                                '*'  = universal      selector
                                '['  = attribute      selector
                                ''   = element        selector
                                '#'  = ID             selector
                                '.'  = class          selector
                                ':'  = pseudo class   selector
                                '::' = pseudo element selector
                            */
                            selectorToken,
                            
                            /*
                                selector name:
                                string = the name of [element, ID, class, pseudo class, pseudo element] selector
                            */
                            selectorName,
                            
                            /*
                                selector parameter(s):
                                string        = the parameter of pseudo class selector, eg: nth-child(2n+3) => '2n+3'
                                array         = [name, operator, value, options] of attribute selector, eg: [data-msg*="you & me" i] => ['data-msg', '*=', 'you & me', 'i']
                                SelectorGroup = nested selector(s) of pseudo class [:is(...), :where(...), :not(...)]
                            */
                            // selectorParams,
                        ] = selectorEntry;
                        if (selectorToken === ':') { // pseudo class selector
                            switch (selectorName) {
                                case 'is':
                                case 'not':
                                case 'has':
                                    const specificityWeight = calculateSpecificity([selectorEntry])[1];
                                    accum.remaining -= specificityWeight; // reduce the counter (might be a negative value if `specificityWeight` > `accum.remaining`)
                                    break;
                                
                                case 'where':
                                    break; // don't reduce the counter
                                
                                default:
                                    accum.remaining--; // reduce the counter
                            } // switch
                        }
                        else if (['.', '[',].includes(selectorToken)) { // class selector or attribute selector
                            accum.remaining--; // reduce the counter
                        } // if
                    } // if
                    
                    
                    
                    accum.eaten.push(selectorEntry); // eat the current SimpleSelector or Combinator
                    return accum;
                }, ({
                    remaining : (group.specificityWeight - (maxSpecificityWeight ?? group.specificityWeight)),
                    eaten     : [],
                } as SelectorAccum))
            );
            
            
            
            // group the eatenSelector with :where(), so the specificity is zero:
            const [
                whereSelector,        // grouped selectors inside :where()
                ...pseudoElmSelectors // ungroupable pseudoElement selectors
            ] = groupSelector(
                reversedEatenSelector.reverse(), // re-reverse the reversedEatenSelector, so it becomes eatenSelector
                { selectorName: 'where' }        // :where
            );
            
            // un-eaten_selectors:where(eaten-selectors):
            whereSelector.unshift(
                ...reversedSelector.slice(reversedEatenSelector.length).reverse(), // insert the un-eaten selectors at the beginning
            );
            
            // if negative `remainingSpecificityWeight` => increase the specificity until zero
            if (remainingSpecificityWeight < 0) {
                whereSelector.push(
                    ...(new Array<SimpleSelector>(-remainingSpecificityWeight)).fill(
                        nthChildNSelector // or use `nth-child(n)`
                    ),
                );
            } // if
            
            // done:
            return createSelectorGroup(
                whereSelector,
                ...pseudoElmSelectors,
            ).filter(isNotEmptySelector);
        }),
    );
}



export interface SelectorOptions {
    groupSelectors       ?: boolean
    
    specificityWeight    ?: number|null
    minSpecificityWeight ?: number|null
    maxSpecificityWeight ?: number|null
}
const defaultSelectorOptions : Required<SelectorOptions> = {
    groupSelectors       : true,
    
    specificityWeight    : null,
    minSpecificityWeight : null,
    maxSpecificityWeight : null,
}
export const mergeSelectors = (selectorGroup: SelectorGroup, options: SelectorOptions = defaultSelectorOptions): SelectorGroup => {
    const {
        groupSelectors : doGroupSelectors = defaultSelectorOptions.groupSelectors,
        
        specificityWeight,
    } = options;
    const minSpecificityWeight = specificityWeight ?? options.minSpecificityWeight ?? null;
    const maxSpecificityWeight = specificityWeight ?? options.maxSpecificityWeight ?? null;
    
    
    
    // remove empty_selector(s) undefined|null|false|true|Selector(...only_emptySelectorEntry...) from selectorGroup,
    // so we only working with real_selector(s)
    const pureSelectorGroup: PureSelector[] = (
        selectorGroup
        .filter(isNotEmptySelector) // [ Selector...Selector... ]  =>  [ PureSelector...PureSelector... ]
    );
    
    
    
    // check for options before performing expensive transformation:
    if (
        (!doGroupSelectors || (pureSelectorGroup.length <= 1)) // do not perform grouping but still allow to adjust the specificity || only singular selector => nothing to group
        &&
        ((minSpecificityWeight === null) && (maxSpecificityWeight === null)) // no need to adjust the specificity
    ) return selectorGroup; // no grouping and no adjusting the specificity => nothing to do => returns the original
    
    
    
    // we need to unwrap the :is(...) and :where(...) before adjusting the specificity
    const normalizedSelectorGroup: PureSelector[] = (
        pureSelectorGroup
        .flatMap((selector) => ungroupSelector(selector)) // SelectorGroup               =>  PureSelectorGroup === Selector[] === [ Selector...Selector... ]
        .filter(isNotEmptySelector)                       // [ Selector...Selector... ]  =>  [ PureSelector...PureSelector... ]
    );
    
    
    
    // check for options before performing expensive transformation:
    if (
        (!doGroupSelectors || (normalizedSelectorGroup.length <= 1)) // do not perform grouping but still allow to adjust the specificity || only singular selector => nothing to group
        &&
        ((minSpecificityWeight === null) && (maxSpecificityWeight === null)) // no need to adjust the specificity
    ) return selectorGroup; // no grouping and no adjusting the specificity => nothing to do => returns the original
    
    
    
    // transform:
    const adjustedSelectorGroup: PureSelector[] = adjustSpecificityWeight(
        normalizedSelectorGroup
        ,
        minSpecificityWeight,
        maxSpecificityWeight
    );
    
    
    
    if (
        (!doGroupSelectors || (adjustedSelectorGroup.length <= 1)) // do not perform grouping || only singular selector => nothing to group
    ) return adjustedSelectorGroup; // no grouping => nothing to do => returns the adjusted specificity
    
    
    
    //#region group selectors by parent position
    const enum ParentPosition {
        OnlyParent,
        OnlyBeginParent,
        OnlyEndParent,
        RandomParent,
    }
    type GroupByParentPosition = Map<ParentPosition, PureSelector[]>
    const selectorGroupByParentPosition = adjustedSelectorGroup.reduce(
        (accum, pureSelector): GroupByParentPosition => {
            const position = ((): ParentPosition => {
                const hasFirstParent = ((): boolean => {
                    if (pureSelector.length < 1) return false;                  // at least 1 entry must exist, for the first_parent
                    
                    const firstSelectorEntry = pureSelector[0];                 // take the first entry
                    return isParentSelector(firstSelectorEntry);                // the entry must be ParentSelector
                })();
                
                const onlyParent      = hasFirstParent && (pureSelector.length === 1);
                if (onlyParent) return ParentPosition.OnlyParent;
                
                
                
                const hasMiddleParent = ((): boolean => {
                    if (pureSelector.length < 3) return false;                  // at least 3 entry must exist, the first & last are already reserved, the middle one is the middle_parent
                    
                    for (let index = 1, maxIndex = (pureSelector.length - 2); index <= maxIndex; index++) {
                        const middleSelectorEntry = pureSelector[index];        // take the 2nd_first_entry until the 2nd_last_entry
                        if (isParentSelector(middleSelectorEntry)) return true; // the entry must be ParentSelector, otherwise skip to next
                    } // for
                    
                    return false; // ran out of iterator => not found
                })();
                const hasLastParent = ((): boolean => {
                    const length = pureSelector.length;
                    if (length < 2) return false;                               // at least 2 entry must exist, the first is already reserved, the last one is the last_parent
                    
                    const lastSelectorEntry = pureSelector[length - 1];         // take the last entry
                    return isParentSelector(lastSelectorEntry);                 // the entry must be ParentSelector
                })();
                
                const onlyBeginParent = hasFirstParent && !hasMiddleParent && !hasLastParent;
                if (onlyBeginParent) return ParentPosition.OnlyBeginParent;
                
                const onlyEndParent   = !hasFirstParent && !hasMiddleParent && hasLastParent;
                if (onlyEndParent) return ParentPosition.OnlyEndParent;
                
                return ParentPosition.RandomParent;
            })();
            let group = accum.get(position);             // get an existing collector
            if (!group) accum.set(position, group = []); // create a new collector
            group.push(pureSelector);
            return accum;
        },
        new Map<ParentPosition, PureSelector[]>()
    );
    //#endregion group selectors by parent position
    
    const onlyParentSelectorGroup      = selectorGroupByParentPosition.get(ParentPosition.OnlyParent      ) ?? [];
    const onlyBeginParentSelectorGroup = selectorGroupByParentPosition.get(ParentPosition.OnlyBeginParent ) ?? [];
    const onlyEndParentSelectorGroup   = selectorGroupByParentPosition.get(ParentPosition.OnlyEndParent   ) ?? [];
    const randomParentSelectorGroup    = selectorGroupByParentPosition.get(ParentPosition.RandomParent    ) ?? [];
    
    
    
    type GroupByCombinator = Map<Combinator|null, PureSelectorGroup>
    const createGroupByCombinator = (fetch: (selector: PureSelector) => Combinator|null) => (accum: GroupByCombinator, selector: PureSelector): GroupByCombinator => {
        const combinator = fetch(selector);
        let group = accum.get(combinator);             // get an existing collector
        if (!group) accum.set(combinator, group = []); // create a new collector
        group.push(selector);
        return accum;
    };
    const groupedSelectorGroup = createSelectorGroup(
        // only ParentSelector
        // &
        !!onlyParentSelectorGroup.length && (
            onlyParentSelectorGroup[0] // just take the first one, the rest are guaranteed to be the same
        ),
        
        
        
        // ParentSelector at beginning
        // &aaa
        // &:is(aaa, bbb, ccc)
        ...((): SelectorGroup => {
            if (onlyBeginParentSelectorGroup.length <= 1) return onlyBeginParentSelectorGroup; // only contain one/no Selector, no need to group
            
            
            
            //#region group selectors by combinator
            const selectorGroupByCombinator = onlyBeginParentSelectorGroup.reduce(
                createGroupByCombinator((selector) => {
                    if (selector.length >= 2) {                           // at least 2 entry must exist, for the first_parent followed by combinator
                        const secondSelectorEntry = selector[1];          // take the first_second entry
                        if (isCombinator(secondSelectorEntry)) {          // the entry must be the same as combinator
                            return secondSelectorEntry;
                        } // if
                    } // if
                    
                    return null; // ungroupable
                }),
                new Map<Combinator|null, PureSelectorGroup>()
            );
            //#endregion group selectors by combinator
            return Array.from(selectorGroupByCombinator.entries()).flatMap(([combinator, selectors]) => {
                if (selectors.length <= 1) return selectors;  // only contain one/no Selector, no need to group
                if (selectors.filter((selector) => selector.every(isNotPseudoElementSelector)).length <= 1) return selectors;  // only contain one/no Selector without ::pseudo-element, no need to group
                
                
                
                const [isSelector, ...pseudoElmSelectors] = groupSelectors(
                    selectors
                    .filter(isNotEmptySelector) // remove empty Selector(s) in SelectorGroup
                    .map((selector) => selector.slice(
                        (
                            combinator
                            ?
                            2 // remove the first_parent & combinator
                            :
                            1 // remove the first_parent
                        )
                        +
                        (selector.some(isPseudoElementSelector) ? -1 : 0) // exception for ::pseudo-element => do not remove the first_parent
                    )),
                    { selectorName: 'is' }
                );
                return createSelectorGroup(
                    isNotEmptySelector(isSelector) && createSelector(
                        parentSelector(), // add a ParentSelector      before :is(...)
                        combinator,       // add a Combinator (if any) before :is(...)
                        ...isSelector,    // :is(...)
                    ),
                    ...pseudoElmSelectors,
                );
            });
        })(),
        
        
        
        // ParentSelector at end
        // aaa&
        // :is(aaa, bbb, ccc)&
        ...((): SelectorGroup => {
            if (onlyEndParentSelectorGroup.length <= 1) return onlyEndParentSelectorGroup; // only contain one/no Selector, no need to group
            
            
            
            //#region group selectors by combinator
            const selectorGroupByCombinator = onlyEndParentSelectorGroup.reduce(
                createGroupByCombinator((selector) => {
                    const length = selector.length;
                    if (length >= 2) {                                    // at least 2 entry must exist, for the combinator followed by last_parent
                        const secondSelectorEntry = selector[length - 2]; // take the last_second entry
                        if (isCombinator(secondSelectorEntry)) {          // the entry must be the same as combinator
                            return secondSelectorEntry;
                        } // if
                    } // if
                    
                    return null; // ungroupable
                }),
                new Map<Combinator|null, PureSelectorGroup>()
            );
            //#endregion group selectors by combinator
            return Array.from(selectorGroupByCombinator.entries()).flatMap(([combinator, selectors]) => {
                if (selectors.length <= 1) return selectors;  // only contain one/no Selector, no need to group
                if (selectors.filter((selector) => selector.every(isNotPseudoElementSelector)).length <= 1) return selectors;  // only contain one/no Selector without ::pseudo-element, no need to group
                
                
                
                const [isSelector, ...pseudoElmSelectors] = groupSelectors(
                    selectors
                    .filter(isNotEmptySelector) // remove empty Selector(s) in SelectorGroup
                    .map((selector) => selector.slice(0,
                        (
                            combinator
                            ?
                            -2 // remove the combinator & last_parent
                            :
                            -1 // remove the last_parent
                        )
                        +
                        (selector.some(isPseudoElementSelector) ? 1 : 0) // exception for ::pseudo-element => do not remove the last_parent
                    )),
                    { selectorName: 'is' }
                );
                return createSelectorGroup(
                    isNotEmptySelector(isSelector) && createSelector(
                        ...isSelector,    // :is(...)
                        combinator,       // add a Combinator (if any) after :is(...)
                        parentSelector(), // add a ParentSelector      after :is(...)
                    ),
                    ...pseudoElmSelectors,
                );
            });
        })(),
        
        
        
        // parent at random
        // a&aa, bb&b, c&c&c
        ...randomParentSelectorGroup,
    );
    
    
    
    return groupedSelectorGroup;
}



// rules:
/**
 * Defines a conditional style(s) that is applied when the specified `selector(s)` meets the conditions.
 * @returns A `Rule` represents a conditional style(s).
 */
export const rule = (rules: CssSelectorCollection, styles: CssStyleCollection, options: SelectorOptions = defaultSelectorOptions): CssRule => {
    const rulesString = (
        flat(rules)
        .filter((rule): rule is CssSelector => !!rule)
    );
    const enum RuleType {
        SelectorRule, // &.foo   .boo&   .foo&.boo
        AtRule,       // for `@media`
        PropRule,     // for `from`, `to`, `25%`
    }
    type GroupByRuleTypes = Map<RuleType, CssSelector[]>
    const rulesByTypes = rulesString.reduce(
        (accum, rule): GroupByRuleTypes => {
            let ruleType = ((): RuleType|null => {
                if (rule.startsWith('@')) return RuleType.AtRule;
                if (rule.startsWith(' ')) return RuleType.PropRule;
                if (rule.includes('&'))   return RuleType.SelectorRule;
                return null;
            })();
            switch (ruleType) {
                case RuleType.PropRule:
                    rule = rule.slice(1);
                    break;
                
                case null:
                    ruleType = RuleType.SelectorRule;
                    rule = `&${rule}`;
                    break;
            } // switch
            
            
            
            let group = accum.get(ruleType);             // get an existing collector
            if (!group) accum.set(ruleType, group = []); // create a new collector
            group.push(rule);
            return accum;
        },
        new Map<RuleType, CssSelector[]>()
    );
    
    
    
    const selectorList = (
        (rulesByTypes.get(RuleType.SelectorRule) ?? [])
        .flatMap((selector) => {
            const selectorList = parseSelectors(selector);
            if (!selectorList) throw Error(`parse selector error: ${selector}`);
            return selectorList;
        })
        .filter(isNotEmptySelector)
    );
    const mergedSelectorList = mergeSelectors(selectorList, options);
    
    
    
    return {
        ...(isNotEmptySelectors(mergedSelectorList) ? {
            [Symbol(
                selectorsToString(mergedSelectorList)
            )] : styles
        } : {}),
        
        ...Object.fromEntries(
            [
                ...(rulesByTypes.get(RuleType.AtRule   ) ?? []),
                ...(rulesByTypes.get(RuleType.PropRule ) ?? []),
            ].map((rule) => [
                Symbol(
                    rule
                ),
                styles
            ]),
        ),
    };
};
