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



// utilities:
let cssPropAutoPrefix : ReturnType<typeof createCssPropAutoPrefix>|undefined = undefined;



// processors:
export interface ConfigOptions {
    browserInfo ?: BrowserInfo
}
export type MessageData =
    |readonly ['config', ConfigOptions]
    |readonly ['render', EncodedCssStyleCollection]
export type ResponseData =
    |readonly ['ready']
    |readonly ['rendered', string|null]
self.onmessage = (event: MessageEvent<MessageData>) => {
    const [type, payload] = event.data;
    switch (type) {
        case 'config':
            {
                const { browserInfo } = payload;
                if (browserInfo) {
                    cssPropAutoPrefix = createCssPropAutoPrefix(browserInfo);
                } // if
            }
            break;
        case 'render':
            const scopeRules = decodeStyles(payload);
            const responseData : ResponseData = ['rendered', renderRule(scopeRules, { cssPropAutoPrefix })];
            self.postMessage(responseData);
            break;
    } // switch
};
