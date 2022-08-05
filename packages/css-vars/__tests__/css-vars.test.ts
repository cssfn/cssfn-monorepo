import {
    cssVars,
    fallbacks,
} from '../dist/css-vars.js'



interface TestVars1 {
    hello  : any
    world  : any
    booFoo : any
}
interface TestVars2 {
    alice   : any
    bob     : any
    charlie : any
}



let varCounter = 0;

test(`cssVars<TestVars1>() with default options`, () => {
    const [cssVars1] = cssVars<TestVars1>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars1.hello)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--v${var3})`);
    } // for
});

test(`cssVars<TestVars2>() with default options`, () => {
    const [cssVars1] = cssVars<TestVars2>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars1.bob)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--v${var3})`);
    } // for
});



test(`cssVars<TestVars1>() with options { prefix: 'btn' }`, () => {
    const [cssVars1] = cssVars<TestVars1>({ prefix: 'btn' });
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--btn-v${var1})`);
        
        expect(cssVars1.hello)
        .toBe(`var(--btn-v${var2})`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--btn-v${var3})`);
    } // for
});

test(`cssVars<TestVars2>() with options { prefix: 'nav' }`, () => {
    const [cssVars1] = cssVars<TestVars2>({ prefix: 'nav' });
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--nav-v${var1})`);
        
        expect(cssVars1.bob)
        .toBe(`var(--nav-v${var2})`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--nav-v${var3})`);
    } // for
});



test(`cssVars<TestVars1>() with options { minify: false }`, () => {
    const [cssVars1] = cssVars<TestVars1>({ minify: false });
    
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--world)`);
        
        expect(cssVars1.hello)
        .toBe(`var(--hello)`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--booFoo)`);
    } // for
});

test(`cssVars<TestVars2>() with options { minify: false }`, () => {
    const [cssVars1] = cssVars<TestVars2>({ minify: false });
    
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--alice)`);
        
        expect(cssVars1.bob)
        .toBe(`var(--bob)`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--charlie)`);
    } // for
});



test(`cssVars<TestVars1>() with options { prefix: 'btn', minify: false }`, () => {
    const [cssVars1] = cssVars<TestVars1>({ prefix: 'btn', minify: false });
    
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--btn-world)`);
        
        expect(cssVars1.hello)
        .toBe(`var(--btn-hello)`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--btn-booFoo)`);
    } // for
});

test(`cssVars<TestVars2>() with options { prefix: 'nav', minify: false }`, () => {
    const [cssVars1] = cssVars<TestVars2>({ prefix: 'nav', minify: false });
    
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--nav-alice)`);
        
        expect(cssVars1.bob)
        .toBe(`var(--nav-bob)`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--nav-charlie)`);
    } // for
});



test(`cssVars<TestVars1>() with live options { prefix: 'btn' }`, () => {
    const [cssVars1, options] = cssVars<TestVars1>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars1.hello)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'btn';
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--btn-v${var1})`);
        
        expect(cssVars1.hello)
        .toBe(`var(--btn-v${var2})`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--btn-v${var3})`);
    } // for
    
    options.prefix = '';
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars1.hello)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'button';
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--button-v${var1})`);
        
        expect(cssVars1.hello)
        .toBe(`var(--button-v${var2})`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--button-v${var3})`);
    } // for
});

test(`cssVars<TestVars2>() with live options { prefix: 'nav' }`, () => {
    const [cssVars1, options] = cssVars<TestVars2>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars1.bob)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'nav';
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--nav-v${var1})`);
        
        expect(cssVars1.bob)
        .toBe(`var(--nav-v${var2})`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--nav-v${var3})`);
    } // for
    
    options.prefix = '';
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars1.bob)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'navigation';
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--navigation-v${var1})`);
        
        expect(cssVars1.bob)
        .toBe(`var(--navigation-v${var2})`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--navigation-v${var3})`);
    } // for
});



test(`cssVars<TestVars1>() with live options { minify: false }`, () => {
    const [cssVars1, options] = cssVars<TestVars1>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars1.hello)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--world)`);
        
        expect(cssVars1.hello)
        .toBe(`var(--hello)`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--booFoo)`);
    } // for
    
    options.minify = true;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars1.hello)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--world)`);
        
        expect(cssVars1.hello)
        .toBe(`var(--hello)`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--booFoo)`);
    } // for
});

test(`cssVars<TestVars2>() with live options { minify: false }`, () => {
    const [cssVars1, options] = cssVars<TestVars2>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars1.bob)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--alice)`);
        
        expect(cssVars1.bob)
        .toBe(`var(--bob)`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--charlie)`);
    } // for
    
    options.minify = true;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars1.bob)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--alice)`);
        
        expect(cssVars1.bob)
        .toBe(`var(--bob)`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--charlie)`);
    } // for
});



test(`cssVars<TestVars1>() with live options { prefix: 'btn', minify: false }`, () => {
    const [cssVars1, options] = cssVars<TestVars1>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars1.hello)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'btn';
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--btn-world)`);
        
        expect(cssVars1.hello)
        .toBe(`var(--btn-hello)`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--btn-booFoo)`);
    } // for
    
    options.prefix = '';
    options.minify = true;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars1.hello)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'btn';
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.world)
        .toBe(`var(--btn-world)`);
        
        expect(cssVars1.hello)
        .toBe(`var(--btn-hello)`);
        
        expect(cssVars1.booFoo)
        .toBe(`var(--btn-booFoo)`);
    } // for
});

test(`cssVars<TestVars2>() with live options { prefix: 'nav', minify: false }`, () => {
    const [cssVars1, options] = cssVars<TestVars2>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars1.bob)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'nav';
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--nav-alice)`);
        
        expect(cssVars1.bob)
        .toBe(`var(--nav-bob)`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--nav-charlie)`);
    } // for
    
    options.prefix = '';
    options.minify = true;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars1.bob)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'nav';
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars1.alice)
        .toBe(`var(--nav-alice)`);
        
        expect(cssVars1.bob)
        .toBe(`var(--nav-bob)`);
        
        expect(cssVars1.charlie)
        .toBe(`var(--nav-charlie)`);
    } // for
});



test(`fallbacks()`, () => {
    const [cssVars1] = cssVars<TestVars2>({ minify: false });
    
    expect(
        fallbacks(
            cssVars1.alice
        )
    )
    .toBe(
        `var(--alice)`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            cssVars1.bob
        )
    )
    .toBe(
        `var(--alice, var(--bob))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            cssVars1.bob,
            cssVars1.charlie
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie)))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            false,
            true,
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie)))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            false,
            true,
            123
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, 123)))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            false,
            true,
            'yeah'
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, yeah)))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            false,
            true,
            '"yeah"'
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, "yeah")))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            false,
            true,
            [['solid', '1px', 'black']]
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, solid 1px black)))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            false,
            true,
            [['solid', '1px', 'black'], '!important']
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, solid 1px black))) !important`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            false,
            true,
            ['"Arial Black"', '"Georgia"', 'serif']
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, "Arial Black", "Georgia", serif)))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            false,
            true,
            ['"Arial Black"', '"Georgia"', 'serif', '!important']
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, "Arial Black", "Georgia", serif))) !important`
    );
});

test(`fallbacks(fallbacks())`, () => {
    const [cssVars1] = cssVars<TestVars2>({ minify: false });
    const [cssVars2] = cssVars<TestVars1>({ minify: false });
    
    expect(
        fallbacks(
            cssVars1.alice,
            fallbacks(
                cssVars2.hello,
                cssVars2.world,
                cssVars2.booFoo,
                cssVars1.bob
            )
        )
    )
    .toBe(
        `var(--alice, var(--hello, var(--world, var(--booFoo, var(--bob)))))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            fallbacks(
                cssVars2.hello,
                cssVars2.world,
                cssVars2.booFoo,
                cssVars1.bob
            ),
            cssVars1.charlie
        )
    )
    .toBe(
        `var(--alice, var(--hello, var(--world, var(--booFoo, var(--bob, var(--charlie))))))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            cssVars1.bob,
            cssVars1.charlie,
            fallbacks(
                cssVars2.hello,
                cssVars2.world,
                cssVars2.booFoo,
                cssVars1.bob
            ),
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, var(--hello, var(--world, var(--booFoo, var(--bob)))))))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            true,
            fallbacks(
                cssVars2.hello,
                false,
                cssVars2.world,
                undefined,
                cssVars2.booFoo,
                null,
                cssVars1.bob
            ),
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, var(--hello, var(--world, var(--booFoo, var(--bob)))))))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            true,
            fallbacks(
                cssVars2.hello,
                false,
                cssVars2.world,
                undefined,
                cssVars2.booFoo,
                null,
                cssVars1.bob,
                123.45
            ),
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, var(--hello, var(--world, var(--booFoo, var(--bob, 123.45)))))))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            true,
            fallbacks(
                cssVars2.hello,
                false,
                cssVars2.world,
                undefined,
                cssVars2.booFoo,
                null,
                cssVars1.bob,
                'inherit'
            ),
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, var(--hello, var(--world, var(--booFoo, var(--bob, inherit)))))))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            true,
            fallbacks(
                cssVars2.hello,
                false,
                cssVars2.world,
                undefined,
                cssVars2.booFoo,
                null,
                cssVars1.bob,
                '"wow"'
            ),
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, var(--hello, var(--world, var(--booFoo, var(--bob, "wow")))))))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            true,
            fallbacks(
                cssVars2.hello,
                false,
                cssVars2.world,
                undefined,
                cssVars2.booFoo,
                null,
                cssVars1.bob,
                [['solid', '1px', 'black']]
            ),
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, var(--hello, var(--world, var(--booFoo, var(--bob, solid 1px black)))))))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            true,
            fallbacks(
                cssVars2.hello,
                false,
                cssVars2.world,
                undefined,
                cssVars2.booFoo,
                null,
                cssVars1.bob,
                [['solid', '1px', 'black'], '!important']
            ),
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, var(--hello, var(--world, var(--booFoo, var(--bob, solid 1px black))))))) !important`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            true,
            fallbacks(
                cssVars2.hello,
                false,
                cssVars2.world,
                undefined,
                cssVars2.booFoo,
                null,
                cssVars1.bob,
                ['"Arial Black"', '"Georgia"', 'serif']
            ),
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, var(--hello, var(--world, var(--booFoo, var(--bob, "Arial Black", "Georgia", serif)))))))`
    );
    
    expect(
        fallbacks(
            cssVars1.alice,
            undefined,
            cssVars1.bob,
            null,
            cssVars1.charlie,
            true,
            fallbacks(
                cssVars2.hello,
                false,
                cssVars2.world,
                undefined,
                cssVars2.booFoo,
                null,
                cssVars1.bob,
                ['"Arial Black"', '"Georgia"', 'serif', '!important']
            ),
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie, var(--hello, var(--world, var(--booFoo, var(--bob, "Arial Black", "Georgia", serif))))))) !important`
    );
});
