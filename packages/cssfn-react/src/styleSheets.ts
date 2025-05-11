'use client' // This module belongs to the client-side bundle but can be imported into a server-side module, meaning it relies on client-side execution.

// React:
import {
    // Hooks:
    useRef    as _useRef,
    useEffect as _useEffect,
}                           from 'react'

// Cssfn:
import {
    // Cssfn properties:
    type CssClassName,
    
    type CssScopeName,
    type CssScopeMap,
}                           from '@cssfn/css-types'
import {
    // Types:
    type StyleSheetsFactory,
    
    
    
    // Style sheets:
    type StyleSheetOptions,
    type StyleSheetUpdatedCallback,
    StyleSheet,
}                           from '@cssfn/cssfn'



// Style sheets:

/**
 * Configuration options for `ReactStyleSheet`'s behavior.
 *
 * - Extends `StyleSheetOptions` to integrate React-specific lifecycle management.
 * - Tracks component usage to automatically enable or disable stylesheets.
 * - Optimizes performance by delaying stylesheet deactivation.
 */
export interface ReactStyleSheetOptions extends StyleSheetOptions {
    /**
     * Automatically disables the stylesheet if no components are using it within the specified delay (in milliseconds).
     *
     * - If `0`, the stylesheet is disabled **immediately** when no components are using it.
     * - If greater than `0`, the disable process is **delayed** for the specified duration.
     * - A very small value (e.g., `0.001`) defers deactivation to the next macrotask.
     * 
     * **Default:** `0.001` (defers deactivation to the next macrotask).
     */
    disableDelay ?: number
}

/**
 * @deprecated Use `ReactStyleSheetOptions` instead.
 */
export type DynamicStyleSheetOptions = ReactStyleSheetOptions;

/**
 * A React-aware stylesheet that dynamically manages its activation.
 *
 * - Tracks component mounts and accesses to determine when styles should be applied.
 * - Enables styles automatically when first accessed.
 * - Disables styles when no components are using the stylesheet, with optional delay.
 * - Designed for optimal React integration, preventing unnecessary style reloading.
 *
 * @template TCssScopeName - The name of the CSS scope applied to this stylesheet.
 */
export class ReactStyleSheet<TCssScopeName extends CssScopeName = CssScopeName> extends StyleSheet<TCssScopeName> {
    //#region Private properties
    // Configs:
    /**
     * Configuration options for React-based styling behavior.
     */
    private readonly    _reactOptions   : Readonly<ReactStyleSheetOptions & Required<Omit<ReactStyleSheetOptions, keyof StyleSheetOptions>>>
    
    
    
    // States:
    /**
     * Stores an active timeout for delaying the disable process.
     * Ensures controlled deactivation based on usage tracking.
     */
    private /*mutable*/ _disableTimeout : ReturnType<typeof setTimeout> | undefined
    
    /**
     * Tracks the number of components actively using this stylesheet.
     * - Increases when a component accesses styles.
     * - Decreases when a previously registered component unmounts.
     * - Controls automatic enabling/disabling of styles.
     */
    private /*mutable*/ _usageCounter   : number
    //#endregion Private properties
    
    
    
    //#region Constructors
    constructor(scopesFactory: StyleSheetsFactory<TCssScopeName>, updatedCallback: StyleSheetUpdatedCallback<TCssScopeName>, options?: ReactStyleSheetOptions) {
        // Configs:
        const {
            disableDelay = 0.001,
            
            ...restOptions
        } = options ?? {};
        
        const normalizedOptions : ReactStyleSheetOptions & Required<Omit<ReactStyleSheetOptions, keyof StyleSheetOptions>> = {
            ...restOptions,
            
            disableDelay,
        };
        
        
        
        // Init the base constructor:
        super(scopesFactory, updatedCallback, normalizedOptions);
        this._reactOptions                  = normalizedOptions;
        
        
        
        // States:
        this._disableTimeout                = undefined; // Initially no ongoing deactivation.
        this._usageCounter                  = 0;         // Initially no active usage.
    }
    //#endregion Constructors
    
    
    
    //#region Protected methods
    /**
     * Cancels any ongoing disable timeout, preventing premature stylesheet deactivation.
     * If no timeout is scheduled, the method exits without action.
     */
    protected cancelPendingDisable() {
        // Conditions:
        if (!this._disableTimeout) return; // Nothing to cancel => ignore.
        
        
        
        // Actions:
        clearTimeout(this._disableTimeout);
        this._disableTimeout = undefined; // Clear timeout reference.
    }
    
    
    /**
     * Increments the usage counter, tracking active stylesheet usage.
     * Enables the stylesheet when the first usage occurs.
     */
    protected incrementUsageCount() {
        // Increase the counter::
        this._usageCounter++;
        
        
        
        // Enable stylesheet when first usage occurs:
        if (this._usageCounter === 1) {
            // Cancel any scheduled disable action (if any):
            this.cancelPendingDisable();
            
            
            
            // Activate the stylesheet:
            this.triggerAutoEnable();
        } // if
    }
    
    /**
     * Decrements the usage counter, tracking stylesheet usage.
     * Disables the stylesheet when no active components remain.
     */
    protected decrementUsageCount() {
        // Decrease the usage counter:
        this._usageCounter--;
        
        
        
        // Disable stylesheet when last usage occurs:
        if (this._usageCounter === 0) {
            // Cancel any scheduled disable action (if any):
            this.cancelPendingDisable();
            
            
            
            const disableDelay = this._reactOptions.disableDelay;
            if (disableDelay <= 0) {
                // Immediately disable the stylesheet:
                this.resetAutoEnable();
            }
            else {
                // Delayed disable the stylesheet:
                this._disableTimeout = setTimeout(() => {
                    this._disableTimeout = undefined; // Clear timeout reference.
                    
                    
                    
                    // Disable stylesheet after delay:
                    this.resetAutoEnable();
                }, disableDelay);
            } // if
        } // if
    }
    //#endregion Protected methods
    
    
    
    //#region Public methods
    /**
     * A React hook for using this stylesheet.
     *
     * - Tracks component usage to enable styles dynamically.
     * - Automatically unregisters when the component unmounts.
     * - Important: This function **must** be wrapped in an arrow function to preserve the `this` context.
     */
    useReactStyleSheets(): CssScopeMap<TCssScopeName> {
        // Tracks whether the current component has accessed the stylesheet:
        // This `useRef` is prefixed with `_` to avoid eslint validation rule because the `useReactStyleSheets` in this class is technicaly neither React component nor hook.
        const hasAccessedScopedClass = _useRef(false);
        
        
        
        // Cleanup upon component unmount:
        // This `useEffect` is prefixed with `_` to avoid eslint validation rule because the `useReactStyleSheets` in this class is technicaly neither React component nor hook.
        _useEffect(() => {
            // Cleanups:
            return () => {
                if (hasAccessedScopedClass.current) {
                    hasAccessedScopedClass.current = false;
                    this.decrementUsageCount(); // Only decrement if the component accessed styles.
                } // if
            };
        }, []);
        
        
        
        // Proxy to register usage when a class is accessed:
        return new Proxy<CssScopeMap<TCssScopeName>>(this.classes, {
            get: (classes: CssScopeMap<TCssScopeName>, scopeName: CssScopeName): CssClassName | undefined => {
                if (!hasAccessedScopedClass.current) {
                    hasAccessedScopedClass.current = true;
                    this.incrementUsageCount(); // Only increment when styles are accessed.
                } // if
                
                
                
                // Preserves the original access:
                return classes[scopeName as keyof CssScopeMap<TCssScopeName>];
            },
        });
    }
    //#endregion Public methods
}

/**
 * @deprecated Use `ReactStyleSheet` instead.
 */
export const DynamicStyleSheet = ReactStyleSheet;