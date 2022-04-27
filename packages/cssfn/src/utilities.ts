// cssfn:
import type {
    // types:
    SingleOrDeepArray,
}                           from '@cssfn/types'
import type {
    CssSelectorOptions,
    
    CssRawSelector,
    CssFinalSelector,
    
    CssScopeName,
}                           from '@cssfn/css-types'

// other libs:
import {
    // tests:
    default as warning,
}                           from 'tiny-warning'



/**
 * Returns a new array with all sub-array elements concatenated into it recursively up to infinity depth.
 * @param collection An element -or- an array of element -or- a recursive array of element
 * @returns A new array with all sub-array elements concatenated into it.
 */
export const flat = <T,>(collection: SingleOrDeepArray<T>): T[] => {
    /*
        SingleOrDeepArray<T> =       T      | DeepArray<T>
        typeof               = not an array | is an array
    */
    
    
    
    if (!Array.isArray(collection)) {
        // not an array => T
        
        return [collection];
    } // if
    
    
    
    return collection.flat(Infinity);
};

export const isFinalSelector = (selector: CssRawSelector|CssFinalSelector): selector is CssFinalSelector => (typeof(selector) === 'string');

export const normalizeSelectorOptions = <TDefaultOptions extends CssSelectorOptions>(options: CssSelectorOptions|undefined, defaultOptions: TDefaultOptions): TDefaultOptions => {
    const performGrouping      = options?.performGrouping ?? defaultOptions.performGrouping;
    
    const specificityWeight    =                      ((options?.specificityWeight    !== undefined) ? options.specificityWeight    : defaultOptions.specificityWeight   );
    const minSpecificityWeight = specificityWeight ?? ((options?.minSpecificityWeight !== undefined) ? options.minSpecificityWeight : defaultOptions.minSpecificityWeight);
    const maxSpecificityWeight = specificityWeight ?? ((options?.maxSpecificityWeight !== undefined) ? options.maxSpecificityWeight : defaultOptions.maxSpecificityWeight);
    
    if (
        ((minSpecificityWeight !== undefined) && (minSpecificityWeight !== null))
        &&
        ((maxSpecificityWeight !== undefined) && (maxSpecificityWeight !== null))
        &&
        (minSpecificityWeight > maxSpecificityWeight)
    ) { // invalid
        return {
            performGrouping,
            
            specificityWeight,
            minSpecificityWeight : null, // invalid => set to null
            maxSpecificityWeight : null, // invalid => set to null
        } as TDefaultOptions;
    } // if
    
    return {
        performGrouping,
        
        specificityWeight,
        minSpecificityWeight,
        maxSpecificityWeight,
    } as TDefaultOptions;
}

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
export const generateId = (styleSheetId: string, scopeName: CssScopeName): string => {
    const mySelf = `${styleSheetId}${scopeName}`;
    let   myHash = fastHash(mySelf);
    
    
    
    const maxCounter  = 1e10;
    let   counterSalt = 2;
    for (; counterSalt <= maxCounter; counterSalt++) {
        // get the owner of current hash (if already taken):
        const owner = takenHashes.get(myHash);
        
        // the hash is already taken by myself => return myHash:
        if (owner === mySelf) return myHash;
        
        // the owner is free => claim it => return myHash:
        if (owner === undefined) {
            takenHashes.set(myHash, mySelf);
            return myHash;
        } // if
        
        // try to re-generate a unique hash by adding a counter salt (not SSR friendly):
        myHash = fastHash(`${mySelf}${counterSalt}`);
        if ((counterSalt === 2) && (styleSheetId !== '')) {
            warning(false, `[cssfn] The styleSheetId of ${styleSheetId} is not a unique ID. Please re-generate another random ID.`);
        } // if
    } // for
    
    
    
    warning(false, `[cssfn] You might have a memory leak. ID counter is at ${counterSalt}.`);
    return myHash;
};
