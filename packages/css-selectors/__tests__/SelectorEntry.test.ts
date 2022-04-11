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



const allSelectorfalsies = [undefined, null, false, true, ...([' ', '>', '~', '+'] as Combinator[])];

//#region allSampleSimpleSelectors
const allSampleSimpleSelectors : SimpleSelector[] =[
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
];
//#endregion allSampleSimpleSelectors


allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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



allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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

allSelectorfalsies.forEach((selectorfalsy) => {
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
