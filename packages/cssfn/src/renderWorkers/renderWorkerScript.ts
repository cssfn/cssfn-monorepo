// cssfn:
import {
    // utilities:
    createCssPropAutoPrefix,
}                           from '@cssfn/css-prop-auto-prefix'

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
    WorkerRequest,
    
    
    
    // responses:
    ResponseReady,
    ResponseConnectWorker,
    
    ResponseRendered,
    ResponseRenderedError,
    ResponseRenderedWithId,
    ResponseRenderedErrorWithId,
}                           from './RenderWorker-types.js'
import {
    decodeStyles,
}                           from './../cssfn-decoders.js'
import {
    renderRule,
}                           from './../renderRules.js'



// utilities:
const {port1: selfPort, port2: remotePort} = new MessageChannel();
let cssPropAutoPrefix : ReturnType<typeof createCssPropAutoPrefix>|undefined = undefined;



// responses:
const postReady = (): void => {
    const responseReady : ResponseReady = ['ready', undefined];
    self.postMessage(responseReady);
}
const postConnectWorker = (remotePort: MessagePort): void => {
    const responseConnectWorker : ResponseConnectWorker = ['connect', remotePort];
    self.postMessage(responseConnectWorker, [remotePort]);
}

const postRendered = (jobId: number, rendered: ValueOf<ResponseRendered>): void => {
    const responseRenderedWithId : ResponseRenderedWithId = ['rendered', [jobId, rendered]];
    selfPort.postMessage(responseRenderedWithId);
}
const postRenderedError = (jobId: number, error: ValueOf<ResponseRenderedError>): void => {
    const responseRenderedErrorWithId : ResponseRenderedErrorWithId = ['renderederr', [jobId, error]];
    selfPort.postMessage(responseRenderedErrorWithId);
}



// requests:
self.onmessage = (event: MessageEvent<Request>): void => {
    const [type, _payload] = event.data;
    switch (type) {
        case 'ping':
            handlePing();
            break;
    } // switch
}
const handlePing = (): void => {
    postReady();
}

selfPort.onmessage = (event: MessageEvent<WorkerRequest>): void => {
    const [type, payload] = event.data;
    switch (type) {
        case 'config':
            handleConfig(payload);
            break;
        case 'render':
            handleRequestRender(payload[0], payload[1]);
            break;
    } // switch
}
const handleConfig = (options: ValueOf<RequestConfig>): void => {
    const { browserInfo } = options;
    if (browserInfo) {
        cssPropAutoPrefix = createCssPropAutoPrefix(browserInfo);
    } // if
    
    /*
        ... other options may be added in the future
    */
}
const handleRequestRender = (jobId: number, rules: ValueOf<RequestRender>): void => {
    const scopeRules = decodeStyles(rules);
    
    
    
    let rendered: ReturnType<typeof renderRule> = null;
    try {
        rendered = renderRule(scopeRules, { cssPropAutoPrefix });
    }
    catch (error) {
        const errorParam : Error|string|null|undefined = (
            !error
            ?
            Error() // avoids null|undefined|empty_string => nullish
            :
            (
                (error instanceof Error)
                ?
                error
                :
                `${error}` // stringify
            )
        );
        postRenderedError(jobId, errorParam);
        return;
    } // try
    
    
    
    postRendered(jobId, rendered);
}



// notify the worker is ready:
postConnectWorker(remotePort);
