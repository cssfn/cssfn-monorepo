import {
    supportsHasPseudoClass,
} from '../dist/css-supports.js'



test(`server side: supportsHasPseudoClass()`, () => {
    expect(supportsHasPseudoClass())
    .toBe(true);
});

test(`server side: supportsHasPseudoClass(/*default: */true)`, () => {
    expect(supportsHasPseudoClass(true))
    .toBe(true);
});

test(`server side: supportsHasPseudoClass(/*default: */false)`, () => {
    expect(supportsHasPseudoClass(false))
    .toBe(false);
});
