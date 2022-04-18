import {
    adjustSpecificityWeight,
} from '../src/rule'
import {
    // types:
    SelectorName,
    PureSelector,
    
    
    
    // parses:
    parseSelectors,
    
    
    
    // SelectorEntry creates & tests:
    elementSelector,
    classSelector,
    pseudoClassSelector,
    
    isParentSelector,
    isPseudoElementSelector,
    
    isAttrSelectorOf,
    isElementSelectorOf,
    isClassSelectorOf,
    isPseudoClassSelectorOf,
    
    combinator,
    
    isCombinatorOf,
    
    
    
    // Selector creates & tests:
    pureSelectorGroup,
    
    
    
    // renders:
    selectorsToString,
    
    
    
    // transforms:
    ReplaceSelectorCallback,
    replaceSelectors,
    GroupSelectorOptions,
    groupSelectors,
    groupSelector,
    UngroupSelectorOptions,
    ungroupSelector,
    ungroupSelectors,
    
    
    
    // measures:
    Specificity,
    calculateSpecificity,
} from '@cssfn/css-selectors'



//#region adjustSpecificityWeight()
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
        {
            selector    : `#product>.item::after`,
            specificity : [1, 1, 1],
        },
        {
            selector    : `:${group}(#product>.item::after)`,
            specificity : isZeroSpecificity ? zeroSpecificity : [1, 1, 1],
        },
        {
            selector    : `.product.unused>#some[thing="bleh"]:valid+:garbage:first-child`,
            specificity : [1, 6, 0],
        },
        {
            selector    : `:${group}(.product.unused>#some[thing="bleh"]:valid+:garbage:first-child)`,
            specificity : isZeroSpecificity ? zeroSpecificity : [1, 6, 0],
        },
        {
            selector    : `.ultra :deep #field+:nth-child(2n+3)`,
            specificity : [1, 3, 0],
        },
        {
            selector    : `:${group}(.ultra :deep #field+:nth-child(2n+3))`,
            specificity : isZeroSpecificity ? zeroSpecificity : [1, 3, 0],
        },
        {
            selector    : `#this:is(#very .exciting .thing)`,
            specificity : [2, 2, 0],
        },
        {
            selector    : `:${group}(#this:is(#very .exciting .thing))`,
            specificity : isZeroSpecificity ? zeroSpecificity : [2, 2, 0],
        },
        {
            selector    : `&>.sub+next`,
            specificity : [0, 1, 1],
        },
        {
            selector    : `:${group}(&>.sub+next)`,
            specificity : isZeroSpecificity ? zeroSpecificity : [0, 1, 1],
        },
        {
            selector    : `.ultra&:deep #field+:nth-child(2n+3)`,
            specificity : [1, 3, 0],
        },
        {
            selector    : `:${group}(.ultra&:deep #field+:nth-child(2n+3))`,
            specificity : isZeroSpecificity ? zeroSpecificity : [1, 3, 0],
        },
        {
            selector    : `#this:is(#very&.exciting>.thing)`,
            specificity : [2, 2, 0],
        },
        {
            selector    : `:${group}(#this:is(#very&.exciting>.thing))`,
            specificity : isZeroSpecificity ? zeroSpecificity : [2, 2, 0],
        },
        {
            selector    : `::backdrop[title="you & me"]`,
            specificity : [0, 1, 1],
        },
        {
            selector    : `:${group}(::backdrop[title="you & me"])`,
            specificity : isZeroSpecificity ? zeroSpecificity : [0, 1, 1],
        },
        {
            selector    : `:${group}(.ultra :deep #field+:nth-child(2n+3), #this:is(#very .exciting .thing))`,
            specificity : isZeroSpecificity ? zeroSpecificity : [2, 2, 0], // max([1.3.0], [2.2.0]) === [2.2.0]
        },
        {
            selector    : `:${group}(&>.sub+next, .ultra&:deep #field+:nth-child(2n+3), #this:is(#very&.exciting>.thing))`,
            specificity : isZeroSpecificity ? zeroSpecificity : [2, 2, 0], // max([0.1.1], [1.3.0], [2.2.0]) === [2.2.0]
        },
        {
            selector    : `:${group}(&>.sub+next, .ultra&:deep #field+:nth-child(2n+3), #this:is(#very&.exciting>.thing), #this:is(#very#specific#thing#ever))`,
            specificity : isZeroSpecificity ? zeroSpecificity : [5, 0, 0], // max([0.1.1], [1.3.0], [2.2.0], [5.0.0]) === [5.0.0]
        },
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
                
                test(`adjustSpecificityWeight()`, () => {
                    const newSelectors = adjustSpecificityWeight(
                        pureSelectorGroup(selector),
                        minSpecificityWeight,
                        maxSpecificityWeight
                    );
                    newSelectors.forEach((newSelector) => {
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
//#endregion adjustSpecificityWeight()
