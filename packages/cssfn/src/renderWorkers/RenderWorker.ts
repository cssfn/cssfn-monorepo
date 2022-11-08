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
    onErrorWorker   ?: (workerId: number, error: string|Error|null) => void
}
export class RenderWorker extends WorkerBase<Request, Response> {
    // private properties:
    #configs  : RenderWorkerConfigs|undefined
    #workerId : number
    
    
    
    // constructors:
    constructor(configs?: RenderWorkerConfigs) {
        super(new URL(/* webpackChunkName: 'renderWorkerScript' */ /* webpackPreload: true */ './renderWorkerScript.js', import.meta.url), { type: 'module' }, configs);
        
        
        
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
    handleError(error: string|Error|null): void {
        super.handleError(error);
        
        this.handleErrorWorker(error);
    }
    handleErrorWorker(error: string|Error|null) {
        this.#configs?.onErrorWorker?.(this.#workerId, error);
    }
}
