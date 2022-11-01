// cssfn:
import type {
    // types:
    CssKnownStandardProps,
    CssKnownShorthandProps,
}                           from '@cssfn/css-types'



export type CssPrefix =
    |''
    |'-moz-'
    |'-ms-'
    |'-o-'
    |'-webkit-'
export type JsPrefix =
    |''
    |'Moz'
    |'ms'
    |'O'
    |'Webkit'
export type BrowserType =
    |''
    |'edge'
    |'safari'
export type BrowserInfo = {
    cssPrefix   : CssPrefix
    jsPrefix    : JsPrefix
    browserType : BrowserType
}



export type PrefixedProp = {
    prop    : keyof CssKnownStandardProps | keyof CssKnownShorthandProps // required
    prefix ?: CssPrefix // optional, default to browser's CssPrefix
}