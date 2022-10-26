import React from 'react';
import '@cssfn/cssfn-dom'
import './components/TestComponent1'
import { TestComponent2 } from './components/TestComponent2'
import { TestComponent3 } from './components/TestComponent3'



function App() {
    return (
        <div className="App">
            test
            <TestComponent2 />
            <TestComponent3 />
        </div>
    );
}

export default App;
