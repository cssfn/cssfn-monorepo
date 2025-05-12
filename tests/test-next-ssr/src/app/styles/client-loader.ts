import { createStyleSheetHook } from '@cssfn/cssfn-react'



export const useTestClientComponent = createStyleSheetHook(
  () => {
    // console.log('Loading dynamic import: test-client-component');
    return import('./test-client-component');
  }
, { id: 'test-client-component' });
