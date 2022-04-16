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
    SimpleSelector    as SimpleSelectorModel,
    Combinator,
    Selector          as SelectorModel,
    SelectorGroup     as SelectorModelGroup,
    PureSelector      as PureSelectorModel,
    PureSelectorGroup as PureSelectorModelGroup,
    
    
    
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
    createSelectorGroup,
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

export const mergeLiteral = (style: CssStyle, newStyle: CssStyle): void => {
    //#region merge normal props
    for (const propName in newStyle) { // loop through `newStyle`'s props
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



const nestedAtRules = ['@media', '@supports', '@document', '@global'];
export const mergeNested  = (style: CssStyle): void => {
    const symbolProps = Object.getOwnPropertySymbols(style);
    if (!symbolProps.length) return; // there's no (nested) Rule => nothing to do
    
    
    
    //#region group (nested) Rule(s) by selector name
    const groupByNested = (
        symbolProps
        .reduce((accum, sym) => {
            const nestedSelector = sym.description ?? '';
            if (
                // nested rules:
                (
                    (nestedSelector !== '&')     // ignore only_parentSelector
                    &&
                    nestedSelector.includes('&') // nested rule
                )
                ||
                // conditional rules & globals:
                nestedAtRules.some((at) => nestedSelector.startsWith(at))
            ) {
                let group = accum.get(nestedSelector);             // get an existing collector
                if (!group) accum.set(nestedSelector, group = []); // create a new collector
                group.push(sym);
            } // if
            return accum;
        }, new Map<string, symbol[]>())
    );
    //#endregion group (nested) Rule(s) by selector name
    
    
    
    //#region merge duplicates (nested) Rule(s) to unique ones
    for (const group of groupByNested.values()) {
        if (group.length <= 1) continue; // filter out groups with single/no member
        
        
        
        // merge styles from group's members to single style
        const mergedStyles = mergeStyles(
            group.map((sym) => style[sym])
        );
        
        
        
        if (mergedStyles) {
            // update last member
            style[group[group.length - 1]] = mergedStyles; // assign mergedStyles to the last member
        }
        else {
            // mergedStyles is empty => delete last member
            delete style[group[group.length - 1]];
        } // if
        for (const sym of group.slice(0, -1)) delete style[sym]; // delete first member to second last member
    } // for
    //#endregion merge duplicates (nested) Rule to unique ones
    
    
    
    //#region merge only_parentSelector to current style
    let needToReorderOtherSymbolProps = false;
    for (const sym of symbolProps) {
        if (sym.description === '&') {
            /* move the CssProps and (nested)Rules from only_parentSelector to current style */
            
            
            
            const parentStyles       = style[sym];
            const mergedParentStyles = mergeStyles(parentStyles);
            if (mergedParentStyles) {
                if (!needToReorderOtherSymbolProps) {
                    /* if mergedParentStyles has any (nested) Rule => all (nested) Rule in current style need to rearrange to preserve the order */
                    const hasNestedRule  = !!Object.getOwnPropertySymbols(mergedParentStyles).length;
                    if (hasNestedRule) needToReorderOtherSymbolProps = true;
                } // if
                
                
                
                mergeLiteral(style, mergedParentStyles); // merge into current style
            } // if
            delete style[sym];                           // merged => delete source
        }
        else if (needToReorderOtherSymbolProps) {
            /* preserve the order of another (nested)Rules */
            
            
            
            const nestedStyles = style[sym]; // backup
            delete style[sym];               // delete
            style[sym] = nestedStyles;       // restore (re-insert at the last order)
        } // if
    } // for
    //#endregion merge only_parentSelector to current style
}



/**
 * Merges the (sub) component's composition to single `CssStyle`.
 * @returns A `CssStyle` represents the merged (sub) component's composition  
 * -or-  
 * `null` represents an empty `CssStyle`.
 */
export const mergeStyles = (styles: CssStyleCollection): CssStyle|null => {
    /*
        CssStyleCollection = ProductOrFactoryOrDeepArray<OptionalOrBoolean<CssStyle>>
        CssStyleCollection = ProductOrFactory<OptionalOrBoolean<CssStyle>> | ProductOrFactoryDeepArray<OptionalOrBoolean<CssStyle>>
        typeof             = ---------------- not an array --------------- | -------------------- is an array ---------------------
    */
    
    
    
    if (!Array.isArray(styles)) {
        // not an array => ProductOrFactory<OptionalOrBoolean<CssStyle>>
        
        const styleValue: OptionalOrBoolean<CssStyle> = (
            (typeof(styles) === 'function')
            ?
            styles() // a function => Factory<OptionalOrBoolean<CssStyle>>
            :
            styles   // a product  => OptionalOrBoolean<CssStyle>
        );
        if (!styleValue || (styleValue === true)) return null; // `null` or `undefined` => return `null`
        
        
        
        const mergedStyles: CssStyle = styleValue;
        mergeNested(mergedStyles);
        
        
        
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
            // final element => might be a function or a product
            (
                // not an array => ProductOrFactory<OptionalOrBoolean<CssStyle>>
                
                (typeof(subStyles) === 'function')
                ?
                subStyles() // a function => Factory<OptionalOrBoolean<CssStyle>>
                :
                subStyles   // a product  => OptionalOrBoolean<CssStyle>
            )
        );
        if (!subStyleValue || (subStyleValue === true)) continue; // `null` or `undefined` => skip
        
        
        
        // merge current style to single big style (string props + symbol props):
        mergeLiteral(mergedStyles, subStyleValue);
        mergeNested(mergedStyles); // merge nested immediately after literal, to preserve prop order in mergedStyles and in mergedStyles[Symbol('&')]
    } // for
    
    
    
    // do not return an empty style, instead return null:
    if ((!Object.keys(mergedStyles).length) && (!Object.getOwnPropertySymbols(mergedStyles).length)) return null; // an empty object => return `null`
    
    // return non empty style:
    return mergedStyles;
}



const nthChildNSelector = pseudoClassSelector('nth-child', 'n');
const adjustSpecificityWeight = (selectorGroup: PureSelectorModelGroup, minSpecificityWeight: number|null, maxSpecificityWeight: number|null): PureSelectorModelGroup => {
    if (
        (minSpecificityWeight == null)
        &&
        (maxSpecificityWeight == null)
    ) return selectorGroup; // nothing to adjust
    
    
    
    //#region group selectors by specificity weight status
    const enum SpecificityWeightStatus {
        Fit,
        TooBig,
        TooSmall,
    }
    type GroupBySpecificityWeightStatus = Map<SpecificityWeightStatus, { selector: PureSelectorModel, specificityWeight: number }[]>
    const selectorGroupBySpecificityWeightStatus = selectorGroup.map((selector) => selector.filter(isNotEmptySelectorEntry) as PureSelectorModel).reduce(
        (accum, selector): GroupBySpecificityWeightStatus => {
            const [specificityWeight, weightStatus] = ((): readonly [number, SpecificityWeightStatus] => {
                const specificityWeight = calculateSpecificity(selector)[1];
                
                
                
                if ((maxSpecificityWeight !== null) && (specificityWeight > maxSpecificityWeight)) {
                    return [specificityWeight, SpecificityWeightStatus.TooBig];
                } // if
                
                
                
                if ((minSpecificityWeight !== null) && (specificityWeight < minSpecificityWeight)) {
                    return [specificityWeight, SpecificityWeightStatus.TooSmall];
                } // if
                
                
                
                return [specificityWeight, SpecificityWeightStatus.Fit];
            })();
            let group = accum.get(weightStatus);             // get an existing collector
            if (!group) accum.set(weightStatus, group = []); // create a new collector
            group.push({ selector, specificityWeight });
            return accum;
        },
        new Map<SpecificityWeightStatus, { selector: PureSelectorModel, specificityWeight: number }[]>()
    );
    //#endregion group selectors by specificity weight status
    
    const fitSelectors      = selectorGroupBySpecificityWeightStatus.get(SpecificityWeightStatus.Fit      ) ?? [];
    const tooBigSelectors   = selectorGroupBySpecificityWeightStatus.get(SpecificityWeightStatus.TooBig   ) ?? [];
    const tooSmallSelectors = selectorGroupBySpecificityWeightStatus.get(SpecificityWeightStatus.TooSmall ) ?? [];
    
    
    
    return createSelectorGroup(
        ...fitSelectors.map((group) => group.selector),
        
        ...tooBigSelectors.flatMap((group) => {
            const reversedSelector = group.selector.reverse(); // reverse & mutate the current `group.selector` array
            
            type SelectorAccum = { remaining: number, reducedSelector: SelectorModel }
            const { reducedSelector: reversedReducedSelector, remaining: remainingSpecificityWeight } : SelectorAccum = (
                reversedSelector.slice(0) // clone the `reversedSelector` because the `reduce()` uses `splice()` to break the iteration
                .reduce((accum, selectorEntry, index, array): SelectorAccum => {
                    if (accum.remaining <= 0) {
                        array.splice(1); // eject early by mutating iterated copy - it's okay to **mutate** the `array` because it already cloned at `slice(0)`
                        return accum;
                    } // if
                    
                    
                    
                    if (isSimpleSelector(selectorEntry)) {
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
                        if (selectorToken === ':') {
                            switch (selectorName) {
                                case 'is':
                                case 'not':
                                case 'has':
                                    const specificityWeight = calculateSpecificity([selectorEntry])[1];
                                    accum.remaining -= specificityWeight; // reduce the counter
                                    break;
                                
                                case 'where':
                                    break; // don't reduce the counter
                                
                                default:
                                    accum.remaining--; // reduce the counter
                            } // switch
                        }
                        else if (['.', '[',].includes(selectorToken)) {
                            accum.remaining--; // reduce the counter
                        } // if
                    } // if
                    
                    
                    
                    accum.reducedSelector.push(selectorEntry);
                    return accum;
                }, ({
                    remaining       : (group.specificityWeight - (maxSpecificityWeight ?? group.specificityWeight)),
                    reducedSelector : [],
                } as SelectorAccum))
            );
            
            
            
            const [whereSelector, ...pseudoElmSelectors] = groupSelector(
                reversedReducedSelector.reverse(),
                { selectorName: 'where' }
            );
            whereSelector.unshift(
                ...reversedSelector.slice(reversedReducedSelector.length).reverse(),
            );
            whereSelector.push(
                ...(new Array<SimpleSelectorModel>((remainingSpecificityWeight < 0) ? -remainingSpecificityWeight : 0)).fill(
                    nthChildNSelector // or use `nth-child(n)`
                ),
            );
            return createSelectorGroup(
                whereSelector,
                ...pseudoElmSelectors,
            );
        }),
        
        ...tooSmallSelectors.map((group) => createSelector(
            ...group.selector,
            ...(new Array<SimpleSelectorModel>((minSpecificityWeight ?? 1) - group.specificityWeight)).fill(
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
                .pop()            // repeats the last selector until minSpecificityWeight satisfied
                ??
                nthChildNSelector // or use `nth-child(n)`
            )
        )),
    );
};

export interface SelectorOptions {
    groupSelectors ?: boolean
    
    specificityWeight    ?: number|null
    minSpecificityWeight ?: number|null
    maxSpecificityWeight ?: number|null
}
const defaultSelectorOptions : Required<SelectorOptions> = {
    groupSelectors  : true,
    
    specificityWeight    : null,
    minSpecificityWeight : null,
    maxSpecificityWeight : null,
};
export const mergeSelectors = (selectorGroup: SelectorModelGroup, options: SelectorOptions = defaultSelectorOptions): SelectorModelGroup => {
    const {
        groupSelectors : doGroupSelectors = defaultSelectorOptions.groupSelectors,
        
        specificityWeight,
    } = options;
    const minSpecificityWeight = specificityWeight ?? options.minSpecificityWeight ?? null;
    const maxSpecificityWeight = specificityWeight ?? options.maxSpecificityWeight ?? null;
    
    
    
    if (
        !doGroupSelectors // do not perform grouping
        &&
        (minSpecificityWeight === null) && (maxSpecificityWeight === null) // do not perform transform
    ) return selectorGroup; // nothing to do
    
    
    
    const normalizedSelectorGroup = (
        selectorGroup
        .flatMap((selector) => ungroupSelector(selector))
        .filter(isNotEmptySelector)
    );
    
    
    
    if (
        (!doGroupSelectors || (normalizedSelectorGroup.length <= 1)) // do not perform grouping || only singular => nothing to group
        &&
        (minSpecificityWeight === null) && (maxSpecificityWeight === null) // do not perform transform
    ) return normalizedSelectorGroup; // nothing to do
    
    
    
    // transform:
    const adjustedSelectorGroup = adjustSpecificityWeight(
        normalizedSelectorGroup
        ,
        minSpecificityWeight,
        maxSpecificityWeight
    );
    
    
    
    if (
        (!doGroupSelectors || (adjustedSelectorGroup.length <= 1)) // do not perform grouping || only singular => nothing to group
    ) return adjustedSelectorGroup; // nothing to do
    
    
    
    //#region group selectors by parent position
    const enum ParentPosition {
        OnlyParent,
        OnlyBeginParent,
        OnlyEndParent,
        RandomParent,
    }
    type GroupByParentPosition = Map<ParentPosition, PureSelectorModel[]>
    const selectorGroupByParentPosition = adjustedSelectorGroup.map((selector) => selector.filter(isNotEmptySelectorEntry) as PureSelectorModel).reduce(
        (accum, selector): GroupByParentPosition => {
            const position = ((): ParentPosition => {
                const hasFirstParent = ((): boolean => {
                    if (selector.length < 1) return false;                      // at least 1 entry must exist, for the first_parent
                    
                    const firstSelectorEntry = selector[0];                     // take the first entry
                    return isParentSelector(firstSelectorEntry);                // the entry must be ParentSelector
                })();
                
                const onlyParent      = hasFirstParent && (selector.length === 1);
                if (onlyParent) return ParentPosition.OnlyParent;
                
                
                
                const hasMiddleParent = ((): boolean => {
                    if (selector.length < 3) return false;                      // at least 3 entry must exist, the first & last are already reserved, the middle one is the middle_parent
                    
                    for (let index = 1, maxIndex = (selector.length - 2); index <= maxIndex; index++) {
                        const middleSelectorEntry = selector[index];            // take the 2nd_first_entry until the 2nd_last_entry
                        if (isParentSelector(middleSelectorEntry)) return true; // the entry must be ParentSelector, otherwise skip to next
                    } // for
                    
                    return false; // ran out of iterator => not found
                })();
                const hasLastParent = ((): boolean => {
                    const length = selector.length;
                    if (length < 2) return false;                               // at least 2 entry must exist, the first is already reserved, the last one is the last_parent
                    
                    const lastSelectorEntry = selector[length - 1];             // take the last entry
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
            group.push(selector);
            return accum;
        },
        new Map<ParentPosition, PureSelectorModel[]>()
    );
    //#endregion group selectors by parent position
    
    const onlyParentSelectorGroup      = selectorGroupByParentPosition.get(ParentPosition.OnlyParent      ) ?? [];
    const onlyBeginParentSelectorGroup = selectorGroupByParentPosition.get(ParentPosition.OnlyBeginParent ) ?? [];
    const onlyEndParentSelectorGroup   = selectorGroupByParentPosition.get(ParentPosition.OnlyEndParent   ) ?? [];
    const randomParentSelectorGroup    = selectorGroupByParentPosition.get(ParentPosition.RandomParent    ) ?? [];
    
    
    
    type GroupByCombinator = Map<Combinator|null, PureSelectorModelGroup>
    const createGroupByCombinator = (fetch: (selector: PureSelectorModel) => Combinator|null) => (accum: GroupByCombinator, selector: PureSelectorModel): GroupByCombinator => {
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
        ...((): SelectorModelGroup => {
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
                new Map<Combinator|null, PureSelectorModelGroup>()
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
        ...((): SelectorModelGroup => {
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
                new Map<Combinator|null, PureSelectorModelGroup>()
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
