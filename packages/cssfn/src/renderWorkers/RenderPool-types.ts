// internals:
import type {
    // types:
    Tuple,
    
    
    
    // requests:
    Request  as BaseRequest,
    
    
    
    // responses:
    Response as BaseResponse,
}                           from './WorkerBase-types.js'
import type {
    // requests:
    RequestPing,
    
    RequestConfig,
    RequestRender,
    RequestRenderWithId,
    WorkerRequest,
    
    
    
    // responses:
    ResponseReady,
    
    ResponseRendered,
    ResponseRenderedError,
    ResponseRenderedWithId,
    ResponseRenderedErrorWithId,
    WorkerResponse,
}                           from './RenderWorker-types.js'



// requests:
export type {
    RequestPing,
    
    RequestConfig,
    RequestRender,
    RequestRenderWithId,
}
export type RequestAddWorker   = Tuple<'addworker', Tuple<number, MessagePort>>
export type RequestErrorWorker = Tuple<'errworker', Tuple<number, string|Error|null>>
export type Request =
    |BaseRequest
    |WorkerRequest
    |RequestAddWorker
    |RequestErrorWorker



// responses:
export type {
    ResponseReady,
    
    ResponseRendered,
    ResponseRenderedError,
    ResponseRenderedWithId,
    ResponseRenderedErrorWithId,
}
export type Response =
    |BaseResponse
    |WorkerResponse
