
import {
    default as React,
} from 'react'
import {
    dynamicStyleSheet,
} from '@cssfn/cssfn-react'
import { style } from '@cssfn/cssfn';



export function tadaa() {
    console.log('created: SSTestComponent4');
}
export function SSTestComponent4() {
    tadaa();
    return style({
        '--name': '"comp 4"',
        display: 'block',
        opacity: 0.5,
    });
}
export const useStyleSheetTestComponent4 = dynamicStyleSheet(SSTestComponent4, { id: 'SS-TestComponent4'});


const TestComponent4 = () => {
    const sheet = useStyleSheetTestComponent4();
    return (
        <button className={sheet.main}>
            test component 4
        </button>
    )
}
export {
    TestComponent4,
}