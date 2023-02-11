// internals:
import {
    // types:
    WorkerBaseConfigs,
    
    
    
    // worker:
    WorkerBase,
}                           from './WorkerBase.js'
import type {
    // requests:
    Request,
    
    
    
    // responses:
    Response,
}                           from './RenderWorker-types.js'



let workerCounter = 0;



export interface RenderWorkerConfigs extends WorkerBaseConfigs {
    onConnectWorker ?: (workerId: number, remotePort: MessagePort           ) => void
    onErrorWorker   ?: (workerId: number, error: Error|string|null|undefined) => void
}
export class RenderWorker extends WorkerBase<Request, Response> {
    // private properties:
    private _configs2  : RenderWorkerConfigs|undefined
    private _workerId : number
    
    
    
    // constructors:
    protected createWorker(): Worker {
        return new Worker(new URL(/* webpackChunkName: 'renderWorkerScript' */ /* webpackPreload: true */ './renderWorkerScript.js', import.meta.url), { type: 'module' });
    }
    constructor(configs?: RenderWorkerConfigs) {
        super(configs);
        
        
        
        // configs:
        this._configs2 = configs;
        
        workerCounter++; if (workerCounter >= Number.MAX_SAFE_INTEGER) workerCounter = 0;
        this._workerId = workerCounter;
    }
    
    
    
    // responses:
    protected handleResponse(event: MessageEvent<Response>): void {
        super.handleResponse(event);
        
        
        
        const [type, payload] = event.data;
        switch (type) {
            case 'connect':
                this.handleConnectWorker(payload);
                break;
            // case 'future...':
        } // switch
    }
    protected handleConnectWorker(remotePort: MessagePort): void {
        this._configs2?.onConnectWorker?.(this._workerId, remotePort);
    }
    protected handleError(error: Error|string|null|undefined): void {
        super.handleError(error);
        
        
        
        this.handleErrorWorker(error);
    }
    protected handleErrorWorker(error: Error|string|null|undefined): void {
        this._configs2?.onErrorWorker?.(this._workerId, error);
    }
}
