// types:
export type Tuple<TName, TValue>  = readonly [TName, TValue]
export type NameOf <TTuple extends Tuple<any, any>> = TTuple[0]
export type ValueOf<TTuple extends Tuple<any, any>> = TTuple[1]
export type ResponseReady = Tuple<'ready', any>
export type Response =
    |ResponseReady



export class WorkerBase<TResponse extends Response = Response> {
    //#region private fields
    #worker  : Worker|null
    #isReady : boolean
    #isError : string|Error|null
    //#endregion private fields
    
    
    
    constructor(scriptUrl: string|URL, options?: WorkerOptions) {
        // setup web worker:
        if (typeof(Worker) !== 'undefined') { // supports Web Worker
            try {
                this.#worker  = new Worker(scriptUrl, options); // try to initialize
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
            worker.onmessage = this.handleMessage;
            worker.onerror   = this.handleError;
        } // if
    }
    
    
    
    // handlers:
    handleMessage(event: MessageEvent<TResponse>) {
        const [type, payload] = event.data;
        switch (type) {
            case 'ready':
                this.handleReady(payload);
                break;
            
            // case 'future...':
        } // switch
    }
    handleError(event: ErrorEvent) {
        this.#worker?.terminate();
        this.#worker  = null;
        this.#isReady = false;
        this.#isError = event.error;
    }
    handleReady(_payload: any) {
        this.#isReady = true;
    }
    
    
    
    //#region public fields
    get isReady() { return this.#isReady }
    get isError() { return this.#isError }
    //#endregion public fields
    
    
    
    //#region public methods
    response(responseData : TResponse): void {
        const worker = this.#worker;
        if (!worker) throw Error('internal error');
        worker.postMessage(responseData);
    }
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
        });
    }
    //#endregion public methods
}
