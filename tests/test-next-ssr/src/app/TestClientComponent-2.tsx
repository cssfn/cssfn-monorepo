'use client'

import { useTestClientComponent } from './styles/client-loader-2'



export function TestClientComponent2() {
    const sheet2 = useTestClientComponent();
    
    return (
        <button className={sheet2.main}>
            Test 2
        </button>
    );
}