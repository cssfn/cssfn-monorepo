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



export interface RenderPoolConfigs extends WorkerBaseConfigs {
    onRendered      ?: (jobId: number, rendered: ValueOf<ResponseRendered>  ) => void
    onRenderedError ?: (jobId: number, error: ValueOf<ResponseRenderedError>) => void
}
export class RenderPool extends WorkerBase<Request, Response> {
    // private properties:
    #configs : RenderPoolConfigs|undefined
    
    
    
    // constructors:
    protected createWorker(): Worker {
        return new Worker(new URL(/* webpackChunkName: 'renderPoolScript' */ /* webpackPreload: true */ './renderPoolScript.js', import.meta.url), { type: 'module' });
    }
    constructor(configs?: RenderPoolConfigs) {
        super(configs);
        
        
        
        // configs:
        this.#configs = configs;
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
        this.#configs?.onRendered?.(jobId, rendered)
    }
    protected handleRenderedError(jobId: number, error: ValueOf<ResponseRenderedError>): void {
        this.#configs?.onRenderedError?.(jobId, error);
    }
}
