import {
    default as React,
    useState,
} from 'react';
// import logo from './logo.svg';
import './App.css';
import { Styles } from '@cssfn/cssfn-react'
// import {
//     styleSheet,
// } from '@cssfn/cssfn'



import './stylesheet1.css.ts'
import './stylesheet2.css.ts'
import './stylesheet3.css.ts'
// styleSheet(() => ({
//     display: 'flex',
//     flexDirection: 'row',
//     flexWrap: 'nowrap',
// }));



function App() {
    const [value, setValue] = useState(0);
    const handleTriggerRerender = () => {
        setValue(value + 1);
    };
    
    
    console.log('');
    console.log('<App> render!');
    return (
        <div className="App">
            <article>
                <p>
                    Loaded stylesheets:
                </p>
                <div className='stylesheet-view'>
                    <Styles />
                </div>
            </article>
            <article>
                <button onClick={handleTriggerRerender}>
                    Trigger re-render whole app
                </button>
            </article>
        </div>
    );
}

export default App;
