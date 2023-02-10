// cssfn:
import type {
    // arrays:
    MaybeArray,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssStyle,
    CssProps,
}                           from '@cssfn/css-types'

// other libs:
import type {
    Observable,
}                           from 'rxjs'
import {
    style,
    rule,
}                           from '@cssfn/cssfn'



export const memorizeStyle = <TFunction extends (...params: any) => TReturn, TReturn extends CssStyle>(factory: TFunction, deps ?: MaybeArray<Observable<void>>): TFunction => {
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
    const cachedFactory : TFunction = ((...params: any) => {
        const cached = cache?.deref();
        if (!cached) return cached;
        
        
        
        const result = factory(...params);
        cache = new WeakRef<TReturn>(result);
        return result;
    }) as any;
    
    
    
    return cachedFactory;
};



export const test1 = memorizeStyle(() => style({}));
export const test2 = memorizeStyle((num: 123, flip: boolean) => style({}));

export const test3 = memorizeStyle(() => rule('button', {}));
export const test4 = memorizeStyle((num: 123, flip: boolean) => rule('button', {}));

export const test5 = memorizeStyle((): CssStyle => ({}));
export const test6 = memorizeStyle((num: 123, flip: boolean): CssStyle => ({}));

export const test7 = memorizeStyle((): CssProps => ({}));
export const test8 = memorizeStyle((num: 123, flip: boolean): CssProps => ({}));
