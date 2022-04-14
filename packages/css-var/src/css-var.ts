// cssfn:
import type {
    Dictionary,
}                           from '@cssfn/types'
import type {
    CssCustomName,
    CssCustomRef,
}                           from '@cssfn/css-types'



// types:
export type ReadonlyCssCustomRefs<TCssCustomProps extends {}> = Readonly<{ [key in keyof TCssCustomProps]: CssCustomRef  }>
export type CssVar<TCssCustomProps extends {}>                = readonly [ReadonlyCssCustomRefs<TCssCustomProps>, LiveCssVarOptions]



// options:
export interface CssVarOptions {
    /**
     * The prefix name of the generated css vars.
     */
    prefix ?: string
    
    /**
     * Replaces the original name with an unique shorter name.
     */
    minify ?: boolean
}
const defaultOptions : Required<CssVarOptions> = {
    prefix : '',
    minify : true,
}
export type LiveCssVarOptions = Required<CssVarOptions>



// global proxy's handlers:
const setReadonlyHandler = (obj: any, propName: string, newValue: any): boolean => {
    throw new Error(`Setter \`${propName}\` is not supported.`);
}

const unusedObj = {}
const liveOptionsHandler: ProxyHandler<LiveCssVarOptions> = {
    set : (options, propName: string, newValue: any): boolean => {
        if (!(propName in options)) return false; // the requested prop does not exist
        
        
        
        // apply the default value (if any):
        newValue = newValue ?? (defaultOptions as any)[propName];
        
        
        
        // compare `oldValue` & `newValue`:
        const oldValue = (options as any)[propName];
        if (oldValue === newValue) return true; // success but no change => no need to update
        
        
        
        // apply changes & update:
        (options as any)[propName] = newValue;
        return true; // notify the operation was completed successfully
    },
}



let globalIdCounter = 0;



/**
 * Declares & retrieves *css variables* (css custom properties).
 */
export const createCssVar = <TCssCustomProps extends {}>(options: CssVarOptions = defaultOptions): CssVar<TCssCustomProps> => {
    // options:
    const liveOptions : LiveCssVarOptions = {
        prefix : options.prefix ?? defaultOptions.prefix,
        minify : options.minify ?? defaultOptions.minify,
    }
    
    
    
    // data generates:
    
    const idMap : Dictionary<number> = {};
    
    /**
     * Gets the *declaration name* of the specified `propName`, eg: `--my-favColor`.
     * @param propName The prop name to retrieve.
     * @returns A `CssCustomName` represents the declaration name of the specified `propName`.
     */
    const decl = (propName: string): CssCustomName => {
        const name = (
            liveOptions.minify
            ?
            `v${((): number => {
                let id = idMap[propName];
                if (id === undefined) {
                    idMap[propName] = id = (++globalIdCounter);
                } // if
                return id;
            })()}`
            :
            propName
        );
        
        return liveOptions.prefix ? `--${liveOptions.prefix}-${name}` : `--${name}`; // add double dash with prefix `--prefix-` or double dash without prefix `--`
    };
    
    /**
     * Gets the *value* (reference) of the specified `propName`, not the *direct* value, eg: `var(--my-favColor)`.
     * @param propName The prop name to retrieve.
     * @returns A `CssCustomRef` represents the expression for retrieving the value of the specified `propName`.
     */
    const ref = (propName: string): CssCustomRef => {
        return `var(${decl(propName)})`;
    };
    
    
    
    return [
        // data proxy:
        new Proxy<Dictionary<CssCustomRef>>(unusedObj, {
            get : (_unusedObj, propName: string) => ref(propName),
            set : setReadonlyHandler,
        }) as ReadonlyCssCustomRefs<TCssCustomProps>,
        
        
        
        // settings:
        new Proxy<LiveCssVarOptions>(liveOptions, liveOptionsHandler),
    ];
}
export { createCssVar as default }



// utilities:
export const fallbacks = (first: CssCustomRef, ...next: CssCustomRef[]): CssCustomRef => {
    if (!next || !next.length) return first;
    
    
    
    const refs = [first, ...next];
    let totalClosingCount = 0;
    return (
        refs
        .map((ref, index) => {
            const closingCount = (ref.match(/\)+$/)?.[0]?.length ?? 0);
            totalClosingCount += closingCount;
            
            return (
                ref.slice(0, - closingCount)
                +
                ((index < (refs.length - 1)) ? ', ' : '') // add a comma except the last one
            );
        })
        .join('')
        +
        (new Array(/*arrayLength: */totalClosingCount)).fill(')').join('')
    ) as CssCustomRef;
}
