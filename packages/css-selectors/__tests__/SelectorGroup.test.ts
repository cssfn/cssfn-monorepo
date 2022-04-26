import {
    // SelectorEntry creates & tests:
    AttrSelector,
    AttrSelectorParams,
    attrSelector,
    IdSelector,
    idSelector,
    ClassSelector,
    classSelector,
    PseudoClassSelector,
    pseudoClassSelector,
    PseudoElementSelector,
    pseudoElementSelector,
    
    Combinator,
    combinator,
    
    
    
    // Selector creates & tests:
    Selector,
    selector,
    SelectorGroup,
    selectorGroup,
    
    isNotEmptySelectors,
    countSelectors,
    
    
    
    // renders:
    selectorsToString,
} from '../dist/css-selectors.js'



test(`SelectorGroup`, () => {
    expect(selectorGroup(
        selector(
            classSelector('boo'),
        ),
    ))
    .toEqual(((): SelectorGroup => [
        ((): Selector => [
            ((): ClassSelector => [
                '.',
                'boo'
            ])(),
        ])(),
    ])());
});
test(`SelectorGroup`, () => {
    expect(selectorGroup(
        selector(
            classSelector('boo'),
            pseudoClassSelector('foo', 'a+b'),
        ),
    ))
    .toEqual(((): SelectorGroup => [
        ((): Selector => [
            ((): ClassSelector => [
                '.',
                'boo'
            ])(),
            ((): PseudoClassSelector => [
                ':',
                'foo',
                'a+b'
            ])(),
        ])(),
    ])());
});
test(`SelectorGroup`, () => {
    expect(selectorGroup(
        selector(
            classSelector('boo'),
            pseudoClassSelector('foo', 'a+b'),
        ),
        selector(
            classSelector('boo'),
            combinator(' '),
            pseudoClassSelector('foo', 'a+b'),
            combinator('>'),
            idSelector('bleh'),
            attrSelector('title', '*=', 'hello', 'i'),
        ),
    ))
    .toEqual(((): SelectorGroup => [
        ((): Selector => [
            ((): ClassSelector => [
                '.',
                'boo'
            ])(),
            ((): PseudoClassSelector => [
                ':',
                'foo',
                'a+b'
            ])(),
        ])(),
        ((): Selector => [
            ((): ClassSelector => [
                '.',
                'boo'
            ])(),
            ((): Combinator => ' ')(),
            ((): PseudoClassSelector => [
                ':',
                'foo',
                'a+b'
            ])(),
            ((): Combinator => '>')(),
            ((): IdSelector => [
                '#',
                'bleh'
            ])(),
            ((): AttrSelector => [
                '[',
                null,
                ((): AttrSelectorParams => [
                    'title',
                    '*=',
                    'hello',
                    'i'
                ])(),
            ])(),
        ])(),
    ])());
});

['is', 'not', 'where', 'has'].forEach((group) => {
    test(`SelectorGroup`, () => {
        expect(selectorGroup(
            selector(
                classSelector('boo'),
                pseudoClassSelector('foo', 'a+b'),
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
        ))
        .toEqual(((): SelectorGroup => [
            ((): Selector => [
                ((): ClassSelector => [
                    '.',
                    'boo'
                ])(),
                ((): PseudoClassSelector => [
                    ':',
                    'foo',
                    'a+b'
                ])(),
            ])(),
            ((): Selector => [
                ((): PseudoClassSelector => [
                    ':',
                    group,
                    ((): SelectorGroup => [
                        ((): Selector => [
                            ((): ClassSelector => [
                                '.',
                                'great'
                            ])(),
                            ((): ClassSelector => [
                                '.',
                                'okay'
                            ])(),
                            ((): PseudoClassSelector => [
                                ':',
                                'valid'
                            ])(),
                        ])(),
                        ((): Selector => [
                            ((): ClassSelector => [
                                '.',
                                'awesome'
                            ])(),
                        ])(),
                    ])(),
                ])(),
            ])(),
        ])());
    });
    test(`SelectorGroup`, () => {
        expect(selectorGroup(
            selector(
                classSelector('boo'),
                pseudoClassSelector('foo', 'a+b'),
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
        ))
        .toEqual(((): SelectorGroup => [
            ((): Selector => [
                ((): ClassSelector => [
                    '.',
                    'boo'
                ])(),
                ((): PseudoClassSelector => [
                    ':',
                    'foo',
                    'a+b'
                ])(),
            ])(),
            ((): Selector => [
                ((): PseudoClassSelector => [
                    ':',
                    group,
                    ((): SelectorGroup => [
                        ((): Selector => [
                            ((): ClassSelector => [
                                '.',
                                'great'
                            ])(),
                            ((): Combinator => ' ')(),
                            ((): ClassSelector => [
                                '.',
                                'okay'
                            ])(),
                            ((): Combinator => '>')(),
                            ((): PseudoClassSelector => [
                                ':',
                                'valid'
                            ])(),
                        ])(),
                        ((): Selector => [
                            ((): ClassSelector => [
                                '.',
                                'awesome'
                            ])(),
                            ((): Combinator => '+')(),
                            ((): PseudoClassSelector => [
                                ':',
                                'nth-child',
                                '2n+3'
                            ])(),
                        ])(),
                    ])(),
                ])(),
            ])(),
        ])());
    });
    
    ['is', 'not', 'where', 'has'].forEach((group2) => {
        test(`SelectorGroup`, () => {
            expect(selectorGroup(
                selector(
                    classSelector('boo'),
                    pseudoClassSelector('foo', 'a+b'),
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
            ))
            .toEqual(((): SelectorGroup => [
                ((): Selector => [
                    ((): ClassSelector => [
                        '.',
                        'boo'
                    ])(),
                    ((): PseudoClassSelector => [
                        ':',
                        'foo',
                        'a+b'
                    ])(),
                ])(),
                ((): Selector => [
                    ((): PseudoClassSelector => [
                        ':',
                        group,
                        ((): SelectorGroup => [
                            ((): Selector => [
                                ((): ClassSelector => [
                                    '.',
                                    'great'
                                ])(),
                            ])(),
                            ((): Selector => [
                                ((): PseudoClassSelector => [
                                    ':',
                                    group2,
                                    ((): SelectorGroup => [
                                        ((): Selector => [
                                            ((): IdSelector => [
                                                '#',
                                                'okay'
                                            ])(),
                                        ])(),
                                    ])(),
                                ])(),
                            ])(),
                            ((): Selector => [
                                ((): PseudoClassSelector => [
                                    ':',
                                    group2,
                                    ((): SelectorGroup => [
                                        ((): Selector => [
                                            ((): PseudoClassSelector => [
                                                ':',
                                                'valid'
                                            ])(),
                                            ((): PseudoClassSelector => [
                                                ':',
                                                'first-child'
                                            ])(),
                                            ((): Combinator => '>')(),
                                            ((): PseudoClassSelector => [
                                                ':',
                                                'nth-child',
                                                '2n+3'
                                            ])(),
                                        ])(),
                                        ((): Selector => [
                                            ((): PseudoElementSelector => [
                                                '::',
                                                'backdrop'
                                            ])(),
                                        ])(),
                                    ])(),
                                ])(),
                            ])(),
                        ])(),
                    ])(),
                ])(),
            ])());
        });
    });
});



const allBasicFalsies                      = [undefined, null, false, true];
const allSampleSelectorGroups : SelectorGroup[] = [
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
    ),
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
    ),
    selectorGroup(
        selector(
            classSelector('boo'),
            pseudoClassSelector('foo', 'a+b'),
            idSelector('bleh'),
        ),
        selector(
            pseudoElementSelector('charlie'),
        ),
    ),
    selectorGroup(
        selector(
            classSelector('boo'),
        ),
        selector(
            pseudoClassSelector('foo', 'a+b'),
            idSelector('bleh'),
            pseudoElementSelector('charlie'),
        ),
    ),
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
    ),
    ...['is', 'not', 'where', 'has'].flatMap((group): SelectorGroup[] => [
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
            selector(
                pseudoClassSelector(group,
                    selectorGroup(
                        selector(
                            classSelector('great'),
                        ),
                    ),
                ),
            ),
        ),
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
        ),
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
        ),
        ...['is', 'not', 'where', 'has'].flatMap((group2): SelectorGroup[] => [
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
            ),
        ]),
    ])
];
const allSampleStrangeSelectorGroups : SelectorGroup[] = [
    selectorGroup(
        /* empty */
    ),
    selectorGroup(
        selector(
            /* empty */
        ),
    ),
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
    selectorGroup(
        undefined,
        selector(
            classSelector('boo'),
            pseudoClassSelector('foo', 'a+b'),
        ),
        null,
        selector(
            classSelector('boo'),
            combinator(' '),
            pseudoClassSelector('foo', 'a+b'),
            combinator('>'),
            idSelector('bleh'),
            attrSelector('title', '*=', 'hello', 'i'),
        ),
        false,
        selector(
            classSelector('boo'),
        ),
        true,
    ),
    selectorGroup(
        selector(
            undefined,
            classSelector('boo'),
            null,
            combinator(' '),
            false,
            pseudoClassSelector('foo', 'a+b'),
            true,
            combinator('>'),
            true,
            idSelector('bleh'),
        ),
    ),
    selectorGroup(
        selector(
            combinator('>'),
            classSelector('boo'),
            pseudoClassSelector('foo', 'a+b'),
        ),
    ),
    selectorGroup(
        selector(
            classSelector('boo'),
            pseudoClassSelector('foo', 'a+b'),
            combinator('>'),
        ),
    ),
    selectorGroup(
        selector(
            combinator('>'),
            classSelector('boo'),
            pseudoClassSelector('foo', 'a+b'),
            combinator('>'),
        ),
    ),
];



allBasicFalsies.forEach((basicFalsy) => {
    test(`isNotEmptySelectors(falsy)`, () => {
        expect(isNotEmptySelectors(basicFalsy))
        .toBe(false)
    });
});
allSampleSelectorGroups.forEach((sampleSelectorGroup) => {
    test(`isNotEmptySelectors(Selector)`, () => {
        expect(isNotEmptySelectors(sampleSelectorGroup))
        .toBe(true)
    });
});
allSampleStrangeSelectorGroups.forEach((sampleSelectorGroup) => {
    test(`isNotEmptySelectors(EmptySelector)`, () => {
        expect(isNotEmptySelectors(sampleSelectorGroup))
        .toBe(
            sampleSelectorGroup.some((selector) =>
                (selector !== undefined)
                &&
                (selector !== null)
                &&
                (selector !== false)
                &&
                (selector !== true)
                &&
                selector.some((selectorEntry) =>
                    (selectorEntry !== undefined)
                    &&
                    (selectorEntry !== null)
                    &&
                    (selectorEntry !== false)
                    &&
                    (selectorEntry !== true)
                )
            )
        )
    });
});



allBasicFalsies.forEach((basicFalsy) => {
    test(`countSelectors(falsy)`, () => {
        expect(countSelectors(basicFalsy))
        .toBe(0)
    });
});
allSampleSelectorGroups.forEach((sampleSelectorGroup) => {
    test(`countSelectors(Selector)`, () => {
        expect(countSelectors(sampleSelectorGroup))
        .toBe(sampleSelectorGroup.length)
    });
});
allSampleStrangeSelectorGroups.forEach((sampleSelectorGroup) => {
    test(`countSelectors(EmptySelector)`, () => {
        expect(countSelectors(sampleSelectorGroup))
        .toBe(
            sampleSelectorGroup.filter((selector) =>
                (selector !== undefined)
                &&
                (selector !== null)
                &&
                (selector !== false)
                &&
                (selector !== true)
                &&
                selector.some((selectorEntry) =>
                    (selectorEntry !== undefined)
                    &&
                    (selectorEntry !== null)
                    &&
                    (selectorEntry !== false)
                    &&
                    (selectorEntry !== true)
                )
            )
            .length
        )
    });
});



test(`selectorsToString(empty)`, () => {
    expect(selectorsToString(
        selectorGroup(
            /* empty */
        )
    ))
    .toBe(
        ''
    );
});
test(`selectorsToString(empty)`, () => {
    expect(selectorsToString(
        selectorGroup(
            selector(
                /* empty */
            ),
        )
    ))
    .toBe(
        ''
    );
});
test(`selectorsToString(empty)`, () => {
    expect(selectorsToString(
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
    ))
    .toBe(
        ''
    );
});
test(`selectorsToString(falsy)`, () => {
    expect(selectorsToString(
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
    ))
    .toBe(
        ''
    );
});
test(`selectorsToString(falsy)`, () => {
    expect(selectorsToString(
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
    ))
    .toBe(
        ''
    );
});
test(`selectorsToString(falsy)`, () => {
    expect(selectorsToString(
        selectorGroup(
            undefined,
            null,
            false,
            true,
        )
    ))
    .toBe(
        ''
    );
});
test(`selectorsToString(falsy)`, () => {
    expect(selectorsToString(
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
    ))
    .toBe(
        ''
    );
});
test(`selectorsToString(falsy)`, () => {
    expect(selectorsToString(
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
    ))
    .toBe(
        ''
    );
});
test(`selectorsToString(SelectorGroup)`, () => {
    expect(selectorsToString(
        selectorGroup(
            selector(
                classSelector('boo'),
            ),
        )
    ))
    .toBe(
        '.boo'
    );
});
test(`selectorsToString(SelectorGroup)`, () => {
    expect(selectorsToString(
        selectorGroup(
            selector(
                classSelector('beuh'),
                pseudoClassSelector('last-child'),
            ),
            selector(
                classSelector('boo'),
                pseudoClassSelector('foo', 'a+b'),
                pseudoClassSelector('wehh'),
                pseudoClassSelector('bleh', ''),
                attrSelector('title', '*=', 'hello', 'i'),
            ),
        )
    ))
    .toBe(
        '.beuh:last-child, .boo:foo(a+b):wehh:bleh()[title*="hello" i]'
    );
});
test(`selectorsToString(SelectorGroup)`, () => {
    expect(selectorsToString(
        selectorGroup(
            undefined,
            selector(
                classSelector('beuh'),
                pseudoClassSelector('last-child'),
            ),
            null,
            selector(
                classSelector('boo'),
                undefined,
                combinator(' '),
                null,
                pseudoClassSelector('foo', 'a+b'),
                false,
                combinator('>'),
                true,
                idSelector('bleh'),
            ),
            false,
            true,
        )
    ))
    .toBe(
        '.beuh:last-child, .boo :foo(a+b)>#bleh'
    );
});
['is', 'not', 'where', 'has'].forEach((group) => {
    test(`selectorsToString(SelectorGroup)`, () => {
        expect(selectorsToString(
            selectorGroup(
                selector(
                    classSelector('boo'),
                    combinator(' '),
                    pseudoClassSelector('foo', 'a+b'),
                    combinator('>'),
                    idSelector('bleh'),
                ),
                selector(
                    classSelector('product'),
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
                    combinator('~'),
                    pseudoClassSelector('first-child'),
                ),
            )
        ))
        .toBe(
            `.boo :foo(a+b)>#bleh, .product:${group}(.great.okay:valid, .awesome)~:first-child`
        );
    });
    test(`selectorsToString(SelectorGroup)`, () => {
        expect(selectorsToString(
            selectorGroup(
                undefined,
                selector(
                    classSelector('boo'),
                    undefined,
                    combinator(' '),
                    null,
                    pseudoClassSelector('foo', 'a+b'),
                    false,
                    combinator('>'),
                    true,
                    idSelector('bleh'),
                ),
                null,
                selector(
                    classSelector('product'),
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
                    combinator('~'),
                    pseudoClassSelector('first-child'),
                ),
                false,
                true,            )
        ))
        .toBe(
            `.boo :foo(a+b)>#bleh, .product:${group}(.great .okay>:valid, .awesome+:nth-child(2n+3))~:first-child`
        );
    });
    ['is', 'not', 'where', 'has'].forEach((group2) => {
        test(`selectorsToString(SelectorGroup)`, () => {
            expect(selectorsToString(
                selectorGroup(
                    selector(
                        classSelector('boo'),
                        combinator(' '),
                        pseudoClassSelector('foo', 'a+b'),
                        combinator('>'),
                        idSelector('bleh'),
                    ),
                    selector(
                        classSelector('product'),
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
                        attrSelector('title', '*=', 'hello', 'i'),
                    ),
                )
            ))
            .toBe(
                `.boo :foo(a+b)>#bleh, .product:${group}(.great, :${group2}(#okay), :${group2}(:valid:first-child>:nth-child(2n+3), ::backdrop))[title*="hello" i]`
            );
        });
    });
});
