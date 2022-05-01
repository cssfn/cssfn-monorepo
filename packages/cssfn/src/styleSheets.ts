// cssfn:
import type {
    // types:
    ProductOrFactory,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssClassName,
    
    CssScopeName,
    CssScopeList,
    CssScopeMap,
}                           from '@cssfn/css-types'
import {
    generateId,
}                           from './utilities.js'

// other libs:
import {
    // tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'
import {
    Observable,
    Subject,
}                           from 'rxjs'



const isClientSide : boolean = isBrowser || isJsDom;



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
    readonly #options         : Required<StyleSheetOptions>
    readonly #updatedCallback : StyleSheetUpdatedCallback<TCssScopeName>|null
    
             #scopes          : ProductOrFactory<CssScopeList<TCssScopeName>>
    readonly #classes         : CssScopeMap<TCssScopeName>
             #loaded          : boolean
    //#endregion private properties
    
    
    
    //#region constructors
    constructor(scopes: ProductOrFactory<CssScopeList<TCssScopeName>> | Observable<CssScopeList<TCssScopeName>>, updatedCallback: StyleSheetUpdatedCallback<TCssScopeName>|null, options?: StyleSheetOptions) {
        const styleSheetOptions : Required<StyleSheetOptions> = {
            ...(options ?? {}),
            enabled : options?.enabled ?? defaultStyleSheetOptions.enabled,
            id      : options?.id      ?? defaultStyleSheetOptions.id,
        };
        this.#options = styleSheetOptions;
        this.#updatedCallback = updatedCallback;
        
        if (scopes && (typeof(scopes) === 'object') && !Array.isArray(scopes)) {
            this.#scopes      = [];    // initially empty scope, until the Observable gives the first update
            this.#loaded      = false; // partially initialized => not ready
            
            scopes.subscribe((newScopes) => {
                this.#scopes  = newScopes;
                this.#loaded  = true; // fully initialized => ready
                this.refresh();       // notify a StyleSheet updated
            });
        }
        else {
            this.#scopes      = scopes;
            this.#loaded      = true; // fully initialized => ready
        } // if
        this.#classes         = new Proxy<CssScopeMap<TCssScopeName>>(({} as CssScopeMap<TCssScopeName>), {
            get(scopeMap: object, scopeName: TCssScopeName): CssClassName {
                // if already cached => return immediately:
                if (scopeName in scopeMap) return (scopeMap as any)[scopeName];
                
                
                
                // calculate unique class:
                const uniqueClass : CssClassName = generateId(styleSheetOptions.id, scopeName);
                
                
                
                // update the cache & return:
                (scopeMap as any)[scopeName] = uniqueClass;
                return uniqueClass;
            },
        });
    }
    //#endregion constructors
    
    
    
    //#region public options
    get enabled() { return this.#options.enabled && this.#loaded }
    set enabled(value: boolean) {
        if (this.#options.enabled === value) return; // no change => no need to update
        
        this.#options.enabled = value; // update
        this.refresh(); // notify a StyleSheet updated
    }
    
    get id() { return this.#options.id }
    set id(value: string) {
        if (this.#options.id === value) return; // no change => no need to update
        
        this.#options.id = value; // update
        this.refresh(); // notify a StyleSheet updated
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
    
    
    
    //#region public methods
    refresh() {
        if (!this.#loaded) return; // partially initialized => not ready to render
        
        
        
        this.#updatedCallback?.(this); // notify a StyleSheet updated
    }
    //#endregion public methods
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
    add<TCssScopeName extends CssScopeName>(scopes: ProductOrFactory<CssScopeList<TCssScopeName>> | Observable<CssScopeList<TCssScopeName>>, options?: StyleSheetOptions) {
        if (!isClientSide) { // on server side => just pass a StyleSheet object
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
        if (!isClientSide) return; // client side only
        
        
        
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
export const styleSheet = <TCssScopeName extends CssScopeName>(scopes: ProductOrFactory<CssScopeList<TCssScopeName>> | Observable<CssScopeList<TCssScopeName>>, options?: StyleSheetOptions): StyleSheet<TCssScopeName> => {
    return styleSheets.add(scopes, options);
}
