import { ensureRendererWorkersReady } from '@cssfn/cssfn'



// an optional performance tweak: make sure the WebWorker(s) are running before we're busy rendering the DOM:
await ensureRendererWorkersReady();
