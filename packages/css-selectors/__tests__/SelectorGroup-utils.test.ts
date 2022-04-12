import {
    // parses:
    parseSelectors,
    
    
    
    // SelectorEntry creates & tests:
    elementSelector,
    classSelector,
    pseudoClassSelector,
    
    isParentSelector,
    
    isAttrSelectorOf,
    isElementSelectorOf,
    isClassSelectorOf,
    isPseudoClassSelectorOf,
    
    combinator,
    
    isCombinatorOf,
    
    
    
    // Selector creates & tests:
    selector,
    selectorGroup,
    
    
    
    // renders:
    selectorsToString,
    
    
    
    // transforms:
    FlatMapSelectorsCallback,
    flatMapSelectors,
} from '../src/css-selectors'



const replaceDivToSpan: FlatMapSelectorsCallback = (selectorEntry) => {
    if (isElementSelectorOf(selectorEntry, 'div')) {
        return elementSelector('span');
    } // if
    
    return selectorEntry;
};
const replaceExpensiveToVeryCheap: FlatMapSelectorsCallback = (selectorEntry) => {
    if (isClassSelectorOf(selectorEntry, 'expensive')) {
        return selector(
            classSelector('very'),
            classSelector('cheap'),
        );
    } // if
    
    return selectorEntry;
};
const removeUnusedThingGarbage: FlatMapSelectorsCallback = (selectorEntry) => {
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
const doNotMutate: FlatMapSelectorsCallback = (selectorEntry) => {
    return undefined;
};
const replaceDescendantsToChildren: FlatMapSelectorsCallback = (selectorEntry) => {
    if (isCombinatorOf(selectorEntry, ' ')) {
        return combinator('>');
    } // if
    
    return selectorEntry;
};
const replaceDescendantsWithWrapper: FlatMapSelectorsCallback = (selectorEntry) => {
    if (isCombinatorOf(selectorEntry, ' ')) {
        return selector(
            combinator('>'),
            classSelector('wrapper'),
            combinator('>'),
        );
    } // if
    
    return selectorEntry;
};
const replaceParentWithRealParent: FlatMapSelectorsCallback = (selectorEntry) => {
    if (isParentSelector(selectorEntry)) {
        return selector(
            classSelector('parent'),
            pseudoClassSelector('yeah'),
        );
    } // if
    
    return selectorEntry;
};



test(`flatMapSelectors(empty)`, () => {
    expect(selectorsToString(flatMapSelectors(
        selectorGroup(
            /* empty */
        ),
        replaceDivToSpan
    )))
    .toBe(
        ''
    );
});
test(`flatMapSelectors(empty)`, () => {
    expect(selectorsToString(flatMapSelectors(
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
test(`flatMapSelectors(empty)`, () => {
    expect(selectorsToString(flatMapSelectors(
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
test(`flatMapSelectors(falsy)`, () => {
    expect(selectorsToString(flatMapSelectors(
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
test(`flatMapSelectors(falsy)`, () => {
    expect(selectorsToString(flatMapSelectors(
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
test(`flatMapSelectors(falsy)`, () => {
    expect(selectorsToString(flatMapSelectors(
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
test(`flatMapSelectors(falsy)`, () => {
    expect(selectorsToString(flatMapSelectors(
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
test(`flatMapSelectors(falsy)`, () => {
    expect(selectorsToString(flatMapSelectors(
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



test(`flatMapSelectors()`, () => {
    expect(selectorsToString(flatMapSelectors(
        parseSelectors(
            '.product>div>:first-child'
        )!,
        replaceDivToSpan
    )))
    .toBe(
        '.product>span>:first-child'
    );
});
test(`flatMapSelectors()`, () => {
    expect(selectorsToString(flatMapSelectors(
        parseSelectors(
            '.product.expensive>#list'
        )!,
        replaceExpensiveToVeryCheap
    )))
    .toBe(
        '.product.very.cheap>#list'
    );
});
test(`flatMapSelectors()`, () => {
    expect(selectorsToString(flatMapSelectors(
        parseSelectors(
            '.product.unused>#some[thing="bleh"]:valid+:garbage:first-child'
        )!,
        removeUnusedThingGarbage
    )))
    .toBe(
        '.product>#some:valid+:first-child'
    );
});
test(`flatMapSelectors()`, () => {
    expect(selectorsToString(flatMapSelectors(
        parseSelectors(
            '.product.unused>#some[thing="bleh"]:valid+:garbage:first-child'
        )!,
        doNotMutate
    )))
    .toBe(
        '.product.unused>#some[thing="bleh"]:valid+:garbage:first-child'
    );
});
test(`flatMapSelectors()`, () => {
    expect(selectorsToString(flatMapSelectors(
        parseSelectors(
            '.ultra :deep #field+:nth-child(2n+3), #this:is(#very .exciting .thing, ::backdrop+:hover)'
        )!,
        replaceDescendantsToChildren
    )))
    .toBe(
        '.ultra>:deep>#field+:nth-child(2n+3), #this:is(#very>.exciting>.thing, ::backdrop+:hover)'
    );
});
test(`flatMapSelectors()`, () => {
    expect(selectorsToString(flatMapSelectors(
        parseSelectors(
            '.ultra :deep #field+:nth-child(2n+3), #this:is(#very .exciting .thing, ::backdrop+:hover)'
        )!,
        replaceDescendantsWithWrapper
    )))
    .toBe(
        '.ultra>.wrapper>:deep>.wrapper>#field+:nth-child(2n+3), #this:is(#very>.wrapper>.exciting>.wrapper>.thing, ::backdrop+:hover)'
    );
});
test(`flatMapSelectors()`, () => {
    expect(selectorsToString(flatMapSelectors(
        parseSelectors(
            '&>.sub+next, .ultra&:deep #field+:nth-child(2n+3), #this:is(#very&.exciting>.thing, ::backdrop[title="you & me"])'
        )!,
        replaceParentWithRealParent
    )))
    .toBe(
        '.parent:yeah>.sub+next, .ultra.parent:yeah:deep #field+:nth-child(2n+3), #this:is(#very.parent:yeah.exciting>.thing, ::backdrop[title="you & me"])'
    );
});
