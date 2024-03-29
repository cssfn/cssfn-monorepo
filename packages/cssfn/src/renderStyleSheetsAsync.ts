// cssfn:
import type {
    // cssfn properties:
    CssScopeName,
}                           from '@cssfn/css-types'
import {
    // utilities:
    browserInfo,
}                           from '@cssfn/css-prop-auto-prefix'

// internals:
import type {
    // types:
    StyleSheet,
}                           from './styleSheets.js'
import {
    generateRulesFromStyleSheet,
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

// other libs:
import {
    // tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'



// utilities:
const isClientSide : boolean = isBrowser || isJsDom;



// jobs:
type ResolveCallback = (result: ReturnType<typeof renderStyleSheet>) => void
type RejectCallback  = (reason?: any) => void
type JobEntry = {
    resolve : ResolveCallback
    reject  : RejectCallback
}
const jobList = new Map<number, JobEntry>();
let jobCounter = 0;



// workers:
const renderPool = new RenderPool({
    onRendered      : (jobId, rendered) => {
        const currentJob = jobList.get(jobId);
        if (currentJob) {
            jobList.delete(jobId); // the job was finished as succeeded => remove from the list
            
            
            
            currentJob.resolve(rendered); // the job was finished as succeeded => resolve
        } // if
    },
    onRenderedError : (jobId, error   ) => {
        const currentJob = jobList.get(jobId);
        if (currentJob) {
            jobList.delete(jobId); // the job was finished as failed => remove from the list
            
            
            
            currentJob.reject(error); // the job was finished as failed => reject
        } // if
    },
    browserInfo,
});

const maxConcurrentWorks = (globalThis.navigator?.hardwareConcurrency ?? 1); // determines the number of logical processors, fallback to 1 processor
const renderWorkers : RenderWorker[] = [];
const createRenderWorkerIfNeeded = (): boolean => {
    // conditions:
    if (renderWorkers.length >= maxConcurrentWorks) return false; // the maximum of workers has been reached => no more workers
    
    
    
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
}
// pre-load some workers, so the first page render will served quickly:
const maxPreloadWorkers = (
    /*
        limits the workers to 3 when one/more SSR rendered <style> is exist
    */
    (
        isClientSide
        &&
        !!document.head.querySelector('style[data-cssfn-id]')
    )
    ?
    3
    :
    8
);
for (let addWorker = 0; addWorker < maxPreloadWorkers; addWorker++) {
    if (!createRenderWorkerIfNeeded()) break; // max concurrent workers reached => stop adding new worker
} // for



// processors:
export const renderStyleSheetAsync = async <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): Promise<ReturnType<typeof renderStyleSheet>> => {
    // conditions:
    if (renderPool.isError) return renderStyleSheet(styleSheet); // not_support_worker => fallback to sync mode
    
    
    
    // generate (scope) Rule(s) from styleSheet:
    const scopeRules    = generateRulesFromStyleSheet(styleSheet);
    
    // encode the (scope) Rule(s), so the data can be transfered to web worker:
    const encodedStyles = encodeStyles(scopeRules);
    
    
    
    // push the new job:
    jobCounter++; if (jobCounter >= Number.MAX_SAFE_INTEGER) jobCounter = 0;
    const jobId = jobCounter;
    
    const renderPromise = new Promise<ReturnType<typeof renderStyleSheet>>((resolve: ResolveCallback, reject: RejectCallback) => {
        const newJobEntry : JobEntry = {resolve, reject};
        jobList.set(jobId, newJobEntry);
    });
    
    
    
    // delegate the render to the workerPool:
    renderPool.requestRender(jobId, encodedStyles);
    
    
    
    // the workerPool is currently working, we will notify you if it done:
    return renderPromise;
}

const raceRenderStyleSheet = new Map<StyleSheet, number>();
export const unraceRenderStyleSheetAsync = async (styleSheet: StyleSheet): Promise<Awaited<ReturnType<typeof renderStyleSheetAsync>>|undefined> => {
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



// optimizations:
export interface EnsureRendererWorkersReadyOptions {
    timeout                 ?: number
    ensureCriticalResLoaded ?: boolean
}
export const ensureRendererWorkersReady = async (options ?: EnsureRendererWorkersReadyOptions): Promise<boolean> => {
    const timeout                 = options?.timeout                 ?? 100/*ms*/;
    const ensureCriticalResLoaded = options?.ensureCriticalResLoaded ?? true;
    
    
    
    // start promises:
    const poolEnsureReadyPromise    : Promise<boolean>   = renderPool.ensureReady(
        ensureCriticalResLoaded
        ?
        Infinity // critical     => no timeout
        :
        timeout  // not_critical => has timeout
    );
    const workersEnsureReadyPromise : Promise<boolean>[] = renderWorkers.map((renderWorker) => renderWorker.ensureReady(timeout));
    
    
    
    // wait until all promises ready -or- timeout:
    const results = await Promise.all([
        poolEnsureReadyPromise,
        ...workersEnsureReadyPromise
    ]);
    
    
    
    // inspect the results:
    if (results.every((result) => result)) {
        return true; // fully success => success
    }
    else {
        // prematurely success => ok no problem, but at least one worker must be ready:
        if (ensureCriticalResLoaded) {
            const workersEnsureReadyPromise : Promise<boolean>[] = renderWorkers.map((renderWorker) => renderWorker.ensureReady(Infinity));
            return await Promise.any(workersEnsureReadyPromise);
        } // if
        
        
        
        return false; // prematurely success
    }
}
