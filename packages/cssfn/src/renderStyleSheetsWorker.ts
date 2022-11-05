// cssfn:
import {
    // types:
    BrowserInfo,
    
    
    
    // utilities:
    createCssPropAutoPrefix,
}                           from '@cssfn/css-prop-auto-prefix'

// internals:
import type {
    EncodedCssStyleCollection,
}                           from './cssfn-encoded-types.js'
import {
    decodeStyles,
}                           from './cssfn-decoders.js'
import {
    renderRule,
}                           from './renderRules.js'



// types:
export interface ConfigOptions {
    browserInfo ?: BrowserInfo
}

export type Tuple<TName, TValue>  = readonly [TName, TValue]
export type NameOf <TTuple extends Tuple<any, any>> = TTuple[0]
export type ValueOf<TTuple extends Tuple<any, any>> = TTuple[1]

export type RequestConfig         = Tuple<'config', ConfigOptions>
export type RequestRender         = Tuple<'render', EncodedCssStyleCollection>
export type Request =
    |RequestConfig
    |RequestRender

export type ResponseReady         = Tuple<'ready'      , undefined>
export type ResponseRendered      = Tuple<'rendered'   , ReturnType<typeof renderRule>>
export type ResponseRenderedError = Tuple<'renderederr', Error|string|null|undefined>
export type Response =
    |ResponseReady
    |ResponseRendered
    |ResponseRenderedError



// utilities:
let cssPropAutoPrefix : ReturnType<typeof createCssPropAutoPrefix>|undefined = undefined;



// handlers:
self.onmessage = (event: MessageEvent<Request>) => {
    const [type, payload] = event.data;
    switch (type) {
        case 'config':
            handleRequestConfig(payload);
            break;
        case 'render':
            handleRequestRender(payload);
            break;
    } // switch
}
const handleRequestConfig = (options: ValueOf<RequestConfig>): void => {
    const { browserInfo } = options;
    if (browserInfo) {
        cssPropAutoPrefix = createCssPropAutoPrefix(browserInfo);
    } // if
    
    /*
        ... other options may be added in the future
    */
}
const handleRequestRender = (rules: ValueOf<RequestRender>): void => {
    const scopeRules = decodeStyles(rules);
    
    
    
    let rendered: ReturnType<typeof renderRule> = null;
    try {
        rendered = renderRule(scopeRules, { cssPropAutoPrefix });
    }
    catch (error: any) {
        const errorParam = (
            ((error == null) || (error === undefined))
            ?
            (error as null|undefined)
            :
            (
                (error instanceof Error)
                ?
                error
                :
                `${error}`
            )
        );
        const responseRenderedError : ResponseRenderedError = ['renderederr', errorParam];
        self.postMessage(responseRenderedError);
        return;
    } // try
    
    
    
    const responseRendered : ResponseRendered = ['rendered', rendered];
    self.postMessage(responseRendered);
}
