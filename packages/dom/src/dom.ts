// cssfn:
import type {
    StyleSheet,
}                           from '@cssfn/cssfn'
import {
    styleSheets,
}                           from '@cssfn/cssfn/dist/styleSheets'
import {
    render,
}                           from '@cssfn/cssfn/dist/renders'

// other libs:
import {
    // tests:
    isBrowser,
}                           from 'is-in-browser'



let styleGroupElm : HTMLDivElement|null = null;
const styleElms = new WeakMap<StyleSheet, HTMLStyleElement>();
const handleUpdate = (styleSheet: StyleSheet): void => {
    if (!styleGroupElm) {
        styleGroupElm = document.createElement('div');
    } // if
    const rendered = (styleSheet.enabled || null) && render(styleSheet);
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
            styleGroupElm.appendChild(styleElm);
            styleElms.set(styleSheet, styleElm);
        }
        else {
            // update the styleSheet:
            styleElm.textContent = rendered;
        } // if
    } // if
}
if (isBrowser) styleSheets.subscribe(handleUpdate);
