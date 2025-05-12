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
