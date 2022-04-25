import {
    adjustSpecificityWeight,
    mergeSelectors,
} from '../src/mergeSelectors'
import {
    // types:
    SelectorName,
    PureSelector,
    
    
    
    // parses:
    parseSelectors,
    
    
    
    // SelectorEntry creates & tests:
    isPseudoElementSelector,
    
    
    
    // Selector creates & tests:
    pureSelectorGroup,
    isNotEmptySelector,
    
    
    
    // renders:
    selectorsToString,
    
    
    
    // measures:
    Specificity,
    calculateSpecificity,
} from '@cssfn/css-selectors'



//#region test adjustSpecificityWeight()
const zeroSpecificity: Specificity = [0, 0, 0];
const groupList : SelectorName[] & ('is'|'not'|'has'|'where')[] = ['is','not','has','where'];



const specificityRange = [0, 1, 2, 4, 7, 10];
groupList.forEach((group) => {
    const isZeroSpecificity = (group === 'where');
    const tests : { selector: string, specificity: Specificity }[] = [
        {
            selector    : `.product>div>:first-child`,
            specificity : [0, 2, 1],
        },
        {
            selector    : `:${group}(.product>div>:first-child)`,
            specificity : isZeroSpecificity ? zeroSpecificity : [0, 2, 1],
        },
        {
            selector    : `.product.expensive>#list`,
            specificity : [1, 2, 0],
        },
        {
            selector    : `:${group}(.product.expensive>#list)`,
            specificity : isZeroSpecificity ? zeroSpecificity : [1, 2, 0],
        },
        {
            selector    : `::backdrop:hover`,
            specificity : [0, 1, 1],
        },
        {
            selector    : `:${group}(::backdrop:hover)`,
            specificity : isZeroSpecificity ? zeroSpecificity : [0, 1, 1],
        },
        {
            selector    : `::before`,
            specificity : [0, 0, 1],
        },
        {
            selector    : `:${group}(::before)`,
            specificity : isZeroSpecificity ? zeroSpecificity : [0, 0, 1],
        },
        // {
        //     selector    : `#product>.item::after`,
        //     specificity : [1, 1, 1],
        // },
        // {
        //     selector    : `:${group}(#product>.item::after)`,
        //     specificity : isZeroSpecificity ? zeroSpecificity : [1, 1, 1],
        // },
        // {
        //     selector    : `.product.unused>#some[thing="bleh"]:valid+:garbage:first-child`,
        //     specificity : [1, 6, 0],
        // },
        // {
        //     selector    : `:${group}(.product.unused>#some[thing="bleh"]:valid+:garbage:first-child)`,
        //     specificity : isZeroSpecificity ? zeroSpecificity : [1, 6, 0],
        // },
        // {
        //     selector    : `.ultra :deep #field+:nth-child(2n+3)`,
        //     specificity : [1, 3, 0],
        // },
        // {
        //     selector    : `:${group}(.ultra :deep #field+:nth-child(2n+3))`,
        //     specificity : isZeroSpecificity ? zeroSpecificity : [1, 3, 0],
        // },
        // {
        //     selector    : `#this:is(#very .exciting .thing)`,
        //     specificity : [2, 2, 0],
        // },
        // {
        //     selector    : `:${group}(#this:is(#very .exciting .thing))`,
        //     specificity : isZeroSpecificity ? zeroSpecificity : [2, 2, 0],
        // },
        // {
        //     selector    : `&>.sub+next`,
        //     specificity : [0, 1, 1],
        // },
        // {
        //     selector    : `:${group}(&>.sub+next)`,
        //     specificity : isZeroSpecificity ? zeroSpecificity : [0, 1, 1],
        // },
        // {
        //     selector    : `.ultra&:deep #field+:nth-child(2n+3)`,
        //     specificity : [1, 3, 0],
        // },
        // {
        //     selector    : `:${group}(.ultra&:deep #field+:nth-child(2n+3))`,
        //     specificity : isZeroSpecificity ? zeroSpecificity : [1, 3, 0],
        // },
        // {
        //     selector    : `#this:is(#very&.exciting>.thing)`,
        //     specificity : [2, 2, 0],
        // },
        // {
        //     selector    : `:${group}(#this:is(#very&.exciting>.thing))`,
        //     specificity : isZeroSpecificity ? zeroSpecificity : [2, 2, 0],
        // },
        // {
        //     selector    : `::backdrop[title="you & me"]`,
        //     specificity : [0, 1, 1],
        // },
        // {
        //     selector    : `:${group}(::backdrop[title="you & me"])`,
        //     specificity : isZeroSpecificity ? zeroSpecificity : [0, 1, 1],
        // },
        // {
        //     selector    : `:${group}(.ultra :deep #field+:nth-child(2n+3), #this:is(#very .exciting .thing))`,
        //     specificity : isZeroSpecificity ? zeroSpecificity : [2, 2, 0], // max([1.3.0], [2.2.0]) === [2.2.0]
        // },
        // {
        //     selector    : `:${group}(&>.sub+next, .ultra&:deep #field+:nth-child(2n+3), #this:is(#very&.exciting>.thing))`,
        //     specificity : isZeroSpecificity ? zeroSpecificity : [2, 2, 0], // max([0.1.1], [1.3.0], [2.2.0]) === [2.2.0]
        // },
        // {
        //     selector    : `:${group}(&>.sub+next, .ultra&:deep #field+:nth-child(2n+3), #this:is(#very&.exciting>.thing), #this:is(#very#specific#thing#ever))`,
        //     specificity : isZeroSpecificity ? zeroSpecificity : [5, 0, 0], // max([0.1.1], [1.3.0], [2.2.0], [5.0.0]) === [5.0.0]
        // },
    ];
    tests.forEach(({ selector: selectorStr, specificity }) => {
        const selector = parseSelectors(
            selectorStr
        )![0]! as PureSelector;
        
        test(`calculateSpecificity()`, () => {
            expect(calculateSpecificity(
                selector
            ))
            .toEqual(
                specificity
            );
        });
        
        specificityRange.forEach((minSpecificityWeight, minIndex) => {
            specificityRange.slice(minIndex).forEach((maxSpecificityWeight) => {
                expect(minSpecificityWeight)
                .toBeLessThanOrEqual(maxSpecificityWeight);
                
                test(`adjustSpecificityWeight(min: ${minSpecificityWeight}, max: ${maxSpecificityWeight})`, () => {
                    const newSelectors = adjustSpecificityWeight(
                        pureSelectorGroup(selector),
                        minSpecificityWeight,
                        maxSpecificityWeight
                    );
                    newSelectors.filter(isNotEmptySelector).forEach((newSelector) => {
                        const specificityWeight = calculateSpecificity(newSelector)[1];
                        
                        if (maxSpecificityWeight === 0) {
                            if ((specificityWeight === 1) && newSelector.some(isPseudoElementSelector)) {
                                // console.log(newSelector, minSpecificityWeight, '<', specificityWeight, '<', maxSpecificityWeight);
                                return; // skip to check, because ::pseudoElement cannot be wrapped with :where() to neutraize the specificity
                            }
                        } // if
                        
                        expect(specificityWeight)
                        .toBeGreaterThanOrEqual(minSpecificityWeight);
                        
                        expect(specificityWeight)
                        .toBeLessThanOrEqual(maxSpecificityWeight);
                        
                        // console.log(minSpecificityWeight, '<', specificityWeight, '<', maxSpecificityWeight);
                    });
                });
            });
        });
    });
});
//#endregion test adjustSpecificityWeight()



//#region test mergeSelectors()

//#region test with empty selectors
test(`mergeSelectors([])`, () => {
    expect(mergeSelectors([
        /* empty */
    ]))
    .toEqual(
        []
    );
});

const allBasicFalsies = [undefined, null, false, true];
allBasicFalsies.forEach((basicFalsy) => {
    test(`mergeSelectors(falsy)`, () => {
        expect(mergeSelectors([
            basicFalsy,
        ]))
        .toEqual(
            []
        );
    });
    
    allBasicFalsies.forEach((basicFalsy2) => {
        test(`mergeSelectors(falsy)`, () => {
            expect(mergeSelectors([
                basicFalsy,
                basicFalsy2,
            ]))
            .toEqual(
                []
            );
        });
    });
});
//#endregion test with empty selectors



//#region test with unmergeable selectors
test(`mergeSelectors([.only-one])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child`
    )!)))
    .toBe(
        `.aaa:active:first-child`
    );
});
test(`mergeSelectors([.only-one])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `::before`
    )!)))
    .toBe(
        `::before`
    );
});
test(`mergeSelectors([.only-one])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&::before`
    )!)))
    .toBe(
        `&::before`
    );
});
test(`mergeSelectors([.only-one])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:first-child`
    )!)))
    .toBe(
        `:first-child`
    );
});



test(`mergeSelectors([::pseudo-element...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `::before, ::after`
    )!)))
    .toBe(
        `::before, ::after`
    );
});
test(`mergeSelectors([::pseudo-element...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&::before, &::after`
    )!)))
    .toBe(
        `&::before, &::after`
    );
});
test(`mergeSelectors([::pseudo-element...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `::before, ::after, ::backdrop`
    )!)))
    .toBe(
        `::before, ::after, ::backdrop`
    );
});
test(`mergeSelectors([::pseudo-element...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&::before, &::after, &::backdrop`
    )!)))
    .toBe(
        `&::before, &::after, &::backdrop`
    );
});
test(`mergeSelectors([.foo::pseudo-element...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:valid::before, ::after`
    )!)))
    .toBe(
        `:valid::before, ::after`
    );
});
test(`mergeSelectors([.foo::pseudo-element...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&:valid::before, &::after`
    )!)))
    .toBe(
        `&:valid::before, &::after`
    );
});
test(`mergeSelectors([.foo::pseudo-element...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `::before, .awesome::after`
    )!)))
    .toBe(
        `::before, .awesome::after`
    );
});
test(`mergeSelectors([.foo::pseudo-element...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&::before, &.awesome::after`
    )!)))
    .toBe(
        `&::before, &.awesome::after`
    );
});
test(`mergeSelectors([.foo::pseudo-element...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:valid::before, .awesome::after`
    )!)))
    .toBe(
        `:valid::before, .awesome::after`
    );
});
test(`mergeSelectors([.foo::pseudo-element...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&:valid::before, &.awesome::after`
    )!)))
    .toBe(
        `&:valid::before, &.awesome::after`
    );
});
//#endregion test with unmergeable selectors



//#region test with mergeable no-parent selectors
//#region test with single grouped selectors
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(.aaa:active:first-child)`
    )!)))
    .toBe(
        `.aaa:active:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(.aaa:active:first-child)`
    )!)))
    .toBe(
        `.aaa:active:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(.aaa:active:first-child)))`
    )!)))
    .toBe(
        `.aaa:active:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(:where(:where(.aaa:active:first-child)))`
    )!)))
    .toBe(
        `.aaa:active:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(:where(.aaa:active:first-child))))`
    )!)))
    .toBe(
        `.aaa:active:first-child`
    );
});
//#endregion test with single grouped selectors



test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child, .bbb[title="bleh"], #ccc`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child, :is(.bbb[title="bleh"], #ccc)`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child, :where(.bbb[title="bleh"], #ccc)`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child, :not(.bbb[title="bleh"], #ccc)`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, :not(.bbb[title="bleh"], #ccc))`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child, :has(.bbb[title="bleh"], #ccc)`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, :has(.bbb[title="bleh"], #ccc))`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(.aaa:active:first-child), :is(:is(:is(.bbb[title="bleh"]), :is(#ccc)))`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(.aaa:active:first-child), :is(:is(:is(.bbb[title="bleh"]), :is(#ccc)))))`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});

test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(.aaa:active:first-child), :where(:is(:is(.bbb[title="bleh"]), :where(#ccc)))`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(.aaa:active:first-child), :where(:is(:is(.bbb[title="bleh"]), :where(#ccc)))))`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
//#endregion test with mergeable no-parent selectors



//#region test with mergeable only-parent selectors
//#region test with single grouped selectors
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(&)`
    )!)))
    .toBe(
        `&`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(&)`
    )!)))
    .toBe(
        `&`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(&)))`
    )!)))
    .toBe(
        `&`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(:where(:where(&)))`
    )!)))
    .toBe(
        `&`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(:where(&))))`
    )!)))
    .toBe(
        `&`
    );
});
//#endregion test with single grouped selectors



test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&, &, &`
    )!)))
    .toBe(
        `&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&, :is(&, &)`
    )!)))
    .toBe(
        `&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&, :where(&, &)`
    )!)))
    .toBe(
        `&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&, :not(&, &)`
    )!)))
    .toBe(
        `:not(&, &), &`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&, :has(&, &)`
    )!)))
    .toBe(
        `:has(&, &), &`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(&), :is(:is(:is(&), :is(&)))`
    )!)))
    .toBe(
        `&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(&), :is(:is(:is(&), :is(&)))))`
    )!)))
    .toBe(
        `&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(&), :where(:is(:is(&), :where(&)))`
    )!)))
    .toBe(
        `&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(&), :where(:is(:is(&), :where(&)))))`
    )!)))
    .toBe(
        `&`
    );
});
//#endregion test with mergeable only-parent selectors



//#region test with mergeable prefixed-parent selectors
//#region test with single grouped selectors
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(&.aaa:active:first-child)`
    )!)))
    .toBe(
        `&.aaa:active:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(&.aaa:active:first-child)`
    )!)))
    .toBe(
        `&.aaa:active:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(&.aaa:active:first-child)))`
    )!)))
    .toBe(
        `&.aaa:active:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(:where(:where(&.aaa:active:first-child)))`
    )!)))
    .toBe(
        `&.aaa:active:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(:where(&.aaa:active:first-child))))`
    )!)))
    .toBe(
        `&.aaa:active:first-child`
    );
});
//#endregion test with single grouped selectors



test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&.aaa:active:first-child, &.bbb[title="bleh"], &#ccc`
    )!)))
    .toBe(
        `&:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&.aaa:active:first-child, :is(&.bbb[title="bleh"], &#ccc)`
    )!)))
    .toBe(
        `&:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&.aaa:active:first-child, :where(&.bbb[title="bleh"], &#ccc)`
    )!)))
    .toBe(
        `&:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&.aaa:active:first-child, :not(&.bbb[title="bleh"], &#ccc)`
    )!)))
    .toBe(
        `:not(&.bbb[title="bleh"], &#ccc), &.aaa:active:first-child` // TODO: in the future will be: `&:not(.bbb[title="bleh"], #ccc), &.aaa:active:first-child`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&.aaa:active:first-child, :has(&.bbb[title="bleh"], &#ccc)`
    )!)))
    .toBe(
        `:has(&.bbb[title="bleh"], &#ccc), &.aaa:active:first-child` // TODO: in the future will be: `:has(&:is(.bbb[title="bleh"], #ccc)), &.aaa:active:first-child`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(&.aaa:active:first-child), :is(:is(:is(&.bbb[title="bleh"]), :is(&#ccc)))`
    )!)))
    .toBe(
        `&:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(&.aaa:active:first-child), :is(:is(:is(&.bbb[title="bleh"]), :is(&#ccc)))))`
    )!)))
    .toBe(
        `&:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});

test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(&.aaa:active:first-child), :where(:is(:is(&.bbb[title="bleh"]), :where(&#ccc)))`
    )!)))
    .toBe(
        `&:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(&.aaa:active:first-child), :where(:is(:is(&.bbb[title="bleh"]), :where(&#ccc)))))`
    )!)))
    .toBe(
        `&:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
//#endregion test with mergeable prefixed-parent selectors

//#region test with mergeable prefixed-parent-combinator selectors
//#region test with single grouped selectors
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(&>.aaa:active:first-child)`
    )!)))
    .toBe(
        `&>.aaa:active:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(&>.aaa:active:first-child)`
    )!)))
    .toBe(
        `&>.aaa:active:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(&>.aaa:active:first-child)))`
    )!)))
    .toBe(
        `&>.aaa:active:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(:where(:where(&>.aaa:active:first-child)))`
    )!)))
    .toBe(
        `&>.aaa:active:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(:where(&>.aaa:active:first-child))))`
    )!)))
    .toBe(
        `&>.aaa:active:first-child`
    );
});
//#endregion test with single grouped selectors



test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&>.aaa:active:first-child, &>.bbb[title="bleh"], &>#ccc`
    )!)))
    .toBe(
        `&>:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&>.aaa:active:first-child, :is(&>.bbb[title="bleh"], &>#ccc)`
    )!)))
    .toBe(
        `&>:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&>.aaa:active:first-child, :where(&>.bbb[title="bleh"], &>#ccc)`
    )!)))
    .toBe(
        `&>:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&>.aaa:active:first-child, :not(&>.bbb[title="bleh"], &>#ccc)`
    )!)))
    .toBe(
        `:not(&>.bbb[title="bleh"], &>#ccc), &>.aaa:active:first-child` // TODO: in the future will be: `&>:not(.bbb[title="bleh"], #ccc), &>.aaa:active:first-child`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `&>.aaa:active:first-child, :has(&>.bbb[title="bleh"], &>#ccc)`
    )!)))
    .toBe(
        `:has(&>.bbb[title="bleh"], &>#ccc), &>.aaa:active:first-child` // TODO: in the future will be: `:has(&>:is(.bbb[title="bleh"], #ccc)), &>.aaa:active:first-child`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(&>.aaa:active:first-child), :is(:is(:is(&>.bbb[title="bleh"]), :is(&>#ccc)))`
    )!)))
    .toBe(
        `&>:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(&>.aaa:active:first-child), :is(:is(:is(&>.bbb[title="bleh"]), :is(&>#ccc)))))`
    )!)))
    .toBe(
        `&>:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});

test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(&>.aaa:active:first-child), :where(:is(:is(&>.bbb[title="bleh"]), :where(&>#ccc)))`
    )!)))
    .toBe(
        `&>:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(&>.aaa:active:first-child), :where(:is(:is(&>.bbb[title="bleh"]), :where(&>#ccc)))))`
    )!)))
    .toBe(
        `&>:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)`
    );
});
//#endregion test with mergeable prefixed-parent-combinator selectors



//#region test with mergeable suffixed-parent selectors
//#region test with single grouped selectors
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(.aaa:active:first-child&)`
    )!)))
    .toBe(
        `.aaa:active:first-child&`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(.aaa:active:first-child&)`
    )!)))
    .toBe(
        `.aaa:active:first-child&`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(.aaa:active:first-child&)))`
    )!)))
    .toBe(
        `.aaa:active:first-child&`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(:where(:where(.aaa:active:first-child&)))`
    )!)))
    .toBe(
        `.aaa:active:first-child&`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(:where(.aaa:active:first-child&))))`
    )!)))
    .toBe(
        `.aaa:active:first-child&`
    );
});
//#endregion test with single grouped selectors



test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child&, .bbb[title="bleh"]&, #ccc&`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child&, :is(.bbb[title="bleh"]&, #ccc&)`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child&, :where(.bbb[title="bleh"]&, #ccc&)`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child&, :not(.bbb[title="bleh"]&, #ccc&)`
    )!)))
    .toBe(
        `:not(.bbb[title="bleh"]&, #ccc&), .aaa:active:first-child&` // TODO: in the future will be: `:not(.bbb[title="bleh"], #ccc)&, .aaa:active:first-child&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child&, :has(.bbb[title="bleh"]&, #ccc&)`
    )!)))
    .toBe(
        `:has(.bbb[title="bleh"]&, #ccc&), .aaa:active:first-child&` // TODO: in the future will be: `:has(:is(.bbb[title="bleh"], #ccc)&), .aaa:active:first-child&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(.aaa:active:first-child&), :is(:is(:is(.bbb[title="bleh"]&), :is(#ccc&)))`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(.aaa:active:first-child&), :is(:is(:is(.bbb[title="bleh"]&), :is(#ccc&)))))`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)&`
    );
});

test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(.aaa:active:first-child&), :where(:is(:is(.bbb[title="bleh"]&), :where(#ccc&)))`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(.aaa:active:first-child&), :where(:is(:is(.bbb[title="bleh"]&), :where(#ccc&)))))`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)&`
    );
});
//#endregion test with mergeable suffixed-parent selectors

//#region test with mergeable suffixed-parent-combinator selectors
//#region test with single grouped selectors
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(.aaa:active:first-child>&)`
    )!)))
    .toBe(
        `.aaa:active:first-child>&`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(.aaa:active:first-child>&)`
    )!)))
    .toBe(
        `.aaa:active:first-child>&`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(.aaa:active:first-child>&)))`
    )!)))
    .toBe(
        `.aaa:active:first-child>&`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(:where(:where(.aaa:active:first-child>&)))`
    )!)))
    .toBe(
        `.aaa:active:first-child>&`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(:where(.aaa:active:first-child>&))))`
    )!)))
    .toBe(
        `.aaa:active:first-child>&`
    );
});
//#endregion test with single grouped selectors



test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child>&, .bbb[title="bleh"]>&, #ccc>&`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)>&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child>&, :is(.bbb[title="bleh"]>&, #ccc>&)`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)>&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child>&, :where(.bbb[title="bleh"]>&, #ccc>&)`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)>&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child>&, :not(.bbb[title="bleh"]>&, #ccc>&)`
    )!)))
    .toBe(
        `:not(.bbb[title="bleh"]>&, #ccc>&), .aaa:active:first-child>&` // TODO: in the future will be: `:not(.bbb[title="bleh"], #ccc)>&, .aaa:active:first-child>&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active:first-child>&, :has(.bbb[title="bleh"]>&, #ccc>&)`
    )!)))
    .toBe(
        `:has(.bbb[title="bleh"]>&, #ccc>&), .aaa:active:first-child>&` // TODO: in the future will be: `:has(:is(.bbb[title="bleh"], #ccc)>&), .aaa:active:first-child>&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(.aaa:active:first-child>&), :is(:is(:is(.bbb[title="bleh"]>&), :is(#ccc>&)))`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)>&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(.aaa:active:first-child>&), :is(:is(:is(.bbb[title="bleh"]>&), :is(#ccc>&)))))`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)>&`
    );
});

test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(.aaa:active:first-child>&), :where(:is(:is(.bbb[title="bleh"]>&), :where(#ccc>&)))`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)>&`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(.aaa:active:first-child>&), :where(:is(:is(.bbb[title="bleh"]>&), :where(#ccc>&)))))`
    )!)))
    .toBe(
        `:is(.aaa:active:first-child, .bbb[title="bleh"], #ccc)>&`
    );
});
//#endregion test with mergeable suffixed-parent-combinator selectors



//#region test with mergeable random-parent selectors
//#region test with single grouped selectors
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(.aaa:active&:first-child)`
    )!)))
    .toBe(
        `.aaa:active&:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(.aaa:active&:first-child)`
    )!)))
    .toBe(
        `.aaa:active&:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(.aaa:active&:first-child)))`
    )!)))
    .toBe(
        `.aaa:active&:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(:where(:where(.aaa:active&:first-child)))`
    )!)))
    .toBe(
        `.aaa:active&:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(:where(.aaa:active&:first-child))))`
    )!)))
    .toBe(
        `.aaa:active&:first-child`
    );
});
//#endregion test with single grouped selectors



test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active&:first-child, .bbb&[title="bleh"], #ccc&:valid`
    )!)))
    .toBe(
        `.aaa:active&:first-child, .bbb&[title="bleh"], #ccc&:valid`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active&:first-child, :is(.bbb&[title="bleh"], #ccc&:valid)`
    )!)))
    .toBe(
        `.aaa:active&:first-child, .bbb&[title="bleh"], #ccc&:valid`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active&:first-child, :where(.bbb&[title="bleh"], #ccc&:valid)`
    )!)))
    .toBe(
        `.aaa:active&:first-child, .bbb&[title="bleh"], #ccc&:valid`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active&:first-child, :not(.bbb&[title="bleh"], #ccc&:valid)`
    )!)))
    .toBe(
        `:not(.bbb&[title="bleh"], #ccc&:valid), .aaa:active&:first-child`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active&:first-child, :has(.bbb&[title="bleh"], #ccc&:valid)`
    )!)))
    .toBe(
        `:has(.bbb&[title="bleh"], #ccc&:valid), .aaa:active&:first-child`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(.aaa:active&:first-child), :is(:is(:is(.bbb&[title="bleh"]), :is(#ccc&:valid)))`
    )!)))
    .toBe(
        `.aaa:active&:first-child, .bbb&[title="bleh"], #ccc&:valid`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(.aaa:active&:first-child), :is(:is(:is(.bbb&[title="bleh"]), :is(#ccc&:valid)))))`
    )!)))
    .toBe(
        `.aaa:active&:first-child, .bbb&[title="bleh"], #ccc&:valid`
    );
});

test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(.aaa:active&:first-child), :where(:is(:is(.bbb&[title="bleh"]), :where(#ccc&:valid)))`
    )!)))
    .toBe(
        `.aaa:active&:first-child, .bbb&[title="bleh"], #ccc&:valid`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(.aaa:active&:first-child), :where(:is(:is(.bbb&[title="bleh"]), :where(#ccc&:valid)))))`
    )!)))
    .toBe(
        `.aaa:active&:first-child, .bbb&[title="bleh"], #ccc&:valid`
    );
});
//#endregion test with mergeable random-parent selectors

//#region test with mergeable random-parent-combinator selectors
//#region test with single grouped selectors
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(.aaa:active&>:first-child)`
    )!)))
    .toBe(
        `.aaa:active&>:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(.aaa:active&>:first-child)`
    )!)))
    .toBe(
        `.aaa:active&>:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(.aaa:active&>:first-child)))`
    )!)))
    .toBe(
        `.aaa:active&>:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(:where(:where(.aaa:active&>:first-child)))`
    )!)))
    .toBe(
        `.aaa:active&>:first-child`
    );
});
test(`mergeSelectors([((.only-one))])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(:where(.aaa:active&>:first-child))))`
    )!)))
    .toBe(
        `.aaa:active&>:first-child`
    );
});
//#endregion test with single grouped selectors



test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active&>:first-child, .bbb>&[title="bleh"], #ccc>&:valid`
    )!)))
    .toBe(
        `.aaa:active&>:first-child, .bbb>&[title="bleh"], #ccc>&:valid`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active&>:first-child, :is(.bbb>&[title="bleh"], #ccc>&:valid)`
    )!)))
    .toBe(
        `.aaa:active&>:first-child, .bbb>&[title="bleh"], #ccc>&:valid`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active&>:first-child, :where(.bbb>&[title="bleh"], #ccc>&:valid)`
    )!)))
    .toBe(
        `.aaa:active&>:first-child, .bbb>&[title="bleh"], #ccc>&:valid`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active&>:first-child, :not(.bbb>&[title="bleh"], #ccc>&:valid)`
    )!)))
    .toBe(
        `:not(.bbb>&[title="bleh"], #ccc>&:valid), .aaa:active&>:first-child`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `.aaa:active&>:first-child, :has(.bbb>&[title="bleh"], #ccc>&:valid)`
    )!)))
    .toBe(
        `:has(.bbb>&[title="bleh"], #ccc>&:valid), .aaa:active&>:first-child`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(.aaa:active&>:first-child), :is(:is(:is(.bbb>&[title="bleh"]), :is(#ccc>&:valid)))`
    )!)))
    .toBe(
        `.aaa:active&>:first-child, .bbb>&[title="bleh"], #ccc>&:valid`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:is(:is(.aaa:active&>:first-child), :is(:is(:is(.bbb>&[title="bleh"]), :is(#ccc>&:valid)))))`
    )!)))
    .toBe(
        `.aaa:active&>:first-child, .bbb>&[title="bleh"], #ccc>&:valid`
    );
});

test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:where(.aaa:active&>:first-child), :where(:is(:is(.bbb>&[title="bleh"]), :where(#ccc>&:valid)))`
    )!)))
    .toBe(
        `.aaa:active&>:first-child, .bbb>&[title="bleh"], #ccc>&:valid`
    );
});
test(`mergeSelectors([mergeable-selectors...])`, () => {
    expect(selectorsToString(mergeSelectors(parseSelectors(
        `:is(:where(:is(.aaa:active&>:first-child), :where(:is(:is(.bbb>&[title="bleh"]), :where(#ccc>&:valid)))))`
    )!)))
    .toBe(
        `.aaa:active&>:first-child, .bbb>&[title="bleh"], #ccc>&:valid`
    );
});
//#endregion test with mergeable random-parent-combinator selectors

//#endregion test mergeSelectors()
