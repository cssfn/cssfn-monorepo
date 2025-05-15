import { style, usesCssProps } from '@cssfn/core'
import { whatevers } from './my-css-config'

console.log('test-component module is loaded');


export default function composeStyle() {
    // debugger;
    return style({
        appearance: 'none',
        ...usesCssProps(whatevers),
    });
};
