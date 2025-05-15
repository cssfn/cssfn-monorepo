'use client'

import { useTestComponentStyles } from './styles/client-loader'



export function TestComponent() {
    const sheet2 = useTestComponentStyles();
    
    return (
        <button className={sheet2.main}>
            Test Component
        </button>
    );
}