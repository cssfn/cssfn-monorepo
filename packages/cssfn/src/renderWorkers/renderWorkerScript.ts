// internals:
import type {
    // requests:
    Request,
    
    
    
    // responses:
    ResponseReady,
}                           from './RenderWorker-types.js'



// connectors:
const channel = new MessageChannel();



// handlers:
self.onmessage = (event: MessageEvent<Request>): void => {
    const [type, payload] = event.data;
    switch (type) {
        case 'ping':
            handlePing();
            return;
    } // switch
}
const handlePing = (port2: MessagePort|undefined = undefined) => {
    if (port2) {
        const responseReady : ResponseReady = ['ready', port2];
        self.postMessage(responseReady, [port2]);
    }
    else {
        const responseReady : ResponseReady = ['ready', undefined];
        self.postMessage(responseReady);
    } // if
}



// notify the worker is ready:
handlePing(channel.port2);
