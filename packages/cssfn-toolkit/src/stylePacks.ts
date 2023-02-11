// cssfn:
import type {
    // arrays:
    MaybeArray,
    
    
    
    // factories:
    MaybeFactory,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssStyle,
}                           from '@cssfn/css-types'
import {
    // utilities:
    startsCapitalized,
}                           from '@cssfn/cssfn'
import {
    // types:
    CssConfigProps,
    Refs,
    Vals,
    CssConfigOptions,
    LiveCssConfigOptions,
    
    
    
    // utilities:
    cssConfig,
}                           from '@cssfn/css-config'

// other libs:
import type {
    Observable,
}                           from 'rxjs'



// types:
export type MixinDefs = {
    [key in string] : Function
} & {
    styleSheet      : Function
}

export type StylePackOptions<TName extends string, TPlural extends string, TCssConfigProps extends CssConfigProps, TMixinDefs extends MixinDefs> = {
    name      : TName
    plural    : TPlural
    
    deps     ?: MaybeArray<Observable<void>>
    
    mixins    : MaybeFactory<TMixinDefs>
} & ({
    /* without config */
    
    config   ?: never // no config
    prefix   ?: never // no config => no config's prefix
    selector ?: never // no config => no config's selector
}|({
    /* with config */
    
    config    : MaybeFactory<TCssConfigProps>
} & CssConfigOptions))

export type StylePack<TName extends string, TPlural extends string, TCssConfigProps extends CssConfigProps, TMixinDefs extends MixinDefs> =
    & StylePackConfig<TName, TPlural, TCssConfigProps>
    & StylePackMixins<TName, TMixinDefs>
export type StylePackConfig<TName extends string, TPlural extends string, TCssConfigProps extends CssConfigProps> = {
    [key in TPlural         ] : Refs<TCssConfigProps>
} & {
    [key in `${TName}Values`] : Vals<TCssConfigProps>
} & {
    [key in `${TName}Config`] : LiveCssConfigOptions
}
export type StylePackMixins<TName extends string, TMixinDefs extends MixinDefs> = {
    [key in keyof TMixinDefs as `${TName}${Capitalize<key & string>}`] : TMixinDefs[key]
}



export const createStylePack = <
    TName        extends string,
    TPlural      extends string,
    
    TCssConfigProps extends CssConfigProps,
    TMixinDefs   extends MixinDefs
>(options: StylePackOptions<TName, TPlural, TCssConfigProps, TMixinDefs>): StylePack<TName, TPlural, TCssConfigProps, TMixinDefs> => {
    const {
        name,
        plural,
        
        deps,
        
        config : configFactory,
        mixins : mixinsFactory,
    } = options;
    
    
    
    // config:
    const config = configFactory ? cssConfig(configFactory, options) : undefined;
    
    
    
    // mixins:
    const mixinsCache = new Map<string, WeakRef<CssStyle>>();
    const clearCache = (): void => {
        mixinsCache.clear();
    };
    if (config) {
        const [,,cssConfig] = config;
        cssConfig.onChange.subscribe(clearCache);
    } // if
    if (deps) {
        for (const dep of [deps].flat()) {
            dep.subscribe(clearCache);
        } // for
    } // if
    const cachedMixins : TMixinDefs = Object.fromEntries(
        Object.entries(
            (typeof(mixinsFactory) !== 'function') ? mixinsFactory : mixinsFactory()
        )
        .map(([mixinName, mixinFactory]) => {
            const cachedMixinDef : typeof mixinFactory = (...params: any[]) => {
                if (params.length) return mixinFactory(...params);
                
                
                
                const cached = mixinsCache.get(mixinName)?.deref();
                if (cached) return cached;
                
                
                
                const mixinValue = mixinFactory();
                mixinsCache.set(mixinName, new WeakRef<CssStyle>(mixinValue));
                return mixinValue;
            };
            
            
            
            return [
                `${name}${startsCapitalized(mixinName)}`,
                cachedMixinDef
            ];
        })
    ) as any;
    
    
    
    return {
        [plural         ] : config?.[0],
        [`${name}Values`] : config?.[1],
        [`${name}Config`] : config?.[2],
        
        ...cachedMixins,
    } as any;
}
