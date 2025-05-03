import type {
    CssScopeList,
} from '@cssfn/css-types'
import {
    styleSheets,
    mainScope,
    scope,
} from '@cssfn/cssfn'
import {
    Subject,
}                           from 'rxjs'


const sheetScopes = new Subject<CssScopeList<'main'|'other'>|boolean>();



styleSheets(sheetScopes, { id: 'styleSheet-4'});

sheetScopes.next([
    mainScope({
        appearance: 'none',
        visibility: 'hidden'
    }),
    scope('other', {
        cursor: 'pointer',
        userSelect: 'none',
    }),
]);

let enabled = true;
export const toggleSheet4 = () => {
    enabled = !enabled;
    sheetScopes.next(enabled);
};