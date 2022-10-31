
import {
    default as React,
} from 'react'
import {
    dynamicStyleSheet,
} from '@cssfn/cssfn-react'
import { style } from '@cssfn/cssfn';



export function tadaa() {
    console.log('created: SSTestComponent5');
}
export function SSTestComponent5() {
    tadaa();
    return style({
        '--name': '"comp 5"',
        border: 'none',
        padding: '1rem',
    });
}
export const useStyleSheetTestComponent5 = dynamicStyleSheet(SSTestComponent5, { id: 'SS-TestComponent5'});


const TestComponent5 = () => {
    const sheet = useStyleSheetTestComponent5();
    return (
        <button className={sheet.main}>
            test component 5
        </button>
    )
}
export {
    TestComponent5,
}