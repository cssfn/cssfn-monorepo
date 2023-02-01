// cssfn:
import {
    // style sheets:
    StyleSheet,
    styleSheetRegistry,
    
    
    
    // processors:
    renderStyleSheet,
    renderStyleSheetAsync,
}                           from '@cssfn/cssfn'

// other libs:
import {
    // tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'



// utilities:
/**
 * A regular `requestAnimationFrame` with SSR support.
 */
const isomorphicRequestAnimationFrame = (
    (typeof(requestAnimationFrame) !== 'undefined')
    ?
    (callback: () => void): ReturnType<typeof requestAnimationFrame>|undefined => {
        const timeoutHandler = setTimeout(() => {
            cancelAnimationFrame(animationFrameHandler); // abort the `requestAnimationFrame()`
            callback(); // invoke the callback
        }, 2000); // in case of inactive tab => force to apply after 2 seconds
        
        const animationFrameHandler = requestAnimationFrame(() => {
            clearTimeout(timeoutHandler); // abort the `setTimeout()`
            callback(); // invoke the callback
        });
        return animationFrameHandler;
    }
    :
    (callback: () => void): ReturnType<typeof requestAnimationFrame>|undefined => {
        Promise.resolve().then(callback);
        return undefined;
    }
);



// utilities:
const isClientSide : boolean = isBrowser || isJsDom;



// config:
export const config = { asyncRender: true };



// dom:
const headElement = isClientSide ? document.head : undefined;
const styleElms = new WeakMap<StyleSheet, HTMLStyleElement>(); // uses WeakMap to indirectly append a related HTMLStyleElement into StyleSheet object, without preventing the StyleSheet object to garbage collected



// commits:
const pendingCommit = new Map<StyleSheet, string|null>();
const batchCommit = () => {
    // conditions:
    if (!pendingCommit.size) return; // no queued updates => ignore
    
    
    
    // pop the queued:
    const changes = Array.from(pendingCommit.entries());
    pendingCommit.clear();
    
    
    
    // apply the changes:
    const batchAppendChildren : HTMLStyleElement[] = [];
    for (const [styleSheet, rendered] of changes) {
        if (!rendered) {
            // remove the styleSheet:
            
            const styleElm = (
                styleElms.get(styleSheet)
                ??
                // find the SSR generated element (if any):
                (styleSheet.id ? ((headElement?.querySelector(`style[data-cssfn-id="${styleSheet.id}"]`) ?? undefined) as HTMLStyleElement|undefined) : undefined)
            );
            if (styleElm) {
                styleElm.parentElement?.removeChild(styleElm);
                styleElms.delete(styleSheet);
            } // if
        }
        else {
            // add/update the styleSheet:
            
            let styleElm = styleElms.get(styleSheet);
            if (!styleElm) {
                // add the styleSheet:
                
                // find the SSR generated element (if any):
                const existingStyleElm = (styleSheet.id ? ((headElement?.querySelector(`style[data-cssfn-id="${styleSheet.id}"]`) ?? undefined) as HTMLStyleElement|undefined) : undefined);
                
                styleElm = (
                    // re-use the existing <style> element (if any):
                    existingStyleElm
                    ??
                    // create a new <style> element:
                    document.createElement('style')
                );
                styleElms.set(styleSheet, styleElm); // make a relationship between StyleSheet object <==> HTMLStyleElement
                
                
                
                // update the styleSheet:
                styleElm.textContent = rendered;
                
                
                
                if (!existingStyleElm) {
                    if (styleSheet.id) styleElm.dataset.cssfnId = styleSheet.id; // set [data-cssfn-id="xxx"] attr -- if has `styleSheet.id`, otherwise don't set blank [data-cssfn-id=""] to avoid being removed by *SSR cleanups*
                    batchAppendChildren.push(styleElm);
                };
            }
            else {
                // update the styleSheet:
                
                styleElm.textContent = rendered;
            } // if
        } // if
    } // for
    
    
    
    //#region efficiently append bulk styleElms
    if (batchAppendChildren.length) {
        if (batchAppendChildren.length === 1) {
            headElement?.appendChild(batchAppendChildren[0]);
        }
        else {
            const childrenGroup = document.createDocumentFragment();
            for (const styleElm of batchAppendChildren) childrenGroup.appendChild(styleElm);
            headElement?.appendChild(childrenGroup);
        } // if
    } // if
    //#endregion efficiently append bulk styleElms
}



// schedules:
let handleScheduledBatchCommit : ReturnType<typeof requestAnimationFrame>|undefined = undefined;
const scheduledBatchCommit = () => {
    // marks:
    handleScheduledBatchCommit = undefined; // performing => uncancellable
    
    
    
    // actions:
    batchCommit();
}
const scheduleBatchCommit = () => {
    // conditions:
    if (handleScheduledBatchCommit) return; // already scheduled => ignore
    
    
    
    // schedule to `batchCommit()` the rendered css in the future BEFORE browser repaint:
    handleScheduledBatchCommit = isomorphicRequestAnimationFrame(scheduledBatchCommit);
}



// handlers:
const handleUpdate = async (styleSheet: StyleSheet): Promise<void> => {
    const renderedCss = (
        (styleSheet.enabled || null) // if the styleSheet is disabled => no need to render
        &&
        (
            config.asyncRender
            ?
            await renderStyleSheetAsync(styleSheet)
            :
            renderStyleSheet(styleSheet)
        )
    );
    
    
    
    /*
        add/update/replace/delete the rendered css to the commit queue.
        
        Note:
        if there's a rendered_styleSheet that has not_been_applied, it will be canceled (lost) because a newer rendered_styleSheet is exist
    */
    pendingCommit.set(styleSheet, renderedCss || null);
    
    // schedule to `batchCommit()` the rendered css in the future BEFORE browser repaint:
    scheduleBatchCommit();
}
if (isClientSide) styleSheetRegistry.subscribe(handleUpdate);



// SSR cleanups:
if (headElement) { // === if (isClientSide)
    // register a callback just BEFORE the first_paint occured:
    isomorphicRequestAnimationFrame(() => {
        // register a callback on the next macro_task (just AFTER the first_paint occured):
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = () => {
            // remove all <style> elements with blank data-cssfn-id property:
            for (const noIdStyleElm of headElement.querySelectorAll('style[data-cssfn-id=""]')) {
                noIdStyleElm.parentElement?.removeChild(noIdStyleElm);
            } // for
        };
        messageChannel.port2.postMessage(undefined);
    });
} // if
