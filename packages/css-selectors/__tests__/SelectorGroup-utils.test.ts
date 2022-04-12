import {
    // types:
    SelectorName,
    
    
    
    // parses:
    parseSelectors,
    
    
    
    // SelectorEntry creates & tests:
    parentSelector,
    universalSelector,
    attrSelector,
    elementSelector,
    idSelector,
    classSelector,
    pseudoClassSelector,
    pseudoElementSelector,
    
    isParentSelector,
    
    isAttrSelectorOf,
    isElementSelectorOf,
    isIdSelectorOf,
    isClassSelectorOf,
    isPseudoClassSelectorOf,
    isClassOrPseudoClassSelectorOf,
    isPseudoElementSelectorOf,
    isElementOrPseudoElementSelectorOf,
    
    combinator,
    
    isCombinatorOf,
    
    
    
    // Selector creates & tests:
    Selector,
    selector,
    SelectorGroup,
    selectorGroup,
    
    isNotEmptySelectors,
    countSelectors,
    
    
    
    // renders:
    selectorsToString,
    
    
    
    // transforms:
    ReplaceSelectorCallback,
    replaceSelectors,
    GroupSelectorOptions,
    groupSelectors,
    groupSelector,
    UngroupSelectorOptions,
    ungroupSelector,
    ungroupSelectors,
    
    
    
    // measures:
    Specificity,
    calculateSpecificity,
} from '../src/css-selectors'



//#region test replaceSelectors()
//#region replacements
const replaceDivToSpan: ReplaceSelectorCallback = (selectorEntry) => {
    if (isElementSelectorOf(selectorEntry, 'div')) {
        return elementSelector('span');
    } // if
    
    return selectorEntry;
};
const replaceExpensiveToVeryCheap: ReplaceSelectorCallback = (selectorEntry) => {
    if (isClassSelectorOf(selectorEntry, 'expensive')) {
        return selector(
            classSelector('very'),
            classSelector('cheap'),
        );
    } // if
    
    return selectorEntry;
};
const removeUnusedThingGarbage: ReplaceSelectorCallback = (selectorEntry) => {
    if (isClassSelectorOf(selectorEntry, 'unused')) {
        return null;
    } // if
    if (isAttrSelectorOf(selectorEntry, 'thing')) {
        return false;
    } // if
    if (isPseudoClassSelectorOf(selectorEntry, 'garbage')) {
        return true;
    } // if
    
    return selectorEntry;
};
const doNotMutate: ReplaceSelectorCallback = (selectorEntry) => {
    return undefined;
};
const replaceDescendantsToChildren: ReplaceSelectorCallback = (selectorEntry) => {
    if (isCombinatorOf(selectorEntry, ' ')) {
        return combinator('>');
    } // if
    
    return selectorEntry;
};
const replaceDescendantsWithWrapper: ReplaceSelectorCallback = (selectorEntry) => {
    if (isCombinatorOf(selectorEntry, ' ')) {
        return selector(
            combinator('>'),
            classSelector('wrapper'),
            combinator('>'),
        );
    } // if
    
    return selectorEntry;
};
const replaceParentWithRealParent: ReplaceSelectorCallback = (selectorEntry) => {
    if (isParentSelector(selectorEntry)) {
        return selector(
            classSelector('parent'),
            pseudoClassSelector('yeah'),
        );
    } // if
    
    return selectorEntry;
};
//#endregion replacements



test(`replaceSelectors(empty)`, () => {
    expect(selectorsToString(replaceSelectors(
        selectorGroup(
            /* empty */
        ),
        replaceDivToSpan
    )))
    .toBe(
        ''
    );
});
test(`replaceSelectors(empty)`, () => {
    expect(selectorsToString(replaceSelectors(
        selectorGroup(
            selector(
                /* empty */
            ),
        ),
        replaceDivToSpan
    )))
    .toBe(
        ''
    );
});
test(`replaceSelectors(empty)`, () => {
    expect(selectorsToString(replaceSelectors(
        selectorGroup(
            selector(
                /* empty */
            ),
            selector(
                /* empty */
            ),
            selector(
                /* empty */
            ),
        ),
        replaceDivToSpan
    )))
    .toBe(
        ''
    );
});
test(`replaceSelectors(falsy)`, () => {
    expect(selectorsToString(replaceSelectors(
        selectorGroup(
            undefined,
            selector(
                /* empty */
            ),
            null,
            selector(
                /* empty */
            ),
            false,
            selector(
                /* empty */
            ),
            true,
            selector(
                /* empty */
            ),
        ),
        replaceDivToSpan
    )))
    .toBe(
        ''
    );
});
test(`replaceSelectors(falsy)`, () => {
    expect(selectorsToString(replaceSelectors(
        selectorGroup(
            undefined,
            selector(
                undefined,
            ),
            null,
            selector(
                null,
            ),
            false,
            selector(
                false,
            ),
            true,
            selector(
                true,
            ),
        ),
        replaceDivToSpan
    )))
    .toBe(
        ''
    );
});
test(`replaceSelectors(falsy)`, () => {
    expect(selectorsToString(replaceSelectors(
        selectorGroup(
            undefined,
            null,
            false,
            true,
        ),
        replaceDivToSpan
    )))
    .toBe(
        ''
    );
});
test(`replaceSelectors(falsy)`, () => {
    expect(selectorsToString(replaceSelectors(
        selectorGroup(
            selector(
                undefined,
                null,
                false,
                true,
            ),
            selector(
                undefined,
                null,
                false,
                true,
            ),
        ),
        replaceDivToSpan
    )))
    .toBe(
        ''
    );
});
test(`replaceSelectors(falsy)`, () => {
    expect(selectorsToString(replaceSelectors(
        selectorGroup(
            undefined,
            null,
            false,
            true,
            selector(
                undefined,
                null,
                false,
                true,
            ),
            undefined,
            null,
            false,
            true,
            selector(
                undefined,
                null,
                false,
                true,
            ),
            undefined,
            null,
            false,
            true,
        ),
        replaceDivToSpan
    )))
    .toBe(
        ''
    );
});



test(`replaceSelectors()`, () => {
    expect(selectorsToString(replaceSelectors(
        parseSelectors(
            '.product>div>:first-child'
        )!,
        replaceDivToSpan
    )))
    .toBe(
        '.product>span>:first-child'
    );
});
test(`replaceSelectors()`, () => {
    expect(selectorsToString(replaceSelectors(
        parseSelectors(
            '.product.expensive>#list'
        )!,
        replaceExpensiveToVeryCheap
    )))
    .toBe(
        '.product.very.cheap>#list'
    );
});
test(`replaceSelectors()`, () => {
    expect(selectorsToString(replaceSelectors(
        parseSelectors(
            '.product.unused>#some[thing="bleh"]:valid+:garbage:first-child'
        )!,
        removeUnusedThingGarbage
    )))
    .toBe(
        '.product>#some:valid+:first-child'
    );
});
test(`replaceSelectors()`, () => {
    expect(selectorsToString(replaceSelectors(
        parseSelectors(
            '.product.unused>#some[thing="bleh"]:valid+:garbage:first-child'
        )!,
        doNotMutate
    )))
    .toBe(
        '.product.unused>#some[thing="bleh"]:valid+:garbage:first-child'
    );
});
test(`replaceSelectors()`, () => {
    expect(selectorsToString(replaceSelectors(
        parseSelectors(
            '.ultra :deep #field+:nth-child(2n+3), #this:is(#very .exciting .thing, ::backdrop+:hover)'
        )!,
        replaceDescendantsToChildren
    )))
    .toBe(
        '.ultra>:deep>#field+:nth-child(2n+3), #this:is(#very>.exciting>.thing, ::backdrop+:hover)'
    );
});
test(`replaceSelectors()`, () => {
    expect(selectorsToString(replaceSelectors(
        parseSelectors(
            '.ultra :deep #field+:nth-child(2n+3), #this:is(#very .exciting .thing, ::backdrop+:hover)'
        )!,
        replaceDescendantsWithWrapper
    )))
    .toBe(
        '.ultra>.wrapper>:deep>.wrapper>#field+:nth-child(2n+3), #this:is(#very>.wrapper>.exciting>.wrapper>.thing, ::backdrop+:hover)'
    );
});
test(`replaceSelectors()`, () => {
    expect(selectorsToString(replaceSelectors(
        parseSelectors(
            '&>.sub+next, .ultra&:deep #field+:nth-child(2n+3), #this:is(#very&.exciting>.thing, ::backdrop[title="you & me"])'
        )!,
        replaceParentWithRealParent
    )))
    .toBe(
        '.parent:yeah>.sub+next, .ultra.parent:yeah:deep #field+:nth-child(2n+3), #this:is(#very.parent:yeah.exciting>.thing, ::backdrop[title="you & me"])'
    );
});
//#endregion test replaceSelectors()



//#region groupSelectors()
test(`groupSelectors(empty)`, () => {
    expect(selectorsToString(groupSelectors(
        selectorGroup(
            /* empty */
        )
    )))
    .toBe(
        ''
    );
});
test(`groupSelectors(empty)`, () => {
    expect(selectorsToString(groupSelectors(
        selectorGroup(
            selector(
                /* empty */
            ),
        )
    )))
    .toBe(
        ''
    );
});
test(`groupSelectors(empty)`, () => {
    expect(selectorsToString(groupSelectors(
        selectorGroup(
            selector(
                /* empty */
            ),
            selector(
                /* empty */
            ),
            selector(
                /* empty */
            ),
        )
    )))
    .toBe(
        ''
    );
});
test(`groupSelectors(falsy)`, () => {
    expect(selectorsToString(groupSelectors(
        selectorGroup(
            undefined,
            selector(
                /* empty */
            ),
            null,
            selector(
                /* empty */
            ),
            false,
            selector(
                /* empty */
            ),
            true,
            selector(
                /* empty */
            ),
        )
    )))
    .toBe(
        ''
    );
});
test(`groupSelectors(falsy)`, () => {
    expect(selectorsToString(groupSelectors(
        selectorGroup(
            undefined,
            selector(
                undefined,
            ),
            null,
            selector(
                null,
            ),
            false,
            selector(
                false,
            ),
            true,
            selector(
                true,
            ),
        )
    )))
    .toBe(
        ''
    );
});
test(`groupSelectors(falsy)`, () => {
    expect(selectorsToString(groupSelectors(
        selectorGroup(
            undefined,
            null,
            false,
            true,
        )
    )))
    .toBe(
        ''
    );
});
test(`groupSelectors(falsy)`, () => {
    expect(selectorsToString(groupSelectors(
        selectorGroup(
            selector(
                undefined,
                null,
                false,
                true,
            ),
            selector(
                undefined,
                null,
                false,
                true,
            ),
        )
    )))
    .toBe(
        ''
    );
});
test(`groupSelectors(falsy)`, () => {
    expect(selectorsToString(groupSelectors(
        selectorGroup(
            undefined,
            null,
            false,
            true,
            selector(
                undefined,
                null,
                false,
                true,
            ),
            undefined,
            null,
            false,
            true,
            selector(
                undefined,
                null,
                false,
                true,
            ),
            undefined,
            null,
            false,
            true,
        )
    )))
    .toBe(
        ''
    );
});



const groupList : SelectorName[] & ('is'|'not'|'has'|'where')[] = ['is','not','has','where'];
groupList.forEach((group) => {
    [false, true].forEach((cancelSingular) => {
        const options : GroupSelectorOptions = {
            selectorName          : group,
            cancelGroupIfSingular : cancelSingular,
        };
        
        const tests : { ungrouped: string, grouped: string|null, partialGrouped?: true }[] = [
            {
                ungrouped : `.product>div>:first-child`,
                grouped   : `:${group}(.product>div>:first-child)`,
            },
            {
                ungrouped : `.product.expensive>#list, ::backdrop:hover, ::before, ::after`,
                grouped   : `:${group}(.product.expensive>#list), ::backdrop:hover, ::before, ::after`,
            },
            {
                ungrouped : `::backdrop:hover, ::before, ::after`,
                grouped   : null,
            },
            {
                ungrouped : `.product.unused>#some[thing="bleh"]:valid+:garbage:first-child`,
                grouped   : `:${group}(.product.unused>#some[thing="bleh"]:valid+:garbage:first-child)`,
            },
            {
                ungrouped : `.ultra :deep #field+:nth-child(2n+3), #this:is(#very .exciting .thing), ::backdrop+:hover`,
                grouped   : `:${group}(.ultra :deep #field+:nth-child(2n+3), #this:is(#very .exciting .thing)), ::backdrop+:hover`,
                partialGrouped : true,
            },
            {
                ungrouped : `&>.sub+next, .ultra&:deep #field+:nth-child(2n+3), #this:is(#very&.exciting>.thing), ::backdrop[title="you & me"]`,
                grouped   : `:${group}(&>.sub+next, .ultra&:deep #field+:nth-child(2n+3), #this:is(#very&.exciting>.thing)), ::backdrop[title="you & me"]`,
                partialGrouped : true,
            },
        ];
        tests.forEach(({ ungrouped, grouped, partialGrouped = false }) => {
            const shouldUngroup = (grouped === null) || (cancelSingular && !partialGrouped);
            
            test(`groupSelectors()`, () => {
                expect(selectorsToString(groupSelectors(
                    parseSelectors(
                        ungrouped
                    )!,
                    options
                )))
                .toBe(
                    shouldUngroup ? ungrouped : grouped
                );
            });
        });
    });
});
//#endregion groupSelectors()



//#region groupSelector()
test(`groupSelector(empty)`, () => {
    expect(selectorsToString(groupSelector(
        selector(
            /* empty */
        )
    )))
    .toBe(
        ''
    );
});
test(`groupSelector(falsy)`, () => {
    expect(selectorsToString(groupSelector(
        selector(
            undefined,
            null,
            false,
            true,
        )
    )))
    .toBe(
        ''
    );
});



groupList.forEach((group) => {
    [false, true].forEach((cancelSingular) => {
        const options : GroupSelectorOptions = {
            selectorName          : group,
            cancelGroupIfSingular : cancelSingular,
        };
        
        const tests : { ungrouped: string, grouped: string|null }[] = [
            {
                ungrouped : `.product>div>:first-child`,
                grouped   : `:${group}(.product>div>:first-child)`,
            },
            {
                ungrouped : `.product.expensive>#list`,
                grouped   : `:${group}(.product.expensive>#list)`,
            },
            {
                ungrouped : `::backdrop:hover`,
                grouped   : null,
            },
            {
                ungrouped : `::before`,
                grouped   : null,
            },
            {
                ungrouped : `#product>.item::after`,
                grouped   : null,
            },
            {
                ungrouped : `.product.unused>#some[thing="bleh"]:valid+:garbage:first-child`,
                grouped   : `:${group}(.product.unused>#some[thing="bleh"]:valid+:garbage:first-child)`,
            },
            {
                ungrouped : `.ultra :deep #field+:nth-child(2n+3)`,
                grouped   : `:${group}(.ultra :deep #field+:nth-child(2n+3))`,
            },
            {
                ungrouped : `#this:is(#very .exciting .thing)`,
                grouped   : `:${group}(#this:is(#very .exciting .thing))`,
            },
            {
                ungrouped : `&>.sub+next`,
                grouped   : `:${group}(&>.sub+next)`,
            },
            {
                ungrouped : `.ultra&:deep #field+:nth-child(2n+3)`,
                grouped   : `:${group}(.ultra&:deep #field+:nth-child(2n+3))`,
            },
            {
                ungrouped : `#this:is(#very&.exciting>.thing)`,
                grouped   : `:${group}(#this:is(#very&.exciting>.thing))`,
            },
            {
                ungrouped : `::backdrop[title="you & me"]`,
                grouped   : null,
            },
        ];
        tests.forEach(({ ungrouped, grouped }) => {
            const shouldUngroup = (grouped === null) || cancelSingular;
            
            test(`groupSelector()`, () => {
                expect(selectorsToString(groupSelector(
                    parseSelectors(
                        ungrouped
                    )![0]!,
                    options
                )))
                .toBe(
                    shouldUngroup ? ungrouped : grouped
                );
            });
        });
    });
});
//#endregion groupSelector()



//#region test ungroupSelector()
test(`ungroupSelector(empty)`, () => {
    expect(selectorsToString(ungroupSelector(
        selector(
            /* empty */
        )
    )))
    .toBe(
        ''
    );
});
test(`ungroupSelector(falsy)`, () => {
    expect(selectorsToString(ungroupSelector(
        selector(
            undefined,
            null,
            false,
            true,
        )
    )))
    .toBe(
        ''
    );
});



groupList.forEach((group) => {
    [true, false].forEach((testSingular) => { [false, true].forEach((ungroupAll) => {
        const options : UngroupSelectorOptions = {
            selectorName : ungroupAll ? groupList : undefined,
        };
        const shouldUngroup = testSingular || ungroupAll || ['is', 'where'].includes(group);
        
        const tests : { ungrouped: string, grouped: string|null }[] = [
            {
                ungrouped : `.product>div>:first-child`,
                grouped   : `:${group}(.product>div>:first-child)`,
            },
            {
                ungrouped : `::backdrop:hover`,
                grouped   : null,
            },
            {
                ungrouped : `::before`,
                grouped   : null,
            },
            {
                ungrouped : `#product>.item::after`,
                grouped   : null,
            },
            {
                ungrouped : `.product.unused>#some[thing="bleh"]:valid+:garbage:first-child`,
                grouped   : `:${group}(.product.unused>#some[thing="bleh"]:valid+:garbage:first-child)`,
            },
            {
                ungrouped : `.ultra :deep #field+:nth-child(2n+3)`,
                grouped   : `:${group}(.ultra :deep #field+:nth-child(2n+3))`,
            },
            {
                ungrouped : `#this:is(#very .exciting .thing)`,
                grouped   : `:${group}(#this:is(#very .exciting .thing))`,
            },
            {
                ungrouped : `&>.sub+next`,
                grouped   : `:${group}(&>.sub+next)`,
            },
            {
                ungrouped : `.ultra&:deep #field+:nth-child(2n+3)`,
                grouped   : `:${group}(.ultra&:deep #field+:nth-child(2n+3))`,
            },
            {
                ungrouped : `#this:is(#very&.exciting>.thing)`,
                grouped   : `:${group}(#this:is(#very&.exciting>.thing))`,
            },
            {
                ungrouped : `::backdrop[title="you & me"]`,
                grouped   : null,
            },
        ];
        tests.forEach(({ ungrouped, grouped }) => {
            if (!testSingular && (grouped === null)) return;
            
            test(`ungroupSelector()`, () => {
                expect(selectorsToString(ungroupSelector(
                    parseSelectors(
                        testSingular ? ungrouped : grouped
                    )![0]!,
                    options
                )))
                .toBe(
                    shouldUngroup ? ungrouped : grouped
                );
            });
        });
    })});
});
//#endregion test ungroupSelector()



//#region ungroupSelectors()
test(`ungroupSelectors(empty)`, () => {
    expect(selectorsToString(ungroupSelectors(
        selectorGroup(
            /* empty */
        )
    )))
    .toBe(
        ''
    );
});
test(`ungroupSelectors(empty)`, () => {
    expect(selectorsToString(ungroupSelectors(
        selectorGroup(
            selector(
                /* empty */
            ),
        )
    )))
    .toBe(
        ''
    );
});
test(`ungroupSelectors(empty)`, () => {
    expect(selectorsToString(ungroupSelectors(
        selectorGroup(
            selector(
                /* empty */
            ),
            selector(
                /* empty */
            ),
            selector(
                /* empty */
            ),
        )
    )))
    .toBe(
        ''
    );
});
test(`ungroupSelectors(falsy)`, () => {
    expect(selectorsToString(ungroupSelectors(
        selectorGroup(
            undefined,
            selector(
                /* empty */
            ),
            null,
            selector(
                /* empty */
            ),
            false,
            selector(
                /* empty */
            ),
            true,
            selector(
                /* empty */
            ),
        )
    )))
    .toBe(
        ''
    );
});
test(`ungroupSelectors(falsy)`, () => {
    expect(selectorsToString(ungroupSelectors(
        selectorGroup(
            undefined,
            selector(
                undefined,
            ),
            null,
            selector(
                null,
            ),
            false,
            selector(
                false,
            ),
            true,
            selector(
                true,
            ),
        )
    )))
    .toBe(
        ''
    );
});
test(`ungroupSelectors(falsy)`, () => {
    expect(selectorsToString(ungroupSelectors(
        selectorGroup(
            undefined,
            null,
            false,
            true,
        )
    )))
    .toBe(
        ''
    );
});
test(`ungroupSelectors(falsy)`, () => {
    expect(selectorsToString(ungroupSelectors(
        selectorGroup(
            selector(
                undefined,
                null,
                false,
                true,
            ),
            selector(
                undefined,
                null,
                false,
                true,
            ),
        )
    )))
    .toBe(
        ''
    );
});
test(`ungroupSelectors(falsy)`, () => {
    expect(selectorsToString(ungroupSelectors(
        selectorGroup(
            undefined,
            null,
            false,
            true,
            selector(
                undefined,
                null,
                false,
                true,
            ),
            undefined,
            null,
            false,
            true,
            selector(
                undefined,
                null,
                false,
                true,
            ),
            undefined,
            null,
            false,
            true,
        )
    )))
    .toBe(
        ''
    );
});



groupList.forEach((group) => {
    [false, true].forEach((testSingular) => { [false, true].forEach((ungroupAll) => {
        const options : UngroupSelectorOptions = {
            selectorName : ungroupAll ? groupList : undefined,
        };
        const shouldUngroup = testSingular || ungroupAll || ['is', 'where'].includes(group);
        
        const tests : { ungrouped: string, grouped: string|null }[] = [
            {
                ungrouped : `.product>div>:first-child`,
                grouped   : `:${group}(.product>div>:first-child)`,
            },
            {
                ungrouped : `.product.expensive>#list, ::backdrop:hover, ::before, ::after`,
                grouped   : `:${group}(.product.expensive>#list), ::backdrop:hover, ::before, ::after`,
            },
            {
                ungrouped : `::backdrop:hover, ::before, ::after`,
                grouped   : null,
            },
            {
                ungrouped : `.product.unused>#some[thing="bleh"]:valid+:garbage:first-child`,
                grouped   : `:${group}(.product.unused>#some[thing="bleh"]:valid+:garbage:first-child)`,
            },
            {
                ungrouped : `.ultra :deep #field+:nth-child(2n+3), #this:is(#very .exciting .thing), ::backdrop+:hover`,
                grouped   : `:${group}(.ultra :deep #field+:nth-child(2n+3), #this:is(#very .exciting .thing)), ::backdrop+:hover`,
            },
            {
                ungrouped : `&>.sub+next, .ultra&:deep #field+:nth-child(2n+3), #this:is(#very&.exciting>.thing), ::backdrop[title="you & me"]`,
                grouped   : `:${group}(&>.sub+next, .ultra&:deep #field+:nth-child(2n+3), #this:is(#very&.exciting>.thing)), ::backdrop[title="you & me"]`,
            },
        ];
        tests.forEach(({ ungrouped, grouped }) => {
            if (!testSingular && (grouped === null)) return;
            
            test(`ungroupSelectors()`, () => {
                expect(selectorsToString(ungroupSelectors(
                    parseSelectors(
                        testSingular ? ungrouped : grouped
                    )!,
                    options
                )))
                .toBe(
                    shouldUngroup ? ungrouped : grouped
                );
            });
        });
    })});
});
//#endregion ungroupSelectors()



//#region calculateSpecificity()
const zeroSpecificity: Specificity = [0, 0, 0];
test(`calculateSpecificity(empty)`, () => {
    expect(calculateSpecificity(
        selector(
            /* empty */
        )
    ))
    .toEqual(
        zeroSpecificity
    );
});
test(`calculateSpecificity(falsy)`, () => {
    expect(calculateSpecificity(
        selector(
            undefined,
            null,
            false,
            true,
        )
    ))
    .toEqual(
        zeroSpecificity
    );
});



groupList.forEach((group) => {
    const isZeroSpecificity = (group === 'where');
    const tests : { selector: string, specificity: Specificity }[] = [
        {
            selector    : `.product>div>:first-child`,
            specificity : [0, 2, 1],
        },
        {
            selector    : `:${group}(.product>div>:first-child)`,
            specificity : isZeroSpecificity ? zeroSpecificity : [0, 2, 1],
        },
        {
            selector    : `.product.expensive>#list`,
            specificity : [1, 2, 0],
        },
        {
            selector    : `:${group}(.product.expensive>#list)`,
            specificity : isZeroSpecificity ? zeroSpecificity : [1, 2, 0],
        },
        {
            selector    : `::backdrop:hover`,
            specificity : [0, 1, 1],
        },
        {
            selector    : `:${group}(::backdrop:hover)`,
            specificity : isZeroSpecificity ? zeroSpecificity : [0, 1, 1],
        },
        {
            selector    : `::before`,
            specificity : [0, 0, 1],
        },
        {
            selector    : `:${group}(::before)`,
            specificity : isZeroSpecificity ? zeroSpecificity : [0, 0, 1],
        },
        {
            selector    : `#product>.item::after`,
            specificity : [1, 1, 1],
        },
        {
            selector    : `:${group}(#product>.item::after)`,
            specificity : isZeroSpecificity ? zeroSpecificity : [1, 1, 1],
        },
        {
            selector    : `.product.unused>#some[thing="bleh"]:valid+:garbage:first-child`,
            specificity : [1, 6, 0],
        },
        {
            selector    : `:${group}(.product.unused>#some[thing="bleh"]:valid+:garbage:first-child)`,
            specificity : isZeroSpecificity ? zeroSpecificity : [1, 6, 0],
        },
        {
            selector    : `.ultra :deep #field+:nth-child(2n+3)`,
            specificity : [1, 3, 0],
        },
        {
            selector    : `:${group}(.ultra :deep #field+:nth-child(2n+3))`,
            specificity : isZeroSpecificity ? zeroSpecificity : [1, 3, 0],
        },
        {
            selector    : `#this:is(#very .exciting .thing)`,
            specificity : [2, 2, 0],
        },
        {
            selector    : `:${group}(#this:is(#very .exciting .thing))`,
            specificity : isZeroSpecificity ? zeroSpecificity : [2, 2, 0],
        },
        {
            selector    : `&>.sub+next`,
            specificity : [0, 1, 1],
        },
        {
            selector    : `:${group}(&>.sub+next)`,
            specificity : isZeroSpecificity ? zeroSpecificity : [0, 1, 1],
        },
        // {
        //     selector    : `.ultra&:deep #field+:nth-child(2n+3)`,
        //     specificity : [0, 0, 0],
        // },
        // {
        //     selector    : `:${group}(.ultra&:deep #field+:nth-child(2n+3))`,
        //     specificity : [0, 0, 0],
        // },
        // {
        //     selector    : `#this:is(#very&.exciting>.thing)`,
        //     specificity : [0, 0, 0],
        // },
        // {
        //     selector    : `:${group}(#this:is(#very&.exciting>.thing))`,
        //     specificity : [0, 0, 0],
        // },
        // {
        //     selector    : `::backdrop[title="you & me"]`,
        //     specificity : [0, 0, 0],
        // },
    ];
    tests.forEach(({ selector, specificity }) => {
        test(`calculateSpecificity()`, () => {
            expect(calculateSpecificity(
                parseSelectors(
                    selector
                )![0]!,
            ))
            .toEqual(
                specificity
            );
        });
    });
});
//#endregion calculateSpecificity()
