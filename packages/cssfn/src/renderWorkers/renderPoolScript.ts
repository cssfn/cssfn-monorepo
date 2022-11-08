// internals:
import type {
    // requests:
    Request,
    
    
    
    // responses:
    ResponseReady,
}                           from './RenderPool-types.js'



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
            return;
    } // switch
}
const handlePing = () => {
    postReady();
}



// notify the pool is ready:
postReady();
