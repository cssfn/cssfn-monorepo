
import {
    default as React,
} from 'react'
import {
    dynamicStyleSheet,
} from '@cssfn/cssfn-react'
import { style } from '@cssfn/cssfn';



export function tadaa() {
    console.log('created: SSTestComponent3');
}
export function SSTestComponent3() {
    tadaa();
    return style({
        display: 'grid',
        background: 'blue',
        color: 'lightblue',
    });
}
export const useStyleSheetTestComponent3 = dynamicStyleSheet(SSTestComponent3, { id: 'SS-TestComponent3'});


const TestComponent3 = () => {
    const sheet = useStyleSheetTestComponent3();
    return (
        <button className={sheet.main}>
            test component 3
        </button>
    )
}
export {
    TestComponent3,
}