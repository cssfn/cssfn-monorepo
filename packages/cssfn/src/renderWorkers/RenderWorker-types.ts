// cssfn:
import type {
    // types:
    BrowserInfo,
}                           from '@cssfn/css-prop-auto-prefix'

// internals:
import type {
    // types:
    Tuple,
    NameOf,
    ValueOf,
    
    
    
    // requests:
    RequestPing,
    Request  as BaseRequest,
    
    
    
    // responses:
    ResponseReady,
    Response as BaseResponse,
}                           from './WorkerBase-types.js'
import type {
    EncodedCssStyleCollection,
}                           from './../cssfn-encoded-types.js'
import type {
    renderRule,
}                           from './../renderRules.js'



// types:
export type TupleWithId<TData extends Tuple<any, any>> = Tuple<NameOf<TData>, Tuple<number, ValueOf<TData>>>

export interface RenderOptions {
    browserInfo ?: BrowserInfo
}



// requests:
export type {
    RequestPing,
}
export type Request =
    |BaseRequest

export type RequestConfig               = Tuple<'config', RenderOptions>
export type RequestRender               = Tuple<'render', EncodedCssStyleCollection>
export type RequestRenderWithId         = TupleWithId<RequestRender>
export type WorkerRequest =
    |RequestConfig
    |RequestRenderWithId



// responses:
export type {
    ResponseReady,
}
export type ResponseConnectWorker = Tuple<'connect', MessagePort>
export type Response =
    |BaseResponse
    |ResponseConnectWorker

export type ResponseRendered            = Tuple<'rendered'   , ReturnType<typeof renderRule>>
export type ResponseRenderedError       = Tuple<'renderederr', Error|string|null|undefined>
export type ResponseRenderedWithId      = TupleWithId<ResponseRendered>
export type ResponseRenderedErrorWithId = TupleWithId<ResponseRenderedError>
export type WorkerResponse =
    |ResponseRenderedWithId
    |ResponseRenderedErrorWithId
