// cssfn:
import type {
    StyleSheet,
}                           from '@cssfn/cssfn'
import {
    styleSheetRegistry,
}                           from '@cssfn/cssfn/dist/styleSheets.js'
import {
    render,
}                           from '@cssfn/cssfn/dist/renders.js'

// other libs:
import {
    // tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'



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
                        Promise.resolve(styleGroupElm).then((styleGroupElm) => {
                            document.head.appendChild(styleGroupElm);
                        });
                    }
                    else {
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
const handleUpdate = (styleSheet: StyleSheet): void => {
    if (!config.async) {
        // sync update:
        pendingUpdates.add(styleSheet);
        batchUpdate();
    }
    else {
        // async update:
        pendingUpdates.add(styleSheet);
        if (typeof(requestAnimationFrame) !== 'undefined') {
            requestAnimationFrame(batchUpdate);
        }
        else {
            Promise.resolve().then(() => {
                batchUpdate();
            });
        }
    } //
}
if (isClientSide) styleSheetRegistry.subscribe(handleUpdate);
