import {
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
    ReplaceSelectorsCallback,
    replaceSelectors,
    GroupSelectorOptions,
    groupSelectors,
    groupSelector,
    ungroupSelector,
    ungroupSelectors,
} from '../src/css-selectors'



const replaceDivToSpan: ReplaceSelectorsCallback = (selectorEntry) => {
    if (isElementSelectorOf(selectorEntry, 'div')) {
        return elementSelector('span');
    } // if
    
    return selectorEntry;
};
const replaceExpensiveToVeryCheap: ReplaceSelectorsCallback = (selectorEntry) => {
    if (isClassSelectorOf(selectorEntry, 'expensive')) {
        return selector(
            classSelector('very'),
            classSelector('cheap'),
        );
    } // if
    
    return selectorEntry;
};
const removeUnusedThingGarbage: ReplaceSelectorsCallback = (selectorEntry) => {
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
const doNotMutate: ReplaceSelectorsCallback = (selectorEntry) => {
    return undefined;
};
const replaceDescendantsToChildren: ReplaceSelectorsCallback = (selectorEntry) => {
    if (isCombinatorOf(selectorEntry, ' ')) {
        return combinator('>');
    } // if
    
    return selectorEntry;
};
const replaceDescendantsWithWrapper: ReplaceSelectorsCallback = (selectorEntry) => {
    if (isCombinatorOf(selectorEntry, ' ')) {
        return selector(
            combinator('>'),
            classSelector('wrapper'),
            combinator('>'),
        );
    } // if
    
    return selectorEntry;
};
const replaceParentWithRealParent: ReplaceSelectorsCallback = (selectorEntry) => {
    if (isParentSelector(selectorEntry)) {
        return selector(
            classSelector('parent'),
            pseudoClassSelector('yeah'),
        );
    } // if
    
    return selectorEntry;
};



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



const groupList = ['is','not','has','where'];
groupList.forEach((group) => {
    [false, true].forEach((cancelSingular) => {
        const options : GroupSelectorOptions = {
            selectorName          : group,
            cancelGroupIfSingular : cancelSingular,
        };
        
        test(`groupSelectors()`, () => {
            expect(selectorsToString(groupSelectors(
                parseSelectors(
                    `.product>div>:first-child`
                )!,
                options
            )))
            .toBe(
                cancelSingular
                ?
                `.product>div>:first-child`
                :
                `:${group}(.product>div>:first-child)`
            );
        });
        test(`groupSelectors()`, () => {
            expect(selectorsToString(groupSelectors(
                parseSelectors(
                    `.product.expensive>#list, ::backdrop:hover, ::before, ::after`
                )!,
                options
            )))
            .toBe(
                cancelSingular
                ?
                `.product.expensive>#list, ::backdrop:hover, ::before, ::after`
                :
                `:${group}(.product.expensive>#list), ::backdrop:hover, ::before, ::after`
            );
        });
        test(`groupSelectors()`, () => {
            expect(selectorsToString(groupSelectors(
                parseSelectors(
                    `::backdrop:hover, ::before, ::after`
                )!,
                options
            )))
            .toBe(
                `::backdrop:hover, ::before, ::after`
            );
        });
        test(`groupSelectors()`, () => {
            expect(selectorsToString(groupSelectors(
                parseSelectors(
                    `.product.unused>#some[thing="bleh"]:valid+:garbage:first-child`
                )!,
                options
            )))
            .toBe(
                cancelSingular
                ?
                `.product.unused>#some[thing="bleh"]:valid+:garbage:first-child`
                :
                `:${group}(.product.unused>#some[thing="bleh"]:valid+:garbage:first-child)`
            );
        });
        test(`groupSelectors()`, () => {
            expect(selectorsToString(groupSelectors(
                parseSelectors(
                    `.ultra :deep #field+:nth-child(2n+3), #this:is(#very .exciting .thing), ::backdrop+:hover`
                )!,
                options
            )))
            .toBe(
                `:${group}(.ultra :deep #field+:nth-child(2n+3), #this:is(#very .exciting .thing)), ::backdrop+:hover`
            );
        });
        test(`groupSelectors()`, () => {
            expect(selectorsToString(groupSelectors(
                parseSelectors(
                    `&>.sub+next, .ultra&:deep #field+:nth-child(2n+3), #this:is(#very&.exciting>.thing), ::backdrop[title="you & me"]`
                )!,
                options
            )))
            .toBe(
                `:${group}(&>.sub+next, .ultra&:deep #field+:nth-child(2n+3), #this:is(#very&.exciting>.thing)), ::backdrop[title="you & me"]`
            );
        });
    });
});
