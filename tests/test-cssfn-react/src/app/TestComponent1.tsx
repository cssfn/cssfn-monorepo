
import {
    default as React,
} from 'react'
import {
    dynamicStyleSheet,
} from '@cssfn/cssfn-react'
import { style } from '@cssfn/cssfn';



export function SSTestComponent1() {
    console.log('created');
    return style({
        appearance: 'none',
        display: 'flex',
        background: 'pink',
        color: 'darkred',
    });
}
export const useStyleSheetTestComponent1 = dynamicStyleSheet(SSTestComponent1, { id: 'SS-TestComponent1'});


const TestComponent1 = () => {
    const sheet = useStyleSheetTestComponent1();
    return (
        <button className={sheet.main}>
            test component 1
        </button>
    )
}
export {
    TestComponent1,
}