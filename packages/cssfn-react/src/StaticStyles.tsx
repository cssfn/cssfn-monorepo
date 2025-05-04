'use client'

// React:
import {
    // React:
    default as React,
    
    
    
    // Types:
    type JSX,
    
    
    
    // Utilities:
    memo,
}                           from 'react'

// Cssfn:
import {
    // Types:
    type CssScopeName,
}                           from '@cssfn/css-types'
import {
    // Style sheets:
    type StyleSheet,
    type StyleSheetUpdateEvent,
    styleSheetRegistry,
    
    
    
    // Processors:
    renderStyleSheet,
}                           from '@cssfn/cssfn'

// Internal components:
import {
    // React components:
    Style,
}                           from './Style.js'

// Utilities:
import {
    // Tests:
    isClientSide,
}                           from './utilities.js'



// Types:
/**
 * Represents a rendered stylesheet entry.
 */
interface RenderedStyleSheet {
    /**
     * Holds the rendered CSS.
     */
    renderedCss      : string|null
    
    /**
     * Overrides the enabled state on `StyleSheet.enabled`.
     * Since `StyleSheet.enabled` is readonly, this temporary state is stored here.
     */
    enabledOverride  : boolean|undefined
}



// React components:

/**
 * Props for the `StaticStyles` component.
 */
export interface StaticStylesProps {
    /**
     * Determines when to render CSS-in-JS styles.
     * - `false` → Render styles both server-side and client-side.
     * - `true` (default) → Render styles only if explicitly marked as SSR (`ssr: true`).
     *    Styles marked as `ssr: false` will be rendered **just-in-time** when accessed.
     */
    onlySsr     ?: boolean
}

/**
 * **StaticStyles Component**
 *
 * ## Purpose:
 * - **Client-side component that behaves like a server-side renderer**.
 * - Dynamically **extracts stylesheets** from the global client-side registry.
 * - On **client-side hydration**, instead of running expensive re-rendering, it **steals the prerendered HTML content**, ensuring perfect hydration.
 * - Works best in frameworks with **Server Components** for efficient styling injection.
 *
 * ## Behavior:
 * - **Executes normally on the server**, rendering static `<style>` elements.
 * - **On client-side**, **reuses prerendered HTML styles** instead of performing fresh rendering.
 * - **Ensures styles exist in `<head>` before `useLayoutEffect()` runs**, supporting components that rely on early DOM measurement.
 * - **Prevents hydration mismatches** by making sure the prerendered output is identical to the hydrated result.
 *
 * @component
 * @param {StaticStylesProps} props Component properties.
 * @returns {JSX.Element | null} A collection of `<style>` elements for rendered styles.
 */
const StaticStyles = memo((props: StaticStylesProps): JSX.Element | null => {
    // Props:
    const {
        onlySsr     = true,
    } = props;
    
    
    
    // Effects:
    
    // Collects registered stylesheets for rendering:
    const styleMap : Map<StyleSheet, RenderedStyleSheet> = ((): Map<StyleSheet, RenderedStyleSheet> => {
        // Holds the collected stylesheets:
        const styleMap = new Map<StyleSheet, RenderedStyleSheet>();
        
        
        
        // Subscribe **once** to collect styles (avoids real-time updates after hydration):
        styleSheetRegistry.subscribe(({ styleSheet, type }: StyleSheetUpdateEvent<CssScopeName>): void => {
            // Determine whether the update affects rendering:
            const isEnabled    = styleSheet.enabled;
            const shouldUpdate = (type === 'enabledChanged');
            const shouldRender = isEnabled || styleSheet.prerender; // Render if enabled or marked for prerendering.
            // if (process.env.NODE_ENV !== 'production') {
            //     console.log('CSS added: ', { type, id: styleSheet.id, enabled: isEnabled, shouldUpdate, shouldRender });
            // } // if
            
            
            
            // Skip expensive re-rendering for simple enabled/disabled state changes:
            if (shouldUpdate && styleMap.has(styleSheet)) return;
            
            
            
            // Evaluate SSR rendering conditions:
            const renderCondition = (
                // Render only when needed:
                shouldRender
                
                &&
                
                // Either both-client-and-server rendering or SSR-enabled:
                (
                    // Opted both server and client side:
                    !onlySsr
                    
                    ||
                    
                    // Opted only if server side AND ssr mode enabled:
                    styleSheet.ssr
                )
            );
            
            
            
            // Execute rendering based on sequential mode:
            let enabledOverride : boolean | undefined = undefined;
            const renderedCss = (
                renderCondition
                ? (() => {
                    // Steal prerendered styles instead of running expensive re-rendering:
                    if (styleSheet.id) {
                        const headElement  = isClientSide ? document.head : undefined;
                        if (headElement) {
                            const existingStyleElm = headElement.querySelector(`style[data-cssfn-id="${styleSheet.id}"]`);
                            if (existingStyleElm) {
                                const preRenderedCss = existingStyleElm.textContent;
                                // if (process.env.NODE_ENV !== 'production') {
                                //     console.log('Found prerendered: ', prerenderedCss);
                                // } // if
                                
                                // If the prerendered <style> exists, it mean the styleSheet has been accessed (turned to enabled) during prerendered on server:
                                enabledOverride = true;
                                
                                return preRenderedCss;
                            };
                        } // if
                    } // if
                    
                    
                    
                    // Perform fresh rendering (expensive):
                    const freshRenderedCss = renderStyleSheet(styleSheet); // Sequential rendering mode.
                    // if (process.env.NODE_ENV !== 'production') {
                    //     console.log('Fresh rendered: ', freshRenderedCss);
                    // } // if
                    return freshRenderedCss;
                })()
                : undefined // Canceled render.
            );
            if (renderedCss === undefined) return; // Ignore expired/canceled render.
            
            
            
            // Store rendered CSS in the Map reference:
            if (!renderedCss) { // Nothing is rendered.
                // Delete the CSS:
                // styleMap.delete(styleSheet); // Do not delete an item in the map.
                styleMap.set(styleSheet, { renderedCss: null, enabledOverride }); // Preserve the state (mark as removed instead of deleting).
            }
            else {
                // Store rendered CSS:
                styleMap.set(styleSheet, { renderedCss, enabledOverride });
            } // if
        })
        // Unsubscribe **immediately** to prevent future updates:
        .unsubscribe();
        
        
        
        // Return the collection:
        return styleMap;
    })();
    
    
    
    // Jsx:
    return (
        <>
            {
                Array.from(styleMap.entries())
                .map(([styleSheet, { renderedCss, enabledOverride }], index) =>
                    renderedCss
                    ? <Style
                        // Identifiers:
                        key={styleSheet.id || index} // Replace with index if the ID is empty string.
                        id={styleSheet.id}
                        
                        
                        
                        // States:
                        enabled={enabledOverride ?? styleSheet.enabled}
                    >
                        {renderedCss}
                    </Style>
                    : null
                )
            }
        </>
    );
});

export {
    StaticStyles,            // Named export for readability.
    StaticStyles as default, // Default export to support React.lazy.
}
