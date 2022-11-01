// cssfn:
import type {
    // types:
    CssKnownStandardProps,
    CssKnownShorthandProps,
}                           from '@cssfn/css-types'



export type Prefix =
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
    prefix      : Prefix
    browserType : BrowserType
}



export type PrefixedProp = {
    prop    : keyof CssKnownStandardProps | keyof CssKnownShorthandProps | RegExp // required
    prefix ?: boolean | Prefix // optional, default to browser's Prefix
}