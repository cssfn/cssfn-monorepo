'use client'

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
     * Imperatively update the `disabled` property when `enabled` changes.
     * Using `useIsomorphicLayoutEffect` ensures the change happens **before the browser repaints**, avoiding flickering.
     * 
     * **Why do we use `useIsomorphicLayoutEffect` here?**
     * - The `<style>` element **does not support a `disabled` attribute**, but it does have a `disabled` **JavaScript property**.
     * - React **cannot set this property declaratively in JSX**, so we must update it manually via an effect.
     */
    useIsomorphicLayoutEffect(() => {
        // conditions:
        const styleElm = styleRef.current;
        if (!styleElm) return;
        
        
        
        // actions:
        // The <style> element does not have a disabled attribute, so we set it manually via JS:
        styleElm.disabled = !enabled;
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
            
            // Identifier for tracking styles:
            data-cssfn-id={id || ''}
            
            
            
            // Behaviors:
            // The CSS content may be large strings, suppressing hydration warnings avoids expensive comparison operations:
            suppressHydrationWarning={true}
            
            
            
            // Children:
            dangerouslySetInnerHTML={cachedInnerHtmlObject}
        />
    );
});

export {
    Style,            // Named export for readability.
    Style as default, // Default export to support React.lazy.
}
