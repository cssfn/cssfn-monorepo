// import { styleSheet } from '@cssfn/cssfn'
import { createServerStyleSheetHook } from '@cssfn/cssfn-react/server'



export const useTestServerComponent = createServerStyleSheetHook(
  () => {
    // console.log('Loading dynamic import: test-server-component');
    return import('./test-server-component');
  }
, { id: 'test-server-component' });
