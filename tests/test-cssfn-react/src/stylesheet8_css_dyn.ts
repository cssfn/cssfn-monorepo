import {
    style,
} from '@cssfn/core'


console.log('styleSheet 8 loaded!');


export default () => style({
    display: 'inline',
    border: [['dashed', '1px', 'black']],
    '--ss-8': '"ok"',
});