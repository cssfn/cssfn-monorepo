// cssfn:
import type {
    // types:
    OptionalOrBoolean,
    
    DeepArray,
    SingleOrDeepArray,
    
    Factory,
    ProductOrFactory,
}                           from '@cssfn/types'
import type {
    CssRule,
    
    CssStyle,
    CssFinalStyleMap,
    CssStyleCollection,
    
    CssSelector,
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
export {
    camelCase,
}                           from 'camel-case'
export {
    pascalCase,
}                           from 'pascal-case'



function unwrap<T>(collection: DeepArray<T>, result: T[]): void {
    for (const item of collection) {
        // handle single item:
        if (!Array.isArray(item)) {
            result.push(item);
            continue;
        } // if
        
        
        
        // handle multi item(s):
        unwrap(item, result);
    } // for
}
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
    
    
    
    // statically handle single item:
    if (!Array.isArray(collection)) {
        return [collection];
    } // if
    
    
    
    // dynamically handle multi item(s):
    const result : T[] = [];
    unwrap(collection, result);
    return result;
};

export const isFinalSelector = (selector: undefined|CssRawSelector|CssFinalSelector): selector is CssFinalSelector => (typeof(selector) === 'string');

export const isNotFalsySelector = (selector: OptionalOrBoolean<CssSelector>): selector is CssSelector => {
    return (!!selector && (selector !== true));
};
export const isNotFalsyRuleOrFactory = (ruleOrFactory: ProductOrFactory<OptionalOrBoolean<CssRule>>): ruleOrFactory is CssRule|Factory<OptionalOrBoolean<CssRule>> => {
    return (!!ruleOrFactory && (ruleOrFactory !== true));
};
export const isNotFalsyRule = (rule: OptionalOrBoolean<CssRule>): rule is CssRule => {
    return (!!rule && (rule !== true));
};
export const isNotFalsyStyles = (styles: CssStyleCollection|CssFinalStyleMap): styles is Exclude<CssStyleCollection|CssFinalStyleMap, undefined|null|boolean> => {
    return (!!styles && (styles !== true));
};

export const isStyle = (styles: CssStyleCollection|CssFinalStyleMap): styles is CssStyle => (
    isNotFalsyStyles(styles)
    &&
    (Object.getPrototypeOf(styles) === Object.prototype)
);
export const isFinalStyleMap = (styles: CssStyleCollection|CssFinalStyleMap): styles is CssFinalStyleMap => (
    isNotFalsyStyles(styles)
    &&
    (Object.getPrototypeOf(styles) === Map.prototype)
);

export const normalizeSelectorOptions = <TDefaultOptions extends CssSelectorOptions>(options: CssSelectorOptions|undefined, defaultOptions: TDefaultOptions): TDefaultOptions => {
    if (!options) return defaultOptions;
    
    
    
    const performGrouping      = options.performGrouping ?? defaultOptions.performGrouping;
    
    const specificityWeight    =                      ((options.specificityWeight    !== undefined) ? options.specificityWeight    : defaultOptions.specificityWeight   );
    const minSpecificityWeight = specificityWeight ?? ((options.minSpecificityWeight !== undefined) ? options.minSpecificityWeight : defaultOptions.minSpecificityWeight);
    const maxSpecificityWeight = specificityWeight ?? ((options.maxSpecificityWeight !== undefined) ? options.maxSpecificityWeight : defaultOptions.maxSpecificityWeight);
    
    
    
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
};

const fastHash = (input: string): string => {
    let hash = 0, i, chr;
    for (i = 0; i < input.length; i++) {
        chr   = input.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    } // for
    
    hash = Math.abs(hash);
    const hashStr  = hash.toString(36).slice(-5); // get the last 5 characters
    const firstChr = hashStr[0];
    if ((firstChr >= '0') && (firstChr <= '9')) {
        return (
            ((hash % 26) + 10).toString(36) // always produces a-z
            +
            hashStr.slice(1) // remove first char
        );
    } // if
    return hashStr;
};

const takenHashes = new Map</*hash :*/string, /*owner :*/string>();
const globalSalt  : number = (new Date().getTime());
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
        
        if (process.env.NODE_ENV === 'dev') {
            if ((counterSalt === 2) && (styleSheetId !== '')) {
                warning(false, `[cssfn] The styleSheetId of ${styleSheetId} is not a unique ID. Please re-generate another random ID.`);
            } // if
        } // if
        
        // try to re-generate a unique hash by adding a counter salt (not SSR friendly):
        myHash = fastHash(`${mySelf}${counterSalt}${globalSalt}`);
    } // for
    
    
    
    if (process.env.NODE_ENV === 'dev') {
        warning(false, `[cssfn] You might have a memory leak. ID counter is at ${counterSalt}.`);
    } // if
    
    
    
    return myHash;
};



export const startsCapitalized = (propName: string): string => {
    // conditions:
    if (!propName) return propName; // ignore empty string
    
    
    
    return propName[0].toUpperCase() + propName.slice(1);
};
export const startsDecapitalized = (propName: string): string => {
    // conditions:
    if (!propName) return propName; // ignore empty string
    
    
    
    return propName[0].toLowerCase() + propName.slice(1);
};
