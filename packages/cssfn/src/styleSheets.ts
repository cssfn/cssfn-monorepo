// cssfn:
import type {
    // types:
    ProductOrFactory,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssStyleCollection,
    
    CssClassName,
    
    CssScopeName,
    CssScopeOptions,
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
    
             #scopes          : ProductOrFactory<CssScopeList<TCssScopeName>|null>
    readonly #classes         : CssScopeMap<TCssScopeName>
             
             /**
             * Prevents unecessary firing `#updatedCallback` until the first time of renderable StyleSheet is constructed
             */
             #loaded          : boolean
    //#endregion private properties
    
    
    
    //#region constructors
    constructor(scopes: ProductOrFactory<CssScopeList<TCssScopeName>|null> | Observable<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean>, updatedCallback: StyleSheetUpdatedCallback<TCssScopeName>|null, options?: StyleSheetOptions) {
        const styleSheetOptions : Required<StyleSheetOptions> = {
            ...(options ?? {}),
            enabled : options?.enabled ?? defaultStyleSheetOptions.enabled,
            id      : options?.id      ?? defaultStyleSheetOptions.id,
        };
        this.#options = styleSheetOptions;
        this.#updatedCallback = updatedCallback;
        
        this.#scopes = null;  // initial
        this.#loaded = false; // initial
        this.#updateScopes(scopes);
        
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
    
    
    
    //#region private methods
    #updateScopes(scopes: ProductOrFactory<CssScopeList<TCssScopeName>|null> | Observable<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean>) {
        if (scopes && (typeof(scopes) === 'object') && !Array.isArray(scopes)) {
            this.#scopes     = null;  // initially empty scope, until the Observable gives the first update
            this.#loaded     = false; // partially initialized => not ready to render for the first time, waiting until the Observable giving __the_first_CssScopeList__
            
            let asyncUpdate = false;
            scopes.subscribe((newScopesOrEnabled) => {
                if (typeof(newScopesOrEnabled) === 'boolean') {
                    // update prop `enabled`:
                    
                    if (this.#options.enabled === newScopesOrEnabled) return; // no change => no need to update
                    
                    this.#options.enabled = newScopesOrEnabled; // update
                }
                else {
                    // update prop `scopes`:
                    
                    if ((this.#scopes === null) && (newScopesOrEnabled === null)) return; // still null => no change => no need to update
                    // CssScopeList is always treated as unique object even though it's equal by ref, no deep comparison for performance reason
                    
                    this.#scopes = newScopesOrEnabled; // update
                } // if
                
                
                
                if (this.#options.enabled && this.#scopes) {
                    this.#loaded = true; // fully initialized => ready to render for the first time
                } // if
                
                
                
                if (asyncUpdate) {
                    this.#notifyUpdated(); // notify a StyleSheet updated
                } // if
            });
            asyncUpdate = true; // any updates after this mark is async update
        }
        else {
            this.#scopes     = scopes;
            this.#loaded     = true;  // fully initialized => ready
        } // if
    }
    
    #notifyUpdated(): void {
        if (!this.#loaded) return; // partially initialized => not ready to render for the first time
        
        
        
        this.#updatedCallback?.(this); // notify a StyleSheet updated
    }
    //#endregion private methods
    
    
    
    //#region public properties
    get enabled() {
        return (
            this.#options.enabled
            &&
            this.#loaded
            &&
            (
                !!this.#scopes
                &&
                (
                    (typeof(this.#scopes) === 'function')
                    ||
                    !!this.#scopes.length
                )
            )
        );
    }
    
    get id() {
        return this.#options.id;
    }
    
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
    add<TCssScopeName extends CssScopeName>(scopes: ProductOrFactory<CssScopeList<TCssScopeName>|null> | Observable<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean>, options?: StyleSheetOptions) {
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



export const styleSheetRegistry = new StyleSheetRegistry();
export const styleSheets = <TCssScopeName extends CssScopeName>(scopes: ProductOrFactory<CssScopeList<TCssScopeName>|null> | Observable<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean>, options?: StyleSheetOptions): CssScopeMap<TCssScopeName> => {
    const sheet = styleSheetRegistry.add(scopes, options);
    return sheet.classes;
}

const isObservable = (styles: CssStyleCollection | Observable<CssStyleCollection|boolean>): styles is Observable<CssStyleCollection|boolean> => (
    !!styles
    &&
    (typeof(styles) === 'object')
    &&
    (styles.constructor !== {}.constructor)
)
export const styleSheet = (styles: CssStyleCollection | Observable<CssStyleCollection|boolean>, options?: StyleSheetOptions & CssScopeOptions): CssClassName => {
    if (!styles || (styles === true)) {
        const classes = styleSheets<'main'>(
            null,   // empty scope
            options // styleSheet options
        );
        return classes.main;
    }
    else if (isObservable(styles)) {
        const dynamicStyleSheet = new Subject<CssScopeList<'main'>|null|boolean>();
        const classes = styleSheets(
            dynamicStyleSheet,
            options  // styleSheet options
        );
        styles.subscribe((newStylesOrEnabled) => {
            if (typeof(newStylesOrEnabled) === 'boolean') {
                // update prop `enabled`:
                
                dynamicStyleSheet.next(newStylesOrEnabled);
            }
            else {
                // update prop `scopes`:
                
                dynamicStyleSheet.next(
                    (!newStylesOrEnabled /* || (newStyles === true)*/)
                    ?
                    null                           // empty scope
                    :
                    [['main', newStylesOrEnabled, options]] // scopeOf('main', styles, options)
                );
            } // if
        });
        return classes.main;
    }
    else {
        const classes = styleSheets(
            [['main', styles, options]], // scopeOf('main', styles, options)
            options                      // styleSheet options
        );
        return classes.main;
    } // if
}
