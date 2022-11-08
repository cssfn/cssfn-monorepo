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
    RequestConfig,
    RequestRender,
    Request,
    
    WorkerRequest,
    
    
    
    // responses:
    ResponseReady,
    ResponseConnectWorker,
    
    ResponseRendered,
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
const channel = new MessageChannel();
let cssPropAutoPrefix : ReturnType<typeof createCssPropAutoPrefix>|undefined = undefined;



// responses:
const postReady = () => {
    const responseReady : ResponseReady = ['ready', undefined];
    postMessage(responseReady);
}
const postConnect = (remotePort: MessagePort) => {
    const responseConnectWorker : ResponseConnectWorker = ['connect', remotePort];
    postMessage(responseConnectWorker);
}

const postRendered = (jobId: number, rendered: ValueOf<ResponseRendered>) => {
    const responseRenderedWithId : ResponseRenderedWithId = ['rendered', [jobId, rendered]];
    channel.port1.postMessage(responseRenderedWithId);
}
const postRenderedError = (jobId: number, error: Error|string|null|undefined) => {
    const responseRenderedErrorWithId : ResponseRenderedErrorWithId = ['renderederr', [jobId, error]];
    channel.port1.postMessage(responseRenderedErrorWithId);
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
const handlePing = () => {
    postReady();
}

channel.port1.onmessage = (event: MessageEvent<WorkerRequest>): void => {
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
const handleConfig = (options: ValueOf<RequestConfig>) => {
    const { browserInfo } = options;
    if (browserInfo) {
        cssPropAutoPrefix = createCssPropAutoPrefix(browserInfo);
    } // if
    
    /*
        ... other options may be added in the future
    */
}
const handleRequestRender = (jobId: number, rules: ValueOf<RequestRender>) => {
    const scopeRules = decodeStyles(rules);
    
    
    
    let rendered: ReturnType<typeof renderRule> = null;
    try {
        rendered = renderRule(scopeRules, { cssPropAutoPrefix });
    }
    catch (error: any) {
        postRenderedError(jobId, error);
        return;
    } // try
    
    
    
    postRendered(jobId, rendered);
}



// notify the worker is ready:
postConnect(channel.port2);
