import { createStyleSheetHook } from '@cssfn/cssfn-react'



export const useTestClientComponent = createStyleSheetHook(
  () => {
    // console.log('Loading dynamic import: test-client-component-2');
    return import('./test-client-component-2');
  }
, { id: 'test-client-component-2' });
