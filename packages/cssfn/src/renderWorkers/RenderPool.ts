// internals:
import type {
    // types:
    ValueOf,
}                           from './WorkerBase-types.js'
import type {
    // requests:
    RequestAddWorker,
    RequestConfig,
    RequestRender,
    RequestRenderWithId,
    Request,
    
    
    
    // responses:
    ResponseRendered,
    ResponseRenderedError,
    Response,
}                           from './RenderPool-types.js'
import {
    // types:
    WorkerBaseConfigs,
    
    
    
    // worker:
    WorkerBase,
}                           from './WorkerBase.js'



export interface RenderPoolConfigs extends WorkerBaseConfigs {
    onRendered      ?: (jobId: number, rendered: ValueOf<ResponseRendered>  ) => void
    onRenderedError ?: (jobId: number, error: ValueOf<ResponseRenderedError>) => void
}
export class RenderPool extends WorkerBase<Request, Response> {
    // private properties:
    #configs : RenderPoolConfigs|undefined
    
    
    
    // constructors:
    constructor(scriptUrl: string|URL = new URL(/* webpackChunkName: 'renderPoolScript' */ /* webpackPreload: true */ './renderPoolScript.js', import.meta.url), options: WorkerOptions = { type: 'module' }, configs?: RenderPoolConfigs) {
        super(scriptUrl, options);
        
        
        
        // configs:
        this.#configs = configs;
    }
    
    
    
    // requests:
    postAddWorker(workerId: number, remotePort: MessagePort) {
        const requestAddWorker : RequestAddWorker = ['addworker', [workerId, remotePort]];
        this.postRequest(requestAddWorker, [remotePort]);
    }
    postConfig(options: ValueOf<RequestConfig>) {
        const requestConfig : RequestConfig = ['config', options];
        this.postRequest(requestConfig);
    }
    postRender(jobId: number, rules: ValueOf<RequestRender>) {
        const requestRender : RequestRenderWithId = ['render', [jobId, rules]];
        this.postRequest(requestRender);
    }
    
    
    
    // responses:
    handleResponse(event: MessageEvent<Response>): void {
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
    handleRendered(jobId: number, rendered: ValueOf<ResponseRendered>) {
        this.#configs?.onRendered?.(jobId, rendered)
    }
    handleRenderedError(jobId: number, error: ValueOf<ResponseRenderedError>) {
        this.#configs?.onRenderedError?.(jobId, error);
    }
}
