// react:
import {
    // react:
    default as React,
    
    
    
    // types:
    FC,
    ReactElement,
    
    
    
    // hooks:
    useState,
    useEffect,
    useReducer,
    useRef,
    useMemo,
    
    
    
    // hocs:
    memo,
}                           from 'react'

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
    StyleSheetOptions,
    StyleSheet,
    styleSheetRegistry,
    styleSheets,
    isObservableStyles,
}                           from '@cssfn/cssfn/dist/styleSheets.js'
import {
    render,
}                           from '@cssfn/cssfn/dist/renders.js'

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
    content : StyleContent
}
const Style : FC<StyleProps> = memo(({ content }: StyleProps) => {
    // because the `renderedCss` may be a_huge_string, we need to *unreference* it:
    const localRenderedCss = content.renderedCss; // copy         the `renderedCss` to local variable
    content.renderedCss    = null;                // de-reference the `renderedCss` from `props`
    
    // jsx:
    // console.log(`<Style> render!`);
    return (
        <style>
            { localRenderedCss }
        </style>
    );
});

export const Styles : FC = () => {
    // states:
    const loaded                      = useRef(false);
    const [styles                   ] = useState<Map<StyleSheet, ReactElement<StyleProps, typeof Style>|null>>(() => new Map());
    const [triggerRender, generation] = useTriggerRender();
    
    
    
    // dom effects:
    const [unsubscribe] = useState(() => styleSheetRegistry.subscribe((styleSheet: StyleSheet): void => {
        const renderedCss = (styleSheet.enabled || null) && render(styleSheet);
        if (!renderedCss) {
            // remove the <Style>:
            // console.log('');
            // console.log(`<Style> removed!`);
            // styles.delete(styleSheet); // do not delete an item in collection
            styles.set(styleSheet, null); // instead assign to `null` to mark as deleted, so we can un-delete it later in the same prev order
        }
        else {
            // add/update the <Style>:
            // console.log('');
            // console.log(`<Style> mutated!`);
            styles.set(styleSheet,
                /**
                 * <Style> is a pure static component and will never re-render by itself.
                 * To update <Style>, we need to re-create a new <Style>.
                 */
                <Style
                    content={
                        { renderedCss } as StyleContent
                    }
                />
            );
        } // if
        
        
        
        if (loaded.current) triggerRender(); // re-render the <Styles>
    }));
    useEffect(() => {
        // setups:
        loaded.current = true; // mark <Styles> component as loaded
        
        
        
        // cleanups:
        return () => {
            unsubscribe?.unsubscribe();
        };
    }, []); // runs once on startup
    
    
    
    // jsx:
    return useMemo<JSX.Element>(() => {
        // console.log('');
        // console.log(`<Styles> render!`);
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
}



// hooks:
class StyleSheetsHookBuilder<TCssScopeName extends CssScopeName> {
    readonly #isStaticEnabled   : boolean
    readonly #dynamicStyleSheet : Subject<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean>
    readonly #scopeMap          : CssScopeMap<TCssScopeName>
    #registeredUsesStyleSheet   : number
    
    
    constructor(scopes: ProductOrFactory<CssScopeList<TCssScopeName>|null> | Observable<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean>, options?: StyleSheetOptions) {
        this.#isStaticEnabled   = typeof(options?.enabled) === 'boolean';
        
        
        
        //#region setup dynamic styleSheet
        this.#dynamicStyleSheet = new Subject<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean>();
        this.#scopeMap = styleSheets(
            this.#dynamicStyleSheet,
            (
                this.#isStaticEnabled
                ?
                options
                :
                {
                    ...options,
                    enabled: false, // initially disabled, will be enabled at runtime
                }
            )
        );
        if (scopes && (typeof(scopes) === 'object') && !Array.isArray(scopes)) {
            scopes.subscribe((newScopesOrEnabled) => {
                this.#dynamicStyleSheet.next(newScopesOrEnabled); // forwards
            });
        }
        else {
            this.#dynamicStyleSheet.next(
                scopes // forward once
            );
        } // if
        //#endregion setup dynamic styleSheet
        
        
        
        this.#registeredUsesStyleSheet = 0;
        //#endregion hook implementation
    }
    
    
    
    #registerUsingStyleSheet() {
        this.#registeredUsesStyleSheet++;
        
        if (this.#registeredUsesStyleSheet === 1) {
            this.#dynamicStyleSheet.next(true); // first user => enable styleSheet
        } // if
    }
    #unregisterUsingStyleSheet() {
        this.#registeredUsesStyleSheet--;
        
        if (this.#registeredUsesStyleSheet === 1) {
            this.#dynamicStyleSheet.next(false); // no user => disable styleSheet
        } // if
    }
    
    
    
    createStyleSheetsHook(): CssScopeMap<TCssScopeName> {
        // dom effects:
        const isStyleSheetInUse = useRef(false);
        useEffect(() => {
            // cleanups:
            return () => {
                if (isStyleSheetInUse.current) {
                    this.#unregisterUsingStyleSheet();
                } // if
            }
        }, []); // runs once on startup
        
        
        
        if (this.#isStaticEnabled) { // static enabled
            return this.#scopeMap;
        }
        else { // dynamic enabled
            return new Proxy<CssScopeMap<TCssScopeName>>(this.#scopeMap, {
                get: (scopeMap: CssScopeMap<TCssScopeName>, scopeName: CssScopeName): CssClassName|undefined => {
                    if (!(scopeName in scopeMap)) return undefined; // not found => return undefined
                    
                    if (!isStyleSheetInUse.current) {
                        isStyleSheetInUse.current = true; // mark the styleSheet as in use
                        this.#registerUsingStyleSheet();
                    } // if
                    
                    return scopeMap[scopeName as keyof CssScopeMap<TCssScopeName>];
                },
            });
        } // if
    }
}
export const createUseStyleSheets = <TCssScopeName extends CssScopeName>(scopes: ProductOrFactory<CssScopeList<TCssScopeName>|null> | Observable<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean>, options?: StyleSheetOptions): () => CssScopeMap<TCssScopeName> => {
    return (
        (new StyleSheetsHookBuilder(scopes, options))
        .createStyleSheetsHook
    );
}
export const createUseStyleSheet = (styles: CssStyleCollection | Observable<CssStyleCollection|boolean>, options?: StyleSheetOptions & CssScopeOptions): () => CssScopeMap<'main'> => {
    if (!styles || (styles === true)) {
        return createUseStyleSheets<'main'>(
            null,   // empty scope
            options // styleSheet options
        );
    }
    else if (isObservableStyles(styles)) {
        const dynamicStyleSheet = new Subject<CssScopeList<'main'>|null|boolean>();
        const scopeMapHook = createUseStyleSheets(
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
        return scopeMapHook;
    }
    else {
        return createUseStyleSheets(
            [['main', styles, options]], // scopeOf('main', styles, options)
            options                      // styleSheet options
        );
    } // if
}
