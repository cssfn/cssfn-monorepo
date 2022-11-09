// types:
export type Tuple<TName, TValue>  = readonly [TName, TValue]
export type NameOf <TTuple extends Tuple<any, any>> = TTuple[0]
export type ValueOf<TTuple extends Tuple<any, any>> = TTuple[1]



// requests:
export type RequestPing   = Tuple<'ping', undefined>
export type Request =
    |RequestPing



// responses:
export type ResponseReady = Tuple<'ready', undefined>
export type Response =
    |ResponseReady
