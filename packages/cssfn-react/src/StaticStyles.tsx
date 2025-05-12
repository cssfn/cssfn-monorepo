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
    ClientStaticStyles,
}                           from './ClientStaticStyles.js'
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
 * Combines both server-side and client-side static styles, ensuring complete stylesheet rendering.
 *
 * ## Purpose:
 * - **Acts as a wrapper for `<ServerStaticStyles>` and `<ClientStaticStyles>`**, ensuring both SSR and client-side styles are properly rendered.
 * - **Optimized for Next.js and frameworks with separate client/server bundles**, preventing missing styles from either side.
 * - **Provides seamless integration between server-rendered and dynamically loaded stylesheets**.
 * - **Ensures hydration stability**, making sure styles are present before interactive components render.
 *
 * ## Behavior:
 * - **Runs on the server**, wrapping `<ServerStaticStyles>` to ensure styles are properly generated during SSR.
 * - **Includes `<ClientStaticStyles>` to hydrate styles on the client**, ensuring dynamic client-side styles are loaded correctly.
 * - **Handles both pre-rendered (SSR) and just-in-time (CSR) styles**, preventing hydration mismatches.
 * - **Does not directly render styles**—it simply combines both static style components.
 *
 * ## Performance Considerations:
 * - **Relies on `<ServerStaticStyles>` for pre-rendered styles** → Ensures styles exist before client-side hydration.
 * - **Uses `<ClientStaticStyles>` for dynamic hydration** → Keeps client-side styles responsive to updates.
 * - **Does not introduce extra processing overhead** → Functions purely as a wrapper.
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
 * @param {StaticStylesProps} props Component properties.
 * @returns {Promise<JSX.Element | null>} A combination of `<ClientStaticStyles>` and `<ServerStaticStyles>` for full stylesheet coverage.
 */
const StaticStyles = async (props: StaticStylesProps): Promise<JSX.Element | null> => {
    // Jsx:
    return (
        <>
            <ServerStaticStyles {...props} />
            <ClientStaticStyles {...props} />
        </>
    );
};

export {
    StaticStyles,            // Named export for readability.
    StaticStyles as default, // Default export to support React.lazy.
}
