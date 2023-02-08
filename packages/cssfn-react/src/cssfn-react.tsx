// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useReducer,
    useRef,
    useMemo,
    useInsertionEffect,
    useInsertionEffect as _useInsertionEffect,
    
    
    
    // hocs:
    memo,
}                           from 'react'
import {
    // react dom:
    default as ReactDOM,
}                           from 'react-dom'

// cssfn:
import type {
    // factories:
    MaybeFactory,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssClassName,
    
    CssScopeName,
    CssScopeOptions,
    CssScopeList,
    CssScopeMap,
}                           from '@cssfn/css-types'
import {
    // types:
    StyleSheetsFactoryBase,
    StyleSheetsFactory,
    StyleSheetFactory,
    
    
    
    // style sheets:
    StyleSheetOptions,
    StyleSheetUpdatedCallback,
    StyleSheet,
    styleSheetRegistry,
    singularStyleSheet,
    
    
    
    // processors:
    renderStyleSheet,
    renderStyleSheetAsync,
    
    
    
    // utilities:
    isObservableScopes,
}                           from '@cssfn/cssfn'

// other libs:
import {
    Subject,
}                           from 'rxjs'



// hooks:
const triggerRenderReducer = (_currentGeneration: object, _newGeneration: void): object => {
    return {}; // update with a new object
};
const useTriggerRender = () => {
    const [generation, setState] = useReducer(triggerRenderReducer, {});
    return [setState, generation] as const;
};



// react components:
interface StyleContent {
    renderedCss : string|null
}
interface StyleProps {
    content  : StyleContent
    id      ?: string
}
const Style : ((props: StyleProps) => JSX.Element|null) = memo(({ content, id }: StyleProps): JSX.Element|null => {
    // because the `renderedCss` may be a_huge_string, we need to *unreference* it:
    const localRenderedCss = content.renderedCss; // copy         the `renderedCss` to local variable
    content.renderedCss    = null;                // de-reference the `renderedCss` from `props`
    
    // jsx:
    if (!localRenderedCss) return null;
    return (
        <style data-cssfn-id={id || ''} dangerouslySetInnerHTML={{ __html: localRenderedCss }} />
    );
});

export interface StylesProps {
    asyncRender ?: boolean
    onlySsr     ?: boolean
}
export const Styles = ({ asyncRender = false, onlySsr = true }: StylesProps): JSX.Element|null => {
    // states:
    //#region local storages without causing to (re)render
    /**
     * `null`  : never loaded  
     * `true`  : loaded (live)  
     * `false` : unloaded (dead)  
     */
    const loaded                      = useRef<boolean|null>(null);
    const [styles                   ] = useState<Map<StyleSheet, React.ReactElement<StyleProps, typeof Style>|null>>(() => new Map());
    //#endregion local storages without causing to (re)render
    
    // manually controls the (re)render event:
    const [triggerRender, generation] = useTriggerRender();
    
    
    
    // dom effects:
    const [unsubscribe] = useState(() => styleSheetRegistry.subscribe(async (styleSheet: StyleSheet): Promise<void> => {
        const renderedCss = (
            styleSheet.enabled           // if the styleSheet is disabled         => no need to render
            &&
            (!onlySsr || styleSheet.ssr) // if onlySsr -and- SSR_mode is disabled => no need to render
            &&
            (
                asyncRender
                ?
                await renderStyleSheetAsync(styleSheet)
                :
                renderStyleSheet(styleSheet)
            )
        ) || null; // if false|empty_string => null
        if (!renderedCss) {
            // remove the <Style>:
            // styles.delete(styleSheet); // do not delete an item in collection
            styles.set(styleSheet, null); // instead assign to `null` to mark as deleted, so we can un-delete it later in the same prev order
        }
        else {
            // add/update the <Style>:
            styles.set(styleSheet,
                /**
                 * <Style> is a pure static component and will never re-render by itself.
                 * To update <Style>, we need to re-create a new <Style>.
                 */
                <Style
                    id={styleSheet.id}
                    
                    content={
                        { renderedCss } as StyleContent
                    }
                />
            );
        } // if
        
        
        
        if (loaded.current) { // prevents double render of <Styles> component at startup by *async* of `Promise.resolve().then`
            /**
             * prevents re-rendering the <Style> while another <Component> is currently rendering
             * => the solution is async execution => executes after the another <Component> has finished rendering
             */
            Promise.resolve().then(() => {
                if (!loaded.current) return; // prevents executing a dead <Styles> component
                
                triggerRender(); // data changed => (re)schedule to (re)render the <Styles>
            });
        } // if
    }));
    
    useInsertionEffect(() => {
        // cleanups:
        return () => {
            // mark <Styles> component as dead:
            loaded.current = false;
            
            // unsubscribe to styleSheetRegistry:
            unsubscribe?.unsubscribe();
        };
    }, []); // runs once on startup
    
    
    
    // jsx:
    return useMemo((): JSX.Element|null => {
        // mark <Styles> component as live:
        loaded.current = true;
        
        
        
        return (
            <>
                {
                    Array.from(styles.values())
                    .map((style, index) =>
                        !!style
                        ?
                        React.cloneElement(style, { key: index })
                        :
                        style
                    )
                }
            </>
        );
    }, [generation]); // re-create the `JSX.Element` if `generation` changed
};

export const HeadPortal = ({ children }: React.PropsWithChildren<{}>): JSX.Element|null => {
    // jsx:
    const headElm = (typeof(window) !== 'undefined') ? window?.document?.head : undefined;
    if (!headElm) return null;
    return ReactDOM.createPortal(
        children,
        headElm
    );
};



// style sheets:

export interface DynamicStyleSheetOptions extends StyleSheetOptions {
    disableDelay ?: number
}

export class DynamicStyleSheet<TCssScopeName extends CssScopeName = CssScopeName> extends StyleSheet<TCssScopeName> {
    //#region private properties
    // configs:
    readonly    #options                   : DynamicStyleSheetOptions
    
    
    
    // states:
    readonly    #scopesFactory             : StyleSheetsFactory<TCssScopeName>
    /*mutable*/ #scopesActivated           : boolean
    
    /*mutable*/ #cancelDisable             : ReturnType<typeof setTimeout>|undefined
    /*mutable*/ #registeredUsingStyleSheet : number
    
    
    
    // css classes:
    readonly    #dynamicStyleSheet         : Subject<MaybeFactory<CssScopeList<TCssScopeName>|null>|boolean>
    //#endregion private properties
    
    
    
    //#region constructors
    constructor(scopesFactory: StyleSheetsFactory<TCssScopeName>, updatedCallback: StyleSheetUpdatedCallback<TCssScopeName>, options?: DynamicStyleSheetOptions) {
        // configs:
        const styleSheetOptions : DynamicStyleSheetOptions = {
            ...options,
            
            enabled      : options?.enabled      ?? false, // the default is initially disabled, will be re-enabled/re-disabled at runtime
            disableDelay : options?.disableDelay ?? 1000,
        };
        
        
        
        // init base:
        const dynamicStyleSheet         = new Subject<MaybeFactory<CssScopeList<TCssScopeName>|null>|boolean>();
        super(dynamicStyleSheet, updatedCallback, styleSheetOptions);
        this.#options                   = styleSheetOptions;
        
        
        
        // states:
        this.#scopesFactory             = scopesFactory;
        this.#scopesActivated           = false;
        
        this.#cancelDisable             = undefined;
        this.#registeredUsingStyleSheet = 0; // initially no user using this styleSheet
        
        
        
        // css classes:
        this.#dynamicStyleSheet         = dynamicStyleSheet;
        
        
        
        // activate the scope immediately if the given `scopesFactory` is an `Observable` object,
        // so we can `subscribe()` -- aka `log()` for update requests as soon as possible
        if ((typeof(scopesFactory) !== 'function') && isObservableScopes(scopesFactory)) this.activateDynamicScopesIfNeeded();
    }
    //#endregion constructors
    
    
    
    //#region protected methods
    protected activateDynamicScopesIfNeeded(): void {
        // conditions:
        if (this.#scopesActivated) return; // stop execution if already activated
        
        
        
        // activation:
        // activate (call the callback function -- if the given scopeFactory is a function):
        const scopesValue = (typeof(this.#scopesFactory) !== 'function') ? this.#scopesFactory : this.#scopesFactory();
        
        
        
        // update scope:
        if (!(scopesValue instanceof Promise)) {
            /*
                make sure this function is only executed ONCE -or- NEVER,
                don't twice, three times, so on.
                Except: an error occured during activation. Eg: a network error during dynamic import().
            */
            this.#scopesActivated = true;
            
            
            
            this.forwardScopes(scopesValue);
        }
        else {
            scopesValue.then((resolvedScopes) => {
                /*
                    make sure this function is only executed ONCE -or- NEVER,
                    don't twice, three times, so on.
                    Except: an error occured during activation. Eg: a network error during dynamic import().
                */
                this.#scopesActivated = true;
                
                
                
                this.forwardScopes(resolvedScopes.default);
            });
        } // if
    }
    protected forwardScopes(scopes: StyleSheetsFactoryBase<TCssScopeName>): void {
        if (!isObservableScopes(scopes)) { // scopes is MaybeFactory<CssScopeList<TCssScopeName>|null>
            this.#dynamicStyleSheet.next(
                scopes // forward once
            );
        } // if
        else { // scopes is Observable<MaybeFactory<CssScopeList<TCssScopeName>|null>|boolean>
            scopes.subscribe((newScopesOrEnabled) => {
                this.#dynamicStyleSheet.next(newScopesOrEnabled); // live forward
            });
        }
    }
    
    
    
    protected cancelDelayedDisableStyleSheet() {
        // conditions:
        if (!this.#cancelDisable) return; // nothing to cancel => ignore
        
        
        
        // actions:
        clearTimeout(this.#cancelDisable);
        this.#cancelDisable = undefined;
    }
    
    protected registerUsingStyleSheet() {
        this.#registeredUsingStyleSheet++;
        
        if (this.#registeredUsingStyleSheet === 1) { // first user
            // cancel previously delayed disable styleSheet (if any):
            this.cancelDelayedDisableStyleSheet();
            
            
            
            this.#dynamicStyleSheet.next(true); // first user => enable styleSheet
        } // if
    }
    protected unregisterUsingStyleSheet() {
        this.#registeredUsingStyleSheet--;
        
        if (this.#registeredUsingStyleSheet === 0) { // no user
            // cancel previously delayed disable styleSheet (if any):
            this.cancelDelayedDisableStyleSheet();
            
            
            
            const disableDelay = this.#options.disableDelay ?? 0;
            if (disableDelay <= 0) {
                // immediately disable styleSheet:
                this.#dynamicStyleSheet.next(false); // no user => disable styleSheet
            }
            else {
                // delayed disable styleSheet:
                this.#cancelDisable = setTimeout(() => {
                    this.#cancelDisable = undefined; // mark as was performed
                    
                    
                    
                    // perform disable styleSheet:
                    this.#dynamicStyleSheet.next(false); // no user => disable styleSheet
                }, disableDelay);
            } // if
        } // if
    }
    //#endregion protected methods
    
    
    
    //#region public properties
    get scopes() {
        this.activateDynamicScopesIfNeeded();
        return super.scopes;
    }
    //#endregion public properties
    
    
    
    //#region public methods
    createDynamicStyleSheetsHook(): CssScopeMap<TCssScopeName> {
        // states:
        const isDynamicStyleSheetsHookInUse = useRef(false);
        
        
        
        // dom effects:
        _useInsertionEffect(() => {
            // cleanups:
            return () => {
                if (isDynamicStyleSheetsHookInUse.current) {
                    isDynamicStyleSheetsHookInUse.current = false; // mark the styleSheet as not_in_use
                    this.unregisterUsingStyleSheet();
                } // if
            }
        }, []); // runs once on startup
        
        
        
        // dynamically enabled:
        return new Proxy<CssScopeMap<TCssScopeName>>(this.classes, {
            get: (classes: CssScopeMap<TCssScopeName>, scopeName: CssScopeName): CssClassName|undefined => {
                const className = classes[scopeName as keyof CssScopeMap<TCssScopeName>];
                if (className === undefined) return undefined; // not found => return undefined
                
                
                
                if (!isDynamicStyleSheetsHookInUse.current) {
                    isDynamicStyleSheetsHookInUse.current = true; // mark the styleSheet as in_use
                    this.registerUsingStyleSheet();
                } // if
                
                
                
                return className;
            },
        });
    }
    //#endregion public methods
}



// hooks:
export const dynamicStyleSheets = <TCssScopeName extends CssScopeName>(scopes: StyleSheetsFactory<TCssScopeName>, options?: DynamicStyleSheetOptions): () => CssScopeMap<TCssScopeName> => {
    // a single `DynamicStyleSheet` instance for creating many hooks:
    const dynamicStyleSheet = new DynamicStyleSheet<TCssScopeName>(
        scopes,
        styleSheetRegistry.handleStyleSheetUpdated, // listen for future updates
        options
    );
    styleSheetRegistry.add(dynamicStyleSheet);
    
    
    
    // the hook:
    return () => ( // wrap with arrow func so the `this` in `createDynamicStyleSheetsHook` preserved
        dynamicStyleSheet
        .createDynamicStyleSheetsHook()
    );
};
export const dynamicStyleSheet  = (styles: StyleSheetFactory, options?: DynamicStyleSheetOptions & CssScopeOptions): () => CssScopeMap<'main'> => {
    return singularStyleSheet(dynamicStyleSheets, styles, options);
};

/**
 * @deprecated renamed to `dynamicStyleSheets`
 */
export const createUseStyleSheets = dynamicStyleSheets;
/**
 * @deprecated renamed to `dynamicStyleSheet`
 */
export const createUseStyleSheet  = dynamicStyleSheet;
