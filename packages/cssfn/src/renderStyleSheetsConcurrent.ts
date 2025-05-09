// Cssfn:
import {
    // Cssfn properties:
    type CssScopeName,
}                           from '@cssfn/css-types'
import {
    // Utilities:
    browserInfo,
}                           from '@cssfn/css-prop-auto-prefix'

// Internals:
import {
    // Types:
    type StyleSheet,
}                           from './styleSheets.js'
import {
    resolveCssRuleCollection,
    renderStyleSheet,
}                           from './renderStyleSheets.js'
import {
    encodeStyles,
}                           from './cssfn-encoders.js'
import {
    RenderPool,
}                           from './renderWorkers/RenderPool.js'
import {
    RenderWorker,
}                           from './renderWorkers/RenderWorker.js'

// Other libs:
import {
    // Tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'



// Utilities:
const isClientSide : boolean = isBrowser || isJsDom;



// Jobs:
type ResolveCallback = (result: Awaited<ReturnType<typeof renderStyleSheet>>) => void
type RejectCallback  = (reason?: any) => void
type JobEntry = {
    resolve : ResolveCallback
    reject  : RejectCallback
}
const jobList = new Map<number, JobEntry>();
let jobCounter = 0;



// Workers:
const renderPool = new RenderPool({
    onRendered      : (jobId, rendered) => {
        const currentJob = jobList.get(jobId);
        if (currentJob) {
            jobList.delete(jobId); // The job was finished as succeeded => remove from the list.
            
            
            
            currentJob.resolve(rendered); // The job was finished as succeeded => resolve.
        } // if
    },
    onRenderedError : (jobId, error   ) => {
        const currentJob = jobList.get(jobId);
        if (currentJob) {
            jobList.delete(jobId); // The job was finished as failed => remove from the list.
            
            
            
            currentJob.reject(error); // The job was finished as failed => reject.
        } // if
    },
    browserInfo,
});

const maxConcurrentWorks = (globalThis.navigator?.hardwareConcurrency ?? 1); // Determines the number of logical processors, fallback to 1 processor.
const renderWorkers : RenderWorker[] = [];
const createRenderWorkerIfNeeded = (): boolean => {
    // Conditions:
    if (renderWorkers.length >= maxConcurrentWorks) return false; // The maximum of workers has been reached => no more workers.
    
    
    
    const renderWorker = new RenderWorker({
        onConnectWorker : (workerId, remotePort) => {
            renderPool.addWorker(workerId, remotePort);
        },
        onErrorWorker   : (workerId, error     ) => {
            renderPool.errorWorker(workerId, error);
            
            const index = renderWorkers.findIndex((search) => (search === renderWorker));
            if (index >= 0) renderWorkers.splice(index, 1);
        },
    });
    renderWorkers.push(renderWorker);
    return true;
};
// Pre-load some workers, so the first page render will served quickly:
const maxPreloadWorkers = (
    /*
        Limits the workers to 2 when one/more SSR rendered <style> is exist
    */
    (
        isClientSide
        &&
        !!document.head.querySelector('style[data-cssfn-id]')
    )
    ? 2
    : 8
);
for (let addWorker = 0; addWorker < maxPreloadWorkers; addWorker++) {
    if (!createRenderWorkerIfNeeded()) break; // Max concurrent workers reached => stop adding new worker.
} // for



// Processors:
export const renderStyleSheetConcurrent = async <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): ReturnType<typeof renderStyleSheet> => {
    // conditions:
    if (renderPool.isError) return renderStyleSheet(styleSheet); // Not_support_worker => fallback to sync mode.
    
    
    
    // Generate (scope) Rule(s) from styleSheet:
    const scopeRules    = await resolveCssRuleCollection(styleSheet);
    
    // Encode the (scope) Rule(s), so the data can be transfered to web worker:
    const encodedStyles = encodeStyles(scopeRules);
    
    
    
    // Push the new job:
    jobCounter++; if (jobCounter >= Number.MAX_SAFE_INTEGER) jobCounter = 0;
    const jobId = jobCounter;
    
    const renderPromise = new Promise<Awaited<ReturnType<typeof renderStyleSheet>>>((resolve: ResolveCallback, reject: RejectCallback) => {
        const newJobEntry : JobEntry = {resolve, reject};
        jobList.set(jobId, newJobEntry);
    });
    
    
    
    // Delegate the render to the workerPool:
    renderPool.requestRender(jobId, encodedStyles);
    
    
    
    // The workerPool is currently working, we will notify you if it done:
    return renderPromise;
}

const raceRenderStyleSheet = new Map<StyleSheet, number>();
export const unraceRenderStyleSheetConcurrent = async (styleSheet: StyleSheet): Promise<Awaited<ReturnType<typeof renderStyleSheetConcurrent>> | undefined> => {
    // Update the race flag:
    const prevGeneration    = raceRenderStyleSheet.get(styleSheet) ?? 0;
    const currentGeneration = (prevGeneration === Number.MAX_SAFE_INTEGER) ? 0 : (prevGeneration + 1);
    raceRenderStyleSheet.set(styleSheet, currentGeneration);
    
    
    
    // Render and await the result:
    const renderedCss = await renderStyleSheetConcurrent(styleSheet);
    
    
    
    // Check if the rendered css is not *expired*:
    const checkGeneration = raceRenderStyleSheet.get(styleSheet) ?? 0;
    if (checkGeneration !== currentGeneration) return undefined; // a *newer generation* detected => *expired* render => abort
    
    
    
    // Still the *latest* generation => return the result:
    return renderedCss;
}



// Optimizations:
export interface EnsureRendererWorkersReadyOptions {
    timeout                 ?: number
    ensureCriticalResLoaded ?: boolean
}
export const ensureRendererWorkersReady = async (options ?: EnsureRendererWorkersReadyOptions): Promise<boolean> => {
    const timeout                 = options?.timeout                 ?? 100/*ms*/;
    const ensureCriticalResLoaded = options?.ensureCriticalResLoaded ?? true;
    
    
    
    // Start promises:
    const poolEnsureReadyPromise    : Promise<boolean>   = renderPool.ensureReady(
        ensureCriticalResLoaded
        ?
        Infinity // critical     => no timeout
        :
        timeout  // not_critical => has timeout
    );
    const workersEnsureReadyPromise : Promise<boolean>[] = renderWorkers.map((renderWorker) => renderWorker.ensureReady(timeout));
    
    
    
    // Wait until all promises ready -or- timeout:
    const results = await Promise.all([
        poolEnsureReadyPromise,
        ...workersEnsureReadyPromise
    ]);
    
    
    
    // Inspect the results:
    if (results.every((result) => result)) {
        return true; // Fully success => success.
    }
    else {
        // Prematurely success => ok no problem, but at least one worker must be ready:
        if (ensureCriticalResLoaded) {
            const workersEnsureReadyPromise : Promise<boolean>[] = renderWorkers.map((renderWorker) => renderWorker.ensureReady(Infinity));
            return await Promise.any(workersEnsureReadyPromise);
        } // if
        
        
        
        return false; // Prematurely success.
    }
};
