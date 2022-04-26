// cssfn:
import type {
    // types:
    CssSelectorOptions,
}                           from '@cssfn/css-types'
import {
    // types:
    PseudoElementSelector,
    SimpleSelector,
    Combinator,
    SelectorEntry,
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
    createSelectorGroup,
    isNotEmptySelectorEntry,
    isNotEmptySelector,
    
    
    
    // transforms:
    groupSelectors,
    ungroupSelector,
    
    
    
    // measures:
    calculateSpecificity,
}                           from '@cssfn/css-selectors'

// internals:
import {
    normalizeSelectorOptions,
}                           from './utilities'



// processors:

const enum SpecificityWeightStatus {
    Fit,
    TooBig,
    TooSmall,
}
const calculateSpecificityWeightStatus = (pureSelector: PureSelector, minSpecificityWeight: number|null, maxSpecificityWeight: number|null): readonly [number, SpecificityWeightStatus] => {
    const specificityWeightParts = calculateSpecificity(pureSelector);
    const specificityWeight = (specificityWeightParts[0] === 0) ? specificityWeightParts[1] : Infinity;
    
    
    
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
type ReducedSpecificity = { excess: number, unchanged: SelectorEntry[], quarantined: (SelectorEntry[]|PseudoElementSelector)[], buffered: SelectorEntry[] }
const reduceSpecificity = (accum: ReducedSpecificity, selectorEntry: SelectorEntry): ReducedSpecificity => {
    if (accum.excess <= 0) {
        accum.unchanged.unshift(selectorEntry);
        
        
        
        // loop to next selectorEntry:
        return accum;
    } // if
    
    
    
    if (isPseudoElementSelector(selectorEntry)) {
        //#region flush & reset the buffer
        if (accum.buffered.length) {
            accum.quarantined.unshift(accum.buffered);
            accum.buffered = [];
        } // if
        //#endregion flush & reset the buffer
        
        
        
        // collect the ::pseudoElm to quarantined, so the PureSelector structure is preserved
        accum.quarantined.unshift(selectorEntry);
        
        
        
        // loop to next selectorEntry:
        return accum;
    } // if
    
    
    
    // eat the selectorEntry:
    accum.buffered.unshift(selectorEntry);
    
    
    
    //#region calculate the eaten specificity & update the (counter) excess
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
                    accum.excess -= specificityWeight; // reduce the counter (might be a negative value if `specificityWeight` > `accum.excess`)
                    break;
                
                case 'where':
                    break; // don't reduce the counter
                
                default:
                    accum.excess--; // reduce the counter
            } // switch
        }
        else if (['.', '[',].includes(selectorToken)) { // class selector or attribute selector
            accum.excess--; // reduce the counter
        } // if
    } // if
    //#endregion calculate the eaten specificity & update the (counter) excess
    
    
    
    // loop to next selectorEntry:
    return accum;
}
const decreaseSpecificity = (pureSelector: PureSelector, excessSpecificityWeight: number, minSpecificityWeight: number|null): Selector => {
    const reducedSpecificity = pureSelector.reduceRight(reduceSpecificity, { excess: excessSpecificityWeight, unchanged: [], quarantined: [], buffered: [] });
    if (reducedSpecificity.buffered.length) {
        reducedSpecificity.quarantined.unshift(reducedSpecificity.buffered);
    } // if
    
    
    
    const neutralizedSelector : Selector = reducedSpecificity.quarantined.flatMap((selectorsOrPseudoElm): Selector => {
        if (selectorsOrPseudoElm[0] === '::') return [selectorsOrPseudoElm as PseudoElementSelector];
        
        
        
        // group the selector with :where(), so the specificity is zero:
        const [
            whereSelector,            // grouped selectorEntries inside :where()
         // ...selectorsWithPseudoElm // ungroupable ::pseudoElement selectorEntries => always empty because we've filtered the ::pseudoElement
        ] = groupSelectors(
            ungroupSelector(          // if wrapped with :is() or :where() => unwrap
                selectorsOrPseudoElm as SelectorEntry[]
            ),
            { selectorName: 'where' } // :where
        );
        
        return whereSelector;
    });
    
    
    
    const missingSpecificityWeight : number = (
        ((reducedSpecificity.excess === Infinity) || (reducedSpecificity.excess < 0))
        ?
        (
            (reducedSpecificity.excess === Infinity)
            ?
            (minSpecificityWeight ?? 0) // eat all => zero specificity => might less than minSpecificityWeight => fix by assigning minSpecificityWeight
            :
            -reducedSpecificity.excess
        )
        :
        0
    );
    const adjustSpecificitySelector : Selector = new Array<SimpleSelector>(missingSpecificityWeight).fill(
        nthChildNSelector // or use `nth-child(n)`
    );
    
    
    
    // done:
    return createSelector(
        ...reducedSpecificity.unchanged,
        ...neutralizedSelector,
        ...adjustSpecificitySelector,
    );
}
const increaseSpecificity = (pureSelector: PureSelector, missingSpecificityWeight: number) => {
    const adjustSpecificitySelector : Selector = new Array<SimpleSelector>(missingSpecificityWeight).fill(
        pureSelector
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
    );
    
    
    
    // done:
    return createSelector(
        ...pureSelector,
        ...adjustSpecificitySelector,
    );
}

export const adjustSpecificityWeight = (pureSelectorGroup: PureSelector[], minSpecificityWeight: number|null, maxSpecificityWeight: number|null): SelectorGroup => {
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
    
    
    
    return createSelectorGroup(
        ...fitSelectors.map((group) => group.selector),
        
        ...tooSmallSelectors.map((group) => increaseSpecificity(
            group.selector,
            ((minSpecificityWeight ?? 1) - group.specificityWeight)
        )),
        
        ...tooBigSelectors.map((group) => decreaseSpecificity(
            group.selector,
            (group.specificityWeight - (maxSpecificityWeight ?? group.specificityWeight)),
            minSpecificityWeight
        )),
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
        1 // remove the prefixed ParentSelector
    );
}
const removeCommonPrefixedParentSelectorWithCombinator = (pureSelector: PureSelector): PureSelector => {
    return pureSelector.slice(
        2 // remove the prefixed ParentSelector & Combinator
    );
}
const removeCommonSuffixedParentSelector               = (pureSelector: PureSelector): PureSelector => {
    return pureSelector.slice(0,
        -1 // remove the suffixed ParentSelector
    );
}
const removeCommonSuffixedParentSelectorWithCombinator = (pureSelector: PureSelector): PureSelector => {
    return pureSelector.slice(0,
        -2 // remove the suffixed Combinator & ParentSelector
    );
}
const createCommonPrefixedParentSelector = (isSelector: Selector, combinator: Combinator | null): Selector => {
    return createSelector(
        parentSelector(), // add a ParentSelector      before :is(...)
        combinator,       // add a Combinator (if any) before :is(...)
        ...isSelector,    // :is(...)
    );
}
const createCommonSuffixedParentSelector = (isSelector: Selector, combinator: Combinator | null): Selector => {
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
        createCommonParentSelector               : null | ((isSelector: Selector, combinator: Combinator | null) => Selector)
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
        const [isSelector, ...selectorsWithPseudoElm] = groupSelectors(
            conditionalRemoveCommonParentSelector
            ?
            selectors.map((selector) =>
                selector.some(isPseudoElementSelector)
                ?
                selector
                :
                conditionalRemoveCommonParentSelector(selector)
            )
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
            ...selectorsWithPseudoElm, // ungroupable ::pseudo-element (if any)
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
        .flatMap((selector) => ungroupSelector(selector))            // SelectorGroup  =>  PureSelectorGroup === Selector[] === [ Selector...Selector... ]
        .filter(isNotEmptySelector)                                  // remove undefined|null|false|true|Selector(empty) => only real Selector
        .map((selector) => selector.filter(isNotEmptySelectorEntry)) // remove undefined|null|false|true                 => only real SelectorEntry
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
    )
    .filter(isNotEmptySelector)                                  // remove undefined|null|false|true|Selector(empty) => only real Selector
    .map((selector) => selector.filter(isNotEmptySelectorEntry)) // remove undefined|null|false|true                 => only real SelectorEntry
}



const defaultSelectorOptions : Required<CssSelectorOptions> = {
    performGrouping      : true,
    
    specificityWeight    : null,
    minSpecificityWeight : null,
    maxSpecificityWeight : null,
}
export const mergeSelectors = (selectorGroup: SelectorGroup, options?: CssSelectorOptions): SelectorGroup => {
    const {
        performGrouping,
        
        minSpecificityWeight,
        maxSpecificityWeight,
    } = normalizeSelectorOptions(options, defaultSelectorOptions);
    
    const performAdjusting = (minSpecificityWeight !== null) || (maxSpecificityWeight !== null);
    
    
    
    // remove empty_selector(s) undefined|null|false|true|Selector(...only_emptySelectorEntry...) from selectorGroup,
    // so we only working with real_selector(s)
    const normalizedSelectorGroup: PureSelector[] = (
        selectorGroup
        .filter(isNotEmptySelector)                                  // remove undefined|null|false|true|Selector(empty) => only real Selector
        .map((selector) => selector.filter(isNotEmptySelectorEntry)) // remove undefined|null|false|true                 => only real SelectorEntry
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
    const adjustedSelectorGroup: SelectorGroup = (
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
