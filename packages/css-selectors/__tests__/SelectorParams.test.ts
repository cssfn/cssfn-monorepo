import {
    // SelectorParams tests:
    isWildParams,
    isAttrSelectorParams,
    isSelectors,
    
    
    
    // SelectorEntry creates & tests:
    attrSelector,
    idSelector,
    classSelector,
    pseudoClassSelector,
    pseudoElementSelector,
    
    combinator,
    
    
    
    // Selector creates & tests:
    selector,
    selectorGroup,
    
    
    
    // renders:
    selectorParamsToString,
} from '../src/css-selectors'



//#region test isWildParams(SelectorParams)
//#region test with AttrSelectorParams
test(`isWildParams(AttrSelectorParams)`, () => {
    expect(isWildParams(
        attrSelector('disabled')[2]
    ))
    .toBe(false);
});
test(`isWildParams(AttrSelectorParams)`, () => {
    expect(isWildParams(
        attrSelector('aria-role', '=', 'button')[2]
    ))
    .toBe(false);
});
test(`isWildParams(AttrSelectorParams)`, () => {
    expect(isWildParams(
        attrSelector('title', '~=', 'hello')[2]
    ))
    .toBe(false);
});
test(`isWildParams(AttrSelectorParams)`, () => {
    expect(isWildParams(
        attrSelector('lang', '|=', 'en')[2]
    ))
    .toBe(false);
});
test(`isWildParams(AttrSelectorParams)`, () => {
    expect(isWildParams(
        attrSelector('title', '^=', 'hello')[2]
    ))
    .toBe(false);
});
test(`isWildParams(AttrSelectorParams)`, () => {
    expect(isWildParams(
        attrSelector('title', '$=', 'hello')[2]
    ))
    .toBe(false);
});
test(`isWildParams(AttrSelectorParams)`, () => {
    expect(isWildParams(
        attrSelector('title', '*=', 'hello')[2]
    ))
    .toBe(false);
});
test(`isWildParams(AttrSelectorParams)`, () => {
    expect(isWildParams(
        attrSelector('title', '=', 'hello', 'i')[2]
    ))
    .toBe(false);
});
test(`isWildParams(AttrSelectorParams)`, () => {
    expect(isWildParams(
        attrSelector('title', '=', 'hello', 'I')[2]
    ))
    .toBe(false);
});
test(`isWildParams(AttrSelectorParams)`, () => {
    expect(isWildParams(
        attrSelector('title', '=', 'hello', 's')[2]
    ))
    .toBe(false);
});
test(`isWildParams(AttrSelectorParams)`, () => {
    expect(isWildParams(
        attrSelector('title', '=', 'hello', 'S')[2]
    ))
    .toBe(false);
});
//#endregion test with AttrSelectorParams

//#region test with SelectorGroup
test(`isWildParams(SelectorGroup)`, () => {
    expect(isWildParams(
        selectorGroup(
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isWildParams(SelectorGroup)`, () => {
    expect(isWildParams(
        selectorGroup(
            selector(
                classSelector('boo'),
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isWildParams(SelectorGroup)`, () => {
    expect(isWildParams(
        selectorGroup(
            selector(
                classSelector('boo'),
                pseudoClassSelector('foo', 'a+b'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isWildParams(SelectorGroup)`, () => {
    expect(isWildParams(
        selectorGroup(
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isWildParams(SelectorGroup)`, () => {
    expect(isWildParams(
        selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isWildParams(SelectorGroup)`, () => {
    expect(isWildParams(
        selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isWildParams(SelectorGroup)`, () => {
    expect(isWildParams(
        selectorGroup(
            undefined,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isWildParams(SelectorGroup)`, () => {
    expect(isWildParams(
        selectorGroup(
            null,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isWildParams(SelectorGroup)`, () => {
    expect(isWildParams(
        selectorGroup(
            false,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isWildParams(SelectorGroup)`, () => {
    expect(isWildParams(
        selectorGroup(
            true,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isWildParams(SelectorGroup)`, () => {
    expect(isWildParams(
        selectorGroup(
            selector(
                undefined,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isWildParams(SelectorGroup)`, () => {
    expect(isWildParams(
        selectorGroup(
            selector(
                null,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isWildParams(SelectorGroup)`, () => {
    expect(isWildParams(
        selectorGroup(
            selector(
                false,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isWildParams(SelectorGroup)`, () => {
    expect(isWildParams(
        selectorGroup(
            selector(
                true,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
['is', 'not', 'where', 'has'].forEach((group) => {
    test(`isWildParams(SelectorGroup)`, () => {
        expect(isWildParams(selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
            selector(
                pseudoClassSelector(group,
                    selectorGroup(
                        selector(
                            classSelector('great'),
                        ),
                    ),
                ),
            ),
        )))
        .toBe(false);
    });
    test(`isWildParams(SelectorGroup)`, () => {
        expect(isWildParams(selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
            selector(
                pseudoClassSelector(group,
                    selectorGroup(
                        selector(
                            classSelector('great'),
                            classSelector('okay'),
                            pseudoClassSelector('valid'),
                        ),
                        selector(
                            classSelector('awesome'),
                        ),
                    ),
                ),
            ),
        )))
        .toBe(false);
    });
    test(`isWildParams(SelectorGroup)`, () => {
        expect(isWildParams(selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
            selector(
                pseudoClassSelector(group,
                    selectorGroup(
                        selector(
                            classSelector('great'),
                            combinator(' '),
                            classSelector('okay'),
                            combinator('>'),
                            pseudoClassSelector('valid'),
                        ),
                        selector(
                            classSelector('awesome'),
                            combinator('+'),
                            pseudoClassSelector('nth-child', '2n+3'),
                        ),
                    ),
                ),
            ),
        )))
        .toBe(false);
    });
    ['is', 'not', 'where', 'has'].forEach((group2) => {
        test(`isWildParams(SelectorGroup)`, () => {
            expect(isWildParams(selectorGroup(
                selector(
                    classSelector('boo'),
                    combinator(' '),
                    pseudoClassSelector('foo', 'a+b'),
                    combinator('>'),
                    idSelector('bleh'),
                ),
                selector(
                    pseudoElementSelector('charlie'),
                ),
                selector(
                    pseudoClassSelector(group,
                        selectorGroup(
                            selector(
                                classSelector('great'),
                            ),
                            selector(
                                pseudoClassSelector(group2,
                                    selectorGroup(
                                        selector(
                                            idSelector('okay'),
                                        ),
                                    ),
                                ),
                            ),
                            selector(
                                pseudoClassSelector(group2,
                                    selectorGroup(
                                        selector(
                                            pseudoClassSelector('valid'),
                                            pseudoClassSelector('first-child'),
                                            combinator('>'),
                                            pseudoClassSelector('nth-child', '2n+3'),
                                        ),
                                        selector(
                                            pseudoElementSelector('backdrop'),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            )))
            .toBe(false);
        });
    });
});
//#endregion test with SelectorGroup

//#region test with WildParams
test(`isWildParams(WildParams)`, () => {
    expect(isWildParams(
        pseudoClassSelector('nth-child', '2n+3')[2]!
    ))
    .toBe(true);
});
test(`isWildParams(WildParams)`, () => {
    expect(isWildParams(
        pseudoClassSelector('foo', '2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq')[2]!
    ))
    .toBe(true);
});
//#endregion test with WildParams
//#endregion test isWildParams(SelectorParams)



//#region test isAttrSelectorParams(SelectorParams)
//#region test with AttrSelectorParams
test(`isAttrSelectorParams(AttrSelectorParams)`, () => {
    expect(isAttrSelectorParams(
        attrSelector('disabled')[2]
    ))
    .toBe(true);
});
test(`isAttrSelectorParams(AttrSelectorParams)`, () => {
    expect(isAttrSelectorParams(
        attrSelector('aria-role', '=', 'button')[2]
    ))
    .toBe(true);
});
test(`isAttrSelectorParams(AttrSelectorParams)`, () => {
    expect(isAttrSelectorParams(
        attrSelector('title', '~=', 'hello')[2]
    ))
    .toBe(true);
});
test(`isAttrSelectorParams(AttrSelectorParams)`, () => {
    expect(isAttrSelectorParams(
        attrSelector('lang', '|=', 'en')[2]
    ))
    .toBe(true);
});
test(`isAttrSelectorParams(AttrSelectorParams)`, () => {
    expect(isAttrSelectorParams(
        attrSelector('title', '^=', 'hello')[2]
    ))
    .toBe(true);
});
test(`isAttrSelectorParams(AttrSelectorParams)`, () => {
    expect(isAttrSelectorParams(
        attrSelector('title', '$=', 'hello')[2]
    ))
    .toBe(true);
});
test(`isAttrSelectorParams(AttrSelectorParams)`, () => {
    expect(isAttrSelectorParams(
        attrSelector('title', '*=', 'hello')[2]
    ))
    .toBe(true);
});
test(`isAttrSelectorParams(AttrSelectorParams)`, () => {
    expect(isAttrSelectorParams(
        attrSelector('title', '=', 'hello', 'i')[2]
    ))
    .toBe(true);
});
test(`isAttrSelectorParams(AttrSelectorParams)`, () => {
    expect(isAttrSelectorParams(
        attrSelector('title', '=', 'hello', 'I')[2]
    ))
    .toBe(true);
});
test(`isAttrSelectorParams(AttrSelectorParams)`, () => {
    expect(isAttrSelectorParams(
        attrSelector('title', '=', 'hello', 's')[2]
    ))
    .toBe(true);
});
test(`isAttrSelectorParams(AttrSelectorParams)`, () => {
    expect(isAttrSelectorParams(
        attrSelector('title', '=', 'hello', 'S')[2]
    ))
    .toBe(true);
});
//#endregion test with AttrSelectorParams

//#region test with SelectorGroup
test(`isAttrSelectorParams(SelectorGroup)`, () => {
    expect(isAttrSelectorParams(
        selectorGroup(
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isAttrSelectorParams(SelectorGroup)`, () => {
    expect(isAttrSelectorParams(
        selectorGroup(
            selector(
                classSelector('boo'),
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isAttrSelectorParams(SelectorGroup)`, () => {
    expect(isAttrSelectorParams(
        selectorGroup(
            selector(
                classSelector('boo'),
                pseudoClassSelector('foo', 'a+b'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isAttrSelectorParams(SelectorGroup)`, () => {
    expect(isAttrSelectorParams(
        selectorGroup(
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isAttrSelectorParams(SelectorGroup)`, () => {
    expect(isAttrSelectorParams(
        selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isAttrSelectorParams(SelectorGroup)`, () => {
    expect(isAttrSelectorParams(
        selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isAttrSelectorParams(SelectorGroup)`, () => {
    expect(isAttrSelectorParams(
        selectorGroup(
            undefined,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isAttrSelectorParams(SelectorGroup)`, () => {
    expect(isAttrSelectorParams(
        selectorGroup(
            null,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isAttrSelectorParams(SelectorGroup)`, () => {
    expect(isAttrSelectorParams(
        selectorGroup(
            false,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isAttrSelectorParams(SelectorGroup)`, () => {
    expect(isAttrSelectorParams(
        selectorGroup(
            true,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isAttrSelectorParams(SelectorGroup)`, () => {
    expect(isAttrSelectorParams(
        selectorGroup(
            selector(
                undefined,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isAttrSelectorParams(SelectorGroup)`, () => {
    expect(isAttrSelectorParams(
        selectorGroup(
            selector(
                null,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isAttrSelectorParams(SelectorGroup)`, () => {
    expect(isAttrSelectorParams(
        selectorGroup(
            selector(
                false,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
test(`isAttrSelectorParams(SelectorGroup)`, () => {
    expect(isAttrSelectorParams(
        selectorGroup(
            selector(
                true,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(false);
});
['is', 'not', 'where', 'has'].forEach((group) => {
    test(`isAttrSelectorParams(SelectorGroup)`, () => {
        expect(isAttrSelectorParams(selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
            selector(
                pseudoClassSelector(group,
                    selectorGroup(
                        selector(
                            classSelector('great'),
                        ),
                    ),
                ),
            ),
        )))
        .toBe(false);
    });
    test(`isAttrSelectorParams(SelectorGroup)`, () => {
        expect(isAttrSelectorParams(selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
            selector(
                pseudoClassSelector(group,
                    selectorGroup(
                        selector(
                            classSelector('great'),
                            classSelector('okay'),
                            pseudoClassSelector('valid'),
                        ),
                        selector(
                            classSelector('awesome'),
                        ),
                    ),
                ),
            ),
        )))
        .toBe(false);
    });
    test(`isAttrSelectorParams(SelectorGroup)`, () => {
        expect(isAttrSelectorParams(selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
            selector(
                pseudoClassSelector(group,
                    selectorGroup(
                        selector(
                            classSelector('great'),
                            combinator(' '),
                            classSelector('okay'),
                            combinator('>'),
                            pseudoClassSelector('valid'),
                        ),
                        selector(
                            classSelector('awesome'),
                            combinator('+'),
                            pseudoClassSelector('nth-child', '2n+3'),
                        ),
                    ),
                ),
            ),
        )))
        .toBe(false);
    });
    ['is', 'not', 'where', 'has'].forEach((group2) => {
        test(`isAttrSelectorParams(SelectorGroup)`, () => {
            expect(isAttrSelectorParams(selectorGroup(
                selector(
                    classSelector('boo'),
                    combinator(' '),
                    pseudoClassSelector('foo', 'a+b'),
                    combinator('>'),
                    idSelector('bleh'),
                ),
                selector(
                    pseudoElementSelector('charlie'),
                ),
                selector(
                    pseudoClassSelector(group,
                        selectorGroup(
                            selector(
                                classSelector('great'),
                            ),
                            selector(
                                pseudoClassSelector(group2,
                                    selectorGroup(
                                        selector(
                                            idSelector('okay'),
                                        ),
                                    ),
                                ),
                            ),
                            selector(
                                pseudoClassSelector(group2,
                                    selectorGroup(
                                        selector(
                                            pseudoClassSelector('valid'),
                                            pseudoClassSelector('first-child'),
                                            combinator('>'),
                                            pseudoClassSelector('nth-child', '2n+3'),
                                        ),
                                        selector(
                                            pseudoElementSelector('backdrop'),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            )))
            .toBe(false);
        });
    });
});
//#endregion test with SelectorGroup

//#region test with WildParams
test(`isAttrSelectorParams(WildParams)`, () => {
    expect(isAttrSelectorParams(
        pseudoClassSelector('nth-child', '2n+3')[2]!
    ))
    .toBe(false);
});
test(`isAttrSelectorParams(WildParams)`, () => {
    expect(isAttrSelectorParams(
        pseudoClassSelector('foo', '2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq')[2]!
    ))
    .toBe(false);
});
//#endregion test with WildParams
//#endregion test isAttrSelectorParams(SelectorParams)



//#region test isSelectors(SelectorParams)
//#region test with AttrSelectorParams
test(`isSelectors(AttrSelectorParams)`, () => {
    expect(isSelectors(
        attrSelector('disabled')[2]
    ))
    .toBe(false);
});
test(`isSelectors(AttrSelectorParams)`, () => {
    expect(isSelectors(
        attrSelector('aria-role', '=', 'button')[2]
    ))
    .toBe(false);
});
test(`isSelectors(AttrSelectorParams)`, () => {
    expect(isSelectors(
        attrSelector('title', '~=', 'hello')[2]
    ))
    .toBe(false);
});
test(`isSelectors(AttrSelectorParams)`, () => {
    expect(isSelectors(
        attrSelector('lang', '|=', 'en')[2]
    ))
    .toBe(false);
});
test(`isSelectors(AttrSelectorParams)`, () => {
    expect(isSelectors(
        attrSelector('title', '^=', 'hello')[2]
    ))
    .toBe(false);
});
test(`isSelectors(AttrSelectorParams)`, () => {
    expect(isSelectors(
        attrSelector('title', '$=', 'hello')[2]
    ))
    .toBe(false);
});
test(`isSelectors(AttrSelectorParams)`, () => {
    expect(isSelectors(
        attrSelector('title', '*=', 'hello')[2]
    ))
    .toBe(false);
});
test(`isSelectors(AttrSelectorParams)`, () => {
    expect(isSelectors(
        attrSelector('title', '=', 'hello', 'i')[2]
    ))
    .toBe(false);
});
test(`isSelectors(AttrSelectorParams)`, () => {
    expect(isSelectors(
        attrSelector('title', '=', 'hello', 'I')[2]
    ))
    .toBe(false);
});
test(`isSelectors(AttrSelectorParams)`, () => {
    expect(isSelectors(
        attrSelector('title', '=', 'hello', 's')[2]
    ))
    .toBe(false);
});
test(`isSelectors(AttrSelectorParams)`, () => {
    expect(isSelectors(
        attrSelector('title', '=', 'hello', 'S')[2]
    ))
    .toBe(false);
});
//#endregion test with AttrSelectorParams

//#region test with SelectorGroup
test(`isSelectors(SelectorGroup)`, () => {
    expect(isSelectors(
        selectorGroup(
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(true);
});
test(`isSelectors(SelectorGroup)`, () => {
    expect(isSelectors(
        selectorGroup(
            selector(
                classSelector('boo'),
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(true);
});
test(`isSelectors(SelectorGroup)`, () => {
    expect(isSelectors(
        selectorGroup(
            selector(
                classSelector('boo'),
                pseudoClassSelector('foo', 'a+b'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(true);
});
test(`isSelectors(SelectorGroup)`, () => {
    expect(isSelectors(
        selectorGroup(
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(true);
});
test(`isSelectors(SelectorGroup)`, () => {
    expect(isSelectors(
        selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(true);
});
test(`isSelectors(SelectorGroup)`, () => {
    expect(isSelectors(
        selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(true);
});
test(`isSelectors(SelectorGroup)`, () => {
    expect(isSelectors(
        selectorGroup(
            undefined,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(true);
});
test(`isSelectors(SelectorGroup)`, () => {
    expect(isSelectors(
        selectorGroup(
            null,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(true);
});
test(`isSelectors(SelectorGroup)`, () => {
    expect(isSelectors(
        selectorGroup(
            false,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(true);
});
test(`isSelectors(SelectorGroup)`, () => {
    expect(isSelectors(
        selectorGroup(
            true,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(true);
});
test(`isSelectors(SelectorGroup)`, () => {
    expect(isSelectors(
        selectorGroup(
            selector(
                undefined,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(true);
});
test(`isSelectors(SelectorGroup)`, () => {
    expect(isSelectors(
        selectorGroup(
            selector(
                null,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(true);
});
test(`isSelectors(SelectorGroup)`, () => {
    expect(isSelectors(
        selectorGroup(
            selector(
                false,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(true);
});
test(`isSelectors(SelectorGroup)`, () => {
    expect(isSelectors(
        selectorGroup(
            selector(
                true,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(true);
});
['is', 'not', 'where', 'has'].forEach((group) => {
    test(`isSelectors(SelectorGroup)`, () => {
        expect(isSelectors(selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
            selector(
                pseudoClassSelector(group,
                    selectorGroup(
                        selector(
                            classSelector('great'),
                        ),
                    ),
                ),
            ),
        )))
        .toBe(true);
    });
    test(`isSelectors(SelectorGroup)`, () => {
        expect(isSelectors(selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
            selector(
                pseudoClassSelector(group,
                    selectorGroup(
                        selector(
                            classSelector('great'),
                            classSelector('okay'),
                            pseudoClassSelector('valid'),
                        ),
                        selector(
                            classSelector('awesome'),
                        ),
                    ),
                ),
            ),
        )))
        .toBe(true);
    });
    test(`isSelectors(SelectorGroup)`, () => {
        expect(isSelectors(selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
            selector(
                pseudoClassSelector(group,
                    selectorGroup(
                        selector(
                            classSelector('great'),
                            combinator(' '),
                            classSelector('okay'),
                            combinator('>'),
                            pseudoClassSelector('valid'),
                        ),
                        selector(
                            classSelector('awesome'),
                            combinator('+'),
                            pseudoClassSelector('nth-child', '2n+3'),
                        ),
                    ),
                ),
            ),
        )))
        .toBe(true);
    });
    ['is', 'not', 'where', 'has'].forEach((group2) => {
        test(`isSelectors(SelectorGroup)`, () => {
            expect(isSelectors(selectorGroup(
                selector(
                    classSelector('boo'),
                    combinator(' '),
                    pseudoClassSelector('foo', 'a+b'),
                    combinator('>'),
                    idSelector('bleh'),
                ),
                selector(
                    pseudoElementSelector('charlie'),
                ),
                selector(
                    pseudoClassSelector(group,
                        selectorGroup(
                            selector(
                                classSelector('great'),
                            ),
                            selector(
                                pseudoClassSelector(group2,
                                    selectorGroup(
                                        selector(
                                            idSelector('okay'),
                                        ),
                                    ),
                                ),
                            ),
                            selector(
                                pseudoClassSelector(group2,
                                    selectorGroup(
                                        selector(
                                            pseudoClassSelector('valid'),
                                            pseudoClassSelector('first-child'),
                                            combinator('>'),
                                            pseudoClassSelector('nth-child', '2n+3'),
                                        ),
                                        selector(
                                            pseudoElementSelector('backdrop'),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            )))
            .toBe(true);
        });
    });
});
//#endregion test with SelectorGroup

//#region test with WildParams
test(`isSelectors(WildParams)`, () => {
    expect(isSelectors(
        pseudoClassSelector('nth-child', '2n+3')[2]!
    ))
    .toBe(false);
});
test(`isSelectors(WildParams)`, () => {
    expect(isSelectors(
        pseudoClassSelector('foo', '2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq')[2]!
    ))
    .toBe(false);
});
//#endregion test with WildParams
//#endregion test isSelectors(SelectorParams)



//#region test selectorParamsToString(SelectorParams)
test(`selectorParamsToString('')`, () => {
    expect(selectorParamsToString(
        '' /* empty param */
    ))
    .toBe(
        '()'
    );
});

//#region test with AttrSelectorParams
test(`selectorParamsToString(AttrSelectorParams)`, () => {
    expect(selectorParamsToString(
        attrSelector('disabled')[2]
    ))
    .toBe(
        '[disabled]'
    );
});
test(`selectorParamsToString(AttrSelectorParams)`, () => {
    expect(selectorParamsToString(
        attrSelector('aria-role', '=', 'button')[2]
    ))
    .toBe(
        '[aria-role="button"]'
    );
});
test(`selectorParamsToString(AttrSelectorParams)`, () => {
    expect(selectorParamsToString(
        attrSelector('title', '~=', 'hello')[2]
    ))
    .toBe(
        '[title~="hello"]'
    );
});
test(`selectorParamsToString(AttrSelectorParams)`, () => {
    expect(selectorParamsToString(
        attrSelector('lang', '|=', 'en')[2]
    ))
    .toBe(
        '[lang|="en"]'
    );
});
test(`selectorParamsToString(AttrSelectorParams)`, () => {
    expect(selectorParamsToString(
        attrSelector('title', '^=', 'hello')[2]
    ))
    .toBe(
        '[title^="hello"]'
    );
});
test(`selectorParamsToString(AttrSelectorParams)`, () => {
    expect(selectorParamsToString(
        attrSelector('title', '$=', 'hello')[2]
    ))
    .toBe(
        '[title$="hello"]'
    );
});
test(`selectorParamsToString(AttrSelectorParams)`, () => {
    expect(selectorParamsToString(
        attrSelector('title', '*=', 'hello')[2]
    ))
    .toBe(
        '[title*="hello"]'
    );
});
test(`selectorParamsToString(AttrSelectorParams)`, () => {
    expect(selectorParamsToString(
        attrSelector('title', '=', 'hello', 'i')[2]
    ))
    .toBe(
        '[title="hello" i]'
    );
});
test(`selectorParamsToString(AttrSelectorParams)`, () => {
    expect(selectorParamsToString(
        attrSelector('title', '=', 'hello', 'I')[2]
    ))
    .toBe(
        '[title="hello" I]'
    );
});
test(`selectorParamsToString(AttrSelectorParams)`, () => {
    expect(selectorParamsToString(
        attrSelector('title', '=', 'hello', 's')[2]
    ))
    .toBe(
        '[title="hello" s]'
    );
});
test(`selectorParamsToString(AttrSelectorParams)`, () => {
    expect(selectorParamsToString(
        attrSelector('title', '=', 'hello', 'S')[2]
    ))
    .toBe(
        '[title="hello" S]'
    );
});
//#endregion test with AttrSelectorParams

//#region test with SelectorGroup
test(`selectorParamsToString(SelectorGroup)`, () => {
    expect(selectorParamsToString(
        selectorGroup(
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(
        '(.boo, :foo(a+b), #bleh, ::charlie)'
    );
});
test(`selectorParamsToString(SelectorGroup)`, () => {
    expect(selectorParamsToString(
        selectorGroup(
            selector(
                classSelector('boo'),
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(
        '(.boo:foo(a+b), #bleh, ::charlie)'
    );
});
test(`selectorParamsToString(SelectorGroup)`, () => {
    expect(selectorParamsToString(
        selectorGroup(
            selector(
                classSelector('boo'),
                pseudoClassSelector('foo', 'a+b'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(
        '(.boo:foo(a+b)#bleh, ::charlie)'
    );
});
test(`selectorParamsToString(SelectorGroup)`, () => {
    expect(selectorParamsToString(
        selectorGroup(
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(
        '(.boo, :foo(a+b)#bleh::charlie)'
    );
});
test(`selectorParamsToString(SelectorGroup)`, () => {
    expect(selectorParamsToString(
        selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(
        '(.boo :foo(a+b)>#bleh, ::charlie)'
    );
});
test(`selectorParamsToString(SelectorGroup)`, () => {
    expect(selectorParamsToString(
        selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(
        '(.boo :foo(a+b)>#bleh::charlie)'
    );
});
test(`selectorParamsToString(SelectorGroup)`, () => {
    expect(selectorParamsToString(
        selectorGroup(
            undefined,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(
        '(.boo, :foo(a+b), #bleh, ::charlie)'
    );
});
test(`selectorParamsToString(SelectorGroup)`, () => {
    expect(selectorParamsToString(
        selectorGroup(
            null,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(
        '(.boo, :foo(a+b), #bleh, ::charlie)'
    );
});
test(`selectorParamsToString(SelectorGroup)`, () => {
    expect(selectorParamsToString(
        selectorGroup(
            false,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(
        '(.boo, :foo(a+b), #bleh, ::charlie)'
    );
});
test(`selectorParamsToString(SelectorGroup)`, () => {
    expect(selectorParamsToString(
        selectorGroup(
            true,
            selector(
                classSelector('boo'),
            ),
            selector(
                pseudoClassSelector('foo', 'a+b'),
            ),
            selector(
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(
        '(.boo, :foo(a+b), #bleh, ::charlie)'
    );
});
test(`selectorParamsToString(SelectorGroup)`, () => {
    expect(selectorParamsToString(
        selectorGroup(
            selector(
                undefined,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(
        '(.boo :foo(a+b)>#bleh::charlie)'
    );
});
test(`selectorParamsToString(SelectorGroup)`, () => {
    expect(selectorParamsToString(
        selectorGroup(
            selector(
                null,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(
        '(.boo :foo(a+b)>#bleh::charlie)'
    );
});
test(`selectorParamsToString(SelectorGroup)`, () => {
    expect(selectorParamsToString(
        selectorGroup(
            selector(
                false,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(
        '(.boo :foo(a+b)>#bleh::charlie)'
    );
});
test(`selectorParamsToString(SelectorGroup)`, () => {
    expect(selectorParamsToString(
        selectorGroup(
            selector(
                true,
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
                pseudoElementSelector('charlie'),
            ),
        )
    ))
    .toBe(
        '(.boo :foo(a+b)>#bleh::charlie)'
    );
});
['is', 'not', 'where', 'has'].forEach((group) => {
    test(`selectorParamsToString(SelectorGroup)`, () => {
        expect(selectorParamsToString(selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
            selector(
                pseudoClassSelector(group,
                    selectorGroup(
                        selector(
                            classSelector('great'),
                        ),
                    ),
                ),
            ),
        )))
        .toBe(
            `(.boo :foo(a+b)>#bleh, ::charlie, :${group}(.great))`
        );
    });
    test(`selectorParamsToString(SelectorGroup)`, () => {
        expect(selectorParamsToString(selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
            selector(
                pseudoClassSelector(group,
                    selectorGroup(
                        selector(
                            classSelector('great'),
                            classSelector('okay'),
                            pseudoClassSelector('valid'),
                        ),
                        selector(
                            classSelector('awesome'),
                        ),
                    ),
                ),
            ),
        )))
        .toBe(
            `(.boo :foo(a+b)>#bleh, ::charlie, :${group}(.great.okay:valid, .awesome))`
        );
    });
    test(`selectorParamsToString(SelectorGroup)`, () => {
        expect(selectorParamsToString(selectorGroup(
            selector(
                classSelector('boo'),
                combinator(' '),
                pseudoClassSelector('foo', 'a+b'),
                combinator('>'),
                idSelector('bleh'),
            ),
            selector(
                pseudoElementSelector('charlie'),
            ),
            selector(
                pseudoClassSelector(group,
                    selectorGroup(
                        selector(
                            classSelector('great'),
                            combinator(' '),
                            classSelector('okay'),
                            combinator('>'),
                            pseudoClassSelector('valid'),
                        ),
                        selector(
                            classSelector('awesome'),
                            combinator('+'),
                            pseudoClassSelector('nth-child', '2n+3'),
                        ),
                    ),
                ),
            ),
        )))
        .toBe(
            `(.boo :foo(a+b)>#bleh, ::charlie, :${group}(.great .okay>:valid, .awesome+:nth-child(2n+3)))`
        );
    });
    ['is', 'not', 'where', 'has'].forEach((group2) => {
        test(`selectorParamsToString(SelectorGroup)`, () => {
            expect(selectorParamsToString(selectorGroup(
                selector(
                    classSelector('boo'),
                    combinator(' '),
                    pseudoClassSelector('foo', 'a+b'),
                    combinator('>'),
                    idSelector('bleh'),
                ),
                selector(
                    pseudoElementSelector('charlie'),
                ),
                selector(
                    pseudoClassSelector(group,
                        selectorGroup(
                            selector(
                                classSelector('great'),
                            ),
                            selector(
                                pseudoClassSelector(group2,
                                    selectorGroup(
                                        selector(
                                            idSelector('okay'),
                                        ),
                                    ),
                                ),
                            ),
                            selector(
                                pseudoClassSelector(group2,
                                    selectorGroup(
                                        selector(
                                            pseudoClassSelector('valid'),
                                            pseudoClassSelector('first-child'),
                                            combinator('>'),
                                            pseudoClassSelector('nth-child', '2n+3'),
                                        ),
                                        selector(
                                            pseudoElementSelector('backdrop'),
                                        ),
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            )))
            .toBe(
                `(.boo :foo(a+b)>#bleh, ::charlie, :${group}(.great, :${group2}(#okay), :${group2}(:valid:first-child>:nth-child(2n+3), ::backdrop)))`
            );
        });
    });
});
//#endregion test with SelectorGroup

//#region test with WildParams
test(`selectorParamsToString(WildParams)`, () => {
    expect(selectorParamsToString(
        pseudoClassSelector('nth-child', '2n+3')[2]!
    ))
    .toBe(
        '(2n+3)'
    );
});
test(`selectorParamsToString(WildParams)`, () => {
    expect(selectorParamsToString(
        pseudoClassSelector('foo', '2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq')[2]!
    ))
    .toBe(
        '(2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq)'
    );
});
//#endregion test with WildParams
//#endregion test selectorParamsToString(SelectorParams)