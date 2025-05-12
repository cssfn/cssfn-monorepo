'use client' // This module belongs to the client-side bundle but can be imported into a server-side module, meaning it relies on client-side execution.

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
    type unraceRenderStyleSheetConcurrent,
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



// React components:

/**
 * Props for the `ClientStaticStyles` component.
 */
export interface ClientStaticStylesProps {
    /**
     * Enables batch rendering for multiple CSS-in-JS declarations.
     * - `true` → Uses multiple web workers for faster rendering but higher CPU/memory usage.
     * - `false` (default) → Sequential rendering, useful when styles are mostly pre-rendered on the server.
     */
    concurrentRender ?: boolean
    
    /**
     * Use `concurrentRender` instead.
     */
    asyncRender      ?: boolean
    
    /**
     * Controls whether styles should be rendered exclusively for SSR.
     * - `false` → Render styles both server-side and client-side.
     * - `true` (default) → Render styles **only** if explicitly marked as SSR (`ssr: true`).
     *   Styles marked as `ssr: false` will be rendered **just-in-time** when accessed.
     */
    onlySsr          ?: boolean
}

/**
 * Statically renders stylesheets based on registered **client-side styles**.
 *
 * ## Purpose:
 * - **Optimized for client-side hydration** → Ensures styles are correctly applied after initial render.
 * - **Retrieves stylesheets dynamically from the global client-side registry** → Handles styles registered by client components.
 * - **Efficiently handles dynamic imports** → Defers execution to wait for lazy-loaded styles **only when needed**.
 * - **Works in Next.js and other SSR frameworks** → Prevents styling mismatches during hydration.
 * - **Avoids unnecessary re-processing** → Uses cached styles when possible for optimal performance.
 *
 * ## Behavior:
 * - **On the server**, collects styles and renders static `<style>` elements **before hydration**.
 * - **On the client**, avoids expensive re-rendering by detecting existing `<style>` elements instead of generating new ones.
 * - **Lazy loads rendering functions dynamically**, ensuring CPU-intensive operations only run when necessary.
 * - **Optimized async handling** prevents redundant rendering calls.
 * - **No registry tracking required** → Works directly with pre-registered styles instead.
 * - **Immediately renders styles** → Ensures styles exist in `<head>` without needing client hydration, supporting components that rely on early DOM measurement.
 * - **Prevents hydration mismatches** by ensuring prerendered output exactly matches the hydrated result.
 *
 * ## Performance Optimizations:
 * - **Async Import Handling**:
 *   - Directly awaits imports → Reduces unnecessary runtime computations.
 *   - Removes need for deferred execution → No extra complexity for render timing.
 *   - Rendering functions are **imported on demand**, reducing unnecessary bundle size.
 * - **Batch Processing vs. Sequential Execution**:
 *   - `concurrentRender: true` → Uses Web Workers for faster parallel execution.
 *   - `concurrentRender: false` → Runs styles sequentially to optimize CPU usage.
 * - **Style Hydration Strategy**:
 *   - Prefers **reusing prerendered styles** when available to minimize reprocessing costs.
 *
 * ## Choosing Between `<Styles>`, `<StaticStyles>`, `<ClientStaticStyles>`, `<ServerStaticStyles>`, and `<HydrateStyles>`
 * 
 * - **`<Styles>`** → The most dynamic but least performant choice.  
 *   - Provides **full real-time style updates**, reacting to both client & server changes.
 *   - **Best for frameworks that do not support SSR** (since it ensures styling consistency post-render).
 *   - Should be **avoided** when **server-side rendering is available** due to potential late updates.
 * 
 * - **Pairing `<StaticStyles>` & `<HydrateStyles>`** → The most **performant** and **recommended approach**.  
 *   - `<StaticStyles>` (server-side) ensures **initial styles** are fully rendered **before any React lifecycle runs**.
 *   - `<HydrateStyles>` ensures **just-in-time updates** when styles dynamically change.
 *   - **If this pair is present, `<Styles>` should not be used** since hydration fully resolves styling issues.
 * 
 * - **`<HydrateStyles>` as a standalone fallback** → Acts as a more efficient `<Styles>` replacement.  
 *   - Can function **without `<StaticStyles>`, `<ServerStaticStyles>`, or `<ClientStaticStyles>`**.
 *   - **Best suited for scenarios where only missing `<style>` elements need to be injected dynamically**.
 * 
 * - **`<ClientStaticStyles>` standalone usage** → Viable in frameworks without SSR.  
 *   - **Only use when no subscribeable/observable styles are required**.
 *   - `enabled` must be set as a **boolean value** (not `'auto'`).
 *   - **Does not work well if server rendering is supported** (since styles would be missing in SSR).
 * 
 * - **Pairing `<ServerStaticStyles>` & `<ClientStaticStyles>`** → Ensures full coverage of server & client styles.  
 *   - **Required if server-rendered styles need visibility in the client bundle**.
 *   - Even **better when triple-paired with `<HydrateStyles>`** for real-time dynamic styling.
 * 
 * - **`<StaticStyles>` simplifies `<ServerStaticStyles>` + `<ClientStaticStyles>` pairing**.  
 *   - Functions **identically** as using **both components together**.
 *   - **`<StaticStyles>` + `<HydrateStyles>` is equivalent to the triple pairing**.
 *
 * @component
 * @param {ClientStaticStylesProps} props Component properties.
 * @returns {JSX.Element | null} A collection of `<style>` elements for rendered client-side styles.
 */
const ClientStaticStyles = memo((props: ClientStaticStylesProps): JSX.Element | null => {
    // Props:
    const {
        asyncRender      = false,
        concurrentRender = asyncRender,
        
        onlySsr          = true,
    } = props;
    
    
    
    /*
        🏗️ **Dynamic Styles Rendering with Suspense Handling**
        
        This system manages the rendering of dynamic styles **asynchronously**, ensuring React's Suspense mechanism
        correctly pauses execution until styles are fully available. Instead of instantly running an async process, 
        it first **awaits an explicit continuation or abort decision**, preventing unnecessary rendering when data 
        isn't ready or required.
        
        ────────────────────────────────────────────────────────────
        🔍 **How Suspense Handles Asynchronous Rendering**
        1️⃣ **First Render:**  
            - `renderedStyleMapRef` starts undefined, triggering the setup of an async rendering process.
            - **Before executing**, the rendering process **pauses**, waiting for a continuation signal.
            - `use(promise)` is called with the pending rendering process.
            - React **throws an exception**, pausing execution and preventing further code from running.
        
        2️⃣ **Suspense Handling (Behind the Scenes):**  
            - The thrown exception **halts rendering** until the promise is resolved.
            - Once resolved, React **retries rendering**, now passing the resolved value into `use(promise)`.
            - The component **now executes normally**, ensuring styles are correctly applied.
        
        3️⃣ **Controlled Rendering Decision:**  
            - **Before proceeding**, the rendering process checks whether it should **continue** or **abort**.
            - If the promise **resolves immediately**, the continuation signal **aborts unnecessary re-rendering**.
            - If Suspense suspends the render, the continuation signal **ensures hydration continues**, allowing React to wait until the hydration process completes before retrying the render.
        
        ────────────────────────────────────────────────────────────
        ⚡ **Why This Trick Works**
        ✅ **Prevents wasteful rendering executions**, ensuring the process runs only when needed.  
        ✅ **Stabilizes hydration** by aligning async rendering with React's Suspense flow.  
        ✅ **Optimizes the lifecycle**, minimizing redundant async computations.  
        
        By integrating this mechanism, React's Suspense **can effectively pause and resume rendering**, 
        ensuring dynamic styles hydrate smoothly **without redundant executions**.
    */
    
    
    
    // States:
    
    /**
     * Handles the rendering process for dynamic styles.
     */
    interface StyleRenderingTask {
        /**
         * A promise that resolves once the stylesheet collection is fully rendered.
         */
        renderingPromise : Promise<Map<StyleSheet, RenderedStyleSheet>>
        
        /**
         * A signal function controlling whether the rendering should proceed.
         */
        shouldContinueRendering : (doContinue: boolean) => void
    }
    
    // Ref to manage async stylesheet rendering state:
    const renderingStyleMapRef = useRef<StyleRenderingTask | Map<StyleSheet, RenderedStyleSheet> | undefined>(undefined);
    
    // Initialize stylesheet collection on first render:
    if (!renderingStyleMapRef.current) {
        // Signal controller for rendering continuation:
        let shouldContinueRendering !: StyleRenderingTask['shouldContinueRendering'];
        
        // Promise to manage rendering execution flow:
        const continuePromise = new Promise<boolean>((resolve) => {
            shouldContinueRendering = resolve;
        });
        
        renderingStyleMapRef.current = {
            renderingPromise : (async (): Promise<Map<StyleSheet, RenderedStyleSheet>> => {
                // Await the decision to proceed:
                const shouldProceedWithRendering = await continuePromise;
                
                
                
                // Early exit if rendering is canceled:
                if (!shouldProceedWithRendering) return new Map<StyleSheet, RenderedStyleSheet>();
                
                
                
                // Holds the collected stylesheets:
                const renderedStyleMap = new Map<StyleSheet, RenderedStyleSheet>();
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
                 * - **Web Worker Mode** → Runs in a separate process (non-blocking).
                 * - **Main Thread Mode** → Runs in current process (blocking).
                 *
                 * @returns An async function that renders stylesheets based on the execution mode.
                 */
                const getLazyRenderer = () => {
                    if (concurrentRender) {
                        // Use Web Worker for non-blocking execution:
                        let cachedWebWorkerRenderer : typeof unraceRenderStyleSheetConcurrent | undefined = undefined;
                        return async (styleSheet: StyleSheet) => {
                            if (!cachedWebWorkerRenderer) cachedWebWorkerRenderer = (await import('@cssfn/cssfn')).unraceRenderStyleSheetConcurrent;
                            return cachedWebWorkerRenderer(styleSheet);
                        };
                    }
                    else {
                        // Use Main Thread for blocking execution:
                        let cachedMainThreadRenderer : typeof renderStyleSheet | undefined = undefined;
                        return async (styleSheet: StyleSheet) => {
                            if (!cachedMainThreadRenderer) cachedMainThreadRenderer = (await import('@cssfn/cssfn')).renderStyleSheet;
                            return cachedMainThreadRenderer(styleSheet);
                        };
                    } // if
                };
                
                
                
                // Subscribe **once** to collect styles (avoids real-time updates after hydration):
                styleSheetRegistry.subscribe(({ styleSheet, type }: StyleSheetUpdateEvent<CssScopeName>): void => {
                    // Wrap async processing inside synchronous callback:
                    const updatePromise = (async (): Promise<void> => {
                        // Determine whether the update affects rendering:
                        const isEnabled    = styleSheet.enabled;
                        const isLoaded     = !!styleSheet.scopes;
                        const shouldUpdate = (type === 'enabledChanged');
                        const shouldRender = isEnabled || styleSheet.prerender; // Render if enabled or marked for prerendering.
                        // if (process.env.NODE_ENV !== 'production') {
                        //     console.log('CSS added: ', { type, id: styleSheet.id, isEnabled, isLoaded, shouldUpdate, shouldRender });
                        // } // if
                        
                        
                        
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
                                if (!isLoaded) return null;
                                
                                
                                
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
                })
                // Unsubscribe **immediately** to prevent future updates:
                .unsubscribe();
                
                
                
                // Wait for all pending updates to complete before proceeding:
                if (pendingUpdateSet.size) {
                    await Promise.all(pendingUpdateSet);
                } // if
                
                
                
                // Return the rendered stylesheet map:
                return renderedStyleMap;
            })(),
            shouldContinueRendering,
        } satisfies StyleRenderingTask;
    } // if
    
    // Resolve stylesheets (waits for async completion):
    const styleMap : Map<StyleSheet, RenderedStyleSheet> = (
        (!(renderingStyleMapRef.current instanceof Map))
        
        // Wait for async completion:
        ? (() => {
            try {
                // If `use()` throws, rendering is suspended; otherwise, it has already resolved:
                const resolved = use(renderingStyleMapRef.current.renderingPromise);
                
                // If the promise resolves immediately, prevent further rendering:
                renderingStyleMapRef.current.shouldContinueRendering(false);
                
                // Return the resolved stylesheet map:
                return resolved;
            }
            catch (suspenseInterrupt: unknown) {
                // If an exception occurs, rendering is being suspended; continue the process:
                renderingStyleMapRef.current.shouldContinueRendering(true);
                
                // Rethrow the original Suspense-related exception:
                throw suspenseInterrupt;
            } // if
        })()
        
        // The rendering process is completed:
        : renderingStyleMapRef.current
    );
    
    // Optimize GC by replacing the rendering process reference with the final resolved result:
    if (!(renderingStyleMapRef.current instanceof Map)) renderingStyleMapRef.current = styleMap;
    
    
    
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
    ClientStaticStyles,            // Named export for readability.
    ClientStaticStyles as default, // Default export to support React.lazy.
}
