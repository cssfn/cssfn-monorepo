// cssfn:
import type {
    // types:
    CssSelectorOptions,
}                           from '@cssfn/css-types'
import {
    // types:
    ClassSelector,
    PseudoClassSelector,
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
    isNotEmptySelector,
    selectPureSelectorFromSelector,
    selectPureSelectorGroupFromSelectorGroup,
    
    
    
    // transforms:
    groupSelectors,
    ungroupSelector,
    ungroupSelectors,
    
    
    
    // measures:
    calculateSpecificity,
}                           from '@cssfn/css-selectors'

// internals:
import {
    normalizeSelectorOptions,
}                           from './utilities.js'



// utilities:
const emptySelectorGroup : SelectorGroup = [];



// processors:

interface SelectorInfo { selector: PureSelector, specificityWeight: number }
interface GroupedSelectorInfoBySpecificityStatus {
    fit      : SelectorInfo[]|undefined
    tooBig   : SelectorInfo[]|undefined
    tooSmall : SelectorInfo[]|undefined
}
const calculateSpecificityWeightStatus     = (pureSelector: PureSelector, minSpecificityWeight: number|null, maxSpecificityWeight: number|null): readonly [keyof GroupedSelectorInfoBySpecificityStatus, number] => {
    const specificityWeightParts = calculateSpecificity(pureSelector);
    const specificityWeight = (specificityWeightParts[0] === 0) ? specificityWeightParts[1] : Infinity;
    
    
    
    if ((minSpecificityWeight !== null) && (specificityWeight < minSpecificityWeight)) {
        return ['tooSmall', specificityWeight];
    } // if
    
    
    
    if ((maxSpecificityWeight !== null) && (specificityWeight > maxSpecificityWeight)) {
        return ['tooBig', specificityWeight];
    } // if
    
    
    
    return ['fit', specificityWeight];
}
const groupSelectorInfoBySpecificityStatus = (selectors: PureSelector[], minSpecificityWeight: number|null, maxSpecificityWeight: number|null): GroupedSelectorInfoBySpecificityStatus => {
    const grouped         : GroupedSelectorInfoBySpecificityStatus = { fit: undefined, tooBig: undefined, tooSmall: undefined };
    let groupKey          : keyof GroupedSelectorInfoBySpecificityStatus;
    let specificityWeight : number
    for (const selector of selectors) {
        // grouping:
        [groupKey, specificityWeight] = calculateSpecificityWeightStatus(selector, minSpecificityWeight, maxSpecificityWeight);
        const group = grouped[groupKey];                           // get an existing collector (if any)
        if (!group) {
            grouped[groupKey] = [{ selector, specificityWeight }]; // create a new collector
        }
        else {
            group.push({ selector, specificityWeight });           // append to the existing collector
        } // if
    } // for
    return grouped;
}

const nthChildNSelector            = pseudoClassSelector('nth-child', 'n');
const neutralizeSelector           = (selectorsOrPseudoElm: PureSelector|PseudoElementSelector): Selector => {
    if (selectorsOrPseudoElm[0] === '::') return [selectorsOrPseudoElm as PseudoElementSelector];
    
    
    
    // group the selector with :where(), so the specificity is zero:
    const [
        whereSelector,               // grouped selectorEntries inside :where()
        // ...selectorsWithPseudoElm // ungroupable ::pseudoElement selectorEntries => always empty because we've filtered the ::pseudoElement
    ] = groupSelectors(
        ungroupSelector(          // if wrapped with :is() or :where() => unwrap
            selectorsOrPseudoElm as PureSelector
        ),
        { selectorName: 'where' } // :where
    );
    
    return whereSelector;
}
const decreaseSpecificity          = (pureSelector: PureSelector, excessSpecificityWeight: number, minSpecificityWeight: number|null): Selector => {
    let   bufferedSelector    : PureSelector = [];
    const unchangedSelector   : PureSelector = [];
    const neutralizedSelector : Selector     = [];
    for (let index = pureSelector.length - 1, selectorEntry: SelectorEntry, specificityWeight: number; index >= 0; index--) {
        selectorEntry = pureSelector[index];
        
        
        
        // nothing to decrease further => collect the entry to unchangedSelector:
        if (excessSpecificityWeight <= 0) {
            unchangedSelector.unshift(selectorEntry);
            continue; // loop to next selectorEntry:
        } // if
        
        
        
        if (isPseudoElementSelector(selectorEntry)) {
            // flush & reset the buffer:
            if (bufferedSelector.length) {
                neutralizedSelector.unshift( // flush
                    ...neutralizeSelector(bufferedSelector)
                );
                bufferedSelector = [];       // reset
            } // if
            
            
            
            // collect the ::pseudoElm to neutralizedSelector, so the PureSelector structure is preserved
            neutralizedSelector.unshift(
                ...neutralizeSelector(selectorEntry)
            );
            
            
            
            continue; // loop to next selectorEntry:
        } // if
        
        
        
        // eat the selectorEntry:
        bufferedSelector.unshift(selectorEntry);
        
        
        
        // calculate the eaten specificity & update the counter:
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
                        specificityWeight        = calculateSpecificity([selectorEntry])[1];
                        excessSpecificityWeight -= specificityWeight; // reduce the counter (might be a negative value if `specificityWeight` > `excessSpecificityWeight`)
                        break;
                    
                    case 'where':
                        break; // don't reduce the counter
                    
                    default:
                        excessSpecificityWeight--; // reduce the counter
                } // switch
            }
            else if (['.', '[',].includes(selectorToken)) { // class selector or attribute selector
                excessSpecificityWeight--; // reduce the counter
            } // if
        } // if
    } // for
    
    // flush the buffer:
    if (bufferedSelector.length) {
        neutralizedSelector.unshift( // flush
            ...neutralizeSelector(bufferedSelector)
        );
    } // if
    
    
    
    const missingSpecificityWeight : number = (
        ((excessSpecificityWeight === Infinity) || (excessSpecificityWeight < 0))
        ?
        (
            (excessSpecificityWeight === Infinity)
            ?
            (minSpecificityWeight ?? 0) // eat all => zero specificity => might less than minSpecificityWeight => fix by assigning minSpecificityWeight
            :
            -excessSpecificityWeight
        )
        :
        0
    );
    const adjustSpecificitySelector : Selector = new Array<SimpleSelector>(missingSpecificityWeight).fill(
        nthChildNSelector // or use `nth-child(n)`
    );
    
    
    
    // done:
    return createSelector(
        ...unchangedSelector,
        ...neutralizedSelector,
        ...adjustSpecificitySelector,
    );
}
const isClassSelectorWithoutParams = (selectorEntry: SelectorEntry): selectorEntry is ClassSelector|PseudoClassSelector => {
    if (!isClassOrPseudoClassSelector(selectorEntry)) return false; // only interested to class selector -or- pseudo class selector
    
    
    
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
    ] = selectorEntry;
    
    return (selectorParams === undefined);
}
const increaseSpecificity          = (pureSelector: PureSelector, missingSpecificityWeight: number): Selector => {
    const adjustSpecificitySelector : Selector = new Array<SimpleSelector>(missingSpecificityWeight).fill(
        pureSelector
        .filter(isClassSelectorWithoutParams) // class selector -or- pseudo class selector without parameters
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

function selectSelectorFromSelectorInfo(selectorInfo: SelectorInfo): Selector {
    return selectorInfo.selector;
}
function selectIncreasedSpecificitySelectorFromSelectorInfo(this: number|null, selectorInfo: SelectorInfo): Selector {
    const minSpecificityWeight = this;
    return increaseSpecificity(
        selectorInfo.selector,
        ((minSpecificityWeight ?? 1) - selectorInfo.specificityWeight)
    );
}
function selectDecreasedSpecificitySelectorFromSelectorInfo(this: readonly [number|null, number|null], selectorInfo: SelectorInfo): Selector {
    const [minSpecificityWeight, maxSpecificityWeight] = this;
    return decreaseSpecificity(
        selectorInfo.selector,
        (selectorInfo.specificityWeight - (maxSpecificityWeight ?? selectorInfo.specificityWeight)),
        minSpecificityWeight
    );
}
export const adjustSpecificityWeight = (pureSelectorGroup: PureSelector[], minSpecificityWeight: number|null, maxSpecificityWeight: number|null): SelectorGroup => {
    if (
        (minSpecificityWeight === null)
        &&
        (maxSpecificityWeight === null)
    ) return pureSelectorGroup; // nothing to adjust
    
    
    
    // group selectors by specificity weight status:
    const {
        fit      : fitSelectors,
        tooSmall : tooSmallSelectors,
        tooBig   : tooBigSelectors,
    } = groupSelectorInfoBySpecificityStatus(pureSelectorGroup, minSpecificityWeight, maxSpecificityWeight);
    
    
    
    return createSelectorGroup(
        ...(fitSelectors?.map(selectSelectorFromSelectorInfo                                                                        ) ?? emptySelectorGroup),
        
        ...(tooSmallSelectors?.map(selectIncreasedSpecificitySelectorFromSelectorInfo ,  minSpecificityWeight                       ) ?? emptySelectorGroup),
        
        ...(tooBigSelectors?.map(selectDecreasedSpecificitySelectorFromSelectorInfo   , [minSpecificityWeight, maxSpecificityWeight]) ?? emptySelectorGroup),
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

interface GroupedSelectorsByParentPosition {
    noParent        : PureSelector[]|undefined
    onlyParent      : PureSelector[]|undefined
    onlyBeginParent : PureSelector[]|undefined
    onlyEndParent   : PureSelector[]|undefined
    randomParent    : PureSelector[]|undefined
}
const calculateParentPosition          = (pureSelector: PureSelector): keyof GroupedSelectorsByParentPosition => {
    const hasStartsWithParent  = startsWithParent(pureSelector);
    
    const onlyParent           = hasStartsWithParent && (pureSelector.length === 1);
    if (onlyParent)      return 'onlyParent';
    
    const hasMiddlesWithParent = middlesWithParent(pureSelector);
    const hasEndsWithParent    = endsWithParent(pureSelector);
    
    const onlyBeginParent      = hasStartsWithParent && !hasMiddlesWithParent && !hasEndsWithParent;
    if (onlyBeginParent) return 'onlyBeginParent';
    
    const onlyEndParent        = !hasStartsWithParent && !hasMiddlesWithParent && hasEndsWithParent;
    if (onlyEndParent)   return 'onlyEndParent';
    
    const noParent             = !hasStartsWithParent && !hasMiddlesWithParent && !hasEndsWithParent;
    if (noParent)        return 'noParent';
    
    return 'randomParent';
}
const groupSelectorsByParentPosition   = (pureSelectors: PureSelector[]): GroupedSelectorsByParentPosition => {
    const grouped : GroupedSelectorsByParentPosition = {
        noParent        : undefined,
        onlyParent      : undefined,
        onlyBeginParent : undefined,
        onlyEndParent   : undefined,
        randomParent    : undefined,
    };
    for (const pureSelector of pureSelectors) {
        // grouping:
        const groupKey = calculateParentPosition(pureSelector);
        const group = grouped[groupKey];        // get an existing collector (if any)
        if (!group) {
            grouped[groupKey] = [pureSelector]; // create a new collector
        }
        else {
            group.push(pureSelector);           // append to the existing collector
        } // if
    } // for
    return grouped;
}

type GroupedSelectorsByCombinator      = Map<Combinator|null, PureSelector[]>
const createGroupSelectorsByCombinator = (findCommonCombinator: (pureSelector: PureSelector) => Combinator|null) => (pureSelectors: PureSelector[]): GroupedSelectorsByCombinator => {
    const grouped : GroupedSelectorsByCombinator = new Map<Combinator|null, PureSelector[]>();
    for (const pureSelector of pureSelectors) {
        // grouping:
        const groupKey = findCommonCombinator(pureSelector);
        const group = grouped.get(groupKey);       // get an existing collector (if any)
        if (!group) {
            grouped.set(groupKey, [pureSelector]); // create a new collector
        }
        else {
            group.push(pureSelector);              // append to the existing collector
        } // if
    } // for
    return grouped;
}
const groupSelectorsByPrefixCombinator = createGroupSelectorsByCombinator(/* findCommonCombinator: */(pureSelector) => {
    if (pureSelector.length >= 2) {                           // at least 2 entry must exist, for the first_parent suffixed by combinator
        const secondSelectorEntry = pureSelector[1];          // take the second_first entry
        if (isCombinator(secondSelectorEntry)) {              // the entry must be Combinator
            return secondSelectorEntry;
        } // if
    } // if
    
    return null; // parent_selector not suffixed by combinator (&>) => ungroupable
})
const groupSelectorsBySuffixCombinator = createGroupSelectorsByCombinator(/* findCommonCombinator: */(pureSelector) => {
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
const createCommonPrefixedParentSelector               = (isSelector: Selector, combinator: Combinator | null): Selector => {
    return createSelector(
        parentSelector(), // add a ParentSelector      before :is(...)
        combinator,       // add a Combinator (if any) before :is(...)
        ...isSelector,    // :is(...)
    );
}
const createCommonSuffixedParentSelector               = (isSelector: Selector, combinator: Combinator | null): Selector => {
    return createSelector(
        ...isSelector,    // :is(...)
        combinator,       // add a Combinator (if any) after :is(...)
        parentSelector(), // add a ParentSelector      after :is(...)
    );
}
const isNotContainPseudoElement                        = (selector: PureSelector) => selector.every(isNotPseudoElementSelector);
const createBaseParentSelectorGroup                    = (
        groupByParentSelectorGroup               : PureSelector[],
        groupSelectorsByCombinator               : null | ((pureSelectors : PureSelector[]) => GroupedSelectorsByCombinator),
        removeCommonParentSelector               : null | ((pureSelector  : PureSelector  ) => PureSelector),
        removeCommonParentSelectorWithCombinator : null | ((pureSelector  : PureSelector  ) => PureSelector),
        createCommonParentSelector               : null | ((isSelector    : Selector, combinator: Combinator | null) => Selector)
    ): SelectorGroup => {
    if (groupByParentSelectorGroup.length < 2) return groupByParentSelectorGroup; // must contains at least 2 selectors, if only one/no selector => no need to group
    
    
    
    // group selectors by combinator:
    const groupedSelectorsByCombinator = (
        groupSelectorsByCombinator?.(groupByParentSelectorGroup)
        ??
        new Map<Combinator|null, PureSelector[]>([
            [ null, groupByParentSelectorGroup ] // ungroupable
        ])
    );
    
    
    
    return Array.from(groupedSelectorsByCombinator.entries()).flatMap(([combinator, selectors]) => {
        // conditions:
        if (selectors.length < 2)                                   return selectors; // must contains at least 2 selectors, if only one/no selector => no need to group
        if (selectors.filter(isNotContainPseudoElement).length < 2) return selectors; // must contains at least 2 selectors which without ::pseudo-element, if only one/no selector => no need to group
        
        
        
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
                createCommonParentSelector?.(isSelector, combinator)
                ??
                isSelector
            ),
            ...selectorsWithPseudoElm, // ungroupable ::pseudo-element (if any)
        );
    });
}
const createNoParentSelectorGroup                      = (groupByParentSelectorGroup: PureSelector[]): SelectorGroup => {
    return createBaseParentSelectorGroup(
        groupByParentSelectorGroup,
        null,
        null,
        null,
        null,
    );
}
const createPrefixedParentSelectorGroup                = (groupByParentSelectorGroup: PureSelector[]): SelectorGroup => {
    return createBaseParentSelectorGroup(
        groupByParentSelectorGroup,
        groupSelectorsByPrefixCombinator,
        removeCommonPrefixedParentSelector,
        removeCommonPrefixedParentSelectorWithCombinator,
        createCommonPrefixedParentSelector,
    );
}
const createSuffixedParentSelectorGroup                = (groupByParentSelectorGroup: PureSelector[]): SelectorGroup => {
    return createBaseParentSelectorGroup(
        groupByParentSelectorGroup,
        groupSelectorsBySuffixCombinator,
        removeCommonSuffixedParentSelector,
        removeCommonSuffixedParentSelectorWithCombinator,
        createCommonSuffixedParentSelector,
    );
}
export const groupSimilarSelectors                     = (pureSelectorGroup: PureSelector[]): PureSelector[] => {
    // we need to unwrap the :is(...) and :where(...) before grouping the similarities
    const normalizedSelectorGroup: PureSelector[] = (
        ungroupSelectors(pureSelectorGroup)  // PureSelectorGroup === Selector[] === [ Selector...Selector... ]
        .map(selectPureSelectorFromSelector) // remove undefined|null|false|true => only real SelectorEntry
    );
    
    
    
    // if selectors less than 2 => nothing to group => return the normalized:
    if (normalizedSelectorGroup.length < 2) return normalizedSelectorGroup;
    
    
    
    // group selectors by parent position:
    const {
        noParent        : noParentSelectors,
        onlyParent      : onlyParentSelectors,
        onlyBeginParent : onlyBeginParentSelectors,
        onlyEndParent   : onlyEndParentSelectors,
        randomParent    : randomParentSelectors,
    } = groupSelectorsByParentPosition(normalizedSelectorGroup);
    
    
    
    return selectPureSelectorGroupFromSelectorGroup(createSelectorGroup(
        // no parent
        // aaa, bbb, ccc
        ...(noParentSelectors        ? createNoParentSelectorGroup(noParentSelectors)              : emptySelectorGroup),
        
        
        
        // ParentSelector at beginning
        // &aaa
        // &>aaa
        // &:is(aaa, bbb, ccc)
        // &>:is(aaa, bbb, ccc)
        ...(onlyBeginParentSelectors ? createPrefixedParentSelectorGroup(onlyBeginParentSelectors) : emptySelectorGroup),
        
        
        
        // ParentSelector at end
        // aaa&
        // aaa>&
        // :is(aaa, bbb, ccc)&
        // :is(aaa, bbb, ccc)>&
        ...(onlyEndParentSelectors   ? createSuffixedParentSelectorGroup(onlyEndParentSelectors)   : emptySelectorGroup),
        
        
        
        // only ParentSelector
        // &
        !!onlyParentSelectors && (
            onlyParentSelectors[0] // just take the first one, the rest are guaranteed to be the same
        ),
        
        
        
        // parent at random
        // aaa&bbb, aaa&bbb&ccc
        ...(randomParentSelectors    ? randomParentSelectors                                       : emptySelectorGroup),
    ))
    .map(selectPureSelectorFromSelector) // remove undefined|null|false|true => only real SelectorEntry
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
        selectPureSelectorGroupFromSelectorGroup(selectorGroup) // remove undefined|null|false|true|Selector(empty) => only real Selector
        .map(selectPureSelectorFromSelector)                    // remove undefined|null|false|true                 => only real SelectorEntry
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
