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
type WorkerEntry = {
    worker    : Worker // holds web worker instance
    busyLevel : number // the busy level: 0 = free, 1 = a bit busy, 99 = very busy
}
const workerList : WorkerEntry[] = []; // holds the workers
const maxConcurrentWorks = (globalThis.navigator?.hardwareConcurrency ?? 1); // determines the number of logical processors, fallback to 1 processor

const createWorkerEntryIfNeeded = () : WorkerEntry|null => {
    // conditions:
    if (typeof(Worker) === 'undefined')          return null; // the environment doesn't support web worker => single threading only
    if (workerList.length >= maxConcurrentWorks) return null; // the maximum of workers has been reached    => no more workers
    
    
    
    try {
        // try to create a new worker with esm module:
        const newWorkerInstance = new Worker(new URL('./renderStyleSheetsWorker.js', import.meta.url), { type: 'module' });
        
        const newWorkerEntry = {
            worker    : newWorkerInstance,
            busyLevel : 0,
        };
        workerList.push(newWorkerEntry); // store the worker to re-use later
        return newWorkerEntry;
    }
    catch {
        return null; // the worker doesn't support esm module => no worker can be created
    } // try
}

const isNotBusyWorker   = (workerEntry: WorkerEntry) => (workerEntry.busyLevel === 0);
const sortBusiestWorker = (a: WorkerEntry, b: WorkerEntry): number => {
    return a.busyLevel - b.busyLevel; // sort from the least busy to the most busy
}
const bookingWorker     = (): WorkerEntry|null => {
    return (
        workerList.find(isNotBusyWorker)         // take the non_busy worker (if any)
        ??
        createWorkerEntryIfNeeded()              // add a new worker (if still available)
        ??
        workerList.sort(sortBusiestWorker).at(0) // take the least busy worker
        ??
        null                                     // no worker available
    );
}



// pre-load some workers, so the first page render is served quickly:
const maxPreloadWorkers = 8;
for (let addWorker = 0; addWorker < maxPreloadWorkers; addWorker++) {
    if (!createWorkerEntryIfNeeded()) break; // max concurrent workers reached => stop adding new worker
} // for



// processors:
export const renderStyleSheetAsync = async <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): Promise<string|null> => {
    if (!styleSheet.enabled) return null;
    
    
    
    // prepare the worker:
    const currentWorkerEntry = bookingWorker();
    if (!currentWorkerEntry) return renderStyleSheet(styleSheet); // fallback to sync mode
    const currentWorker = currentWorkerEntry.worker;
    
    
    
    // generate Rule(s) from factory:
    const scopeRules = generateRulesFromFactory(styleSheet);
    
    
    
    // finally, render the structures:
    return new Promise<string|null>((resolve, reject) => {
        // handlers:
        const handleDone      = () => {
            currentWorker.removeEventListener('message', handleProcessed);
            currentWorker.removeEventListener('error'  , handleError);
            
            currentWorkerEntry.busyLevel--;
        };
        const handleProcessed = (event: MessageEvent<string|null>) => {
            // conditions:
            if (sequenceId !== currentWorkerEntry.busyLevel) return; // previously/next posted data => ignore
            
            
            
            handleDone();
            resolve(event.data);
        };
        const handleError     = (event: Event) => {
            // conditions:
            if (sequenceId !== currentWorkerEntry.busyLevel) return; // previously/next posted data => ignore
            
            
            
            handleDone();
            reject(event);
        };
        
        
        
        // actions:
        // an id to distinguish between current data and previously/next posted data:
        const sequenceId = ++currentWorkerEntry.busyLevel;
        
        currentWorker.addEventListener('message', handleProcessed);
        currentWorker.addEventListener('error'  , handleError);
        
        currentWorker.postMessage(encodeStyles(scopeRules));
    });
}
