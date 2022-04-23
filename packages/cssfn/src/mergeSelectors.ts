// cssfn:
import type {
    // types:
    CssSelectorOptions,
}                           from '@cssfn/css-types'
import {
    // types:
    SimpleSelector,
    Combinator,
    Selector,
    SelectorGroup,
    PureSelector,
    
    
    
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
    isNotEmptySelector,
    
    
    
    // transforms:
    groupSelectors,
    ungroupSelector,
    
    
    
    // measures:
    calculateSpecificity,
}                           from '@cssfn/css-selectors'



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

type GroupBySpecificityWeightStatus        = Map<SpecificityWeightStatus, { selector: PureSelector, specificityWeight: number }[]>
const createGroupBySpecificityWeightStatus = (minSpecificityWeight: number|null, maxSpecificityWeight: number|null) => (accum: Map<SpecificityWeightStatus, {
    selector          : PureSelector
    specificityWeight : number
}[]>, pureSelector: PureSelector): GroupBySpecificityWeightStatus => {
    const [specificityWeight, weightStatus] = calculateSpecificityWeightStatus(pureSelector, minSpecificityWeight, maxSpecificityWeight);
    
    
    
    let group = accum.get(weightStatus);             // get an existing collector
    if (!group) accum.set(weightStatus, group = []); // create a new collector
    group.push({ selector: pureSelector, specificityWeight });
    return accum;
}

const nthChildNSelector = pseudoClassSelector('nth-child', 'n');
export const adjustSpecificityWeight = (pureSelectorGroup: PureSelector[], minSpecificityWeight: number|null, maxSpecificityWeight: number|null): PureSelector[] => {
    if (
        (minSpecificityWeight == null)
        &&
        (maxSpecificityWeight == null)
    ) return pureSelectorGroup; // nothing to adjust
    
    
    
    // group selectors by specificity weight status:
    const selectorGroupBySpecificityWeightStatus = pureSelectorGroup.reduce(
        createGroupBySpecificityWeightStatus(minSpecificityWeight, maxSpecificityWeight),
        new Map<SpecificityWeightStatus, { selector: PureSelector, specificityWeight: number }[]>()
    );
    
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
            
            
            
            const eatenSelector: PureSelector = reversedEatenSelector.reverse(); // re-reverse the reversedEatenSelector, so it becomes eatenSelector
            
            
            
            // group the eatenSelector with :where(), so the specificity is zero:
            const [
                whereSelector,        // grouped selectors inside :where()
                ...pseudoElmSelectors // ungroupable pseudoElement selectors
            ] = groupSelectors(
                ungroupSelector(eatenSelector),  // if wrapped with :is() or :where() => unwrap
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



const startsWithParent  = (pureSelector: PureSelector): boolean => {
    if (pureSelector.length < 1) return false;                  // at least 1 entry must exist, for the first_parent
    
    const firstSelectorEntry = pureSelector[0];                 // take the first entry
    return isParentSelector(firstSelectorEntry);                // the entry must be ParentSelector
}
const middlesWithParent = (pureSelector: PureSelector): boolean => {
    if (pureSelector.length < 3) return false;                  // at least 3 entry must exist, the first & last are already reserved, the middle one is the middle_parent
    
    for (let index = 1, maxIndex = (pureSelector.length - 2); index <= maxIndex; index++) {
        const middleSelectorEntry = pureSelector[index];        // take the 2nd_first_entry until the 2nd_last_entry
        if (isParentSelector(middleSelectorEntry)) return true; // the entry must be ParentSelector, otherwise skip to next
    } // for
    
    return false; // ran out of iterator => not found
}
const endsWithParent    = (pureSelector: PureSelector): boolean => {
    const length = pureSelector.length;
    if (length < 2) return false;                               // at least 2 entry must exist, the first is already reserved, the last one is the last_parent
    
    const lastSelectorEntry = pureSelector[length - 1];         // take the last entry
    return isParentSelector(lastSelectorEntry);                 // the entry must be ParentSelector
}
const enum ParentPosition {
    NoParent,
    OnlyParent,
    OnlyBeginParent,
    OnlyEndParent,
    RandomParent,
}
const calculateParentPosition  = (pureSelector: PureSelector): ParentPosition => {
    const hasStartsWithParent  = startsWithParent(pureSelector);
    
    const onlyParent           = hasStartsWithParent && (pureSelector.length === 1);
    if (onlyParent)      return ParentPosition.OnlyParent;
    
    const hasMiddlesWithParent = middlesWithParent(pureSelector);
    const hasEndsWithParent    = endsWithParent(pureSelector);
    
    const onlyBeginParent      = hasStartsWithParent && !hasMiddlesWithParent && !hasEndsWithParent;
    if (onlyBeginParent) return ParentPosition.OnlyBeginParent;
    
    const onlyEndParent        = !hasStartsWithParent && !hasMiddlesWithParent && hasEndsWithParent;
    if (onlyEndParent)   return ParentPosition.OnlyEndParent;
    
    const noParent             = !hasStartsWithParent && !hasMiddlesWithParent && !hasEndsWithParent;
    if (noParent)        return ParentPosition.NoParent;
    
    return ParentPosition.RandomParent;
}

type GroupByParentPosition     = Map<ParentPosition, PureSelector[]>
const groupByParentPosition    = (accum: Map<ParentPosition, PureSelector[]>, pureSelector: PureSelector): GroupByParentPosition => {
    const position = calculateParentPosition(pureSelector);
    
    
    
    let group = accum.get(position);             // get an existing collector
    if (!group) accum.set(position, group = []); // create a new collector
    group.push(pureSelector);
    return accum;
}

type GroupByCombinator        = Map<Combinator|null, PureSelector[]>
const createGroupByCombinator = (groupByCombinator: (pureSelector: PureSelector) => Combinator|null) => (accum: GroupByCombinator, pureSelector: PureSelector): GroupByCombinator => {
    const combinator = groupByCombinator(pureSelector);
    
    
    
    let group = accum.get(combinator);             // get an existing collector
    if (!group) accum.set(combinator, group = []); // create a new collector
    group.push(pureSelector);
    return accum;
}
const groupByPrefixCombinator = createGroupByCombinator(/* groupByCombinator: */(pureSelector) => {
    if (pureSelector.length >= 2) {                           // at least 2 entry must exist, for the first_parent suffixed by combinator
        const secondSelectorEntry = pureSelector[1];          // take the second_first entry
        if (isCombinator(secondSelectorEntry)) {              // the entry must be Combinator
            return secondSelectorEntry;
        } // if
    } // if
    
    return null; // parent_selector not suffixed by combinator (&>) => ungroupable
})
const groupBySuffixCombinator = createGroupByCombinator(/* groupByCombinator: */(pureSelector) => {
    const length = pureSelector.length;
    if (length >= 2) {                                        // at least 2 entry must exist, for the last_parent prefixed by combinator
        const secondSelectorEntry = pureSelector[length - 2]; // take the second_last entry
        if (isCombinator(secondSelectorEntry)) {              // the entry must be Combinator
            return secondSelectorEntry;
        } // if
    } // if
    
    return null; // parent_selector not prefixed by combinator (>&) => ungroupable
})

const removeCommonPrefixedParentSelector               = (pureSelector: PureSelector): PureSelector => {
    return pureSelector.slice(
        1 // remove the first_parent
        +
        (pureSelector.some(isPseudoElementSelector) ? -1 : 0) // exception for ::pseudo-element => do not remove the first_parent
    );
}
const removeCommonPrefixedParentSelectorWithCombinator = (pureSelector: PureSelector): PureSelector => {
    return pureSelector.slice(
        2 // remove the first_parent & combinator
        +
        (pureSelector.some(isPseudoElementSelector) ? -1 : 0) // exception for ::pseudo-element => do not remove the first_parent
    );
}
const removeCommonSuffixedParentSelector               = (pureSelector: PureSelector): PureSelector => {
    return pureSelector.slice(0,
        -1 // remove the last_parent
        +
        (pureSelector.some(isPseudoElementSelector) ? 1 : 0) // exception for ::pseudo-element => do not remove the last_parent
    );
}
const removeCommonSuffixedParentSelectorWithCombinator = (pureSelector: PureSelector): PureSelector => {
    return pureSelector.slice(0,
        -2 // remove the combinator & last_parent
        +
        (pureSelector.some(isPseudoElementSelector) ? 1 : 0) // exception for ::pseudo-element => do not remove the last_parent
    );
}
const createCommonPrefixedParentSelector = (isSelector: PureSelector, combinator: Combinator | null): Selector => {
    return createSelector(
        parentSelector(), // add a ParentSelector      before :is(...)
        combinator,       // add a Combinator (if any) before :is(...)
        ...isSelector,    // :is(...)
    );
}
const createCommonSuffixedParentSelector = (isSelector: PureSelector, combinator: Combinator | null): Selector => {
    return createSelector(
        ...isSelector,    // :is(...)
        combinator,       // add a Combinator (if any) after :is(...)
        parentSelector(), // add a ParentSelector      after :is(...)
    );
}
const createBaseParentSelectorGroup      = (
        groupByParentSelectorGroup               : PureSelector[],
        groupByCombinator                        : null | ((accum: GroupByCombinator, pureSelector: PureSelector) => GroupByCombinator),
        removeCommonParentSelector               : null | ((pureSelector: PureSelector) => PureSelector),
        removeCommonParentSelectorWithCombinator : null | ((pureSelector: PureSelector) => PureSelector),
        createCommonParentSelector               : null | ((isSelector: PureSelector, combinator: Combinator | null) => Selector)
    ): SelectorGroup => {
    if (groupByParentSelectorGroup.length < 2) return groupByParentSelectorGroup; // must contains at least 2 selectors, if only one/no selector => no need to group
    
    
    
    // group selectors by combinator:
    const selectorGroupByCombinator = groupByCombinator ? groupByParentSelectorGroup.reduce(
        groupByCombinator,
        new Map<Combinator|null, PureSelector[]>()
    ) : new Map<Combinator|null, PureSelector[]>([[ null, groupByParentSelectorGroup ]]);
    
    
    
    return Array.from(selectorGroupByCombinator.entries()).flatMap(([combinator, selectors]) => {
        if (selectors.length < 2) return selectors; // must contains at least 2 selectors, if only one/no selector => no need to group
        if (selectors.filter((selector) => selector.every(isNotPseudoElementSelector)).length < 2) return selectors; // must contains at least 2 selectors which without ::pseudo-element, if only one/no selector => no need to group
        
        
        const conditionalRemoveCommonParentSelector = combinator ? removeCommonParentSelectorWithCombinator : removeCommonParentSelector;
        const [isSelector, ...pseudoElmSelectors] = groupSelectors(
            conditionalRemoveCommonParentSelector
            ?
            selectors.map(conditionalRemoveCommonParentSelector)
            :
            selectors
        );
        return createSelectorGroup(
            isNotEmptySelector(isSelector) && ( // grouped selectors (if any), might be empty if the original only contains ::pseudo-element(s)
                createCommonParentSelector
                ?
                createCommonParentSelector(isSelector, combinator)
                :
                isSelector
            ),
            ...pseudoElmSelectors, // ungroupable ::pseudo-element (if any)
        );
    });
}
const createNoParentSelectorGroup        = (groupByParentSelectorGroup: PureSelector[]): SelectorGroup => {
    return createBaseParentSelectorGroup(
        groupByParentSelectorGroup,
        null,
        null,
        null,
        null,
    );
}
const createPrefixedParentSelectorGroup  = (groupByParentSelectorGroup: PureSelector[]): SelectorGroup => {
    return createBaseParentSelectorGroup(
        groupByParentSelectorGroup,
        groupByPrefixCombinator,
        removeCommonPrefixedParentSelector,
        removeCommonPrefixedParentSelectorWithCombinator,
        createCommonPrefixedParentSelector,
    );
}
const createSuffixedParentSelectorGroup  = (groupByParentSelectorGroup: PureSelector[]): SelectorGroup => {
    return createBaseParentSelectorGroup(
        groupByParentSelectorGroup,
        groupBySuffixCombinator,
        removeCommonSuffixedParentSelector,
        removeCommonSuffixedParentSelectorWithCombinator,
        createCommonSuffixedParentSelector,
    );
}
export const groupSimilarSelectors       = (pureSelectorGroup: PureSelector[]): PureSelector[] => {
    // we need to unwrap the :is(...) and :where(...) before grouping the similarities
    const normalizedSelectorGroup: PureSelector[] = (
        pureSelectorGroup
        .flatMap((selector) => ungroupSelector(selector)) // SelectorGroup               =>  PureSelectorGroup === Selector[] === [ Selector...Selector... ]
        .filter(isNotEmptySelector)                       // [ Selector...Selector... ]  =>  [ PureSelector...PureSelector... ]
    );
    
    
    
    // if selectors less than 2 => nothing to group => return the normalized:
    if (normalizedSelectorGroup.length < 2) return normalizedSelectorGroup;
    
    
    
    // group selectors by parent position:
    const selectorGroupByParentPosition = normalizedSelectorGroup.reduce(
        groupByParentPosition,
        new Map<ParentPosition, PureSelector[]>()
    );
    
    const noParentSelectorGroup        = selectorGroupByParentPosition.get(ParentPosition.NoParent        ) ?? [];
    const onlyParentSelectorGroup      = selectorGroupByParentPosition.get(ParentPosition.OnlyParent      ) ?? [];
    const onlyBeginParentSelectorGroup = selectorGroupByParentPosition.get(ParentPosition.OnlyBeginParent ) ?? [];
    const onlyEndParentSelectorGroup   = selectorGroupByParentPosition.get(ParentPosition.OnlyEndParent   ) ?? [];
    const randomParentSelectorGroup    = selectorGroupByParentPosition.get(ParentPosition.RandomParent    ) ?? [];
    
    
    
    return createSelectorGroup(
        // no parent
        // aaa, bbb, ccc
        ...createNoParentSelectorGroup(noParentSelectorGroup),
        
        
        
        // ParentSelector at beginning
        // &aaa
        // &>aaa
        // &:is(aaa, bbb, ccc)
        // &>:is(aaa, bbb, ccc)
        ...createPrefixedParentSelectorGroup(onlyBeginParentSelectorGroup),
        
        
        
        // ParentSelector at end
        // aaa&
        // aaa>&
        // :is(aaa, bbb, ccc)&
        // :is(aaa, bbb, ccc)>&
        ...createSuffixedParentSelectorGroup(onlyEndParentSelectorGroup),
        
        
        
        // only ParentSelector
        // &
        !!onlyParentSelectorGroup.length && (
            onlyParentSelectorGroup[0] // just take the first one, the rest are guaranteed to be the same
        ),
        
        
        
        // parent at random
        // aaa&bbb, aaa&bbb&ccc
        ...randomParentSelectorGroup,
    ).filter(isNotEmptySelector);
}



const defaultCssSelectorOptions : Required<CssSelectorOptions> = {
    performGrouping      : true,
    
    specificityWeight    : null,
    minSpecificityWeight : null,
    maxSpecificityWeight : null,
}
export const mergeSelectors = (selectorGroup: SelectorGroup, options: CssSelectorOptions = defaultCssSelectorOptions): SelectorGroup => {
    const {
        performGrouping = defaultCssSelectorOptions.performGrouping,
        
        specificityWeight,
    } = options;
    const minSpecificityWeight = specificityWeight ?? options.minSpecificityWeight ?? null;
    const maxSpecificityWeight = specificityWeight ?? options.maxSpecificityWeight ?? null;
    const performAdjusting     = (minSpecificityWeight !== null) || (maxSpecificityWeight !== null);
    
    
    
    // remove empty_selector(s) undefined|null|false|true|Selector(...only_emptySelectorEntry...) from selectorGroup,
    // so we only working with real_selector(s)
    const normalizedSelectorGroup: PureSelector[] = (
        selectorGroup
        .filter(isNotEmptySelector) // [ Selector...Selector... ]  =>  [ PureSelector...PureSelector... ]
    );
    
    
    
    // transform phase 1:
    const groupedSelectorGroup : PureSelector[] = (
        performGrouping
        ?
        groupSimilarSelectors(normalizedSelectorGroup)
        :
        normalizedSelectorGroup
    );
    
    
    
    // transform phase 2:
    const adjustedSelectorGroup: PureSelector[] = (
        performAdjusting
        ?
        adjustSpecificityWeight(
            groupedSelectorGroup
            ,
            minSpecificityWeight,
            maxSpecificityWeight
        )
        :
        groupedSelectorGroup
    );
    
    
    
    return adjustedSelectorGroup;
}
