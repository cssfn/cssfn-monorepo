import {
    createCssVar,
    fallbacks,
} from '../src/css-var'



interface TestVars {
    hello  : any
    world  : any
    booFoo : any
}



test(`createCssVar() with default options`, () => {
    const [cssVars] = createCssVar<TestVars>();
    
    expect(cssVars.world)
    .toBe(`var(--v1)`);
    
    expect(cssVars.hello)
    .toBe(`var(--v2)`);
    
    expect(cssVars.booFoo)
    .toBe(`var(--v3)`);
});