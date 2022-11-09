// internals:
import type {
    // types:
    ValueOf,
}                           from './WorkerBase-types.js'
import type {
    // requests:
    Request,
    
    RequestConfig,
    RequestRender,
    RequestRenderWithId,
    
    
    
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
let workerOptions: ValueOf<RequestConfig>|undefined = undefined;



// workers:
type WorkerEntry = {
    remotePort : MessagePort
    currentJob : JobEntry|null // the busy status
}
const workerList = new Map<number, WorkerEntry>();

const findFreeWorker = (workers: IterableIterator<WorkerEntry>): WorkerEntry|undefined => {
    for (const worker of workers) {
        if (worker.currentJob === null) return worker; // found jobless worker
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
const postReady = (): void => {
    const responseReady : ResponseReady = ['ready', undefined];
    self.postMessage(responseReady);
}
const postRendered = (jobId: number, rendered: ValueOf<ResponseRendered>): void => {
    const responseRenderedWithId : ResponseRenderedWithId = ['rendered', [jobId, rendered]];
    self.postMessage(responseRenderedWithId);
}
const postRenderedError = (jobId: number, error: ValueOf<ResponseRenderedError>): void => {
    const responseRenderedErrorWithId : ResponseRenderedErrorWithId = ['renderederr', [jobId, error]];
    self.postMessage(responseRenderedErrorWithId);
}

const handleRendered = (jobId: number, rendered: ValueOf<ResponseRendered>): void => {
    postRendered(jobId, rendered);
}
const handleRenderedError = (jobId: number, error: ValueOf<ResponseRenderedError>): void => {
    postRenderedError(jobId, error);
}



// requests:
self.onmessage = (event: MessageEvent<Request>): void => {
    const [type, payload] = event.data;
    switch (type) {
        case 'ping':
            handlePing();
            break;
        case 'config':
            handleConfig(payload);
            break;
        case 'render':
            handleRequestRender(payload[0], payload[1]);
            break;
        case 'addworker':
            handleAddWorker(payload[0], payload[1]);
            break;
        case 'errworker':
            handleErrorWorker(payload[0], payload[1])
            break;
    } // switch
}
const handlePing = (): void => {
    postReady();
}
const handleConfig = (options: ValueOf<RequestConfig>): void => {
    workerOptions = options;
    
    
    
    // update already running workers:
    for (const {remotePort} of workerList.values()) {
        postConfig(remotePort, options);
    } // for
}
const handleRequestRender = (jobId: number, rules: ValueOf<RequestRender>): void => {
    // push the new job:
    const newJobEntry : JobEntry = {jobId, rules};
    jobList.push(newJobEntry);
    
    
    
    // make sure all workers are running, so the jobs will be done:
    ensureWorkerRunning();
}
const handleAddWorker = (workerId: number, remotePort: MessagePort): void => {
    const newWorkerEntry : WorkerEntry = { remotePort, currentJob: null };
    workerList.set(workerId, newWorkerEntry);
    
    
    
    // configure:
    if (workerOptions) postConfig(remotePort, workerOptions);
    
    
    
    // responses:
    remotePort.onmessage = (event: MessageEvent<WorkerResponse>): void => {
        const [type, payload] = event.data;
        switch(type) {
            case 'rendered':
                handleDone();
                handleRendered(payload[0], payload[1]);
                break;
            case 'renderederr':
                handleDone();
                handleRenderedError(payload[0], payload[1]);
                break;
        } // switch
    }
    const handleDone = () => {
        // cleanups:
        newWorkerEntry.currentJob = null; // un-mark as busy
        
        
        
        // search for another job:
        takeJob(newWorkerEntry);
    }
    
    
    
    // take a job and do it:
    takeJob(newWorkerEntry);
}
const handleErrorWorker = (workerId: number, error: Error|string|null|undefined): void => {
    const worker = workerList.get(workerId);
    workerList.delete(workerId);
    
    
    
    // terminate the responses:
    worker?.remotePort?.close();
    
    
    
    // abort the unfinished job:
    const jobId = worker?.currentJob?.jobId;
    if (jobId !== undefined) {
        handleRenderedError(jobId, error);
    } // if
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
