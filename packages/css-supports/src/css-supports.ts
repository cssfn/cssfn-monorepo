// other libs:
import {
    // tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'



// utilities:
const isClientSide : boolean = isBrowser || isJsDom;



let _supportsHasPseudoClassCache : boolean|undefined = undefined;
export const supportsHasPseudoClass = (defaultOutsideBrowser = true): boolean => {
    if (!isClientSide) return defaultOutsideBrowser;
    
    
    
    // retrieve from cache:
    if (_supportsHasPseudoClassCache !== undefined) return _supportsHasPseudoClassCache;
    
    
    
    try {
        _supportsHasPseudoClassCache = (globalThis?.document?.querySelectorAll?.(':has(p)') !== undefined);
    }
    catch { // throwing an exception => unsupported
        _supportsHasPseudoClassCache = false;
    } // try
    return _supportsHasPseudoClassCache;
}
