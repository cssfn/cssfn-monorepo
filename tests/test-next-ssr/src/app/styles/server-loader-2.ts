import { styleSheet } from '@cssfn/cssfn'



export const styleSheet2 = styleSheet(
  () => {
    // console.log('Loading dynamic import: test-server-component-2');
    return import('./test-server-component-2');
  }
, { id: 'test-server-component-2' });
