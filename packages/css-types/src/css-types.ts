// cssfn:
import type {
    Dictionary,
}                           from '@cssfn/types'       // cssfn's types

// others libs:
import type {
    Properties,
}                           from 'csstype'       // ts defs support for cssfn



// types:

export interface CssProps extends Properties {

}

export namespace CustProps {
    export type Decl         = `--${string}`
    export type RefOne       = `var(${Decl})`
    export type Ref          = RefOne|`var(${Decl},${RefOne})`|`var(${Decl},${string})`
    export type KeyframesRef = (string & {})
    export type General      = (string & {}) | (number & {})
    export type Expr         = General|Ref | (General|Ref)[] | ((General|Ref)|(General|Ref)[]|'!important')[]
}
