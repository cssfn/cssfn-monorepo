// cssfn:
import type {
    // types:
    BrowserInfo,
}                           from '@cssfn/css-prop-auto-prefix'

// internals:
import type {
    EncodedCssStyleCollection,
}                           from './cssfn-encoded-types.js'
import type {
    // types:
    RequestConfig,
    RequestRender         as WorkerRequestRender,
    
    ResponseReady,
    ResponseRendered      as WorkerResponseRendered,
    ResponseRenderedError as WorkerResponseRenderedError,
    Response              as WorkerResponse,
}                           from './renderStyleSheetsWorker.js'



// types:
export type DataWithId<TData extends readonly [any, any]> = readonly [TData[0], readonly[number, TData[1]]]

export type { RequestConfig }
export type RequestRender         = DataWithId<WorkerRequestRender>
export type Request =
    |RequestConfig
    |RequestRender

export type ResponseRendered      = DataWithId<WorkerResponseRendered>
export type ResponseRenderedError = DataWithId<WorkerResponseRenderedError>
export type Response =
    |ResponseReady
    |ResponseRendered
    |ResponseRenderedError



// utilities:
let browserInfo: BrowserInfo|undefined = undefined;



// workers:
type WorkerEntry = {
    worker     : Worker        // holds web worker instance
    currentJob : JobEntry|null // the busy status
}
const workerList : WorkerEntry[] = []; // holds the workers
const maxConcurrentWorks = (globalThis.navigator?.hardwareConcurrency ?? 1); // determines the number of logical processors, fallback to 1 processor

const createWorkerEntryIfNeeded = () : WorkerEntry|null => {
    // conditions:
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
        newWorkerInstance.onmessage = (event: MessageEvent<WorkerResponse>) => {
            // conditions:
            const [type, payload] = event.data;
            switch (type) {
                case 'rendered':
                    {
                        const id = newWorkerEntry.currentJob?.id; // extract the id before resetting `handleDone()`
                        handleDone(); // reset
                        if (id !== undefined) handleRequestRendered(id, payload);
                    }
                    break;
                case 'renderederr':
                    {
                        const id = newWorkerEntry.currentJob?.id; // extract the id before resetting `handleDone()`
                        handleDone(); // reset
                        if (id !== undefined) handleRequestRenderedError(id);
                    }
                    break;
            } // switch
        }
        newWorkerInstance.onerror = (_event: ErrorEvent) => {
            const id = newWorkerEntry.currentJob?.id; // extract the id before resetting `handleDone()`
            handleDone(); // reset
            if (id !== undefined) handleRequestRenderedError(id);
        }
        const handleDone = () => {
            // cleanups:
            newWorkerEntry.currentJob = null; // un-mark as busy
            
            
            
            // search for another job:
            takeJob(newWorkerEntry);
        };
        
        
        
        // configure:
        if (browserInfo) {
            const messageData : RequestConfig = ['config', {browserInfo}];
            newWorkerInstance.postMessage(messageData);
        } // if
        
        
        
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
type JobEntry = {
    id    : number
    rules : EncodedCssStyleCollection,
}
const jobList : JobEntry[] = [];

const takeJob = (currentWorkerEntry: WorkerEntry): boolean => {
    const currentJob = jobList.shift();
    if (!currentJob) return false; // no job available => nothing to do => idle
    
    
    
    // setups:
    currentWorkerEntry.currentJob = currentJob; // mark as busy
    
    const messageData : WorkerRequestRender = ['render', currentJob.rules];
    currentWorkerEntry.worker.postMessage(messageData);
    
    
    
    // delegation is complete:
    return true;
}



// handlers:
self.onmessage = (event: MessageEvent<Request>) => {
    const [type, payload] = event.data;
    switch (type) {
        case 'config':
            handleRequestConfig(payload);
            break;
        case 'render':
            handleRequestRender(payload);
            break;
    } // switch
};
const handleRequestConfig        = (options: RequestConfig[1]): void => {
    if ('browserInfo' in options) {
        browserInfo = options.browserInfo;
        
        
        
        // update running workers:
        const messageData : RequestConfig = ['config', {browserInfo}];
        for (const {worker} of workerList) {
            worker.postMessage(messageData);
        } // for
    } // if
}
const handleRequestRender        = ([id, rules]: RequestRender[1]): void => {
    // push the new job:
    const newJobEntry : JobEntry = {id, rules};
    jobList.push(newJobEntry);
    
    
    
    // make sure all workers are running, so the promise will be resolved:
    for (let jobs = 0; jobs < jobList.length; jobs++) {
        const freeWorker = bookingWorker();
        if (!freeWorker) break; // there is no more free worker => stop searching
        
        
        
        // do it:
        takeJob(freeWorker); // calling `takeJob()` may cause the `jobList.size` reduced
    } // for
}
const handleRequestRendered      = (id: number, rendered: WorkerResponseRendered[1]) => {
    const responseData : ResponseRendered = ['rendered', [id, rendered]];
    self.postMessage(responseData);
}
const handleRequestRenderedError = (id: number) => {
    const responseData : ResponseRenderedError = ['renderederr', [id, undefined]];
    self.postMessage(responseData);
}
