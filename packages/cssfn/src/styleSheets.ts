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
    Subscription,
    Observable,
    Subject,
}                           from 'rxjs'
import {
    // tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'



// utilities:
const isClientSide : boolean = isBrowser || isJsDom;



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
    enabled   ?: boolean
    id        ?: string
    
    ssr       ?: boolean
    lazyCsr   ?: boolean
    prerender ?: boolean
}
const defaultStyleSheetOptions : Required<StyleSheetOptions> = {
    enabled    : true,
    id         : '',
    
    ssr        : true,
    lazyCsr    : true,
    prerender  : true,
}

export type StyleSheetUpdatedCallback<in TCssScopeName extends CssScopeName> = (styleSheet: StyleSheet<TCssScopeName>, type: StyleSheetUpdateChangedType) => void;
export class StyleSheet<out TCssScopeName extends CssScopeName = CssScopeName> implements Required<StyleSheetOptions> {
    //#region private properties
    // configs:
    private readonly    _options            : Required<StyleSheetOptions>
    private readonly    _updatedCallback    : StyleSheetUpdatedCallback<TCssScopeName>
    
    
    
    // states:
    private /*mutable*/ _scopesFactory      : StyleSheetsFactory<TCssScopeName>
    private /*mutable*/ _scopesActivated    : boolean
    private /*mutable*/ _scopesSubscription : Subscription|undefined
    private /*mutable*/ _scopesLive         : MaybeFactory<CssScopeList<TCssScopeName>|null>
    
    
    
    // css classes:
    private readonly    _classes            : CssScopeMap<TCssScopeName>
    //#endregion private properties
    
    
    
    //#region constructors
    constructor(scopesFactory: StyleSheetsFactory<TCssScopeName>, updatedCallback: StyleSheetUpdatedCallback<TCssScopeName>, options?: StyleSheetOptions) {
        // configs:
        const styleSheetOptions : Required<StyleSheetOptions> = {
            ...options,
            
            enabled   : options?.enabled   ?? defaultStyleSheetOptions.enabled,
            id        : options?.id        ?? defaultStyleSheetOptions.id,
            
            ssr       : options?.ssr       ?? defaultStyleSheetOptions.ssr,
            lazyCsr   : options?.lazyCsr   ?? defaultStyleSheetOptions.lazyCsr,
            prerender : options?.prerender ?? defaultStyleSheetOptions.prerender,
        };
        this._options            = styleSheetOptions;
        this._updatedCallback    = updatedCallback;
        
        
        
        // states:
        this._scopesFactory      = scopesFactory;
        this._scopesActivated    = false;
        this._scopesSubscription = undefined;
        this._scopesLive         = null;
        
        
        
        // css classes:
        const scopeMap = {} as CssScopeMap<TCssScopeName>;
        this._classes  = new Proxy<CssScopeMap<TCssScopeName>>(scopeMap, {
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
        if (
            // server side:
            // always activate the scopeFactory as soon as possible,
            // usually activated during module load -- when a styleSheet(s) is registered,
            // before the SSR render gets a chance to run
            !isClientSide
            ||
            // client side:
            // only activate the scopeFactory if the CSR is needed to be rendered
            ((typeof(scopesFactory) !== 'function') && isObservableScopes(scopesFactory))
        ) {
            this.activateScopesIfNeeded();
        } // if
    }
    //#endregion constructors
    
    
    
    //#region protected methods
    protected activateScopesIfNeeded(): void {
        // conditions:
        if (this._scopesActivated) return; // stop execution if already activated
        
        
        
        // activation:
        // activate (call the callback function -- if the given scopesFactory is a function):
        const scopesValue = (typeof(this._scopesFactory) !== 'function') ? this._scopesFactory : this._scopesFactory();
        
        
        
        // update scope:
        if (!(scopesValue instanceof Promise)) { // scopesValue is CssScopeList<TCssScopeName> | null | Observable<MaybeFactory<CssScopeList<TCssScopeName>|null> | boolean>
            /*
                make sure this function is only executed ONCE -or- NEVER,
                don't twice, three times, so on.
                Except: an error occured during activation. Eg: a network error during dynamic import().
            */
            this._scopesActivated = true;
            
            
            
            this.updateScopes(
                scopesValue,
                /* forceUpdate: */false // only update if NEEDED -- if `scopesValue is Observable` and the Observable makes ASYNC update
            );
        }
        else { // scopesValue is Promise<ModuleDefault<MaybeFactory<CssScopeList<TCssScopeName> | null>>>
            scopesValue.then((resolvedScopes) => {
                /*
                    make sure this function is only executed ONCE -or- NEVER,
                    don't twice, three times, so on.
                    Except: an error occured during activation. Eg: a network error during dynamic import().
                */
                this._scopesActivated = true;
                
                
                
                this.updateScopes(
                    resolvedScopes.default,
                    /* forceUpdate: */true // FORCE to update because a `Promise::then()` is considered a SUBSEQUENT update
                );
            });
        } // if
    }
    protected updateScopes(scopes: StyleSheetsFactoryBase<TCssScopeName>, forceUpdate = false): void {
        // states:
        let subsequentUpdate = !!this._scopesSubscription;
        
        
        
        // cleanups:
        this._scopesSubscription?.unsubscribe(); // unsubscribe the prev subscription (if any)
        this._scopesSubscription = undefined;    // allows GC to collect
        
        
        
        if (!isObservableScopes(scopes)) { // scopes is MaybeFactory<CssScopeList<TCssScopeName>|null>
            this._scopesLive = scopes; // update once
            
            
            
            if (forceUpdate) {
                this.notifyUpdated('scopesChanged');
            } // if
        }
        else { // scopes is Observable<MaybeFactory<CssScopeList<TCssScopeName>|null>|boolean>
            this._scopesSubscription = scopes.subscribe((newScopesOrEnabled) => {
                const isEnabledChanged = typeof(newScopesOrEnabled) === 'boolean';
                if (isEnabledChanged) { // newScopesOrEnabled is boolean
                    // update prop `enabled`:
                    
                    if (this._options.enabled === newScopesOrEnabled) return; // no change => no need to update
                    
                    this._options.enabled = newScopesOrEnabled; // update
                }
                else { // newScopesOrEnabled is MaybeFactory<CssScopeList<TCssScopeName>|null>
                    // update prop `scopes`:
                    
                    if ((this._scopesLive === null) && (newScopesOrEnabled === null)) return; // still null => no change => no need to update
                    // CssScopeList is always treated as unique object even though it's equal by ref, no deep comparison for performance reason
                    
                    this._scopesLive = newScopesOrEnabled; // live update
                } // if
                
                
                
                // notify a StyleSheet updated ONLY on SUBSEQUENT update:
                if (forceUpdate || subsequentUpdate) {
                    this.notifyUpdated(isEnabledChanged ? 'enabledChanged' : 'scopesChanged');
                } // if
            });
            subsequentUpdate = true; // any updates AFTER calling `scopes.subscribe` is considered as SUBSEQUENT update
        } // if
    }
    
    protected notifyUpdated(type: StyleSheetUpdateChangedType): void {
        this._updatedCallback(this, type); // notify a StyleSheet updated
    }
    //#endregion protected methods
    
    
    
    //#region public properties
    get enabled() {
        return this._options.enabled;
    }
    
    get id() {
        return this._options.id;
    }
    
    get ssr() {
        return this._options.ssr;
    }
    
    get lazyCsr() {
        return this._options.lazyCsr;
    }
    
    get prerender() {
        return this._options.prerender;
    }
    
    get scopes() {
        this.activateScopesIfNeeded();
        return this._scopesLive;
    }
    
    get classes() {
        return this._classes;
    }
    //#endregion public properties
    
    
    
    //#region public methods
    cloneFrom(source: StyleSheet<TCssScopeName>): boolean {
        if (this._scopesFactory !== source._scopesFactory) {
            this._scopesFactory = source._scopesFactory; // mutate
            
            this._scopesActivated = false; // reset the activation flag
            this.activateScopesIfNeeded();
        } // if
        
        
        
        return true; // report as success
    }
    //#endregion public methods
}



export type      StyleSheetUpdateChangedType = 'enabledChanged'|'scopesChanged'
export type      StyleSheetUpdateType        = 'added'|'existing'|StyleSheetUpdateChangedType
export interface StyleSheetUpdateEvent<out TCssScopeName extends CssScopeName> {
    styleSheet : StyleSheet<TCssScopeName>
    type       : StyleSheetUpdateType
}
class StyleSheetRegistry {
    //#region private properties
    private _styleSheets : StyleSheet<CssScopeName>[]
    private _subscribers : Subject<StyleSheetUpdateEvent<CssScopeName>>
    //#endregion private properties
    
    
    
    //#region constructors
    constructor() {
        this._styleSheets = [];
        this._subscribers = new Subject<StyleSheetUpdateEvent<CssScopeName>>();
    }
    //#endregion constructors
    
    
    
    //#region public methods
    add(newStyleSheet: StyleSheet<CssScopeName>): StyleSheet<CssScopeName> {
        /*
            The `StyleSheetRegistry::add()` always be called every call of `styleSheet()`, `styleSheets()`, dynamicStyleSheet()`, and `dynamicStyleSheets()`.
            In practice, these 4 functions are always be called on *top-level-module*.
            So, when the (component) modules are RE_LOADED, the `StyleSheetRegistry::add()` WON'T be re-called.
            So, the MEMORY_LEAK is NEVER occured.
        */
        
        
        // mutate the existing styleSheet (with the same id) (if any) with the new styleSheet:
        const newStyleSheetId    = newStyleSheet.id;
        const existingStyleSheet = !!newStyleSheetId ? this._styleSheets.find(({id}) => !!id && (id === newStyleSheetId)) : undefined;
        if (!existingStyleSheet) {
            this._styleSheets.push(newStyleSheet);             // register to collection (add new)
        }
        else {
            if (existingStyleSheet.cloneFrom(newStyleSheet)) { // register to collection (mutate)
                return existingStyleSheet; // cloned => done
            }
            else {
                // refuse to clone => fallback to add new:
                this._styleSheets.push(newStyleSheet);         // register to collection (add new)
            } // if
        } // if
        
        
        
        this._subscribers.next({                               // notify a StyleSheet added
            styleSheet : newStyleSheet,
            type       : 'added',
        });
        
        
        
        return newStyleSheet;
    }
    
    subscribe(subscriber: (event: StyleSheetUpdateEvent<CssScopeName>) => void) {
        //#region notify previously registered StyleSheet(s)
        const styleSheets = this._styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            subscriber({                                       // notify previously registered StyleSheet(s)
                styleSheet : styleSheets[i],
                type       : 'existing',
            });
        } // for
        //#endregion notify previously registered StyleSheet(s)
        
        return this._subscribers.subscribe(subscriber);        // listen for future updates
    }
    //#endregion public methods
    
    
    
    //#region public callbacks
    handleStyleSheetUpdated = (styleSheet: StyleSheet<CssScopeName>, type: StyleSheetUpdateChangedType): void => {
        this._subscribers.next({                               // notify a StyleSheet updated
            styleSheet : styleSheet,
            type       : type,
        });
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
        return [['main', styles, options]]; // scope('main', styles, options)
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
                    [['main', newStylesOrEnabled, options]] // scope('main', styles, options)
                );
            } // if
        });
        return dynamicStyleSheet; // as Observable<MaybeFactory<CssScopeList<'main'>|null>|boolean>
    } // if
}
