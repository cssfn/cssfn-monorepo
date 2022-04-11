import {
    // SelectorEntry creates & tests:
    ParentSelector,
    parentSelector,
    UniversalSelector,
    universalSelector,
    AttrSelector,
    AttrSelectorParams,
    attrSelector,
    ElementSelector,
    elementSelector,
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
    Selector,
    selector,
    SelectorGroup,
    selectorGroup,
    SimpleSelector,
    
    isSimpleSelector,
    isParentSelector,
    isUniversalSelector,
    isAttrSelector,
    isElementSelector,
    isIdSelector,
    isClassSelector,
    isPseudoClassSelector,
    isClassOrPseudoClassSelector,
    isPseudoElementSelector,
    isElementOrPseudoElementSelector,
    
    isNotSimpleSelector,
    isNotParentSelector,
    isNotUniversalSelector,
    isNotAttrSelector,
    isNotElementSelector,
    isNotIdSelector,
    isNotClassSelector,
    isNotPseudoClassSelector,
    isNotClassOrPseudoClassSelector,
    isNotPseudoElementSelector,
    isNotElementOrPseudoElementSelector,
    
    isAttrSelectorOf,
    isElementSelectorOf,
    isIdSelectorOf,
    isClassSelectorOf,
    isPseudoClassSelectorOf,
    isClassOrPseudoClassSelectorOf,
    isPseudoElementSelectorOf,
    isElementOrPseudoElementSelectorOf,
    
    isCombinator,
    isCombinatorOf,
    
    isNotEmptySelectorEntry,
    
    isSelector,
    isNotEmptySelector,
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
    test(`isSelector`, () => {
        expect(isSelector(basicFalsy))
        .toBe(false)
    });
});
allSampleSelectors.forEach((sampleSelector) => {
    test(`isSelector`, () => {
        expect(isSelector(sampleSelector))
        .toBe(true)
    });
});
allSampleStrangeSelectors.forEach((sampleSelector) => {
    test(`isSelector`, () => {
        expect(isSelector(sampleSelector))
        .toBe(true)
    });
});



allBasicFalsies.forEach((basicFalsy) => {
    test(`isNotEmptySelector`, () => {
        expect(isNotEmptySelector(basicFalsy))
        .toBe(false)
    });
});
allSampleSelectors.forEach((sampleSelector) => {
    test(`isNotEmptySelector`, () => {
        expect(isNotEmptySelector(sampleSelector))
        .toBe(true)
    });
});
allSampleStrangeSelectors.forEach((sampleSelector) => {
    test(`isNotEmptySelector`, () => {
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