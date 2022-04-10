import {
    // parses:
    parseSelectors,
    
    
    // SelectorEntry creates & tests:
    parentSelector,
    universalSelector,
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



//#region test empty selector
test(`parseSelectors('')`, () => {
    expect(parseSelectors(''))
    .toEqual(selectorGroup(
        /* empty selector */
    ));
});
test(`parseSelectors(false)`, () => {
    expect(parseSelectors(false))
    .toEqual(selectorGroup(
        /* empty selector */
    ));
});
test(`parseSelectors(true)`, () => {
    expect(parseSelectors(true))
    .toEqual(selectorGroup(
        /* empty selector */
    ));
});

test(`parseSelectors([''])`, () => {
    expect(parseSelectors(['']))
    .toEqual(selectorGroup(
        /* empty selector */
    ));
});
test(`parseSelectors([false])`, () => {
    expect(parseSelectors([false]))
    .toEqual(selectorGroup(
        /* empty selector */
    ));
});
test(`parseSelectors([true])`, () => {
    expect(parseSelectors([true]))
    .toEqual(selectorGroup(
        /* empty selector */
    ));
});
//#endregion test empty selector

//#region test empty selector with excess spaces
test(`parseSelectors('   ')`, () => {
    expect(parseSelectors('   '))
    .toEqual(selectorGroup(
        /* empty selector */
    ));
});

test(`parseSelectors(['   '])`, () => {
    expect(parseSelectors(['   ']))
    .toEqual(selectorGroup(
        /* empty selector */
    ));
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
    .toEqual(selectorGroup(
        selector(
            parentSelector(),
        ),
    ));
});
test(`parseSelectors('*')`, () => {
    expect(parseSelectors('*'))
    .toEqual(selectorGroup(
        selector(
            universalSelector(),
        ),
    ));
});
//#endregion test UnnamedSelector
//#region test UnnamedSelector with excess spaces
test(`parseSelectors('  &  ')`, () => {
    expect(parseSelectors('  &  '))
    .toEqual(selectorGroup(
        selector(
            parentSelector(),
        ),
    ));
});
test(`parseSelectors('  *  ')`, () => {
    expect(parseSelectors('  *  '))
    .toEqual(selectorGroup(
        selector(
            universalSelector(),
        ),
    ));
});
//#endregion test UnnamedSelector with excess spaces

//#region test AttrSelector
test(`parseSelectors('[disabled]')`, () => {
    expect(parseSelectors('[disabled]'))
    .toEqual(selectorGroup(
        selector(
            attrSelector('disabled'),
        ),
    ));
});

test(`parseSelectors('[aria-role="button"]')`, () => {
    expect(parseSelectors('[aria-role="button"]'))
    .toEqual(selectorGroup(
        selector(
            attrSelector('aria-role', '=', 'button'),
        ),
    ));
});
test(`parseSelectors('[title~="hello"]')`, () => {
    expect(parseSelectors('[title~="hello"]'))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '~=', 'hello'),
        ),
    ));
});
test(`parseSelectors('[lang|="en"]')`, () => {
    expect(parseSelectors('[lang|="en"]'))
    .toEqual(selectorGroup(
        selector(
            attrSelector('lang', '|=', 'en'),
        ),
    ));
});
test(`parseSelectors('[title^="hello"]')`, () => {
    expect(parseSelectors('[title^="hello"]'))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '^=', 'hello'),
        ),
    ));
});
test(`parseSelectors('[title$="hello"]')`, () => {
    expect(parseSelectors('[title$="hello"]'))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '$=', 'hello'),
        ),
    ));
});
test(`parseSelectors('[title*="hello"]')`, () => {
    expect(parseSelectors('[title*="hello"]'))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '*=', 'hello'),
        ),
    ));
});
test(`parseSelectors('[title="hello" i]')`, () => {
    expect(parseSelectors('[title="hello" i]'))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '=', 'hello', 'i'),
        ),
    ));
});
test(`parseSelectors('[title="hello" I]')`, () => {
    expect(parseSelectors('[title="hello" I]'))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '=', 'hello', 'I'),
        ),
    ));
});
test(`parseSelectors('[title="hello" s]')`, () => {
    expect(parseSelectors('[title="hello" s]'))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '=', 'hello', 's'),
        ),
    ));
});
test(`parseSelectors('[title="hello" S]')`, () => {
    expect(parseSelectors('[title="hello" S]'))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '=', 'hello', 'S'),
        ),
    ));
});
//#endregion test AttrSelector
//#region test AttrSelector with excess spaces
test(`parseSelectors('  [ disabled ]  ')`, () => {
    expect(parseSelectors('  [ disabled ]  '))
    .toEqual(selectorGroup(
        selector(
            attrSelector('disabled'),
        ),
    ));
});

test(`parseSelectors('  [  aria-role  =  "button"  ]  ')`, () => {
    expect(parseSelectors('  [  aria-role  =  "button"  ]  '))
    .toEqual(selectorGroup(
        selector(
            attrSelector('aria-role', '=', 'button'),
        ),
    ));
});
test(`parseSelectors('  [  title  ~=  "hello"  ]  ')`, () => {
    expect(parseSelectors('  [  title  ~=  "hello"  ]  '))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '~=', 'hello'),
        ),
    ));
});
test(`parseSelectors('  [  lang  |=  "en"  ]  ')`, () => {
    expect(parseSelectors('  [  lang  |=  "en"  ]  '))
    .toEqual(selectorGroup(
        selector(
            attrSelector('lang', '|=', 'en'),
        ),
    ));
});
test(`parseSelectors('  [  title  ^=  "hello"  ]  ')`, () => {
    expect(parseSelectors('  [  title  ^=  "hello"  ]  '))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '^=', 'hello'),
        ),
    ));
});
test(`parseSelectors('  [  title  $=  "hello"  ]  ')`, () => {
    expect(parseSelectors('  [  title  $=  "hello"  ]  '))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '$=', 'hello'),
        ),
    ));
});
test(`parseSelectors('  [  title  *=  "hello"  ]  ')`, () => {
    expect(parseSelectors('  [  title  *=  "hello"  ]  '))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '*=', 'hello'),
        ),
    ));
});
test(`parseSelectors('  [  title  =  "hello"   i  ]  ')`, () => {
    expect(parseSelectors('  [  title  =  "hello"   i  ]  '))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '=', 'hello', 'i'),
        ),
    ));
});
test(`parseSelectors('  [  title  =  "hello"   I  ]  ')`, () => {
    expect(parseSelectors('  [  title  =  "hello"   I  ]  '))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '=', 'hello', 'I'),
        ),
    ));
});
test(`parseSelectors('  [  title  =  "hello"   s  ]  ')`, () => {
    expect(parseSelectors('  [  title  =  "hello"   s  ]  '))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '=', 'hello', 's'),
        ),
    ));
});
test(`parseSelectors('  [  title  =  "hello"   S  ]  ')`, () => {
    expect(parseSelectors('  [  title  =  "hello"   S  ]  '))
    .toEqual(selectorGroup(
        selector(
            attrSelector('title', '=', 'hello', 'S'),
        ),
    ));
});
//#endregion test AttrSelector with excess spaces

//#region test NamedSelector
//#region test ElementSelector
test(`parseSelectors('div')`, () => {
    expect(parseSelectors('div'))
    .toEqual(selectorGroup(
        selector(
            elementSelector('div'),
        ),
    ));
});
test(`parseSelectors('span')`, () => {
    expect(parseSelectors('span'))
    .toEqual(selectorGroup(
        selector(
            elementSelector('span'),
        ),
    ));
});
test(`parseSelectors('custom-element')`, () => {
    expect(parseSelectors('custom-element'))
    .toEqual(selectorGroup(
        selector(
            elementSelector('custom-element'),
        ),
    ));
});
//#endregion test ElementSelector
//#region test ElementSelector with excess spaces
test(`parseSelectors('  div  ')`, () => {
    expect(parseSelectors('  div  '))
    .toEqual(selectorGroup(
        selector(
            elementSelector('div'),
        ),
    ));
});
test(`parseSelectors('  span  ')`, () => {
    expect(parseSelectors('  span  '))
    .toEqual(selectorGroup(
        selector(
            elementSelector('span'),
        ),
    ));
});
test(`parseSelectors('  custom-element  ')`, () => {
    expect(parseSelectors('  custom-element  '))
    .toEqual(selectorGroup(
        selector(
            elementSelector('custom-element'),
        ),
    ));
});
//#endregion test ElementSelector with excess spaces

//#region test IdSelector
test(`parseSelectors('#login')`, () => {
    expect(parseSelectors('#login'))
    .toEqual(selectorGroup(
        selector(
            idSelector('login'),
        ),
    ));
});
test(`parseSelectors('#login-form')`, () => {
    expect(parseSelectors('#login-form'))
    .toEqual(selectorGroup(
        selector(
            idSelector('login-form'),
        ),
    ));
});
//#endregion test IdSelector
//#region test IdSelector with excess spaces
test(`parseSelectors('  #login  ')`, () => {
    expect(parseSelectors('  #login  '))
    .toEqual(selectorGroup(
        selector(
            idSelector('login'),
        ),
    ));
});
test(`parseSelectors('  #login-form  ')`, () => {
    expect(parseSelectors('  #login-form  '))
    .toEqual(selectorGroup(
        selector(
            idSelector('login-form'),
        ),
    ));
});
//#endregion test IdSelector with excess spaces

//#region test ClassSelector
test(`parseSelectors('.login')`, () => {
    expect(parseSelectors('.login'))
    .toEqual(selectorGroup(
        selector(
            classSelector('login'),
        ),
    ));
});
test(`parseSelectors('.login-form')`, () => {
    expect(parseSelectors('.login-form'))
    .toEqual(selectorGroup(
        selector(
            classSelector('login-form'),
        ),
    ));
});
//#endregion test ClassSelector
//#region test ClassSelector with excess spaces
test(`parseSelectors('  .login  ')`, () => {
    expect(parseSelectors('  .login  '))
    .toEqual(selectorGroup(
        selector(
            classSelector('login'),
        ),
    ));
});
test(`parseSelectors('  .login-form  ')`, () => {
    expect(parseSelectors('  .login-form  '))
    .toEqual(selectorGroup(
        selector(
            classSelector('login-form'),
        ),
    ));
});
//#endregion test ClassSelector with excess spaces

//#region test PseudoClassSelector
test(`parseSelectors(':disabled')`, () => {
    expect(parseSelectors(':disabled'))
    .toEqual(selectorGroup(
        selector(
            pseudoClassSelector('disabled'),
        ),
    ));
});
test(`parseSelectors(':first-child')`, () => {
    expect(parseSelectors(':first-child'))
    .toEqual(selectorGroup(
        selector(
            pseudoClassSelector('first-child'),
        ),
    ));
});
test(`parseSelectors(':nth-child(2n+3)')`, () => {
    expect(parseSelectors(':nth-child(2n+3)'))
    .toEqual(selectorGroup(
        selector(
            pseudoClassSelector('nth-child', '2n+3'),
        ),
    ));
});
test(`parseSelectors(':foo(2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq)')`, () => {
    expect(parseSelectors(':foo(2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq)'))
    .toEqual(selectorGroup(
        selector(
            pseudoClassSelector('foo', '2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq'),
        ),
    ));
});
['is', 'not', 'where', 'has'].forEach((group) => {
    test(`parseSelectors(':${group}(.great)')`, () => {
        expect(parseSelectors(`:${group}(.great)`))
        .toEqual(selectorGroup(
            selector(
                pseudoClassSelector(group,
                    selectorGroup(
                        selector(
                            classSelector('great'),
                        ),
                    ),
                ),
            ),
        ));
    });
    test(`parseSelectors(':${group}(.great.okay:valid, .awesome)')`, () => {
        expect(parseSelectors(`:${group}(.great.okay:valid, .awesome)`))
        .toEqual(selectorGroup(
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
        ));
    });
    test(`parseSelectors(':${group}(.great .okay>:valid, .awesome+:nth-child(2n+3))')`, () => {
        expect(parseSelectors(`:${group}(.great .okay>:valid, .awesome+:nth-child(2n+3))`))
        .toEqual(selectorGroup(
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
        ));
    });
    ['is', 'not', 'where', 'has'].forEach((group2) => {
        test(`parseSelectors(':${group}(.great, :${group2}(#okay), :${group2}(:valid:first-child>:nth-child(2n+3), ::backdrop))')`, () => {
            expect(parseSelectors(`:${group}(.great, :${group2}(#okay), :${group2}(:valid:first-child>:nth-child(2n+3), ::backdrop))`))
            .toEqual(selectorGroup(
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
            ));
        });
    });
});
//#endregion test PseudoClassSelector
//#region test PseudoClassSelector with excess spaces
test(`parseSelectors('  :disabled  ')`, () => {
    expect(parseSelectors('  :disabled  '))
    .toEqual(selectorGroup(
        selector(
            pseudoClassSelector('disabled'),
        ),
    ));
});
test(`parseSelectors('  :first-child  ')`, () => {
    expect(parseSelectors('  :first-child  '))
    .toEqual(selectorGroup(
        selector(
            pseudoClassSelector('first-child'),
        ),
    ));
});
test(`parseSelectors('  :nth-child(  2n+3  )  ')`, () => {
    expect(parseSelectors('  :nth-child(  2n+3  )  '))
    .toEqual(selectorGroup(
        selector(
            pseudoClassSelector('nth-child', '2n+3'),
        ),
    ));
});
test(`parseSelectors(':foo(  2n  +  (  3a  +  b  )  +  c  +  (  de  +  fg  )  +  (  (  hi  +  (  jk  +  lmn  )  )  )  +  opq  )')`, () => {
    expect(parseSelectors(':foo(  2n  +  (  3a  +  b  )  +  c  +  (  de  +  fg  )  +  (  (  hi  +  (  jk  +  lmn  )  )  )  +  opq  )'))
    .toEqual(selectorGroup(
        selector(
            pseudoClassSelector('foo', '2n+(3a+b)+c+(de+fg)+((hi+(jk+lmn)))+opq'),
        ),
    ));
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
['is', 'not', 'where', 'has'].forEach((group) => {
    test(`parseSelectors('   :${group}(  .great  )  ')`, () => {
        expect(parseSelectors(`   :${group}(  .great  )  `))
        .toEqual(selectorGroup(
            selector(
                pseudoClassSelector(group,
                    selectorGroup(
                        selector(
                            classSelector('great'),
                        ),
                    ),
                ),
            ),
        ));
    });
    test(`parseSelectors('   :${group}(  .great.okay:valid   ,   .awesome  )   ')`, () => {
        expect(parseSelectors(`   :${group}(  .great.okay:valid   ,   .awesome  )   `))
        .toEqual(selectorGroup(
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
        ));
    });
    test(`parseSelectors('   :${group}(  .great   .okay  >  :valid   ,   .awesome  +  :nth-child( 2n + 3 )  )   ')`, () => {
        expect(parseSelectors(`   :${group}(  .great   .okay  >  :valid   ,   .awesome  +  :nth-child( 2n + 3 )  )   `))
        .toEqual(selectorGroup(
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
        ));
    });
    ['is', 'not', 'where', 'has'].forEach((group2) => {
        test(`parseSelectors('   :${group}(  .great   ,   :${group2}(  #okay  )   ,   :${group2}(  :valid:first-child  >  :nth-child( 2n + 3 )   ,   ::backdrop  )  )   ')`, () => {
            expect(parseSelectors(`   :${group}(  .great   ,   :${group2}(  #okay  )   ,   :${group2}(  :valid:first-child  >  :nth-child( 2n + 3 )   ,   ::backdrop  )  )   `))
            .toEqual(selectorGroup(
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
            ));
        });
    });
});
//#endregion test PseudoClassSelector with excess spaces

//#region test PseudoElementSelector
test(`parseSelectors('::backdrop')`, () => {
    expect(parseSelectors('::backdrop'))
    .toEqual(selectorGroup(
        selector(
            pseudoElementSelector('backdrop'),
        ),
    ));
});
test(`parseSelectors('::-boo-foo')`, () => {
    expect(parseSelectors('::-boo-foo'))
    .toEqual(selectorGroup(
        selector(
            pseudoElementSelector('-boo-foo'),
        ),
    ));
});
//#endregion test PseudoElementSelector
//#region test PseudoElementSelector with excess spaces
test(`parseSelectors('  ::backdrop  ')`, () => {
    expect(parseSelectors('  ::backdrop  '))
    .toEqual(selectorGroup(
        selector(
            pseudoElementSelector('backdrop'),
        ),
    ));
});
test(`parseSelectors('  ::-boo-foo  ')`, () => {
    expect(parseSelectors('  ::-boo-foo  '))
    .toEqual(selectorGroup(
        selector(
            pseudoElementSelector('-boo-foo'),
        ),
    ));
});
//#endregion test PseudoElementSelector with excess spaces
//#endregion test NamedSelector
//#endregion test SimpleSelector



//#region test CompositeSelector
test(`parseSelectors('.boo.foo:bleh')`, () => {
    expect(parseSelectors('.boo.foo:bleh'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ));
});
test(`parseSelectors('&.boo.foo:bleh')`, () => {
    expect(parseSelectors('&.boo.foo:bleh'))
    .toEqual(selectorGroup(
        selector(
            parentSelector(),
            classSelector('boo'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ));
});
test(`parseSelectors('.boo&.foo:bleh')`, () => {
    expect(parseSelectors('.boo&.foo:bleh'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            parentSelector(),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ));
});
test(`parseSelectors('.boo&.foo:bleh::meh')`, () => {
    expect(parseSelectors('.boo&.foo:bleh::meh'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            parentSelector(),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
            pseudoElementSelector('meh')
        ),
    ));
});
test(`parseSelectors('.boo&.foo:bleh:nth-child(2n+3)::meh')`, () => {
    expect(parseSelectors('.boo&.foo:bleh:nth-child(2n+3)::meh'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            parentSelector(),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
            pseudoClassSelector('nth-child', '2n+3'),
            pseudoElementSelector('meh')
        ),
    ));
});
//#endregion test CompositeSelector



//#region test Combinator
test(`parseSelectors('.boo .foo:bleh')`, () => {
    expect(parseSelectors('.boo .foo:bleh'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            combinator(' '),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ));
});
test(`parseSelectors('.boo>.foo:bleh')`, () => {
    expect(parseSelectors('.boo>.foo:bleh'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            combinator('>'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ));
});
test(`parseSelectors('.boo~.foo:bleh')`, () => {
    expect(parseSelectors('.boo~.foo:bleh'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            combinator('~'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ));
});
test(`parseSelectors('.boo+.foo:bleh')`, () => {
    expect(parseSelectors('.boo+.foo:bleh'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            combinator('+'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ));
});
test(`parseSelectors('.boo .foo:bleh>:alice~:bob+#charlie')`, () => {
    expect(parseSelectors('.boo .foo:bleh>:alice~:bob+#charlie'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            combinator(' '),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
            combinator('>'),
            pseudoClassSelector('alice'),
            combinator('~'),
            pseudoClassSelector('bob'),
            combinator('+'),
            idSelector('charlie'),
        ),
    ));
});
//#endregion test Combinator
//#region test Combinator with excess spaces
test(`parseSelectors('.boo     .foo:bleh')`, () => {
    expect(parseSelectors('.boo     .foo:bleh'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            combinator(' '),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ));
});
test(`parseSelectors('.boo  >  .foo:bleh')`, () => {
    expect(parseSelectors('.boo  >  .foo:bleh'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            combinator('>'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ));
});
test(`parseSelectors('.boo  ~  .foo:bleh')`, () => {
    expect(parseSelectors('.boo  ~  .foo:bleh'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            combinator('~'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ));
});
test(`parseSelectors('.boo  +  .foo:bleh')`, () => {
    expect(parseSelectors('.boo  +  .foo:bleh'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            combinator('+'),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
        ),
    ));
});
test(`parseSelectors('   .boo   .foo:bleh  >  :alice~:bob  +  #charlie   ')`, () => {
    expect(parseSelectors('   .boo   .foo:bleh  >  :alice~:bob  +  #charlie   '))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            combinator(' '),
            classSelector('foo'),
            pseudoClassSelector('bleh'),
            combinator('>'),
            pseudoClassSelector('alice'),
            combinator('~'),
            pseudoClassSelector('bob'),
            combinator('+'),
            idSelector('charlie'),
        ),
    ));
});
//#endregion test Combinator with excess spaces



//#region test SelectorGroup
test(`parseSelectors('.boo,:foo(a+b),#bleh,::charlie')`, () => {
    expect(parseSelectors('.boo,:foo(a+b),#bleh,::charlie'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
        ),
        selector(
            pseudoClassSelector('foo', 'a+b'),
        ),
        selector(
            idSelector('bleh'),
        ),
        selector(
            pseudoElementSelector('charlie'),
        ),
    ));
});
test(`parseSelectors('.boo:foo(a+b),#bleh,::charlie')`, () => {
    expect(parseSelectors('.boo:foo(a+b),#bleh,::charlie'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            pseudoClassSelector('foo', 'a+b'),
        ),
        selector(
            idSelector('bleh'),
        ),
        selector(
            pseudoElementSelector('charlie'),
        ),
    ));
});
test(`parseSelectors('.boo:foo(a+b)#bleh,::charlie')`, () => {
    expect(parseSelectors('.boo:foo(a+b)#bleh,::charlie'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            pseudoClassSelector('foo', 'a+b'),
            idSelector('bleh'),
        ),
        selector(
            pseudoElementSelector('charlie'),
        ),
    ));
});
test(`parseSelectors('.boo,:foo(a+b)#bleh::charlie')`, () => {
    expect(parseSelectors('.boo,:foo(a+b)#bleh::charlie'))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
        ),
        selector(
            pseudoClassSelector('foo', 'a+b'),
            idSelector('bleh'),
            pseudoElementSelector('charlie'),
        ),
    ));
});
test(`parseSelectors('.boo :foo(a+b)>#bleh,::charlie')`, () => {
    expect(parseSelectors('.boo :foo(a+b)>#bleh,::charlie'))
    .toEqual(selectorGroup(
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
    ));
});
['is', 'not', 'where', 'has'].forEach((group) => {
    test(`parseSelectors('.boo :foo(a+b)>#bleh,::charlie,:${group}(.great)')`, () => {
        expect(parseSelectors(`.boo :foo(a+b)>#bleh,::charlie,:${group}(.great)`))
        .toEqual(selectorGroup(
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
        ));
    });
    test(`parseSelectors('.boo :foo(a+b)>#bleh,::charlie,:${group}(.great.okay:valid, .awesome)')`, () => {
        expect(parseSelectors(`.boo :foo(a+b)>#bleh,::charlie,:${group}(.great.okay:valid, .awesome)`))
        .toEqual(selectorGroup(
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
        ));
    });
    test(`parseSelectors('.boo :foo(a+b)>#bleh,::charlie,:${group}(.great .okay>:valid, .awesome+:nth-child(2n+3))')`, () => {
        expect(parseSelectors(`.boo :foo(a+b)>#bleh,::charlie,:${group}(.great .okay>:valid, .awesome+:nth-child(2n+3))`))
        .toEqual(selectorGroup(
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
        ));
    });
    ['is', 'not', 'where', 'has'].forEach((group2) => {
        test(`parseSelectors('.boo :foo(a+b)>#bleh,::charlie,:${group}(.great, :${group2}(#okay), :${group2}(:valid:first-child>:nth-child(2n+3), ::backdrop))')`, () => {
            expect(parseSelectors(`.boo :foo(a+b)>#bleh,::charlie,:${group}(.great, :${group2}(#okay), :${group2}(:valid:first-child>:nth-child(2n+3), ::backdrop))`))
            .toEqual(selectorGroup(
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
            ));
        });
    });
});
//#endregion test SelectorGroup
//#region test SelectorGroup with excess spaces
test(`parseSelectors('   .boo  ,  :foo( a + b )  ,  #bleh  ,  ::charlie   ')`, () => {
    expect(parseSelectors('   .boo  ,  :foo( a + b )  ,  #bleh  ,  ::charlie   '))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
        ),
        selector(
            pseudoClassSelector('foo', 'a+b'),
        ),
        selector(
            idSelector('bleh'),
        ),
        selector(
            pseudoElementSelector('charlie'),
        ),
    ));
});
test(`parseSelectors('   .boo:foo(a+b)  ,  #bleh  ,  ::charlie   ')`, () => {
    expect(parseSelectors('   .boo:foo(a+b)  ,  #bleh  ,  ::charlie   '))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            pseudoClassSelector('foo', 'a+b'),
        ),
        selector(
            idSelector('bleh'),
        ),
        selector(
            pseudoElementSelector('charlie'),
        ),
    ));
});
test(`parseSelectors('   .boo:foo( a + b )#bleh  ,  ::charlie   ')`, () => {
    expect(parseSelectors('   .boo:foo( a + b )#bleh  ,  ::charlie   '))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
            pseudoClassSelector('foo', 'a+b'),
            idSelector('bleh'),
        ),
        selector(
            pseudoElementSelector('charlie'),
        ),
    ));
});
test(`parseSelectors('   .boo  ,  :foo( a + b )#bleh::charlie   ')`, () => {
    expect(parseSelectors('   .boo  ,  :foo( a + b )#bleh::charlie   '))
    .toEqual(selectorGroup(
        selector(
            classSelector('boo'),
        ),
        selector(
            pseudoClassSelector('foo', 'a+b'),
            idSelector('bleh'),
            pseudoElementSelector('charlie'),
        ),
    ));
});
test(`parseSelectors('   .boo   :foo( a + b )  >  #bleh  ,  ::charlie   ')`, () => {
    expect(parseSelectors('   .boo   :foo( a + b )  >  #bleh  ,  ::charlie   '))
    .toEqual(selectorGroup(
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
    ));
});
['is', 'not', 'where', 'has'].forEach((group) => {
    test(`parseSelectors('   .boo   :foo( a + b )  >  #bleh  ,  ::charlie   ,   :${group}(  .great  )  ')`, () => {
        expect(parseSelectors(`   .boo   :foo( a + b )  >  #bleh  ,  ::charlie   ,   :${group}(  .great  )  `))
        .toEqual(selectorGroup(
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
        ));
    });
    test(`parseSelectors('   .boo   :foo( a + b )  >  #bleh  ,  ::charlie   ,   :${group}(  .great.okay:valid   ,   .awesome  )   ')`, () => {
        expect(parseSelectors(`   .boo   :foo( a + b )  >  #bleh  ,  ::charlie   ,   :${group}(  .great.okay:valid   ,   .awesome  )   `))
        .toEqual(selectorGroup(
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
        ));
    });
    test(`parseSelectors('   .boo   :foo( a + b )  >  #bleh  ,  ::charlie   ,   :${group}(  .great   .okay  >  :valid   ,   .awesome  +  :nth-child( 2n + 3 )  )   ')`, () => {
        expect(parseSelectors(`   .boo   :foo( a + b )  >  #bleh  ,  ::charlie   ,   :${group}(  .great   .okay  >  :valid   ,   .awesome  +  :nth-child( 2n + 3 )  )   `))
        .toEqual(selectorGroup(
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
        ));
    });
    ['is', 'not', 'where', 'has'].forEach((group2) => {
        test(`parseSelectors('   .boo   :foo( a + b )  >  #bleh  ,  ::charlie   ,   :${group}(  .great   ,   :${group2}(  #okay  )   ,   :${group2}(  :valid:first-child  >  :nth-child( 2n + 3 )   ,   ::backdrop  )  )   ')`, () => {
            expect(parseSelectors(`   .boo   :foo( a + b )  >  #bleh  ,  ::charlie   ,   :${group}(  .great   ,   :${group2}(  #okay  )   ,   :${group2}(  :valid:first-child  >  :nth-child( 2n + 3 )   ,   ::backdrop  )  )   `))
            .toEqual(selectorGroup(
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
            ));
        });
    });
});
//#endregion test SelectorGroup with excess spaces
