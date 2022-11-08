// internals:
import type {
    // types:
    Tuple,
    NameOf,
    
    
    
    // requests:
    Request  as BaseRequest,
    
    
    
    // responses:
    ResponseReady as BaseResponseReady,
}                           from './WorkerBase-types.js'



// requests:
export type Request =
    |BaseRequest



// responses:
export type ResponseReady = Tuple<NameOf<BaseResponseReady>, MessagePort|undefined>
export type Response =
    |ResponseReady
