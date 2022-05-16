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



// utilities:



// hooks:
export const createUseStyleSheets = <TCssScopeName extends CssScopeName>(scopes: ProductOrFactory<CssScopeList<TCssScopeName>|null> | Observable<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean>, options?: StyleSheetOptions): () => CssScopeMap<TCssScopeName> => {
    const isStaticEnabled = typeof(options?.enabled) === 'boolean';
    const dynamicStyleSheet = new Subject<ProductOrFactory<CssScopeList<TCssScopeName>|null>|boolean>();
    const scopeMap = styleSheets(
        scopes,
        (
            isStaticEnabled
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
            dynamicStyleSheet.next(newScopesOrEnabled); // forwards
        });
    }
    else {
        dynamicStyleSheet.next(
            scopes // forward once
        );
    } // if
    
    
    
    /**
     * Counts how many components are currently using this styleSheet.
     */
    let registeredUsingStyleSheet = 0;
    const registerUsingStyleSheet = () => {
        registeredUsingStyleSheet++;
        
        if (registeredUsingStyleSheet === 1) {
            dynamicStyleSheet.next(true); // first user => enable styleSheet
        } // if
    };
    const unregisterUsingStyleSheet = () => {
        registeredUsingStyleSheet--;
        
        if (registeredUsingStyleSheet === 1) {
            dynamicStyleSheet.next(false); // no user => disable styleSheet
        } // if
    };
    
    
    
    // hook implementation:
    return (): CssScopeMap<TCssScopeName> => {
        // dom effects:
        const isStyleSheetInUse = useRef(false);
        useEffect(() => {
            // cleanups:
            return () => {
                if (isStyleSheetInUse.current) {
                    unregisterUsingStyleSheet();
                } // if
            }
        }, []); // runs once on startup
        
        
        
        if (isStaticEnabled) { // static enabled
            return scopeMap;
        }
        else { // dynamic enabled
            return new Proxy<CssScopeMap<TCssScopeName>>(scopeMap, {
                get: (scopeMap: CssScopeMap<TCssScopeName>, scopeName: CssScopeName): CssClassName|undefined => {
                    if (!(scopeName in scopeMap)) return undefined; // not found => return undefined
                    
                    if (!isStyleSheetInUse.current) {
                        isStyleSheetInUse.current = true; // mark the styleSheet as in use
                        registerUsingStyleSheet();
                    } // if
                    
                    return scopeMap[scopeName as keyof CssScopeMap<TCssScopeName>];
                },
            });
        } // if
    };
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
