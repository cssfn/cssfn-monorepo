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



export const memorizedStyle = <TFunction extends (...params: any[]) => TReturn, TReturn extends CssStyle>(factory: TFunction, deps ?: MaybeArray<Observable<void>>): TFunction => {
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
    const cachedFactory : TFunction = ((...params: any[]) => {
        // do not cache a parameterized function call:
        if (params.length) return factory(...params);
        
        
        
        const cached = cache?.deref();
        if (cached) return cached;
        
        
        
        // cache a non_parameterized function call:
        const result = factory();
        cache = new WeakRef<TReturn>(result);
        return result;
    }) as TFunction;
    
    
    
    return cachedFactory;
};
