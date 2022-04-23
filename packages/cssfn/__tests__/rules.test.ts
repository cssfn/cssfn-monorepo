import type {
    CssStyle,
} from '@cssfn/css-types'
import {
    mergeStyles,
} from '../src/mergeStyles'
import {
    rule,
    rules,
} from '../src/cssfn'
import {
    isFinalSelector,
} from '../src/utilities'



const firstSelectorOf = (style: CssStyle|null): string|null => {
    if (!style) return null;
    const symbolProp = Object.getOwnPropertySymbols(style)[0];
    if (symbolProp === undefined) return null;
    const [selector] = style[symbolProp];
    return isFinalSelector(selector) ? selector : null;
}



//#region test rules with single-selector
test(`rules([single-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('.menu', {
            color: 'red',
        })
    ]))))
    .toBe(
        '&.menu'
    );
});

test(`rules([single-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('.menu:first-child', {
            color: 'red',
        })
    ]))))
    .toBe(
        '&.menu:first-child'
    );
});

test(`rules([single-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('div:hover', {
            color: 'red',
        })
    ]))))
    .toBe(
        '&div:hover'
    );
});

test(`rules([single-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('::backdrop:hover', {
            color: 'red',
        })
    ]))))
    .toBe(
        '&::backdrop:hover'
    );
});
//#endregion test rules with single-selector



//#region test rules with multi-selectors
test(`rules([some-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '.ads'], {
            color: 'red',
        })
    ]))))
    .toBe(
        '&:is(.menu, .ads)'
    );
});

test(`rules([some-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu:first-child', '.ads:hover'], {
            color: 'red',
        })
    ]))))
    .toBe(
        '&:is(.menu:first-child, .ads:hover)'
    );
});

test(`rules([some-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['div:first-child', '.ads:hover'], {
            color: 'red',
        })
    ]))))
    .toBe(
        '&:is(div:first-child, .ads:hover)'
    );
});

test(`rules([some-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '::backdrop'], {
            color: 'red',
        })
    ]))))
    .toBe(
        '&.menu, &::backdrop'
    );
});

test(`rules([some-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '::backdrop:hover'], {
            color: 'red',
        })
    ]))))
    .toBe(
        '&.menu, &::backdrop:hover'
    );
});
//#endregion test rules with multi-selectors



//#region test rules with single-selector + adjust specificity
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('.menu', {
            color: 'red',
        })
    ], { specificityWeight: 5 }))))
    .toBe(
        '&.menu.menu.menu.menu.menu'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('.menu', {
            color: 'red',
        })
    ], { specificityWeight: 0 }))))
    .toBe(
        '&:where(.menu)'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('.menu', {
            color: 'red',
        })
    ], { minSpecificityWeight: 3 }))))
    .toBe(
        '&.menu.menu.menu'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('.menu', {
            color: 'red',
        })
    ], { maxSpecificityWeight: 3 }))))
    .toBe(
        '&.menu'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('.menu', {
            color: 'red',
        })
    ], { minSpecificityWeight: 0, maxSpecificityWeight: 3 }))))
    .toBe(
        '&.menu'
    );
});

test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('.menu:first-child', {
            color: 'red',
        })
    ], { specificityWeight: 5 }))))
    .toBe(
        '&.menu:first-child:first-child:first-child:first-child'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('.menu:first-child', {
            color: 'red',
        })
    ], { specificityWeight: 0 }))))
    .toBe(
        '&:where(.menu:first-child)'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('.menu:first-child', {
            color: 'red',
        })
    ], { minSpecificityWeight: 3 }))))
    .toBe(
        '&.menu:first-child:first-child'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('.menu:first-child', {
            color: 'red',
        })
    ], { maxSpecificityWeight: 3 }))))
    .toBe(
        '&.menu:first-child'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('.menu:first-child', {
            color: 'red',
        })
    ], { minSpecificityWeight: 0, maxSpecificityWeight: 3 }))))
    .toBe(
        '&.menu:first-child'
    );
});

test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('div:hover', {
            color: 'red',
        })
    ], { specificityWeight: 5 }))))
    .toBe(
        '&div:hover:hover:hover:hover:hover'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('div:hover', {
            color: 'red',
        })
    ], { specificityWeight: 0 }))))
    .toBe(
        '&div:where(:hover)'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('div:hover', {
            color: 'red',
        })
    ], { minSpecificityWeight: 5 }))))
    .toBe(
        '&div:hover:hover:hover:hover:hover'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('div:hover', {
            color: 'red',
        })
    ], { maxSpecificityWeight: 5 }))))
    .toBe(
        '&div:hover'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('div:hover', {
            color: 'red',
        })
    ], { minSpecificityWeight: 0, maxSpecificityWeight: 3 }))))
    .toBe(
        '&div:hover'
    );
});

test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('::backdrop:hover', {
            color: 'red',
        })
    ], { specificityWeight: 5 }))))
    .toBe(
        '&::backdrop:hover:hover:hover:hover:hover'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('::backdrop:hover', {
            color: 'red',
        })
    ], { specificityWeight: 0 }))))
    .toBe(
        '&::backdrop:where(:hover)'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('::backdrop:hover', {
            color: 'red',
        })
    ], { minSpecificityWeight: 3 }))))
    .toBe(
        '&::backdrop:hover:hover:hover'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('::backdrop:hover', {
            color: 'red',
        })
    ], { maxSpecificityWeight: 3 }))))
    .toBe(
        '&::backdrop:hover'
    );
});
test(`rules([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule('::backdrop:hover', {
            color: 'red',
        })
    ], { minSpecificityWeight: 0, maxSpecificityWeight: 3 }))))
    .toBe(
        '&::backdrop:hover'
    );
});
//#endregion test rules with single-selector + adjust specificity



//#region test rules with multi-selectors + adjust specificity
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '.ads'], {
            color: 'red',
        })
    ], { specificityWeight: 5 }))))
    .toBe(
        '&:is(.menu, .ads):nth-child(n):nth-child(n):nth-child(n):nth-child(n)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '.ads'], {
            color: 'red',
        })
    ], { specificityWeight: 0 }))))
    .toBe(
        '&:where(.menu, .ads)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '.ads'], {
            color: 'red',
        })
    ], { minSpecificityWeight: 3 }))))
    .toBe(
        '&:is(.menu, .ads):nth-child(n):nth-child(n)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '.ads'], {
            color: 'red',
        })
    ], { maxSpecificityWeight: 3 }))))
    .toBe(
        '&:is(.menu, .ads)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '.ads'], {
            color: 'red',
        })
    ], { minSpecificityWeight: 0, maxSpecificityWeight: 3 }))))
    .toBe(
        '&:is(.menu, .ads)'
    );
});

test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu:first-child', '.ads:hover'], {
            color: 'red',
        })
    ], { specificityWeight: 5 }))))
    .toBe(
        '&:is(.menu:first-child, .ads:hover):nth-child(n):nth-child(n):nth-child(n)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu:first-child', '.ads:hover'], {
            color: 'red',
        })
    ], { specificityWeight: 0 }))))
    .toBe(
        '&:where(.menu:first-child, .ads:hover)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu:first-child', '.ads:hover'], {
            color: 'red',
        })
    ], { minSpecificityWeight: 3 }))))
    .toBe(
        '&:is(.menu:first-child, .ads:hover):nth-child(n)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu:first-child', '.ads:hover'], {
            color: 'red',
        })
    ], { maxSpecificityWeight: 3 }))))
    .toBe(
        '&:is(.menu:first-child, .ads:hover)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu:first-child', '.ads:hover'], {
            color: 'red',
        })
    ], { minSpecificityWeight: 0, maxSpecificityWeight: 3 }))))
    .toBe(
        '&:is(.menu:first-child, .ads:hover)'
    );
});

test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['div:first-child', '.ads:hover'], {
            color: 'red',
        })
    ], { specificityWeight: 5 }))))
    .toBe(
        '&:is(div:first-child, .ads:hover):nth-child(n):nth-child(n):nth-child(n)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['div:first-child', '.ads:hover'], {
            color: 'red',
        })
    ], { specificityWeight: 0 }))))
    .toBe(
        '&:where(div:first-child, .ads:hover)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['div:first-child', '.ads:hover'], {
            color: 'red',
        })
    ], { minSpecificityWeight: 3 }))))
    .toBe(
        '&:is(div:first-child, .ads:hover):nth-child(n)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['div:first-child', '.ads:hover'], {
            color: 'red',
        })
    ], { maxSpecificityWeight: 3 }))))
    .toBe(
        '&:is(div:first-child, .ads:hover)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['div:first-child', '.ads:hover'], {
            color: 'red',
        })
    ], { minSpecificityWeight: 0, maxSpecificityWeight: 3 }))))
    .toBe(
        '&:is(div:first-child, .ads:hover)'
    );
});

test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '::backdrop'], {
            color: 'red',
        })
    ], { specificityWeight: 5 }))))
    .toBe(
        '&.menu.menu.menu.menu.menu, &::backdrop:nth-child(n):nth-child(n):nth-child(n):nth-child(n):nth-child(n)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '::backdrop'], {
            color: 'red',
        })
    ], { specificityWeight: 0 }))))
    .toBe(
        '&::backdrop, &:where(.menu)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '::backdrop'], {
            color: 'red',
        })
    ], { minSpecificityWeight: 3 }))))
    .toBe(
        '&.menu.menu.menu, &::backdrop:nth-child(n):nth-child(n):nth-child(n)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '::backdrop'], {
            color: 'red',
        })
    ], { maxSpecificityWeight: 3 }))))
    .toBe(
        '&.menu, &::backdrop'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '::backdrop'], {
            color: 'red',
        })
    ], { minSpecificityWeight: 0, maxSpecificityWeight: 3 }))))
    .toBe(
        '&.menu, &::backdrop'
    );
});

test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '::backdrop:hover'], {
            color: 'red',
        })
    ], { specificityWeight: 5 }))))
    .toBe(
        '&.menu.menu.menu.menu.menu, &::backdrop:hover:hover:hover:hover:hover'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '::backdrop:hover'], {
            color: 'red',
        })
    ], { specificityWeight: 0 }))))
    .toBe(
        '&:where(.menu), &::backdrop:where(:hover)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '::backdrop:hover'], {
            color: 'red',
        })
    ], { minSpecificityWeight: 3 }))))
    .toBe(
        '&.menu.menu.menu, &::backdrop:hover:hover:hover'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '::backdrop:hover'], {
            color: 'red',
        })
    ], { maxSpecificityWeight: 3 }))))
    .toBe(
        '&.menu, &::backdrop:hover'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu', '::backdrop:hover'], {
            color: 'red',
        })
    ], { minSpecificityWeight: 0, maxSpecificityWeight: 3 }))))
    .toBe(
        '&.menu, &::backdrop:hover'
    );
});
//#endregion test rules with multi-selectors + adjust specificity
