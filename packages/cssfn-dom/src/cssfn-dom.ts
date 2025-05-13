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
    unraceRenderStyleSheetConcurrent,
}                           from '@cssfn/cssfn'

// Utilities:
import {
    // Tests:
    isClientSide,
    
    
    
    // Polyfills:
    polyfillRequestAnimationFrame,
    
    
    
    // DOM manipulations:
    headElement,
    findCssfnStyleElmById,
    setStyleEnabled,
}                           from './utilities.js'



// API:

/**
 * Manages dynamic stylesheet hydration for CSS-in-JS, allowing controlled rendering and cleanup.
 */
export interface DynamicStyles {
    /**
     * Enables batch rendering for multiple CSS-in-JS declarations.
     * - `true` (default) → Uses multiple web workers for faster rendering but higher CPU/memory usage.
     * - `false` → Sequential rendering, useful when styles are mostly pre-rendered on the server.
     */
    concurrentRender  : boolean
    
    /**
     * @deprecated Use `concurrentRender` instead.
     */
    asyncRender       : boolean
    
    
    
    /**
     * Stops styles from reacting dynamically.
     * - Existing styles remain but stop reacting dynamically.
     * - Rehydration is required to resume dynamic styling.
     */
    dehydrateStyles   : () => void
}

/**
 * Starts styles to reacting dynamically and returns a `DynamicStyles` instance for managing hydrated styles.
 */
export const hydrateStyles = (): DynamicStyles => {
    // Return a fake `DynamicStyles` instance if running on the server:
    if (!isClientSide) return {
        concurrentRender : false,    // Default: No concurrent rendering in SSR
        asyncRender      : false,    // Deprecated alias for `concurrentRender`
        dehydrateStyles  : () => {}, // No-op function since styles don't hydrate in SSR
    } satisfies DynamicStyles;
    
    
    
    // States:
    /**
     * Tracks batch rendering mode.
     */
    let   _concurrentRender = false;
    
    /**
     * Maps `StyleSheet` instances to their corresponding `<style>` elements for tracking client-side rendering.
     */
    const _csrStyleElms     = new Map<StyleSheet, HTMLStyleElement | null>();
    
    
    
    // Commit batching:
    
    interface RenderedStyleSheet {
        renderedCss : string | null
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
                    _csrStyleElms.get(styleSheet)
                    
                    ??
                    
                    // Second priority: Find the SSR generated <style> element:
                    findCssfnStyleElmById(styleSheet.id)
                );
                
                
                
                if (existingStyleElm) { // The <style> element is found => delete it.
                    // Mark as deleted:
                    _csrStyleElms.set(styleSheet, null /* = no corresponding HTMLStyleElement */); // MARK the related HTMLStyleElement as DELETED, so we still have information that the styleSheet EVER CSR generated.
                    
                    // Schedule removal:
                    batchDeleteChildren.push(existingStyleElm);
                } // if
            }
            else { // Store rendered CSS:
                // Find the CSR generated <style> element (if any):
                const existingStyleElm = _csrStyleElms.get(styleSheet);
                
                
                
                if (!existingStyleElm) { // The <style> element is found => (1st priority) reuse prerendered <style> element -or- (2nd priority) create a new one.
                    // Find for prerendered `<style>` elements (SSR):
                    const ssrStyleElm = findCssfnStyleElmById(styleSheet.id);
                    
                    
                    
                    if (ssrStyleElm) { // Reuse SSR-generated `<style>`:
                        // Update the relationship to map:
                        _csrStyleElms.set(styleSheet, ssrStyleElm);
                        
                        
                        
                        // Schedule to update <style> element:
                        batchMutateChildren.push([ssrStyleElm, { renderedCss, enabled }]);
                    }
                    else { // Create a new `<style>` element:
                        const newStyleElm = document.createElement('style');
                        
                        
                        
                        // Assign the required properties:
                        newStyleElm.textContent = renderedCss;
                        // setStyleEnabled(newStyleElm, enabled); // DOESN'T WORK: disabling <style> *before* mounted to DOM.
                        newStyleElm.dataset.cssfnId = styleSheet.id || '';
                        
                        
                        
                        // Append the relationship to map:
                        _csrStyleElms.set(styleSheet, newStyleElm);
                        
                        
                        
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
            setStyleEnabled(styleElm, enabled);
        } // for
        
        
        
        // Appends:
        // The second operation.
        // It's quite heavy task to append a new <style> element(s) into the DOM.
        if (batchAppendChildren.length) {
            if (batchAppendChildren.length === 1) {
                // Singular append:
                
                const [styleElm, enabled] = batchAppendChildren[0];
                headElement?.appendChild(styleElm);
                if (!enabled) setStyleEnabled(styleElm, false); // Disabling <style> *after* mounted to DOM.
            }
            else {
                // Plural append:
                
                const childrenGroup = document.createDocumentFragment();
                for (const [styleElm] of batchAppendChildren) {
                    childrenGroup.appendChild(styleElm);
                } // for
                headElement?.appendChild(childrenGroup);
                for (const [styleElm, enabled] of batchAppendChildren) {
                    if (!enabled) setStyleEnabled(styleElm, false); // Disabling <style> *after* mounted to DOM.
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
    
    let handleScheduledBatchCommit : ReturnType<typeof requestAnimationFrame> | undefined = undefined;
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
            if (!_csrStyleElms.has(styleSheet)) { // If not found in `_csrStyleElms`, it means it's the first-update.
                // Find prerendered CSS (if any):
                const ssrStyleElm = findCssfnStyleElmById(styleSheet.id);
                
                
                
                if (ssrStyleElm) { // The prerendered CSS is found => reuse it.
                    // Store prerendered CSS & reuse it instead of expensive re-rendering:
                    _csrStyleElms.set(styleSheet, ssrStyleElm);
                    
                    
                    
                    // Sync enabled/disabled state:
                    setStyleEnabled(ssrStyleElm, isEnabled);
                    
                    
                    
                    // Skip expensive re-rendering:
                    return;
                } // if
            } // if
        } // if
        
        
        
        // Update enabled/disabled state without full re-render:
        if (shouldUpdate) {
            // Find the last generated CSS (if any):
            const csrStyleElm = _csrStyleElms.get(styleSheet);
            
            
            
            if (csrStyleElm) { // The last generated CSS is found => update the enabled/disabled state.
                setStyleEnabled(csrStyleElm, isEnabled);
                
                
                
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
                _concurrentRender
                ? await unraceRenderStyleSheetConcurrent(styleSheet) // Batch rendering mode.
                : await renderStyleSheet(styleSheet)                 // Sequential rendering mode.
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
    const subscription = styleSheetRegistry.subscribe(handleUpdate);
    
    
    
    // API:
    const api = {
        dehydrateStyles : () => {
            subscription.unsubscribe();
        },
        
        
        
        get concurrentRender() {
            return _concurrentRender;
        },
        set concurrentRender(newValue: boolean) {
            _concurrentRender = newValue;
        },
        
        get asyncRender() {
            return api.concurrentRender;
        },
        set asyncRender(newValue: boolean) {
            api.concurrentRender = newValue;
        },
    } satisfies DynamicStyles;
    return api;
};

// side effect for compatibility:
hydrateStyles();
