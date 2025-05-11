import 'server-only'

// React:
import {
    // React:
    default as React,
    
    
    
    // Types:
    type JSX,
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
    renderStyleSheet,
    unraceRenderStyleSheetConcurrent,
}                           from '@cssfn/cssfn'

// Internal components:
import {
    // React components:
    Style,
}                           from './Style.js'



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
 * Props for the `ServerStaticStyles` component.
 */
export interface ServerStaticStylesProps {
    /**
     * Enables batch rendering for multiple CSS-in-JS declarations.
     * - `true` → Uses multiple web workers for faster rendering but higher CPU/memory usage.
     * - `false` (default) → Sequential rendering, useful when styles are mostly pre-rendered on the server.
     */
    asyncRender ?: boolean
    
    /**
     * Controls whether styles should be rendered exclusively for SSR.
     * - `false` → Render styles both server-side and client-side.
     * - `true` (default) → Render styles **only** if explicitly marked as SSR (`ssr: true`).
     *   Styles marked as `ssr: false` will be rendered **just-in-time** when accessed.
     */
    onlySsr     ?: boolean
}

/**
 * Statically renders stylesheets based on registered **server-side styles**.
 *
 * ## Purpose:
 * - **Optimized for server-side rendering (SSR)** → Works seamlessly in server components.
 * - **Retrieves stylesheets directly at execution time** → No need for client-side registry tracking.
 * - **Efficiently handles dynamic imports** → Loads styles asynchronously **only when needed**.
 * - **Prioritizes loading speed over bundle size** → Server performance matters more than code slimming.
 *
 * ## Behavior:
 * - **On the server**, collects styles and renders static `<style>` elements **before hydration**.
 * - **No registry tracking required** → Works directly with pre-registered styles instead.
 * - **Immediately renders styles** → Ensures styles exist in `<head>` without needing client hydration, supporting components that rely on early DOM measurement.
 *
 * ## Performance Optimizations:
 * - **Async Import Handling**:
 *   - Directly awaits imports → Reduces unnecessary runtime computations.
 *   - Removes need for deferred execution → No extra complexity for render timing.
 * - **Batch Processing vs. Sequential Execution**:
 *   - `asyncRender: true` → Uses Web Workers for faster parallel execution.
 *   - `asyncRender: false` → Runs styles sequentially to optimize CPU usage.
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
 * @param {ServerStaticStylesProps} props Component properties.
 * @returns {Promise<JSX.Element | null>} A collection of `<style>` elements for rendered server-side styles.
 */
const ServerStaticStyles = async (props: ServerStaticStylesProps): Promise<JSX.Element | null> => {
    // Props:
    const {
        asyncRender = false,
        onlySsr     = true,
    } = props;
    
    
    
    // Initialize stylesheet collection on first render:
    const styleMap = await (async (): Promise<Map<StyleSheet, RenderedStyleSheet>> => {
        // Holds the collected stylesheets:
        const renderedStyleMap = new Map<StyleSheet, RenderedStyleSheet>();
        const pendingUpdateSet = new Set<Promise<void>>();
        
        
        
        /**
         * Executes the stylesheet rendering function.
         *
         * ## Purpose:
         * - Ensures **CPU-intensive rendering runs efficiently** based on execution context.
         *
         * ## Execution Modes:
         * - **Web Worker Mode** → Runs in a separate process (non-blocking).
         * - **Main Thread Mode** → Runs in current process (blocking).
         *
         * @returns An async function that renders stylesheets based on the execution mode.
         */
        const getRenderer = () => {
            if (asyncRender) {
                // Use Web Worker for non-blocking execution:
                return unraceRenderStyleSheetConcurrent;
            }
            else {
                // Use Main Thread for blocking execution:
                return renderStyleSheet;
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
                        // Abort early if the stylesheet isn't loaded yet:
                        if (!isLoaded) return null;
                        
                        
                        
                        // Perform fresh rendering (expensive) using lazy rendering function:
                        const freshRenderedCss = await getRenderer()(styleSheet);
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
        
        
        
        // Return the collection:
        return renderedStyleMap;
    })();
    
    
    
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
};

export {
    ServerStaticStyles,            // Named export for readability.
    ServerStaticStyles as default, // Default export to support React.lazy.
}
