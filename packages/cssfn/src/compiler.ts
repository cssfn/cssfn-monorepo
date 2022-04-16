// cssfn:
import type {
    // types:
    SingleOrDeepArray,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssRule,
    CssRuleCollection,
    
    CssStyle,
    CssStyleCollection,
    
    CssClassEntry,
    CssClassList,
    
    CssScopeName,
    CssScopeEntry,
    CssScopeMap,
    
    CssSelector,
    CssSelectorCollection,
}                           from '@cssfn/css-types'
import {
    // types:
    SimpleSelector    as SimpleSelectorModel,
    Combinator,
    Selector          as SelectorModel,
    SelectorGroup     as SelectorModelGroup,
    PureSelector      as PureSelectorModel,
    PureSelectorGroup as PureSelectorModelGroup,
    
    
    
    // parses:
    parseSelectors,
    
    
    
    // creates & tests:
    parentSelector,
    pseudoClassSelector,
    isSimpleSelector,
    isParentSelector,
    isClassOrPseudoClassSelector,
    isPseudoElementSelector,
    isNotPseudoElementSelector,
    isCombinator,
    createSelector,
    createSelectorGroup,
    isNotEmptySelectorEntry,
    isNotEmptySelector,
    isNotEmptySelectors,
    
    
    
    // renders:
    selectorsToString,
    
    
    
    // transforms:
    groupSelectors,
    groupSelector,
    ungroupSelector,
    
    
    
    // measures:
    calculateSpecificity,
}                           from '@cssfn/css-selectors'

// internals:
import {
    flat,
}                           from './utilities'