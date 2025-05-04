'use client'

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
    unraceRenderStyleSheetAsync,
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
 * Dynamically renders stylesheets based on the registered styles.
 * 
 * - Supports both **batch (async)** and **sequential (sync)** rendering.
 * - Listens for real-time stylesheet changes via `styleSheetRegistry.subscribe()`.
 * 
 * @param {StylesProps} props - Component properties.
 * @returns {JSX.Element | null} A collection of `<style>` elements for rendered styles.
 */
const Styles = (props: StylesProps): JSX.Element | null => {
    // Props:
    const {
        asyncRender = false,
        onlySsr     = true,
    } = props;
    
    
    
    /**
     * This component maintains two separate states to efficiently manage stylesheet updates:
     * 
     * 1️⃣ `styleMap`: A stable reference to a `Map<StyleSheet, string|null>`, storing the 
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
     *       `styleMap` alone **will not trigger a re-render**.
     *     - To notify React that styles have changed, we use `useTriggerRender()` to 
     *       provide a **lightweight mechanism** for requesting a re-render.
     *     - The `generation` value from `useTriggerRender()` acts as a version counter,
     *       ensuring React correctly updates the component whenever styles are modified.
     * 
     * ✅ This approach optimizes performance by **avoiding unnecessary deep copies**
     *    of the stylesheet map while still ensuring React updates properly.
     */
    const [styleMap                 ] = useState<Map<StyleSheet, string|null>>(() => new Map<StyleSheet, string|null>());
    const [triggerRender, stateStamp] = useTriggerRender();
    
    
    
    // Effects:
    
    const isMounted = useMountedFlag();
    
    /**
     * Watches for stylesheet updates and renders them dynamically.
     * 
     * We use `useInsertionEffect` for:
     * - **Subscribes early** (before React lifecycle starts) to steal startup time and make rendering appear faster.
     * - **Stores rendering results** in a Map reference (`styleMap`) for efficient caching.
     * - **Avoids premature re-renders**, only triggering updates when React lifecycle is ready (`isMounted.current === true`).
     * - **Handles SSR settings** to ensure correct rendering modes.
     * - **Cleans up properly** when the component unmounts to avoid memory leaks.
     */
    useInsertionEffect(() => {
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
            if (shouldUpdate && styleMap.has(styleSheet)) return;
            
            
            
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
                ? (
                    asyncRender
                    ? await unraceRenderStyleSheetAsync(styleSheet) // Batch rendering mode.
                    : renderStyleSheet(styleSheet)                  // Sequential rendering mode.
                )
                : undefined // Canceled render.
            );
            if (renderedCss === undefined) return; // Ignore expired/canceled render.
            
            
            
            // Abort again if the component was unmounted **after await resumes**:
            if ((isMounted.current as boolean|undefined) === false) return;
            
            
            
            // Store rendered CSS in the Map reference:
            if (!renderedCss) { // Nothing is rendered.
                // Delete the CSS:
                // styleMap.delete(styleSheet); // Do not delete an item in the map.
                styleMap.set(styleSheet, null); // Preserve the state (mark as removed instead of deleting).
            }
            else {
                // Store rendered CSS:
                styleMap.set(styleSheet, renderedCss);
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
    ), [stateStamp]);
    
    
    
    // Jsx:
    return cachedJsx;
};

export {
    Styles,            // Named export for readability.
    Styles as default, // Default export to support React.lazy.
}
