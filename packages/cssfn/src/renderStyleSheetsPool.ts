// cssfn:
import type {
    // types:
    BrowserInfo,
}                           from '@cssfn/css-prop-auto-prefix'

// internals:
import type {
    // types:
    Tuple,
    NameOf,
    ValueOf,
    
    RequestConfig,
    RequestRender         as WorkerRequestRender,
    
    ResponseReady,
    ResponseRendered      as WorkerResponseRendered,
    ResponseRenderedError as WorkerResponseRenderedError,
    Response              as WorkerResponse,
}                           from './renderStyleSheetsWorker.js'



// types:
export type TupleWithId<TData extends Tuple<any, any>> = Tuple<NameOf<TData>, Tuple<number, ValueOf<TData>>>

export type {
    Tuple,
    NameOf,
    ValueOf,
    
    RequestConfig,
}

export type RequestRender         = TupleWithId<WorkerRequestRender>
export type Request =
    |RequestConfig
    |RequestRender

export type ResponseRendered      = TupleWithId<WorkerResponseRendered>
export type ResponseRenderedError = TupleWithId<WorkerResponseRenderedError>
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
    if (workerList.length >= maxConcurrentWorks) return null; // the maximum of workers has been reached => no more workers
    
    
    
    try {
        // try to create a new worker with esm module:
        const newWorkerInstance = new Worker(new URL(/* webpackChunkName: 'renderStyleSheetsWorker' */'./renderStyleSheetsWorker.js', import.meta.url), { type: 'module' });
        
        
        
        // create a new worker entry:
        const newWorkerEntry : WorkerEntry = {
            worker     : newWorkerInstance,
            currentJob : null,
        };
        workerList.push(newWorkerEntry); // store the worker to re-use later
        
        
        
        // handlers:
        newWorkerInstance.onmessage = (event: MessageEvent<WorkerResponse>) => {
            const [type, payload] = event.data;
            switch (type) {
                case 'rendered':
                    {
                        const jobId = newWorkerEntry.currentJob?.jobId; // extract the jobId before resetting `handleDone()`
                        handleDone(newWorkerEntry); // reset
                        if (jobId !== undefined) handleResponseRendered(jobId, payload);
                    }
                    break;
                case 'renderederr':
                    {
                        const jobId = newWorkerEntry.currentJob?.jobId; // extract the jobId before resetting `handleDone()`
                        handleDone(newWorkerEntry); // reset
                        if (jobId !== undefined) handleResponseRenderedError(jobId, payload);
                    }
                    break;
            } // switch
        }
        newWorkerInstance.onerror = (event: ErrorEvent) => {
            handleWorkerError(newWorkerEntry, event);
        }
        
        
        
        // configure:
        if (browserInfo) {
            const requestConfig : RequestConfig = ['config', {browserInfo}];
            newWorkerInstance.postMessage(requestConfig);
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



// pre-load some workers, so the first page render will served quickly:
const maxPreloadWorkers = 8;
for (let addWorker = 0; addWorker < maxPreloadWorkers; addWorker++) {
    if (!createWorkerEntryIfNeeded()) break; // max concurrent workers reached => stop adding new worker
} // for



// processors:
type JobEntry = {
    jobId : number
    rules : ValueOf<WorkerRequestRender>,
}
const jobList : JobEntry[] = [];

const takeJob = (currentWorkerEntry: WorkerEntry): boolean => {
    const currentJob = jobList.shift(); // take the oldest queued job
    if (!currentJob) return false; // no job available => nothing to do => idle
    
    
    
    // setups:
    currentWorkerEntry.currentJob = currentJob; // mark as busy
    
    const requestRender : WorkerRequestRender = ['render', currentJob.rules];
    currentWorkerEntry.worker.postMessage(requestRender);
    
    
    
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
}
const handleRequestConfig         = (options: ValueOf<RequestConfig>): void => {
    if ('browserInfo' in options) {
        browserInfo = options.browserInfo;
        
        
        
        // update already running workers:
        const requestConfig : RequestConfig = ['config', {browserInfo}];
        for (const {worker} of workerList) {
            worker.postMessage(requestConfig);
        } // for
    } // if
}
const handleRequestRender         = ([jobId, rules]: ValueOf<RequestRender>): void => {
    // push the new job:
    const newJobEntry : JobEntry = {jobId, rules};
    jobList.push(newJobEntry);
    
    
    
    // make sure all workers are running, so the promise will be resolved:
    for (let jobs = 0; jobs < jobList.length; jobs++) {
        const freeWorker = bookingWorker();
        if (!freeWorker) break; // there is no more free worker => stop searching
        
        
        
        // take a job and do it:
        takeJob(freeWorker); // calling `takeJob()` may cause the `jobList.length` reduced
    } // for
}
const handleResponseRendered      = (jobId : number, rendered : ValueOf<WorkerResponseRendered>) => {
    // forwards the responseRendered (with additional jobId) from worker to the main script:
    const responseRendered : ResponseRendered = ['rendered', [jobId, rendered]];
    self.postMessage(responseRendered);
}
const handleResponseRenderedError = (jobId : number, error    : ValueOf<WorkerResponseRenderedError>) => {
    // forwards the responseRenderedError (with additional jobId) from worker to the main script:
    const responseRenderedError : ResponseRenderedError = ['renderederr', [jobId, error]];
    self.postMessage(responseRenderedError);
}
const handleDone                  = (currentWorkerEntry : WorkerEntry) => {
    // cleanups:
    currentWorkerEntry.currentJob = null; // un-mark as busy
    
    
    
    // search for another job:
    takeJob(currentWorkerEntry);
}
const handleWorkerError           = (currentWorkerEntry : WorkerEntry, error: any) => {
    currentWorkerEntry.worker.terminate(); // kill the worker (suspected memory leak)
    
    // remove the worker from the list (may be re-created at `createWorkerEntryIfNeeded()`):
    const workerIndex = workerList.findIndex((searchWorkerEntry) => (searchWorkerEntry === currentWorkerEntry));
    if (workerIndex >= 0) workerList.splice(workerIndex, 1); // removeAt(workerIndex)
    
    
    
    // abort the unfinished job:
    const jobId = currentWorkerEntry.currentJob?.jobId;
    if (jobId !== undefined) {
        const errorParam : ValueOf<WorkerResponseRenderedError> = (
            ((error == null) || (error === undefined))
            ?
            (error as null|undefined)
            :
            (
                (error instanceof Error)
                ?
                error
                :
                `${error}`
            )
        );
        handleResponseRenderedError(jobId, errorParam);
    } // if
}
