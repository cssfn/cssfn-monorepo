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
import {
    encodeStyles,
}                           from './cssfn-encoders.js'



// processors:
function convertScopeEntryToCssRule<TCssScopeName extends CssScopeName = CssScopeName>(this: CssScopeMap<TCssScopeName>, [scopeName, styles, options]: CssScopeEntry<TCssScopeName>): CssRule|null {
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
const generateRulesFromFactory = <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): CssRuleCollection => {
    const scopesFactory = styleSheet.scopes;
    const scopeList = (typeof(scopesFactory) === 'function') ? scopesFactory() : scopesFactory;
    if (!scopeList || !scopeList.length) return null;
    
    
    
    const scopeMap   = styleSheet.classes;
    const scopeRules = scopeList.map(convertScopeEntryToCssRule.bind(scopeMap));
    return scopeRules;
}
export const renderStyleSheet = <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): string|null => {
    if (!styleSheet.enabled) return null;
    
    
    
    // generate Rule(s) from factory:
    const scopeRules = generateRulesFromFactory(styleSheet);
    
    
    
    // finally, render the structures:
    return renderRule(scopeRules);
}



const renderWorkers : { worker: Worker, isBusy: boolean }[] = [];
const maxHardwareConcurrency = (typeof(window) !== 'undefined') ? (window?.navigator?.hardwareConcurrency ?? 1) : 1;
export const renderStyleSheetAsync = async <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): Promise<string|null> => {
    if (!styleSheet.enabled) return null;
    
    
    
    // generate Rule(s) from factory:
    const scopeRules = generateRulesFromFactory(styleSheet);
    
    
    
    // prepare the worker:
    let workerEntry = renderWorkers.find((workerEntry) => !workerEntry.isBusy);
    if (!workerEntry && (renderWorkers.length < maxHardwareConcurrency)) {
        const workerInstance = new Worker(new URL('./worker-renderStyleSheets.js', import.meta.url), { type: 'module' });
        const newWorkerEntry = {
            worker : workerInstance,
            isBusy : false,
        };
        const handleDone = () => {
            newWorkerEntry.isBusy = false;
        }
        workerInstance.addEventListener('message', handleDone);
        workerInstance.addEventListener('error'  , handleDone);
        renderWorkers.push(newWorkerEntry);
    } // if
    if (!workerEntry) workerEntry = renderWorkers[0];
    
    const currentWorkerEntry = workerEntry;
    const currentWorker      = currentWorkerEntry.worker;
    
    
    
    // finally, render the structures:
    return new Promise<string|null>((resolve, reject) => {
        // handlers:
        const handleProcessed = (event: MessageEvent<string|null>) => {
            resolve(event.data);
        };
        const handleError = (event: Event) => {
            reject(event);
        };
        
        
        
        // actions:
        try {
            currentWorkerEntry.isBusy = true;
            
            currentWorker.addEventListener('message', handleProcessed);
            currentWorker.addEventListener('error'  , handleError);
            
            currentWorker.postMessage(encodeStyles(scopeRules));
        }
        finally {
            currentWorker.removeEventListener('message', handleProcessed);
            currentWorker.removeEventListener('error'  , handleError);
        } // try
    });
    // return renderRule(scopeRules);
}
