// internals:
import type {
    // types:
    Request,
    Response,
}                           from './RenderPool-types.js'
import {
    // types:
    WorkerBaseConfigs,
    
    
    
    // worker:
    WorkerBase,
}                           from './WorkerBase.js'



export interface RenderPoolConfigs extends WorkerBaseConfigs {
    onConnect ?: (remotePort: MessagePort) => void
}
export class RenderPool extends WorkerBase<Request, Response> {
    // private properties:
    #configs : RenderPoolConfigs|undefined
    
    
    
    constructor(scriptUrl: string|URL = new URL(/* webpackChunkName: 'renderPoolScript' */ /* webpackPreload: true */ './renderPoolScript.js', import.meta.url), options: WorkerOptions = { type: 'module' }, configs?: RenderPoolConfigs) {
        super(scriptUrl, options);
        
        
        
        // configs:
        this.#configs = configs;
    }
}
