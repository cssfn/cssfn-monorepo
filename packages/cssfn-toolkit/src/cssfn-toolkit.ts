// cssfn:
import type {
    // cssfn properties:
    CssRule,
}                           from '@cssfn/css-types'
import {
    // styles:
    style,
}                           from '@cssfn/cssfn'
import {
    // types:
    CssConfigProps,
    Refs,
    Vals,
    LiveCssConfigOptions,
    CssConfig,
    
    
    
    // utilities:
    cssConfig,
    usesCssProps,
}                           from '@cssfn/css-config'



// types:
export type MixinDefs = {
    [key in string] : Function
}

export type StylePackOptions<TName extends string, TPlural extends string, TConfigProps extends CssConfigProps, TMixinDefs extends MixinDefs> = {
    name   : TName
    plural : TPlural
} & ({
    config : undefined|null|never
    mixins : TMixinDefs
}|{
    config : CssConfig<TConfigProps>
    mixins : TMixinDefs
})

export type StylePack<TName extends string, TPlural extends string, TConfigProps extends CssConfigProps, TMixinDefs extends MixinDefs> =
    & StylePackConfig<TName, TPlural, TConfigProps>
    & StylePackMixins<TName, TMixinDefs>
    // & TMixinDefs
export type StylePackConfig<TName extends string, TPlural extends string, TConfigProps extends CssConfigProps> = {
    [key in TPlural         ] : Refs<TConfigProps>
} & {
    [key in `${TName}Values`] : Vals<TConfigProps>
} & {
    [key in `${TName}Config`] : LiveCssConfigOptions
}
export type StylePackMixins<TName extends string, TMixinDefs extends MixinDefs> = {
    [key in keyof TMixinDefs as `${TName}${Capitalize<key & string>}`] : TMixinDefs[key] extends Function ? TMixinDefs[key] : never
}



const createStylePack = <
    TName extends string,
    TPlural extends string,
    
    TConfigProps extends CssConfigProps,
    TMixinDefs extends MixinDefs
>(options: StylePackOptions<TName, TPlural, TConfigProps, TMixinDefs>): StylePack<TName, TPlural, TConfigProps, TMixinDefs> => {
    const {
        name,
        plural,
        
        config,
        mixins : mixinDefs,
    } = options;
    
    
    
    const mixinsCache = new Map<string, WeakRef<CssRule>>();
    if (config) {
        const [,,cssConfig] = config;
        cssConfig.onChange.subscribe(() => {
            mixinsCache.clear();
        });
    } // if
    const cachedMixins : TMixinDefs = Object.fromEntries(
        Object.entries(mixinDefs)
        .map(([mixinName, mixinDef]) => {
            const cachedMixinDef : typeof mixinDef = (...params: any[]) => {
                if (params.length) return mixinDef(...params);
                
                
                
                const cached = mixinsCache.get(mixinName)?.deref();
                if (cached) return cached;
                
                
                
                const mixinValue = mixinDef();
                mixinsCache.set(mixinName, new WeakRef<CssRule>(mixinValue));
                return mixinValue;
            };
            return [mixinName, cachedMixinDef];
        })
    ) as any;
    
    
    return {
        [plural         ] : config?.[0],
        [`${name}Values`] : config?.[1],
        [`${name}Config`] : config?.[2],
        
        ...cachedMixins,
    } as any;
}

const result = createStylePack({
    name   : 'basic',
    plural : 'basics',
    
    
    
    config : cssConfig({
        backg  : 'transparent',
        foregr : 'black',
    }, { prefix: 'bsc' }),
    
    
    
    mixins : {
        layout     : (counter: number, flip: boolean) => style({
            display: 'block',
            ...usesCssProps(basics),
        }),
        variants   : () => style({
            display: 'block',
        }),
        styleSheet : () => style({
            ...basicLayout(123, true),
            ...basicVariants(),
        }),
    },
});
export const {
    basics,
    basicValues,
    basicConfig,
    
    basicLayout,
    basicVariants,
} = result;

basicLayout(123, true);