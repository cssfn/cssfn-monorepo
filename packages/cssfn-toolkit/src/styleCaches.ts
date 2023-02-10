// cssfn:
import type {
    // arrays:
    MaybeArray,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssStyle,
}                           from '@cssfn/css-types'

// other libs:
import type {
    Observable,
}                           from 'rxjs'



export type StyleFunction<TParams extends Array<any>, TReturn extends CssStyle> = (...params: TParams) => TReturn
export const memorizeStyle = <TParams extends Array<any>, TReturn extends CssStyle>(factory: StyleFunction<TParams, TReturn>, deps ?: MaybeArray<Observable<void>>): StyleFunction<TParams, TReturn> => {
    // caches:
    let cache : WeakRef<TReturn>|undefined = undefined;
    const clearCache = (): void => {
        cache = undefined;
    };
    if (deps) {
        for (const dep of [deps].flat()) {
            dep.subscribe(clearCache);
        } // for
    } // if
    
    
    
    // cached function:
    const cachedFactory : typeof factory = (...params) => {
        const cached = cache?.deref();
        if (cached !== undefined) return cached;
        
        
        
        const result = factory(...params);
        cache = new WeakRef<TReturn>(result);
        return result;
    };
    
    
    
    return cachedFactory;
};
