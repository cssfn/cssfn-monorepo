import React from 'react';
import '@cssfn/cssfn-dom'
import './components/TestComponent1'
import { TestComponent2 } from './components/TestComponent2'



function App() {
    return (
        <div className="App">
            test
            <TestComponent2 />
        </div>
    );
}

export default App;
