// internals:
import type {
    // types:
    ValueOf,
}                           from './WorkerBase-types.js'
import {
    // types:
    WorkerBaseConfigs,
    
    
    
    // worker:
    WorkerBase,
}                           from './WorkerBase.js'
import type {
    // requests:
    RequestConfig,
    RequestRender,
    RequestRenderWithId,
    
    RequestAddWorker,
    RequestErrorWorker,
    Request,
    
    
    
    // responses:
    ResponseRendered,
    ResponseRenderedError,
    
    Response,
}                           from './RenderPool-types.js'



export interface RenderPoolConfigs extends WorkerBaseConfigs, ValueOf<RequestConfig> {
    onRendered      ?: (jobId: number, rendered: ValueOf<ResponseRendered>  ) => void
    onRenderedError ?: (jobId: number, error: ValueOf<ResponseRenderedError>) => void
}
export class RenderPool extends WorkerBase<Request, Response> {
    // private properties:
    private _configs2 : RenderPoolConfigs|undefined
    
    
    
    // constructors:
    protected createWorker(): Worker {
        return new Worker(new URL(/* webpackChunkName: 'renderPoolScript' */ /* webpackPreload: true */ './renderPoolScript.js', import.meta.url), { type: 'module' });
    }
    constructor(configs?: RenderPoolConfigs) {
        super(configs);
        
        
        
        // configs:
        this._configs2 = configs;
        if (configs && !this.isError) {
            const {
                onReady         : _onReady,         // remove
                onError         : _onError,         // remove
                onRendered      : _onRendered,      // remove
                onRenderedError : _onRenderedError, // remove
            ...restConfigs} = configs;
            
            this.postConfig(restConfigs);
        } // if
    }
    
    
    
    // requests:
    protected postConfig(options: ValueOf<RequestConfig>): void {
        const requestConfig : RequestConfig = ['config', options];
        this.postRequest(requestConfig);
    }
    protected postRequestRender(jobId: number, rules: ValueOf<RequestRender>): void {
        const requestRender : RequestRenderWithId = ['render', [jobId, rules]];
        this.postRequest(requestRender);
    }
    
    protected postAddWorker(workerId: number, remotePort: MessagePort): void {
        const requestAddWorker : RequestAddWorker = ['addworker', [workerId, remotePort]];
        this.postRequest(requestAddWorker, [remotePort]);
    }
    protected postErrorWorker(workerId: number, error: Error|string|null|undefined): void {
        const requestErrorWorker : RequestErrorWorker = ['errworker', [workerId, error]];
        this.postRequest(requestErrorWorker);
    }
    
    
    
    // responses:
    protected handleResponse(event: MessageEvent<Response>): void {
        super.handleResponse(event);
        
        
        
        const [type, payload] = event.data;
        switch (type) {
            case 'rendered':
                this.handleRendered(payload[0], payload[1]);
                break;
            case 'renderederr':
                this.handleRenderedError(payload[0], payload[1]);
                break;
        } // switch
    }
    protected handleRendered(jobId: number, rendered: ValueOf<ResponseRendered>): void {
        this._configs2?.onRendered?.(jobId, rendered)
    }
    protected handleRenderedError(jobId: number, error: ValueOf<ResponseRenderedError>): void {
        this._configs2?.onRenderedError?.(jobId, error);
    }
    
    
    
    // public methods:
    requestRender(jobId: number, rules: ValueOf<RequestRender>): void {
        this.postRequestRender(jobId, rules);
    }
    
    addWorker(workerId: number, remotePort: MessagePort): void {
        this.postAddWorker(workerId, remotePort);
    }
    errorWorker(workerId: number, error: Error|string|null|undefined): void {
        this.postErrorWorker(workerId, error);
    }
}
