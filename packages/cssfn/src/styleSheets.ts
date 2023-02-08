// cssfn:
import type {
    // factories:
    MaybeFactory,
    
    
    
    // modules:
    ModuleDefault,
    LazyModuleDefault,
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
export type StyleSheetsFactoryBase<TCssScopeName extends CssScopeName> = MaybeFactory<CssScopeList<TCssScopeName>|null> | Observable<MaybeFactory<CssScopeList<TCssScopeName>|null> | boolean>
export type StyleSheetFactoryBase                                      = CssStyleCollection                             | Observable<CssStyleCollection                             | boolean>
export type StyleSheetsFactory<TCssScopeName extends CssScopeName>     = StyleSheetsFactoryBase<TCssScopeName>          | LazyModuleDefault<Exclude<StyleSheetsFactoryBase<TCssScopeName>, Observable<any>>>
export type StyleSheetFactory                                          = StyleSheetFactoryBase                          | LazyModuleDefault<Exclude<StyleSheetFactoryBase                , Observable<any>>>



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

export type StyleSheetUpdatedCallback<in TCssScopeName extends CssScopeName> = (styleSheet: StyleSheet<TCssScopeName>) => void;
export class StyleSheet<out TCssScopeName extends CssScopeName = CssScopeName> implements Required<StyleSheetOptions> {
    //#region private properties
    // configs:
    readonly    #options         : Required<StyleSheetOptions>
    readonly    #updatedCallback : StyleSheetUpdatedCallback<TCssScopeName>
    
    
    
    // states:
    readonly    #scopesFactory   : StyleSheetsFactory<TCssScopeName>
    /*mutable*/ #scopesActivated : boolean
    /*mutable*/ #scopesLive      : MaybeFactory<CssScopeList<TCssScopeName>|null>
    
    
    
    // css classes:
    readonly    #classes         : CssScopeMap<TCssScopeName>
    //#endregion private properties
    
    
    
    //#region constructors
    constructor(scopesFactory: StyleSheetsFactory<TCssScopeName>, updatedCallback: StyleSheetUpdatedCallback<TCssScopeName>, options?: StyleSheetOptions) {
        // configs:
        const styleSheetOptions : Required<StyleSheetOptions> = {
            ...options,
            
            enabled : options?.enabled ?? defaultStyleSheetOptions.enabled,
            id      : options?.id      ?? defaultStyleSheetOptions.id,
            
            ssr     : options?.ssr     ?? defaultStyleSheetOptions.ssr,
            lazyCsr : options?.lazyCsr ?? defaultStyleSheetOptions.lazyCsr,
        };
        this.#options         = styleSheetOptions;
        this.#updatedCallback = updatedCallback;
        
        
        
        // states:
        this.#scopesFactory   = scopesFactory;
        this.#scopesActivated = false;
        this.#scopesLive      = null;
        
        
        
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
        
        
        
        // activate the scope immediately if the given `scopesFactory` is an `Observable` object,
        // so we can `subscribe()` -- aka `log()` for update requests as soon as possible
        if ((typeof(scopesFactory) !== 'function') && isObservableScopes(scopesFactory)) this.activateScopesIfNeeded();
    }
    //#endregion constructors
    
    
    
    //#region protected methods
    protected activateScopesIfNeeded(): void {
        // conditions:
        if (this.#scopesActivated) return; // stop execution if already activated
        
        
        
        // activation:
        // activate (call the callback function -- if the given scopesFactory is a function):
        const scopesValue = (typeof(this.#scopesFactory) !== 'function') ? this.#scopesFactory : this.#scopesFactory();
        
        
        
        // update scope:
        if (!(scopesValue instanceof Promise)) { // scopesValue is CssScopeList<TCssScopeName> | null | Observable<MaybeFactory<CssScopeList<TCssScopeName>|null> | boolean>
            /*
                make sure this function is only executed ONCE -or- NEVER,
                don't twice, three times, so on.
                Except: an error occured during activation. Eg: a network error during dynamic import().
            */
            this.#scopesActivated = true;
            
            
            
            this.updateScopes(scopesValue);
        }
        else { // scopesValue is Promise<ModuleDefault<MaybeFactory<CssScopeList<TCssScopeName> | null>>>
            scopesValue.then((resolvedScopes) => {
                /*
                    make sure this function is only executed ONCE -or- NEVER,
                    don't twice, three times, so on.
                    Except: an error occured during activation. Eg: a network error during dynamic import().
                */
                this.#scopesActivated = true;
                
                
                
                this.updateScopes(resolvedScopes.default);
            });
        } // if
    }
    protected updateScopes(scopes: StyleSheetsFactoryBase<TCssScopeName>): void {
        if (!isObservableScopes(scopes)) { // scopes is MaybeFactory<CssScopeList<TCssScopeName>|null>
            this.#scopesLive = scopes; // update once
        }
        else { // scopes is Observable<MaybeFactory<CssScopeList<TCssScopeName>|null>|boolean>
            let subsequentUpdate = false;
            scopes.subscribe((newScopesOrEnabled) => {
                if (typeof(newScopesOrEnabled) === 'boolean') { // newScopesOrEnabled is boolean
                    // update prop `enabled`:
                    
                    if (this.#options.enabled === newScopesOrEnabled) return; // no change => no need to update
                    
                    this.#options.enabled = newScopesOrEnabled; // update
                }
                else { // newScopesOrEnabled is MaybeFactory<CssScopeList<TCssScopeName>|null>
                    // update prop `scopes`:
                    
                    if ((this.#scopesLive === null) && (newScopesOrEnabled === null)) return; // still null => no change => no need to update
                    // CssScopeList is always treated as unique object even though it's equal by ref, no deep comparison for performance reason
                    
                    this.#scopesLive = newScopesOrEnabled; // live update
                } // if
                
                
                
                // notify a StyleSheet updated ONLY on SUBSEQUENT update:
                if (subsequentUpdate) {
                    this.notifyUpdated();
                } // if
            });
            subsequentUpdate = true; // any updates AFTER calling `scopes.subscribe` is considered as SUBSEQUENT update
        } // if
    }
    
    protected notifyUpdated(): void {
        this.#updatedCallback(this); // notify a StyleSheet updated
    }
    //#endregion protected methods
    
    
    
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
        this.activateScopesIfNeeded();
        return this.#scopesLive;
    }
    
    get classes() {
        return this.#classes;
    }
    //#endregion public properties
}



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
    add(newStyleSheet: StyleSheet<CssScopeName>) {
        /*
            The `StyleSheetRegistry::add()` always be called every call of `styleSheet()`, `styleSheets()`, dynamicStyleSheet()`, and `dynamicStyleSheets()`.
            In practice, these 4 functions are always be called on *top-level-module*.
            So, when the (component) modules are RE_LOADED, the `StyleSheetRegistry::add()` WON'T be re-called.
            So, the MEMORY_LEAK is NEVER occured.
        */
        
        
        
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
    
    
    
    //#region public callbacks
    handleStyleSheetUpdated = (styleSheet: StyleSheet<CssScopeName>): void => {
        this.#subscribers.next(styleSheet); // notify a StyleSheet updated
    }
    //#endregion public callbacks
}
export type { StyleSheetRegistry } // only export the type but not the actual class



export const styleSheetRegistry = new StyleSheetRegistry();
export const styleSheets        = <TCssScopeName extends CssScopeName>(scopes: StyleSheetsFactory<TCssScopeName>, options?: StyleSheetOptions): CssScopeMap<TCssScopeName> => {
    return styleSheetRegistry.add(new StyleSheet<TCssScopeName>(
        scopes,
        styleSheetRegistry.handleStyleSheetUpdated, // listen for future updates
        options
    )).classes;
}
export const styleSheet         = (styles: StyleSheetFactory, options?: StyleSheetOptions & CssScopeOptions): CssClassName => {
    return singularStyleSheet(styleSheets, styles, options).main;
}
export const singularStyleSheet = <TBaseStyleSheetsReturn>(baseStyleSheets: ((scopes: StyleSheetsFactory<'main'>, options?: StyleSheetOptions) => TBaseStyleSheetsReturn), styles: StyleSheetFactory, options?: StyleSheetOptions & CssScopeOptions): TBaseStyleSheetsReturn => {
    if (typeof(styles) !== 'function') {
        /*
            The `styles` is NOT a function => resolved immediately without to CALL the callback function.
        */
        return baseStyleSheets(
            createMainScope(
                styles,
                options /* as CssScopeOptions   */
            ),
            options     /* as StyleSheetOptions */
        );
    }
    else {
        /*
            The `styles` is a FUNCTION.
            To preserve the LAZINESS, we cannot CALL the function now.
            Instead we are returning a Factory for (maybe promising) the resolved `styles()`
        */
        return baseStyleSheets(
            // Factory => Promise<ModuleDefault<Exclude<StyleSheetsFactoryBase<'main'>, Observable<any>>>>
            // -or-
            // Factory => CssScopeList<'main'>|null
            ((): CssScopeList<'main'>|null | Promise<ModuleDefault<Exclude<StyleSheetsFactoryBase<'main'>, Observable<any>>>> => {
                const stylesValue = styles();
                
                
                
                if (!(stylesValue instanceof Promise)) {
                    /*
                        The `stylesValue` is NOT a Promise => resolved immediately.
                    */
                    return createMainScope(
                        stylesValue,
                        options /* as CssScopeOptions   */
                    );
                }
                else {
                    /*
                        The `stylesValue` is a PROMISE => create another Promise for waiting the `stylesValue` already resolved.
                    */
                    return new Promise<ModuleDefault<Exclude<StyleSheetsFactoryBase<'main'>, Observable<any>>>>((resolve) => {
                        stylesValue.then((resolvedStyles) => {
                            resolve({
                                default: createMainScope(
                                    resolvedStyles.default,
                                    options /* as CssScopeOptions   */
                                ),
                            });
                        });
                    });
                } // if
            }) as StyleSheetsFactory<'main'>,
            options     /* as StyleSheetOptions */
        );
    } // if
}
function createMainScope (styles: Exclude<StyleSheetFactoryBase, Observable<any>> , options: CssScopeOptions|undefined) : CssScopeList<'main'>|null ;
function createMainScope (styles:         StyleSheetFactoryBase                   , options: CssScopeOptions|undefined) : CssScopeList<'main'>|null | Observable<MaybeFactory<CssScopeList<'main'>|null> | boolean>;
function createMainScope (styles:         StyleSheetFactoryBase                   , options: CssScopeOptions|undefined) : CssScopeList<'main'>|null | Observable<MaybeFactory<CssScopeList<'main'>|null> | boolean> {
    if (!styles || (styles === true)) {
        return null; // empty scope
    }
    else if (!isObservableStyles(styles)) { // styles is CssStyleCollection
        return [['main', styles, options]]; // scopeOf('main', styles, options)
    }
    else { // styles is Observable<CssStyleCollection|boolean>
        const dynamicStyleSheet = new Subject<MaybeFactory<CssScopeList<'main'>|null>|boolean>();
        styles.subscribe((newStylesOrEnabled) => {
            if (typeof(newStylesOrEnabled) === 'boolean') { // newStylesOrEnabled is boolean
                // update prop `enabled`:
                
                dynamicStyleSheet.next(newStylesOrEnabled);
            }
            else { // newStylesOrEnabled is CssStyleCollection
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
    } // if
}
