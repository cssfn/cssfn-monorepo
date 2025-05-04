// React:
import {
    // Hooks:
    useRef,
    useEffect as _useEffect,
}                           from 'react'

// Cssfn:
import {
    // Factories:
    type MaybeFactory,
}                           from '@cssfn/types'
import {
    // Cssfn properties:
    type CssClassName,
    
    type CssScopeName,
    type CssScopeOptions,
    type CssScopeList,
    type CssScopeMap,
}                           from '@cssfn/css-types'
import {
    // Types:
    type StyleSheetsFactoryBase,
    type StyleSheetsFactory,
    type StyleSheetFactory,
    
    
    
    // Style sheets:
    type StyleSheetOptions,
    type StyleSheetUpdatedCallback,
    StyleSheet,
    styleSheetRegistry,
    singularStyleSheet,
    
    
    
    // Utilities:
    isObservableScopes,
}                           from '@cssfn/cssfn'

// Other libs:
import {
    type Subscription,
    Subject,
}                           from 'rxjs'

// Defaults:
import {
    // Defaults:
    defaultDisableDelay,
}                           from './defaults.js'

// Utilities:
import {
    // Tests:
    isClientSide,
}                           from './utilities.js'



// Style sheets:

export interface DynamicStyleSheetOptions extends StyleSheetOptions {
    disableDelay ?: number
}

export class DynamicStyleSheet<TCssScopeName extends CssScopeName = CssScopeName> extends StyleSheet<TCssScopeName> {
    //#region Private properties
    // Configs:
    private readonly    _options2                  : DynamicStyleSheetOptions
    
    
    
    // States:
    private /*mutable*/ _scopesFactory2            : StyleSheetsFactory<TCssScopeName>
    private /*mutable*/ _scopesActivated2          : boolean
    private /*mutable*/ _scopesSubscription2       : Subscription|undefined
    
    private /*mutable*/ _cancelDisable             : ReturnType<typeof setTimeout>|undefined
    private /*mutable*/ _registeredUsingStyleSheet : number
    
    
    
    // CSS classes:
    private readonly    _dynamicStyleSheet         : Subject<MaybeFactory<CssScopeList<TCssScopeName>|null>|boolean>
    //#endregion Private properties
    
    
    
    //#region Constructors
    constructor(scopesFactory: StyleSheetsFactory<TCssScopeName>, updatedCallback: StyleSheetUpdatedCallback<TCssScopeName>, options?: DynamicStyleSheetOptions) {
        // Configs:
        const styleSheetOptions : DynamicStyleSheetOptions = {
            ...options,
            
            enabled      : options?.enabled      ?? false, // The default is initially disabled, will be re-enabled/re-disabled at runtime.
            disableDelay : options?.disableDelay ?? defaultDisableDelay,
        };
        
        
        
        // Init base:
        const dynamicStyleSheet         = new Subject<MaybeFactory<CssScopeList<TCssScopeName>|null>|boolean>();
        super(dynamicStyleSheet, updatedCallback, styleSheetOptions);
        this._options2                  = styleSheetOptions;
        
        
        
        // States:
        this._scopesFactory2            = scopesFactory;
        this._scopesActivated2          = false;
        this._scopesSubscription2       = undefined;
        
        this._cancelDisable             = undefined;
        this._registeredUsingStyleSheet = 0; // Initially no user using this styleSheet.
        
        
        
        // CSS classes:
        this._dynamicStyleSheet         = dynamicStyleSheet;
        
        
        
        // Activate the scope immediately if the given `scopesFactory` is an `Observable` object,
        // so we can `subscribe()` -- aka `log()` for update requests as soon as possible.
        if (
            // Server side:
            // Always activate the scopeFactory as soon as possible.
            // Usually activated during module load -- when a styleSheet(s) is registered,
            // before the SSR render gets a chance to run.
            !isClientSide
            ||
            // client side:
            // only activate the scopeFactory if the CSR is needed to be rendered
            ((typeof(scopesFactory) !== 'function') && isObservableScopes(scopesFactory))
        ) {
            this.activateDynamicScopesIfNeeded();
        } // if
    }
    //#endregion Constructors
    
    
    
    //#region Protected methods
    protected activateDynamicScopesIfNeeded(): void {
        // Conditions:
        if (this._scopesActivated2) return; // Stop execution if already activated.
        
        
        
        // Activation:
        // Activate (call the callback function -- if the given scopesFactory is a function):
        const scopesValue = (typeof(this._scopesFactory2) !== 'function') ? this._scopesFactory2 : this._scopesFactory2();
        
        
        
        // Update scope:
        if (!(scopesValue instanceof Promise)) { // ScopesValue is CssScopeList<TCssScopeName> | null | Observable<MaybeFactory<CssScopeList<TCssScopeName>|null> | boolean>.
            /*
                Make sure this function is only executed ONCE -or- NEVER.
                Don't twice, three times, so on.
                Except: an error occured during activation. Eg: a network error during dynamic import().
            */
            this._scopesActivated2 = true;
            
            
            
            this.forwardScopes(scopesValue);
        }
        else { // ScopesValue is Promise<ModuleDefault<MaybeFactory<CssScopeList<TCssScopeName> | null>>>.
            scopesValue.then((resolvedScopes) => {
                /*
                    Make sure this function is only executed ONCE -or- NEVER.
                    Don't twice, three times, so on.
                    Except: an error occured during activation. Eg: a network error during dynamic import().
                */
                this._scopesActivated2 = true;
                
                
                
                this.forwardScopes(resolvedScopes.default);
            });
        } // if
    }
    protected forwardScopes(scopes: StyleSheetsFactoryBase<TCssScopeName>): void {
        // Cleanups:
        this._scopesSubscription2?.unsubscribe(); // Unsubscribe the prev subscription (if any).
        this._scopesSubscription2 = undefined;    // Allows GC to collect.
        
        
        
        if (!isObservableScopes(scopes)) { // Scopes is MaybeFactory<CssScopeList<TCssScopeName>|null>.
            this._dynamicStyleSheet.next(
                scopes // Forward once
            );
        } // if
        else { // Scopes is Observable<MaybeFactory<CssScopeList<TCssScopeName>|null>|boolean>.
            this._scopesSubscription2 = scopes.subscribe((newScopesOrEnabled) => {
                this._dynamicStyleSheet.next(
                    newScopesOrEnabled // live forward
                );
            });
        }
    }
    
    
    
    protected cancelDelayedDisableStyleSheet() {
        // Conditions:
        if (!this._cancelDisable) return; // Nothing to cancel => ignore.
        
        
        
        // Actions:
        clearTimeout(this._cancelDisable);
        this._cancelDisable = undefined;
    }
    
    protected registerUsingStyleSheet() {
        this._registeredUsingStyleSheet++; // Increase the counter.
        
        if (this._registeredUsingStyleSheet === 1) { // At the moment of the first user => enabling the styleSheet.
            // Cancel previously delayed disable styleSheet (if any):
            this.cancelDelayedDisableStyleSheet();
            
            
            
            this._dynamicStyleSheet.next(true); // The first user => enable styleSheet.
        } // if
    }
    protected unregisterUsingStyleSheet() {
        this._registeredUsingStyleSheet--; // Decrease the counter.
        
        if (this._registeredUsingStyleSheet === 0) { // At the moment of no user => disabling the styleSheet.
            // Cancel previously delayed disable styleSheet (if any):
            this.cancelDelayedDisableStyleSheet();
            
            
            
            const disableDelay = this._options2.disableDelay ?? 0;
            if (disableDelay <= 0) {
                // Immediately disable styleSheet:
                this._dynamicStyleSheet.next(false); // No user => disable styleSheet.
            }
            else {
                // delayed disable styleSheet:
                this._cancelDisable = setTimeout(() => {
                    this._cancelDisable = undefined; // Mark as was performed.
                    
                    
                    
                    // Perform disable styleSheet:
                    this._dynamicStyleSheet.next(false); // No user => disable styleSheet.
                }, disableDelay);
            } // if
        } // if
    }
    //#endregion Protected methods
    
    
    
    //#region Public properties
    get scopes() {
        this.activateDynamicScopesIfNeeded();
        return super.scopes;
    }
    //#endregion Public properties
    
    
    
    //#region Public methods
    cloneFrom(source: StyleSheet<TCssScopeName>): boolean {
        // Conditions:
        if (!(source instanceof DynamicStyleSheet)) return super.cloneFrom(source);
        
        
        
        if (this._scopesFactory2 !== source._scopesFactory2) {
            this._scopesFactory2 = source._scopesFactory2; // Mutate.
            
            this._scopesActivated2 = false; // Reset the activation flag.
            this.activateDynamicScopesIfNeeded();
        } // if
        
        
        
        return true; // Report as success.
    }
    
    createDynamicStyleSheetsHook(): CssScopeMap<TCssScopeName> {
        // States:
        const isDynamicStyleSheetsHookInUse = useRef(false);
        
        
        
        // Dynamically disabled by unmounting the <Component/>:
        _useEffect(() => {
            // Cleanups:
            return () => {
                if (isDynamicStyleSheetsHookInUse.current) {
                    isDynamicStyleSheetsHookInUse.current = false; // Mark the styleSheet as not_in_use.
                    this.unregisterUsingStyleSheet();
                } // if
            };
        }, []);
        
        
        
        // Dynamically enabled by accessing the `classes.someClass`:
        return new Proxy<CssScopeMap<TCssScopeName>>(this.classes, {
            get: (classes: CssScopeMap<TCssScopeName>, scopeName: CssScopeName): CssClassName|undefined => {
                const className = classes[scopeName as keyof CssScopeMap<TCssScopeName>];
                if (className === undefined) return undefined; // Not found => return undefined.
                
                
                
                if (!isDynamicStyleSheetsHookInUse.current) {
                    isDynamicStyleSheetsHookInUse.current = true; // Mark the styleSheet as in_use.
                    this.registerUsingStyleSheet();
                } // if
                
                
                
                return className;
            },
        });
    }
    //#endregion Public methods
}



// Hooks:
export const dynamicStyleSheets = <TCssScopeName extends CssScopeName>(scopes: StyleSheetsFactory<TCssScopeName>, options?: DynamicStyleSheetOptions): () => CssScopeMap<TCssScopeName> => {
    // A single `DynamicStyleSheet` instance for creating many hooks:
    const newDynamicStyleSheet = new DynamicStyleSheet<TCssScopeName>(
        scopes,
        styleSheetRegistry.handleStyleSheetUpdated, // Listen for future updates.
        options
    );
    const existingDynamicStyleSheet = styleSheetRegistry.add(newDynamicStyleSheet);
    
    
    
    // The hook:
    return () => ( // Wrap with arrow func so the `this` in `createDynamicStyleSheetsHook` preserved.
        ((existingDynamicStyleSheet instanceof DynamicStyleSheet) ? existingDynamicStyleSheet : newDynamicStyleSheet)
        .createDynamicStyleSheetsHook()
    );
};
export const dynamicStyleSheet  = (styles: StyleSheetFactory, options?: DynamicStyleSheetOptions & CssScopeOptions): () => CssScopeMap<'main'> => {
    return singularStyleSheet(dynamicStyleSheets, styles, options);
};
