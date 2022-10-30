// cssfn:
import type {
    // cssfn properties:
    CssRule,
    
    CssFinalSelector,
    
    CssClassName,
    
    CssScopeName,
}                           from '@cssfn/css-types'

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



export const renderStyleSheet = <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): string|null => {
    if (!styleSheet.enabled) return null;
    
    
    
    const scopesFactory = styleSheet.scopes;
    const scopeList = (typeof(scopesFactory) === 'function') ? scopesFactory() : scopesFactory;
    if (!scopeList || !scopeList.length) return null;
    
    const scopeMap     = styleSheet.classes;
    
    const scopeRules : CssRule[] = scopeList.map(([scopeName, styles, options]): CssRule|null => {
        if (scopeName === '') { // globalScope => aliased to @global rule
            return atGlobal(
                styles
            );
        } // if
        
        
        
        // calculate unique class:
        const uniqueClass    : CssClassName     = scopeMap[scopeName];
        const uniqueSelector : CssFinalSelector = `.${uniqueClass}`;
        
        
        
        // the top level rule (scope rule):
        return rule(
            uniqueSelector,
            styles,
            { ...options, performGrouping: false }
        );
    }).filter((rule): rule is CssRule => !!rule);
    
    
    
    // finally, render the structures:
    return renderRule(scopeRules);
}
