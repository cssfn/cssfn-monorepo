/**
 * Forked from:
 * @copyright Oleg Slobodskoi 2015
 * @website https://github.com/jsstyles/css-vendor
 * @license MIT
*/



// other libs:
import {
    // tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'

// internals:
import type {
    CssPrefix,
    JsPrefix,
    BrowserType,
    BrowserInfo,
}                           from './types.js'



const isClientSide : boolean = isBrowser || isJsDom;
let jsPrefix    : JsPrefix    = '';
let cssPrefix   : CssPrefix   = '';
let browserType : BrowserType = '';



if (isClientSide) {
    const {style} = document.createElement('p');
    const testProp = 'Transform';
    
    
    
    // Order matters. We need to check Webkit the last one because
    // other vendors use to add Webkit prefixes to some properties
    const jsCssMap : { [key: string] : CssPrefix } = {
        Moz    : '-moz-',
        ms     : '-ms-',
        O      : '-o-',
        Webkit : '-webkit-',
    };
    for (const testJsPrefix in jsCssMap) {
        if (!(`${testJsPrefix}${testProp}` in style)) continue;
        
        jsPrefix  = testJsPrefix as JsPrefix;
        cssPrefix = jsCssMap[testJsPrefix];
        break;
    } // for
    
    
    
    // Correctly detect the Edge browser:
    if (
        (jsPrefix === 'Webkit')
        &&
        ('msHyphens' in style)
    ) {
        jsPrefix    = 'ms';
        cssPrefix   = jsCssMap.ms;
        browserType = 'edge';
    } // if
    
    // Correctly detect the Safari browser:
    if (
        (jsPrefix === 'Webkit')
        &&
        (
            ('-apple-trailing-word' in style)
            ||
            (
                (typeof(CSS) !== 'undefined')
                &&
                CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
            )
        )
    ) {
        browserType = 'safari';
    } // if
} // if



export const browserInfo : BrowserInfo = {
    jsPrefix,
    cssPrefix,
    browserType,
}
