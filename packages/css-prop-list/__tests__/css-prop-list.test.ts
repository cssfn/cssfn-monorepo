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



standardLonghandProps.forEach((propName) => {
    test(`test isKnownCssProp(standardLonghandProps: ${propName})`, () => {
        expect(
            isKnownCssProp(propName)
        )
        .toBe(true);
    });
});
standardShorthandProps.forEach((propName) => {
    test(`test isKnownCssProp(standardShorthandProps: ${propName})`, () => {
        expect(
            isKnownCssProp(propName)
        )
        .toBe(true);
    });
});



vendorLonghandProps.forEach((propName) => {
    test(`test isKnownCssProp(vendorLonghandProps: ${propName})`, () => {
        expect(
            isKnownCssProp(propName)
        )
        .toBe(true);
    });
});
vendorShorthandProps.forEach((propName) => {
    test(`test isKnownCssProp(vendorShorthandProps: ${propName})`, () => {
        expect(
            isKnownCssProp(propName)
        )
        .toBe(true);
    });
});



const isUppercase  = (test: string) => (test >= 'A') && (test <= 'Z');
obsoleteProps.forEach((propName) => {
    if (propName === 'clip') return;
    
    if (
        (propName.startsWith('Moz')    && isUppercase(propName[3])) // Moz[A-Z]    => always considered valid
        ||
        (propName.startsWith('ms')     && isUppercase(propName[2])) // ms[A-Z]     => always considered valid
        ||
        (propName.startsWith('Webkit') && isUppercase(propName[6])) // Webkit[A-Z] => always considered valid
    ) {
        test(`test isKnownCssProp(obsoleteProps: ${propName})`, () => {
            expect(
                isKnownCssProp(propName)
            )
            .toBe(true);
        });
    }
    else {
        test(`test isKnownCssProp(obsoleteProps: ${propName})`, () => {
            expect(
                isKnownCssProp(propName)
            )
            .toBe(false);
        });
    } // if
});



svgProps.forEach((propName) => {
    test(`test isKnownCssProp(svgProps: ${propName})`, () => {
        expect(
            isKnownCssProp(propName)
        )
        .toBe(true);
    });
});



const shorthandProps : string[] = [
    'foreg',
    'backg',
    'backgClip',
    'anim',
    'transf',
    'gapX',
    'gapY',
    'gapInline',
    'gapBlock',
];
shorthandProps.forEach((propName) => {
    test(`test isKnownCssProp(shorthandProps: ${propName})`, () => {
        expect(
            isKnownCssProp(propName)
        )
        .toBe(true);
    });
});



const strangeProps : string[] = [
    'backgGrad',
    
    'backgThin',
    'backgMild',
    'backgBold',
    'backgOutlined',
    'backgOverwrite',
    
    'backgStart',
    
    'backgBak',
    
    'backgFn',
    'backgImpt',
    'backgCond',
    'backgTg',
    'backgCol',
    
    'backgRefs',
    'backgDecls',
    
    'backg1',
    'backg2',
    'backg3',
    
    'foreground',
    'foregrounds',
    
    'foregThin',
    'foregMild',
    'foregBold',
    'foregOutlined',
    'foregOverwrite',
    
    'foregFn',
    'foregImpt',
    'foregCond',
    'foregTg',
    'foregCol',
    
    'foregRefs',
    'foregDecls',
];
strangeProps.forEach((propName) => {
    test(`test isKnownCssProp(strangeProps: ${propName})`, () => {
        expect(
            isKnownCssProp(propName)
        )
        .toBe(false);
    });
});
