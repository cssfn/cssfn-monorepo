import { styleSheet } from '@cssfn/cssfn'



export const styleSheet2 = styleSheet(
  () => {
    console.log('LOADING SERVER DYNAMIC IMPORT...');
    return import(/* webpackChunkName: 'sheet-2' */ /* webpackPreload: true */ './styleSheet2');
  }
, { id: 'sheet-2-server' });
