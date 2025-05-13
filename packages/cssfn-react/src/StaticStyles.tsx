'use cache'

import 'server-only' // This module belongs to the server-side bundle and is never included in the client-side bundle, meaning it is restricted from running in the browser.

// React:
import {
    // React:
    default as React,
    
    
    
    // Types:
    type JSX,
}                           from 'react'

// Internal components:
import {
    // React components:
    ServerStaticStyles,
}                           from './ServerStaticStyles.js'



// React components:

/**
 * Props for the `StaticStyles` component.
 */
export interface StaticStylesProps {
    /**
     * Enables batch rendering for multiple CSS-in-JS declarations.
     * - `true` → Uses multiple web workers for faster rendering but higher CPU/memory usage.
     * - `false` (default) → Sequential rendering, useful when styles are mostly pre-rendered on the server.
     */
    concurrentRender ?: boolean
    
    /**
     * @deprecated Use `concurrentRender` instead.
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
 * @param {StaticStylesProps} props Component properties.
 * @returns {Promise<JSX.Element | null>} A combination of `<ClientStaticStyles>` and `<ServerStaticStyles>` for full stylesheet coverage.
 */
const StaticStyles = async (props: StaticStylesProps): Promise<JSX.Element | null> => {
    // Jsx:
    return (
        <>
            <ServerStaticStyles {...props} />
        </>
    );
};

export {
    StaticStyles,            // Named export for readability.
    StaticStyles as default, // Default export to support React.lazy.
}
