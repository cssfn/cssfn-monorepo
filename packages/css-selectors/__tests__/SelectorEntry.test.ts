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
