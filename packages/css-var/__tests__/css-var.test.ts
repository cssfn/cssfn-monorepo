import {
    cssVar,
    fallbacks,
} from '../dist/css-var.js'



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

test(`cssVar<TestVars1>() with default options`, () => {
    const [cssVars] = cssVar<TestVars1>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars.hello)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--v${var3})`);
    } // for
});

test(`cssVar<TestVars2>() with default options`, () => {
    const [cssVars] = cssVar<TestVars2>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars.bob)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars.charlie)
        .toBe(`var(--v${var3})`);
    } // for
});



test(`cssVar<TestVars1>() with options { prefix: 'btn' }`, () => {
    const [cssVars] = cssVar<TestVars1>({ prefix: 'btn' });
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--btn-v${var1})`);
        
        expect(cssVars.hello)
        .toBe(`var(--btn-v${var2})`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--btn-v${var3})`);
    } // for
});

test(`cssVar<TestVars2>() with options { prefix: 'nav' }`, () => {
    const [cssVars] = cssVar<TestVars2>({ prefix: 'nav' });
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--nav-v${var1})`);
        
        expect(cssVars.bob)
        .toBe(`var(--nav-v${var2})`);
        
        expect(cssVars.charlie)
        .toBe(`var(--nav-v${var3})`);
    } // for
});



test(`cssVar<TestVars1>() with options { minify: false }`, () => {
    const [cssVars] = cssVar<TestVars1>({ minify: false });
    
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--world)`);
        
        expect(cssVars.hello)
        .toBe(`var(--hello)`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--booFoo)`);
    } // for
});

test(`cssVar<TestVars2>() with options { minify: false }`, () => {
    const [cssVars] = cssVar<TestVars2>({ minify: false });
    
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--alice)`);
        
        expect(cssVars.bob)
        .toBe(`var(--bob)`);
        
        expect(cssVars.charlie)
        .toBe(`var(--charlie)`);
    } // for
});



test(`cssVar<TestVars1>() with options { prefix: 'btn', minify: false }`, () => {
    const [cssVars] = cssVar<TestVars1>({ prefix: 'btn', minify: false });
    
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--btn-world)`);
        
        expect(cssVars.hello)
        .toBe(`var(--btn-hello)`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--btn-booFoo)`);
    } // for
});

test(`cssVar<TestVars2>() with options { prefix: 'nav', minify: false }`, () => {
    const [cssVars] = cssVar<TestVars2>({ prefix: 'nav', minify: false });
    
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--nav-alice)`);
        
        expect(cssVars.bob)
        .toBe(`var(--nav-bob)`);
        
        expect(cssVars.charlie)
        .toBe(`var(--nav-charlie)`);
    } // for
});



test(`cssVar<TestVars1>() with live options { prefix: 'btn' }`, () => {
    const [cssVars, options] = cssVar<TestVars1>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars.hello)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'btn';
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--btn-v${var1})`);
        
        expect(cssVars.hello)
        .toBe(`var(--btn-v${var2})`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--btn-v${var3})`);
    } // for
    
    options.prefix = '';
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars.hello)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'button';
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--button-v${var1})`);
        
        expect(cssVars.hello)
        .toBe(`var(--button-v${var2})`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--button-v${var3})`);
    } // for
});

test(`cssVar<TestVars2>() with live options { prefix: 'nav' }`, () => {
    const [cssVars, options] = cssVar<TestVars2>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars.bob)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars.charlie)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'nav';
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--nav-v${var1})`);
        
        expect(cssVars.bob)
        .toBe(`var(--nav-v${var2})`);
        
        expect(cssVars.charlie)
        .toBe(`var(--nav-v${var3})`);
    } // for
    
    options.prefix = '';
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars.bob)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars.charlie)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'navigation';
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--navigation-v${var1})`);
        
        expect(cssVars.bob)
        .toBe(`var(--navigation-v${var2})`);
        
        expect(cssVars.charlie)
        .toBe(`var(--navigation-v${var3})`);
    } // for
});



test(`cssVar<TestVars1>() with live options { minify: false }`, () => {
    const [cssVars, options] = cssVar<TestVars1>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars.hello)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--world)`);
        
        expect(cssVars.hello)
        .toBe(`var(--hello)`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--booFoo)`);
    } // for
    
    options.minify = true;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars.hello)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--world)`);
        
        expect(cssVars.hello)
        .toBe(`var(--hello)`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--booFoo)`);
    } // for
});

test(`cssVar<TestVars2>() with live options { minify: false }`, () => {
    const [cssVars, options] = cssVar<TestVars2>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars.bob)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars.charlie)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--alice)`);
        
        expect(cssVars.bob)
        .toBe(`var(--bob)`);
        
        expect(cssVars.charlie)
        .toBe(`var(--charlie)`);
    } // for
    
    options.minify = true;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars.bob)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars.charlie)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--alice)`);
        
        expect(cssVars.bob)
        .toBe(`var(--bob)`);
        
        expect(cssVars.charlie)
        .toBe(`var(--charlie)`);
    } // for
});



test(`cssVar<TestVars1>() with live options { prefix: 'btn', minify: false }`, () => {
    const [cssVars, options] = cssVar<TestVars1>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars.hello)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'btn';
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--btn-world)`);
        
        expect(cssVars.hello)
        .toBe(`var(--btn-hello)`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--btn-booFoo)`);
    } // for
    
    options.prefix = '';
    options.minify = true;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars.hello)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'btn';
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--btn-world)`);
        
        expect(cssVars.hello)
        .toBe(`var(--btn-hello)`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--btn-booFoo)`);
    } // for
});

test(`cssVar<TestVars2>() with live options { prefix: 'nav', minify: false }`, () => {
    const [cssVars, options] = cssVar<TestVars2>();
    
    const var1 = ++varCounter, var2 = ++varCounter, var3 = ++varCounter;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars.bob)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars.charlie)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'nav';
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--nav-alice)`);
        
        expect(cssVars.bob)
        .toBe(`var(--nav-bob)`);
        
        expect(cssVars.charlie)
        .toBe(`var(--nav-charlie)`);
    } // for
    
    options.prefix = '';
    options.minify = true;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--v${var1})`);
        
        expect(cssVars.bob)
        .toBe(`var(--v${var2})`);
        
        expect(cssVars.charlie)
        .toBe(`var(--v${var3})`);
    } // for
    
    options.prefix = 'nav';
    options.minify = false;
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--nav-alice)`);
        
        expect(cssVars.bob)
        .toBe(`var(--nav-bob)`);
        
        expect(cssVars.charlie)
        .toBe(`var(--nav-charlie)`);
    } // for
});



test(`fallbacks()`, () => {
    const [cssVars] = cssVar<TestVars2>({ minify: false });
    
    expect(
        fallbacks(
            cssVars.alice
        )
    )
    .toBe(
        `var(--alice)`
    );
    
    expect(
        fallbacks(
            cssVars.alice,
            cssVars.bob
        )
    )
    .toBe(
        `var(--alice, var(--bob))`
    );
    
    expect(
        fallbacks(
            cssVars.alice,
            cssVars.bob,
            cssVars.charlie
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie)))`
    );
    
    expect(
        fallbacks(
            cssVars.alice,
            undefined,
            cssVars.bob,
            null,
            cssVars.charlie,
            false,
            true,
        )
    )
    .toBe(
        `var(--alice, var(--bob, var(--charlie)))`
    );
});

test(`fallbacks(fallbacks())`, () => {
    const [cssVars1] = cssVar<TestVars2>({ minify: false });
    const [cssVars2] = cssVar<TestVars1>({ minify: false });
    
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
});
