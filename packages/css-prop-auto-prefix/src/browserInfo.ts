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
    Prefix,
    BrowserType,
    BrowserInfo,
}                           from './types.js'



const isClientSide : boolean = isBrowser || isJsDom;
let prefix      : Prefix      = '';
let browserType : BrowserType = '';



if (isClientSide) {
    const {style}  = document.createElement('p');
    const testProp = 'Transform';
    
    
    
    // Order matters. We need to check Webkit the last one because
    // other vendors use to add Webkit prefixes to some properties
    const prefixes : Prefix[] = [
        'Moz',
        'ms',
        'O',
        'Webkit',
    ];
    prefix = prefixes.find((testPrefix) => (`${testPrefix}${testProp}` in style)) ?? '';
    
    
    
    // correctly detect the Edge browser:
    if (
        (prefix === 'Webkit')
        &&
        ('msHighContrastAdjust' in style)
    ) {
        prefix      = 'ms';
        browserType = 'edge';
    } // if
    
    // correctly detect the Safari browser:
    if (
        (prefix === 'Webkit')
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
    prefix,
    browserType,
};
