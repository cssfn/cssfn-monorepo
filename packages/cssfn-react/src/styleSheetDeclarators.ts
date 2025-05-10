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
    styleSheetRegistry,
    transformScopedStyleSource,
}                           from '@cssfn/cssfn'
import {
    // Style sheets:
    type ReactStyleSheetOptions,
    ReactStyleSheet,
}                           from './styleSheets.js'



// Stylesheet declarators:

/**
 * Creates a React hook for declaring scoped stylesheets.
 *
 * - Defines multiple scoped styles, each mapped to a uniquely stable CSS class name.
 * - The hook returns a `CssScopeMap<>` object containing properties mapped to their corresponding generated class names.
 * - Ensures stylesheets are efficiently tracked, updated, and reused across components.
 * - **IMPORTANT:** Must be called at the **top-level module** to ensure the stylesheet registration occurs **only once**.
 *
 * ## Usage Examples:
 *
 * **Static Style Declaration:**
 * ```ts
    const useMyComponentStyles = createStyleSheetsHook([
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
    
    // In the component:
    const styles = useMyComponentStyles();
    const headerClassName = styles.header;
    const footerClassName = styles.footer;
 * ```
 *
 * **Lazy Evaluated Styles:**
 * ```ts
    const useMyComponentStyles = createStyleSheetsHook(() => [
        scope('header', {
            display: 'grid',
        }),
        scope('footer', {
            display: 'flex',
        }),
    ], { id: 'style-2' });
    
    // In the component:
    const styles = useMyComponentStyles();
    const headerClassName = styles.header;
    const footerClassName = styles.footer;
 * ```
 *
 * **Dynamic Imports for Styles:**
 * ```ts
    const useMyComponentStyles = createStyleSheetsHook(async () => import('./my-styles.js'), { id: 'style-3' });
    
    // In the component:
    const styles = useMyComponentStyles();
    const headerClassName = styles.header;
    const footerClassName = styles.footer;
 * ```
 *
 * **Live Style Updates via Subscribable or Observables:**
 * ```ts
    const liveStyles = new Subject<CssScopeList<'header' | 'footer'> | null>();
    const useMyComponentStyles = createStyleSheetsHook(liveStyles, { id: 'style-4' });
    
    // In the component:
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
export const createStyleSheetsHook = <TCssScopeName extends CssScopeName>(scopeSource: StyleSheetsFactory<TCssScopeName>, options?: ReactStyleSheetOptions): () => CssScopeMap<TCssScopeName> => {
    // Create a new ReactStyleSheet instance:
    const newReactStyleSheet = new ReactStyleSheet<TCssScopeName>(
        scopeSource,
        styleSheetRegistry.handleStyleSheetUpdated, // Listen for updates from registered stylesheets.
        options
    );
    
    
    
    // Attempt to register the new instance into the global stylesheet registry, reusing an existing one if available:
    const existingReactStyleSheet = styleSheetRegistry.add(newReactStyleSheet);
    
    
    
    // Return a hook that correctly binds to the stylesheet instance:
    const useReactStyleSheets = () => (
        ((existingReactStyleSheet instanceof ReactStyleSheet) ? existingReactStyleSheet : newReactStyleSheet)
        .useReactStyleSheets() // Ensures proper `this` binding for current `ReactStyleSheet` instance.
    );
    return useReactStyleSheets;
};

/**
 * @deprecated Use `createStyleSheetsHook` instead.
 */
export const dynamicStyleSheets = createStyleSheetsHook;


/**
 * Creates a React hook for declaring an anonymous scoped stylesheet for simple usage.
 *
 * - The scope name is **intrinsically set to `'main'`**, ensuring a single, stable CSS class name.
 * - The hook returns a `CssScopeMap<'main'>`, where the `'main'` property maps to the generated class name.
 * - Ensures stylesheets are efficiently tracked, updated, and reused across components.
 * - **IMPORTANT:** Must be called at the **top-level module** to ensure the stylesheet registration occurs **only once**.
 *
 * ## Usage Examples:
 *
 * **Static Style Declaration:**
 * ```ts
    const useMyComponentStyles = createStyleSheetHook({
        display: 'grid',
        gap: '1rem',
    }, { id: 'style-1' });
    
    // In the component:
    const styles = useMyComponentStyles();
    const componentClassName = styles.main;
 * ```
 *
 * **Lazy Evaluated Styles:**
 * ```ts
    const useMyComponentStyles = createStyleSheetHook(() => ({
        display: 'flex',
        gap: '1rem',
        ...children('p', {
            marginBlock: '1em',
        }),
    }), { id: 'style-2' });
    
    // In the component:
    const styles = useMyComponentStyles();
    const componentClassName = styles.main;
 * ```
 *
 * **Dynamic Imports for Styles:**
 * ```ts
    const useMyComponentStyles = createStyleSheetHook(async () => import('./my-style.js'), { id: 'style-3' });
    
    // In the component:
    const styles = useMyComponentStyles();
    const componentClassName = styles.main;
 * ```
 *
 * **Live Style Updates via Subscribable or Observables:**
 * ```ts
    const liveStyles = new Subject<CssStyleCollection>();
    const useMyComponentStyles = createStyleSheetHook(liveStyles, { id: 'style-4' });
    
    // In the component:
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
export const createStyleSheetHook  = (style: StyleSheetFactory, options?: ReactStyleSheetOptions & CssScopeOptions): () => CssScopeMap<'main'> => {
    return createStyleSheetsHook(
        transformScopedStyleSource(style, options), // Transforms the unscoped `style` into a `'main'`-scoped style.
        options
    );
};

/**
 * @deprecated Use `createStyleSheetHook` instead.
 */
export const dynamicStyleSheet  = createStyleSheetHook;
