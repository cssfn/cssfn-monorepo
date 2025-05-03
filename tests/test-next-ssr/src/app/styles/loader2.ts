import { dynamicStyleSheet } from '@cssfn/cssfn-react'



export const useStyleSheet2 = dynamicStyleSheet(
  () => import(/* webpackChunkName: 'sheet-2' */ /* webpackPreload: true */ './styleSheet2')
, { id: 'sheet-2' });
