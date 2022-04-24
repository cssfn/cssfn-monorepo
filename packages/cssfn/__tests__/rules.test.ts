import type {
    CssStyle,
} from '@cssfn/css-types'
import {
    mergeStyles,
    mergeNested,
} from '../src/mergeStyles'
import {
    rule,
    rules,
    variants,
    states,
    
    keyframes,
    
    noRule,
    emptyRule,
    fallbacks,
    fontFace,
} from '../src/cssfn'
import {
    isFinalSelector,
} from '../src/utilities'
import './jest-custom'



const firstSelectorOf = (style: CssStyle|null): string|null => {
    if (!style) return null;
    const symbolProp = Object.getOwnPropertySymbols(style)[0];
    if (symbolProp === undefined) return null;
    const [selector] = style[symbolProp];
    return isFinalSelector(selector) ? selector : null;
}
const firstStylesOf = (style: CssStyle|null): CssStyle|null => {
    if (!style) return null;
    const symbolProp = Object.getOwnPropertySymbols(style)[0];
    if (symbolProp === undefined) return null;
    const [, styles] = style[symbolProp];
    return styles as CssStyle;
}



//#region test rule()
//#region test rule with single-selector
test(`rule([single-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('.menu', {
            color: 'red',
        })
    )))
    .toBe(
        '&.menu'
    );
});

test(`rule([single-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('.menu:first-child', {
            color: 'red',
        })
    )))
    .toBe(
        '&.menu:first-child'
    );
});

test(`rule([single-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('div:hover', {
            color: 'red',
        })
    )))
    .toBe(
        '&div:hover'
    );
});

test(`rule([single-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('::backdrop:hover', {
            color: 'red',
        })
    )))
    .toBe(
        '&::backdrop:hover'
    );
});
//#endregion test rule with single-selector



//#region test rule with multi-selectors
test(`rule([some-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '.ads'], {
            color: 'red',
        })
    )))
    .toBe(
        '&:is(.menu, .ads)'
    );
});

test(`rule([some-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu:first-child', '.ads:hover'], {
            color: 'red',
        })
    )))
    .toBe(
        '&:is(.menu:first-child, .ads:hover)'
    );
});

test(`rule([some-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['div:first-child', '.ads:hover'], {
            color: 'red',
        })
    )))
    .toBe(
        '&:is(div:first-child, .ads:hover)'
    );
});

test(`rule([some-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '::backdrop'], {
            color: 'red',
        })
    )))
    .toBe(
        '&.menu, &::backdrop'
    );
});

test(`rule([some-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '::backdrop:hover'], {
            color: 'red',
        })
    )))
    .toBe(
        '&.menu, &::backdrop:hover'
    );
});

test(`rule([some-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu.special:valid.things', '::backdrop:hover'], {
            color: 'red',
        })
    )))
    .toBe(
        '&.menu.special:valid.things, &::backdrop:hover'
    );
});

test(`rule([some-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu:not(.special:valid.things)', '::backdrop:hover'], {
            color: 'red',
        })
    )))
    .toBe(
        '&.menu:not(.special:valid.things), &::backdrop:hover'
    );
});
//#endregion test rule with multi-selectors



//#region test rule with single-selector + adjust specificity
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('.menu', {
            color: 'red',
        }, { specificityWeight: 5 })
    )))
    .toBe(
        '&.menu.menu.menu.menu.menu'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('.menu', {
            color: 'red',
        }, { specificityWeight: 0 })
    )))
    .toBe(
        '&:where(.menu)'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('.menu', {
            color: 'red',
        }, { minSpecificityWeight: 3 })
    )))
    .toBe(
        '&.menu.menu.menu'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('.menu', {
            color: 'red',
        }, { maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&.menu'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('.menu', {
            color: 'red',
        }, { minSpecificityWeight: 0, maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&.menu'
    );
});

test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('.menu:first-child', {
            color: 'red',
        }, { specificityWeight: 5 })
    )))
    .toBe(
        '&.menu:first-child:first-child:first-child:first-child'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('.menu:first-child', {
            color: 'red',
        }, { specificityWeight: 0 })
    )))
    .toBe(
        '&:where(.menu:first-child)'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('.menu:first-child', {
            color: 'red',
        }, { minSpecificityWeight: 3 })
    )))
    .toBe(
        '&.menu:first-child:first-child'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('.menu:first-child', {
            color: 'red',
        }, { maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&.menu:first-child'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('.menu:first-child', {
            color: 'red',
        }, { minSpecificityWeight: 0, maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&.menu:first-child'
    );
});

test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('div:hover', {
            color: 'red',
        }, { specificityWeight: 5 })
    )))
    .toBe(
        '&div:hover:hover:hover:hover:hover'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('div:hover', {
            color: 'red',
        }, { specificityWeight: 0 })
    )))
    .toBe(
        '&div:where(:hover)'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('div:hover', {
            color: 'red',
        }, { minSpecificityWeight: 5 })
    )))
    .toBe(
        '&div:hover:hover:hover:hover:hover'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('div:hover', {
            color: 'red',
        }, { maxSpecificityWeight: 5 })
    )))
    .toBe(
        '&div:hover'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('div:hover', {
            color: 'red',
        }, { minSpecificityWeight: 0, maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&div:hover'
    );
});

test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('::backdrop:hover', {
            color: 'red',
        }, { specificityWeight: 5 })
    )))
    .toBe(
        '&::backdrop:hover:hover:hover:hover:hover'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('::backdrop:hover', {
            color: 'red',
        }, { specificityWeight: 0 })
    )))
    .toBe(
        '&::backdrop:where(:hover)'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('::backdrop:hover', {
            color: 'red',
        }, { minSpecificityWeight: 3 })
    )))
    .toBe(
        '&::backdrop:hover:hover:hover'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('::backdrop:hover', {
            color: 'red',
        }, { maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&::backdrop:hover'
    );
});
test(`rule([single-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule('::backdrop:hover', {
            color: 'red',
        }, { minSpecificityWeight: 0, maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&::backdrop:hover'
    );
});
//#endregion test rule with single-selector + adjust specificity



//#region test rule with multi-selectors + adjust specificity
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '.ads'], {
            color: 'red',
        }, { specificityWeight: 5 })
    )))
    .toBe(
        '&:is(.menu, .ads):nth-child(n):nth-child(n):nth-child(n):nth-child(n)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '.ads'], {
            color: 'red',
        }, { specificityWeight: 0 })
    )))
    .toBe(
        '&:where(.menu, .ads)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '.ads'], {
            color: 'red',
        }, { minSpecificityWeight: 3 })
    )))
    .toBe(
        '&:is(.menu, .ads):nth-child(n):nth-child(n)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '.ads'], {
            color: 'red',
        }, { maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&:is(.menu, .ads)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '.ads'], {
            color: 'red',
        }, { minSpecificityWeight: 0, maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&:is(.menu, .ads)'
    );
});

test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu:first-child', '.ads:hover'], {
            color: 'red',
        }, { specificityWeight: 5 })
    )))
    .toBe(
        '&:is(.menu:first-child, .ads:hover):nth-child(n):nth-child(n):nth-child(n)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu:first-child', '.ads:hover'], {
            color: 'red',
        }, { specificityWeight: 0 })
    )))
    .toBe(
        '&:where(.menu:first-child, .ads:hover)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu:first-child', '.ads:hover'], {
            color: 'red',
        }, { minSpecificityWeight: 3 })
    )))
    .toBe(
        '&:is(.menu:first-child, .ads:hover):nth-child(n)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu:first-child', '.ads:hover'], {
            color: 'red',
        }, { maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&:is(.menu:first-child, .ads:hover)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu:first-child', '.ads:hover'], {
            color: 'red',
        }, { minSpecificityWeight: 0, maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&:is(.menu:first-child, .ads:hover)'
    );
});

test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['div:first-child', '.ads:hover'], {
            color: 'red',
        }, { specificityWeight: 5 })
    )))
    .toBe(
        '&:is(div:first-child, .ads:hover):nth-child(n):nth-child(n):nth-child(n)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['div:first-child', '.ads:hover'], {
            color: 'red',
        }, { specificityWeight: 0 })
    )))
    .toBe(
        '&:where(div:first-child, .ads:hover)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['div:first-child', '.ads:hover'], {
            color: 'red',
        }, { minSpecificityWeight: 3 })
    )))
    .toBe(
        '&:is(div:first-child, .ads:hover):nth-child(n)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['div:first-child', '.ads:hover'], {
            color: 'red',
        }, { maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&:is(div:first-child, .ads:hover)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['div:first-child', '.ads:hover'], {
            color: 'red',
        }, { minSpecificityWeight: 0, maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&:is(div:first-child, .ads:hover)'
    );
});

test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '::backdrop'], {
            color: 'red',
        }, { specificityWeight: 5 })
    )))
    .toBe(
        '&.menu.menu.menu.menu.menu, &::backdrop:nth-child(n):nth-child(n):nth-child(n):nth-child(n):nth-child(n)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '::backdrop'], {
            color: 'red',
        }, { specificityWeight: 0 })
    )))
    .toBe(
        '&::backdrop, &:where(.menu)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '::backdrop'], {
            color: 'red',
        }, { minSpecificityWeight: 3 })
    )))
    .toBe(
        '&.menu.menu.menu, &::backdrop:nth-child(n):nth-child(n):nth-child(n)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '::backdrop'], {
            color: 'red',
        }, { maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&.menu, &::backdrop'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '::backdrop'], {
            color: 'red',
        }, { minSpecificityWeight: 0, maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&.menu, &::backdrop'
    );
});

test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '::backdrop:hover'], {
            color: 'red',
        }, { specificityWeight: 5 })
    )))
    .toBe(
        '&.menu.menu.menu.menu.menu, &::backdrop:hover:hover:hover:hover:hover'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '::backdrop:hover'], {
            color: 'red',
        }, { specificityWeight: 0 })
    )))
    .toBe(
        '&:where(.menu), &::backdrop:where(:hover)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '::backdrop:hover'], {
            color: 'red',
        }, { minSpecificityWeight: 3 })
    )))
    .toBe(
        '&.menu.menu.menu, &::backdrop:hover:hover:hover'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '::backdrop:hover'], {
            color: 'red',
        }, { maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&.menu, &::backdrop:hover'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu', '::backdrop:hover'], {
            color: 'red',
        }, { minSpecificityWeight: 0, maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&.menu, &::backdrop:hover'
    );
});

test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu.special:valid.things', '::backdrop:hover'], {
            color: 'red',
        }, { specificityWeight: 5 })
    )))
    .toBe(
        '&.menu.special:valid.things.things, &::backdrop:hover:hover:hover:hover:hover'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu.special:valid.things', '::backdrop:hover'], {
            color: 'red',
        }, { specificityWeight: 0 })
    )))
    .toBe(
        '&:where(.menu.special:valid.things), &::backdrop:where(:hover)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu.special:valid.things', '::backdrop:hover'], {
            color: 'red',
        }, { minSpecificityWeight: 3 })
    )))
    .toBe(
        '&.menu.special:valid.things, &::backdrop:hover:hover:hover'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu.special:valid.things', '::backdrop:hover'], {
            color: 'red',
        }, { maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&::backdrop:hover, &.menu.special:valid:where(.things)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu.special:valid.things', '::backdrop:hover'], {
            color: 'red',
        }, { minSpecificityWeight: 0, maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&::backdrop:hover, &.menu.special:valid:where(.things)'
    );
});

test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu:not(.special:valid.things)', '::backdrop:hover'], {
            color: 'red',
        }, { specificityWeight: 5 })
    )))
    .toBe(
        '&.menu:not(.special:valid.things).menu, &::backdrop:hover:hover:hover:hover:hover'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu:not(.special:valid.things)', '::backdrop:hover'], {
            color: 'red',
        }, { specificityWeight: 0 })
    )))
    .toBe(
        '&:where(.menu:not(.special:valid.things)), &::backdrop:where(:hover)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu:not(.special:valid.things)', '::backdrop:hover'], {
            color: 'red',
        }, { minSpecificityWeight: 3 })
    )))
    .toBe(
        '&.menu:not(.special:valid.things), &::backdrop:hover:hover:hover'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu:not(.special:valid.things)', '::backdrop:hover'], {
            color: 'red',
        }, { maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&::backdrop:hover, &.menu:where(:not(.special:valid.things)):nth-child(n):nth-child(n)'
    );
});
test(`rule([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(
        rule(['.menu:not(.special:valid.things)', '::backdrop:hover'], {
            color: 'red',
        }, { minSpecificityWeight: 0, maxSpecificityWeight: 3 })
    )))
    .toBe(
        '&::backdrop:hover, &.menu:where(:not(.special:valid.things)):nth-child(n):nth-child(n)'
    );
});
//#endregion test rule with multi-selectors + adjust specificity
//#endregion test rule()



//#region test rules()
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

test(`rules([some-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu.special:valid.things', '::backdrop:hover'], {
            color: 'red',
        })
    ]))))
    .toBe(
        '&.menu.special:valid.things, &::backdrop:hover'
    );
});

test(`rules([some-selector])`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu:not(.special:valid.things)', '::backdrop:hover'], {
            color: 'red',
        })
    ]))))
    .toBe(
        '&.menu:not(.special:valid.things), &::backdrop:hover'
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

test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu.special:valid.things', '::backdrop:hover'], {
            color: 'red',
        })
    ], { specificityWeight: 5 }))))
    .toBe(
        '&.menu.special:valid.things.things, &::backdrop:hover:hover:hover:hover:hover'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu.special:valid.things', '::backdrop:hover'], {
            color: 'red',
        })
    ], { specificityWeight: 0 }))))
    .toBe(
        '&:where(.menu.special:valid.things), &::backdrop:where(:hover)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu.special:valid.things', '::backdrop:hover'], {
            color: 'red',
        })
    ], { minSpecificityWeight: 3 }))))
    .toBe(
        '&.menu.special:valid.things, &::backdrop:hover:hover:hover'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu.special:valid.things', '::backdrop:hover'], {
            color: 'red',
        })
    ], { maxSpecificityWeight: 3 }))))
    .toBe(
        '&::backdrop:hover, &.menu.special:valid:where(.things)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu.special:valid.things', '::backdrop:hover'], {
            color: 'red',
        })
    ], { minSpecificityWeight: 0, maxSpecificityWeight: 3 }))))
    .toBe(
        '&::backdrop:hover, &.menu.special:valid:where(.things)'
    );
});

test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu:not(.special:valid.things)', '::backdrop:hover'], {
            color: 'red',
        })
    ], { specificityWeight: 5 }))))
    .toBe(
        '&.menu:not(.special:valid.things).menu, &::backdrop:hover:hover:hover:hover:hover'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu:not(.special:valid.things)', '::backdrop:hover'], {
            color: 'red',
        })
    ], { specificityWeight: 0 }))))
    .toBe(
        '&:where(.menu:not(.special:valid.things)), &::backdrop:where(:hover)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu:not(.special:valid.things)', '::backdrop:hover'], {
            color: 'red',
        })
    ], { minSpecificityWeight: 3 }))))
    .toBe(
        '&.menu:not(.special:valid.things), &::backdrop:hover:hover:hover'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu:not(.special:valid.things)', '::backdrop:hover'], {
            color: 'red',
        })
    ], { maxSpecificityWeight: 3 }))))
    .toBe(
        '&::backdrop:hover, &.menu:where(:not(.special:valid.things)):nth-child(n):nth-child(n)'
    );
});
test(`rules([some-selector] + adj specificity)`, () => {
    expect(firstSelectorOf(mergeStyles(rules([
        rule(['.menu:not(.special:valid.things)', '::backdrop:hover'], {
            color: 'red',
        })
    ], { minSpecificityWeight: 0, maxSpecificityWeight: 3 }))))
    .toBe(
        '&::backdrop:hover, &.menu:where(:not(.special:valid.things)):nth-child(n):nth-child(n)'
    );
});
//#endregion test rules with multi-selectors + adjust specificity
//#endregion test rules()



//#region test variants()
test(`variants(simple-variants)`, () => {
    expect(firstSelectorOf(mergeStyles(variants([
        rule('.dark', {
            color: 'red',
        })
    ]))))
    .toBe(
        '&.dark'
    );
});
test(`variants(simple-variants)`, () => {
    expect(firstSelectorOf(mergeStyles(variants([
        rule(['.dark', '.very.cool'], {
            color: 'red',
        })
    ]))))
    .toBe(
        '&:is(.dark, .very.cool)'
    );
});
test(`variants(specific-variants)`, () => {
    expect(firstSelectorOf(mergeStyles(variants([
        rule('.very.deep.dark.blue', {
            color: 'red',
        })
    ]))))
    .toBe(
        '&.very.deep:where(.dark.blue)'
    );
});
test(`variants(specific-variants)`, () => {
    expect(firstSelectorOf(mergeStyles(variants([
        rule(['.very.deep.dark.blue', '.ultra.reddish.backg'], {
            color: 'red',
        })
    ]))))
    .toBe(
        '&:where(.very.deep.dark.blue, .ultra.reddish.backg):nth-child(n):nth-child(n)'
    );
});
test(`variants(specific-variants)`, () => {
    expect(firstSelectorOf(mergeStyles(variants([
        rule(['.dark', '.very.deep.dark.blue', '.very.cool', '.ultra.reddish.backg'], {
            color: 'red',
        })
    ]))))
    .toBe(
        '&:where(.dark, .very.deep.dark.blue, .very.cool, .ultra.reddish.backg):nth-child(n):nth-child(n)'
    );
});
//#endregion test variants()



//#region test states()
test(`states(simple-states)`, () => {
    expect(firstSelectorOf(mergeStyles(states([
        rule(':disabled', {
            color: 'red',
        })
    ]))))
    .toBe(
        '&:disabled:disabled:disabled'
    );
});
test(`states(simple-states)`, () => {
    expect(firstSelectorOf(mergeStyles(states([
        rule([':disabled', ':active:checked:hover'], {
            color: 'red',
        })
    ]))))
    .toBe(
        '&:is(:disabled, :active:checked:hover)'
    );
});
test(`states(specific-states)`, () => {
    expect(firstSelectorOf(mergeStyles(states([
        rule(':active:checked:hover:valid', {
            color: 'red',
        })
    ]))))
    .toBe(
        '&:active:checked:hover:valid'
    );
});
test(`states(specific-states)`, () => {
    expect(firstSelectorOf(mergeStyles(states([
        rule([':active:checked:hover:valid', ':disabled:invalid:first-child'], {
            color: 'red',
        })
    ]))))
    .toBe(
        '&:is(:active:checked:hover:valid, :disabled:invalid:first-child)'
    );
});
test(`states(specific-states)`, () => {
    expect(firstSelectorOf(mergeStyles(states([
        rule([':disabled', ':active:checked:hover:valid', ':active:checked', ':disabled:invalid:first-child'], {
            color: 'red',
        })
    ]))))
    .toBe(
        '&:is(:disabled, :active:checked:hover:valid, :active:checked, :disabled:invalid:first-child)'
    );
});
//#endregion test states()



//#region keyframes
test(`keyframes()`, () => {
    const testKeyframes = keyframes('my-animation', {
        from : {
            color      : 'red',
            background : 'pink',
        },
        '50%': {
            color      : 'yellow',
            background : 'white',
        },
        to   : {
            color      : 'blue',
            background : 'lightblue',
        },
    });
    const testMerged = mergeStyles(testKeyframes)
    
    expect(firstSelectorOf(
        testMerged
    ))
    .toBe(
        '@keyframes my-animation'
    );
    
    const styles = firstStylesOf(testMerged);
    expect(styles).not.toBeNull();
    if (styles === null) throw Error('styles === null');
    const symbolKeys = Object.getOwnPropertySymbols(styles);
    const symbolFrom = symbolKeys[0];
    const symbolp50  = symbolKeys[1];
    const symbolTo   = symbolKeys[2];
    expect(symbolFrom).not.toBeUndefined();
    expect(symbolp50).not.toBeUndefined();
    expect(symbolTo).not.toBeUndefined();
    
    const [, fromStyles] = styles[symbolFrom];
    const [, p50Styles ] = styles[symbolp50];
    const [, toStyles  ] = styles[symbolTo];
    expect(fromStyles).toExactEqual({
        color      : 'red',
        background : 'pink',
    });
    expect(p50Styles).toExactEqual({
        color      : 'yellow',
        background : 'white',
    });
    expect(toStyles).toExactEqual({
        color      : 'blue',
        background : 'lightblue',
    });
});


test(`keyframes()`, () => {
    const testKeyframes = keyframes('fooAnimation', {
        '0%' : [
            {
                color      : 'red',
                background : 'pink',
            },
            {
                opacity    : 0.1,
                width      : '100px',
            },
        ],
        '50%': [
            {
                color      : 'yellow',
                background : 'white',
            },
            {
                opacity    : 0.5,
                width      : '200px',
            },
        ],
        '100%'   : [
            {
                color      : 'blue',
                background : 'lightblue',
            },
            {
                opacity    : 0.9,
                width      : '300px',
            },
        ],
    });
    const testMerged = mergeStyles(testKeyframes)
    
    expect(firstSelectorOf(
        testMerged
    ))
    .toBe(
        '@keyframes fooAnimation'
    );
    
    const styles = firstStylesOf(testMerged);
    expect(styles).not.toBeNull();
    if (styles === null) throw Error('styles === null');
    const symbolKeys = Object.getOwnPropertySymbols(styles);
    const symbolp0   = symbolKeys[0];
    const symbolp50  = symbolKeys[1];
    const symbolp100 = symbolKeys[2];
    expect(symbolp0).not.toBeUndefined();
    expect(symbolp50).not.toBeUndefined();
    expect(symbolp100).not.toBeUndefined();
    
    const [, p0Styles  ] = styles[symbolp0];
    const [, p50Styles ] = styles[symbolp50];
    const [, p100Styles] = styles[symbolp100];
    expect(p0Styles).toExactEqual({
        color      : 'red',
        background : 'pink',
        opacity    : 0.1,
        width      : '100px',
    });
    expect(p50Styles).toExactEqual({
        color      : 'yellow',
        background : 'white',
        opacity    : 0.5,
        width      : '200px',
    });
    expect(p100Styles).toExactEqual({
        color      : 'blue',
        background : 'lightblue',
        opacity    : 0.9,
        width      : '300px',
    });
});
//endregion keyframes



//#region rule shortcuts
test(`noRule()`, () => {
    expect(mergeStyles({
        background: 'pink',
        ...noRule({
            color: 'red',
        })
    }))
    .toExactEqual({
        background: 'pink',
        color: 'red',
    });
});
test(`emptyRule()`, () => {
    expect(mergeStyles({
        background: 'pink',
        ...emptyRule(),
    }))
    .toExactEqual({
        background: 'pink',
    });
});
test(`fallbacks()`, () => {
    expect(firstSelectorOf(mergeStyles(
        fallbacks({
            color: 'red',
        })
    )))
    .toBe(
        '@fallbacks'
    );
});
test(`fontFace()`, () => {
    expect(firstSelectorOf(mergeStyles(
        fontFace({
            fontFamily: 'Open Sans',
            src: 'url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf")',
        })
    )))
    .toBe(
        '@font-face'
    );
});
//endregion rule shortcuts
