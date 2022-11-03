// cssfn:
import type {
    // types:
    SingleOrArray,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssScopeName,
}                           from '@cssfn/css-types'
import {
    // utilities:
    browserInfo,
}                           from '@cssfn/css-prop-auto-prefix'

// internals:
import type {
    // types:
    StyleSheet,
}                           from './styleSheets.js'
import {
    generateRulesFromStyleSheet,
    renderStyleSheet,
}                           from './renderStyleSheets.js'
import {
    encodeStyles,
}                           from './cssfn-encoders.js'
import type {
    // types:
    MessageData,
    ResponseData,
}                           from './renderStyleSheetsWorker.js'



// workers:
type WorkerEntry = {
    worker : Worker  // holds web worker instance
    isBusy : boolean // the busy status
}
const workerList : WorkerEntry[] = []; // holds the workers
const maxConcurrentWorks = (globalThis.navigator?.hardwareConcurrency ?? 1); // determines the number of logical processors, fallback to 1 processor

const supportsWorker = (typeof(Worker) !== 'undefined');
const createWorkerEntryIfNeeded = () : WorkerEntry|null => {
    // conditions:
    if (!supportsWorker)                         return null; // the environment doesn't support web worker => single threading only
    if (workerList.length >= maxConcurrentWorks) return null; // the maximum of workers has been reached    => no more workers
    
    
    
    try {
        // try to create a new worker with esm module:
        const newWorkerInstance = new Worker(new URL('./renderStyleSheetsWorker.js', import.meta.url), { type: 'module' });
        const messageData : MessageData = ['config', {browserInfo}];
        newWorkerInstance.postMessage(messageData);
        
        
        
        const newWorkerEntry : WorkerEntry = {
            worker : newWorkerInstance,
            isBusy : false,
        };
        workerList.push(newWorkerEntry); // store the worker to re-use later
        
        
        
        return newWorkerEntry;
    }
    catch {
        return null; // the worker doesn't support esm module => no worker can be created
    } // try
}

const isNotBusyWorker = (workerEntry: WorkerEntry) => !workerEntry.isBusy;
const bookingWorker   = (): WorkerEntry|null => {
    return (
        workerList.find(isNotBusyWorker) // take the non_busy worker (if any)
        ??
        createWorkerEntryIfNeeded()      // add a new worker (if the quota is still available)
        ??
        null                             // no new worker available
    );
}



// pre-load some workers, so the first page render is served quickly:
const maxPreloadWorkers = 8;
for (let addWorker = 0; addWorker < maxPreloadWorkers; addWorker++) {
    if (!createWorkerEntryIfNeeded()) break; // max concurrent workers reached => stop adding new worker
} // for



// processors:
type ResolveCallback = (result: string|null) => void
type RejectCallback  = (reason?: any) => void
type JobEntry = {
    styleSheet : StyleSheet
    resolve    : SingleOrArray<ResolveCallback>
    reject     : SingleOrArray<RejectCallback>
}
const jobList : JobEntry[] = [];

const takeJob = (currentWorkerEntry: WorkerEntry): boolean => {
    // conditions:
    const jobItem = jobList.shift(); // take the oldest job (if available)
    if (!jobItem) return false;      // no job available => nothing to do => idle
    
    
    
    // prepare the job descriptions:
    const {styleSheet, resolve, reject} = jobItem;
    
    
    
    // generate (scope) Rule(s) from styleSheet:
    const scopeRules = generateRulesFromStyleSheet(styleSheet);
    
    
    
    // prepare the worker:
    const currentWorker = currentWorkerEntry.worker;
    
    
    
    // handlers:
    const handleDone      = () => {
        // cleanups:
        currentWorker.removeEventListener('message', handleProcessed);
        currentWorker.removeEventListener('error'  , handleError);
        
        currentWorkerEntry.isBusy = false; // un-mark as busy
        
        
        
        // search for another job:
        takeJob(currentWorkerEntry);
    };
    const handleProcessed = (event: MessageEvent<ResponseData>) => {
        // conditions:
        const [type, payload] = event.data;
        if (type !== 'rendered') return;
        
        
        
        handleDone();
        
        if (Array.isArray(resolve)) {
            for (const singleResolve of resolve) singleResolve(payload);
        }
        else {
            resolve(payload);
        } // if
    };
    const handleError     = (event: Event) => {
        handleDone();
        
        if (Array.isArray(reject)) {
            for (const singleReject of reject) singleReject(event);
        }
        else {
            reject(event);
        } // if
    };
    
    
    
    // actions:
    currentWorkerEntry.isBusy = true; // mark as busy
    
    currentWorker.addEventListener('message', handleProcessed);
    currentWorker.addEventListener('error'  , handleError);
    
    const messageData : MessageData = ['render', encodeStyles(scopeRules)];
    currentWorker.postMessage(messageData);
    
    
    
    // delegation is complete:
    return true;
}

export const renderStyleSheetAsync = async <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): Promise<string|null> => {
    // conditions:
    if (!styleSheet.enabled) return null;
    if (!supportsWorker || !maxConcurrentWorks) return renderStyleSheet(styleSheet); // not_support_worker or concurrent_is_disabled => fallback to sync mode
    
    
    
    // prepare the worker:
    const renderPromise = new Promise<string|null>((resolve: ResolveCallback, reject: RejectCallback) => {
        const existingJobItem = jobList.find((jobItem) => (jobItem.styleSheet === styleSheet));
        if (!existingJobItem) {
            const newJobItem : JobEntry = {styleSheet, resolve, reject};
            jobList.push(newJobItem);
        }
        else {
            if (Array.isArray(existingJobItem.resolve)) {
                existingJobItem.resolve.push(resolve);
            }
            else {
                existingJobItem.resolve = [
                    existingJobItem.resolve,
                    resolve,
                ];
            } // if
            
            
            
            if (Array.isArray(existingJobItem.reject)) {
                existingJobItem.reject.push(reject);
            }
            else {
                existingJobItem.reject = [
                    existingJobItem.reject,
                    reject,
                ];
            } // if
        } // if
    });
    
    
    
    // make sure all workers are running:
    for (let jobs = 0; jobs < jobList.length; jobs++) {
        const freeWorker = bookingWorker();
        if (!freeWorker) break; // there is no more free worker => stop searching
        
        
        
        // do it:
        takeJob(freeWorker); // calling `takeJob()` may cause the `jobList.length` reduced
    } // for
    
    
    
    // the workers are currently working, we will notify you if it done:
    return renderPromise;
}
