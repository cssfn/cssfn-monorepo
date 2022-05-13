import {
    isKnownCssProp,
} from '../dist/css-prop-list.js'

import {
    standardLonghandProps,
    standardShorthandProps,
    vendorLonghandProps,
    vendorShorthandProps,
    obsoleteProps,
    svgProps,
}                           from '../dist/known-css-props.js'



standardLonghandProps.forEach((prop) => {
    test(`test isKnownCssProp(standardLonghandProps: ${prop})`, () => {
        expect(
            isKnownCssProp(prop)
        )
        .toBe(true);
    });
});
standardShorthandProps.forEach((prop) => {
    test(`test isKnownCssProp(standardShorthandProps: ${prop})`, () => {
        expect(
            isKnownCssProp(prop)
        )
        .toBe(true);
    });
});



vendorLonghandProps.forEach((prop) => {
    test(`test isKnownCssProp(vendorLonghandProps: ${prop})`, () => {
        expect(
            isKnownCssProp(prop)
        )
        .toBe(true);
    });
});
vendorShorthandProps.forEach((prop) => {
    test(`test isKnownCssProp(vendorShorthandProps: ${prop})`, () => {
        expect(
            isKnownCssProp(prop)
        )
        .toBe(true);
    });
});



obsoleteProps.forEach((prop) => {
    if (prop === 'clip') return;
    
    test(`test isKnownCssProp(obsoleteProps: ${prop})`, () => {
        expect(
            isKnownCssProp(prop)
        )
        .toBe(false);
    });
});



svgProps.forEach((prop) => {
    test(`test isKnownCssProp(svgProps: ${prop})`, () => {
        expect(
            isKnownCssProp(prop)
        )
        .toBe(true);
    });
});
