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
    worker     : Worker        // holds web worker instance
    currentJob : JobEntry|null // the busy status
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
        
        
        
        // create a new worker entry:
        const newWorkerEntry : WorkerEntry = {
            worker     : newWorkerInstance,
            currentJob : null,
        };
        workerList.push(newWorkerEntry); // store the worker to re-use later
        
        
        
        // handlers:
        newWorkerInstance.onmessage = (event: MessageEvent<ResponseData>) => {
            // conditions:
            const [type, payload] = event.data;
            if (type !== 'rendered') return;
            
            
            
            const resolve = newWorkerEntry.currentJob?.resolve; // extract the callback before resetting `handleDone()`
            handleDone(); // reset
            
            
            
            if (resolve) {
                if (Array.isArray(resolve)) {
                    for (const singleResolve of resolve) singleResolve(payload);
                }
                else {
                    resolve(payload);
                } // if
            } // if
        };
        newWorkerInstance.onerror = (event) => {
            const reject = newWorkerEntry.currentJob?.reject; // extract the callback before resetting `handleDone()`
            handleDone(); // reset
            
            
            
            if (reject) {
                if (Array.isArray(reject)) {
                    for (const singleReject of reject) singleReject(event);
                }
                else {
                    reject(event);
                } // if
            } // if
        };
        const handleDone = () => {
            // cleanups:
            newWorkerEntry.currentJob = null; // un-mark as busy
            
            
            
            // search for another job:
            takeJob(newWorkerEntry);
        };
        
        
        
        // configure:
        const messageData : MessageData = ['config', {browserInfo}];
        newWorkerInstance.postMessage(messageData);
        
        
        
        // ready:
        return newWorkerEntry;
    }
    catch {
        return null; // the worker doesn't support esm module => no worker can be created
    } // try
}

const isNotBusyWorker = (workerEntry: WorkerEntry) => !workerEntry.currentJob;
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
    resolve : SingleOrArray<ResolveCallback>
    reject  : SingleOrArray<RejectCallback>
}
const jobList = new Map<StyleSheet, JobEntry>();

const takeJob = (currentWorkerEntry: WorkerEntry): boolean => {
    // conditions:
    const styleSheet = jobList.keys().next().value as (StyleSheet|undefined); // take the oldest job (if available)
    if (!styleSheet) return false; // no job available => nothing to do => idle
    
    const currentJob = jobList.get(styleSheet)!;
    jobList.delete(styleSheet); // taken => remove from the list
    
    
    
    // generate (scope) Rule(s) from styleSheet:
    const scopeRules = generateRulesFromStyleSheet(styleSheet);
    
    
    
    // prepare the worker:
    const currentWorker = currentWorkerEntry.worker;
    
    
    
    // setups:
    currentWorkerEntry.currentJob = currentJob; // mark as busy
    
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
        const existingJobEntry = jobList.get(styleSheet);
        if (!existingJobEntry) {
            const newJobEntry : JobEntry = {resolve, reject};
            jobList.set(styleSheet, newJobEntry);
        }
        else {
            if (Array.isArray(existingJobEntry.resolve)) {
                existingJobEntry.resolve.push(resolve);
            }
            else {
                existingJobEntry.resolve = [
                    existingJobEntry.resolve,
                    resolve,
                ];
            } // if
            
            
            
            if (Array.isArray(existingJobEntry.reject)) {
                existingJobEntry.reject.push(reject);
            }
            else {
                existingJobEntry.reject = [
                    existingJobEntry.reject,
                    reject,
                ];
            } // if
            
            
            
            // re-position the job entry to the last:
            jobList.delete(styleSheet);
            jobList.set(styleSheet, existingJobEntry);
        } // if
    });
    
    
    
    // make sure all workers are running:
    for (let jobs = 0; jobs < jobList.size; jobs++) {
        const freeWorker = bookingWorker();
        if (!freeWorker) break; // there is no more free worker => stop searching
        
        
        
        // do it:
        takeJob(freeWorker); // calling `takeJob()` may cause the `jobList.size` reduced
    } // for
    
    
    
    // the workers are currently working, we will notify you if it done:
    return renderPromise;
}
