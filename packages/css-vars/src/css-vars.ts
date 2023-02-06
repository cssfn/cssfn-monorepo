// cssfn:
import type {
    // optionals:
    OptionalOrBoolean,
    
    
    
    // dictionaries/maps:
    Dictionary,
}                           from '@cssfn/types'
import type {
    // css custom properties:
    CssCustomSimpleRef,
    CssCustomRef,
    CssCustomValue,
}                           from '@cssfn/css-types'
import {
    // processors:
    renderValue,
}                           from '@cssfn/cssfn'



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



let globalIdCounter = 0;



/**
 * Declares & retrieves *css variables* (css custom properties).
 */
export const cssVars = <TCssCustomProps extends {}>(options?: CssVarsOptions): CssVarsWithOptions<TCssCustomProps> => {
    // options:
    const liveOptions = new LiveCssVarsOptions(() => {
        propRefsCache.clear(); // the cached propRef(s) are depended on [prefix] & [minify], the [prefix] and/or [minify] was changed => cached propRef(s) are now invalid
    }, options);
    
    
    
    // data generates:
    
    const propRefsCache   = new Map<string, CssCustomSimpleRef>();
    const takenIdRegistry = new Map<string, string>();
    
    const updateRef = (propName: string, id: string): CssCustomSimpleRef => {
        const prefix   = liveOptions.prefix;
        const propRef : CssCustomSimpleRef = prefix ? `var(--${prefix}-${id})` : `var(--${id})`; // add double dash with prefix `--prefix-` or double dash without prefix `--`
        
        propRefsCache.set(propName, propRef);
        return propRef;
    };
    
    /**
     * Gets the *value* (reference) of the specified `propName`, not the *direct* value, eg: `var(--my-favColor)`.
     * @param propName The prop name to retrieve.
     * @returns A `CssCustomSimpleRef` represents the expression for retrieving the value of the specified `propName`.
     */
    const ref = (propName: string): CssCustomSimpleRef => {
        const cached = propRefsCache.get(propName);
        if (cached !== undefined) return cached;
        
        
        
        if (!liveOptions.minify) {
            return updateRef(propName, /*static_id: */ propName);
        } // if
        
        
        
        const existingAutoId = takenIdRegistry.get(propName);
        if (existingAutoId !== undefined) return updateRef(propName, /*auto_id: */ existingAutoId);
        
        
        
        /*
            The `globalIdCounter` increases on every call of `cssVars()` -- if the `CssVarsOptions` set to `minify = true (default)`.
            In practice, the `cssVars()` is always be called on *top-level-module*.
            So, when the (component) modules are RE_LOADED, the `cssVars()` WON'T be re-called.
            So, the MEMORY_LEAK is NEVER occured.
        */
        const newAutoId = `v${++globalIdCounter}`; // the global counter is always incremented, so it's guaranteed to be unique
        takenIdRegistry.set(propName, newAutoId);  // register the newAutoId to be re-use later (when the cache get invalidated)
        return updateRef(propName, /*auto_id: */ newAutoId);
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
/**
 * Required : must be `var(--boo)`.
 */
type FirstRef = CssCustomRef

/**
 * Optional : must be `var(--boo)`.
 */
type NextRef  = OptionalOrBoolean<CssCustomRef>

/**
 * Optional : must be `var(--boo)` -or- `'value'` -or- `1234`.
 */
type LastRef  = OptionalOrBoolean<CssCustomRef|CssCustomValue>

/**
 * A `var(--boo)` followed by (`var(--boo)`)* and optionally ends with `'value'` -or- `1234`.
 */
export type RefList = [FirstRef, ...([...NextRef[], LastRef]|[])]

export const switchOf = (...refs: RefList): CssCustomRef => {
    let hasImportant = false;
    let totalClosingCount = 0;
    let result = '';
    
    
    
    for (let ref of refs) {
        // conditions:
        if (!ref || (ref === true)) continue; // falsy ref => ignore
        
        
        
        // a bare value => render it:
        if ((typeof(ref) !== 'string') || !ref.startsWith('var(--')) {
            let rendered = renderValue(ref);
            if ((rendered.length > 11) && rendered.endsWith(' !important')) {
                hasImportant = true;
                rendered = rendered.slice(0, -11).trimEnd(); // remove ' !important' and then remove excess space(s)
            } // if
            
            
            
            if (result) result += ', ';
            result += rendered;
            continue; // handled => continue to next loop
        } // if
        
        
        
        // remove the ending !important:
        if (ref.endsWith('!important')) {
            hasImportant = true;
            ref = ref.slice(0, -10).trimEnd(); // remove '!important' and then remove excess space(s)
        } // if
        
        
        
        // count the closing )):
        let closingCount = 0;
        for (let index = ref.length - 1; index >= 0; index--) {
            if (ref.at(index) !== ')') break;
            closingCount++;
        } // for
        totalClosingCount += closingCount;
        
        
        
        // remove the ending closing )):
        /*
            var(--boo)               =>   var(--boo
            var(--wow, var(--beh))   =>   var(--wow, var(--beh
        */
        /*
            var(--boo
            var(--wow, var(--beh
            
            =>   var(--boo, var(--wow, var(--beh
        */
        if (result) result += ', ';
        result += ref.slice(0, -closingCount);
    } // for
    
    
    
    /*
        var(--boo, var(--wow, var(--beh
        
        =>   var(--boo, var(--wow, var(--beh)))
    */
    if (totalClosingCount) result += ')'.repeat(totalClosingCount);
    if (hasImportant) result += ' !important';
    
    
    
    return result as CssCustomRef;
}
