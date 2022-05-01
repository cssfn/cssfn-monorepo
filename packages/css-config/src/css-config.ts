// cssfn:
import type {
    Factory,
    ProductOrFactory,
    Dictionary,
    ValueOf,
    DictionaryOf,
}                           from '@cssfn/types'
import type {
    // css custom properties:
    CssCustomSimpleRef,
    CssCustomRef,
    
    
    
    // cssfn properties:
    CssKeyframes,
    
    CssSelector,
}                           from '@cssfn/css-types'
import type {
    // utilities:
    camelCase,
    pascalCase,
}                           from '@cssfn/cssfn'



// general types:
export interface CssConfigProps { }
export type Refs<TProps extends CssConfigProps> = { [key in keyof TProps]: CssCustomSimpleRef }
export type Vals<TProps extends CssConfigProps> = { [key in keyof TProps]: TProps[key]        }

export interface CssConfigOptions {
    /**
     * The prefix name of the generated css vars.
     */
    prefix   ?: string
    
    /**
     * The declaring location (selector) of the generated css vars.
     */
    selector ?: CssSelector
}
const defaultOptions : Required<CssConfigOptions> = {
    prefix    : '',
    selector  : ':root',
}
class LiveCssConfigOptions implements Required<CssConfigOptions> {
    //#region private properties
    #prefix   : string
    #selector : CssSelector
    
    readonly #updatedCallback : () => void
    //#endregion private properties
    
    
    
    //#region constructors
    constructor(updatedCallback: () => void, options?: CssConfigOptions) {
        this.#prefix   = options?.prefix   ?? defaultOptions.prefix;   // an empty prefix   is allowed
        this.#selector = options?.selector || defaultOptions.selector; // an empty selector is not allowed
        
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
        this.update(); // notify a css-config updated
    }
    
    get selector() {
        return this.#selector;
    }
    set selector(value: CssSelector) {
        value = value || defaultOptions.selector; // an empty selector is not allowed
        if (this.#selector === value) return; // no change => no need to update
        
        this.#selector = value; // update
        this.update(); // notify a css-config updated
    }
    //#endregion public properties
    
    
    
    //#region public methods
    update() {
        this.#updatedCallback?.(); // notify a css-config updated
    }
    //#endregion public methods
}
