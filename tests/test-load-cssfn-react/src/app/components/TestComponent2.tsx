
import {
    default as React,
} from 'react'
import {
    dynamicStyleSheet,
} from '@cssfn/cssfn-react'
import { style } from '@cssfn/cssfn';



export function tadaa() {
    console.log('created: SSTestComponent2');
}
export function SSTestComponent2() {
    tadaa();
    return style({
        '--name': '"comp 2"',
        appearance: 'none',
        display: 'flex',
        background: 'pink',
        color: 'darkred',
    });
}
export const useStyleSheetTestComponent2 = dynamicStyleSheet(SSTestComponent2, { id: 'SS-TestComponent2'});


const TestComponent2 = () => {
    const sheet = useStyleSheetTestComponent2();
    return (
        <button className={sheet.main}>
            test component 2
        </button>
    )
}
export {
    TestComponent2,
}