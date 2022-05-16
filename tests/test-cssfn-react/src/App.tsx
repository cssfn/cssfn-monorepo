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



import './stylesheet1_css.ts'
import './stylesheet2_css.ts'
import { className3, mutateSheet3, toggleSheet3 } from './stylesheet3_css'
import './stylesheet4_css.ts'
import { mutateSheet5 } from './stylesheet5_css'
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
                <div className={className3}>
                    test sheet #3
                </div>
            </article>
            <article className='actions'>
                <button onClick={handleTriggerRerender}>
                    Trigger re-render whole app
                </button>
                <button onClick={mutateSheet3}>
                    Mutate sheet #3
                </button>
                <button onClick={() =>{mutateSheet3(); mutateSheet5();}}>
                    Mutate sheet #3 &amp; sheet #5
                </button>
                <button onClick={toggleSheet3}>
                    toggle sheet #3
                </button>
            </article>
        </div>
    );
}

export default App;
