'use client' // This module belongs to the client-side bundle but can be imported into a server-side module, meaning it relies on client-side execution.

// React:
import {
    // React:
    default as React,
    
    
    
    // Types:
    type JSX,
    
    
    
    // Hooks:
    useRef,
    useMemo,
    
    
    
    // Utilities:
    memo,
}                           from 'react'

// Hooks:
import {
    // Hooks:
    useIsomorphicLayoutEffect,
}                           from './hooks.js'



// React components:

/**
 * Props for the `Style` component.
 */
export interface StyleProps {
    // Identifiers:
    
    /**
     * Unique identifier for the style element.
     */
    id       ?: string
    
    
    
    // States:
    
    /**
     * Determines whether the style should be applied.
     * Defaults to `true` if not provided.
     */
    enabled  ?: boolean
    
    
    
    // Children:
    
    /**
     * The CSS rules to be injected inside the `<style>` tag.
     */
    children  : string | null
}

/**
 * A memoized React component that dynamically injects CSS styles into the document.
 * 
 * @param {StyleProps} props - The component properties.
 * @returns {JSX.Element | null} The `<style>` element or `null` if no CSS is provided.
 * 
 * @example
 * ```tsx
 * <Style id="theme" enabled={true}>
 *   body { background-color: black; color: white; }
 * </Style>
 * ```
 */
const Style = memo((props: StyleProps): JSX.Element | null => {
    // Props:
    const {
        // Identifiers:
        id,
        
        
        
        // States:
        enabled = true,
        
        
        
        // Children:
        children: renderedCss,
    } = props;
    
    
    
    // Refs:
    const styleRef = useRef<HTMLStyleElement | null>(null);
    
    
    
    // Effects:
    
    /**
     * Imperatively updates the `disabled` property when `enabled` changes.
     * Using `useIsomorphicLayoutEffect` ensures the update occurs **before the browser repaints**, preventing flickering.
     * 
     * **Why `useIsomorphicLayoutEffect`?**
     * - The `<style>` element **lacks a `disabled` attribute** but has a `disabled` **JavaScript property**.
     * - React **cannot set this property declaratively in JSX**, requiring manual updates via an effect.
     */
    useIsomorphicLayoutEffect(() => {
        // Exit if no element is found:
        const styleElm = styleRef.current;
        if (!styleElm) return;
        
        
        
        /**
         * Determines the stylesheet's enabled state.
         * - Prefers the manually modified `data-enabled` attribute.
         * - Falls back to the `enabled` prop if no override exists.
         */
        const isEnabled : boolean = (
            // Gets the enabled state by `data-enabled` attribute:
            ((): boolean | undefined => {
                const dataEnabled = styleElm.getAttribute('data-enabled');
                switch (dataEnabled) {
                    case 'enabled'  : return true;
                    case 'disabled' : return false;
                    default         : return undefined;
                } // switch
            })()
            
            ??
            
            // Fallback to `enabled` prop:
            enabled
        );
        
        // The `<style>` element does not have a disabled attribute, so we must update it imperatively:
        styleElm.disabled = !isEnabled;
        
        // Force updating `data-enabled` even if a hydration error occurs (cannot be updated via JSX declaration):
        styleElm.setAttribute('data-enabled', isEnabled ? 'enabled' : 'disabled');
    }, [enabled]);
    
    
    
    // Memoize the dangerouslySetInnerHTML object to avoid unnecessary re-renders:
    const cachedInnerHtmlObject = useMemo((): React.DOMAttributes<HTMLStyleElement>['dangerouslySetInnerHTML'] => {
        if (!renderedCss) return undefined;
        
        return {
            __html: renderedCss,
        };
    }, [renderedCss]);
    
    
    
    // Jsx:
    
    // If no CSS content exists, don't render the <style> element:
    if (!cachedInnerHtmlObject) return null;
    
    return (
        <style
            // Refs:
            ref={styleRef}
            
            
            
            // Identifiers:
            
            // A unique identifier for tracking styles:
            data-cssfn-id={id || ''}
            
            
            
            // Behaviors:
            // Prevents hydration mismatch warnings when `data-enabled` differs from the server-side rendering:
            suppressHydrationWarning={true}
            
            
            
            // States:
            // Exposes the enable/disable state for external JavaScript updates:
            data-enabled={enabled ? 'enabled' : 'disabled'}
            
            
            
            // Children:
            // Injects the prerendered CSS content safely:
            dangerouslySetInnerHTML={cachedInnerHtmlObject}
        />
    );
});

export {
    Style,            // Named export for readability.
    Style as default, // Default export to support React.lazy.
}
