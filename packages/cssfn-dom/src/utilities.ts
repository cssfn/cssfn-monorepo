// Other libs:
import {
    // Tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'



// Tests:
/**
 * Determines if code is running client-side.
 */
export const isClientSide : boolean = isBrowser || isJsDom;



// Polyfills:

/**
 * Polyfills `requestAnimationFrame` for better compatibility.
 * Ensures callbacks are invoked even if the tab is inactive.
 *
 * @param callback The function to execute before the next repaint.
 * @returns The animation frame request ID or `undefined` if using Promise fallback.
 */
export const polyfillRequestAnimationFrame = (
    (typeof(requestAnimationFrame) !== 'undefined')
    ? (callback: () => void): ReturnType<typeof requestAnimationFrame> | undefined => {
        // Timeout fallback for inactive tabs:
        const timeoutHandler = setTimeout(() => {
            cancelAnimationFrame(animationFrameHandler); // Abort the underlying `requestAnimationFrame()`.
            callback(); // Invoke the callback.
        }, 2000); // In case of inactive tab => force to apply after 2 seconds.
        
        
        
        // Execute with `requestAnimationFrame`:
        const animationFrameHandler = requestAnimationFrame(() => {
            clearTimeout(timeoutHandler); // Abort the timeout handling.
            callback(); // Invoke the callback.
        });
        return animationFrameHandler;
    }
    : (callback: () => void): ReturnType<typeof requestAnimationFrame> | undefined => {
        Promise.resolve().then(callback);
        return undefined;
    }
);



// DOM manipulations:

export const headElement  = isClientSide ? document.head : undefined;

/**
 * Finds an existing `<style>` element with the specified CSS-in-JS ID.
 *
 * @param cssfnId The unique CSS-in-JS identifier.
 * @returns The found `<style>` element or `null` if not found.
 */
export const findCssfnStyleElmById = (cssfnId: string): HTMLStyleElement | null => {
    if (!cssfnId) return null; // If no ID => return null.
    return (headElement?.querySelector(`style[data-cssfn-id="${cssfnId}"]`) ?? null) as HTMLStyleElement | null;
};

/**
 * Controls the enabled state of a `<style>` element.
 * 
 * ## Behavior:
 * - **Activates or deactivates styles** by setting the `disabled` property.
 * - **Syncs the enable status** via `data-enabled`, ensuring compatibility with vanilla updates.
 * 
 * @param styleElm - The `<style>` element to modify.
 * @param newEnabled - `true` to enable styles, `false` to disable them.
 */
export const setStyleEnabled = (styleElm: HTMLStyleElement, newEnabled: boolean) => {
    // Enable/disable the styling functionality:
    styleElm.disabled = !newEnabled;
    
    
    
    // Exposes the enable/disable status for external JavaScript modifications:
    styleElm.setAttribute('data-enabled', newEnabled ? 'enabled' : 'disabled');
}
