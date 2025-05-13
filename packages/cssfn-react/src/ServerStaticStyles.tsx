'use cache'

import 'server-only' // This module belongs to the server-side bundle and is never included in the client-side bundle, meaning it is restricted from running in the browser.

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
 * Statically renders stylesheets based on registered styles.
 *
 * ## Purpose:
 * - **Optimized for server-side rendering (SSR)**, ensuring styles are rendered before hydration.
 * - **Caches rendered styles**, preventing redundant re-renders across requests.
 * - **Eliminates client-side registry tracking**, improving SSR efficiency.
 *
 * ## Behavior:
 * - **On the server**, collects styles and renders static `<style>` elements immediately.
 * - **Uses caching**, assuming non-observable styles remain unchanged.
 * - **Ignores observable styles**, since the component subscribes once and avoids unnecessary updates.
 * - **Prevents hydration mismatch** by ensuring styles exist in `<head>` before client-side execution.
 *
 * ## Performance Optimizations:
 * - **Reduces SSR workload** by storing pre-rendered styles.
 * - **Minimizes redundant processing** for non-observable styles.
 * - **Speeds up rendering** by ensuring styles are injected efficiently.
 *
 * ## Choosing Between `<Styles>`, `<StaticStyles>`, `<ServerStaticStyles>`, and `<HydrateStyles>`
 * 
 * - **`<Styles>`** → The most dynamic but least performant choice.  
 *   - Provides **real-time style updates**, reacting to both client & server changes.
 *   - **Best for frameworks without SSR support**, ensuring styling consistency post-render.
 *   - **Should be avoided when SSR is available**, as late updates can cause flickering.
 * 
 * - **`<StaticStyles>`** → The recommended approach for pre-rendering styles **before hydration**.  
 *   - **Encapsulates server-side styles**, ensuring stable rendering.
 *   - **Uses caching** to prevent redundant processing across requests.
 *   - **Future-proof abstraction**, allowing additional implementations beyond SSR if needed.
 * 
 * - **`<ServerStaticStyles>`** → The current internal implementation behind `<StaticStyles>`.  
 *   - **Handles SSR rendering efficiently**, ensuring styles exist before React mounts.
 *   - **Available for edge cases**, but **should not be used directly in most scenarios**.
 *   - **May be replaced or extended** in future versions of `<StaticStyles>`.
 * 
 * - **`<HydrateStyles>`** → The best choice for injecting styles dynamically **during hydration**.  
 *   - Ensures **just-in-time updates** when styles dynamically change.
 *   - **Complements `<StaticStyles>`**, fixing missing styles that weren’t pre-rendered.
 *   - **If `<StaticStyles>` is present, `<Styles>` should not be used**, as hydration fully resolves styling issues.
 *
 * ### 🔥 Recommended Setup:
 * ✅ **Use `<StaticStyles>` for SSR-pre-rendered styles.**  
 * ✅ **Pair it with `<HydrateStyles>` for dynamic updates.**  
 * ❌ **Avoid `<Styles>` when SSR is available**, as it may introduce late rendering inconsistencies.  
 *
 * @component
 * @param {ServerStaticStylesProps} props Component properties.
 * @returns {Promise<JSX.Element | null>} A collection of `<style>` elements for rendered server-side styles.
 */
const ServerStaticStyles = async (props: ServerStaticStylesProps): Promise<JSX.Element | null> => {
    // Props:
    const {
        asyncRender      = false,
        concurrentRender = asyncRender,
        
        onlySsr          = true,
    } = props;
    
    
    
    // Initialize stylesheet collection on first render:
    const styleMap = await (async (): Promise<Map<StyleSheet, string | null>> => {
        // Holds the collected stylesheets:
        const renderedStyleMap = new Map<StyleSheet, string | null>();
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
            if (concurrentRender) {
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
                    renderedStyleMap.set(styleSheet, null); // Preserve the state (mark as removed instead of deleting).
                }
                else {
                    // Store rendered CSS:
                    renderedStyleMap.set(styleSheet, renderedCss);
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
                .map(([styleSheet, renderedCss], index) =>
                    renderedCss
                    ? <Style
                        // Identifiers:
                        key={styleSheet.id || index} // Replace with index if the ID is empty string.
                        id={styleSheet.id}
                        
                        
                        
                        // States:
                        enabled={styleSheet.enabled}
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
