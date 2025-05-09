// Cssfn:
import {
    // Promises:
    type MaybePromise,
    
    
    
    // Lazies:
    type Lazy,
    
    
    
    // Modules:
    type MaybeModuleDefault,
    
    
    
    // Lazy resolutions:
    type MaybeDeferred,
}                           from '@cssfn/types'
import {
    // Cssfn properties:
    type CssStyleCollection,
    
    type CssScopeName,
    type CssScopeOptions,
    type CssScopeEntry,
    type CssScopeList,
    type CssScopeMap,
}                           from '@cssfn/css-types'
import {
    // Types:
    type StyleSheetsFactoryBase,
    type StyleSheetsFactory,
    type StyleSheetFactory,
    
    
    
    // Style sheets:
    type StyleSheetOptions,
    StyleSheet,
}                           from './styleSheets.js'
import {
    styleSheetRegistry,
}                           from './styleSheetRegistry.js'

// Other libs:
import {
    // Subscriptions:
    type Subscribable,
    type Unsubscribable,
}                           from 'rxjs'



// Stylesheet declarators:

/**
 * Declares scoped stylesheets.
 *
 * - Defines multiple scoped styles, each mapped to a uniquely stable CSS class name.
 * - Returns a `CssScopeMap<>` object containing properties mapped to their corresponding generated class names.
 * - **IMPORTANT:** Must be called at the **top-level module** to ensure the stylesheet registration occurs **only once**.
 *
 * ## Usage Examples:
 *
 * **Static Style Definitions:**
 * ```
    const styles = styleSheets([
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
    
    const headerClassName = styles.header;
    const footerClassName = styles.footer;
 * ```
 *
 * **Lazy Evaluated Styles:**
 * ```
    const styles = styleSheets(() => [
        scope('header', {
            display: 'grid',
        }),
        scope('footer', {
            display: 'flex',
        }),
    ], { id: 'style-2' });
    
    const headerClassName = styles.header;
    const footerClassName = styles.footer;
 * ```
 *
 * **Dynamic Imports for Styles:**
 * ```
    const styles = styleSheets(async () => import('./my-styles.js'), { id: 'style-3' });
    
    const headerClassName = styles.header;
    const footerClassName = styles.footer;
 * ```
 *
 * **Live Style Updates via Subscribable or Observables:**
 * ```
    const liveStyles = new Subject<CssScopeList<'header' | 'footer'> | null>();
    const styles = styleSheets(liveStyles, { id: 'sheet4' });
    
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
 * @param scopeSource - A source defining scoped styles, which may be static, lazy, dynamic, or subscribable (observable).
 * @param options - Optional configuration settings for stylesheet registration.
 * @returns A `CssScopeMap<>` containing stable class names mapped to their respective scopes.
 */
export const styleSheets = <TCssScopeName extends CssScopeName>(scopeSource: StyleSheetsFactory<TCssScopeName>, options?: StyleSheetOptions): CssScopeMap<TCssScopeName> => {
    // Register the stylesheet into the global stylesheet registry:
    const registeredStyleSheet = styleSheetRegistry.add(new StyleSheet<TCssScopeName>(
        scopeSource,
        styleSheetRegistry.handleStyleSheetUpdated, // Listen for updates from registered stylesheets.
        options
    ));
    
    
    
    // Retrieve the mapping of generated class names for scoped styles:
    return registeredStyleSheet.classes;
};


/**
 * Declares an anonymous scoped stylesheet for simple usage.
 *
 * - The scope name is **intrinsically set to `'main'`**, ensuring a single, stable CSS class name.
 * - Returns a `CssScopeMap<'main'>`, where the `'main'` property maps to the corresponding generated class name.
 * - **IMPORTANT:** Must be called at the **top-level module** to ensure the stylesheet registration occurs **only once**.
 *
 * ## Usage Examples:
 *
 * **Static Style Definitions:**
 * ```
    const styles = styleSheet({
        display: 'grid',
        gap: '1rem',
    }, { id: 'style-1' });
    
    const componentClassName = styles.main;
 * ```
 *
 * **Lazy Evaluated Styles:**
 * ```
    const styles = styleSheet(() => ({
        display: 'flex',
        gap: '1rem',
        ...children('p', {
            marginBlock: '1em',
        }),
    }), { id: 'style-2' });
    
    const componentClassName = styles.main;
 * ```
 *
 * **Dynamic Imports for Styles:**
 * ```
    const styles = styleSheet(async () => import('./my-style.js'), { id: 'style-3' });
    
    const componentClassName = styles.main;
 * ```
 *
 * **Live Style Updates via Subscribable or Observables:**
 * ```
    const liveStyles = new Subject<CssStyleCollection>();
    const styles = styleSheet(liveStyles, { id: 'sheet4' });
    
    const componentClassName = styles.main;
    
    // Dynamically update styles in the future:
    liveStyles.next({
        display: 'grid',
        gap: '1rem',
    });
 * ```
 *
 * @param style - A style definition source, which may be static, lazy, dynamic, or subscribable (observable).
 * @param options - Optional configuration settings for stylesheet registration.
 * @returns A `CssScopeMap<'main'>`, where `'main'` maps to its uniquely generated class name.
 */
export const styleSheet  = (style: StyleSheetFactory, options?: StyleSheetOptions & CssScopeOptions): CssScopeMap<'main'> => {
    // Register the stylesheet into the global stylesheet registry:
    return styleSheets(
        transformScopedStyleSource(style, options), // Transforms the unscoped `style` into a `'main'`-scoped style.
        options
    );
};



/**
 * Resolves a single scoped style definition for the `'main'` scope.
 *
 * - Converts an unscoped `CssStyleCollection` into a scoped style entry.
 * - Ensures the generated scope follows the expected format for further processing.
 *
 * @param styleSource - The collection of CSS styles to apply.
 * @param options - Optional settings for stylesheet registration.
 * @returns A `CssScopeList<'main'>` containing a single scoped entry.
 */
const resolveMainScope     = (styleSource: CssStyleCollection, options: (StyleSheetOptions & CssScopeOptions) | undefined): CssScopeList<'main'> => {
    return [
        ['main', styleSource, options] satisfies CssScopeEntry<'main'>, // Single scoped style entry.
    ] satisfies CssScopeList<'main'>;
};

/**
 * Resolves a static style source into a `'main'` scoped entry.
 *
 * - If the source contains a `default` import, it extracts the default value and converts it into a structured scope format.
 * - Converts module-based or direct style definitions into a structured scope format.
 * - Ensures compatibility with standard CSS processing pipelines.
 *
 * @param styleSource - The module or object containing CSS style definitions.
 * @param options - Optional configuration settings for stylesheet registration.
 * @returns A `CssScopeList<'main'>` containing the resolved scoped style entry.
 */
const resolveStaticScope   = (styleSource: MaybeModuleDefault<CssStyleCollection>, options: (StyleSheetOptions & CssScopeOptions) | undefined): CssScopeList<'main'> => {
    // Validate and normalize style source:
    if (!styleSource || (typeof styleSource !== 'object') || !('default' in styleSource)) return resolveMainScope(styleSource, options);
    
    
    
    // Directly returns the input:
    return resolveMainScope(styleSource.default, options);
};

/**
 * Resolves a lazily evaluated or static style source into a `'main'` scoped entry.
 *
 * - Ensures lazy style definitions remain **deferred** until explicitly invoked.
 * - Converts static values immediately for direct scope resolution.
 *
 * @param styleSource - The lazy or static style source containing CSS definitions.
 * @param options - Optional configuration settings for stylesheet registration.
 * @returns A `CssScopeList<'main'>` if resolved immediately, or a `Lazy<Promise<CssScopeList<'main'>>>` for deferred resolution.
 */
const resolveLazyScope     = (styleSource: Lazy<MaybeDeferred<CssStyleCollection>> | MaybeModuleDefault<CssStyleCollection>, options: (StyleSheetOptions & CssScopeOptions) | undefined): CssScopeList<'main'> | Lazy<Promise<CssScopeList<'main'>>> => {
    // Handle lazy style source:
    if (typeof styleSource === 'function') {
        // Return a deferred lazy function to ensure lazy evaluation remains intact.
        // Prevents accidental execution of `styleSource` before render time.
        const lazyPromiseStyleSource : Lazy<Promise<CssScopeList<'main'>>> = async (): Promise<CssScopeList<'main'>> => {
            const resolved = await styleSource(); // Lazily invoked in the future.
            return resolveMainScope(resolved, options);
        };
        
        return lazyPromiseStyleSource satisfies StyleSheetsFactory<'main'>;
    } // if
    
    
    
    // Convert immediately for static values:
    return resolveStaticScope(styleSource, options);
};

/**
 * Resolves a deferred style source into a `'main'` scoped entry.
 *
 * - Handles **promised style sources** by returning a lazy function that defers execution until needed.
 * - Converts static values immediately for direct scope resolution.
 *
 * @param styleSource - A style source that may be **static or a Promise resolving to a CSS collection**.
 * @param options - Optional configuration settings for stylesheet registration.
 * @returns A `CssScopeList<'main'>` if resolved immediately, or a `Lazy<Promise<CssScopeList<'main'>>>` for deferred evaluation.
 */
const resolveDeferredScope = (styleSource: MaybePromise<MaybeModuleDefault<CssStyleCollection>>, options: (StyleSheetOptions & CssScopeOptions) | undefined): CssScopeList<'main'> | Lazy<Promise<CssScopeList<'main'>>> => {
    // Handle promised style source:
    if (styleSource instanceof Promise) {
        // Return a deferred promise wrapped in a lazy function, ensuring lazy evaluation remains intact.
        // Prevents accidental execution of a promise before the render process.
        const lazyPromiseStyleSource : Lazy<Promise<CssScopeList<'main'>>> = async (): Promise<CssScopeList<'main'>> => {
            const resolved = await styleSource; // Lazily awaited in the future.
            return resolveMainScope(resolved, options);
        };
        
        return lazyPromiseStyleSource satisfies StyleSheetsFactory<'main'>;
    } // if
    
    
    
    // Convert immediately for static values:
    return resolveStaticScope(styleSource, options);
};

/**
 * Transforms an unscoped `styleSource` into a `'main'`-scoped style.
 *
 * - Handles **lazy, promised, and live-updated style sources**.
 * - Ensures all styles are converted into a structured `'main'` scoped format.
 * - Prevents unintended execution of lazy or deferred styles before the render process.
 *
 * @param styleSource - A style source that may be **static, lazy, promised, or live-updated**.
 * @param options - Optional configuration settings for stylesheet registration.
 * @returns A `StyleSheetsFactory<'main'>` representing the transformed scoped style.
 */
export const transformScopedStyleSource = (styleSource: StyleSheetFactory, options?: StyleSheetOptions & CssScopeOptions): StyleSheetsFactory<'main'> => {
    // Handle live style source:
    if (styleSource && (typeof styleSource === 'object') && ('subscribe' in styleSource)) {
        const liveProxiedStyleSource : Subscribable<StyleSheetsFactoryBase<'main'>> = {
            subscribe: (observer): Unsubscribable => {
                // Listen for updates from `styleSource` and proxy them as structured scoped entries:
                const subscription = styleSource.subscribe({
                    next: (originalUpdate) => {
                        // Ensure the observer is actively listening:
                        if (!observer.next) return;
                        
                        
                        
                        // Handle promised style source:
                        if (originalUpdate instanceof Promise) {
                            const scopedUpdate = resolveDeferredScope(originalUpdate, options);
                            observer.next(scopedUpdate);
                            return; // Return early after handling.
                        } // if
                        
                        
                        
                        // Resolve static, lazy, or immediately known values:
                        const scopedUpdate = resolveLazyScope(originalUpdate, options);
                        observer.next(scopedUpdate);
                    },
                });
                
                
                
                // Expose an interface to stop listening for further proxied updates:
                return {
                    unsubscribe: () => {
                        subscription.unsubscribe(); // Ensures proper `this` binding in third-party use cases.
                    },
                } satisfies Unsubscribable;
            },
        };
        
        return liveProxiedStyleSource satisfies StyleSheetsFactory<'main'>;
    } // if
    
    
    
    // Handle promised style source:
    if (styleSource instanceof Promise) {
        return resolveDeferredScope(styleSource, options);
    } // if
    
    
    
    // Resolve static, lazy, or immediately known values:
    return resolveLazyScope(styleSource, options);
};
