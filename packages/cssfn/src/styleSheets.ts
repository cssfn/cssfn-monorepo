// cssfn:
import type {
    // types:
    ProductOrFactory,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssScopeName,
    CssScopeList,
    CssScopeMap,
}                           from '@cssfn/css-types'

// other libs:
import {
    // tests:
    isBrowser,
}                           from 'is-in-browser'
import {
    Subject,
}                           from 'rxjs'



// style sheets:

export interface StyleSheetOptions {
    enabled ?: boolean
    id      ?: string
}
const defaultStyleSheetOptions : Required<StyleSheetOptions> = {
    enabled  : true,
    id       : '',
}

type StyleSheetUpdatedCallback<TCssScopeName extends CssScopeName> = (styleSheet: StyleSheet<TCssScopeName>) => void;
class StyleSheet<TCssScopeName extends CssScopeName = CssScopeName> implements Required<StyleSheetOptions> {
    //#region private properties
    #options         : Required<StyleSheetOptions>
    #updatedCallback : StyleSheetUpdatedCallback<TCssScopeName>|null
    
    #scopes          : ProductOrFactory<CssScopeList<TCssScopeName>>
    #classes         : CssScopeMap<TCssScopeName>
    //#endregion private properties
    
    
    
    //#region constructors
    constructor(scopes: ProductOrFactory<CssScopeList<TCssScopeName>>, updatedCallback: StyleSheetUpdatedCallback<TCssScopeName>|null, options?: StyleSheetOptions) {
        this.#options         = {
            ...(options ?? {}),
            enabled : options?.enabled ?? defaultStyleSheetOptions.enabled,
            id      : options?.id      ?? defaultStyleSheetOptions.id,
        };
        this.#updatedCallback = updatedCallback;
        
        this.#scopes          = scopes;
        this.#classes         = ({} as CssScopeMap<TCssScopeName>);
    }
    //#endregion constructors
    
    
    
    //#region public options
    get enabled() { return this.#options.enabled }
    set enabled(value: boolean) {
        if (this.#options.enabled === value) return; // no change => no need to update
        
        this.#options.enabled = value; // update
        this.#updatedCallback?.(this); // notify a StyleSheet updated
    }
    
    get id() { return this.#options.id }
    set id(value: string) {
        if (this.#options.id === value) return; // no change => no need to update
        
        this.#options.id = value;      // update
        this.#updatedCallback?.(this); // notify a StyleSheet updated
    }
    //#endregion public options
    
    
    
    //#region public properties
    get scopes() {
        return this.#scopes;
    }
    
    get classes() {
        return this.#classes;
    }
    //#endregion public properties
}
export type { StyleSheet } // only export the type but not the actual class



class StyleSheetRegistry {
    //#region private properties
    #styleSheets : StyleSheet<CssScopeName>[]
    #subscribers : Subject<StyleSheet<CssScopeName>>
    //#endregion private properties
    
    
    
    //#region constructors
    constructor() {
        this.#styleSheets = [];
        this.#subscribers = new Subject<StyleSheet<CssScopeName>>();
    }
    //#endregion constructors
    
    
    
    //#region public methods
    add<TCssScopeName extends CssScopeName>(scopes: ProductOrFactory<CssScopeList<TCssScopeName>>, options?: StyleSheetOptions) {
        if (!isBrowser) { // on server side => just pass a StyleSheet object
            return new StyleSheet<TCssScopeName>(
                scopes,
                null, // not listen for future updates
                options
            );
        } // if
        
        
        
        const newStyleSheet = new StyleSheet<TCssScopeName>(
            scopes,
            this.#styleSheetUpdated as any,               // listen for future updates
            options
        );
        this.#styleSheets.push(newStyleSheet as any);     // register to collection
        
        
        
        if (newStyleSheet.enabled) {                      // skip disabled styleSheet
            this.#subscribers.next(newStyleSheet as any); // notify a StyleSheet added
        } // if
        
        
        
        return newStyleSheet;
    }
    
    subscribe(subscriber: (styleSheet: StyleSheet<CssScopeName>) => void) {
        if (!isBrowser) return; // client side only
        
        
        
        //#region notify previously registered StyleSheet(s)
        const styleSheets = this.#styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            const styleSheet = styleSheets[i];
            if (!styleSheet.enabled) continue; // skip disabled styleSheet
            
            subscriber(styleSheet);
        } // for
        //#endregion notify previously registered StyleSheet(s)
        
        return this.#subscribers.subscribe(subscriber); // listen for future updates
    }
    //#endregion public methods
    
    
    
    //#region private callbacks
    #styleSheetUpdated = (styleSheet: StyleSheet<CssScopeName>): void => {
        this.#subscribers.next(styleSheet); // notify a StyleSheet updated
    }
    //#endregion private callbacks
}
export type { StyleSheetRegistry } // only export the type but not the actual class



export const styleSheets = new StyleSheetRegistry();
export const styleSheet = <TCssScopeName extends CssScopeName>(scopes: ProductOrFactory<CssScopeList<TCssScopeName>>, options?: StyleSheetOptions): StyleSheet<TCssScopeName> => {
    return styleSheets.add(scopes, options);
}
