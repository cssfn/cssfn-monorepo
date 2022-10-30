// cssfn:
import type {
    // cssfn properties:
    CssScopeName,
}                           from '@cssfn/css-types'

// internals:
import type {
    // types:
    StyleSheet,
}                           from './styleSheets.js'
import {
    generateRulesFromFactory,
    renderStyleSheet,
}                           from './renderStyleSheets.js'
import {
    encodeStyles,
}                           from './cssfn-encoders.js'



// workers:
type WorkerEntry = { worker: Worker, busyLevel: number }
const renderWorkers : WorkerEntry[] = [];
const maxParallelWorks = Math.max(0,
    (
        (typeof(window) !== 'undefined')
        ?
        (window?.navigator?.hardwareConcurrency ?? 1)
        :
        1
    )
    - 1 // the first cpu core was reserved by JavaScript's main thread loop
);
const isNotBusyWorker = (workerEntry: WorkerEntry) => (workerEntry.busyLevel === 0);
const sortBusiestWorker = (a: WorkerEntry, b: WorkerEntry): number => {
    return b.busyLevel - a.busyLevel;
}
const createWorkerEntryIfNeeded = () : WorkerEntry|null => {
    // conditions:
    if (typeof(Worker) === 'undefined')           return null;
    if (renderWorkers.length >= maxParallelWorks) return null;
    
    
    
    try {
        const workerInstance = new Worker(new URL('./renderStyleSheetsWorker.js', import.meta.url), { type: 'module' });
        const newWorkerEntry = {
            worker    : workerInstance,
            busyLevel : 0,
        };
        renderWorkers.push(newWorkerEntry);
        return newWorkerEntry;
    }
    catch {
        return null;
    } // try
}



// pre-load the workers:
const maxPreloadWorkers = 4;
for (let addWorker = 0; addWorker < maxPreloadWorkers; addWorker++) {
    if (!createWorkerEntryIfNeeded()) break; // max parallel workers reached => stop adding new worker
} // for



// processors:
export const renderStyleSheetAsync = async <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): Promise<string|null> => {
    if (!styleSheet.enabled) return null;
    
    
    
    // generate Rule(s) from factory:
    const scopeRules = generateRulesFromFactory(styleSheet);
    
    
    
    // prepare the worker:
    const currentWorkerEntry = (
        renderWorkers.find(isNotBusyWorker)         // take the non_busy worker (if any)
        // ??
        // createWorkerEntryIfNeeded()              // add a new worker (if still available)
        ??
        renderWorkers.sort(sortBusiestWorker).at(0) // take the least busy worker
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
