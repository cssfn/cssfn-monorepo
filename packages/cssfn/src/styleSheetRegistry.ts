// Cssfn:
import {
    // Cssfn properties:
    type CssScopeName,
}                           from '@cssfn/css-types'
import {
    // Style sheets:
    type StyleSheet,
    
    
    
    // Stylesheet events:
    type StyleSheetUpdateChangedType,
    type StyleSheetUpdateEvent,
}                           from './styleSheets.js'

// Other libs:
import {
    // Subscriptions:
    type Unsubscribable,
    Subject,
}                           from 'rxjs'
import {
    // Tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'



// Utilities:
const isClientSide : boolean = isBrowser || isJsDom;



// Stylesheet registry:
/**
 * **Global Stylesheet Registry**
 *
 * ## Purpose:
 * - Manages registered stylesheets globally.
 * - Ensures **consistent stylesheet state** across components and modules.
 * - **Prevents memory leaks** by ensuring stylesheets are registered **only once per module load**.
 */
class StyleSheetRegistry {
    //#region Private properties
    /**
     * Collection of registered stylesheets.
     * - Uses `Map<string | symbol, StyleSheet<CssScopeName>>` for efficient lookups.
     * - Preserves **insertion order** for predictable stylesheet registration.
     */
    private _styleSheets : Map<string | symbol, StyleSheet<CssScopeName>>
    
    /**
     * Event stream for notifying subscribers about stylesheet updates.
     */
    private _subscribers : Subject<StyleSheetUpdateEvent<CssScopeName>>
    //#endregion Private properties
    
    
    
    //#region Constructors
    constructor() {
        this._styleSheets = new Map<string | symbol, StyleSheet<CssScopeName>>();
        this._subscribers = new Subject<StyleSheetUpdateEvent<CssScopeName>>();
    }
    //#endregion Constructors
    
    
    
    //#region Public methods
    /**
     * Adds a new stylesheet to the registry.
     *
     * ## Behavior:
     * - If the stylesheet **already exists (same `id`)**, it **mutates** the existing instance instead of creating a duplicate.
     * - Otherwise, it **registers the new stylesheet** into the collection.
     * - **Anonymous stylesheets** (empty `id`) are tracked using `Symbol()` for uniqueness.
     *
     * ## Important:
     * - **Must be called once per top-level module** using:
     *   - `styleSheet()`
     *   - `styleSheets()`
     *   - `dynamicStyleSheet()`
     *   - `dynamicStyleSheets()`
     * - This prevents **repeated registrations** during module reloads and avoids **memory leaks**.
     *
     * @param {StyleSheet<CssScopeName>} newStyleSheet - The stylesheet to add or update.
     * @returns {StyleSheet<CssScopeName>} The registered stylesheet instance.
     */
    add(newStyleSheet: StyleSheet<CssScopeName>): StyleSheet<CssScopeName> {
        // Check if an existing stylesheet with the same ID exists:
        const newStyleSheetId    = newStyleSheet.id;
        const existingStyleSheet = (
            newStyleSheetId // Has ID.
            ? this._styleSheets.get(newStyleSheetId) // Get the stylesheet by ID.
            : undefined // Always not found for empty-string ID.
        );
        
        
        
        if (!existingStyleSheet) {
            // Register new stylesheet:
            this._styleSheets.set(
                newStyleSheetId ? newStyleSheetId : Symbol(), // Use either the given ID or the anonymous key (only generates Symbol() if needed).
                newStyleSheet
            );
        }
        else {
            // Mutate existing stylesheet instead of replacing it:
            existingStyleSheet.cloneFrom(newStyleSheet);
            
            
            
            // Return modified stylesheet:
            return existingStyleSheet;
        } // if
        
        
        
        // Notify subscribers about the addition:
        this._subscribers.next({
            styleSheet : newStyleSheet,
            type       : 'added',
        });
        
        
        
        // Return new stylesheet:
        return newStyleSheet;
    }
    
    /**
     * Subscribes to stylesheet updates.
     *
     * ## Behavior:
     * - **Immediately notifies** the subscriber about all **existing registered stylesheets** upon subscription.
     * - Continues **listening for future stylesheet updates** and forwards them to the subscriber.
     *
     * @param subscriber - A callback function to handle stylesheet update events.
     * @returns An `Unsubscribable` object, allowing the subscriber to unsubscribe later.
     */
    subscribe(subscriber: (event: StyleSheetUpdateEvent<CssScopeName>) => void): Unsubscribable {
        // Notify subscriber about previously registered stylesheets:
        for (const styleSheet of Array.from(this._styleSheets.values())) {
            subscriber({
                styleSheet,
                type : 'existing',
            });
        } // for
        
        
        
        // Listen for future updates:
        return this._subscribers.subscribe({
            next: (update) => {
                subscriber(update); // Ensures proper `this` binding in third-party use cases.
            },
        });
    }
    //#endregion Public methods
    
    
    
    //#region Public callbacks
    /**
     * Handles updates from registered stylesheets.
     *
     * ## Purpose:
     * - Notifies subscribers whenever a stylesheet is modified.
     * - Tracks updates such as **enabled state changes** or **scope modifications**.
     *
     * @param {StyleSheet<CssScopeName>} styleSheet - The updated stylesheet.
     * @param {StyleSheetUpdateChangedType} type - The type of update that occurred.
     */
    handleStyleSheetUpdated = (styleSheet: StyleSheet<CssScopeName>, type: StyleSheetUpdateChangedType): void => {
        // Notify subscribers about the modification:
        this._subscribers.next({
            styleSheet,
            type,
        });
    }
    //#endregion Public callbacks
}
export {
    type StyleSheetRegistry, // Only export the type, NOT the actual class:
}



/**
 * **Global Stylesheet Registry**
 *
 * ## Purpose:
 * - Serves as a **centralized registry** for managing stylesheets.
 * - Ensures **consistent registration and updates** across components and modules.
 * - Prevents **duplicate stylesheet instances** by tracking existing stylesheets.
 * - Optimized for **memory efficiency**, avoiding unnecessary stylesheet recreation.
 *
 * ## Behavior:
 * - Accessible **globally** within the module.
 * - Used internally by:
 *   - `styleSheet()`, `styleSheets()`
 *   - `createStyleSheetsHook()`, `createStyleSheetHook()`
 *   - `createServerStyleSheetsHook()`, `createServerStyleSheetHook()`
 * - Supports **hot module reloads** without redundant instantiation.
 *
 * ## Usage Example:
 * ```ts
 * import { styleSheetRegistry } from './styleSheetRegistry';
 * styleSheetRegistry.add(myStyleSheet);
 * ```
 */
// export const styleSheetRegistry = new StyleSheetRegistry();
export const styleSheetRegistry = (
    isClientSide
    
    // Client-side (browser): Create a new registry for local styles.
    ? new StyleSheetRegistry()
    
    // Server-side: Unify registry across SSR and client-side rendering during SSR.
    : (
        ('__styleSheetRegistry' in globalThis)
        ? (globalThis as any).__styleSheetRegistry as StyleSheetRegistry
        : ((globalThis as any).__styleSheetRegistry = new StyleSheetRegistry())
    )
);
