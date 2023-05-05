// cssfn:
import type {
    // cssfn properties:
    CssScopeName,
}                           from '@cssfn/css-types'
import {
    // style sheets:
    StyleSheet,
    StyleSheetUpdateEvent,
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
const headElement  = isClientSide ? document.head : undefined;
const csrStyleElms = new Map<StyleSheet, HTMLStyleElement|null>(); // map a relationship between StyleSheet_object => (SSR|CSR) HTMLStyleElement

const findCssfnStyleElmById = (cssfnId: string): HTMLStyleElement|null => {
    if (!cssfnId) return null; // empty string => return null
    return (headElement?.querySelector(`style[data-cssfn-id="${cssfnId}"]`) ?? null) as HTMLStyleElement|null;
}



// commits:
interface RenderedStyleSheet {
    renderedCss : string|null
    enabled     : boolean
}
const pendingCommit = new Map<StyleSheet, RenderedStyleSheet>();
const batchCommit = () => {
    // conditions:
    if (!pendingCommit.size) return; // no queued updates => ignore
    
    
    
    // pop the queued:
    const changes = Array.from(pendingCommit.entries());
    pendingCommit.clear();
    
    
    
    // apply the changes:
    const batchAppendChildren : HTMLStyleElement[]                                  = [];
    const batchDeleteChildren : HTMLStyleElement[]                                  = [];
    const batchMutateChildren : (readonly [HTMLStyleElement, RenderedStyleSheet])[] = [];
    for (const [styleSheet, {renderedCss, enabled}] of changes) {
        if (!renderedCss) {
            // remove the styleSheet:
            
            
            
            // find the SSR/CSR generated <style> element (if any):
            const styleElm = (
                // find the CSR generated <style> element (if any):
                csrStyleElms.get(styleSheet)
                ??
                // find the SSR generated <style> element (if any):
                findCssfnStyleElmById(styleSheet.id)
            );
            if (styleElm) { // if found => delete it
                // delete existing relationship between StyleSheet_object => SSR/CSR HTMLStyleElement:
                csrStyleElms.set(styleSheet, null /* = no corresponding HTMLStyleElement */); // MARK the related HTMLStyleElement as DELETED, so we still have information that the styleSheet EVER CSR generated
                
                // schedule to delete existing <style> element:
                batchDeleteChildren.push(styleElm);
            } // if
        }
        else {
            // add/update the styleSheet:
            
            
            
            // find the CSR generated <style> element (if any):
            let styleElm = csrStyleElms.get(styleSheet);
            if (!styleElm) { // if not found => (1st priority) re-use SSR generated <style> element -or- (2nd priority) generate a new one
                // add the styleSheet:
                
                
                
                // find the SSR generated <style> element (if any):
                const ssrStyleElm = findCssfnStyleElmById(styleSheet.id);
                if (ssrStyleElm) { // found SSR generated <style> element => re-use it
                    /* ***** [greedyCsr]: always replace the content of SSR generated <style> element ***** */
                    
                    
                    
                    // make a relationship between StyleSheet_object => SSR HTMLStyleElement:
                    csrStyleElms.set(styleSheet, ssrStyleElm);
                    
                    // schedule to re-use (update) SSR generated <style> element:
                    batchMutateChildren.push([ssrStyleElm, { renderedCss, enabled }]); // replace: SSR generated => CSR generated
                }
                else {
                    /* ***** create a new CSR generated <style> element ***** */
                    
                    
                    
                    styleElm = document.createElement('style'); // create a new <style> element
                    styleElm.textContent = renderedCss;
                    styleElm.disabled    = !enabled;
                    styleElm.dataset.cssfnId = styleSheet.id || '';
                    
                    // make a relationship between StyleSheet_object => CSR HTMLStyleElement:
                    csrStyleElms.set(styleSheet, styleElm);
                    
                    // schedule to append a new CSR generated <style> element:
                    batchAppendChildren.push(styleElm);
                } // if
            }
            else {
                // update the styleSheet:
                
                
                
                // schedule to re-use (update) CSR generated <style> element:
                batchMutateChildren.push([styleElm, { renderedCss, enabled }]); // CSR generated
            } // if
        } // if
    } // for
    
    
    
    //#region efficiently mutate(s) the <head> element
    // mutate children:
    // the first operation, the <style> element(s) was already there, so the operation is fast & instantly applied
    for (const [styleElm, {renderedCss, enabled}] of batchMutateChildren) {
        styleElm.textContent = renderedCss;
        styleElm.disabled    = !enabled;
    } // for
    
    
    
    // append children:
    // the second operation, because it's quite heavy task to append a new <style> element(s)
    if (batchAppendChildren.length) {
        if (batchAppendChildren.length === 1) {
            // singular append:
            
            headElement?.appendChild(batchAppendChildren[0]);
        }
        else {
            // plural append:
            
            const childrenGroup = document.createDocumentFragment();
            for (const styleElm of batchAppendChildren) {
                childrenGroup.appendChild(styleElm);
            } // for
            headElement?.appendChild(childrenGroup);
        } // if
    } // if
    
    
    
    // delete children:
    // the last operation, because the excess <style> element(s) have no significant visual impact
    for (const styleElm of batchDeleteChildren) {
        styleElm.parentElement?.removeChild(styleElm);
    } // for
    //#endregion efficiently mutate(s) the <head> element
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
const raceRenderStyleSheet = new Map<StyleSheet, number>();
const unraceRenderStyleSheetAsync = async (styleSheet: StyleSheet): Promise<Awaited<ReturnType<typeof renderStyleSheetAsync>>|undefined> => {
    // update the race flag:
    const prevGeneration    = raceRenderStyleSheet.get(styleSheet) ?? 0;
    const currentGeneration = (prevGeneration === Number.MAX_SAFE_INTEGER) ? 0 : (prevGeneration + 1);
    raceRenderStyleSheet.set(styleSheet, currentGeneration);
    
    
    
    // render and await the result:
    const renderedCss = await renderStyleSheetAsync(styleSheet);
    
    
    
    // check if the rendered css is not *expired*:
    const checkGeneration = raceRenderStyleSheet.get(styleSheet) ?? 0;
    if (checkGeneration !== currentGeneration) return undefined; // a *newer generation* detected => *expired* render => abort
    
    
    
    // still the *latest* generation => return the result:
    return renderedCss;
}
const handleUpdate = async ({styleSheet, type}: StyleSheetUpdateEvent<CssScopeName>): Promise<void> => {
    const styleSheetEnabled  = styleSheet.enabled;
    const doUpdateStyleSheet = (type === 'enabledChanged');
    const doRenderStyleSheet = styleSheetEnabled || styleSheet.prerender; // if the styleSheet is enabled -or- disabled but marked to prerender => perform render
    
    
    
    if (styleSheet.lazyCsr && (doUpdateStyleSheet || doRenderStyleSheet)) {
        /* ***** [lazyCsr]: if possible, skip the first_update_first_render by re-use SSR generated <style> element ***** */
        
        
        
        if (!csrStyleElms.has(styleSheet)) { // if the styleSheet is NEVER CSR generated => find the SSR generated (if any)
            // find the SSR generated <style> element (if any):
            const ssrStyleElm = findCssfnStyleElmById(styleSheet.id);
            if (ssrStyleElm) { // found SSR generated <style> element => re-use it
                // make a relationship between StyleSheet_object => SSR HTMLStyleElement:
                csrStyleElms.set(styleSheet, ssrStyleElm);
                
                
                
                // update the enabled/disabled:
                if (doUpdateStyleSheet) ssrStyleElm.disabled = !styleSheetEnabled;
                
                
                
                return; // no need further CSR generated
            } // if
        } // if
    } // if
    
    
    
    // update the enabled/disabled:
    if (doUpdateStyleSheet) {
        // find the CSR generated <style> element (if any):
        const styleElm = csrStyleElms.get(styleSheet);
        if (styleElm) { // found CSR generated <style> element => update the enabled/disabled
            styleElm.disabled = !styleSheetEnabled;
            
            
            
            return; // no need further CSR generated
        } // if
    } // if
    
    
    
    const renderedCss = (
        (doRenderStyleSheet || undefined) // do render -or- *canceled*
        &&
        (
            config.asyncRender
            ? await unraceRenderStyleSheetAsync(styleSheet)
            : renderStyleSheet(styleSheet)
        )
    );
    if (renderedCss === undefined) return; // ignore *canceled*/*expired* render
    
    
    
    /*
        add/update/replace/delete the rendered css to the commit queue.
        
        Note:
        if there's a rendered_styleSheet that has not_been_applied, it will be canceled (lost) because a newer rendered_styleSheet is exist
    */
    pendingCommit.set(styleSheet, {
        renderedCss : renderedCss || null, // empty string => null
        enabled     : styleSheetEnabled,
    });
    
    // schedule to `batchCommit()` the rendered css in the future BEFORE browser repaint:
    scheduleBatchCommit();
}
if (isClientSide) styleSheetRegistry.subscribe(handleUpdate);



// SSR cleanups:
/*
    Disabled the cleanup feature.
    Because a css-config may not registered the styleSheet(s) if the corresponding module is not loaded -- in case of a style.js module is not loaded due to ALREADY RENDERED on server_side.
*/
// if (headElement) { // === if (isClientSide)
//     // register a callback just BEFORE the first_paint occured:
//     isomorphicRequestAnimationFrame(() => {
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
//                     unusedCssfnStyle.parentElement?.removeChild(unusedCssfnStyle);
//                 } // for
//             }, 10 * 1000);
//         };
//         messageChannel.port2.postMessage(undefined);
//     });
// } // if
