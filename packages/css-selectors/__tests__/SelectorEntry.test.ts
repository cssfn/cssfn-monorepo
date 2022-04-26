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
    
    Combinator,
    combinator,
    
    isCombinator,
    isCombinatorOf,
    
    
    
    // Selector creates & tests:
    Selector,
    selector,
    SelectorGroup,
    selectorGroup,
    
    isNotEmptySelectorEntry,
    isSelector,
} from '../dist/css-selectors.js'



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
    test(`PseudoClassSelector`, () => {
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
    test(`PseudoClassSelector`, () => {
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
    test(`PseudoClassSelector`, () => {
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
        test(`PseudoClassSelector`, () => {
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



const allBasicFalsies          = [undefined, null, false, true];
const allSimpleSelectorFalsies = [...allBasicFalsies, ...([' ', '>', '~', '+'] as Combinator[])];

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



allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isSimpleSelector(falsy)`, () => {
        expect(isSimpleSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isSimpleSelector(SimpleSelector)`, () => {
        expect(isSimpleSelector(sampleSimpleSelector))
        .toBe(true)
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isParentSelector(falsy)`, () => {
        expect(isParentSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isParentSelector(SimpleSelector)`, () => {
        expect(isParentSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === '&'
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isUniversalSelector(falsy)`, () => {
        expect(isUniversalSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isUniversalSelector(SimpleSelector)`, () => {
        expect(isUniversalSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === '*'
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isAttrSelector(falsy)`, () => {
        expect(isAttrSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isAttrSelector(SimpleSelector)`, () => {
        expect(isAttrSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === '['
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isElementSelector(falsy)`, () => {
        expect(isElementSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementSelector(SimpleSelector)`, () => {
        expect(isElementSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === ''
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isIdSelector(falsy)`, () => {
        expect(isIdSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isIdSelector(SimpleSelector)`, () => {
        expect(isIdSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === '#'
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isClassSelector(falsy)`, () => {
        expect(isClassSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isClassSelector(SimpleSelector)`, () => {
        expect(isClassSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === '.'
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isPseudoClassSelector(falsy)`, () => {
        expect(isPseudoClassSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isPseudoClassSelector(SimpleSelector)`, () => {
        expect(isPseudoClassSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === ':'
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isClassOrPseudoClassSelector(falsy)`, () => {
        expect(isClassOrPseudoClassSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isClassOrPseudoClassSelector(SimpleSelector)`, () => {
        expect(isClassOrPseudoClassSelector(sampleSimpleSelector))
        .toBe(
            (sampleSimpleSelector[0] === '.')
            ||
            (sampleSimpleSelector[0] === ':')
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isPseudoElementSelector(falsy)`, () => {
        expect(isPseudoElementSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isPseudoElementSelector(SimpleSelector)`, () => {
        expect(isPseudoElementSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] === '::'
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isElementOrPseudoElementSelector(falsy)`, () => {
        expect(isElementOrPseudoElementSelector(selectorfalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementOrPseudoElementSelector(SimpleSelector)`, () => {
        expect(isElementOrPseudoElementSelector(sampleSimpleSelector))
        .toBe(
            (sampleSimpleSelector[0] === '')
            ||
            (sampleSimpleSelector[0] === '::')
        )
    });
});



allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isNotSimpleSelector(falsy)`, () => {
        expect(isNotSimpleSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotSimpleSelector(SimpleSelector)`, () => {
        expect(isNotSimpleSelector(sampleSimpleSelector))
        .toBe(false)
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isNotParentSelector(falsy)`, () => {
        expect(isNotParentSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotParentSelector(SimpleSelector)`, () => {
        expect(isNotParentSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== '&'
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isNotUniversalSelector(falsy)`, () => {
        expect(isNotUniversalSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotUniversalSelector(SimpleSelector)`, () => {
        expect(isNotUniversalSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== '*'
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isNotAttrSelector(falsy)`, () => {
        expect(isNotAttrSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotAttrSelector(SimpleSelector)`, () => {
        expect(isNotAttrSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== '['
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isNotElementSelector(falsy)`, () => {
        expect(isNotElementSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotElementSelector(SimpleSelector)`, () => {
        expect(isNotElementSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== ''
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isNotIdSelector(falsy)`, () => {
        expect(isNotIdSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotIdSelector(SimpleSelector)`, () => {
        expect(isNotIdSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== '#'
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isNotClassSelector(falsy)`, () => {
        expect(isNotClassSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotClassSelector(SimpleSelector)`, () => {
        expect(isNotClassSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== '.'
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isNotPseudoClassSelector(falsy)`, () => {
        expect(isNotPseudoClassSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotPseudoClassSelector(SimpleSelector)`, () => {
        expect(isNotPseudoClassSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== ':'
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isNotClassOrPseudoClassSelector(falsy)`, () => {
        expect(isNotClassOrPseudoClassSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotClassOrPseudoClassSelector(SimpleSelector)`, () => {
        expect(isNotClassOrPseudoClassSelector(sampleSimpleSelector))
        .toBe(
            (sampleSimpleSelector[0] !== '.')
            &&
            (sampleSimpleSelector[0] !== ':')
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isNotPseudoElementSelector(falsy)`, () => {
        expect(isNotPseudoElementSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotPseudoElementSelector(SimpleSelector)`, () => {
        expect(isNotPseudoElementSelector(sampleSimpleSelector))
        .toBe(
            sampleSimpleSelector[0] !== '::'
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isNotElementOrPseudoElementSelector(falsy)`, () => {
        expect(isNotElementOrPseudoElementSelector(selectorfalsy))
        .toBe(true)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotElementOrPseudoElementSelector(SimpleSelector)`, () => {
        expect(isNotElementOrPseudoElementSelector(sampleSimpleSelector))
        .toBe(
            (sampleSimpleSelector[0] !== '')
            &&
            (sampleSimpleSelector[0] !== '::')
        )
    });
});



allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isAttrSelectorOf(falsy)`, () => {
        expect(isAttrSelectorOf(selectorfalsy, 'disabled'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isAttrSelectorOf(SimpleSelector)`, () => {
        expect(isAttrSelectorOf(sampleSimpleSelector, 'disabled'))
        .toBe(
            (sampleSimpleSelector[0] === '[')
            &&
            (sampleSimpleSelector?.[2]?.[0] === 'disabled')
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isAttrSelectorOf(falsy)`, () => {
        expect(isAttrSelectorOf(selectorfalsy, 'aria-role'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isAttrSelectorOf(SimpleSelector)`, () => {
        expect(isAttrSelectorOf(sampleSimpleSelector, 'aria-role'))
        .toBe(
            (sampleSimpleSelector[0] === '[')
            &&
            (sampleSimpleSelector?.[2]?.[0] === 'aria-role')
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isAttrSelectorOf(falsy)`, () => {
        expect(isAttrSelectorOf(selectorfalsy, 'title'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isAttrSelectorOf(SimpleSelector)`, () => {
        expect(isAttrSelectorOf(sampleSimpleSelector, 'title'))
        .toBe(
            (sampleSimpleSelector[0] === '[')
            &&
            (sampleSimpleSelector?.[2]?.[0] === 'title')
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isAttrSelectorOf(falsy)`, () => {
        expect(isAttrSelectorOf(selectorfalsy, 'lang'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isAttrSelectorOf(SimpleSelector)`, () => {
        expect(isAttrSelectorOf(sampleSimpleSelector, 'lang'))
        .toBe(
            (sampleSimpleSelector[0] === '[')
            &&
            (sampleSimpleSelector?.[2]?.[0] === 'lang')
        )
    });
});


allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isElementSelectorOf(falsy)`, () => {
        expect(isElementSelectorOf(selectorfalsy, 'div'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementSelectorOf(SimpleSelector)`, () => {
        expect(isElementSelectorOf(sampleSimpleSelector, 'div'))
        .toBe(
            (sampleSimpleSelector[0] === '')
            &&
            (sampleSimpleSelector[1] === 'div')
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isElementSelectorOf(falsy)`, () => {
        expect(isElementSelectorOf(selectorfalsy, 'custom-element'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementSelectorOf(SimpleSelector)`, () => {
        expect(isElementSelectorOf(sampleSimpleSelector, 'custom-element'))
        .toBe(
            (sampleSimpleSelector[0] === '')
            &&
            (sampleSimpleSelector[1]  === 'custom-element')
        )
    });
});


allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isIdSelectorOf(falsy)`, () => {
        expect(isIdSelectorOf(selectorfalsy, 'login'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isIdSelectorOf(SimpleSelector)`, () => {
        expect(isIdSelectorOf(sampleSimpleSelector, 'login'))
        .toBe(
            (sampleSimpleSelector[0] === '#')
            &&
            (sampleSimpleSelector[1] === 'login')
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isIdSelectorOf(falsy)`, () => {
        expect(isIdSelectorOf(selectorfalsy, 'login-form'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isIdSelectorOf(SimpleSelector)`, () => {
        expect(isIdSelectorOf(sampleSimpleSelector, 'login-form'))
        .toBe(
            (sampleSimpleSelector[0] === '#')
            &&
            (sampleSimpleSelector[1] === 'login-form')
        )
    });
});


allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isClassSelectorOf(falsy)`, () => {
        expect(isClassSelectorOf(selectorfalsy, 'login'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isClassSelectorOf(SimpleSelector)`, () => {
        expect(isClassSelectorOf(sampleSimpleSelector, 'login'))
        .toBe(
            (sampleSimpleSelector[0] === '.')
            &&
            (sampleSimpleSelector[1] === 'login')
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isClassSelectorOf(falsy)`, () => {
        expect(isClassSelectorOf(selectorfalsy, 'login-form'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isClassSelectorOf(SimpleSelector)`, () => {
        expect(isClassSelectorOf(sampleSimpleSelector, 'login-form'))
        .toBe(
            (sampleSimpleSelector[0] === '.')
            &&
            (sampleSimpleSelector[1] === 'login-form')
        )
    });
});


allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isPseudoClassSelectorOf(falsy)`, () => {
        expect(isPseudoClassSelectorOf(selectorfalsy, 'disabled'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isPseudoClassSelectorOf(SimpleSelector)`, () => {
        expect(isPseudoClassSelectorOf(sampleSimpleSelector, 'disabled'))
        .toBe(
            (sampleSimpleSelector[0] === ':')
            &&
            (sampleSimpleSelector[1] === 'disabled')
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isPseudoClassSelectorOf(falsy)`, () => {
        expect(isPseudoClassSelectorOf(selectorfalsy, 'nth-child'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isPseudoClassSelectorOf(SimpleSelector)`, () => {
        expect(isPseudoClassSelectorOf(sampleSimpleSelector, 'nth-child'))
        .toBe(
            (sampleSimpleSelector[0] === ':')
            &&
            (sampleSimpleSelector[1] === 'nth-child')
        )
    });
});


allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isClassOrPseudoClassSelectorOf(falsy)`, () => {
        expect(isClassOrPseudoClassSelectorOf(selectorfalsy, 'login'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isClassOrPseudoClassSelectorOf(SimpleSelector)`, () => {
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

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isClassOrPseudoClassSelectorOf(falsy)`, () => {
        expect(isClassOrPseudoClassSelectorOf(selectorfalsy, 'disabled'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isClassOrPseudoClassSelectorOf(SimpleSelector)`, () => {
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


allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isPseudoElementSelectorOf(falsy)`, () => {
        expect(isPseudoElementSelectorOf(selectorfalsy, 'backdrop'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isPseudoElementSelectorOf(SimpleSelector)`, () => {
        expect(isPseudoElementSelectorOf(sampleSimpleSelector, 'backdrop'))
        .toBe(
            (sampleSimpleSelector[0] === '::')
            &&
            (sampleSimpleSelector[1] === 'backdrop')
        )
    });
});

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isPseudoElementSelectorOf(falsy)`, () => {
        expect(isPseudoElementSelectorOf(selectorfalsy, '-boo-foo'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isPseudoElementSelectorOf(SimpleSelector)`, () => {
        expect(isPseudoElementSelectorOf(sampleSimpleSelector, '-boo-foo'))
        .toBe(
            (sampleSimpleSelector[0] === '::')
            &&
            (sampleSimpleSelector[1] === '-boo-foo')
        )
    });
});


allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isElementOrPseudoElementSelectorOf(falsy)`, () => {
        expect(isElementOrPseudoElementSelectorOf(selectorfalsy, 'div'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementOrPseudoElementSelectorOf(SimpleSelector)`, () => {
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

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isElementOrPseudoElementSelectorOf(falsy)`, () => {
        expect(isElementOrPseudoElementSelectorOf(selectorfalsy, 'custom-element'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementOrPseudoElementSelectorOf(SimpleSelector)`, () => {
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

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isElementOrPseudoElementSelectorOf(falsy)`, () => {
        expect(isElementOrPseudoElementSelectorOf(selectorfalsy, 'backdrop'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementOrPseudoElementSelectorOf(SimpleSelector)`, () => {
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

allSimpleSelectorFalsies.forEach((selectorfalsy) => {
    test(`isElementOrPseudoElementSelectorOf(falsy)`, () => {
        expect(isElementOrPseudoElementSelectorOf(selectorfalsy, '-boo-foo'))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isElementOrPseudoElementSelectorOf(SimpleSelector)`, () => {
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



const allCombinatorfalsies = [...allBasicFalsies, ...allSampleSimpleSelectors];

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
    test(`isCombinator(falsy)`, () => {
        expect(isCombinator(combinatorfalsy))
        .toBe(false)
    });
});
allSampleCombinators.forEach((sampleCombinator) => {
    test(`isCombinator(Combinator)`, () => {
        expect(isCombinator(sampleCombinator))
        .toBe(true)
    });
});

allCombinatorfalsies.forEach((combinatorfalsy) => {
    allSampleCombinators.forEach((sampleCombinator) => {
        test(`isCombinatorOf(falsy)`, () => {
            expect(isCombinatorOf(combinatorfalsy, sampleCombinator))
            .toBe(false)
        });
    });
});
allSampleCombinators.forEach((sampleCombinator) => {
    allSampleCombinators.forEach((sampleCombinator2) => {
        test(`isCombinatorOf(Combinator)`, () => {
            expect(isCombinatorOf(sampleCombinator, sampleCombinator2))
            .toBe(
                sampleCombinator === sampleCombinator2
            )
        });
    });
});



allBasicFalsies.forEach((basicFalsy) => {
    test(`isNotEmptySelectorEntry(falsy)`, () => {
        expect(isNotEmptySelectorEntry(basicFalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isNotEmptySelectorEntry(SimpleSelector)`, () => {
        expect(isNotEmptySelectorEntry(sampleSimpleSelector))
        .toBe(true)
    });
});
allSampleCombinators.forEach((sampleCombinator) => {
    test(`isNotEmptySelectorEntry(Combinator)`, () => {
        expect(isNotEmptySelectorEntry(sampleCombinator))
        .toBe(true)
    });
});



allBasicFalsies.forEach((basicFalsy) => {
    test(`isSelector(falsy)`, () => {
        expect(isSelector(basicFalsy))
        .toBe(false)
    });
});
allSampleSimpleSelectors.forEach((sampleSimpleSelector) => {
    test(`isSelector(SimpleSelector)`, () => {
        expect(isSelector(sampleSimpleSelector))
        .toBe(false)
    });
});
allSampleCombinators.forEach((sampleCombinator) => {
    test(`isSelector(Combinator)`, () => {
        expect(isSelector(sampleCombinator))
        .toBe(false)
    });
});
