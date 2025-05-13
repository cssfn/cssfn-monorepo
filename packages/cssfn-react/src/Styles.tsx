'use client' // This module belongs to the client-side bundle but can be imported into a server-side module, meaning it relies on client-side execution.

// React:
import {
    // React:
    default as React,
    
    
    
    // Types:
    type JSX,
    
    
    
    // Hooks:
    useState,
    useInsertionEffect,
    useMemo,
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

// Hooks:
import {
    // Hooks:
    useTriggerRender,
    useMountedFlag,
}                           from './hooks.js'



// React components:

/**
 * Props for the `Styles` component.
 */
export interface StylesProps {
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
 * Dynamically renders stylesheets based on registered styles in real time.
 *
 * ## Purpose:
 * - **Synchronizes with the stylesheet registry** to reflect live updates.
 * - Supports **both batch (async) and sequential (sync) rendering**, adapting to performance needs.
 * - Ensures styles are dynamically applied without requiring full page re-renders.
 * - Provides flexibility for **real-time styling updates**, making it ideal for dynamic UI changes.
 *
 * ## Behavior:
 * - **Listens for updates via `styleSheetRegistry.subscribe()`**, rendering styles as they change.
 * - **Fully reactive to client-side styling events**, ensuring UI consistency.
 * - **Unlike `<StaticStyles>`**, it prioritizes **live updates** over hydration performance optimizations.
 * - **May introduce additional re-renders**, making it less optimized for initial page load.
 *
 * ## Performance Considerations:
 * - **Batch Processing vs. Sequential Execution**:
 *   - `concurrentRender: true` → Uses Web Workers for faster parallel execution.
 *   - `concurrentRender: false` → Runs styles sequentially to optimize CPU usage.
 * - **Live updates vs. static styles**:
 *   - Use `<StaticStyles>` for **pre-rendered styles** that won’t change dynamically.
 *   - Use `<Styles>` for **real-time updates** where styles change frequently.
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
 * @param {StylesProps} props - Component properties.
 * @returns {JSX.Element | null} A collection of `<style>` elements reflecting live stylesheet updates.
 */
const Styles = (props: StylesProps): JSX.Element | null => {
    // Props:
    const {
        asyncRender      = false,
        concurrentRender = asyncRender,
        
        onlySsr          = true,
    } = props;
    
    
    
    /**
     * This component maintains two separate states to efficiently manage stylesheet updates:
     * 
     * 1️⃣ `renderedStyleMap`: A stable reference to a `Map<StyleSheet, string|null>`, storing the 
     *     rendered CSS for each registered stylesheet.
     * 
     *     - Using `useState` ensures the `Map` remains **persistent** across re-renders.
     *     - This `Map` is **mutated directly**, rather than replacing it with a new object,
     *       to **avoid unnecessary memory allocations**.
     *     - Stylesheets marked for deletion are set to `null` instead of being removed, 
     *       preserving **consistent React keys** and preventing unnecessary re-mounts of components.
     * 
     * 2️⃣ `triggerRender`: A separate state mechanism used **solely to force re-renders** 
     *     when the stylesheet map is modified.
     * 
     *     - React **does not detect mutations inside objects like Maps**, so updating 
     *       `renderedStyleMap` alone **will not trigger a re-render**.
     *     - To notify React that styles have changed, we use `useTriggerRender()` to 
     *       provide a **lightweight mechanism** for requesting a re-render.
     *     - The `generation` value from `useTriggerRender()` acts as a version counter,
     *       ensuring React correctly updates the component whenever styles are modified.
     * 
     * ✅ This approach optimizes performance by **avoiding unnecessary deep copies**
     *    of the stylesheet map while still ensuring React updates properly.
     */
    const [renderedStyleMap         ] = useState<Map<StyleSheet, string|null>>(() => new Map<StyleSheet, string|null>());
    const [triggerRender, stateStamp] = useTriggerRender();
    
    
    
    // Effects:
    
    const isMounted = useMountedFlag();
    
    /**
     * Watches for stylesheet updates and renders them dynamically.
     * 
     * We use `useInsertionEffect` for:
     * - **Subscribes early** (before React lifecycle starts) to steal startup time and make rendering appear faster.
     * - **Stores rendering results** in a Map reference (`renderedStyleMap`) for efficient caching.
     * - **Avoids premature re-renders**, only triggering updates when React lifecycle is ready (`isMounted.current === true`).
     * - **Handles SSR settings** to ensure correct rendering modes.
     * - **Cleans up properly** when the component unmounts to avoid memory leaks.
     */
    useInsertionEffect(() => {
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
        
        
        
        // Setups:
        // Subscribe immediately to stylesheet updates:
        const subscription = styleSheetRegistry.subscribe(async ({ styleSheet, type }: StyleSheetUpdateEvent<CssScopeName>): Promise<void> => {
            // Abort early if the component was already unmounted:
            if (isMounted.current === false) return;
            
            
            
            // Determine whether the update affects rendering:
            const isEnabled    = styleSheet.enabled;
            const shouldUpdate = (type === 'enabledChanged');
            const shouldRender = isEnabled || styleSheet.prerender; // Render if enabled or marked for prerendering.
            
            
            
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
                ? await getRenderer()(styleSheet) // Perform fresh rendering (expensive).
                : undefined // Canceled render.
            );
            if (renderedCss === undefined) return; // Ignore expired/canceled render.
            
            
            
            // Abort again if the component was unmounted **after await resumes**:
            if ((isMounted.current as boolean|undefined) === false) return;
            
            
            
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
            
            
            
            // Trigger re-render **only when lifecycle is ready**:
            if (isMounted.current === true) triggerRender();
        });
        
        
        
        // Cleanups:
        return () => {
            // Cleanup subscription:
            subscription.unsubscribe();
        };
    }, []);
    
    
    
    // Memoize JSX output to prevent unnecessary re-renders:
    const cachedJsx = useMemo(() => (
        <>
            {
                Array.from(renderedStyleMap.entries())
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
    ), [stateStamp]);
    
    
    
    // Jsx:
    return cachedJsx;
};

export {
    Styles,            // Named export for readability.
    Styles as default, // Default export to support React.lazy.
}
