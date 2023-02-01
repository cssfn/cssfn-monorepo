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
    
    
    
    // hocs:
    memo,
}                           from 'react'
import {
    // react dom:
    default as ReactDOM,
}                           from 'react-dom'

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
    // style sheets:
    StyleSheetOptions,
    StyleSheet,
    styleSheetRegistry,
    styleSheets,
    
    
    
    // processors:
    renderStyleSheet,
    renderStyleSheetAsync,
    
    
    
    // utilities:
    isObservableScopes,
    isObservableStyles,
}                           from '@cssfn/cssfn'

// other libs:
import {
    Observable,
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
}
export const Styles = ({ asyncRender = false }: StylesProps): JSX.Element|null => {
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
            (styleSheet.enabled || null) // if the styleSheet is disabled => no need to render
            &&
            (
                asyncRender
                ?
                await renderStyleSheetAsync(styleSheet)
                :
                renderStyleSheet(styleSheet)
            )
        );
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



// hooks:
export interface DynamicStyleSheetOptions extends StyleSheetOptions {
    disableDelay ?: number
}
class StyleSheetsHookBuilder<TCssScopeName extends CssScopeName> {
    //#region private properties
    readonly    #options                   : DynamicStyleSheetOptions
    /*mutable*/ #cancelDisable             : ReturnType<typeof setTimeout>|undefined
    
    readonly    #dynamicStyleSheet         : Subject<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean>
    readonly    #scopeMap                  : CssScopeMap<TCssScopeName>
    /*mutable*/ #registeredUsingStyleSheet : number
    //#endregion private properties
    
    
    
    //#region constructors
    constructor(scopes: ProductOrFactory<CssScopeList<TCssScopeName>|null> | Observable<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean>, options?: DynamicStyleSheetOptions) {
        //#region setup dynamic styleSheet
        this.#options = {
            ...options,
            enabled      : options?.enabled      ?? false, // the default is initially disabled, will be re-enabled/re-disabled at runtime
            disableDelay : options?.disableDelay ?? 1000,
        };
        this.#dynamicStyleSheet = new Subject<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean>();
        this.#scopeMap = styleSheets(
            this.#dynamicStyleSheet,
            this.#options
        );
        if (isObservableScopes(scopes)) {
            scopes.subscribe((newScopesOrEnabled) => {
                this.#dynamicStyleSheet.next(newScopesOrEnabled); // forwards dynamically
            });
        }
        else {
            this.#dynamicStyleSheet.next(
                scopes // forward once
            );
        } // if
        //#endregion setup dynamic styleSheet
        
        
        
        // reset the user counter:
        this.#registeredUsingStyleSheet = 0; // initially no user using this styleSheet
    }
    //#endregion constructors
    
    
    
    //#region private methods
    #cancelDelayedDisableStyleSheet() {
        // conditions:
        if (!this.#cancelDisable) return; // nothing to cancel => ignore
        
        
        
        // actions:
        clearTimeout(this.#cancelDisable);
        this.#cancelDisable = undefined;
    }
    
    #registerUsingStyleSheet() {
        this.#registeredUsingStyleSheet++;
        
        if (this.#registeredUsingStyleSheet === 1) { // first user
            // cancel previously delayed disable styleSheet (if any):
            this.#cancelDelayedDisableStyleSheet();
            
            
            
            this.#dynamicStyleSheet.next(true); // first user => enable styleSheet
        } // if
    }
    #unregisterUsingStyleSheet() {
        this.#registeredUsingStyleSheet--;
        
        if (this.#registeredUsingStyleSheet === 0) { // no user
            // cancel previously delayed disable styleSheet (if any):
            this.#cancelDelayedDisableStyleSheet();
            
            
            
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
    //#endregion private methods
    
    
    
    //#region public methods
    createStyleSheetsHook(): CssScopeMap<TCssScopeName> {
        // dom effects:
        const isStyleSheetInUse = useRef(false);
        useInsertionEffect(() => {
            // cleanups:
            return () => {
                if (isStyleSheetInUse.current) {
                    isStyleSheetInUse.current = false; // mark the styleSheet as not_in_use
                    this.#unregisterUsingStyleSheet();
                } // if
            }
        }, []); // runs once on startup
        
        
        
        // dynamically enabled:
        return new Proxy<CssScopeMap<TCssScopeName>>(this.#scopeMap, {
            get: (scopeMap: CssScopeMap<TCssScopeName>, scopeName: CssScopeName): CssClassName|undefined => {
                const className = scopeMap[scopeName as keyof CssScopeMap<TCssScopeName>];
                if (className === undefined) return undefined; // not found => return undefined
                
                
                
                if (!isStyleSheetInUse.current) {
                    isStyleSheetInUse.current = true; // mark the styleSheet as in_use
                    this.#registerUsingStyleSheet();
                } // if
                
                
                
                return className;
            },
        });
    }
    //#endregion public methods
}
export const dynamicStyleSheets = <TCssScopeName extends CssScopeName>(scopes: ProductOrFactory<CssScopeList<TCssScopeName>|null> | Observable<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean>, options?: DynamicStyleSheetOptions): () => CssScopeMap<TCssScopeName> => {
    // a single builder for creating many hooks:
    const builder = new StyleSheetsHookBuilder(scopes, options);
    
    // the hook:
    return () => ( // wrap with arrow func so the `this` in `createStyleSheetsHook` preserved
        builder
        .createStyleSheetsHook()
    );
};
export { dynamicStyleSheets as createUseStyleSheets }
export const dynamicStyleSheet  = (styles: CssStyleCollection | Observable<CssStyleCollection|boolean>, options?: DynamicStyleSheetOptions & CssScopeOptions): () => CssScopeMap<'main'> => {
    if (!styles || (styles === true)) {
        return dynamicStyleSheets<'main'>(
            null,   // empty scope
            options // styleSheet options
        );
    }
    else if (isObservableStyles(styles)) {
        const dynamicStyleSheet = new Subject<CssScopeList<'main'>|null|boolean>();
        const scopeMapHook = dynamicStyleSheets(
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
                    null                                    // empty scope
                    :
                    [['main', newStylesOrEnabled, options]] // scopeOf('main', styles, options)
                );
            } // if
        });
        return scopeMapHook;
    }
    else {
        return dynamicStyleSheets(
            [['main', styles, options]], // scopeOf('main', styles, options)
            options                      // styleSheet options
        );
    } // if
};
export { dynamicStyleSheet as createUseStyleSheet }
