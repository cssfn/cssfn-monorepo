// cssfn:
import {
    // style sheets:
    StyleSheet,
    styleSheetRegistry,
    
    
    
    // processors:
    render,
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
    requestAnimationFrame
    :
    (callback: () => void): ReturnType<typeof requestAnimationFrame>|undefined => {
        Promise.resolve().then(callback);
        return undefined;
    }
);



// utilities:
const isClientSide : boolean = isBrowser || isJsDom;



// config:
export const config = { async: true };



// dom:
let styleGroupElm : HTMLDivElement|null = null;
const styleElms = new WeakMap<StyleSheet, HTMLStyleElement>();



// event handlers:
const pendingUpdates = new Set<StyleSheet>();
const batchUpdate = () => {
    if (!pendingUpdates.size) return; // no queued updates
    
    
    
    // pop the queued:
    const styleSheets = Array.from(pendingUpdates.values());
    pendingUpdates.clear();
    
    
    
    // render all:
    const updates = styleSheets.map((styleSheet): readonly [StyleSheet, string|null] => [
        styleSheet,
        (styleSheet.enabled || null) && render(styleSheet)
    ]);
    
    
    
    // apply all:
    for (const [styleSheet, rendered] of updates) {
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
                
                if (!styleGroupElm) {
                    styleGroupElm = document.createElement('div');
                    styleGroupElm.dataset.cssfnDomStyles = '';
                    
                    if (updates.length >= 2) {
                        // insert the <div> next after the `for` loop completed:
                        Promise.resolve(styleGroupElm).then((styleGroupElm) => {
                            document.head.appendChild(styleGroupElm);
                        });
                    }
                    else {
                        // insert the <div> immediately:
                        document.head.appendChild(styleGroupElm);
                    } // if
                } // if
                styleGroupElm.appendChild(styleElm);
                
                styleElms.set(styleSheet, styleElm);
            }
            else {
                // update the styleSheet:
                styleElm.textContent = rendered;
            } // if
        } // if
    } // for
}



let cancelScheduledBatchUpdate : ReturnType<typeof requestAnimationFrame>|undefined = undefined;
const scheduledBatchUpdate = () => {
    // marks:
    cancelScheduledBatchUpdate = undefined; // performing => uncancellable
    
    
    
    // actions:
    batchUpdate();
}
const scheduleBatchUpdate = () => {
    // `promise to batchUpdate()` in the future as soon as possible, BEFORE browser repaint:
    cancelScheduledBatchUpdate = isomorphicRequestAnimationFrame(scheduledBatchUpdate);
}
const cancelBatchUpdate = () => {
    if (cancelScheduledBatchUpdate) {
        cancelAnimationFrame(cancelScheduledBatchUpdate);
        cancelScheduledBatchUpdate = undefined; // mark as canceled
    } // if
}



const handleUpdate = (styleSheet: StyleSheet): void => {
    // marks:
    pendingUpdates.add(styleSheet);
    
    
    
    // cancel out previously async update (if was):
    cancelBatchUpdate();
    
    
    
    // actions:
    if (!config.async) {
        // sync update:
        batchUpdate();
    }
    else {
        // async update:
        scheduleBatchUpdate();
    } //
}
if (isClientSide) styleSheetRegistry.subscribe(handleUpdate);
