
import {
    default as React,
} from 'react'
import {
    dynamicStyleSheet,
} from '@cssfn/cssfn-react'
import { style } from '@cssfn/cssfn';



export function tadaa() {
    console.log('created: SSTestComponent6');
}
export function SSTestComponent6() {
    tadaa();
    return style({
        '--name': '"comp 6"',
        cursor: 'pointer',
        pointerEvents: 'auto',
    });
}
export const useStyleSheetTestComponent6 = dynamicStyleSheet(SSTestComponent6, { id: 'SS-TestComponent6'});


const TestComponent6 = () => {
    const sheet = useStyleSheetTestComponent6();
    return (
        <button className={sheet.main}>
            test component 6
        </button>
    )
}
export {
    TestComponent6,
}