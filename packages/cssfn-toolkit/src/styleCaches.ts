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



export const memoizeResult = <TFunction extends (...params: any[]) => TResult, TResult extends object>(factory: TFunction, deps ?: MaybeArray<Observable<void>>): TFunction => {
    // caches:
    let cache : WeakRef<TResult>|undefined = undefined;
    const clearCache = (): void => {
        cache = undefined;
    };
    if (deps) {
        if (!Array.isArray(deps)) {
            deps.subscribe(clearCache);
        }
        else {
            for (const dep of deps) {
                dep.subscribe(clearCache);
            } // for
        } // if
    } // if
    
    
    
    // cached function:
    const cachedFactory : TFunction = ((...params: any[]) => {
        // do not cache a parameterized function call:
        if (params.length) return factory(...params);
        
        
        
        const cached = cache?.deref();
        if (cached) return cached;
        
        
        
        // cache a non_parameterized function call:
        const result = factory();
        cache = new WeakRef<TResult>(result);
        return result;
    }) as TFunction;
    
    
    
    return cachedFactory;
};
export const memoizeStyle  = <TFunction extends (...params: any[]) => TResult, TResult extends CssStyle>(factory: TFunction, deps ?: MaybeArray<Observable<void>>): TFunction => {
    return memoizeResult(factory, deps);
};



export const memoizeResultWithVariants = <TFunction extends (variant: any, ...params: any[]) => TResult, TResult extends object>(factory: TFunction, deps ?: MaybeArray<Observable<void>>): TFunction => {
    // caches:
    let cache = new Map<any, WeakRef<TResult>>();
    const clearCache = (): void => {
        cache.clear();
    };
    if (deps) {
        if (!Array.isArray(deps)) {
            deps.subscribe(clearCache);
        }
        else {
            for (const dep of deps) {
                dep.subscribe(clearCache);
            } // for
        } // if
    } // if
    
    
    
    // cached function:
    const cachedFactory : TFunction = ((variant: any, ...params: any[]) => {
        // do not cache a parameterized function call:
        if (params.length) return factory(variant, ...params);
        
        
        
        const cached = cache.get(variant)?.deref();
        if (cached) return cached;
        
        
        
        // cache a non_parameterized function call:
        const result = factory(variant);
        cache.set(variant, new WeakRef<TResult>(result));
        return result;
    }) as TFunction;
    
    
    
    return cachedFactory;
};
export const memoizeStyleWithVariants  = <TFunction extends (variant: any, ...params: any[]) => TResult, TResult extends CssStyle>(factory: TFunction, deps ?: MaybeArray<Observable<void>>): TFunction => {
    return memoizeResultWithVariants(factory, deps);
};
