import type {
    ValueOf,
} from '@cssfn/types'
import type {
    CssProps,
    CssRuleData,
    CssFinalRuleData,
    CssRule,
    CssStyle,
    CssStyleMap,
    CssFinalStyleMap,
    CssStyleCollection,
    
    CssSelectorCollection,
    CssSelectorOptions,
} from '@cssfn/css-types'
import type {
    Combinator,
} from '@cssfn/css-selectors'
import {
    filterOnlyRuleKeys,
    mergeStyles,
} from '../dist/mergeStyles.js'
import {
    rule,
    rules,
    variants,
    states,
    
    keyframes,
    
    alwaysRule,
    neverRule,
    fallbacks,
    fontFace,
    atGlobal,
    atRoot,
    ifFirstChild,
    ifNotFirstChild,
    ifLastChild,
    ifNotLastChild,
    ifNthChild,
    ifNotNthChild,
    ifNthLastChild,
    ifNotNthLastChild,
    ifActive,
    ifNotActive,
    ifFocus,
    ifNotFocus,
    ifFocusVisible,
    ifNotFocusVisible,
    ifHover,
    ifNotHover,
    ifEmpty,
    ifNotEmpty,
    
    descendants,
    children,
    siblings,
    nextSiblings,
    
    style,
    vars,
    imports,
    
    iif,
    escapeSvg,
    solidBackg,
    
    camelCase,
    pascalCase,
} from '../dist/cssfn.js'
import {
    isFinalSelector,
    isFinalStyleMap,
} from '../dist/utilities.js'
import './jest-custom'



const cssMapToStyle = (style: CssStyleMap|CssFinalStyleMap|null): CssStyle|null => {
    if (!style || !style.size) return null;
    
    
    
    const styleString = Object.fromEntries(
        Array.from(style as Iterable<[string|symbol, ValueOf<CssProps>]>)
        .filter(([key]) => (typeof(key) !== 'symbol'))
    );
    const styleSymbol = Object.fromEntries(
        Array.from(style as Iterable<[string|symbol, CssRuleData|CssFinalRuleData]>)
        .filter(([key]) => (typeof(key) === 'symbol'))
        .map(([key, ruleData]) => {
            if (ruleData[1] && (typeof(ruleData[1]) === 'object') && (Object.getPrototypeOf(ruleData[1]) === Map.prototype)) {
                const styles = ruleData[1];
                return [
                    key,
                    
                    [
                        ruleData[0],
                        isFinalStyleMap(styles) ? cssMapToStyle(styles)! : styles
                    ] as const
                ] as const;
            }
            else {
                return [
                    key,
                    
                    ruleData
                ] as const;
            } // if
        })
    );
    return Object.assign({}, styleString, styleSymbol) as unknown as CssStyle;
}



const firstSelectorOf = (style: CssFinalStyleMap|null): string|null => {
    if (!style) return null;
    const symbolProp = Array.from(filterOnlyRuleKeys(style.keys()))[0];
    if (symbolProp === undefined) return null;
    const [selector] = style.get(symbolProp)!;
    return isFinalSelector(selector) ? selector : null;
}
const firstStylesOf = (style: CssFinalStyleMap|null): CssStyle|null => {
    if (!style) return null;
    const symbolProp = Array.from(filterOnlyRuleKeys(style.keys()))[0];
    if (symbolProp === undefined) return null;
    const [, styles] = style.get(symbolProp)!;
    return cssMapToStyle(styles);
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
//#endregion keyframes



//#region rule shortcuts
test(`alwaysRule()`, () => {
    expect(cssMapToStyle(mergeStyles({
        background: 'pink',
        ...alwaysRule({
            color: 'red',
        })
    })))
    .toExactEqual({
        background: 'pink',
        color: 'red',
    });
});

test(`neverRule()`, () => {
    expect(cssMapToStyle(mergeStyles({
        background: 'pink',
        ...neverRule(),
    })))
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
test(`fallbacks()`, () => {
    expect(firstStylesOf(mergeStyles(
        fallbacks([
            {
                background: 'pink',
                color: 'red',
            },
            {
                opacity: 0.5,
                visibility: 'visible',
            },
            {
                display: 'flex',
                flexDirection: 'column',
            },
        ])
    )))
    .toExactEqual({
        background: 'pink',
        color: 'red',
        opacity: 0.5,
        visibility: 'visible',
        display: 'flex',
        flexDirection: 'column',
    });
});

test(`fontFace()`, () => {
    expect(firstSelectorOf(mergeStyles(
        fontFace({
            fontFamily: 'Open Sans',
            src: 'url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf")',
        }),
    )))
    .toBe(
        '@font-face'
    );
});
test(`fontFace()`, () => {
    expect(firstStylesOf(mergeStyles(
        fontFace({
            fontFamily: 'Open Sans',
            src: 'url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf")',
        }),
    )))
    .toExactEqual({
        fontFamily: 'Open Sans',
        src: 'url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf")',
    });
});
test(`fontFace()`, () => {
    expect(firstSelectorOf(mergeStyles(
        fontFace([
            {
                fontFamily: 'Open Sans',
            },
            {
                src: 'url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf")',
            },
            {
                fontWeight: 'bold',
                fontStyle: [['oblique', '40deg']],
            },
        ]),
    )))
    .toBe(
        '@font-face'
    );
});
test(`fontFace()`, () => {
    expect(firstStylesOf(mergeStyles(
        fontFace([
            {
                fontFamily: 'Open Sans',
            },
            {
                src: 'url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf")',
            },
            {
                fontWeight: 'bold',
                fontStyle: [['oblique', '40deg']],
            },
        ]),
    )))
    .toExactEqual({
        fontFamily: 'Open Sans',
        src: 'url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf")',
        fontWeight: 'bold',
        fontStyle: [['oblique', '40deg']],
    });
});

test(`global()`, () => {
    expect(firstSelectorOf(mergeStyles(
        atGlobal({
            ...rule('.button', {
                display: 'flex',
                flexDirection: 'row',
            }),
        })
    )))
    .toBe(
        '@global'
    );
});

const unparameterizedRules : (readonly [(styles: CssStyleCollection) => CssRule, string ])[] = [
    [ atRoot           , '&:root'                ],
    [ ifFirstChild     , '&:first-child'         ],
    [ ifNotFirstChild  , '&:not(:first-child)'   ],
    [ ifLastChild      , '&:last-child'          ],
    [ ifNotLastChild   , '&:not(:last-child)'    ],
    [ ifActive         , '&:active'              ],
    [ ifNotActive      , '&:not(:active)'        ],
    [ ifFocus          , '&:focus'               ],
    [ ifNotFocus       , '&:not(:focus)'         ],
    [ ifFocusVisible   , '&:focus-visible'       ],
    [ ifNotFocusVisible, '&:not(:focus-visible)' ],
    [ ifHover          , '&:hover'               ],
    [ ifNotHover       , '&:not(:hover)'         ],
    [ ifEmpty          , '&:empty'               ],
    [ ifNotEmpty       , '&:not(:empty)'         ],
];
unparameterizedRules.forEach(([func, expected]) => {
    test(`func()`, () => {
        expect(firstSelectorOf(mergeStyles(
            func({
                color: 'red',
            })
        )))
        .toBe(
            expected
        );
    });
    test(`func()`, () => {
        expect(firstStylesOf(mergeStyles(
            func([
                {
                    background: 'pink',
                    color: 'red',
                },
                {
                    opacity: 0.5,
                    visibility: 'visible',
                },
                {
                    display: 'flex',
                    flexDirection: 'column',
                },
            ])
        )))
        .toExactEqual({
            background: 'pink',
            color: 'red',
            opacity: 0.5,
            visibility: 'visible',
            display: 'flex',
            flexDirection: 'column',
        });
    });
});
//#endregion rule shortcuts



//#region test ifNthChild()
test(`ifNthChild(0, 0)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthChild(0, 0, {
            color: 'red',
        })
    )))
    .toBe(
        null
    );
});
test(`ifNthChild(0, 1)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthChild(0, 1, {
            color: 'red',
        })
    )))
    .toBe(
        '&:first-child'
    );
});
test(`ifNthChild(0, 2)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthChild(0, 2, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-child(2)'
    );
});
test(`ifNthChild(1, 0)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthChild(1, 0, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-child(n)'
    );
});
test(`ifNthChild(1, 1)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthChild(1, 1, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-child(n+1)'
    );
});
test(`ifNthChild(1, 2)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthChild(1, 2, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-child(n+2)'
    );
});
test(`ifNthChild(2, 0)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthChild(2, 0, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-child(2n)'
    );
});
test(`ifNthChild(2, 1)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthChild(2, 1, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-child(2n+1)'
    );
});
test(`ifNthChild(2, 2)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthChild(2, 2, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-child(2n+2)'
    );
});
//#endregion test ifNthChild()

//#region test ifNotNthChild()
test(`ifNotNthChild(0, 0)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthChild(0, 0, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-child(n)'
    );
});
test(`ifNotNthChild(0, 1)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthChild(0, 1, {
            color: 'red',
        })
    )))
    .toBe(
        '&:not(:first-child)'
    );
});
test(`ifNotNthChild(0, 2)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthChild(0, 2, {
            color: 'red',
        })
    )))
    .toBe(
        '&:not(:nth-child(2))'
    );
});
test(`ifNotNthChild(1, 0)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthChild(1, 0, {
            color: 'red',
        })
    )))
    .toBe(
        null
    );
});
test(`ifNotNthChild(1, 1)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthChild(1, 1, {
            color: 'red',
        })
    )))
    .toBe(
        '&:not(:nth-child(n+1))'
    );
});
test(`ifNotNthChild(1, 2)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthChild(1, 2, {
            color: 'red',
        })
    )))
    .toBe(
        '&:not(:nth-child(n+2))'
    );
});
test(`ifNotNthChild(2, 0)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthChild(2, 0, {
            color: 'red',
        })
    )))
    .toBe(
        '&:not(:nth-child(2n))'
    );
});
test(`ifNotNthChild(2, 1)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthChild(2, 1, {
            color: 'red',
        })
    )))
    .toBe(
        '&:not(:nth-child(2n+1))'
    );
});
test(`ifNotNthChild(2, 2)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthChild(2, 2, {
            color: 'red',
        })
    )))
    .toBe(
        '&:not(:nth-child(2n+2))'
    );
});
//#endregion test ifNotNthChild()



//#region test ifNthLastChild()
test(`ifNthLastChild(0, 0)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthLastChild(0, 0, {
            color: 'red',
        })
    )))
    .toBe(
        null
    );
});
test(`ifNthLastChild(0, 1)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthLastChild(0, 1, {
            color: 'red',
        })
    )))
    .toBe(
        '&:last-child'
    );
});
test(`ifNthLastChild(0, 2)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthLastChild(0, 2, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-last-child(2)'
    );
});
test(`ifNthLastChild(1, 0)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthLastChild(1, 0, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-child(n)'
    );
});
test(`ifNthLastChild(1, 1)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthLastChild(1, 1, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-last-child(n+1)'
    );
});
test(`ifNthLastChild(1, 2)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthLastChild(1, 2, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-last-child(n+2)'
    );
});
test(`ifNthLastChild(2, 0)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthLastChild(2, 0, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-last-child(2n)'
    );
});
test(`ifNthLastChild(2, 1)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthLastChild(2, 1, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-last-child(2n+1)'
    );
});
test(`ifNthLastChild(2, 2)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNthLastChild(2, 2, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-last-child(2n+2)'
    );
});
//#endregion test ifNthLastChild()

//#region test ifNotNthLastChild()
test(`ifNotNthLastChild(0, 0)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthLastChild(0, 0, {
            color: 'red',
        })
    )))
    .toBe(
        '&:nth-child(n)'
    );
});
test(`ifNotNthLastChild(0, 1)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthLastChild(0, 1, {
            color: 'red',
        })
    )))
    .toBe(
        '&:not(:last-child)'
    );
});
test(`ifNotNthLastChild(0, 2)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthLastChild(0, 2, {
            color: 'red',
        })
    )))
    .toBe(
        '&:not(:nth-last-child(2))'
    );
});
test(`ifNotNthLastChild(1, 0)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthLastChild(1, 0, {
            color: 'red',
        })
    )))
    .toBe(
        null
    );
});
test(`ifNotNthLastChild(1, 1)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthLastChild(1, 1, {
            color: 'red',
        })
    )))
    .toBe(
        '&:not(:nth-last-child(n+1))'
    );
});
test(`ifNotNthLastChild(1, 2)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthLastChild(1, 2, {
            color: 'red',
        })
    )))
    .toBe(
        '&:not(:nth-last-child(n+2))'
    );
});
test(`ifNotNthLastChild(2, 0)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthLastChild(2, 0, {
            color: 'red',
        })
    )))
    .toBe(
        '&:not(:nth-last-child(2n))'
    );
});
test(`ifNotNthLastChild(2, 1)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthLastChild(2, 1, {
            color: 'red',
        })
    )))
    .toBe(
        '&:not(:nth-last-child(2n+1))'
    );
});
test(`ifNotNthLastChild(2, 2)`, () => {
    expect(firstSelectorOf(mergeStyles(
        ifNotNthLastChild(2, 2, {
            color: 'red',
        })
    )))
    .toBe(
        '&:not(:nth-last-child(2n+2))'
    );
});
//#endregion test ifNotNthLastChild()



//#region combinators
const combinators : (readonly [((selectors: CssSelectorCollection, styles: CssStyleCollection, options?: CssSelectorOptions) => CssRule), Combinator])[] = [
    [descendants , ' '],
    [children    , '>'],
    [siblings    , '~'],
    [nextSiblings, '+'],
];
combinators.forEach(([combinatorFunc, combinator]) => {
    test(`${combinatorFunc.name}()`, () => {
        expect(firstSelectorOf(mergeStyles(
            combinatorFunc(`.boo`, {
                color: `red`,
            })
        )))
        .toBe(
            `&${combinator}.boo`
        );
    });
    test(`${combinatorFunc.name}()`, () => {
        expect(firstSelectorOf(mergeStyles(
            combinatorFunc([`.boo`, `:foo`], {
                color: `red`,
            })
        )))
        .toBe(
            `&${combinator}:is(.boo, :foo)`
        );
    });
    test(`${combinatorFunc.name}()`, () => {
        expect(firstSelectorOf(mergeStyles(
            combinatorFunc([`.boo`, `:foo`, `::doo`], {
                color: `red`,
            })
        )))
        .toBe(
            `&${combinator}:is(.boo, :foo), &::doo`
        );
    });
    test(`${combinatorFunc.name}()`, () => {
        expect(firstSelectorOf(mergeStyles(
            combinatorFunc([`.boo`, `:foo`, `::doo`], {
                color: `red`,
            }, { minSpecificityWeight: 3 })
        )))
        .toBe(
            `&${combinator}:is(.boo, :foo):nth-child(n):nth-child(n), &::doo:nth-child(n):nth-child(n):nth-child(n)`
        );
    });
    test(`${combinatorFunc.name}()`, () => {
        expect(firstSelectorOf(mergeStyles(
            combinatorFunc([`.boo`, `:foo`, `::doo`], {
                color: `red`,
            }, { maxSpecificityWeight: 0 })
        )))
        .toBe(
            `&::doo, &${combinator}:where(.boo, :foo)`
        );
    });
});
//#endregion combinators



//#region styles
test(`style()`, () => {
    expect(cssMapToStyle(mergeStyles(
        style({
            color      : 'blue',
            background : 'lightblue',
        })
    )))
    .toExactEqual({
        color      : 'blue',
        background : 'lightblue',
    });
});
test(`vars()`, () => {
    expect(cssMapToStyle(mergeStyles(
        vars({
            '--site-name'      : 'bob',
            '--bg-color'       : 'blue',
            '--default-border' : [['solid', '1px', 'red'], '!important'],
            'var(--myVar)'     : '"boo"',
            'var(--myBorder)'  : [['dashed', '2px', 'blue']],
        })
    )))
    .toExactEqual({
        '--site-name'      : 'bob',
        '--bg-color'       : 'blue',
        '--default-border' : [['solid', '1px', 'red'], '!important'],
        'var(--myVar)'     : '"boo"',
        'var(--myBorder)'  : [['dashed', '2px', 'blue']],
    });
});
test(`imports()`, () => {
    expect(cssMapToStyle(mergeStyles(
        imports([
            {
                color      : 'blue',
                background : 'lightblue',
            },
        ])
    )))
    .toExactEqual({
        color      : 'blue',
        background : 'lightblue',
    });
});
test(`imports()`, () => {
    expect(cssMapToStyle(mergeStyles(
        imports([
            {
                color      : 'blue',
                background : 'lightblue',
            },
            {
                opacity    : 0.9,
                width      : '300px',
            },
        ])
    )))
    .toExactEqual({
        color      : 'blue',
        background : 'lightblue',
        opacity    : 0.9,
        width      : '300px',
    });
});
//#endregion styles



//#region test iif()
test(`iif()`, () => {
    expect(cssMapToStyle(mergeStyles({
        opacity: 0.5,
        visibility: 'visible',
        ...iif(false, style({
            background: 'pink',
            color: 'red',
        })),
    })))
    .toExactEqual({
        opacity: 0.5,
        visibility: 'visible',
    });
});
test(`iif()`, () => {
    expect(cssMapToStyle(mergeStyles({
        opacity: 0.5,
        visibility: 'visible',
        ...iif(true, style({
            background: 'pink',
            color: 'red',
        })),
    })))
    .toExactEqual({
        opacity: 0.5,
        visibility: 'visible',
        background: 'pink',
        color: 'red',
    });
});

test(`iif(false, ifFirstChild())`, () => {
    expect(firstSelectorOf(mergeStyles(
        iif(false, ifFirstChild({
            color: 'red',
        }))
    )))
    .toBe(
        null
    );
});
test(`iif(false, ifFirstChild())`, () => {
    expect(firstStylesOf(mergeStyles(
        iif(false, ifFirstChild([
            {
                background: 'pink',
                color: 'red',
            },
            {
                opacity: 0.5,
                visibility: 'visible',
            },
            {
                display: 'flex',
                flexDirection: 'column',
            },
        ]))
    )))
    .toBe(
        null
    );
});
test(`iif(true, ifFirstChild())`, () => {
    expect(firstSelectorOf(mergeStyles(
        iif(true, ifFirstChild({
            color: 'red',
        }))
    )))
    .toBe(
        '&:first-child'
    );
});
test(`iif(true, ifFirstChild())`, () => {
    expect(firstStylesOf(mergeStyles(
        iif(true, ifFirstChild([
            {
                background: 'pink',
                color: 'red',
            },
            {
                opacity: 0.5,
                visibility: 'visible',
            },
            {
                display: 'flex',
                flexDirection: 'column',
            },
        ]))
    )))
    .toExactEqual({
        background: 'pink',
        color: 'red',
        opacity: 0.5,
        visibility: 'visible',
        display: 'flex',
        flexDirection: 'column',
    });
});
//#endregion test iif()



//#region test escapeSvg()
test(`escapeSvg()`, () => {
    expect(escapeSvg(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'><circle r='3' fill='#000'/></svg>`
    ))
    .toBe(
        `%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23000'/%3e%3c/svg%3e`
    );
});
//#endregion test escapeSvg()



//#region test solidBackg()
test(`solidBackg()`, () => {
    expect(solidBackg(
        'red'
    ))
    .toEqual(
        [['linear-gradient(red, red)', 'border-box']]
    );
});
test(`solidBackg()`, () => {
    expect(solidBackg(
        'var(--myFavColor)'
    ))
    .toEqual(
        [['linear-gradient(var(--myFavColor), var(--myFavColor))', 'border-box']]
    );
});
//#endregion test solidBackg()



//#region test camelCase()
test(`camelCase()`, () => {
    expect(camelCase(
        'BooFooBleh'
    ))
    .toEqual(
        'booFooBleh'
    );
});
test(`camelCase()`, () => {
    expect(camelCase(
        'booFooBleh'
    ))
    .toEqual(
        'booFooBleh'
    );
});
//#endregion test camelCase()

//#region test pascalCase()
test(`pascalCase()`, () => {
    expect(pascalCase(
        'BooFooBleh'
    ))
    .toEqual(
        'BooFooBleh'
    );
});
test(`pascalCase()`, () => {
    expect(pascalCase(
        'booFooBleh'
    ))
    .toEqual(
        'BooFooBleh'
    );
});
//#endregion test pascalCase()
