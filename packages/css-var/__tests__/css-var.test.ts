import {
    createCssVar,
    fallbacks,
} from '../src/css-var'



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

test(`createCssVar<TestVars1>() with default options`, () => {
    const [cssVars] = createCssVar<TestVars1>();
    
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

test(`createCssVar<TestVars2>() with default options`, () => {
    const [cssVars] = createCssVar<TestVars2>();
    
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



test(`createCssVar<TestVars1>() with options { prefix: 'btn' }`, () => {
    const [cssVars] = createCssVar<TestVars1>({ prefix: 'btn' });
    
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

test(`createCssVar<TestVars2>() with options { prefix: 'nav' }`, () => {
    const [cssVars] = createCssVar<TestVars2>({ prefix: 'nav' });
    
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



test(`createCssVar<TestVars1>() with options { minify: false }`, () => {
    const [cssVars] = createCssVar<TestVars1>({ minify: false });
    
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--world)`);
        
        expect(cssVars.hello)
        .toBe(`var(--hello)`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--booFoo)`);
    } // for
});

test(`createCssVar<TestVars2>() with options { minify: false }`, () => {
    const [cssVars] = createCssVar<TestVars2>({ minify: false });
    
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--alice)`);
        
        expect(cssVars.bob)
        .toBe(`var(--bob)`);
        
        expect(cssVars.charlie)
        .toBe(`var(--charlie)`);
    } // for
});



test(`createCssVar<TestVars1>() with options { prefix: 'btn', minify: false }`, () => {
    const [cssVars] = createCssVar<TestVars1>({ prefix: 'btn', minify: false });
    
    for (let i = 0; i < 5; i++) {
        expect(cssVars.world)
        .toBe(`var(--btn-world)`);
        
        expect(cssVars.hello)
        .toBe(`var(--btn-hello)`);
        
        expect(cssVars.booFoo)
        .toBe(`var(--btn-booFoo)`);
    } // for
});

test(`createCssVar<TestVars2>() with options { prefix: 'nav', minify: false }`, () => {
    const [cssVars] = createCssVar<TestVars2>({ prefix: 'nav', minify: false });
    
    for (let i = 0; i < 5; i++) {
        expect(cssVars.alice)
        .toBe(`var(--nav-alice)`);
        
        expect(cssVars.bob)
        .toBe(`var(--nav-bob)`);
        
        expect(cssVars.charlie)
        .toBe(`var(--nav-charlie)`);
    } // for
});



test(`createCssVar<TestVars1>() with live options { prefix: 'btn' }`, () => {
    const [cssVars, options] = createCssVar<TestVars1>();
    
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

test(`createCssVar<TestVars2>() with live options { prefix: 'nav' }`, () => {
    const [cssVars, options] = createCssVar<TestVars2>();
    
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



test(`createCssVar<TestVars1>() with live options { minify: false }`, () => {
    const [cssVars, options] = createCssVar<TestVars1>();
    
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

test(`createCssVar<TestVars2>() with live options { minify: false }`, () => {
    const [cssVars, options] = createCssVar<TestVars2>();
    
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



test(`createCssVar<TestVars1>() with live options { prefix: 'btn', minify: false }`, () => {
    const [cssVars, options] = createCssVar<TestVars1>();
    
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

test(`createCssVar<TestVars2>() with live options { prefix: 'nav', minify: false }`, () => {
    const [cssVars, options] = createCssVar<TestVars2>();
    
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
