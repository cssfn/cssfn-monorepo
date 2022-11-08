// internals:
import type {
    // types:
    Tuple,
    
    
    
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
export type ResponseConnect = Tuple<'connect', MessagePort>
export type Response =
    |ResponseReady
    |ResponseConnect
