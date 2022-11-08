// internals:
import type {
    // types:
    ValueOf,
}                           from './WorkerBase-types.js'
import type {
    // requests:
    RequestAddWorker,
    RequestErrorWorker,
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
    constructor(configs?: RenderPoolConfigs) {
        super(new URL(/* webpackChunkName: 'renderPoolScript' */ /* webpackPreload: true */ './renderPoolScript.js', import.meta.url), { type: 'module' });
        
        
        
        // configs:
        this.#configs = configs;
    }
    
    
    
    // requests:
    postAddWorker(workerId: number, remotePort: MessagePort) {
        const requestAddWorker : RequestAddWorker = ['addworker', [workerId, remotePort]];
        this.postRequest(requestAddWorker, [remotePort]);
    }
    postRemoveWorker(workerId: number, error: string|Error|null) {
        const requestErrorWorker : RequestErrorWorker = ['errworker', [workerId, error]];
        this.postRequest(requestErrorWorker);
    }
    
    postConfig(options: ValueOf<RequestConfig>) {
        const requestConfig : RequestConfig = ['config', options];
        this.postRequest(requestConfig);
    }
    postRequestRender(jobId: number, rules: ValueOf<RequestRender>) {
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
