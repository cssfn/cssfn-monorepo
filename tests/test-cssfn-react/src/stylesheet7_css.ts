import {
    dynamicStyleSheets,
} from '@cssfn/cssfn-react'
import {
    mainScope,
    scopeOf,
} from '@cssfn/cssfn'



export const useStyleSheet7 = dynamicStyleSheets(() => [
    mainScope({
        background    : 'pink',
        color         : 'darkred',
        border        : [['solid', '1px', 'black']],
        flex          : [[0, 0, 'auto']],
        display       : 'flex',
        flexDirection :  'row',
        padding       : '0.5rem',
        gap           : '1rem',
    }),
    scopeOf('boo', {
        background: 'lightsalmon',
        color: 'darkorange',
    })
], { id: 'styleSheet-7'});