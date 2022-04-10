import {
    attrSelector,
    parentSelector,
    parseSelectors,
    selector,
    universalSelector,
} from '../src/css-selectors'


//#region test attributes with empty selector
test(`parseSelectors('')`, () => {
    expect(parseSelectors(''))
    .toEqual([])
});
test(`parseSelectors(false)`, () => {
    expect(parseSelectors(false))
    .toEqual([])
});
test(`parseSelectors(true)`, () => {
    expect(parseSelectors(true))
    .toEqual([])
});

test(`parseSelectors([''])`, () => {
    expect(parseSelectors(['']))
    .toEqual([])
});
test(`parseSelectors([false])`, () => {
    expect(parseSelectors([false]))
    .toEqual([])
});
test(`parseSelectors([true])`, () => {
    expect(parseSelectors([true]))
    .toEqual([])
});
//#endregion test attributes with empty selector

//#region test attributes with empty selector & excess spaces
test(`parseSelectors('   ')`, () => {
    expect(parseSelectors('   '))
    .toEqual([])
});

test(`parseSelectors(['   '])`, () => {
    expect(parseSelectors(['   ']))
    .toEqual([])
});
//#endregion test attributes with empty selector & excess spaces

//#region test attributes with invalid selector
test(`parseSelectors('#')`, () => {
    expect(parseSelectors('#'))
    .toBe(null)
});
test(`parseSelectors('.aaa:bbb#ccc@')`, () => {
    expect(parseSelectors('.aaa:bbb#ccc@'))
    .toBe(null)
});
//#endregion test attributes with invalid selector

//#region test unnamed selectors
test(`parseSelectors('&')`, () => {
    expect(parseSelectors('&'))
    .toEqual([
        selector(
            parentSelector(),
        ),
    ])
});
test(`parseSelectors('*')`, () => {
    expect(parseSelectors('*'))
    .toEqual([
        selector(
            universalSelector(),
        ),
    ])
});
//#endregion test unnamed selectors

//#region test unnamed selectors with excess spaces
test(`parseSelectors('  &  ')`, () => {
    expect(parseSelectors('  &  '))
    .toEqual([
        selector(
            parentSelector(),
        ),
    ])
});
test(`parseSelectors('  *  ')`, () => {
    expect(parseSelectors('  *  '))
    .toEqual([
        selector(
            universalSelector(),
        ),
    ])
});
//#endregion test unnamed selectors with excess spaces

//#region test attributes
test(`parseSelectors('[disabled]')`, () => {
    expect(parseSelectors('[disabled]'))
    .toEqual([
        selector(
            attrSelector('disabled'),
        ),
    ])
});

test(`parseSelectors('[aria-role="button"]')`, () => {
    expect(parseSelectors('[aria-role="button"]'))
    .toEqual([
        selector(
            attrSelector('aria-role', '=', 'button'),
        ),
    ])
});
test(`parseSelectors('[title~="hello world"]')`, () => {
    expect(parseSelectors('[title~="hello world"]'))
    .toEqual([
        selector(
            attrSelector('title', '~=', 'hello world'),
        ),
    ])
});
test(`parseSelectors('[lang|="en-us"]')`, () => {
    expect(parseSelectors('[lang|="en-us"]'))
    .toEqual([
        selector(
            attrSelector('lang', '|=', 'en-us'),
        ),
    ])
});
test(`parseSelectors('[title^="hello world"]')`, () => {
    expect(parseSelectors('[title^="hello world"]'))
    .toEqual([
        selector(
            attrSelector('title', '^=', 'hello world'),
        ),
    ])
});
test(`parseSelectors('[title$="hello world"]')`, () => {
    expect(parseSelectors('[title$="hello world"]'))
    .toEqual([
        selector(
            attrSelector('title', '$=', 'hello world'),
        ),
    ])
});
test(`parseSelectors('[title="hello world" i]')`, () => {
    expect(parseSelectors('[title="hello world" i]'))
    .toEqual([
        selector(
            attrSelector('title', '=', 'hello world', 'i'),
        ),
    ])
});
test(`parseSelectors('[title="hello world" I]')`, () => {
    expect(parseSelectors('[title="hello world" I]'))
    .toEqual([
        selector(
            attrSelector('title', '=', 'hello world', 'I'),
        ),
    ])
});
test(`parseSelectors('[title="hello world" s]')`, () => {
    expect(parseSelectors('[title="hello world" s]'))
    .toEqual([
        selector(
            attrSelector('title', '=', 'hello world', 's'),
        ),
    ])
});
test(`parseSelectors('[title="hello world" S]')`, () => {
    expect(parseSelectors('[title="hello world" S]'))
    .toEqual([
        selector(
            attrSelector('title', '=', 'hello world', 'S'),
        ),
    ])
});
//#endregion test attributes

//#region test attributes with excess spaces
test(`parseSelectors('  [ disabled ]  ')`, () => {
    expect(parseSelectors('  [ disabled ]  '))
    .toEqual([
        selector(
            attrSelector('disabled'),
        ),
    ])
});

test(`parseSelectors('  [  aria-role  =  "button"  ]  ')`, () => {
    expect(parseSelectors('  [  aria-role  =  "button"  ]  '))
    .toEqual([
        selector(
            attrSelector('aria-role', '=', 'button'),
        ),
    ])
});
test(`parseSelectors('  [  title  ~=  "hello world"  ]  ')`, () => {
    expect(parseSelectors('  [  title  ~=  "hello world"  ]  '))
    .toEqual([
        selector(
            attrSelector('title', '~=', 'hello world'),
        ),
    ])
});
test(`parseSelectors('  [  lang  |=  "en-us"  ]  ')`, () => {
    expect(parseSelectors('  [  lang  |=  "en-us"  ]  '))
    .toEqual([
        selector(
            attrSelector('lang', '|=', 'en-us'),
        ),
    ])
});
test(`parseSelectors('  [  title  ^=  "hello world"  ]  ')`, () => {
    expect(parseSelectors('  [  title  ^=  "hello world"  ]  '))
    .toEqual([
        selector(
            attrSelector('title', '^=', 'hello world'),
        ),
    ])
});
test(`parseSelectors('  [  title  $=  "hello world"  ]  ')`, () => {
    expect(parseSelectors('  [  title  $=  "hello world"  ]  '))
    .toEqual([
        selector(
            attrSelector('title', '$=', 'hello world'),
        ),
    ])
});
test(`parseSelectors('  [  title  =  "hello world"   i  ]  ')`, () => {
    expect(parseSelectors('  [  title  =  "hello world"   i  ]  '))
    .toEqual([
        selector(
            attrSelector('title', '=', 'hello world', 'i'),
        ),
    ])
});
test(`parseSelectors('  [  title  =  "hello world"   I  ]  ')`, () => {
    expect(parseSelectors('  [  title  =  "hello world"   I  ]  '))
    .toEqual([
        selector(
            attrSelector('title', '=', 'hello world', 'I'),
        ),
    ])
});
test(`parseSelectors('  [  title  =  "hello world"   s  ]  ')`, () => {
    expect(parseSelectors('  [  title  =  "hello world"   s  ]  '))
    .toEqual([
        selector(
            attrSelector('title', '=', 'hello world', 's'),
        ),
    ])
});
test(`parseSelectors('  [  title  =  "hello world"   S  ]  ')`, () => {
    expect(parseSelectors('  [  title  =  "hello world"   S  ]  '))
    .toEqual([
        selector(
            attrSelector('title', '=', 'hello world', 'S'),
        ),
    ])
});
//#endregion test attributes with excess spaces
