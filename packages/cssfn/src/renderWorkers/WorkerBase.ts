// internals:
import type {
    // types:
    Tuple,
    
    
    
    // requests:
    RequestPing,
}                           from './WorkerBase-types.js'



export interface WorkerBaseConfigs {
    onReady ?: () => void
    onError ?: (error: Error|string|null|undefined) => void
}
export class WorkerBase<TRequest extends Tuple<string, any>, TResponse extends Tuple<string, any>> {
    // private properties:
    private _configs : WorkerBaseConfigs|undefined
    private _worker  : Worker|null
    private _isReady : boolean
    private _isError : Error|string|null|undefined
    
    
    
    // constructors:
    protected createWorker(): Worker {
        throw Error('not implemented');
    }
    constructor(configs?: WorkerBaseConfigs) {
        // configs:
        this._configs = configs;
        
        
        
        // setup web worker:
        if (typeof(Worker) !== 'undefined') { // supports Web Worker
            try {
                this._worker  = this.createWorker(); // try to initialize
                this._isReady = false; // not yet ready
                this._isError = null;  // not yet having error
            }
            catch (error) {
                this._worker  = null;  // Web Worker initialization was failed
                this._isReady = false; // never ready
                this._isError = (      // the causing error:
                    !error
                    ?
                    Error() // avoids null|undefined|empty_string => nullish
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
            this._worker  = null;  // Web Worker is not available
            this._isReady = false; // never ready
            this._isError = Error('Web Worker is not supported');
        } // if
        
        
        
        // configure web worker:
        const worker = this._worker;
        if (worker) {
            worker.onmessage = (event: MessageEvent<TResponse>) => {
                this.handleResponse(event);
            };
            worker.onerror   = ({error}: ErrorEvent) => {
                const errorParam : Error|string|null|undefined = (
                    !error
                    ?
                    Error() // avoids null|undefined|empty_string => nullish
                    :
                    (
                        (error instanceof Error)
                        ?
                        error
                        :
                        `${error}` // stringify
                    )
                );
                this.handleError(errorParam);
            };
        } // if
    }
    
    
    
    // requests:
    protected postRequest(requestData : TRequest, transfer?: Transferable[]): void {
        const worker = this._worker;
        if (!worker) throw Error('internal error');
        if (transfer) {
            worker.postMessage(requestData, transfer);
        }
        else {
            worker.postMessage(requestData);
        } // if
    }
    protected postPing(): void {
        const requestPing : RequestPing = ['ping', undefined];
        this.postRequest(requestPing as TRequest);
    }
    
    
    
    // responses:
    protected handleResponse(_event: MessageEvent<TResponse>): void {
        // any responses are treated as ready status:
        if (!this._isReady) this.handleReady();
    }
    protected handleError(error: Error|string|null|undefined): void {
        this._worker?.terminate();
        this._worker  = null;
        this._isReady = false;
        this._isError = error || Error(); // avoids null|undefined|empty_string => nullish
        
        this._configs?.onError?.(error);
    }
    protected handleReady(): void {
        this._isReady = true;
        
        this._configs?.onReady?.();
    }
    
    
    
    // public properties:
    get isReady() { return this._isReady }
    get isError() { return this._isError }
    
    
    
    // public methods:
    async ensureReady(timeout = 100/*ms*/): Promise<boolean> {
        if (this._isError) return false; // never ready
        if (this._isReady) return true;  // was ready
        
        
        
        const worker = this._worker;
        if (!worker) return false; // never ready
        return new Promise<boolean>((resolve) => {
            let resolved = false;
            const cancelTimeout = (timeout === Infinity) ? undefined : setTimeout(() => {
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
            this.postPing(); // trigger the script to response
        });
    }
}
