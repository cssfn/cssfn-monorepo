// cssfn:
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
    ValueOf,
    
    RequestConfig,
    RequestRender,
    
    ResponseRendered,
    ResponseRenderedError,
    Response,
}                           from './renderStyleSheetsPool.js'



// workers:
const supportsWorker = (typeof(Worker) !== 'undefined');
const createWorkerPool = () : Worker|null => {
    // conditions:
    if (!supportsWorker) return null; // not_support_worker => no worker can be created
    
    
    
    try {
        // try to create a new worker with esm module:
        const newWorkerInstance = new Worker(new URL('./renderStyleSheetsPool.js', import.meta.url), { type: 'module' });
        
        
        
        // handlers:
        newWorkerInstance.onmessage = (event: MessageEvent<Response>) => {
            const [type, payload] = event.data;
            switch(type) {
                case 'rendered':
                    handleResponseRendered(payload);
                    break;
                case 'renderederr':
                    handleResponseRenderedError(payload);
                    break;
            } // switch
        }
        newWorkerInstance.onerror = (event: ErrorEvent) => {
            handleWorkerError(event);
        }
        
        
        
        // configure:
        const requestConfig : RequestConfig = ['config', {browserInfo}];
        newWorkerInstance.postMessage(requestConfig);
        
        
        
        // ready:
        return newWorkerInstance;
    }
    catch {
        return null; // the worker doesn't support esm module => no worker can be created
    } // try
}
let workerPool = createWorkerPool();



// processors:
type ResolveCallback = (result: ReturnType<typeof renderStyleSheet>) => void
type RejectCallback  = (reason?: any) => void
type JobEntry = {
    resolve : ResolveCallback
    reject  : RejectCallback
}
const jobList = new Map<number, JobEntry>();
let jobCounter = 0;



export const renderStyleSheetAsync = async <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): Promise<ReturnType<typeof renderStyleSheet>> => {
    // conditions:
    if (!styleSheet.enabled) return null; // the styleSheet is disabled => no need to render
    if (!workerPool) return renderStyleSheet(styleSheet); // not_support_worker => fallback to sync mode
    
    
    
    // generate (scope) Rule(s) from styleSheet:
    const scopeRules    = generateRulesFromStyleSheet(styleSheet);
    
    // encode the (scope) Rule(s), so the data can be transfered to web worker:
    const encodedStyles = encodeStyles(scopeRules);
    
    
    
    // push the new job:
    jobCounter++; if (jobCounter >= Number.MAX_SAFE_INTEGER) jobCounter = 0;
    const jobId = jobCounter;
    
    const renderPromise = new Promise<ReturnType<typeof renderStyleSheet>>((resolve: ResolveCallback, reject: RejectCallback) => {
        const newJobEntry : JobEntry = {resolve, reject};
        jobList.set(jobId, newJobEntry);
    });
    
    
    
    // delegate the render to the workerPool:
    const requestRender : RequestRender = ['render', [jobId, encodedStyles]];
    workerPool.postMessage(requestRender);
    
    
    
    // the workerPool is currently working, we will notify you if it done:
    return renderPromise;
}



// handlers:
const handleResponseRendered      = ([jobId, rendered] : ValueOf<ResponseRendered>) => {
    const currentJob = jobList.get(jobId);
    if (currentJob) {
        jobList.delete(jobId); // the job was finished as succeeded => remove from the list
        
        
        
        currentJob.resolve(rendered); // the job was finished as succeeded => resolve
    } // if
}
const handleResponseRenderedError = ([jobId, error   ] : ValueOf<ResponseRenderedError>) => {
    const currentJob = jobList.get(jobId);
    if (currentJob) {
        jobList.delete(jobId); // the job was finished as failed => remove from the list
        
        
        
        currentJob.reject(error); // the job was finished as failed => reject
    } // if
}
const handleWorkerError           = (error : any) => {
    workerPool?.terminate(); // kill the worker (suspected memory leak)
    workerPool = null; // no worker available => fallback to sync mode
    
    
    
    // abort the unfinished jobs:
    for (const {reject} of jobList.values()) reject(error);
    jobList.clear();
}
