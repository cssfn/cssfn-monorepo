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
