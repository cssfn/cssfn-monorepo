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



type WorkerEntry = { worker: Worker, busyLevel: number }
const renderWorkers : WorkerEntry[] = [];
const maxHardwareConcurrency = (typeof(window) !== 'undefined') ? (window?.navigator?.hardwareConcurrency ?? 1) : 1;
const isNotBusyWorker = (workerEntry: WorkerEntry) => (workerEntry.busyLevel === 0);
const sortBusiest = (a: WorkerEntry, b: WorkerEntry): number => {
    return b.busyLevel - a.busyLevel;
}
const createWorkerEntryIfNeeded = () : WorkerEntry|null => {
    // conditions:
    if (renderWorkers.length >= maxHardwareConcurrency) return null;
    
    
    
    const workerInstance = new Worker(new URL('./worker-renderStyleSheets.js', import.meta.url), { type: 'module' });
    const newWorkerEntry = {
        worker    : workerInstance,
        busyLevel : 0,
    };
    renderWorkers.push(newWorkerEntry);
    return newWorkerEntry;
}
export const renderStyleSheetAsync = async <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): Promise<string|null> => {
    if (!styleSheet.enabled) return null;
    
    
    
    // generate Rule(s) from factory:
    const scopeRules = generateRulesFromFactory(styleSheet);
    
    
    
    // prepare the worker:
    const currentWorkerEntry = (
        renderWorkers.find(isNotBusyWorker)   // take the non_busy worker (if any)
        ??
        createWorkerEntryIfNeeded()           // add a new worker (if still available)
        ??
        renderWorkers.sort(sortBusiest).at(0) // take the least busy worker
    );
    if (!currentWorkerEntry) return renderStyleSheet(styleSheet); // fallback to sync mode
    const currentWorker = currentWorkerEntry.worker;
    
    
    
    // finally, render the structures:
    return new Promise<string|null>((resolve, reject) => {
        // handlers:
        const handleDone      = () => {
            currentWorker.removeEventListener('message', handleProcessed);
            currentWorker.removeEventListener('error'  , handleError);
            
            currentWorkerEntry.busyLevel--;
        };
        const handleProcessed = (event: MessageEvent<string|null>) => {
            handleDone();
            resolve(event.data);
        };
        const handleError     = (event: Event) => {
            handleDone();
            reject(event);
        };
        
        
        
        // actions:
        currentWorkerEntry.busyLevel++;
        
        currentWorker.addEventListener('message', handleProcessed);
        currentWorker.addEventListener('error'  , handleError);
        
        currentWorker.postMessage(encodeStyles(scopeRules));
    });
}
