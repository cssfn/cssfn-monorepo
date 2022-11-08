// cssfn:
import {
    // types:
    BrowserInfo,
    
    
    
    // utilities:
    createCssPropAutoPrefix,
}                           from '@cssfn/css-prop-auto-prefix'

// internals:
import type {
    // types:
    Tuple,
    NameOf,
    ValueOf,
    
    
    
    // requests:
    Request  as BaseRequest,
    
    
    
    // responses:
    ResponseReady,
}                           from './WorkerBase-types.js'
import type {
    EncodedCssStyleCollection,
}                           from './../cssfn-encoded-types.js'
import {
    decodeStyles,
}                           from './../cssfn-decoders.js'
import {
    renderRule,
}                           from './../renderRules.js'



// types:
export type TupleWithId<TData extends Tuple<any, any>> = Tuple<NameOf<TData>, Tuple<number, ValueOf<TData>>>

export interface ConfigOptions {
    browserInfo ?: BrowserInfo
}



// requests:
export type RequestAddWorker            = Tuple<'addworker', Tuple<number, MessagePort>>
export type RequestErrorWorker          = Tuple<'errworker', Tuple<number, string|Error|null>>
export type RequestConfig               = Tuple<'config', ConfigOptions>
export type RequestRender               = Tuple<'render', EncodedCssStyleCollection>
export type RequestRenderWithId         = TupleWithId<RequestRender>
export type Request =
    |BaseRequest
    |RequestAddWorker
    |RequestErrorWorker
    |RequestConfig
    |RequestRenderWithId



// responses:
export { ResponseReady }
export type ResponseRendered            = Tuple<'rendered'   , ReturnType<typeof renderRule>>
export type ResponseRenderedError       = Tuple<'renderederr', Error|string|null|undefined>
export type ResponseRenderedWithId      = TupleWithId<ResponseRendered>
export type ResponseRenderedErrorWithId = TupleWithId<ResponseRenderedError>
export type Response =
    |ResponseReady
    |ResponseRenderedWithId
    |ResponseRenderedErrorWithId
