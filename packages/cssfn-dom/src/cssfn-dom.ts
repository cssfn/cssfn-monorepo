// Cssfn:
import {
    // cssfn properties:
    type CssScopeName,
}                           from '@cssfn/css-types'
import {
    // Style sheets:
    StyleSheet,
    StyleSheetUpdateEvent,
    styleSheetRegistry,
    
    
    
    // Processors:
    renderStyleSheet,
    unraceRenderStyleSheetAsync,
}                           from '@cssfn/cssfn'

// Other libs:
import {
    // Tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'



// Utilities:

/**
 * Polyfills `requestAnimationFrame` for better compatibility.
 * Ensures callbacks are invoked even if the tab is inactive.
 *
 * @param callback The function to execute before the next repaint.
 * @returns The animation frame request ID or `undefined` if using Promise fallback.
 */
const polyfillRequestAnimationFrame = (
    (typeof(requestAnimationFrame) !== 'undefined')
    ? (callback: () => void): ReturnType<typeof requestAnimationFrame>|undefined => {
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
    : (callback: () => void): ReturnType<typeof requestAnimationFrame>|undefined => {
        Promise.resolve().then(callback);
        return undefined;
    }
);



// Global configuration & utilities:
const isClientSide : boolean = isBrowser || isJsDom;



// Rendering config:
export const config = { asyncRender: true };



// References:
const headElement  = isClientSide ? document.head : undefined;
const csrStyleElms = new Map<StyleSheet, HTMLStyleElement|null>(); // Maps `StyleSheet` instances to their corresponding `<style>` elements.

/**
 * Finds an existing `<style>` element with the specified CSS-in-JS ID.
 *
 * @param cssfnId The unique CSS-in-JS identifier.
 * @returns The found `<style>` element or `null` if not found.
 */
const findCssfnStyleElmById = (cssfnId: string): HTMLStyleElement|null => {
    if (!cssfnId) return null; // If no ID => return null.
    return (headElement?.querySelector(`style[data-cssfn-id="${cssfnId}"]`) ?? null) as HTMLStyleElement|null;
};



// Commit batching:
interface RenderedStyleSheet {
    renderedCss : string|null
    enabled     : boolean
}

const pendingCommit = new Map<StyleSheet, RenderedStyleSheet>();

/**
 * Commits batched stylesheet updates efficiently.
 */
const batchCommit = () => {
    // Abort if no pending updates:
    if (!pendingCommit.size) return;
    
    
    
    // Extract pending changes:
    const changes = Array.from(pendingCommit.entries());
    pendingCommit.clear();
    
    
    
    // Organize updates:
    const batchAppendChildren : (readonly [HTMLStyleElement, boolean])[]            = [];
    const batchDeleteChildren : HTMLStyleElement[]                                  = [];
    const batchMutateChildren : (readonly [HTMLStyleElement, RenderedStyleSheet])[] = [];
    for (const [styleSheet, {renderedCss, enabled}] of changes) {
        if (!renderedCss) { // Nothing is rendered.
            // Find an existing `<style>` element linked to the stylesheet:
            const existingStyleElm = (
                // First priority: Find the CSR generated <style> element:
                csrStyleElms.get(styleSheet)
                
                ??
                
                // Second priority: Find the SSR generated <style> element:
                findCssfnStyleElmById(styleSheet.id)
            );
            
            
            
            if (existingStyleElm) { // The <style> element is found => delete it.
                // Mark as deleted:
                csrStyleElms.set(styleSheet, null /* = no corresponding HTMLStyleElement */); // MARK the related HTMLStyleElement as DELETED, so we still have information that the styleSheet EVER CSR generated.
                
                // Schedule removal:
                batchDeleteChildren.push(existingStyleElm);
            } // if
        }
        else { // Store rendered CSS:
            // Find the CSR generated <style> element (if any):
            const existingStyleElm = csrStyleElms.get(styleSheet);
            
            
            
            if (!existingStyleElm) { // The <style> element is found => (1st priority) reuse prerendered <style> element -or- (2nd priority) create a new one.
                // Find for prerendered `<style>` elements (SSR):
                const ssrStyleElm = findCssfnStyleElmById(styleSheet.id);
                
                
                
                if (ssrStyleElm) { // Reuse SSR-generated `<style>`:
                    // Update the relationship to map:
                    csrStyleElms.set(styleSheet, ssrStyleElm);
                    
                    
                    
                    // Schedule to update <style> element:
                    batchMutateChildren.push([ssrStyleElm, { renderedCss, enabled }]);
                }
                else { // Create a new `<style>` element:
                    const newStyleElm = document.createElement('style');
                    
                    
                    
                    // Assign the required properties:
                    newStyleElm.textContent = renderedCss;
                    // newStyleElm.disabled    = !enabled; // DOESN'T WORK: disabling <style> *before* mounted to DOM.
                    newStyleElm.dataset.cssfnId = styleSheet.id || '';
                    
                    
                    
                    // Append the relationship to map:
                    csrStyleElms.set(styleSheet, newStyleElm);
                    
                    
                    
                    // Schedule addition:
                    batchAppendChildren.push([newStyleElm, enabled]);
                } // if
            }
            else {
                // Schedule updates:
                batchMutateChildren.push([existingStyleElm, { renderedCss, enabled }]);
            } // if
        } // if
    } // for
    
    
    
    //#region // Efficiently mutate the `<head>` element:
    // Mutates:
    // In order the user to see the changes quicly, this is the first operation that should we do.
    // The <style> element(s) are already in the DOM, so the operation is fast & instantly applied.
    for (const [styleElm, {renderedCss, enabled}] of batchMutateChildren) {
        styleElm.textContent = renderedCss;
        styleElm.disabled    = !enabled;
    } // for
    
    
    
    // Appends:
    // The second operation.
    // It's quite heavy task to append a new <style> element(s) into the DOM.
    if (batchAppendChildren.length) {
        if (batchAppendChildren.length === 1) {
            // Singular append:
            
            const [styleElm, enabled] = batchAppendChildren[0];
            headElement?.appendChild(styleElm);
            if (!enabled) styleElm.disabled = true; // Disabling <style> *after* mounted to DOM.
        }
        else {
            // Plural append:
            
            const childrenGroup = document.createDocumentFragment();
            for (const [styleElm] of batchAppendChildren) {
                childrenGroup.appendChild(styleElm);
            } // for
            headElement?.appendChild(childrenGroup);
            for (const [styleElm, enabled] of batchAppendChildren) {
                if (!enabled) styleElm.disabled = true; // Disabling <style> *after* mounted to DOM.
            } // for
        } // if
    } // if
    
    
    
    // Deletes:
    // The last operation.
    // Because the excess <style> element(s) have no significant visual impact, so we do this at the last.
    for (const styleElm of batchDeleteChildren) {
        styleElm.parentElement?.removeChild?.(styleElm);
    } // for
    //#endregion // Efficiently mutate the `<head>` element:
};



// Scheduling commit updates:
let handleScheduledBatchCommit : ReturnType<typeof requestAnimationFrame>|undefined = undefined;
const scheduledBatchCommit = () => {
    // Mark the current scheduler is done, so another scheduler can run:
    handleScheduledBatchCommit = undefined;
    
    
    
    // Perform batch commit:
    batchCommit();
};

/**
 * Schedules a batch commit for efficient stylesheet updates.
 */
const scheduleBatchCommit = () => {
    // Ensures only one scheduler runs at any time.
    if (handleScheduledBatchCommit) return;
    
    
    
    // Schecule the batch as soon as before browser repaints the DOM:
    handleScheduledBatchCommit = polyfillRequestAnimationFrame(scheduledBatchCommit);
};



// Style update handler:
/**
 * Handles stylesheet updates, ensuring efficient hydration and rendering.
 *
 * ## Behavior:
 * - **Lazy reuse of prerendered CSS** (if applicable) to minimize expensive re-rendering.
 * - **Efficiently toggles stylesheets** when enabling/disabling without redundant processing.
 * - **Executes rendering asynchronously** based on configuration (`config.asyncRender`).
 * - **Queues updates & batches commits** to optimize DOM mutations before browser repaints.
 *
 * @param styleSheet The stylesheet being updated.
 * @param type The type of update event affecting the stylesheet.
 */
const handleUpdate = async ({styleSheet, type}: StyleSheetUpdateEvent<CssScopeName>): Promise<void> => {
    // Determine whether the update affects rendering:
    const isEnabled    = styleSheet.enabled;
    const shouldUpdate = (type === 'enabledChanged');
    const shouldRender = isEnabled || styleSheet.prerender; // Render if enabled or marked for prerendering.
    
    
    
    // Lazy reuse prerendered CSS on first update:
    if (styleSheet.lazyCsr && (shouldUpdate || shouldRender)) {
        if (!csrStyleElms.has(styleSheet)) { // If not found in `csrStyleElms`, it means it's the first-update.
            // Find prerendered CSS (if any):
            const ssrStyleElm = findCssfnStyleElmById(styleSheet.id);
            
            
            
            if (ssrStyleElm) { // The prerendered CSS is found => reuse it.
                // Store prerendered CSS & reuse it instead of expensive re-rendering:
                csrStyleElms.set(styleSheet, ssrStyleElm);
                
                
                
                // Toggle enabled/disabled state if needed:
                if (shouldUpdate) ssrStyleElm.disabled = !isEnabled;
                
                
                
                // Skip expensive re-rendering:
                return;
            } // if
        } // if
    } // if
    
    
    
    // Update enabled/disabled state without full re-render:
    if (shouldUpdate) {
        // Find the last generated CSS (if any):
        const csrStyleElm = csrStyleElms.get(styleSheet);
        
        
        
        if (csrStyleElm) { // The last generated CSS is found => update the enabled/disabled state.
            csrStyleElm.disabled = !isEnabled;
            
            
            
            // Skip expensive re-rendering:
            return;
        } // if
    } // if
    
    
    
    // Evaluate CSR rendering conditions:
    const renderCondition = (
        // Render only when needed:
        shouldRender
    );
    
    
    
    // Execute rendering based on async/sequential mode:
    const renderedCss = (
        renderCondition
        ? (
            config.asyncRender
            ? await unraceRenderStyleSheetAsync(styleSheet) // Batch rendering mode.
            : renderStyleSheet(styleSheet)                  // Sequential rendering mode.
        )
        : undefined // Canceled render.
    );
    if (renderedCss === undefined) return; // Ignore expired/canceled render.
    
    
    
    // Queue changes for batch commit:
    pendingCommit.set(styleSheet, {
        renderedCss : renderedCss || null, // Empty string => null.
        enabled     : isEnabled,
    });
    
    
    
    // Schedule batch commit before browser repaints:
    scheduleBatchCommit();
};

// Activate subscription on client-side only:
if (isClientSide) styleSheetRegistry.subscribe(handleUpdate);



// SSR cleanups:
/*
    Disabled the cleanup feature.
    Because a css-config may not registered the styleSheet(s) if the corresponding module is not loaded -- in case of a style.js module is not loaded due to ALREADY RENDERED on server_side.
*/
// if (headElement) { // === if (isClientSide)
//     // register a callback just BEFORE the first_paint occured:
//     polyfillRequestAnimationFrame(() => {
//         // register a callback on the next macro_task (just AFTER the first_paint occured):
//         const messageChannel = new MessageChannel();
//         messageChannel.port1.onmessage = () => {
//             // wait for 10 seconds to remove all <style>(s) having [data-cssfn-id] attr in which not listed in `csrStyleElms`:
//             setTimeout(() => {
//                 // remove all <style>(s) having [data-cssfn-id] attr in which not listed in `csrStyleElms`:
//                 const cssfnStyles           = Array.from(headElement.querySelectorAll('style[data-cssfn-id]')) as HTMLStyleElement[];
//                 const registeredCssfnStyles = new Set<HTMLStyleElement|null>(csrStyleElms.values());
//                 const unusedCssfnStyles     = cssfnStyles.filter((cssfnStyle) => !registeredCssfnStyles.has(cssfnStyle));
//                 for (const unusedCssfnStyle of unusedCssfnStyles) {
//                     unusedCssfnStyle.parentElement?.removeChild?.(unusedCssfnStyle);
//                 } // for
//             }, 10 * 1000);
//         };
//         messageChannel.port2.postMessage(undefined);
//     });
// } // if
