// internals:
import type {
    // types:
    Tuple,
    
    
    
    // requests:
    RequestPing,
}                           from './WorkerBase-types.js'



export interface WorkerBaseConfigs {
    onReady ?: () => void
    onError ?: (error: string|Error|null) => void
}
export class WorkerBase<TRequest extends Tuple<string, any>, TResponse extends Tuple<string, any>> {
    // private properties:
    #configs : WorkerBaseConfigs|undefined
    #worker  : Worker|null
    #isReady : boolean
    #isError : string|Error|null
    
    
    
    // constructors:
    protected createWorker(): Worker {
        throw 'not implemented';
    }
    constructor(configs?: WorkerBaseConfigs) {
        // configs:
        this.#configs = configs;
        
        
        
        // setup web worker:
        if (typeof(Worker) !== 'undefined') { // supports Web Worker
            try {
                this.#worker  = this.createWorker(); // try to initialize
                this.#isReady = false; // not yet ready
                this.#isError = null;  // not yet having error
            }
            catch (error) {
                this.#worker  = null;  // Web Worker initialization was failed
                this.#isReady = false; // never ready
                this.#isError = (      // the causing error:
                    ((error == null) || (error === undefined))
                    ?
                    null
                    :
                    (
                        (error instanceof Error)
                        ?
                        error
                        :
                        `${error}` // stringify
                    )
                );
            } // try
        }
        else { // not support Web Worker
            this.#worker  = null;  // Web Worker is not available
            this.#isReady = false; // never ready
            this.#isError = Error('Web Worker is not supported');
        } // if
        
        
        
        // configure web worker:
        const worker = this.#worker;
        if (worker) {
            worker.onmessage = (event: MessageEvent<TResponse>) => {
                this.handleResponse(event);
            };
            worker.onerror   = ({error}: ErrorEvent) => {
                const errorParam : string|Error|null = (
                    ((error == null) || (error === undefined))
                    ?
                    null
                    :
                    (
                        (error instanceof Error)
                        ?
                        error
                        :
                        `${error}`
                    )
                );
                this.handleError(errorParam);
            };
        } // if
    }
    
    
    
    // requests:
    postRequest(requestData : TRequest, transfer?: Transferable[]): void {
        const worker = this.#worker;
        if (!worker) throw Error('internal error');
        if (transfer) {
            worker.postMessage(requestData);
        }
        else {
            worker.postMessage(requestData, transfer);
        } // if
    }
    postPing(): void {
        const requestPing : RequestPing = ['ping', undefined];
        this.postRequest(requestPing as TRequest);
    }
    
    
    
    // responses:
    handleResponse(_event: MessageEvent<TResponse>): void {
        // any responses are treated as ready status:
        this.handleReady();
    }
    handleError(error: string|Error|null): void {
        this.#worker?.terminate();
        this.#worker  = null;
        this.#isReady = false;
        this.#isError = error;
        
        this.#configs?.onError?.(error);
    }
    handleReady(): void {
        this.#isReady = true;
        
        this.#configs?.onReady?.();
    }
    
    
    
    // public properties:
    get isReady() { return this.#isReady }
    get isError() { return this.#isError }
    
    
    
    // public methods:
    async ensureReady(timeout = 100): Promise<boolean> {
        if (this.#isError) return false; // never ready
        if (this.#isReady) return true;  // was ready
        
        
        
        const worker = this.#worker;
        if (!worker) return false; // never ready
        return new Promise<boolean>((resolve) => {
            let resolved = false;
            const cancelTimeout = setTimeout(() => {
                // conditions:
                if (resolved) return; // already resolved => abort
                resolved = true;      // resolved
                
                
                
                worker.removeEventListener('message', handleAnyResponse);
                resolve(false);       // wait too long => false
            }, timeout);
            
            
            
            const handleAnyResponse = () => {
                // conditions:
                if (resolved) return; // already resolved => abort
                resolved = true;      // resolved
                
                
                
                clearTimeout(cancelTimeout);
                resolve(true); // worker script is responding => true
            };
            worker.addEventListener('message', handleAnyResponse, { once: true });
            this.postPing();
        });
    }
}
