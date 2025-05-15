import { createStyleSheetHook } from '@cssfn/cssfn-react'



export const useTestComponentStyles = createStyleSheetHook(
  () => {
    // console.log('Loading dynamic import: test-client-component');
    return import('./test-component');
  }
, { id: 'test-component' });

console.log('registered: useTestComponentStyles');
