'use client'

import { useTestClientComponent } from './styles/client-loader'



export function TestClientComponent() {
    const sheet2 = useTestClientComponent();
    
    return (
        <button className={sheet2.main}>
            Test Client Component
        </button>
    );
}