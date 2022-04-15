// cssfn:
import type {
    // types:
    Factory,
    ProductOrFactory,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssClassList,
    CssScopeName,
    CssScopeMap,
}                           from '@cssfn/css-types'



export const createUseSheet = <TCssScopeName extends CssScopeName = CssScopeName>(classes: ProductOrFactory<CssClassList<TCssScopeName>>, sheetId?: string): Factory<CssScopeMap<TCssScopeName>> => {
    throw Error('under construction');
}
