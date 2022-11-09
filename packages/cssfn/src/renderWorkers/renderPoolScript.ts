// internals:
import type {
    // types:
    ValueOf,
}                           from './WorkerBase-types.js'
import type {
    // requests:
    RequestConfig,
    RequestRender,
    RequestRenderWithId,
    Request,
    
    
    
    // responses:
    ResponseReady,
}                           from './RenderPool-types.js'
import type {
    // responses:
    ResponseRendered,
    ResponseRenderedError,
    ResponseRenderedWithId,
    ResponseRenderedErrorWithId,
    WorkerResponse,
}                           from './RenderWorker-types.js'



// utilities:
let workerConfig: ValueOf<RequestConfig>|undefined = undefined;



// workers:
type WorkerEntry = {
    remotePort : MessagePort
    currentJob : JobEntry|null // the busy status
}
const workerList = new Map<number, WorkerEntry>();

const findFreeWorker = (workers: IterableIterator<WorkerEntry>): WorkerEntry|undefined => {
    for (const worker of workers) {
        if (worker.currentJob === null) return worker; // found
    } // for
    
    return undefined; // not found
}
const bookingWorker = (): WorkerEntry|null => {
    return (
        findFreeWorker(workerList.values()) // take the non_busy worker (if any)
        ??
        null                                // no new worker available
    );
}
const ensureWorkerRunning = () => {
    for (let jobs = 0; jobs < jobList.length; jobs++) {
        const freeWorker = bookingWorker();
        if (!freeWorker) break; // there is no more free worker => stop searching
        
        
        
        // take a job and do it:
        takeJob(freeWorker); // calling `takeJob()` may cause the `jobList.length` reduced
    } // for
}



// jobs:
type JobEntry = {
    jobId : number
    rules : ValueOf<RequestRender>,
}
const jobList : JobEntry[] = [];

const takeJob = (workerEntry: WorkerEntry): boolean => {
    const job = jobList.shift(); // take the oldest queued job
    if (!job) return false; // no job available => nothing to do => idle
    
    
    
    // setups:
    workerEntry.currentJob = job; // mark as busy
    postRequestRender(workerEntry.remotePort, job.jobId, job.rules);
    
    
    
    // delegation is complete:
    return true;
}



// responses:
const postReady = () => {
    const responseReady : ResponseReady = ['ready', undefined];
    postMessage(responseReady);
}
const postRendered = (jobId: number, rendered: ValueOf<ResponseRendered>) => {
    const responseRenderedWithId : ResponseRenderedWithId = ['rendered', [jobId, rendered]];
    postMessage(responseRenderedWithId);
}
const postRenderedError = (jobId: number, error: Error|string|null|undefined) => {
    const responseRenderedErrorWithId : ResponseRenderedErrorWithId = ['renderederr', [jobId, error]];
    postMessage(responseRenderedErrorWithId);
}

const handleRendered = (jobId: number, rendered: ValueOf<ResponseRendered>) => {
    postRendered(jobId, rendered);
}
const handleRenderedError = (jobId: number, error: ValueOf<ResponseRenderedError>) => {
    postRenderedError(jobId, error);
}



// requests:
self.onmessage = (event: MessageEvent<Request>): void => {
    const [type, payload] = event.data;
    switch (type) {
        case 'ping':
            handlePing();
            break;
        case 'addworker':
            handleAddWorker(payload[0], payload[1]);
            break;
        case 'errworker':
            handleErrorWorker(payload[0], payload[1])
            break;
        case 'config':
            handleConfig(payload);
            break;
        case 'render':
            handleRequestRender(payload[0], payload[1]);
            break;
    } // switch
}
const handlePing = () => {
    postReady();
}
const handleAddWorker = (workerId: number, remotePort: MessagePort) => {
    workerList.set(workerId, { remotePort, currentJob: null });
    
    
    
    // configure:
    if (workerConfig) postConfig(remotePort, workerConfig);
    
    
    
    // responses:
    remotePort.onmessage = (event: MessageEvent<WorkerResponse>): void => {
        const [type, payload] = event.data;
        switch(type) {
            case 'rendered':
                handleRendered(payload[0], payload[1]);
                break;
            case 'renderederr':
                handleRenderedError(payload[0], payload[1]);
                break;
        } // switch
    }
    
    
    
    // make sure all workers are running, so the promise will be resolved:
    ensureWorkerRunning();
}
const handleErrorWorker = (workerId: number, error: Error|string|null|undefined) => {
    const worker = workerList.get(workerId);
    workerList.delete(workerId);
    
    
    
    // terminate the responses:
    worker?.remotePort.close();
    
    
    
    // abort the unfinished job:
    const jobId = worker?.currentJob?.jobId;
    if (jobId !== undefined) {
        handleRenderedError(jobId, error);
    } // if
}
const handleConfig = (options: ValueOf<RequestConfig>) => {
    workerConfig = options;
    
    
    
    // update already running workers:
    for (const {remotePort} of workerList.values()) {
        postConfig(remotePort, options);
    } // for
}
const handleRequestRender = (jobId: number, rules: ValueOf<RequestRender>) => {
    // push the new job:
    const newJobEntry : JobEntry = {jobId, rules};
    jobList.push(newJobEntry);
    
    
    
    // make sure all workers are running, so the promise will be resolved:
    ensureWorkerRunning();
}

const postConfig = (remotePort: MessagePort, options: ValueOf<RequestConfig>) => {
    const requestConfig : RequestConfig = ['config', options];
    remotePort.postMessage(requestConfig);
}
const postRequestRender = (remotePort: MessagePort, jobId: number, rules: ValueOf<RequestRender>) => {
    const requestRenderWithId : RequestRenderWithId = ['render', [jobId, rules]];
    remotePort.postMessage(requestRenderWithId);
}



// notify the pool is ready:
postReady();
