import {
    cssConfig,
    usesCssProps,
} from '../dist/css-config.js'

import {
    cssKnownStandardLonghandProps,
    cssKnownStandardShorthandProps,
    cssKnownVendorLonghandProps,
    cssKnownVendorShorthandProps,
    cssKnownObsoleteProps,
    cssKnownSvgProps,
}                           from '@cssfn/css-prop-list/dist/known-css-props.js'



cssKnownStandardLonghandProps.forEach((propName) => {
    test(`test usesCssProps(standardLonghandProps: ${propName})`, () => {
        const [cssProps] = cssConfig({
            [propName]: 'unset',
        });
        expect(
            usesCssProps(cssProps)
        )
        .toEqual({
            [propName]: `var(--${propName})`,
        });
    });
    test(`test usesCssProps(standardLonghandProps: ${propName})`, () => {
        const [cssProps] = cssConfig({
            [propName]: 'unset',
        }, { prefix: 'boo' });
        expect(
            usesCssProps(cssProps)
        )
        .toEqual({
            [propName]: `var(--boo-${propName})`,
        });
    });
});
cssKnownStandardShorthandProps.forEach((propName) => {
    test(`test usesCssProps(standardShorthandProps: ${propName})`, () => {
        const [cssProps] = cssConfig({
            [propName]: 'unset',
        });
        expect(
            usesCssProps(cssProps)
        )
        .toEqual({
            [propName]: `var(--${propName})`,
        });
    });
    test(`test usesCssProps(standardShorthandProps: ${propName})`, () => {
        const [cssProps] = cssConfig({
            [propName]: 'unset',
        }, { prefix: 'boo' });
        expect(
            usesCssProps(cssProps)
        )
        .toEqual({
            [propName]: `var(--boo-${propName})`,
        });
    });
});



cssKnownVendorLonghandProps.forEach((propName) => {
    test(`test usesCssProps(vendorLonghandProps: ${propName})`, () => {
        const [cssProps] = cssConfig({
            [propName]: 'unset',
        });
        expect(
            usesCssProps(cssProps)
        )
        .toEqual({
            [propName]: `var(--${propName})`,
        });
    });
    test(`test usesCssProps(vendorLonghandProps: ${propName})`, () => {
        const [cssProps] = cssConfig({
            [propName]: 'unset',
        }, { prefix: 'boo' });
        expect(
            usesCssProps(cssProps)
        )
        .toEqual({
            [propName]: `var(--boo-${propName})`,
        });
    });
});
cssKnownVendorShorthandProps.forEach((propName) => {
    test(`test usesCssProps(vendorShorthandProps: ${propName})`, () => {
        const [cssProps] = cssConfig({
            [propName]: 'unset',
        });
        expect(
            usesCssProps(cssProps)
        )
        .toEqual({
            [propName]: `var(--${propName})`,
        });
    });
    test(`test usesCssProps(vendorShorthandProps: ${propName})`, () => {
        const [cssProps] = cssConfig({
            [propName]: 'unset',
        }, { prefix: 'boo' });
        expect(
            usesCssProps(cssProps)
        )
        .toEqual({
            [propName]: `var(--boo-${propName})`,
        });
    });
});



const isUppercase  = (test: string) => (test >= 'A') && (test <= 'Z');
cssKnownObsoleteProps.forEach((propName) => {
    if (propName === 'clip') return;
    
    if (
        (propName.startsWith('Moz')    && isUppercase(propName[3])) // Moz[A-Z]    => always considered valid
        ||
        (propName.startsWith('ms')     && isUppercase(propName[2])) // ms[A-Z]     => always considered valid
        ||
        (propName.startsWith('Webkit') && isUppercase(propName[6])) // Webkit[A-Z] => always considered valid
    ) {
        test(`test usesCssProps(obsoleteProps: ${propName})`, () => {
            const [cssProps] = cssConfig({
                [propName]: 'unset',
            });
            expect(
                usesCssProps(cssProps)
            )
            .toEqual({
                [propName]: `var(--${propName})`,
            });
        });
        test(`test usesCssProps(obsoleteProps: ${propName})`, () => {
            const [cssProps] = cssConfig({
                [propName]: 'unset',
            }, { prefix: 'boo' });
            expect(
                usesCssProps(cssProps)
            )
            .toEqual({
                [propName]: `var(--boo-${propName})`,
            });
        });
    }
    else {
        test(`test usesCssProps(obsoleteProps: ${propName})`, () => {
            const [cssProps] = cssConfig({
                [propName]: 'unset',
            });
            expect(
                usesCssProps(cssProps)
            )
            .toEqual({
                /* empty */
            });
        });
        test(`test usesCssProps(obsoleteProps: ${propName})`, () => {
            const [cssProps] = cssConfig({
                [propName]: 'unset',
            }, { prefix: 'boo' });
            expect(
                usesCssProps(cssProps)
            )
            .toEqual({
                /* empty */
            });
        });
    } // if
});



cssKnownSvgProps.forEach((propName) => {
    test(`test usesCssProps(svgProps: ${propName})`, () => {
        const [cssProps] = cssConfig({
            [propName]: 'unset',
        });
        expect(
            usesCssProps(cssProps)
        )
        .toEqual({
            [propName]: `var(--${propName})`,
        });
    });
    test(`test usesCssProps(svgProps: ${propName})`, () => {
        const [cssProps] = cssConfig({
            [propName]: 'unset',
        }, { prefix: 'boo' });
        expect(
            usesCssProps(cssProps)
        )
        .toEqual({
            [propName]: `var(--boo-${propName})`,
        });
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
    test(`test usesCssProps(shorthandProps: ${propName})`, () => {
        const [cssProps] = cssConfig({
            [propName]: 'unset',
        });
        expect(
            usesCssProps(cssProps)
        )
        .toEqual({
            [propName]: `var(--${propName})`,
        });
    });
    test(`test usesCssProps(shorthandProps: ${propName})`, () => {
        const [cssProps] = cssConfig({
            [propName]: 'unset',
        }, { prefix: 'boo' });
        expect(
            usesCssProps(cssProps)
        )
        .toEqual({
            [propName]: `var(--boo-${propName})`,
        });
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
    
    // 'foreground',
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
    
    'borderRadiusSm',
    'borderRadiusLg',
    
    'paddingInlineSm',
    'paddingBlockSm',
    'paddingInlineLg',
    'paddingBlockLg',
    
    'fontSizeSm',
    'fontSizeLg',
    
    'transDuration',
    
    'filterExcited',
    'animExcited',

    'filterDisable',
    'filterActive',
    'animEnable',
    'animDisable',
    'animActive',
    'animPassive',
    
    'cursorDisable',
    'boxShadowFocus',
    'filterArrive',
    
    'animFocus',
    'animBlur',
    'animArrive',
    'animLeave',
    
    'keyframesValid',
    'keyframesUnvalid',
    'keyframesInvalid',
    'keyframesUninvalid',
    'animValid',
    'animUnvalid',
    'animInvalid',
    'animUninvalid',
    
    'keyframesPress',
    'keyframesRelease',
    'filterPress',
    'animPress',
    'animRelease',
    
    'iconSize',
    'iconValid',
    'iconInvalid',
    
    'img',
    'switchImg',
    
    'filterCheck',
    'filterClear',
    'transfCheck',
    'transfClear',
    'animCheck',
    'animClear',
    
    'switchFilterCheck',
    'switchFilterClear',
    'switchTransfCheck',
    'switchTransfClear',
    'switchAnimCheck',
    'switchAnimClear',
    
    'gapInlineSm',
    'gapBlockSm',
    'gapInlineLg',
    'gapBlockLg',
    
    'ghostOpacity',
    'ghostOpacityArrive',
];
strangeProps.forEach((propName) => {
    test(`test usesCssProps(strangeProps: ${propName})`, () => {
        const [cssProps] = cssConfig({
            [propName]: 'unset',
        });
        expect(
            usesCssProps(cssProps)
        )
        .toEqual({
            /* empty */
        });
    });
    test(`test usesCssProps(strangeProps: ${propName})`, () => {
        const [cssProps] = cssConfig({
            [propName]: 'unset',
        }, { prefix: 'boo' });
        expect(
            usesCssProps(cssProps)
        )
        .toEqual({
            /* empty */
        });
    });
});
