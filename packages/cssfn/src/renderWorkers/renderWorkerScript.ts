// internals:
import type {
    // requests:
    Request,
    
    
    
    // responses:
    ResponseReady,
    ResponseConnect,
}                           from './RenderWorker-types.js'



// connectors:
const channel = new MessageChannel();



// responses:
const postReady = () => {
    const responseReady : ResponseReady = ['ready', undefined];
    postMessage(responseReady);
}
const postConnect = (remotePort: MessagePort) => {
    const responseConnect : ResponseConnect = ['connect', remotePort];
    postMessage(responseConnect);
}



// requests:
self.onmessage = (event: MessageEvent<Request>): void => {
    const [type, payload] = event.data;
    switch (type) {
        case 'ping':
            handlePing();
            return;
    } // switch
}
const handlePing = () => {
    postReady();
}



// notify the worker is ready:
postConnect(channel.port2);
