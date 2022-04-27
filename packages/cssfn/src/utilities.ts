// cssfn:
import type {
    // types:
    SingleOrDeepArray,
}                           from '@cssfn/types'
import type {
    CssSelectorOptions,
    
    CssRawSelector,
    CssFinalSelector,
}                           from '@cssfn/css-types'



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
