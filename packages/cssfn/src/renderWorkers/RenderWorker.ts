// internals:
import type {
    // types:
    Request,
    Response,
}                           from './RenderWorker-types.js'
import {
    // worker:
    WorkerBase,
}                           from './WorkerBase.js'



export class RenderPool extends WorkerBase<Request, Response> {
    constructor(scriptUrl: string|URL = new URL(/* webpackChunkName: 'renderWorkerScript' */ /* webpackPreload: true */ './renderWorkerScript.js', import.meta.url), options: WorkerOptions = { type: 'module' }) {
        super(scriptUrl, options);
    }
    
    
    
    // responses:
    handleResponse(event: MessageEvent<Response>): void {
        super.handleResponse(event);
        
        
        
        const [type, payload] = event.data;
        switch (type) {
            case 'connect':
                this.handleConnect(payload);
                break;
            
            // case 'future...':
        } // switch
    }
    handleConnect(remotePort: MessagePort) {
    }
}
