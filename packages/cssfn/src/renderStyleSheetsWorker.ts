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



// processors:
self.onmessage = (event: MessageEvent<EncodedCssStyleCollection>) => {
    const scopeRules = decodeStyles(event.data);
    self.postMessage(renderRule(scopeRules));
};
