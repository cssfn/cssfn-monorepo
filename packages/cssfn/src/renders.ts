// cssfn:
import type {
    // cssfn properties:
    CssCustomValue,
    CssCustomProps,
    
    CssKnownValueOf,
    
    CssProps,
    
    CssRuleData,
    CssRule,
    CssRuleCollection,
    
    CssStyle,
    CssStyleCollection,
    CssFontFaceStyleCollection,
    
    CssKeyframes,
    
    CssSelector,
    CssSelectorCollection,
    CssSelectorOptions,
    
    CssRawSelector,
    CssFinalSelector,
    
    CssClassName,
    
    CssScopeName,
    CssScopeEntry,
}                           from '@cssfn/css-types'

// internals:
import type {
    // types:
    StyleSheet,
}                           from './styleSheets.js'

// other libs:
import {
    // tests:
    default as warning,
}                           from 'tiny-warning'



// utilities:
const fastHash = (input: string) => {
    let hash = 0, i, chr;
    for (i = 0; i < input.length; i++) {
        chr   = input.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    } // for
    
    hash = Math.abs(hash);
    return hash.toString(36).slice(-5); // get the last 5 characters
};

const takenHashes = new Map</*hash :*/string, /*owner :*/string>();
const generateId = (sheetId: string, className: CssClassName) => {
    const mySelf = `${sheetId}${className}`;
    let   myHash = fastHash(mySelf);
    
    
    
    const maxCounter  = 1e10;
    let   counterSalt = 2;
    for (; counterSalt <= maxCounter; counterSalt++) {
        // get the owner of current hash (if already taken):
        const owner = takenHashes.get(myHash);
        
        // the hash is already taken by myself => return myHash:
        if (owner === mySelf) return myHash;
        
        // the hash is free => claim it => return myHash:
        if (owner === undefined) {
            takenHashes.set(myHash, mySelf);
            return myHash;
        } // if
        
        // try to re-generate a unique hash by adding a counter salt:
        myHash = fastHash(`${mySelf}${counterSalt}`);
        if ((counterSalt === 2) && (sheetId !== '')) {
            warning(false, `[cssfn] The sheetId of ${sheetId} is not a unique ID. Please re-generate another random ID.`);
        } // if
    } // for
    
    
    
    warning(false, `[cssfn] You might have a memory leak. ID counter is at ${counterSalt}.`);
    return myHash;
};



class RuleList {
    constructor() {
        //
    }
    add(selector: CssFinalSelector, style: CssStyle) {
        //
    }
}



export const render = (styleSheet: StyleSheet): string => {
    if (!styleSheet.enabled) return '';
    
    
    
    const rules = new RuleList();
    
    
    
    const scopesFactory = styleSheet.scopes;
    const scopeList = (typeof(scopesFactory) === 'function') ? scopesFactory() : scopesFactory;
    for (const [scopeName, styles] of scopeList) {

    } // for
    return 'blah';
}