import 'server-only' // This module belongs to the server-side bundle and is never included in the client-side bundle, meaning it is restricted from running in the browser.

// Cssfn:
import {
    // Cssfn properties:
    type CssScopeName,
    type CssScopeOptions,
    type CssScopeMap,
}                           from '@cssfn/css-types'
import {
    // Types:
    type StyleSheetsFactory,
    type StyleSheetFactory,
    
    
    
    // Style sheets:
    type StyleSheetOptions,
    
    
    
    // Stylesheet declarators:
    styleSheets,
    transformScopedStyleSource,
}                           from '@cssfn/cssfn'



// Stylesheet declarators:
/**
 * Creates a React hook for declaring scoped stylesheets for server components.
 *
 * - Defines multiple scoped styles, each mapped to a uniquely stable CSS class name.
 * - The hook returns a `CssScopeMap<>` object containing properties mapped to their corresponding generated class names.
 * - Ensures stylesheets are efficiently tracked, updated, and reused across components.
 * - **IMPORTANT:** Must be called at the **top-level module** to ensure the stylesheet registration occurs **only once**.
 *
 * ## Key Features:
 * - **Supports Dynamic Imports for Lazy-Loaded Styles:** Ensures styles are loaded only when needed.
 * - Does **not** rely on React lifecycle (no component reactivity).
 *
 * ## Usage Examples:
 *
 * **Static Style Declaration:**
 * ```ts
    const useMyComponentStyles = createServerStyleSheetsHook([
        scope('header', {
            display: 'grid',
            gap: '1rem',
        }),
        scope('footer', {
            display: 'flex',
            gap: '1rem',
            ...children('p', {
                marginBlock: '1em',
            }),
        }),
    ], { id: 'style-1' });
    
    // In the server component:
    const styles = useMyComponentStyles();
    const headerClassName = styles.header;
    const footerClassName = styles.footer;
 * ```
 *
 * **Lazy Evaluated Styles:**
 * ```ts
    const useMyComponentStyles = createServerStyleSheetsHook(() => [
        scope('header', {
            display: 'grid',
        }),
        scope('footer', {
            display: 'flex',
        }),
    ], { id: 'style-2' });
    
    // In the server component:
    const styles = useMyComponentStyles();
    const headerClassName = styles.header;
    const footerClassName = styles.footer;
 * ```
 *
 * **Dynamic Imports for Styles:**
 * ```ts
    const useMyComponentStyles = createServerStyleSheetsHook(async () => import('./my-styles.js'), { id: 'style-3' });
    
    // In the server component:
    const styles = useMyComponentStyles();
    const headerClassName = styles.header;
    const footerClassName = styles.footer;
 * ```
 *
 * **Live Style Updates via Subscribable or Observables:**
 * ```ts
    const liveStyles = new Subject<CssScopeList<'header' | 'footer'> | null>();
    const useMyComponentStyles = createServerStyleSheetsHook(liveStyles, { id: 'style-4' });
    
    // In the server component:
    const styles = useMyComponentStyles();
    const headerClassName = styles.header;
    const footerClassName = styles.footer;
    
    // Dynamically update styles in the future:
    liveStyles.next([
        scope('header', {
            display: 'grid',
        }),
        scope('footer', {
            display: 'flex',
        }),
    ]);
 * ```
 *
 * @template TCssScopeName - A list of scoped class names as a bitwise string (e.g., `'header' | 'footer'`).
 * @param scopeSource - A definition source for scoped styles, which may be static, lazy, dynamic, or subscribable (observable).
 * @param options - Optional configuration settings for stylesheet registration.
 * @returns A hook function providing access to a `CssScopeMap<>` containing stable class names mapped to their respective scopes.
 */
export const createServerStyleSheetsHook = <TCssScopeName extends CssScopeName>(scopeSource: StyleSheetsFactory<TCssScopeName>, options?: StyleSheetOptions): () => CssScopeMap<TCssScopeName> => {
    // Register the stylesheet into the global stylesheet registry:
    const scopes = styleSheets(scopeSource, options);
    
    
    
    // Return a hook that correctly binds to the stylesheet instance:
    const useServerReactStyleSheets = () => scopes;
    return useServerReactStyleSheets;
};

/**
 * Creates a React hook for declaring an anonymous scoped stylesheet for server components.
 *
 * - The scope name is **intrinsically set to `'main'`**, ensuring a single, stable CSS class name.
 * - The hook returns a `CssScopeMap<'main'>`, where the `'main'` property maps to the generated class name.
 * - Ensures stylesheets are efficiently tracked, updated, and reused across components.
 * - **IMPORTANT:** Must be called at the **top-level module** to ensure the stylesheet registration occurs **only once**.
 *
 * ## Key Features:
 * - **Supports Dynamic Imports for Lazy-Loaded Styles:** Ensures styles are loaded only when needed.
 * - Does **not** rely on React lifecycle (no component reactivity).
 *
 * ## Usage Examples:
 *
 * **Static Style Declaration:**
 * ```ts
    const useMyComponentStyles = createServerStyleSheetHook({
        display: 'grid',
        gap: '1rem',
    }, { id: 'style-1' });
    
    // In the server component:
    const styles = useMyComponentStyles();
    const componentClassName = styles.main;
 * ```
 *
 * **Lazy Evaluated Styles:**
 * ```ts
    const useMyComponentStyles = createServerStyleSheetHook(() => ({
        display: 'flex',
        gap: '1rem',
        ...children('p', {
            marginBlock: '1em',
        }),
    }), { id: 'style-2' });
    
    // In the server component:
    const styles = useMyComponentStyles();
    const componentClassName = styles.main;
 * ```
 *
 * **Dynamic Imports for Styles:**
 * ```ts
    const useMyComponentStyles = createServerStyleSheetHook(async () => import('./my-style.js'), { id: 'style-3' });
    
    // In the server component:
    const styles = useMyComponentStyles();
    const componentClassName = styles.main;
 * ```
 *
 * **Live Style Updates via Subscribable or Observables:**
 * ```ts
    const liveStyles = new Subject<CssStyleCollection>();
    const useMyComponentStyles = createServerStyleSheetHook(liveStyles, { id: 'style-4' });
    
    // In the server component:
    const styles = useMyComponentStyles();
    const componentClassName = styles.main;
    
    // Dynamically update styles in the future:
    liveStyles.next({
        display: 'grid',
        gap: '1rem',
    });
 * ```
 *
 * @param style - A definition source for styles, which may be static, lazy, dynamic, or subscribable (observable).
 * @param options - Optional configuration settings for stylesheet registration.
 * @returns A hook function providing access to a `CssScopeMap<'main'>`, where `'main'` maps to its uniquely generated class name.
 */
export const createServerStyleSheetHook  = (style: StyleSheetFactory, options?: StyleSheetOptions & CssScopeOptions): () => CssScopeMap<'main'> => {
    return createServerStyleSheetsHook(
        transformScopedStyleSource(style, options), // Transforms the unscoped `style` into a `'main'`-scoped style.
        options
    );
};
