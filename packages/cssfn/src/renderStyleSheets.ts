// cssfn:
import type {
    // cssfn properties:
    CssRule,
    CssRuleCollection,
    
    CssFinalSelector,
    
    CssClassName,
    
    CssScopeName,
    CssScopeEntry,
    CssScopeMap,
}                           from '@cssfn/css-types'
import {
    // utilities:
    browserInfo,
    createCssPropAutoPrefix,
}                           from '@cssfn/css-prop-auto-prefix'

// internals:
import type {
    // types:
    StyleSheet,
}                           from './styleSheets.js'
import {
    // rules:
    rule,
    
    
    
    // rule shortcuts:
    atGlobal,
}                           from './cssfn.js'
import {
    renderRule,
}                           from './renderRules.js'



// utilities:
const cssPropAutoPrefix = createCssPropAutoPrefix(browserInfo);



// processors:
function selectCssRuleFromScopeEntry<TCssScopeName extends CssScopeName = CssScopeName>(this: CssScopeMap<TCssScopeName>, [scopeName, styles, options]: CssScopeEntry<TCssScopeName>): CssRule|null {
    if (scopeName === '') { // globalScope => aliased to @global rule
        return atGlobal(
            styles
        );
    } // if
    
    
    
    // calculate unique class:
    const uniqueClass    : CssClassName     = this[scopeName];
    const uniqueSelector : CssFinalSelector = `.${uniqueClass}`;
    
    
    
    // the top level rule (scope rule):
    return rule(
        uniqueSelector,
        styles,
        { ...options, performGrouping: false }
    );
}
export const generateRulesFromStyleSheet = <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): CssRuleCollection => {
    const scopesFactory = styleSheet.scopes;
    const scopeList = (typeof(scopesFactory) === 'function') ? scopesFactory() : scopesFactory;
    if (!scopeList || !scopeList.length) return null;
    
    
    
    const scopeMap   = styleSheet.classes;
    const scopeRules = scopeList.map(selectCssRuleFromScopeEntry, scopeMap);
    return scopeRules;
}
export const renderStyleSheet = <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): string|null => {
    if (!styleSheet.enabled) return null;
    
    
    
    // generate (scope) Rule(s) from styleSheet:
    const scopeRules = generateRulesFromStyleSheet(styleSheet);
    
    
    
    // finally, render the structures:
    return renderRule(scopeRules, { cssPropAutoPrefix });
}
