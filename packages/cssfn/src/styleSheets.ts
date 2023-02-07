// cssfn:
import type {
    // factories:
    MaybeFactory,
    
    
    
    // modules:
    MaybeLazyModuleDefault,
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
    Observable,
    Subject,
}                           from 'rxjs'



// types:
export type StyleSheetsFactoryBase<TCssScopeName extends CssScopeName> = MaybeFactory<CssScopeList<TCssScopeName>|null> | Observable<MaybeFactory<CssScopeList<TCssScopeName>|null>|boolean>
export type StyleSheetFactoryBase                                      = CssStyleCollection | Observable<CssStyleCollection|boolean>
export type StyleSheetsFactory<TCssScopeName extends CssScopeName>     = MaybeLazyModuleDefault<StyleSheetsFactoryBase<TCssScopeName>>
export type StyleSheetFactory                                          = MaybeLazyModuleDefault<StyleSheetFactoryBase>



// utilities:
export const isObservableScopes = <TCssScopeName extends CssScopeName>(scopes: StyleSheetsFactoryBase<TCssScopeName>): scopes is Observable<MaybeFactory<CssScopeList<TCssScopeName>|null>|boolean> => (
    !!scopes
    &&
    /*
        we cannot simple use `scopes instanceof Observable`
        because the `Observable class` may be refer to *different module instance* of 'rxjs'
        so a several tests must be performed
    */
    (typeof(scopes) === 'object')
    &&
    !Array.isArray(scopes) // not object of Array of CssScopeList<TCssScopeName>
)
export const isObservableStyles = (styles: StyleSheetFactoryBase): styles is Observable<CssStyleCollection|boolean> => (
    !!styles
    &&
    /*
        we cannot simple use `scopes instanceof Observable`
        because the `Observable class` may be refer to *different module instance* of 'rxjs'
        so a several tests must be performed
    */
    (typeof(styles) === 'object')
    &&
    !Array.isArray(styles) // not object of Array of MaybeFactoryDeepArray<OptionalOrBoolean<CssStyle>>[]
    &&
    (Object.getPrototypeOf(styles) !== Object.prototype) // `CssStyle` object is guaranteed to be a literal object
)



// style sheets:

export interface StyleSheetOptions {
    enabled ?: boolean
    id      ?: string
    
    ssr     ?: boolean
    lazyCsr ?: boolean
}
const defaultStyleSheetOptions : Required<StyleSheetOptions> = {
    enabled  : true,
    id       : '',
    
    ssr      : true,
    lazyCsr  : true,
}

type StyleSheetUpdatedCallback<in TCssScopeName extends CssScopeName> = (styleSheet: StyleSheet<TCssScopeName>) => void;
class StyleSheet<out TCssScopeName extends CssScopeName = CssScopeName> implements Required<StyleSheetOptions> {
    //#region private properties
    // configs:
    readonly    #options         : Required<StyleSheetOptions>
    readonly    #updatedCallback : StyleSheetUpdatedCallback<TCssScopeName>|null
    
    
    
    // states:
    readonly    #scopesFactory   : StyleSheetsFactory<TCssScopeName>
    /*mutable*/ #scopesInvoked   : boolean
    /*mutable*/ #scopesLive      : MaybeFactory<CssScopeList<TCssScopeName>|null>
    
    
    
    // css classes:
    readonly    #classes         : CssScopeMap<TCssScopeName>
    //#endregion private properties
    
    
    
    //#region constructors
    constructor(scopes: StyleSheetsFactory<TCssScopeName>, updatedCallback: StyleSheetUpdatedCallback<TCssScopeName>|null, options?: StyleSheetOptions) {
        // configs:
        const styleSheetOptions : Required<StyleSheetOptions> = {
            ...(options ?? {}),
            enabled : options?.enabled ?? defaultStyleSheetOptions.enabled,
            id      : options?.id      ?? defaultStyleSheetOptions.id,
            
            ssr     : options?.ssr     ?? defaultStyleSheetOptions.ssr,
            lazyCsr : options?.lazyCsr ?? defaultStyleSheetOptions.lazyCsr,
        };
        this.#options           = styleSheetOptions;
        this.#updatedCallback   = updatedCallback;
        
        
        
        // states:
        this.#scopesFactory = scopes;
        this.#scopesInvoked = false;
        this.#scopesLive    = null;
        
        
        
        // css classes:
        const scopeMap = {} as CssScopeMap<TCssScopeName>;
        this.#classes  = new Proxy<CssScopeMap<TCssScopeName>>(scopeMap, {
            get(scopeMap: CssScopeMap<TCssScopeName>, scopeName: TCssScopeName|symbol): CssClassName|undefined {
                // ignores symbol & number props:
                if (typeof(scopeName) !== 'string') return undefined;
                
                
                
                // if already cached => return immediately:
                if (scopeName in scopeMap) return scopeMap[scopeName];
                
                
                
                // calculate unique class:
                const uniqueClass : CssClassName = generateId(styleSheetOptions.id, scopeName);
                
                
                
                // update the cache & return:
                scopeMap[scopeName] = uniqueClass;
                return uniqueClass;
            },
        });
    }
    //#endregion constructors
    
    
    
    //#region private methods
    #invokeScopesIfNeeded(): void {
        // conditions:
        if (this.#scopesInvoked) return; // already (successfully) invoked => no need to re-invoke
        
        
        
        const scopesValue = (typeof(this.#scopesFactory) !== 'function') ? this.#scopesFactory : this.#scopesFactory();
        if (!(scopesValue instanceof Promise)) {
            this.#updateScopes(scopesValue);
        }
        else {
            scopesValue.then((resolvedScopes) => {
                this.#updateScopes(resolvedScopes.default);
            });
        } // if
        this.#scopesInvoked = true; // mark as successfully invoked
    }
    #updateScopes(scopes: StyleSheetsFactoryBase<TCssScopeName>): void {
        if (!isObservableScopes(scopes)) {
            this.#scopesLive = scopes; // update once
        }
        else {
            let subsequentUpdate = false;
            scopes.subscribe((newScopesOrEnabled) => {
                if (typeof(newScopesOrEnabled) === 'boolean') {
                    // update prop `enabled`:
                    
                    if (this.#options.enabled === newScopesOrEnabled) return; // no change => no need to update
                    
                    this.#options.enabled = newScopesOrEnabled; // update
                }
                else {
                    // update prop `scopes`:
                    
                    if ((this.#scopesLive === null) && (newScopesOrEnabled === null)) return; // still null => no change => no need to update
                    // CssScopeList is always treated as unique object even though it's equal by ref, no deep comparison for performance reason
                    
                    this.#scopesLive = newScopesOrEnabled; // live update
                } // if
                
                
                
                // notify a StyleSheet updated ONLY on SUBSEQUENT update:
                if (subsequentUpdate) {
                    this.#notifyUpdated();
                } // if
            });
            subsequentUpdate = true; // any updates AFTER calling `scopes.subscribe` is considered as SUBSEQUENT update
        } // if
    }
    
    #notifyUpdated(): void {
        this.#updatedCallback?.(this); // notify a StyleSheet updated
    }
    //#endregion private methods
    
    
    
    //#region public properties
    get enabled() {
        return this.#options.enabled;
    }
    
    get id() {
        return this.#options.id;
    }
    
    get ssr() {
        return this.#options.ssr;
    }
    
    get lazyCsr() {
        return this.#options.lazyCsr;
    }
    
    get scopes() {
        this.#invokeScopesIfNeeded();
        return this.#scopesLive;
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
    add<TCssScopeName extends CssScopeName>(scopes: StyleSheetsFactory<TCssScopeName>, options?: StyleSheetOptions) {
        /*
            The `StyleSheetRegistry::add()` always be called every call of `styleSheet()`, `styleSheets()`, dynamicStyleSheet()`, and `dynamicStyleSheets()`.
            In practice, these 4 functions are always be called on *top-level-module*.
            So, when the (component) modules are RE_LOADED, the `StyleSheetRegistry::add()` WON'T be re-called.
            So, the MEMORY_LEAK is NEVER occured.
        */
        
        
        
        const newStyleSheet = new StyleSheet<TCssScopeName>(
            scopes,
            this.#styleSheetUpdated,               // listen for future updates
            options
        );
        this.#styleSheets.push(newStyleSheet);     // register to collection
        
        
        
        if (newStyleSheet.enabled) {               // skip disabled styleSheet
            this.#subscribers.next(newStyleSheet); // notify a StyleSheet added
        } // if
        
        
        
        return newStyleSheet;
    }
    
    subscribe(subscriber: (styleSheet: StyleSheet<CssScopeName>) => void) {
        //#region notify previously registered StyleSheet(s)
        const styleSheets = this.#styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            const styleSheet = styleSheets[i];
            if (!styleSheet.enabled) continue;     // skip disabled styleSheet
            
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
export const styleSheets     = <TCssScopeName extends CssScopeName>(scopes: StyleSheetsFactory<TCssScopeName>, options?: StyleSheetOptions): CssScopeMap<TCssScopeName> => {
    const sheet = styleSheetRegistry.add(scopes, options);
    return sheet.classes;
}
export const styleSheet      = (styles: StyleSheetFactory, options?: StyleSheetOptions & CssScopeOptions): CssClassName => {
    const stylesValue = (typeof(styles) !== 'function') ? styles : styles();
    
    
    
    if (!(stylesValue instanceof Promise)) {
        return styleSheets<'main'>(
            createMainScope(
                stylesValue,
                options /* as CssScopeOptions   */
            ),
            options     /* as StyleSheetOptions */
        ).main;
    }
    else {
        return styleSheets<'main'>(
            // Factory => Promise => ModuleDefault => StyleSheetsFactoryBase<'main'> :
            () => new Promise<{ default: StyleSheetsFactoryBase<'main'> }>((resolve) => {
                stylesValue.then((resolvedStyles) => {
                    resolve({
                        default: createMainScope(
                            resolvedStyles.default,
                            options /* as CssScopeOptions   */
                        )
                    });
                });
            }),
            options     /* as StyleSheetOptions */
        ).main;
    } // if
}
export const createMainScope = (styles: StyleSheetFactoryBase, options: CssScopeOptions|undefined): StyleSheetsFactoryBase<'main'> => {
    if (!styles || (styles === true)) {
        return null; // empty scope
    }
    else if (isObservableStyles(styles)) { // styles: Observable<CssStyleCollection>
        const dynamicStyleSheet = new Subject<MaybeFactory<CssScopeList<'main'>|null>|boolean>();
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
                    null                                    // empty scope
                    :
                    [['main', newStylesOrEnabled, options]] // scopeOf('main', styles, options)
                );
            } // if
        });
        return dynamicStyleSheet; // as Observable<MaybeFactory<CssScopeList<'main'>|null>|boolean>
    }
    else {
        return [['main', styles, options]]; // scopeOf('main', styles, options)
    } // if
}
