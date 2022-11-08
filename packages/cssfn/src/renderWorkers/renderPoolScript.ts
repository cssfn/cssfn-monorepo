// cssfn:
import type {
    // types:
    BrowserInfo,
}                           from '@cssfn/css-prop-auto-prefix'

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



// utilities:
let browserInfo: BrowserInfo|undefined = undefined;



// workers:
type WorkerEntry = {
    remotePort : MessagePort
    currentJob : JobEntry|null // the busy status
}
const workerList = new Map<number, WorkerEntry>();



// jobs:
type JobEntry = {
    jobId : number
    rules : ValueOf<RequestRender>,
}
const jobList : JobEntry[] = [];



// responses:
const postReady = () => {
    const responseReady : ResponseReady = ['ready', undefined];
    postMessage(responseReady);
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
            handleRender(payload[0], payload[1]);
            break;
    } // switch
}
const handlePing = () => {
    postReady();
}
const handleAddWorker = (workerId: number, remotePort: MessagePort) => {
    workerList.set(workerId, { remotePort, currentJob: null });
}
const handleErrorWorker = (workerId: number, error: string|Error|null) => {
    const worker = workerList.get(workerId);
    workerList.delete(workerId);
    
    
    
    // abort the unfinished job:
    const jobId = worker?.currentJob?.jobId;
    if (jobId !== undefined) {
        handleRenderedError(jobId, error);
    } // if
}
const handleConfig = (options: ValueOf<RequestConfig>) => {
    if ('browserInfo' in options) {
        browserInfo = options.browserInfo;
        
        
        
        // TODO:
        // // update already running workers:
        // const requestConfig : RequestConfig = ['config', {browserInfo}];
        // for (const {worker} of workerList) {
        //     worker.postMessage(requestConfig);
        // } // for
    } // if
}
const handleRender = (jobId: number, rules: ValueOf<RequestRender>) => {
}



// notify the pool is ready:
postReady();
