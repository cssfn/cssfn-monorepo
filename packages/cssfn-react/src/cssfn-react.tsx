// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useReducer,
    useRef,
    useMemo,
    useEffect,
    useLayoutEffect,
    useInsertionEffect,
    useInsertionEffect as _useInsertionEffect,
    useId,
    
    
    
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
    StyleSheetUpdateEvent,
    styleSheetRegistry,
    singularStyleSheet,
    
    
    
    // processors:
    renderStyleSheet,
    unraceRenderStyleSheetAsync,
    
    
    
    // utilities:
    isObservableScopes,
}                           from '@cssfn/cssfn'

// other libs:
import {
    Subject,
}                           from 'rxjs'
import {
    // tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'



// defaults:
const _defaultDisableDelay = 0;



// utilities:
const isClientSide : boolean = isBrowser || isJsDom;



// hooks:
const triggerRenderReducer = (_currentGeneration: object, _newGeneration: void): object => {
    return {}; // update with a new object
};
const useTriggerRender = () => {
    const [generation, setState] = useReducer(triggerRenderReducer, {});
    return [setState, generation] as const;
};

/**
 * A React helper hook for using `useLayoutEffect` with a fallback to a regular `useEffect` for environments where `useLayoutEffect` should not be used (such as server-side rendering).
 */
export const useIsomorphicLayoutEffect = isClientSide ? useLayoutEffect : useEffect;



// react components:
interface StyleProps {
    // identifiers:
    id      ?: string
    
    
    
    // behaviors:
    enabled  : boolean
    
    
    
    // children:
    children : string|null
}
const Style : ((props: StyleProps) => JSX.Element|null) = memo(({ id, enabled, children: renderedCss }: StyleProps): JSX.Element|null => {
    // refs:
    const styleRef = useRef<HTMLStyleElement|null>(null);
    
    
    
    // dom effects:
    useIsomorphicLayoutEffect(() => { // runs before browser_paint occured
        // conditions:
        const styleElm = styleRef.current;
        if (!styleElm) return;
        
        
        
        // actions:
        styleElm.disabled = !enabled;
    }, [enabled]);
    
    useEffect(() => { // runs after hydration completed
        // conditions:
        const styleElm = styleRef.current;
        if (!styleElm) return;
        
        
        
        // actions:
        styleElm.removeAttribute('disabled'); /* non_standard [disabled] */
    }, []);
    
    
    
    const innerHtml = useMemo((): React.DOMAttributes<HTMLStyleElement>['dangerouslySetInnerHTML'] => {
        if (!renderedCss) return undefined;
        
        return {
            __html: renderedCss,
        };
    }, [renderedCss]);
    
    
    
    // jsx:
    if (!innerHtml) return null;
    return (
        <style
            // refs:
            ref={styleRef}
            
            
            
            // identifiers:
            data-cssfn-id={id || ''} // for identifier and cssfn's asset marker
            
            
            
            // behaviors:
            {...(enabled ? undefined : ({ disabled : true } as {}))} /* non_standard [disabled] */
            suppressHydrationWarning={true} // supports for <script> of removing [disabled] property
            
            
            
            // children:
            dangerouslySetInnerHTML={innerHtml}
        />
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
    const [unsubscribe] = useState(() => styleSheetRegistry.subscribe(async ({styleSheet, type}: StyleSheetUpdateEvent<CssScopeName>): Promise<void> => {
        const styleSheetEnabled  = styleSheet.enabled;
        const doUpdateStyleSheet = (type === 'enabledChanged');
        const doRenderStyleSheet = styleSheetEnabled || styleSheet.prerender; // if the styleSheet is enabled -or- disabled but marked to prerender => perform render
        
        
        
        try {
            // update the enabled/disabled:
            if (doUpdateStyleSheet) {
                // find the JSX generated <style> element (if any):
                const styleJsx = styles.get(styleSheet);
                if (styleJsx) { // found JSX generated <style> element => update the enabled/disabled
                    styles.set(styleSheet, React.cloneElement(styleJsx,
                        // props:
                        {
                            enabled: styleSheetEnabled,
                        }
                    ));
                    
                    
                    
                    return; // no need further SSR generated
                } // if
            } // if
            
            
            
            const renderedCss = (
                ((doRenderStyleSheet && (!onlySsr /* allMode */ || styleSheet.ssr /* ssr_mode_enabled */)) || undefined) // do render (if allMode || ssr_mode_enabled) -or- *canceled*
                &&
                (
                    asyncRender
                    ? await unraceRenderStyleSheetAsync(styleSheet)
                    : renderStyleSheet(styleSheet)
                )
            );
            if (renderedCss === undefined) return; // ignore *canceled*/*expired* render
            
            
            
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
                        
                        enabled={styleSheetEnabled}
                    >
                        {renderedCss}
                    </Style>
                );
            } // if
        }
        finally {
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
        } // try
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
    
    
    
    // identifiers:
    const scriptId = useId();
    
    
    
    // jsx:
    const stylesJsx = useMemo((): JSX.Element|null => {
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
    
    const scriptNormalizeDisabledStyle = useMemo((): React.DOMAttributes<HTMLStyleElement>['dangerouslySetInnerHTML'] => ({
        __html:
`
const scriptElm = document.getElementById('${scriptId}');
for (const child of (scriptElm?.parentElement?.children ?? [])) {
    if (child === scriptElm) break;
    if (!child.matches('style[data-cssfn-id][disabled]')) continue;
    child.removeAttribute('disabled');
    child.disabled = true;
}
`
    }), []);
    
    return (
        <>
            {stylesJsx}
            <script id={scriptId} dangerouslySetInnerHTML={scriptNormalizeDisabledStyle} />
        </>
    );
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
    private readonly    _options2                  : DynamicStyleSheetOptions
    
    
    
    // states:
    private readonly    _scopesFactory2            : StyleSheetsFactory<TCssScopeName>
    private /*mutable*/ _scopesActivated2          : boolean
    
    private /*mutable*/ _cancelDisable             : ReturnType<typeof setTimeout>|undefined
    private /*mutable*/ _registeredUsingStyleSheet : number
    
    
    
    // css classes:
    private readonly    _dynamicStyleSheet         : Subject<MaybeFactory<CssScopeList<TCssScopeName>|null>|boolean>
    //#endregion private properties
    
    
    
    //#region constructors
    constructor(scopesFactory: StyleSheetsFactory<TCssScopeName>, updatedCallback: StyleSheetUpdatedCallback<TCssScopeName>, options?: DynamicStyleSheetOptions) {
        // configs:
        const styleSheetOptions : DynamicStyleSheetOptions = {
            ...options,
            
            enabled      : options?.enabled      ?? false, // the default is initially disabled, will be re-enabled/re-disabled at runtime
            disableDelay : options?.disableDelay ?? _defaultDisableDelay,
        };
        
        
        
        // init base:
        const dynamicStyleSheet         = new Subject<MaybeFactory<CssScopeList<TCssScopeName>|null>|boolean>();
        super(dynamicStyleSheet, updatedCallback, styleSheetOptions);
        this._options2                  = styleSheetOptions;
        
        
        
        // states:
        this._scopesFactory2            = scopesFactory;
        this._scopesActivated2          = false;
        
        this._cancelDisable             = undefined;
        this._registeredUsingStyleSheet = 0; // initially no user using this styleSheet
        
        
        
        // css classes:
        this._dynamicStyleSheet         = dynamicStyleSheet;
        
        
        
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
            this.activateDynamicScopesIfNeeded();
        } // if
    }
    //#endregion constructors
    
    
    
    //#region protected methods
    protected activateDynamicScopesIfNeeded(): void {
        // conditions:
        if (this._scopesActivated2) return; // stop execution if already activated
        
        
        
        // activation:
        // activate (call the callback function -- if the given scopesFactory is a function):
        const scopesValue = (typeof(this._scopesFactory2) !== 'function') ? this._scopesFactory2 : this._scopesFactory2();
        
        
        
        // update scope:
        if (!(scopesValue instanceof Promise)) { // scopesValue is CssScopeList<TCssScopeName> | null | Observable<MaybeFactory<CssScopeList<TCssScopeName>|null> | boolean>
            /*
                make sure this function is only executed ONCE -or- NEVER,
                don't twice, three times, so on.
                Except: an error occured during activation. Eg: a network error during dynamic import().
            */
            this._scopesActivated2 = true;
            
            
            
            this.forwardScopes(scopesValue);
        }
        else { // scopesValue is Promise<ModuleDefault<MaybeFactory<CssScopeList<TCssScopeName> | null>>>
            scopesValue.then((resolvedScopes) => {
                /*
                    make sure this function is only executed ONCE -or- NEVER,
                    don't twice, three times, so on.
                    Except: an error occured during activation. Eg: a network error during dynamic import().
                */
                this._scopesActivated2 = true;
                
                
                
                this.forwardScopes(resolvedScopes.default);
            });
        } // if
    }
    protected forwardScopes(scopes: StyleSheetsFactoryBase<TCssScopeName>): void {
        if (!isObservableScopes(scopes)) { // scopes is MaybeFactory<CssScopeList<TCssScopeName>|null>
            this._dynamicStyleSheet.next(
                scopes // forward once
            );
        } // if
        else { // scopes is Observable<MaybeFactory<CssScopeList<TCssScopeName>|null>|boolean>
            scopes.subscribe((newScopesOrEnabled) => {
                this._dynamicStyleSheet.next(
                    newScopesOrEnabled // live forward
                );
            });
        }
    }
    
    
    
    protected cancelDelayedDisableStyleSheet() {
        // conditions:
        if (!this._cancelDisable) return; // nothing to cancel => ignore
        
        
        
        // actions:
        clearTimeout(this._cancelDisable);
        this._cancelDisable = undefined;
    }
    
    protected registerUsingStyleSheet() {
        this._registeredUsingStyleSheet++; // increase the counter
        
        if (this._registeredUsingStyleSheet === 1) { // at the moment of the first user => enabling the styleSheet
            // cancel previously delayed disable styleSheet (if any):
            this.cancelDelayedDisableStyleSheet();
            
            
            
            this._dynamicStyleSheet.next(true); // the first user => enable styleSheet
        } // if
    }
    protected unregisterUsingStyleSheet() {
        this._registeredUsingStyleSheet--; // decrease the counter
        
        if (this._registeredUsingStyleSheet === 0) { // at the moment of no user => disabling the styleSheet
            // cancel previously delayed disable styleSheet (if any):
            this.cancelDelayedDisableStyleSheet();
            
            
            
            const disableDelay = this._options2.disableDelay ?? 0;
            if (disableDelay <= 0) {
                // immediately disable styleSheet:
                this._dynamicStyleSheet.next(false); // no user => disable styleSheet
            }
            else {
                // delayed disable styleSheet:
                this._cancelDisable = setTimeout(() => {
                    this._cancelDisable = undefined; // mark as was performed
                    
                    
                    
                    // perform disable styleSheet:
                    this._dynamicStyleSheet.next(false); // no user => disable styleSheet
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
        
        
        
        // dynamically disabled by unmounting the <Component/>:
        _useInsertionEffect(() => {
            // cleanups:
            return () => {
                if (isDynamicStyleSheetsHookInUse.current) {
                    isDynamicStyleSheetsHookInUse.current = false; // mark the styleSheet as not_in_use
                    this.unregisterUsingStyleSheet();
                } // if
            };
        }, []); // runs once on startup
        
        
        
        // dynamically enabled by accessing the `classes.someClass`:
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
