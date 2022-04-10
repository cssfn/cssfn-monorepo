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
    elementSelector,
    idSelector,
    classSelector,
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

