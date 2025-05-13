'use client' // This module belongs to the client-side bundle but can be imported into a server-side module, meaning it relies on client-side execution.

// React:
import {
    // Types:
    type JSX,
    
    
    
    // Hooks:
    useRef,
    useInsertionEffect,
    useEffect,
}                           from 'react'

// Cssfn:
import {
    // API:
    type DynamicStyles,
    hydrateStyles,
}                           from '@cssfn/cssfn-dom'



// React components:

/**
 * Props for the `HydrateStyles` component.
 */
export interface HydrateStylesProps {
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
}

/**
 * Hydrates static styles and continues to dynamically renders stylesheets based on the registered styles.
 *
 * ## Purpose:
 * - Ensures **hydration of static styles** produced by `<StaticStyles>` (server-side renderer).
 * - **Provides early style injection** that works **better than `<Styles>`.
 * - **Prevents delayed updates from `<Styles>`**, which would normally take effect only after `useLayoutEffect()`.
 * - **Ensures consistent styling** between SSR and client-side rendering without hydration mismatches.
 *
 * ## Behavior:
 * - **Client-side only** (`"use client"` directive) → Has no effect on the server.
 * - **Hydrates styles before `useLayoutEffect()` runs**, ensuring styles are available for early DOM measurement.
 * - **Avoids duplicate `<style>` elements**:
 *   - If a `<style>` with `data-id="unique_id"` already exists, **initial rendering is skipped**.
 *   - Assumes the existing `<style>` contains valid CSS from SSR.
 * - **Dynamically updates existing styles**:
 *   - On subsequent updates (same `data-id`), modifies the content inside existing `<style>` tags.
 *   - If the new rendered result is an empty string (`""`), the `<style>` is **removed** instead of being overwritten.
 *
 * ## Performance Optimizations:
 * - **Minimizes re-renders** by reusing existing `<style>` elements when possible.
 * - **Prevents duplicate styles** by detecting pre-existing SSR-rendered styles.
 * - **Ensures efficient hydration** by injecting styles **before `useLayoutEffect()`**, avoiding flickering.
 * - **Automatically removes empty stylesheets** to keep the DOM clean and lightweight.
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
 * @returns {JSX.Element | null} Returns `null` since no JSX is directly rendered.
 */
const HydrateStyles = (props: HydrateStylesProps): JSX.Element | null => {
    // Props:
    const {
        asyncRender      = false,
        concurrentRender = asyncRender,
    } = props;
    
    
    
    // States:
    
    /**
     * Holds the `DynamicStyles` instance.
     * - Used to track and manage hydrated styles dynamically.
     */
    const dynamicStylesRef = useRef<DynamicStyles | undefined>(undefined);
    
    
    
    // Effects:
    
    /**
     * Watches for stylesheet updates and dynamically applies them.
     *
     * Uses `useInsertionEffect` to:
     * - **Hydrate styles early** → Executes before the React lifecycle starts, minimizing render lag.
     * - **Ensure styles persist** → Stops dynamic reactivity when the component unmounts.
     */
    useInsertionEffect(() => {
        // Setups:
        dynamicStylesRef.current = hydrateStyles();
        
        
        
        // Cleanups:
        return () => {
            dynamicStylesRef.current?.dehydrateStyles(); // Transition styles to a static state.
            dynamicStylesRef.current = undefined; // Helps trigger garbage collection (GC) optimization, ensuring that all previously hydrated/live states are released and no longer held in memory.
        };
    }, []);
    
    /**
     * Syncs `concurrentRender` with the `DynamicStyles` instance.
     * - Ensures rendering behavior is dynamically adjusted.
     * - Prevents unnecessary updates when hydration is inactive.
     */
    useEffect(() => {
        // Get the existing `DynamicStyles` instance:
        const dynamicStyles = dynamicStylesRef.current;
        
        // Skip update if no instance exists:
        if (!dynamicStyles) return;
        
        // Apply concurrent rendering configuration:
        dynamicStyles.concurrentRender = concurrentRender;
    }, [concurrentRender]);
    
    
    
    // Jsx:
    return null;
};

export {
    HydrateStyles,            // Named export for readability.
    HydrateStyles as default, // Default export to support React.lazy.
}
