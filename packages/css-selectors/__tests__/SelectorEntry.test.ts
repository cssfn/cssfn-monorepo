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
} from '../src/css-selectors'



test(`ParentSelector`, () => {
    expect(parentSelector())
    .toEqual(((): ParentSelector => [
        '&',
    ])());
});

test(`UniversalSelector`, () => {
    expect(universalSelector())
    .toEqual(((): UniversalSelector => [
        '*',
    ])());
});

test(`AttrSelector`, () => {
    expect(attrSelector('disabled'))
    .toEqual(((): AttrSelector => [
        '[',
        null,
        ((): AttrSelectorParams => [
            'disabled',
        ])(),
    ])());
});
test(`AttrSelector`, () => {
    expect(attrSelector('aria-role', '=', 'button'))
    .toEqual(((): AttrSelector => [
        '[',
        null,
        ((): AttrSelectorParams => [
            'aria-role',
            '=',
            'button',
        ])(),
    ])());
});
test(`AttrSelector`, () => {
    expect(attrSelector('title', '~=', 'hello'))
    .toEqual(((): AttrSelector => [
        '[',
        null,
        ((): AttrSelectorParams => [
            'title',
            '~=',
            'hello',
        ])(),
    ])());
});
test(`AttrSelector`, () => {
    expect(attrSelector('lang', '|=', 'en'))
    .toEqual(((): AttrSelector => [
        '[',
        null,
        ((): AttrSelectorParams => [
            'lang',
            '|=',
            'en',
        ])(),
    ])());
});
test(`AttrSelector`, () => {
    expect(attrSelector('title', '^=', 'hello'))
    .toEqual(((): AttrSelector => [
        '[',
        null,
        ((): AttrSelectorParams => [
            'title',
            '^=',
            'hello',
        ])(),
    ])());
});
test(`AttrSelector`, () => {
    expect(attrSelector('title', '$=', 'hello'))
    .toEqual(((): AttrSelector => [
        '[',
        null,
        ((): AttrSelectorParams => [
            'title',
            '$=',
            'hello',
        ])(),
    ])());
});
test(`AttrSelector`, () => {
    expect(attrSelector('title', '*=', 'hello'))
    .toEqual(((): AttrSelector => [
        '[',
        null,
        ((): AttrSelectorParams => [
            'title',
            '*=',
            'hello',
        ])(),
    ])());
});
test(`AttrSelector`, () => {
    expect(attrSelector('title', '~=', 'hello', 'i'))
    .toEqual(((): AttrSelector => [
        '[',
        null,
        ((): AttrSelectorParams => [
            'title',
            '~=',
            'hello',
            'i'
        ])(),
    ])());
});
test(`AttrSelector`, () => {
    expect(attrSelector('title', '~=', 'hello', 'I'))
    .toEqual(((): AttrSelector => [
        '[',
        null,
        ((): AttrSelectorParams => [
            'title',
            '~=',
            'hello',
            'I'
        ])(),
    ])());
});
test(`AttrSelector`, () => {
    expect(attrSelector('title', '~=', 'hello', 's'))
    .toEqual(((): AttrSelector => [
        '[',
        null,
        ((): AttrSelectorParams => [
            'title',
            '~=',
            'hello',
            's'
        ])(),
    ])());
});
test(`AttrSelector`, () => {
    expect(attrSelector('title', '~=', 'hello', 'S'))
    .toEqual(((): AttrSelector => [
        '[',
        null,
        ((): AttrSelectorParams => [
            'title',
            '~=',
            'hello',
            'S'
        ])(),
    ])());
});

test(`ElementSelector`, () => {
    expect(elementSelector('div'))
    .toEqual(((): ElementSelector => [
        '',
        'div',
    ])());
});
test(`ElementSelector`, () => {
    expect(elementSelector('custom-element'))
    .toEqual(((): ElementSelector => [
        '',
        'custom-element',
    ])());
});

test(`IdSelector`, () => {
    expect(idSelector('login'))
    .toEqual(((): IdSelector => [
        '#',
        'login',
    ])());
});
test(`IdSelector`, () => {
    expect(idSelector('login-form'))
    .toEqual(((): IdSelector => [
        '#',
        'login-form',
    ])());
});

test(`ClassSelector`, () => {
    expect(classSelector('login'))
    .toEqual(((): ClassSelector => [
        '.',
        'login',
    ])());
});
test(`ClassSelector`, () => {
    expect(classSelector('login-form'))
    .toEqual(((): ClassSelector => [
        '.',
        'login-form',
    ])());
});

test(`PseudoClassSelector`, () => {
    expect(pseudoClassSelector('disabled'))
    .toEqual(((): PseudoClassSelector => [
        ':',
        'disabled',
    ])());
});
test(`PseudoClassSelector`, () => {
    expect(pseudoClassSelector('nth-child', '2n+3'))
    .toEqual(((): PseudoClassSelector => [
        ':',
        'nth-child',
        '2n+3'
    ])());
});
test(`PseudoClassSelector`, () => {
    expect(pseudoClassSelector('foo', '2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq'))
    .toEqual(((): PseudoClassSelector => [
        ':',
        'foo',
        '2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq'
    ])());
});
['is', 'not', 'where', 'has'].forEach((group) => {
    test(`isSelectors(SelectorGroup)`, () => {
        expect(pseudoClassSelector(group, selectorGroup(
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
        .toEqual(((): PseudoClassSelector => [
            ':',
            group,
            ((): SelectorGroup => [
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
                ])(),
                ((): Selector => [
                    ((): PseudoElementSelector => [
                        '::',
                        'charlie'
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
                        ])(),
                    ])(),
                ])(),
            ])(),
        ])());
    });
    test(`isSelectors(SelectorGroup)`, () => {
        expect(pseudoClassSelector(group, selectorGroup(
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
        .toEqual(((): PseudoClassSelector => [
            ':',
            group,
            ((): SelectorGroup => [
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
                ])(),
                ((): Selector => [
                    ((): PseudoElementSelector => [
                        '::',
                        'charlie'
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
            ])(),
        ])());
    });
    test(`isSelectors(SelectorGroup)`, () => {
        expect(pseudoClassSelector(group, selectorGroup(
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
        .toEqual(((): PseudoClassSelector => [
            ':',
            group,
            ((): SelectorGroup => [
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
                ])(),
                ((): Selector => [
                    ((): PseudoElementSelector => [
                        '::',
                        'charlie'
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
            ])(),
        ])());
    });
    ['is', 'not', 'where', 'has'].forEach((group2) => {
        test(`isSelectors(SelectorGroup)`, () => {
            expect(pseudoClassSelector(group, selectorGroup(
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
            .toEqual(((): PseudoClassSelector => [
                ':',
                group,
                ((): SelectorGroup => [
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
                    ])(),
                    ((): Selector => [
                        ((): PseudoElementSelector => [
                            '::',
                            'charlie'
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
                ])(),
            ])());
        });
    });
});

test(`PseudoElementSelector`, () => {
    expect(pseudoElementSelector('backdrop'))
    .toEqual(((): PseudoElementSelector => [
        '::',
        'backdrop',
    ])());
});
test(`PseudoElementSelector`, () => {
    expect(pseudoElementSelector('-boo-foo'))
    .toEqual(((): PseudoElementSelector => [
        '::',
        '-boo-foo',
    ])());
});



const allSimpleSelectorfalsies = [undefined, null, false, true, ...([' ', '>', '~', '+'] as Combinator[])];

//#region allSampleSimpleSelectors
const allSampleSimpleSelectors : SimpleSelector[] = [
    parentSelector(),
    universalSelector(),
    attrSelector('disabled'),
    attrSelector('aria-role', '=', 'button'),
    attrSelector('title', '~=', 'hello'),
    attrSelector('lang', '|=', 'en'),
    attrSelector('title', '^=', 'hello'),
    attrSelector('title', '$=', 'hello'),
    attrSelector('title', '*=', 'hello'),
    attrSelector('title', '~=', 'hello', 'i'),
    attrSelector('title', '~=', 'hello', 'I'),
    attrSelector('title', '~=', 'hello', 's'),
    attrSelector('title', '~=', 'hello', 'S'),
    elementSelector('div'),
    elementSelector('custom-element'),
    idSelector('login'),
    idSelector('login-form'),
    classSelector('login'),
    classSelector('login-form'),
    pseudoClassSelector('disabled'),
    pseudoClassSelector('nth-child', '2n+3'),
    pseudoClassSelector('foo', '2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq'),
    ...['is', 'not', 'where', 'has'].flatMap((group): SimpleSelector[] => [
        pseudoClassSelector(group, selectorGroup(
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
        )),
        pseudoClassSelector(group, selectorGroup(
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
        )),
        pseudoClassSelector(group, selectorGroup(
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
        )),
        ...['is', 'not', 'where', 'has'].flatMap((group2): SimpleSelector[] => [
            pseudoClassSelector(group, selectorGroup(
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
            ))
        ]),
    ]),
    pseudoElementSelector('backdrop'),
    pseudoElementSelector('-boo-foo'),
];
//#endregion allSampleSimpleSelectors



allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isSimpleSelector`, () => {
        expect(isSimpleSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isSimpleSelector`, () => {
        expect(isSimpleSelector(sampleSimpleSelector))
        .toBe(true)
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isParentSelector`, () => {
        expect(isParentSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isParentSelector`, () => {
        expect(isParentSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === '&'
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isUniversalSelector`, () => {
        expect(isUniversalSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isUniversalSelector`, () => {
        expect(isUniversalSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === '*'
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isAttrSelector`, () => {
        expect(isAttrSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isAttrSelector`, () => {
        expect(isAttrSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === '['
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isElementSelector`, () => {
        expect(isElementSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementSelector`, () => {
        expect(isElementSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === ''
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isIdSelector`, () => {
        expect(isIdSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isIdSelector`, () => {
        expect(isIdSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === '#'
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isClassSelector`, () => {
        expect(isClassSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isClassSelector`, () => {
        expect(isClassSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === '.'
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isPseudoClassSelector`, () => {
        expect(isPseudoClassSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isPseudoClassSelector`, () => {
        expect(isPseudoClassSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === ':'
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isClassOrPseudoClassSelector`, () => {
        expect(isClassOrPseudoClassSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isClassOrPseudoClassSelector`, () => {
        expect(isClassOrPseudoClassSelector(sampleSimpleSelector))
        .toBe(
            (sampleSimpleSelector[0] === '.')
            ||
            (sampleSimpleSelector[0] === ':')
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isPseudoElementSelector`, () => {
        expect(isPseudoElementSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isPseudoElementSelector`, () => {
        expect(isPseudoElementSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === '::'
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isElementOrPseudoElementSelector`, () => {
        expect(isElementOrPseudoElementSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementOrPseudoElementSelector`, () => {
        expect(isElementOrPseudoElementSelector(sampleSimpleSelector))
        .toBe(
            (sampleSimpleSelector[0] === '')
            ||
            (sampleSimpleSelector[0] === '::')
        )
    });
});



allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isNotSimpleSelector`, () => {
        expect(isNotSimpleSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotSimpleSelector`, () => {
        expect(isNotSimpleSelector(sampleSimpleSelector))
        .toBe(false)
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isNotParentSelector`, () => {
        expect(isNotParentSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotParentSelector`, () => {
        expect(isNotParentSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== '&'
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isNotUniversalSelector`, () => {
        expect(isNotUniversalSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotUniversalSelector`, () => {
        expect(isNotUniversalSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== '*'
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isNotAttrSelector`, () => {
        expect(isNotAttrSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotAttrSelector`, () => {
        expect(isNotAttrSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== '['
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isNotElementSelector`, () => {
        expect(isNotElementSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotElementSelector`, () => {
        expect(isNotElementSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== ''
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isNotIdSelector`, () => {
        expect(isNotIdSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotIdSelector`, () => {
        expect(isNotIdSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== '#'
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isNotClassSelector`, () => {
        expect(isNotClassSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotClassSelector`, () => {
        expect(isNotClassSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== '.'
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isNotPseudoClassSelector`, () => {
        expect(isNotPseudoClassSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotPseudoClassSelector`, () => {
        expect(isNotPseudoClassSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== ':'
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isNotClassOrPseudoClassSelector`, () => {
        expect(isNotClassOrPseudoClassSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotClassOrPseudoClassSelector`, () => {
        expect(isNotClassOrPseudoClassSelector(sampleSimpleSelector))
        .toBe(
            (sampleSimpleSelector[0] !== '.')
            &&
            (sampleSimpleSelector[0] !== ':')
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isNotPseudoElementSelector`, () => {
        expect(isNotPseudoElementSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotPseudoElementSelector`, () => {
        expect(isNotPseudoElementSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== '::'
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isNotElementOrPseudoElementSelector`, () => {
        expect(isNotElementOrPseudoElementSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotElementOrPseudoElementSelector`, () => {
        expect(isNotElementOrPseudoElementSelector(sampleSimpleSelector))
        .toBe(
            (sampleSimpleSelector[0] !== '')
            &&
            (sampleSimpleSelector[0] !== '::')
        )
    });
});



allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isAttrSelectorOf`, () => {
        expect(isAttrSelectorOf(selectorfalsy, 'disabled'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isAttrSelectorOf`, () => {
        expect(isAttrSelectorOf(sampleSimpleSelector, 'disabled'))
        .toBe(
            (sampleSimpleSelector[0] === '[')
            &&
            (sampleSimpleSelector?.[2]?.[0] === 'disabled')
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isAttrSelectorOf`, () => {
        expect(isAttrSelectorOf(selectorfalsy, 'aria-role'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isAttrSelectorOf`, () => {
        expect(isAttrSelectorOf(sampleSimpleSelector, 'aria-role'))
        .toBe(
            (sampleSimpleSelector[0] === '[')
            &&
            (sampleSimpleSelector?.[2]?.[0] === 'aria-role')
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isAttrSelectorOf`, () => {
        expect(isAttrSelectorOf(selectorfalsy, 'title'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isAttrSelectorOf`, () => {
        expect(isAttrSelectorOf(sampleSimpleSelector, 'title'))
        .toBe(
            (sampleSimpleSelector[0] === '[')
            &&
            (sampleSimpleSelector?.[2]?.[0] === 'title')
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isAttrSelectorOf`, () => {
        expect(isAttrSelectorOf(selectorfalsy, 'lang'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isAttrSelectorOf`, () => {
        expect(isAttrSelectorOf(sampleSimpleSelector, 'lang'))
        .toBe(
            (sampleSimpleSelector[0] === '[')
            &&
            (sampleSimpleSelector?.[2]?.[0] === 'lang')
        )
    });
});


allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isElementSelectorOf`, () => {
        expect(isElementSelectorOf(selectorfalsy, 'div'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementSelectorOf`, () => {
        expect(isElementSelectorOf(sampleSimpleSelector, 'div'))
        .toBe(
            (sampleSimpleSelector[0] === '')
            &&
            (sampleSimpleSelector[1] === 'div')
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isElementSelectorOf`, () => {
        expect(isElementSelectorOf(selectorfalsy, 'custom-element'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementSelectorOf`, () => {
        expect(isElementSelectorOf(sampleSimpleSelector, 'custom-element'))
        .toBe(
            (sampleSimpleSelector[0] === '')
            &&
            (sampleSimpleSelector[1]  === 'custom-element')
        )
    });
});


allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isIdSelectorOf`, () => {
        expect(isIdSelectorOf(selectorfalsy, 'login'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isIdSelectorOf`, () => {
        expect(isIdSelectorOf(sampleSimpleSelector, 'login'))
        .toBe(
            (sampleSimpleSelector[0] === '#')
            &&
            (sampleSimpleSelector[1] === 'login')
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isIdSelectorOf`, () => {
        expect(isIdSelectorOf(selectorfalsy, 'login-form'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isIdSelectorOf`, () => {
        expect(isIdSelectorOf(sampleSimpleSelector, 'login-form'))
        .toBe(
            (sampleSimpleSelector[0] === '#')
            &&
            (sampleSimpleSelector[1] === 'login-form')
        )
    });
});


allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isClassSelectorOf`, () => {
        expect(isClassSelectorOf(selectorfalsy, 'login'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isClassSelectorOf`, () => {
        expect(isClassSelectorOf(sampleSimpleSelector, 'login'))
        .toBe(
            (sampleSimpleSelector[0] === '.')
            &&
            (sampleSimpleSelector[1] === 'login')
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isClassSelectorOf`, () => {
        expect(isClassSelectorOf(selectorfalsy, 'login-form'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isClassSelectorOf`, () => {
        expect(isClassSelectorOf(sampleSimpleSelector, 'login-form'))
        .toBe(
            (sampleSimpleSelector[0] === '.')
            &&
            (sampleSimpleSelector[1] === 'login-form')
        )
    });
});


allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isPseudoClassSelectorOf`, () => {
        expect(isPseudoClassSelectorOf(selectorfalsy, 'disabled'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isPseudoClassSelectorOf`, () => {
        expect(isPseudoClassSelectorOf(sampleSimpleSelector, 'disabled'))
        .toBe(
            (sampleSimpleSelector[0] === ':')
            &&
            (sampleSimpleSelector[1] === 'disabled')
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isPseudoClassSelectorOf`, () => {
        expect(isPseudoClassSelectorOf(selectorfalsy, 'nth-child'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isPseudoClassSelectorOf`, () => {
        expect(isPseudoClassSelectorOf(sampleSimpleSelector, 'nth-child'))
        .toBe(
            (sampleSimpleSelector[0] === ':')
            &&
            (sampleSimpleSelector[1] === 'nth-child')
        )
    });
});


allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isClassOrPseudoClassSelectorOf`, () => {
        expect(isClassOrPseudoClassSelectorOf(selectorfalsy, 'login'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isClassOrPseudoClassSelectorOf`, () => {
        expect(isClassOrPseudoClassSelectorOf(sampleSimpleSelector, 'login'))
        .toBe(
            (
                (sampleSimpleSelector[0] === '.')
                ||
                (sampleSimpleSelector[0] === ':')
            )
            &&
            (sampleSimpleSelector[1] === 'login')
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isClassOrPseudoClassSelectorOf`, () => {
        expect(isClassOrPseudoClassSelectorOf(selectorfalsy, 'disabled'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isClassOrPseudoClassSelectorOf`, () => {
        expect(isClassOrPseudoClassSelectorOf(sampleSimpleSelector, 'disabled'))
        .toBe(
            (
                (sampleSimpleSelector[0] === '.')
                ||
                (sampleSimpleSelector[0] === ':')
            )
            &&
            (sampleSimpleSelector[1] === 'disabled')
        )
    });
});


allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isPseudoElementSelectorOf`, () => {
        expect(isPseudoElementSelectorOf(selectorfalsy, 'backdrop'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isPseudoElementSelectorOf`, () => {
        expect(isPseudoElementSelectorOf(sampleSimpleSelector, 'backdrop'))
        .toBe(
            (sampleSimpleSelector[0] === '::')
            &&
            (sampleSimpleSelector[1] === 'backdrop')
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isPseudoElementSelectorOf`, () => {
        expect(isPseudoElementSelectorOf(selectorfalsy, '-boo-foo'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isPseudoElementSelectorOf`, () => {
        expect(isPseudoElementSelectorOf(sampleSimpleSelector, '-boo-foo'))
        .toBe(
            (sampleSimpleSelector[0] === '::')
            &&
            (sampleSimpleSelector[1] === '-boo-foo')
        )
    });
});


allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isElementOrPseudoElementSelectorOf`, () => {
        expect(isElementOrPseudoElementSelectorOf(selectorfalsy, 'div'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementOrPseudoElementSelectorOf`, () => {
        expect(isElementOrPseudoElementSelectorOf(sampleSimpleSelector, 'div'))
        .toBe(
            (
                (sampleSimpleSelector[0] === '')
                ||
                (sampleSimpleSelector[0] === '::')
            )
            &&
            (sampleSimpleSelector[1] === 'div')
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isElementOrPseudoElementSelectorOf`, () => {
        expect(isElementOrPseudoElementSelectorOf(selectorfalsy, 'custom-element'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementOrPseudoElementSelectorOf`, () => {
        expect(isElementOrPseudoElementSelectorOf(sampleSimpleSelector, 'custom-element'))
        .toBe(
            (
                (sampleSimpleSelector[0] === '')
                ||
                (sampleSimpleSelector[0] === '::')
            )
            &&
            (sampleSimpleSelector[1] === 'custom-element')
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isElementOrPseudoElementSelectorOf`, () => {
        expect(isElementOrPseudoElementSelectorOf(selectorfalsy, 'backdrop'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementOrPseudoElementSelectorOf`, () => {
        expect(isElementOrPseudoElementSelectorOf(sampleSimpleSelector, 'backdrop'))
        .toBe(
            (
                (sampleSimpleSelector[0] === '')
                ||
                (sampleSimpleSelector[0] === '::')
            )
            &&
            (sampleSimpleSelector[1] === 'backdrop')
        )
    });
});

allSimpleSelectorfalsies.forEach((selectorfalsy) => {
    test(`isElementOrPseudoElementSelectorOf`, () => {
        expect(isElementOrPseudoElementSelectorOf(selectorfalsy, '-boo-foo'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementOrPseudoElementSelectorOf`, () => {
        expect(isElementOrPseudoElementSelectorOf(sampleSimpleSelector, '-boo-foo'))
        .toBe(
            (
                (sampleSimpleSelector[0] === '')
                ||
                (sampleSimpleSelector[0] === '::')
            )
            &&
            (sampleSimpleSelector[1] === '-boo-foo')
        )
    });
});



const allCombinatorfalsies = [undefined, null, false, true, ...allSampleSimpleSelectors];

//#region allSampleSimpleSelectors
const allSampleCombinators : Combinator[] = [
    ' ',
    '>',
    '~',
    '+',
];
//#endregion allSampleSimpleSelectors



allSampleCombinators.forEach((sampleCombinator) => {
    test(`Combinator`, () => {
        expect(combinator(sampleCombinator))
        .toEqual(((): Combinator => sampleCombinator)());
    });
});



allCombinatorfalsies.forEach((combinatorfalsy) => {
    test(`isCombinator`, () => {
        expect(isCombinator(combinatorfalsy))
        .toBe(false)
    });
});
allSampleCombinators.forEach((sampleCombinator) => {
    test(`isCombinator`, () => {
        expect(isCombinator(sampleCombinator))
        .toBe(true)
    });
});

allCombinatorfalsies.forEach((combinatorfalsy) => {
    allSampleCombinators.forEach((sampleCombinator) => {
        test(`isCombinatorOf`, () => {
            expect(isCombinatorOf(combinatorfalsy, sampleCombinator))
            .toBe(false)
        });
    });
});
allSampleCombinators.forEach((sampleCombinator) => {
    allSampleCombinators.forEach((sampleCombinator2) => {
        test(`isCombinatorOf`, () => {
            expect(isCombinatorOf(sampleCombinator, sampleCombinator2))
            .toBe(
                sampleCombinator === sampleCombinator2
            )
        });
    });
});



[undefined, null, false, true].forEach((selectorfalsy) => {
    test(`isNotEmptySelectorEntry`, () => {
        expect(isNotEmptySelectorEntry(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotEmptySelectorEntry`, () => {
        expect(isNotEmptySelectorEntry(sampleSimpleSelector))
        .toBe(true)
    });
});
allSampleCombinators.forEach((sampleCombinator) => {
    test(`isNotEmptySelectorEntry`, () => {
        expect(isNotEmptySelectorEntry(sampleCombinator))
        .toBe(true)
    });
});
