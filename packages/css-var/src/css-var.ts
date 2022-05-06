// cssfn:
import type {
    // types:
    Dictionary,
}                           from '@cssfn/types'
import type {
    // css custom properties:
    CssCustomName,
    CssCustomSimpleRef,
    CssCustomRef,
}                           from '@cssfn/css-types'

// other libs:
import {
    // tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'
import {
    // tests:
    default as warning,
}                           from 'tiny-warning'



const isClientSide : boolean = isBrowser || isJsDom;



// types:
export type ReadonlyCssCustomRefs<TCssCustomProps extends {}> = Readonly<{ [Key in keyof TCssCustomProps]: CssCustomSimpleRef  }>
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
class LiveCssVarOptions implements Required<CssVarOptions> {
    //#region public options
    prefix : string
    minify : boolean
    //#endregion public options
    
    
    
    //#region constructors
    constructor(options?: CssVarOptions) {
        this.prefix = options?.prefix ?? defaultOptions.prefix;
        this.minify = options?.minify ?? defaultOptions.minify;
    }
    //#endregion constructors
}



// global proxy's handlers:
const unusedObj = {}
const setReadonlyHandler = (obj: any, propName: string, newValue: any): boolean => {
    throw new Error(`Setter \`${propName}\` is not supported.`);
}



let globalIdCounter = 0; // should not be incremented on server side



/**
 * Declares & retrieves *css variables* (css custom properties).
 */
export const createCssVar = <TCssCustomProps extends {}>(options: CssVarOptions = defaultOptions): CssVar<TCssCustomProps> => {
    // options:
    const liveOptions = new LiveCssVarOptions(options);
    
    
    
    // data generates:
    
    const idMap : Dictionary<number> = {};
    
    /**
     * Gets the *declaration name* of the specified `propName`, eg: `--my-favColor`.
     * @param propName The prop name to retrieve.
     * @returns A `CssCustomName` represents the declaration name of the specified `propName`.
     */
    const decl = (propName: string): CssCustomName => {
        if (process.env.NODE_ENV === 'dev') {
            warning(
                isClientSide        // must run in browser
                ||                  // or
                !liveOptions.minify // not minified
                ,
                '`css-var` with option `minify = true (default)` is not supported to be fetched on server side. Assign an option `{ minify: false }` to fix it.'
            )
        } // if
        
        
        
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
     * @returns A `CssCustomSimpleRef` represents the expression for retrieving the value of the specified `propName`.
     */
    const ref = (propName: string): CssCustomSimpleRef => {
        return `var(${decl(propName)})`;
    };
    
    
    
    return [
        // data proxy:
        new Proxy<Dictionary<CssCustomSimpleRef>>(unusedObj, {
            get : (_unusedObj, propName: string) => ref(propName),
            set : setReadonlyHandler,
        }) as ReadonlyCssCustomRefs<TCssCustomProps>,
        
        
        
        // options:
        liveOptions,
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
