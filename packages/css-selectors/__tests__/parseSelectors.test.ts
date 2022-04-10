import {
    attrSelector,
    classSelector,
    combinator,
    elementSelector,
    idSelector,
    parentSelector,
    parseSelectors,
    pseudoClassSelector,
    pseudoElementSelector,
    selector,
    universalSelector,
} from '../src/css-selectors'



//#region test empty selector
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
//#endregion test empty selector

//#region test empty selector with excess spaces
test(`parseSelectors('   ')`, () => {
    expect(parseSelectors('   '))
    .toEqual([])
});

test(`parseSelectors(['   '])`, () => {
    expect(parseSelectors(['   ']))
    .toEqual([])
});
//#endregion test empty selector with excess spaces

//#region test invalid selector
test(`parseSelectors('#')`, () => {
    expect(parseSelectors('#'))
    .toBe(null)
});
test(`parseSelectors('.aaa:bbb#ccc@')`, () => {
    expect(parseSelectors('.aaa:bbb#ccc@'))
    .toBe(null)
});
//#endregion test invalid selector



//#region test SimpleSelector
//#region test UnnamedSelector
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
//#endregion test UnnamedSelector
//#region test UnnamedSelector with excess spaces
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
//#endregion test UnnamedSelector with excess spaces

//#region test AttrSelector
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
//#endregion test AttrSelector
//#region test AttrSelector with excess spaces
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
//#endregion test AttrSelector with excess spaces

//#region test NamedSelector
//#region test ElementSelector
test(`parseSelectors('div')`, () => {
    expect(parseSelectors('div'))
    .toEqual([
        selector(
            elementSelector('div'),
        ),
    ])
});
test(`parseSelectors('span')`, () => {
    expect(parseSelectors('span'))
    .toEqual([
        selector(
            elementSelector('span'),
        ),
    ])
});
test(`parseSelectors('custom-element')`, () => {
    expect(parseSelectors('custom-element'))
    .toEqual([
        selector(
            elementSelector('custom-element'),
        ),
    ])
});
//#endregion test ElementSelector
//#region test ElementSelector with excess spaces
test(`parseSelectors('  div  ')`, () => {
    expect(parseSelectors('  div  '))
    .toEqual([
        selector(
            elementSelector('div'),
        ),
    ])
});
test(`parseSelectors('  span  ')`, () => {
    expect(parseSelectors('  span  '))
    .toEqual([
        selector(
            elementSelector('span'),
        ),
    ])
});
test(`parseSelectors('  custom-element  ')`, () => {
    expect(parseSelectors('  custom-element  '))
    .toEqual([
        selector(
            elementSelector('custom-element'),
        ),
    ])
});
//#endregion test ElementSelector with excess spaces

//#region test IdSelector
test(`parseSelectors('#login')`, () => {
    expect(parseSelectors('#login'))
    .toEqual([
        selector(
            idSelector('login'),
        ),
    ])
});
test(`parseSelectors('#login-form')`, () => {
    expect(parseSelectors('#login-form'))
    .toEqual([
        selector(
            idSelector('login-form'),
        ),
    ])
});
//#endregion test IdSelector
//#region test IdSelector with excess spaces
test(`parseSelectors('  #login  ')`, () => {
    expect(parseSelectors('  #login  '))
    .toEqual([
        selector(
            idSelector('login'),
        ),
    ])
});
test(`parseSelectors('  #login-form  ')`, () => {
    expect(parseSelectors('  #login-form  '))
    .toEqual([
        selector(
            idSelector('login-form'),
        ),
    ])
});
//#endregion test IdSelector with excess spaces

//#region test ClassSelector
test(`parseSelectors('.login')`, () => {
    expect(parseSelectors('.login'))
    .toEqual([
        selector(
            classSelector('login'),
        ),
    ])
});
test(`parseSelectors('.login-form')`, () => {
    expect(parseSelectors('.login-form'))
    .toEqual([
        selector(
            classSelector('login-form'),
        ),
    ])
});
//#endregion test ClassSelector
//#region test ClassSelector with excess spaces
test(`parseSelectors('  .login  ')`, () => {
    expect(parseSelectors('  .login  '))
    .toEqual([
        selector(
            classSelector('login'),
        ),
    ])
});
test(`parseSelectors('  .login-form  ')`, () => {
    expect(parseSelectors('  .login-form  '))
    .toEqual([
        selector(
            classSelector('login-form'),
        ),
    ])
});
//#endregion test ClassSelector with excess spaces

//#region test PseudoClassSelector
test(`parseSelectors(':disabled')`, () => {
    expect(parseSelectors(':disabled'))
    .toEqual([
        selector(
            pseudoClassSelector('disabled'),
        ),
    ])
});
test(`parseSelectors(':first-child')`, () => {
    expect(parseSelectors(':first-child'))
    .toEqual([
        selector(
            pseudoClassSelector('first-child'),
        ),
    ])
});
test(`parseSelectors(':nth-child(2n+3)')`, () => {
    expect(parseSelectors(':nth-child(2n+3)'))
    .toEqual([
        selector(
            pseudoClassSelector('nth-child', '2n+3'),
        ),
    ])
});
test(`parseSelectors(':foo(2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq)')`, () => {
    expect(parseSelectors(':foo(2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq)'))
    .toEqual([
        selector(
            pseudoClassSelector('foo', '2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq'),
        ),
    ])
});
//#endregion test PseudoClassSelector
//#region test PseudoClassSelector with excess spaces
test(`parseSelectors('  :disabled  ')`, () => {
    expect(parseSelectors('  :disabled  '))
    .toEqual([
        selector(
            pseudoClassSelector('disabled'),
        ),
    ])
});
test(`parseSelectors('  :first-child  ')`, () => {
    expect(parseSelectors('  :first-child  '))
    .toEqual([
        selector(
            pseudoClassSelector('first-child'),
        ),
    ])
});
test(`parseSelectors('  :nth-child(  2n+3  )  ')`, () => {
    expect(parseSelectors('  :nth-child(  2n+3  )  '))
    .toEqual([
        selector(
            pseudoClassSelector('nth-child', '2n+3'),
        ),
    ])
});
test(`parseSelectors(':foo(  2n  +  (  3a  +  b  )  +  c  +  (  de  +  fg  )  +  (  (  hi  +  (  jk  +  lmn  )  )  )  +  opq  )')`, () => {
    expect(parseSelectors(':foo(  2n  +  (  3a  +  b  )  +  c  +  (  de  +  fg  )  +  (  (  hi  +  (  jk  +  lmn  )  )  )  +  opq  )'))
    .toEqual([
        selector(
            pseudoClassSelector('foo', '2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq'),
        ),
    ])
});

test(`parseSelectors(':nth-child  (2n+3)')`, () => {
    expect(parseSelectors(':nth-child  (2n+3)'))
    .toBe(null)
});
test(`parseSelectors(':nth-child  (2n+3)  ')`, () => {
    expect(parseSelectors(':nth-child  (2n+3)  '))
    .toBe(null)
});
test(`parseSelectors(':foo  (2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq)')`, () => {
    expect(parseSelectors(':foo  (2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq)'))
    .toBe(null)
});
test(`parseSelectors(':foo  (2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq)  ')`, () => {
    expect(parseSelectors(':foo  (2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq)  '))
    .toBe(null)
});
test(`parseSelectors(':foo  (  2n  +  (  3a  +  b  )  +  c  +  (  de  +  fg  )  +  (  (  hi  +  (  jk  +  lmn  )  )  )  +  opq  )')`, () => {
    expect(parseSelectors(':foo  (  2n  +  (  3a  +  b  )  +  c  +  (  de  +  fg  )  +  (  (  hi  +  (  jk  +  lmn  )  )  )  +  opq  )'))
    .toBe(null)
});
//#endregion test PseudoClassSelector with excess spaces

//#region test PseudoElementSelector
test(`parseSelectors('::backdrop')`, () => {
    expect(parseSelectors('::backdrop'))
    .toEqual([
        selector(
            pseudoElementSelector('backdrop'),
        ),
    ])
});
test(`parseSelectors('::-boo-foo')`, () => {
    expect(parseSelectors('::-boo-foo'))
    .toEqual([
        selector(
            pseudoElementSelector('-boo-foo'),
        ),
    ])
});
//#endregion test PseudoElementSelector
//#region test PseudoElementSelector with excess spaces
test(`parseSelectors('  ::backdrop  ')`, () => {
    expect(parseSelectors('  ::backdrop  '))
    .toEqual([
        selector(
            pseudoElementSelector('backdrop'),
        ),
    ])
});
test(`parseSelectors('  ::-boo-foo  ')`, () => {
    expect(parseSelectors('  ::-boo-foo  '))
    .toEqual([
        selector(
            pseudoElementSelector('-boo-foo'),
        ),
    ])
});
//#endregion test PseudoElementSelector with excess spaces
//#endregion test NamedSelector
//#endregion test SimpleSelector



//#region test CompositeSelector
test(`parseSelectors('.boo.foo:bleh')`, () => {
    expect(parseSelectors('.boo.foo:bleh'))
    .toEqual([
        selector(
            classSelector('boo'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ])
});
test(`parseSelectors('&.boo.foo:bleh')`, () => {
    expect(parseSelectors('&.boo.foo:bleh'))
    .toEqual([
        selector(
            parentSelector(),
            classSelector('boo'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ])
});
test(`parseSelectors('.boo&.foo:bleh')`, () => {
    expect(parseSelectors('.boo&.foo:bleh'))
    .toEqual([
        selector(
            classSelector('boo'),
            parentSelector(),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ])
});
test(`parseSelectors('.boo&.foo:bleh::meh')`, () => {
    expect(parseSelectors('.boo&.foo:bleh::meh'))
    .toEqual([
        selector(
            classSelector('boo'),
            parentSelector(),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
            pseudoElementSelector('meh')
        ),
    ])
});
test(`parseSelectors('.boo&.foo:bleh:nth-child(2n+3)::meh')`, () => {
    expect(parseSelectors('.boo&.foo:bleh:nth-child(2n+3)::meh'))
    .toEqual([
        selector(
            classSelector('boo'),
            parentSelector(),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
            pseudoClassSelector('nth-child', '2n+3'),
            pseudoElementSelector('meh')
        ),
    ])
});
//#endregion test CompositeSelector



//#region test Combinator
test(`parseSelectors('.boo .foo:bleh')`, () => {
    expect(parseSelectors('.boo .foo:bleh'))
    .toEqual([
        selector(
            classSelector('boo'),
            combinator(' '),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ])
});
test(`parseSelectors('.boo>.foo:bleh')`, () => {
    expect(parseSelectors('.boo>.foo:bleh'))
    .toEqual([
        selector(
            classSelector('boo'),
            combinator('>'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ])
});
test(`parseSelectors('.boo~.foo:bleh')`, () => {
    expect(parseSelectors('.boo~.foo:bleh'))
    .toEqual([
        selector(
            classSelector('boo'),
            combinator('~'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ])
});
test(`parseSelectors('.boo+.foo:bleh')`, () => {
    expect(parseSelectors('.boo+.foo:bleh'))
    .toEqual([
        selector(
            classSelector('boo'),
            combinator('+'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ])
});
//#endregion test Combinator

//#region test Combinator with excess spaces
test(`parseSelectors('.boo   .foo:bleh')`, () => {
    expect(parseSelectors('.boo   .foo:bleh'))
    .toEqual([
        selector(
            classSelector('boo'),
            combinator(' '),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ])
});
test(`parseSelectors('.boo  >  .foo:bleh')`, () => {
    expect(parseSelectors('.boo  >  .foo:bleh'))
    .toEqual([
        selector(
            classSelector('boo'),
            combinator('>'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ])
});
test(`parseSelectors('.boo  ~  .foo:bleh')`, () => {
    expect(parseSelectors('.boo  ~  .foo:bleh'))
    .toEqual([
        selector(
            classSelector('boo'),
            combinator('~'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ])
});
test(`parseSelectors('.boo  +  .foo:bleh')`, () => {
    expect(parseSelectors('.boo  +  .foo:bleh'))
    .toEqual([
        selector(
            classSelector('boo'),
            combinator('+'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ])
});
//#endregion test Combinator with excess spaces



//#region test SelectorList
//#endregion test SelectorList
