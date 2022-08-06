import {
    dynamicStyleSheet,
} from '@cssfn/cssfn-react'



export const useStyleSheet6 = dynamicStyleSheet(() => ({
    background    : 'lightblue',
    color         : 'darkblue',
    border        : [['solid', '1px', 'black']],
    flex          : [[0, 0, 'auto']],
    display       : 'flex',
    flexDirection :  'row',
    padding       : '0.5rem',
    gap           : '1rem',
}), { id: 'styleSheet-6'});