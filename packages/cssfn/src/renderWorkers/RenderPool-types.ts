// internals:
import type {
    // types:
    Tuple,
    
    
    
    // requests:
    Request  as BaseRequest,
    
    
    
    // responses:
    ResponseReady,
}                           from './WorkerBase-types.js'
import type {
    // requests:
    RequestConfig,
    RequestRender,
    RequestRenderWithId,
    
    
    
    // responses:
    ResponseRendered,
    ResponseRenderedError,
    ResponseRenderedWithId,
    ResponseRenderedErrorWithId,
}                           from './RenderWorker-types.js'



// requests:
export {
    RequestConfig,
    RequestRender,
    RequestRenderWithId,
}
export type RequestAddWorker   = Tuple<'addworker', Tuple<number, MessagePort>>
export type RequestErrorWorker = Tuple<'errworker', Tuple<number, string|Error|null>>
export type Request =
    |BaseRequest
    |RequestAddWorker
    |RequestErrorWorker
    |RequestConfig
    |RequestRenderWithId



// responses:
export { ResponseReady }
export {
    ResponseRendered,
    ResponseRenderedError,
    ResponseRenderedWithId,
    ResponseRenderedErrorWithId,
}
export type Response =
    |ResponseReady
    |ResponseRenderedWithId
    |ResponseRenderedErrorWithId
