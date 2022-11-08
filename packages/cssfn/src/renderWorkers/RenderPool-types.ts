// internals:
import type {
    // requests:
    Request  as BaseRequest,
    
    
    
    // responses:
    ResponseReady,
}                           from './WorkerBase-types.js'



// requests:
export type Request =
    |BaseRequest



// responses:
export { ResponseReady }
export type Response =
    |ResponseReady
