// internals:
import type {
    // requests:
    Request,
    
    
    
    // responses:
    ResponseReady,
}                           from './RenderPool-types.js'



// handlers:
self.onmessage = (event: MessageEvent<Request>): void => {
    const [type, payload] = event.data;
    switch (type) {
        case 'ping':
            handlePing();
            return;
    } // switch
}
const handlePing = () => {
    const responseReady : ResponseReady = ['ready', undefined];
    self.postMessage(responseReady);
}



// notify the worker is ready:
handlePing();
