// internals:
import type {
    // requests:
    Request,
    
    
    
    // responses:
    ResponseReady,
    ResponseConnectWorker,
}                           from './RenderWorker-types.js'



// connectors:
const channel = new MessageChannel();



// responses:
const postReady = () => {
    const responseReady : ResponseReady = ['ready', undefined];
    postMessage(responseReady);
}
const postConnect = (remotePort: MessagePort) => {
    const responseConnectWorker : ResponseConnectWorker = ['connect', remotePort];
    postMessage(responseConnectWorker);
}



// requests:
self.onmessage = (event: MessageEvent<Request>): void => {
    const [type, payload] = event.data;
    switch (type) {
        case 'ping':
            handlePing();
            break;
    } // switch
}
const handlePing = () => {
    postReady();
}



// notify the worker is ready:
postConnect(channel.port2);
