// internals:
import type {
    // requests:
    Request,
    
    
    
    // responses:
    Response,
}                           from './RenderWorker-types.js'
import {
    // types:
    WorkerBaseConfigs,
    
    
    
    // worker:
    WorkerBase,
}                           from './WorkerBase.js'



export interface RenderWorkerConfigs extends WorkerBaseConfigs {
    onConnect ?: (remotePort: MessagePort) => void
}
export class RenderWorker extends WorkerBase<Request, Response> {
    // private properties:
    #configs : RenderWorkerConfigs|undefined
    
    
    
    // constructors:
    constructor(scriptUrl: string|URL = new URL(/* webpackChunkName: 'renderWorkerScript' */ /* webpackPreload: true */ './renderWorkerScript.js', import.meta.url), options: WorkerOptions = { type: 'module' }, configs?: RenderWorkerConfigs) {
        super(scriptUrl, options, configs);
        
        
        
        // configs:
        this.#configs = configs;
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
        this.#configs?.onConnect?.(remotePort);
    }
}
