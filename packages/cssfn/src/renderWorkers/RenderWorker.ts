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



let workerCounter = 0;



export interface RenderWorkerConfigs extends WorkerBaseConfigs {
    onConnectWorker ?: (workerId: number, remotePort: MessagePort) => void
}
export class RenderWorker extends WorkerBase<Request, Response> {
    // private properties:
    #configs  : RenderWorkerConfigs|undefined
    #workerId : number
    
    
    
    // constructors:
    constructor(scriptUrl: string|URL = new URL(/* webpackChunkName: 'renderWorkerScript' */ /* webpackPreload: true */ './renderWorkerScript.js', import.meta.url), options: WorkerOptions = { type: 'module' }, configs?: RenderWorkerConfigs) {
        super(scriptUrl, options, configs);
        
        
        
        // configs:
        this.#configs = configs;
        
        workerCounter++; if (workerCounter >= Number.MAX_SAFE_INTEGER) workerCounter = 0;
        this.#workerId = workerCounter;
    }
    
    
    
    // responses:
    handleResponse(event: MessageEvent<Response>): void {
        super.handleResponse(event);
        
        
        
        const [type, payload] = event.data;
        switch (type) {
            case 'connect':
                this.handleConnectWorker(payload);
                break;
            // case 'future...':
        } // switch
    }
    handleConnectWorker(remotePort: MessagePort) {
        this.#configs?.onConnectWorker?.(this.#workerId, remotePort);
    }
}
