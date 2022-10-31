import React from 'react';
import '@cssfn/cssfn-dom'
import './components/TestComponent1'
import { TestComponent2 } from './components/TestComponent2'
import { TestComponent3 } from './components/TestComponent3'
import { TestComponent4 } from './components/TestComponent4'
import { TestComponent5 } from './components/TestComponent5'
import { TestComponent6 } from './components/TestComponent6'



function App() {
    return (
        <div className="App">
            test
            <TestComponent2 />
            <TestComponent3 />
            <TestComponent4 />
            <TestComponent5 />
            <TestComponent6 />
        </div>
    );
}

export default App;
