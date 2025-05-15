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
 * Configuration options for `StyleSheet`'s behavior.
 */
export interface StyleSheetOptions {
    /**
     * A unique identifier for the stylesheet.
     * - Ensures uniqueness across all stylesheets.
     * - Used to generate a stable, unique class name for each scope.
     */
    id        ?: string
    
    /**
     * Controls whether the stylesheet is active.
     *
     * - If `true`, styles are applied to the DOM.
     * - If `false`, styles are not applied to the DOM. However, if `prerender` is enabled, the `<style>` element exists but remains disabled.
     * - If `'auto'`, styles start disabled and automatically activate when any property in `StyleSheet.classes` is accessed.
     * - **Default:** `'auto'`.
     */
    enabled   ?: boolean | 'auto'
    
    
    
    /**
     * Specifies whether the stylesheet should be server-side rendered (SSR).
     * - If `true`, styles are generated on the server and included in the initial HTML.
     * - If `false`, styles are **only generated on the client-side**.
     * - Useful for reducing client-side computation and improving first render performance.
     * - **Default:** `true`.
     */
    ssr       ?: boolean
    
    /**
     * Enables lazy client-side rendering.
     * - **On first render:** Uses pre-rendered server-side styles instead of performing expensive client-side computations.
     * - **On subsequent renders:** Always computes styles dynamically on the client.
     * - Optimizes performance, particularly for large or frequently updated stylesheets.
     * - **Default:** `true`.
     */
    lazyCsr   ?: boolean
    
    /**
     * Forces prerendering even when the stylesheet is disabled.
     * - The `<style>` element exists but remains inactive until enabled.
     * - If the corresponding component activates the stylesheet, styles are **instantly applied** to the DOM.
     * - Prevents expensive re-insertion of styles when re-enabled.
     * - **Default:** `true`.
     */
    prerender ?: boolean
}

/**
 * Callback function triggered when a stylesheet's state or content is updated.
 *
 * @template TCssScopeName - The name of the CSS scope associated with the stylesheet.
 * @param styleSheet - The stylesheet instance that was updated.
 * @param type - The type of update that occurred.
 */
export type StyleSheetUpdatedCallback<in TCssScopeName extends CssScopeName> = (styleSheet: StyleSheet<TCssScopeName>, type: StyleSheetUpdateChangedType) => void;

/**
 * Represents a dynamically managed stylesheet.
 *
 * - Supports scoped styling for different components.
 * - Integrates auto-enabled behavior based on style access.
 * - Provides server-side rendering and lazy client-side rendering optimizations.
 *
 * @template TCssScopeName - The name of the CSS scope applied to this stylesheet.
 */
export class StyleSheet<out TCssScopeName extends CssScopeName = CssScopeName> implements Required<StyleSheetOptions> {
    //#region Private properties
    // Configs:
    private readonly    _updatedCallback    : StyleSheetUpdatedCallback<TCssScopeName>
    private readonly    _options            : Readonly<Required<StyleSheetOptions>>
    
    
    
    // States:
    private /*mutable*/ _enabled            : boolean
    
    private /*mutable*/ _scopesFactory      : StyleSheetsFactory<TCssScopeName>
    private /*mutable*/ _scopesSubscription : Unsubscribable|undefined
    private /*mutable*/ _scopesLive         : StyleSheetsFactoryBase<TCssScopeName> | undefined
    
    
    
    // CSS classes:
    private readonly    _privateClasses     : CssScopeMap<TCssScopeName>
    private readonly    _classes            : CssScopeMap<TCssScopeName>
    //#endregion Private properties
    
    
    
    //#region Constructors
    constructor(scopesFactory: StyleSheetsFactory<TCssScopeName>, updatedCallback: StyleSheetUpdatedCallback<TCssScopeName>, options?: StyleSheetOptions) {
        // Configs:
        this._updatedCallback    = updatedCallback;
        
        const {
            id        = '',
            enabled   = 'auto',
            
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
        this._enabled            = (
            (normalizedOptions.enabled === 'auto')
            ? false                     // Auto means initially disabled, waiting for activation.
            : normalizedOptions.enabled // Use the defined static state.
        ),
        this._scopesFactory      = scopesFactory;
        this._scopesSubscription = undefined;
        this._scopesLive         = undefined; // Initially set to `undefined`, meaning no updates have occurred yet.
        
        
        
        // CSS Class Management with Scoped Hashing:
        const cachedScopeMap = {} as CssScopeMap<TCssScopeName>;
        
        /**
         * Retrieves a stable, hashed class name for the given scope.
         * - Automatically enables stylesheets when `autoEnable` is `true`.
         * - Ensures consistent hashing without redundant recomputations.
         */
        const getHashedClassname = (scopeName: TCssScopeName | symbol, autoEnable: boolean = false): CssClassName | undefined => {
            // Ignore non-string property keys (prevent unintended lookups):
            if (typeof scopeName !== 'string') return undefined;
            
            
            
            // Conditionally activate stylesheets if auto mode is enabled:
            if (autoEnable) this.triggerAutoEnable();
            
            
            
            // Return cached class if already generated:
            if (scopeName in cachedScopeMap) return cachedScopeMap[scopeName];
            
            
            
            // Generate and cache a stable, unique class name:
            const uniqueClass : CssClassName = generateId(id, scopeName);
            
            
            
            // Store the computed class in the cache & return:
            cachedScopeMap[scopeName] = uniqueClass;
            return uniqueClass;
        };
        
        /**
         * Stores hashed class mappings without triggering stylesheet activation.
         * - Used for cases where class names need to be accessed passively.
         */
        this._privateClasses = new Proxy<CssScopeMap<TCssScopeName>>(cachedScopeMap, {
            get: (_cachedScopeMap: CssScopeMap<TCssScopeName>, scopeName: TCssScopeName | symbol): CssClassName | undefined => {
                return getHashedClassname(scopeName, false);
            },
        });
        
        /**
         * Provides public access to hashed class names while ensuring stylesheets activate dynamically.
         * - When accessed, stylesheets are triggered if in 'auto' mode.
         */
        this._classes  = new Proxy<CssScopeMap<TCssScopeName>>(cachedScopeMap, {
            get: (_cachedScopeMap: CssScopeMap<TCssScopeName>, scopeName: TCssScopeName | symbol): CssClassName | undefined => {
                return getHashedClassname(scopeName, true);
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
                        this.enabled = newEnabled;
                    }
                    else {
                        // Update the scopes:
                        const newScopes = update satisfies StyleSheetsFactoryBase<TCssScopeName>; // Verify the type must be StyleSheetsFactoryBase.
                        if (this._scopesLive === newScopes) return;                  // Still the same scopes => no need to update.
                        const isSubsequentUpdate = (this._scopesLive !== undefined); // Check if this is a subsequent update.
                        this._scopesLive = newScopes;                                // Change the scopes.
                        if (isSubsequentUpdate) this.notifyUpdated('scopesChanged'); // Trigger update notification only if this isn't the initial update.
                    } // if
                },
            });
            
            
            
            // If `subscribe()` doesn't trigger an immediate update, set `_scopesLive` to `null`,
            // marking the next update as a subsequent one:
            if (this._scopesLive === undefined) this._scopesLive = null;
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
    
    /**
     * Activates the stylesheet if it is currently set to `'auto'`.
     * Ensures styles are applied dynamically when required.
     */
    protected triggerAutoEnable() {
        if (this._options.enabled === 'auto') {
            this.enabled = true; // Activate the stylesheet automatically.
        } // if
    }
    
    /**
     * Resets the stylesheet to its initial state if set to `'auto'`.
     * Returns it to a disabled state for controlled reactivation.
     */
    protected resetAutoEnable() {
        if (this._options.enabled === 'auto') {
            this.enabled = false; // Reset to initial disabled state.
        } // if
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
     * Gets whether the stylesheet is enabled.
     *
     * - Returns `true` if styles are applied to the DOM.
     * - Returns `false` if styles are disabled. If `prerender` is enabled, the `<style>` element exists but remains inactive.
     */
    get enabled() {
        return this._enabled;
    }
    
    /**
     * Sets whether the stylesheet is enabled.
     *
     * - Dynamically updates the stylesheet state.
     * - If `true`, styles are applied to the DOM.
     * - If `false`, styles are not applied to the DOM. However, if `prerender` is enabled, the `<style>` element exists but remains disabled.
     * - Triggers an `enabledChanged` update notification when modified.
     *
     * @param newEnabled - The new enabled state.
     */
    protected set enabled(newEnabled: boolean) {
        if (this._enabled === newEnabled) return;                     // No change, skip update.
        this._enabled = newEnabled satisfies boolean;                 // Apply state change.
        const isSubsequentUpdate = (this._scopesLive !== undefined);  // Check if this is a subsequent update.
        if (isSubsequentUpdate) this.notifyUpdated('enabledChanged'); // Trigger update notification only if this isn't the initial update.
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
     * - **On first render:** Uses pre-rendered server-side styles instead of performing expensive client-side computations.
     * - **On subsequent renders:** Always computes styles dynamically on the client.
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
    get scopes(): StyleSheetsFactoryBase<TCssScopeName> {
        return this._scopesLive ?? null;
    }
    
    /**
     * Retrieves the mapping of generated class names for scoped styles.
     *
     * ## Behavior:
     * - **Automatically enables stylesheets when accessed.**
     * - Provides unique class names for each defined scope.
     * - Ensures styles remain consistent across components.
     *
     * ## Example Output:
     * ```ts
     * return {
     *   header: 'header-unique123',
     *   footer: 'footer-unique567',
     * }
     * ```
     * - Each key represents a **style scope**, and the value is its **hashed class name**.
     * - Accessing a class name **triggers stylesheet activation**, ensuring styles are applied.
     */
    get classes() {
        return this._classes;
    }
    
    /**
     * Internal mapping of generated class names for scoped styles **without auto-enabling stylesheets**.
     *
     * ## Behavior:
     * - **Does NOT enable stylesheets when accessed.**
     * - Provides unique class names for each defined scope.
     * - Used by internal render logic where styles should remain inactive unless explicitly triggered.
     *
     * ## Example Output:
     * ```ts
     * return {
     *   header: 'header-unique123',
     *   footer: 'footer-unique567',
     * }
     * ```
     * - Each key represents a **style scope**, and the value is its **hashed class name**.
     * - Unlike `classes`, reading these **does not trigger stylesheet activation**.
     */
    get privateClasses() {
        return this._privateClasses;
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
