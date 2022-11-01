// internals:
import type {
    BrowserInfo,
    PrefixedProp,
}                           from './types.js'



export const getPrefixedProps = ({jsPrefix, cssPrefix, browserType} : BrowserInfo) : PrefixedProp[] => [
    { prop: 'colorAdjust' , prefix: `${cssPrefix}print-` },
    { prop: 'mask'        , prefix: (jsPrefix !== 'Moz') && (browserType !== 'safari') && '-webkit-' },
    { prop: 'scrollSnap'  , prefix: (jsPrefix === 'ms') },
    { prop: 'transition'  , prefix: (jsPrefix === 'Moz') && '-webkit-' },
    { prop: 'userSelect'  , prefix: (browserType === 'safari') },
    { prop: 'writingMode' , prefix: (jsPrefix === 'Moz') },
];
