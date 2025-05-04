'use client'

// React:
import {
    // React:
    default as React,
    
    
    
    // Types:
    type JSX,
    
    
    
    // Hooks:
    useRef,
    use,
    
    
    
    // Utilities:
    memo,
}                           from 'react'

// Cssfn:
import {
    // Types:
    type CssScopeName,
}                           from '@cssfn/css-types'
import {
    // Style sheets:
    type StyleSheet,
    type StyleSheetUpdateEvent,
    styleSheetRegistry,
    
    
    
    // Processors:
    type renderStyleSheet,
    type unraceRenderStyleSheetAsync,
}                           from '@cssfn/cssfn'

// Internal components:
import {
    // React components:
    Style,
}                           from './Style.js'

// Utilities:
import {
    // Tests:
    isClientSide,
}                           from './utilities.js'

// Hooks:
import {
    // Hooks:
    useMountedFlag,
}                           from './hooks.js'



// Types:

/**
 * Represents a rendered stylesheet entry.
 */
interface RenderedStyleSheet {
    /**
     * Holds the rendered CSS.
     */
    renderedCss      : string|null
    
    /**
     * Overrides the enabled state on `StyleSheet.enabled`.
     * Since `StyleSheet.enabled` is readonly, this temporary state is stored here.
     */
    enabledOverride  : boolean|undefined
}

/**
 * Represents a pending stylesheet load operation.
 *
 * ## Purpose:
 * - Tracks the status of asynchronously loading stylesheets.
 * - Provides a **Promise-based mechanism** to signal when a stylesheet becomes available.
 */
interface PendingStyleSheet {
    /**
     * A promise that resolves once the stylesheet has finished loading.
     */
    loadPromise  : Promise<void>
    
    /**
     * Resolves the stylesheet loading process, marking it as complete.
     */
    completeLoad : () => void
}



// React components:

/**
 * Props for the `StaticStyles` component.
 */
export interface StaticStylesProps {
    /**
     * Enables batch rendering of multiple CSS-in-JS declarations.
     * - `true` → Uses multiple web workers for faster rendering but higher CPU/memory usage.
     * - `false` (default) → Sequential rendering, useful when styles are mostly pre-rendered on the server.
     */
    asyncRender ?: boolean
    
    /**
     * Determines when to render CSS-in-JS styles.
     * - `false` → Render styles both server-side and client-side.
     * - `true` (default) → Render styles only if explicitly marked as SSR (`ssr: true`).
     *    Styles marked as `ssr: false` will be rendered **just-in-time** when accessed.
     */
    onlySsr     ?: boolean
}

/**
 * Statically renders stylesheets based on the registered styles.
 *
 * ## Purpose:
 * - **Client-side component that efficiently renders server-generated styles**.
 * - Dynamically **retrieves stylesheets from the global client-side stylesheet registry.
 * - Efficiently **handles dynamic imports** for lazy-loaded styles using `use(thePromise)`.
 * - **Uses lazy dynamic imports** to reduce bundle size and avoid expensive rendering on the client.
 * - Improves hydration performance by **stealing prerendered styles** when possible.
 * - Works best in frameworks with **Server Components**, enhancing styling injection efficiency.
 *
 * ## Behavior:
 * - **On the server**, collects styles and renders static `<style>` elements.
 * - **On the client**, avoids expensive re-rendering by detecting existing `<style>` elements instead of generating new ones.
 * - **Waits for dynamically imported stylesheets** before rendering (`use(thePromise)`).
 * - **Lazy loads rendering functions dynamically**, ensuring CPU-intensive operations only run when necessary.
 * - **Optimized async handling** prevents redundant rendering calls.
 * - **Ensures styles exist in `<head>` before `useLayoutEffect()` runs**, supporting components that rely on early DOM measurement.
 * - **Prevents hydration mismatches** by ensuring prerendered output exactly matches the hydrated result.
 *
 * ## Performance Optimizations:
 * - **Dynamic Import for Render Functions**:
 *   - **Web Worker Mode** → Runs in a separate process for non-blocking execution.
 *   - **Main Thread Mode** → Runs synchronously and blocks other tasks until completion.
 *   - Rendering functions are **imported on demand**, reducing unnecessary bundle size.
 * - **Style Hydration Strategy**:
 *   - Prefers **reusing prerendered styles** when available to minimize reprocessing costs.
 *   - **Waits for dynamically loaded stylesheets** before attempting re-render.
 *
 * @component
 * @param {StaticStylesProps} props Component properties.
 * @returns {JSX.Element | null} A collection of `<style>` elements for rendered styles.
 */
const StaticStyles = memo((props: StaticStylesProps): JSX.Element | null => {
    // Props:
    const {
        asyncRender = false,
        onlySsr     = true,
    } = props;
    
    
    
    // States:
    
    const isMounted = useMountedFlag();
    
    // Ref to manage async stylesheet rendering state:
    const renderingStyleMapRef = useRef<Promise<Map<StyleSheet, RenderedStyleSheet>> | Map<StyleSheet, RenderedStyleSheet> | undefined>(undefined);
    
    // Initialize stylesheet collection on first render:
    if (!renderingStyleMapRef.current) {
        renderingStyleMapRef.current = (async (): Promise<Map<StyleSheet, RenderedStyleSheet>> => {
            // Holds the collected stylesheets:
            const renderedStyleMap = new Map<StyleSheet, RenderedStyleSheet>();
            const pendingStyleMap  = new Map<StyleSheet, PendingStyleSheet>();
            const pendingUpdateSet = new Set<Promise<void>>();
            
            
            
            /**
             * Lazily imports and executes the stylesheet rendering function.
             *
             * ## Purpose:
             * - **Reduces bundle size** by dynamically importing the renderer function.
             * - Ensures **CPU-intensive rendering runs efficiently** based on execution context.
             * - **Caches imports** to prevent redundant module fetching.
             *
             * ## Execution Modes:
             * - **Web Worker Mode** → Executes in a separate process (non-blocking).
             * - **Main Thread Mode** → Runs synchronously within the current process (blocking).
             *
             * @returns An async function that renders stylesheets based on the execution mode.
             */
            const getLazyRenderer = () => {
                if (asyncRender) {
                    // Use Web Worker for non-blocking execution:
                    let cachedWebWorkerRenderer : typeof unraceRenderStyleSheetAsync | undefined = undefined;
                    return async (styleSheet: StyleSheet) => {
                        if (!cachedWebWorkerRenderer) cachedWebWorkerRenderer = (await import('@cssfn/cssfn')).unraceRenderStyleSheetAsync;
                        return cachedWebWorkerRenderer(styleSheet);
                    };
                }
                else {
                    // Use Main Thread for synchronous execution:
                    let cachedMainThreadRenderer : typeof renderStyleSheet | undefined = undefined;
                    return async (styleSheet: StyleSheet) => {
                        if (!cachedMainThreadRenderer) cachedMainThreadRenderer = (await import('@cssfn/cssfn')).renderStyleSheet;
                        return cachedMainThreadRenderer(styleSheet);
                    };
                } // if
            };
            
            
            
            // Subscribe to stylesheet updates:
            const subscription = styleSheetRegistry.subscribe(({ styleSheet, type }: StyleSheetUpdateEvent<CssScopeName>): void => {
                // Wrap async processing inside synchronous callback:
                const updatePromise = (async (): Promise<void> => {
                    // Abort early if the component was already unmounted:
                    if (isMounted.current === false) return;
                    
                    
                    
                    // Determine whether the update affects rendering:
                    const isEnabled    = styleSheet.enabled;
                    const isLoaded     = !!styleSheet.scopes;
                    const shouldUpdate = (type === 'enabledChanged');
                    const shouldRender = isEnabled || styleSheet.prerender; // Render if enabled or marked for prerendering.
                    // if (process.env.NODE_ENV !== 'production') {
                    //     console.log('CSS added: ', { type, id: styleSheet.id, isEnabled, isLoaded, shouldUpdate, shouldRender });
                    // } // if
                    
                    
                    
                    // Detect when stylesheet becomes ready:
                    if (type === 'scopesChanged') {
                        pendingStyleMap.get(styleSheet)?.completeLoad();
                    } // if
                    
                    
                    
                    // Skip expensive re-rendering for simple enabled/disabled state changes:
                    if (shouldUpdate && renderedStyleMap.has(styleSheet)) return;
                    
                    
                    
                    // Evaluate SSR rendering conditions:
                    const renderCondition = (
                        // Render only when needed:
                        shouldRender
                        
                        &&
                        
                        // Either both-client-and-server rendering or SSR-enabled:
                        (
                            // Opted both server and client side:
                            !onlySsr
                            
                            ||
                            
                            // Opted only if server side AND ssr mode enabled:
                            styleSheet.ssr
                        )
                    );
                    
                    
                    
                    // Execute rendering based on async/sequential mode:
                    let enabledOverride : boolean | undefined = undefined;
                    const renderedCss = (
                        renderCondition
                        ? await (async (): Promise<string | null | undefined> => {
                            // Reuse prerendered styles (if available):
                            if (styleSheet.id) {
                                const headElement  = isClientSide ? document.head : undefined;
                                if (headElement) {
                                    const existingStyleElm = headElement.querySelector(`style[data-cssfn-id="${styleSheet.id}"]`);
                                    if (existingStyleElm) {
                                        const preRenderedCss = existingStyleElm.textContent;
                                        // if (process.env.NODE_ENV !== 'production') {
                                        //     console.log('Found prerendered: ', preRenderedCss);
                                        // } // if
                                        
                                        // If the prerendered <style> exists, it means the styleSheet has been accessed (turned to enabled) during prerendered on server:
                                        enabledOverride = true;
                                        
                                        return preRenderedCss;
                                    } // if
                                } // if
                            } // if
                            
                            
                            
                            // Abort early if the stylesheet isn't loaded yet:
                            if (!isLoaded) {
                                // if (process.env.NODE_ENV !== 'production') {
                                //     console.log('The stylesheet is not yet loaded: ', { type, id: styleSheet.id, isEnabled, isLoaded, shouldUpdate, shouldRender });
                                // } // if
                                
                                
                                
                                // Setup a stylesheet ready signal:
                                // const { promise: loadPromise, resolve: completeLoad } = Promise.withResolvers<void>(); // Not compatible with Node v20.
                                let completeLoad!: () => void;
                                const loadPromise = new Promise<void>((resolve) => {
                                    completeLoad = resolve;
                                });
                                pendingStyleMap.set(styleSheet, { loadPromise, completeLoad } satisfies PendingStyleSheet);
                                
                                
                                
                                // Assumes rendered as nothing:
                                return null;
                            } // if
                            
                            
                            
                            // Perform fresh rendering (expensive) using lazy rendering function:
                            const freshRenderedCss = await getLazyRenderer()(styleSheet);
                            // if (process.env.NODE_ENV !== 'production') {
                            //     console.log('Fresh rendered: ', freshRenderedCss);
                            // } // if
                            return freshRenderedCss;
                        })()
                        : undefined // Canceled render.
                    );
                    if (renderedCss === undefined) return; // Ignore expired/canceled render.
                    
                    
                    
                    // Abort again if the component was unmounted **after await resumes**:
                    if ((isMounted.current as boolean|undefined) === false) return;
                    
                    
                    
                    // Store rendered CSS in the Map reference:
                    if (!renderedCss) { // Nothing is rendered.
                        // Delete the CSS:
                        // renderedStyleMap.delete(styleSheet); // Do not delete an item in the map.
                        renderedStyleMap.set(styleSheet, { renderedCss: null, enabledOverride } satisfies RenderedStyleSheet); // Preserve the state (mark as removed instead of deleting).
                    }
                    else {
                        // Store rendered CSS:
                        renderedStyleMap.set(styleSheet, { renderedCss, enabledOverride } satisfies RenderedStyleSheet);
                    } // if
                })();
                
                
                
                // Track pending update:
                pendingUpdateSet.add(updatePromise);
                
                
                
                // Remove completed update from tracking set:
                updatePromise.then(() => {
                    pendingUpdateSet.delete(updatePromise);
                });
            });
            
            
            
            // Wait for all pending stylesheets to load:
            if (pendingStyleMap.size) {
                // // Start the performance timer:
                // const startTime = (process.env.NODE_ENV !== 'production') ? performance.now() : 0;
                
                
                
                await Promise.race([
                    Promise.all(
                        Array.from(pendingStyleMap.values())
                        .map(({ loadPromise }) => loadPromise)
                    ),
                    
                    // Max wait: 3 seconds:
                    new Promise<void>((resolve) => {
                        setTimeout(resolve, 3000);
                    }),
                ]);
                
                
                
                // // End the performance timer:
                // const endTime = (process.env.NODE_ENV !== 'production') ? performance.now() : 0;
                
                
                
                // // Report the waiting time:
                // if (process.env.NODE_ENV !== 'production') {
                //     console.log(`Waited for pending stylesheet load for ${(endTime - startTime).toFixed(2)} ms.`);
                // } // if
            } // if
            
            
            
            // Cleanup subscription:
            subscription.unsubscribe();
            
            
            
            // Wait for all pending updates to complete before proceeding:
            if (pendingUpdateSet.size) {
                await Promise.all(pendingUpdateSet);
            } // if
            
            
            
            // Return the collection:
            return renderedStyleMap;
        })();
    } // if
    
    // Resolve stylesheets (waits for async completion):
    const styleMap : Map<StyleSheet, RenderedStyleSheet> = (
        (renderingStyleMapRef.current instanceof Promise)
        
        // Wait for async completion:
        ? use(renderingStyleMapRef.current)
        
        // The rendering process is completed:
        : renderingStyleMapRef.current
    );
    
    // Swap the process promise to the final result (Garbage Collection Optimization):
    if (renderingStyleMapRef.current instanceof Promise) renderingStyleMapRef.current = styleMap;
    
    
    
    // Jsx:
    return (
        <>
            {
                Array.from(styleMap.entries())
                .map(([styleSheet, { renderedCss, enabledOverride }], index) =>
                    renderedCss
                    ? <Style
                        // Identifiers:
                        key={styleSheet.id || index} // Replace with index if the ID is empty string.
                        id={styleSheet.id}
                        
                        
                        
                        // States:
                        enabled={enabledOverride ?? styleSheet.enabled}
                    >
                        {renderedCss}
                    </Style>
                    : null
                )
            }
        </>
    );
});

export {
    StaticStyles,            // Named export for readability.
    StaticStyles as default, // Default export to support React.lazy.
}
