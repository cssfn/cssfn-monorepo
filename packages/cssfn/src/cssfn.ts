// cssfn:
import type {
    // types:
    Factory,
    ProductOrFactory,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssRuleCollection,
    
    CssStyleCollection,
    
    CssClassEntry,
    CssClassList,
    
    CssScopeName,
    CssScopeMap,
}                           from '@cssfn/css-types'

// other libs:
import {
    // tests:
    isBrowser,
}                           from 'is-in-browser'



// style sheets:
export const styleSheets: StyleSheet<CssScopeName>[] = [];
export const styleSheet = <TCssScopeName extends CssScopeName>(classes: ProductOrFactory<CssClassList<TCssScopeName>>, sheetId?: string): StyleSheet<TCssScopeName> => {
    const styleSheet = new StyleSheet(classes);
    if (isBrowser) {
        styleSheets.push(styleSheet);
    } // if
    return styleSheet;
}
class StyleSheet<TCssScopeName extends CssScopeName> {
    enabled          : boolean
    readonly factory : ProductOrFactory<CssClassList<TCssScopeName>>
    readonly classes : CssScopeMap<TCssScopeName>
    
    
    
    constructor(classes: ProductOrFactory<CssClassList<TCssScopeName>>) {
        this.enabled = true;
        this.factory = classes;
        this.classes = ({} as CssScopeMap<TCssScopeName>);
    }
}



// scopes:
/**
 * Defines an additional scoped styleSheet.
 * @returns A `CssClassEntry` represents a scoped styleSheet.
 */
export const scopeOf     = <TCssScopeName extends CssScopeName>(scopeName: TCssScopeName, ...styles: CssStyleCollection[]): CssClassEntry<TCssScopeName> => [
    scopeName,
    styles
];
/**
 * Defines the main styleSheet.
 * @returns A `CssClassEntry` represents a main styleSheet.
 */
export const mainScope   = (...styles: CssStyleCollection[]) => scopeOf('main' , ...styles);
/**
 * Defines an unscoped styleSheet (applied to a whole document).
 * @returns A `CssClassEntry` represents an unscoped styleSheet.
 */
export const globalScope = (...rules :  CssRuleCollection[]) => scopeOf(''     , ...rules );