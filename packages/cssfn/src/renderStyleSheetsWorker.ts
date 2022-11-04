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

export type RequestConfig    = readonly ['config', ConfigOptions]
export type RequestRender    = readonly ['render', EncodedCssStyleCollection]
export type Request =
    |RequestConfig
    |RequestRender

export type ResponseReady         = readonly ['ready']
export type ResponseRendered      = readonly ['rendered'   , string|null]
export type ResponseRenderedError = readonly ['renderederr', string|null|undefined|Error]
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
};
const handleRequestConfig = (options: RequestConfig[1]): void => {
    const { browserInfo } = options;
    if (browserInfo) {
        cssPropAutoPrefix = createCssPropAutoPrefix(browserInfo);
    } // if
}
const handleRequestRender = (rules: RequestRender[1]): void => {
    const scopeRules   = decodeStyles(rules);
    
    
    
    let rendered: string|null = null;
    try {
        rendered = renderRule(scopeRules, { cssPropAutoPrefix });
    }
    catch (error: any) {
        const errorParam = (
            ((error === undefined) || (error == null))
            ?
            (error as undefined|null)
            :
            (
                (error instanceof Error)
                ?
                error
                :
                `${error}`
            )
        );
        const responseData : ResponseRenderedError = ['renderederr', errorParam];
        self.postMessage(responseData);
        return;
    } // try
    
    
    
    const responseData : ResponseRendered = ['rendered', rendered];
    self.postMessage(responseData);
}
