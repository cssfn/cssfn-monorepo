// cssfn:
import type {
    // types:
    OptionalOrBoolean,
    Dictionary,
}                           from '@cssfn/types'
import type {
    // css custom properties:
    CssCustomName,
    CssCustomSimpleRef,
    CssCustomRef,
    CssCustomValue,
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
export type CssVars<TCssCustomProps extends {}>            = Readonly<{ [Key in keyof TCssCustomProps]: CssCustomSimpleRef  }>
export type CssVarsWithOptions<TCssCustomProps extends {}> = readonly [ CssVars<TCssCustomProps>, LiveCssVarsOptions ]



// options:
export interface CssVarsOptions {
    /**
     * The prefix name of the generated css vars.
     */
    prefix ?: string
    
    /**
     * Replaces the original name with an unique shorter name.
     */
    minify ?: boolean
}
const defaultOptions : Required<CssVarsOptions> = {
    prefix : '',
    minify : true,
};
class LiveCssVarsOptions implements Required<CssVarsOptions> {
    //#region private properties
    #prefix : string
    #minify : boolean
    
    readonly #updatedCallback : () => void
    //#endregion private properties
    
    
    
    //#region constructors
    constructor(updatedCallback: () => void, options?: CssVarsOptions) {
        this.#prefix = options?.prefix ?? defaultOptions.prefix; // an empty prefix is allowed
        this.#minify = options?.minify ?? defaultOptions.minify;
        
        this.#updatedCallback = updatedCallback;
    }
    //#endregion constructors
    
    
    
    //#region public properties
    get prefix() {
        return this.#prefix;
    }
    set prefix(value: string) {
        // an empty prefix is allowed
        if (this.#prefix === value) return; // no change => no need to update
        
        this.#prefix = value; // update
        this.#update(); // notify a css-vars updated
    }
    
    get minify() {
        return this.#minify;
    }
    set minify(value: boolean) {
        if (this.#minify === value) return; // no change => no need to update
        
        this.#minify = value; // update
        this.#update(); // notify a css-vars updated
    }
    //#endregion public properties
    
    
    
    //#region private methods
    #update() {
        this.#updatedCallback(); // notify a css-config updated
    }
    //#endregion private methods
}
export type { LiveCssVarsOptions }



// global proxy's handlers:
const unusedObj = {}
const setReadonlyHandler = (_unusedObj: any, propName: string|symbol, _newValue: any): boolean => {
    throw new Error(`Setter \`${String(propName)}\` is not supported.`);
}



let globalIdCounter = 0; // should not be incremented on server side



/**
 * Declares & retrieves *css variables* (css custom properties).
 */
export const cssVars = <TCssCustomProps extends {}>(options?: CssVarsOptions): CssVarsWithOptions<TCssCustomProps> => {
    // options:
    const liveOptions = new LiveCssVarsOptions(() => {
        cache.clear(); // the cached propDecl(s) are depended on [prefix] & [minify], the [prefix] and/or [minify] was changed => cached propDecl(s) are now invalid
    }, options);
    
    
    
    // data generates:
    
    const cache      = new Map<string, CssCustomName>();
    const idRegistry = new Map<string, string>();
    
    const updateDecl = (propName: string, id: string): CssCustomName => {
        const prefix   = liveOptions.prefix;
        const propDecl : CssCustomName = prefix ? `--${prefix}-${id}` : `--${id}`; // add double dash with prefix `--prefix-` or double dash without prefix `--`
        
        cache.set(propName, propDecl);
        return propDecl;
    };
    
    /**
     * Gets the *declaration name* of the specified `propName`, eg: `--my-favColor`.
     * @param propName The prop name to retrieve.
     * @returns A `CssCustomName` represents the declaration name of the specified `propName`.
     */
    const decl = (propName: string): CssCustomName => {
        if (process.env.NODE_ENV === 'dev') {
            warning(
                isClientSide        // on client_side => can use static_id and/or auto_counter_id
                ||                  // or
                !liveOptions.minify // not minified => static_id => no auto_counter_id is used => can be run both on client_side or server_side
                ,
                '`css-vars` with option `minify = true (default)` is not supported to be fetched on server side. Assign an option `{ minify: false }` to fix it.'
            )
        } // if
        
        
        
        const cached = cache.get(propName);
        if (cached !== undefined) return cached;
        
        
        
        if (!liveOptions.minify) {
            return updateDecl(propName, /*static_id: */ propName);
        } // if
        
        
        
        const existingId = idRegistry.get(propName);
        if (existingId !== undefined) return updateDecl(propName, /*id: */ existingId);
        
        
        
        const newId = `v${++globalIdCounter}`; // the global counter is always incremented, so it's guaranteed to be unique
        idRegistry.set(propName, newId); // register the newId to be re-use later (when the cache get invalidated)
        return updateDecl(propName, /*id: */ newId);
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
            get : (_unusedObj, propName: string|symbol): string|undefined => {
                // ignores symbol & number props:
                if (typeof(propName) !== 'string') return undefined;
                
                
                
                return ref(propName);
            },
            set : setReadonlyHandler,
        }) as CssVars<TCssCustomProps>,
        
        liveOptions
    ];
}
export {
    cssVars as default,
    cssVars as createCssVars,
}



// utilities:
const renderPropValue = (propValue: CssCustomValue): { rendered: string, hasImportant: boolean } => {
    if (!Array.isArray(propValue)) {
        if (typeof(propValue) === 'number') return { rendered: `${propValue}`, hasImportant: false }; // CssSimpleNumericValue => number => convert to string
        if (typeof(propValue) === 'string') return { rendered:    propValue  , hasImportant: false }; // CssSimpleLiteralValue|CssCustomRef => string
        return { rendered: propValue.toString(), hasImportant: false } // CssCustomKeyframesRef => toString();
    } // if
    
    
    
    let hasImportant = false;
    return {
        rendered : (
            propValue
            .map((propSubValue, index, array): string|null => {
                if (!Array.isArray(propSubValue)) {
                    if (typeof(propSubValue) === 'number') return `${propSubValue}`; // CssSimpleNumericValue => number => convert to string
                    if ((index === (array.length - 1)) && (propSubValue === '!important')) {
                        hasImportant = true;
                        return null; // do not comma_separated_!important
                    }
                    if (typeof(propSubValue) === 'string') return propSubValue; // CssSimpleLiteralValue|CssCustomRef => string
                    return propSubValue.toString(); // CssCustomKeyframesRef => toString();
                } // if
                
                
                
                return (
                    propSubValue
                    .map((propSubSubValue): string => {
                        if (typeof(propSubSubValue) === 'number') return `${propSubSubValue}`; // CssSimpleNumericValue => number => convert to string
                        if (typeof(propSubSubValue) === 'string') return propSubSubValue; // CssSimpleLiteralValue|CssCustomRef => string
                        return propSubSubValue.toString(); // CssCustomKeyframesRef => toString();
                    })
                    .join(' ') // space_separated_values
                );
            })
            .filter((propSubValue): propSubValue is string => (propSubValue !== null))
            .join(', ') // comma_separated_values
        ),
        hasImportant
    };
};
const filterEmptyVars = (next: OptionalOrBoolean<CssCustomRef|CssCustomValue>): next is CssCustomRef|CssCustomValue => !!next && (next !== true)
export const switchOf = (first: CssCustomRef, ...nexts: [...OptionalOrBoolean<CssCustomRef>[], OptionalOrBoolean<CssCustomRef|CssCustomValue>]|[]): CssCustomRef => {
    // conditions:
    if (!nexts || !nexts.length) return first;
    const nextsAbs = nexts.filter(filterEmptyVars) as (CssCustomRef|CssCustomValue)[];
    if (!nextsAbs.length) return first;
    
    
    
    const refs : (CssCustomRef|CssCustomValue)[] = [first, ...nextsAbs];
    let totalClosingCount = 0;
    let hasImportantValue = false;
    return (
        refs
        .map((ref, index): string => {
            if ((typeof(ref) !== 'string') || !ref.startsWith('var(--')) {
                const {rendered, hasImportant} = renderPropValue(ref);
                if (hasImportant) hasImportantValue = true;
                return rendered;
            } // if
            
            
            
            if (ref.endsWith('!important')) {
                hasImportantValue = true;
                ref = ref.replace(/\s*!important/, '');
            } // if
            
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
        +
        (hasImportantValue ? ' !important' : '')
    ) as CssCustomRef;
}
