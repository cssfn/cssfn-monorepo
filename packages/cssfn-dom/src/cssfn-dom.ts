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
        }, 1000); // in case of inactive tab => force to apply after 1 second
        
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
export const config = { concurrentRender: true };



// dom:
let styleGroupElm : HTMLDivElement|null = null;
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
            const styleElm = styleElms.get(styleSheet);
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
                styleElm = document.createElement('style');
                styleElm.textContent = rendered;
                styleElms.set(styleSheet, styleElm); // make a relationship between StyleSheet object <==> HTMLStyleElement
                
                
                
                batchAppendChildren.push(styleElm);
            }
            else {
                // update the styleSheet:
                styleElm.textContent = rendered;
            } // if
        } // if
    } // for
    
    
    
    //#region efficiently append bulk styleElms
    if (batchAppendChildren.length) {
        if (!styleGroupElm) {
            styleGroupElm = document.createElement('div');
            styleGroupElm.dataset.cssfnDomStyles = ''; // an identifier this <div> is a special container for generated HTMLStyleElement(s)
            
            /*
                insert the <div data-cssfn-dom-styles> after the `batchCommit()` function has returned,
                so insertion of bulk <style>(s) is efficient
            */
            Promise.resolve(styleGroupElm).then((styleGroupElm) => {
                document.head.appendChild(styleGroupElm);
            });
        } // if
        
        
        
        if (batchAppendChildren.length === 1) {
            styleGroupElm.appendChild(batchAppendChildren[0]);
        }
        else {
            const childrenGroup = document.createDocumentFragment();
            for (const styleElm of batchAppendChildren) childrenGroup.appendChild(styleElm);
            styleGroupElm.appendChild(childrenGroup);
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
    const rendered = await (
        !config.concurrentRender
        ?
        Promise.resolve(renderStyleSheet(styleSheet))
        :
        renderStyleSheetAsync(styleSheet)
    );
    
    
    
    /*
        add/update/replace/delete the rendered css to the commit queue.
        
        Note:
        if there's a rendered_styleSheet that has not_been_applied, it will be canceled (lost) because a newer rendered_styleSheet is exist
    */
    pendingCommit.set(styleSheet, rendered || null);
    
    // schedule to `batchCommit()` the rendered css in the future BEFORE browser repaint:
    scheduleBatchCommit();
}
if (isClientSide) styleSheetRegistry.subscribe(handleUpdate);
