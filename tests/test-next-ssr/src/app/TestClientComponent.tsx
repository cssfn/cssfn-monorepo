'use client'

import { useStyleSheet2 } from './styles/loader2'



export function TestClientComponent() {
    const sheet2 = useStyleSheet2();
    
    return (
        <button className={sheet2.main}>
            Test 2
        </button>
    );
}