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
    
    isSelector,
    isNotEmptySelector,
    countSelectorEntries,
    
    
    
    // renders:
    selectorToString,
} from '../src/css-selectors'



test(`Selector`, () => {
    expect(selector(
        classSelector('boo'),
    ))
    .toEqual(((): Selector => [
        ((): ClassSelector => [
            '.',
            'boo'
        ])(),
    ])());
});
test(`Selector`, () => {
    expect(selector(
        classSelector('boo'),
        pseudoClassSelector('foo', 'a+b'),
    ))
    .toEqual(((): Selector => [
        ((): ClassSelector => [
            '.',
            'boo'
        ])(),
        ((): PseudoClassSelector => [
            ':',
            'foo',
            'a+b'
        ])(),
    ])());
});
test(`Selector`, () => {
    expect(selector(
        classSelector('boo'),
        combinator(' '),
        pseudoClassSelector('foo', 'a+b'),
        combinator('>'),
        idSelector('bleh'),
        attrSelector('title', '*=', 'hello', 'i'),
    ))
    .toEqual(((): Selector => [
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
    ])());
});

['is', 'not', 'where', 'has'].forEach((group) => {
    test(`Selector`, () => {
        expect(selector(
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
        ))
        .toEqual(((): Selector => [
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
        ])());
    });
    test(`Selector`, () => {
        expect(selector(
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
        ))
        .toEqual(((): Selector => [
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
        ])());
    });
    
    ['is', 'not', 'where', 'has'].forEach((group2) => {
        test(`Selector`, () => {
            expect(selector(
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
            ))
            .toEqual(((): Selector => [
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
            ])());
        });
    });
});



const allBasicFalsies                 = [undefined, null, false, true];
const allSampleSelectors : Selector[] = [
    selector(
        classSelector('boo'),
    ),
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
    ),
    ...['is', 'not', 'where', 'has'].flatMap((group): Selector[] => [
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
        ...['is', 'not', 'where', 'has'].flatMap((group2): Selector[] => [
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
            )
        ]),
    ])
];
const allSampleStrangeSelectors : Selector[] = [
    selector(
        /* empty */
    ),
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
    selector(
        combinator('>'),
        classSelector('boo'),
        pseudoClassSelector('foo', 'a+b'),
    ),
    selector(
        classSelector('boo'),
        pseudoClassSelector('foo', 'a+b'),
        combinator('>'),
    ),
    selector(
        combinator('>'),
        classSelector('boo'),
        pseudoClassSelector('foo', 'a+b'),
        combinator('>'),
    ),
];



allBasicFalsies.forEach((basicFalsy) => {
    test(`isSelector(falsy)`, () => {
        expect(isSelector(basicFalsy))
        .toBe(false)
    });
});
allSampleSelectors.forEach((sampleSelector) => {
    test(`isSelector(Selector)`, () => {
        expect(isSelector(sampleSelector))
        .toBe(true)
    });
});
allSampleStrangeSelectors.forEach((sampleSelector) => {
    test(`isSelector(Selector)`, () => {
        expect(isSelector(sampleSelector))
        .toBe(true)
    });
});



allBasicFalsies.forEach((basicFalsy) => {
    test(`isNotEmptySelector(falsy)`, () => {
        expect(isNotEmptySelector(basicFalsy))
        .toBe(false)
    });
});
allSampleSelectors.forEach((sampleSelector) => {
    test(`isNotEmptySelector(Selector)`, () => {
        expect(isNotEmptySelector(sampleSelector))
        .toBe(true)
    });
});
allSampleStrangeSelectors.forEach((sampleSelector) => {
    test(`isNotEmptySelector(EmptySelector)`, () => {
        expect(isNotEmptySelector(sampleSelector))
        .toBe(
            sampleSelector.some((selectorEntry) =>
                (selectorEntry !== undefined)
                &&
                (selectorEntry !== null)
                &&
                (selectorEntry !== false)
                &&
                (selectorEntry !== true)
            )
        )
    });
});



allBasicFalsies.forEach((basicFalsy) => {
    test(`countSelectorEntries(falsy)`, () => {
        expect(countSelectorEntries(basicFalsy))
        .toBe(0)
    });
});
allSampleSelectors.forEach((sampleSelector) => {
    test(`countSelectorEntries(Selector)`, () => {
        expect(countSelectorEntries(sampleSelector))
        .toBe(sampleSelector.length)
    });
});
allSampleStrangeSelectors.forEach((sampleSelector) => {
    test(`countSelectorEntries(EmptySelector)`, () => {
        expect(countSelectorEntries(sampleSelector))
        .toBe(
            sampleSelector.filter((selectorEntry) =>
                (selectorEntry !== undefined)
                &&
                (selectorEntry !== null)
                &&
                (selectorEntry !== false)
                &&
                (selectorEntry !== true)
            )
            .length
        )
    });
});



test(`selectorToString(empty)`, () => {
    expect(selectorToString(
        selector(
            /* empty */
        )
    ))
    .toBe(
        ''
    );
});
test(`selectorToString(falsy)`, () => {
    expect(selectorToString(
        selector(
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
test(`selectorToString(Selector)`, () => {
    expect(selectorToString(
        selector(
            classSelector('boo'),
        )
    ))
    .toBe(
        '.boo'
    );
});
test(`selectorToString(Selector)`, () => {
    expect(selectorToString(
        selector(
            classSelector('boo'),
            pseudoClassSelector('foo', 'a+b'),
            pseudoClassSelector('wehh'),
            pseudoClassSelector('bleh', ''),
            attrSelector('title', '*=', 'hello', 'i'),
        )
    ))
    .toBe(
        '.boo:foo(a+b):wehh:bleh()[title*="hello" i]'
    );
});
test(`selectorToString(Selector)`, () => {
    expect(selectorToString(
        selector(
            classSelector('boo'),
            combinator(' '),
            pseudoClassSelector('foo', 'a+b'),
            combinator('>'),
            idSelector('bleh'),
        )
    ))
    .toBe(
        '.boo :foo(a+b)>#bleh'
    );
});
['is', 'not', 'where', 'has'].forEach((group) => {
    test(`selectorToString(Selector)`, () => {
        expect(selectorToString(
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
            )
        ))
        .toBe(
            `.product:${group}(.great.okay:valid, .awesome)~:first-child`
        );
    });
    test(`selectorToString(Selector)`, () => {
        expect(selectorToString(
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
            )
        ))
        .toBe(
            `.product:${group}(.great .okay>:valid, .awesome+:nth-child(2n+3))~:first-child`
        );
    });
    ['is', 'not', 'where', 'has'].forEach((group2) => {
        test(`selectorToString(Selector)`, () => {
            expect(selectorToString(
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
                )
            ))
            .toBe(
                `.product:${group}(.great, :${group2}(#okay), :${group2}(:valid:first-child>:nth-child(2n+3), ::backdrop))[title*="hello" i]`
            );
        });
    });
});
