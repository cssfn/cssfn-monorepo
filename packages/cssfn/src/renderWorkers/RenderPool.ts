// internals:
import type {
    // types:
    Request,
    Response,
}                           from './RenderPool-types.js'
import {
    // worker:
    WorkerBase,
}                           from './WorkerBase.js'



export class RenderPool extends WorkerBase<Request, Response> {
    constructor(scriptUrl: string|URL = new URL(/* webpackChunkName: 'renderPoolScript' */ /* webpackPreload: true */ './renderPoolScript.js', import.meta.url), options: WorkerOptions = { type: 'module' }) {
        super(scriptUrl, options);
    }
}
