// Cssfn:
import {
    // Lazy resolutions:
    type MaybeLazyDeferred,
}                           from '@cssfn/types'
import {
    // Cssfn properties:
    type CssStyleCollection,
    
    type CssClassName,
    
    type CssScopeName,
    type CssScopeList,
    type CssScopeMap,
}                           from '@cssfn/css-types'
import {
    generateId,
}                           from './utilities.js'

// Other libs:
import {
    // Subscriptions:
    type Subscribable,
    type Unsubscribable,
}                           from 'rxjs'



// Types:
export type StyleSheetsFactoryBase<TCssScopeName extends CssScopeName>  = MaybeLazyDeferred<CssScopeList<TCssScopeName> | null>
export type StyleSheetFactoryBase                                       = MaybeLazyDeferred<CssStyleCollection>

export type StyleSheetsFactory<TCssScopeName extends CssScopeName>      = /* static: */ StyleSheetsFactoryBase<TCssScopeName>  | /* live: */ Subscribable<StyleSheetsFactoryBase<TCssScopeName> | /* enabled|disabled: */ boolean>
export type StyleSheetFactory                                           = /* static: */ StyleSheetFactoryBase                  | /* live: */ Subscribable<StyleSheetFactoryBase                 | /* enabled|disabled: */ boolean>



// Style sheets:

/**
 * Configuration options for a stylesheet's behavior.
 */
export interface StyleSheetOptions {
    /**
     * A unique identifier for the stylesheet.
     * - Ensures uniqueness across all stylesheets.
     * - Used to generate a stable, unique class name for each scope.
     */
    id        ?: string
    
    /**
     * Determines whether the stylesheet is enabled.
     * - If `false`, the styles will not be applied to the DOM.
     * - If `prerender` is enabled, the `<style>` element exists in the DOM but remains disabled.
     * - Default: `true`.
     */
    enabled   ?: boolean
    
    
    
    /**
     * Specifies whether the stylesheet should be server-side rendered (SSR).
     * - If `false`, styles are **only generated on the client-side**.
     * - Default: `true`.
     */
    ssr       ?: boolean
    
    /**
     * Enables lazy client-side rendering.
     * - **First render:** Uses pre-rendered server-side styles instead of running expensive client-side rendering.
     * - **Subsequent renders:** Always performs full client-side rendering.
     * - Useful for performance optimization, particularly for large stylesheets.
     * - Default: `true`.
     */
    lazyCsr   ?: boolean
    
    /**
     * Forces prerendering even when the stylesheet is disabled.
     * - The `<style>` element exists but remains disabled.
     * - If the corresponding component enables the stylesheet, styles are **instantly applied** to the DOM.
     * - Default: `true`.
     */
    prerender ?: boolean
}

export type StyleSheetUpdatedCallback<in TCssScopeName extends CssScopeName> = (styleSheet: StyleSheet<TCssScopeName>, type: StyleSheetUpdateChangedType) => void;
export class StyleSheet<out TCssScopeName extends CssScopeName = CssScopeName> implements Required<StyleSheetOptions> {
    //#region Private properties
    // Configs:
    private readonly    _updatedCallback    : StyleSheetUpdatedCallback<TCssScopeName>
    private readonly    _options            : Required<StyleSheetOptions>
    
    
    
    // States:
    private /*mutable*/ _scopesFactory      : StyleSheetsFactory<TCssScopeName>
    private /*mutable*/ _scopesSubscription : Unsubscribable|undefined
    private /*mutable*/ _scopesLive         : StyleSheetsFactoryBase<TCssScopeName>
    
    
    
    // CSS classes:
    private readonly    _classes            : CssScopeMap<TCssScopeName>
    //#endregion Private properties
    
    
    
    //#region Constructors
    constructor(scopesFactory: StyleSheetsFactory<TCssScopeName>, updatedCallback: StyleSheetUpdatedCallback<TCssScopeName>, options?: StyleSheetOptions) {
        // Configs:
        this._updatedCallback    = updatedCallback;
        
        const {
            id        = '',
            enabled   = true,
            
            ssr       = true,
            lazyCsr   = true,
            prerender = true,
            
            ...restOptions
        } = options ?? {};
        
        const normalizedOptions : Required<StyleSheetOptions> = {
            ...restOptions,
            
            enabled,
            id,
            
            ssr,
            lazyCsr,
            prerender,
        };
        
        this._options            = normalizedOptions;
        
        
        
        // States:
        this._scopesFactory      = scopesFactory;
        this._scopesSubscription = undefined;
        this._scopesLive         = null;
        
        
        
        // CSS classes:
        const cachedScopeMap = {} as CssScopeMap<TCssScopeName>;
        this._classes  = new Proxy<CssScopeMap<TCssScopeName>>(cachedScopeMap, {
            get(cachedScopeMap: CssScopeMap<TCssScopeName>, scopeName: TCssScopeName|symbol): CssClassName|undefined {
                // Ignores non-string prop keys:
                if (typeof scopeName !== 'string') return undefined;
                
                
                
                // If already cached => return immediately:
                if (scopeName in cachedScopeMap) return cachedScopeMap[scopeName];
                
                
                
                // Compute stable unique class:
                const uniqueClass : CssClassName = generateId(id, scopeName);
                
                
                
                // update the cache & return:
                cachedScopeMap[scopeName] = uniqueClass;
                return uniqueClass;
            },
        });
        
        
        
        // CSS scopes:
        this.subscribeScopes(this._scopesFactory);
    }
    
    dispose() {
        // Cleanups:
        this.unsubscribeScopes();
    }
    //#endregion Constructors
    
    
    
    //#region Protected methods
    /**
     * Unsubscribes from the current scope factory subscription, if any.
     *
     * ## Purpose:
     * - Ensures proper cleanup by unsubscribing from previous subscriptions.
     * - Allows garbage collection (GC) to reclaim unused resources.
     */
    protected unsubscribeScopes() {
        this._scopesSubscription?.unsubscribe(); // Unsubscribe previous subscription (if any).
        this._scopesSubscription = undefined;    // Allow GC to collect.
    }
    
    /**
     * Subscribes to a new scopes factory and updates live scopes accordingly.
     *
     * ## Purpose:
     * - Ensures the latest scope factory is actively subscribed.
     * - If the provided factory is `Subscribable`, it resubscribes to track updates dynamically.
     * - If the factory is **not** `Subscribable`, the live scopes are updated once and remain static.
     *
     * ## Behavior:
     * - **Unsubscribes from previous subscription** before re-subscribing.
     * - **Checks if the provided factory is `Subscribable`**, then listens for updates.
     * - If the factory emits:
     *   - A `boolean`: Updates the `enabled` state and triggers `'enabledChanged'` notification.
     *   - A scope factory: Updates `this._scopesLive` and triggers `'scopesChanged'` notification.
     *
     * @param scopesFactory - The new scopes factory to subscribe to.
     */
    protected subscribeScopes(scopesFactory: StyleSheetsFactory<TCssScopeName>): void {
        // Cleanup previous subscription:
        this.unsubscribeScopes();
        
        
        
        if (scopesFactory && ('subscribe' in scopesFactory)) {
            // Live update if Subscribable:
            this._scopesSubscription = (scopesFactory satisfies Subscribable<unknown>).subscribe({
                next: (update) => {
                    if (typeof update === 'boolean') {
                        // Update the enabled state:
                        const newEnabled = update satisfies boolean; // Verify the type must be boolean.
                        if (this._options.enabled === newEnabled) return;     // Still the same state => no need to update.
                        this._options.enabled = newEnabled satisfies boolean; // Change the state.
                        this.notifyUpdated('enabledChanged');                 // Trigger update notification.
                    }
                    else {
                        // Update the scopes:
                        const newScopes = update satisfies StyleSheetsFactoryBase<TCssScopeName>; // Verify the type must be StyleSheetsFactoryBase.
                        if (this._scopesLive === newScopes) return;           // Still the same scopes => no need to update.
                        this._scopesLive = newScopes;                         // Change the scopes.
                        this.notifyUpdated('scopesChanged');                  // Trigger update notification.
                    } // if
                },
            });
        }
        else {
            // Update once if not Subscribable:
            this._scopesLive = scopesFactory satisfies StyleSheetsFactoryBase<TCssScopeName>; // Verify the type must be StyleSheetsFactoryBase.
        } // if
    }
    
    /**
     * Triggers an update notification for stylesheet changes.
     *
     * ## Purpose:
     * - Notifies subscribers about stylesheet updates.
     * - Signals changes to either **enabled state** or **scope definitions**.
     *
     * @param {StyleSheetUpdateChangedType} type - The type of update that occurred.
     */
    protected notifyUpdated(type: StyleSheetUpdateChangedType): void {
        this._updatedCallback(this, type); // Notify subscribers about the update.
    }
    //#endregion Protected methods
    
    
    
    //#region Public properties
    /**
     * Retrieves the unique identifier for the stylesheet.
     * - This ID ensures uniqueness across all stylesheets.
     * - Used to generate a stable, unique class name for each scope.
     */
    get id() {
        return this._options.id;
    }
    
    /**
     * Indicates whether the stylesheet is enabled.
     * - If `false`, styles will not be applied to the DOM.
     * - If `prerender` is enabled, the `<style>` element exists in the DOM but remains disabled.
     */
    get enabled() {
        return this._options.enabled;
    }
    
    
    
    /**
     * Determines if the stylesheet should be server-side rendered (SSR).
     * - If `false`, styles are **only generated on the client-side**.
     */
    get ssr() {
        return this._options.ssr;
    }
    
    /**
     * Controls lazy client-side rendering.
     * - **First render:** Uses pre-rendered server-side styles instead of running expensive client-side rendering.
     * - **Subsequent renders:** Always performs full client-side rendering.
     */
    get lazyCsr() {
        return this._options.lazyCsr;
    }
    
    /**
     * Determines whether the stylesheet should be prerendered.
     * - If enabled, the `<style>` element exists in the DOM but remains disabled.
     * - When the corresponding component enables the stylesheet, styles are instantly applied.
     */
    get prerender() {
        return this._options.prerender;
    }
    
    /**
     * Retrieves the mapping of scoped style definitions for CSS-in-JS rendering.
     *
     * ## Purpose:
     * - Returns CSS-in-JS expressions that define styles dynamically or statically.
     * - Supports both **synchronous and asynchronous style generation**.
     *
     * ## Example Output:
     * ```ts
     * return {
     *   header: async () => style({
     *      ...(await usesMyMixin()),
     *      display: 'grid',
     *   }),
     *   footer: style({
     *      color: 'blue',
     *   }),
     * }
     * ```
     *
     * - Each key corresponds to a **style scope**.
     * - If the value is **async**, it dynamically applies computed styles.
     * - If the value is **static**, it applies predefined styles.
     */
    get scopes() {
        return this._scopesLive;
    }
    
    /**
     * Retrieves the mapping of generated class names for scoped styles.
     *
     * ## Purpose:
     * - Provides unique class names for each defined scope.
     * - Used to apply consistent styles across components.
     *
     * ## Example Output:
     * ```ts
     * return {
     *   header: 'header-unique123',
     *   footer: 'footer-unique567',
     * }
     * ```
     *
     * - Each key corresponds to a **style scope**, and the value is its **generated class name**.
     */
    get classes() {
        return this._classes;
    }
    //#endregion Public properties
    
    
    
    //#region Public methods
    /**
     * Updates the current `StyleSheet` instance by cloning scoped styles from another instance.
     *
     * ## Purpose:
     * - Ensures the **style registry maintains a stable reference** to the same `StyleSheet` object.
     * - Prevents unnecessary instance replacements during **hot swap reloading** or other dynamic style updates.
     *
     * ## Behavior:
     * - **If the factory is unchanged**, cloning is skipped to avoid redundant updates.
     * - **If the factory is different**, it:
     *   1️⃣ Updates `this._scopesFactory` with the new factory.
     *   2️⃣ Calls `subscribeScopes()`:
     *      - **If the factory is `Subscribable`**, it unsubscribes from the previous subscription and resubscribes to the new factory.
     *      - **If the factory is not `Subscribable`**, `this._scopesLive` is updated once.
     * - **Mutates the existing object instead of creating a new instance**, preserving continuity for style registry listeners.
     *
     * @param {StyleSheet<TCssScopeName>} source - The source stylesheet instance from which to clone scoped styles.
     */
    cloneFrom(source: StyleSheet<TCssScopeName>): void {
        if (this._scopesFactory === source._scopesFactory) return; // Still the same factory => no need to update.
        this._scopesFactory = source._scopesFactory;               // Change the factory.
        this.subscribeScopes(this._scopesFactory);                 // Listens for scoped style definition changes (if the provided factory is `Subscribable`).
    }
    //#endregion Public methods
}



// Stylesheet events:
export type      StyleSheetUpdateChangedType = 'enabledChanged' | 'scopesChanged'
export type      StyleSheetUpdateType        = 'added' | 'existing' | StyleSheetUpdateChangedType

/**
 * Represents an event triggered by a `StyleSheet` update.
 *
 * @template TCssScopeName The type of CSS scope names.
 */
export interface StyleSheetUpdateEvent<out TCssScopeName extends CssScopeName> {
    /**
     * The updated stylesheet instance.
     */
    styleSheet : StyleSheet<TCssScopeName>
    
    /**
     * The type of update that occurred.
     */
    type       : StyleSheetUpdateType
}
