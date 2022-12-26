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
import {
    // processors:
    renderValue,
}                           from '@cssfn/cssfn'

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
const cssVarsProxyHandler : ProxyHandler<Dictionary<CssCustomSimpleRef>> = {
    get(_this, propName: string|symbol): CssCustomSimpleRef|undefined {
        // ignores symbol & number props:
        if (typeof(propName) !== 'string') return undefined;
        
        
        
        return (_this as unknown as ((propName: string) => CssCustomSimpleRef))(propName);
    },
    
    set(_this, propName: string|symbol): boolean {
        throw new Error(`Setter \`${String(propName)}\` is not supported.`);
    },
};



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
        new Proxy<Dictionary<CssCustomSimpleRef>>(ref as any, cssVarsProxyHandler) as CssVars<TCssCustomProps>,
        
        liveOptions
    ];
}
export {
    cssVars as default,
    cssVars as createCssVars,
}



// utilities:
const filterEmptyVars = (next: OptionalOrBoolean<CssCustomRef|CssCustomValue>): next is CssCustomRef|CssCustomValue => !!next && (next !== true)
type ReducedSwitchOf  = { totalClosingCount: number, hasImportant: boolean, truncatedRefs: string[] }
const reducedSwitchOf : ReducedSwitchOf = { totalClosingCount: 0, hasImportant: false, truncatedRefs: [] }
const reduceSwitchOf  = (accum: ReducedSwitchOf, ref : (CssCustomRef|CssCustomValue)): ReducedSwitchOf => {
    // a bare value => render it:
    if ((typeof(ref) !== 'string') || !ref.startsWith('var(--')) {
        let rendered = renderValue(ref);
        if ((rendered.length > 11) && rendered.endsWith(' !important')) {
            accum.hasImportant = true;
            rendered = rendered.slice(0, -11).trimEnd(); // remove ' !important' and then remove excess space(s)
        } // if
        accum.truncatedRefs.push(rendered);
        return accum;
    } // if
    
    
    
    // remove the ending !important:
    if (ref.endsWith('!important')) {
        accum.hasImportant = true;
        ref = ref.slice(0, -10).trimEnd(); // remove '!important' and then remove excess space(s)
    } // if
    
    
    
    // count the closing )):
    let closingCount = 0;
    for (let index = ref.length - 1; index >= 0; index--) {
        if (ref.at(index) !== ')') break;
        closingCount++;
    } // for
    accum.totalClosingCount += closingCount;
    
    
    
    // remove the ending closing )):
    /*
        var(--boo)               =>   var(--boo
        var(--wow, var(--beh))   =>   var(--wow, var(--beh
    */
    accum.truncatedRefs.push(ref.slice(0, -closingCount));
    return accum;
};
export const switchOf = (first: CssCustomRef, ...nexts: [...OptionalOrBoolean<CssCustomRef>[], OptionalOrBoolean<CssCustomRef|CssCustomValue>]|[]): CssCustomRef => {
    // conditions:
    if (!nexts || !nexts.length) return first;
    const nextsAbs = nexts.filter(filterEmptyVars) as (CssCustomRef|CssCustomValue)[];
    if (!nextsAbs.length) return first;
    
    
    
    const refs : (CssCustomRef|CssCustomValue)[] = [first, ...nextsAbs];
    try {
        refs.reduce(reduceSwitchOf, reducedSwitchOf);
        
        
        
        return (
            /*
                var(--boo
                var(--wow, var(--beh
            */
            reducedSwitchOf.truncatedRefs
            
            /*
                var(--boo
                var(--wow, var(--beh
                
                =>   var(--boo, var(--wow, var(--beh
            */
            .join(', ')
            
            +
            
            /*
                var(--boo, var(--wow, var(--beh
                
                =>   var(--boo, var(--wow, var(--beh)))
            */
            (new Array(/*arrayLength: */reducedSwitchOf.totalClosingCount)).fill(')').join('')
            
            +
            
            (reducedSwitchOf.hasImportant ? ' !important' : '')
        ) as CssCustomRef;
    }
    finally {
        // reset the accumulator to be used later:
        reducedSwitchOf.totalClosingCount = 0;
        reducedSwitchOf.hasImportant = false;
        reducedSwitchOf.truncatedRefs.splice(0);
    } // try
}
