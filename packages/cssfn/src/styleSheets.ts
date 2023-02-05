// cssfn:
import type {
    // types:
    MaybePromise,
    ModuleDefault,
    MaybeModuleDefault,
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
    Observable,
    Subject,
}                           from 'rxjs'



// types:
export type StyleSheetsFactoryBase<TCssScopeName extends CssScopeName> = ProductOrFactory<CssScopeList<TCssScopeName>|null> | Observable<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean>
export type StyleSheetFactoryBase                                      = CssStyleCollection | Observable<CssStyleCollection|boolean>
export type StyleSheetsFactory<TCssScopeName extends CssScopeName>     = MaybePromise<MaybeModuleDefault<StyleSheetsFactoryBase<TCssScopeName>>>
export type StyleSheetFactory                                          = MaybePromise<MaybeModuleDefault<StyleSheetFactoryBase>>



// utilities:
export const isPromise          = <T>(test: MaybePromise<T>): test is Promise<T> => (
    !!test
    &&
    (test instanceof Promise<T>)
)
export const isModuleDefault    = <T>(test: MaybeModuleDefault<T>): test is ModuleDefault<T> => (
    !!test
    &&
    test instanceof Object
    &&
    (Object.getPrototypeOf(test) === Object.prototype) // must be a literal object -- object of Array|Function|Observable|Promise are not accepted
    &&
    ('default' in test)                                // the literal object must have [default] prop -- a literal object of `CssStyle` is guaranteed to never have a [default] prop if written correctly
)
export const isObservableScopes = <TCssScopeName extends CssScopeName>(scopes: StyleSheetsFactoryBase<TCssScopeName>): scopes is Observable<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean> => (
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
    !Array.isArray(styles) // not object of Array of ProductOrFactoryDeepArray<OptionalOrBoolean<CssStyle>>[]
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
    constructor(scopes: StyleSheetsFactory<TCssScopeName>, updatedCallback: StyleSheetUpdatedCallback<TCssScopeName>|null, options?: StyleSheetOptions) {
        const styleSheetOptions : Required<StyleSheetOptions> = {
            ...(options ?? {}),
            enabled : options?.enabled ?? defaultStyleSheetOptions.enabled,
            id      : options?.id      ?? defaultStyleSheetOptions.id,
            
            ssr     : options?.ssr     ?? defaultStyleSheetOptions.ssr,
            lazyCsr : options?.lazyCsr ?? defaultStyleSheetOptions.lazyCsr,
        };
        this.#options = styleSheetOptions;
        this.#updatedCallback = updatedCallback;
        
        this.#scopes = null;  // initial
        this.#loaded = false; // initial
        this.#resolveScopes(scopes);
        
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
    #resolveScopes(scopes: StyleSheetsFactory<TCssScopeName>): void {
        if (!isPromise(scopes)) {
            this.#updateScopes(!isModuleDefault(scopes) ? scopes : scopes.default);
        }
        else {
            scopes.then((resolvedScopes) => {
                this.#updateScopes(!isModuleDefault(resolvedScopes) ? resolvedScopes : resolvedScopes.default);
            });
        } // if
    }
    #updateScopes(scopes: StyleSheetsFactoryBase<TCssScopeName>): void {
        if (isObservableScopes(scopes)) {
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
    
    get ssr() {
        return this.#options.ssr;
    }
    
    get lazyCsr() {
        return this.#options.lazyCsr;
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
export const styleSheets = <TCssScopeName extends CssScopeName>(scopes: StyleSheetsFactory<TCssScopeName>, options?: StyleSheetOptions): CssScopeMap<TCssScopeName> => {
    const sheet = styleSheetRegistry.add(scopes, options);
    return sheet.classes;
}
export const styleSheet  = (styles: StyleSheetFactory, options?: StyleSheetOptions & CssScopeOptions): CssClassName => {
    if (isPromise(styles)) {
        const classes = styleSheets<'main'>(
            new Promise<MaybeModuleDefault<StyleSheetsFactoryBase<'main'>>>((resolve) => {
                styles.then((resolvedStyles) => {
                    resolve(
                        createMainScope(
                            !isModuleDefault(resolvedStyles) ? resolvedStyles : resolvedStyles.default,
                            options /* as CssScopeOptions   */
                        )
                    );
                });
            }),
            options     /* as StyleSheetOptions */
        );
        return classes.main;
    } // if
    
    
    
    const classes = styleSheets<'main'>(
        createMainScope(
            styles,
            options /* as CssScopeOptions   */
        ),
        options     /* as StyleSheetOptions */
    );
    return classes.main;
}
const createMainScope    = (styles: StyleSheetFactoryBase, options: CssScopeOptions|undefined): StyleSheetsFactoryBase<'main'> => {
    if (!styles || (styles === true)) {
        return null; // empty scope
    }
    else if (isObservableStyles(styles)) { // styles: Observable<CssStyleCollection>
        const dynamicStyleSheet = new Subject<ProductOrFactory<CssScopeList<'main'>|null>|boolean>();
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
        return dynamicStyleSheet; // as Observable<ProductOrFactory<CssScopeList<'main'>|null>|boolean>
    }
    else {
        return [['main', styles, options]]; // scopeOf('main', styles, options)
    } // if
}
