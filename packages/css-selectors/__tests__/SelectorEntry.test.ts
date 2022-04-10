import {
    // parses:
    parseSelectors,
    
    
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
    pseudoElementSelector,
    combinator,
    selector,
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
