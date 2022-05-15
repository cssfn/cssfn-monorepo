import {
    default as React,
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
        </div>
    );
}

export default App;
