import {
    default as React,
    ReactElement,
    useReducer,
    useRef,
    useState,
} from 'react';
// import logo from './logo.svg';
import './App.css';
import { Styles } from '@cssfn/cssfn-react'
// import {
//     styleSheet,
// } from '@cssfn/cssfn'



import './stylesheet1_css'
import './stylesheet2_css'
import { className3, mutateSheet3, toggleSheet3 } from './stylesheet3_css'
import { toggleSheet4 } from './stylesheet4_css'
import { mutateSheet5 } from './stylesheet5_css'
import { useStyleSheet6 } from './stylesheet6_css'
import { useStyleSheet7 } from './stylesheet7_css'
import { useStyleSheet8 } from './stylesheet8_css'
import { TestComponent1 } from './TestComponent1';
// styleSheet(() => ({
//     display: 'flex',
//     flexDirection: 'row',
//     flexWrap: 'nowrap',
// }));

type ToDoItemAction =
    | { type: 'add'   , item: ToDoItemType }
    | { type: 'remove', item: ToDoItemType }
const toDoListReducer = (accum: ToDoItemType[], action: ToDoItemAction): ToDoItemType[] => {
    switch(action.type) {
        case 'add':
            accum.push(action.item);
            break;
        case 'remove':
            {
                const index = accum.indexOf(action.item);
                if (index !== -1) accum.splice(index, 1);
            }
            break;
    } // switch
    return accum.slice(0);
}

function App() {
    const [value, setValue] = useState(0);
    const handleTriggerRerender = () => {
        setValue(value + 1);
    };
    const [toDoList, toDoListAction] = useReducer(toDoListReducer, []);
    
    const handleRemoveListItem = (listItem: ToDoItemType) => {
        toDoListAction({
            type : 'remove',
            item : listItem
        });
    }
    const listItemIdCounter = useRef(0);
    const handleAddListItemA = () => {
        const thisJsx : { item?: ToDoItemType } = {};
        const listItem : ToDoItemType = <ToDoItemA name={`to do a# ${++listItemIdCounter.current}`} onRemove={() => handleRemoveListItem(thisJsx.item!)} />
        thisJsx.item = listItem;
        
        toDoListAction({
            type : 'add',
            item : listItem
        });
    }
    const handleAddListItemB = () => {
        const thisJsx : { item?: ToDoItemType } = {};
        const listItem : ToDoItemType = <ToDoItemB name={`to do b# ${++listItemIdCounter.current}`} onRemove={() => handleRemoveListItem(thisJsx.item!)} />
        thisJsx.item = listItem;
        
        toDoListAction({
            type : 'add',
            item : listItem
        });
    }
    const handleAddListItemC = () => {
        const thisJsx : { item?: ToDoItemType } = {};
        const listItem : ToDoItemType = <ToDoItemC name={`to do c# ${++listItemIdCounter.current}`} onRemove={() => handleRemoveListItem(thisJsx.item!)} />
        thisJsx.item = listItem;
        
        toDoListAction({
            type : 'add',
            item : listItem
        });
    }
    
    
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
                <button onClick={toggleSheet4}>
                    toggle sheet #4
                </button>
            </article>
            <article className='toDoList'>
                <ul>
                    { toDoList.map((toDoItem, index) =>
                        React.cloneElement(toDoItem, { key: index })
                    ) }
                </ul>
                <button onClick={handleAddListItemA}>Add new A</button>
                <button onClick={handleAddListItemB}>Add new B</button>
                <button onClick={handleAddListItemC}>Add new C</button>
            </article>
            <article>
                <TestComponent1 />
            </article>
        </div>
    );
}

export default App;


interface ToDoItemProps {
    name      : string
    onRemove ?: () => void
}
const ToDoItemA  = (props: ToDoItemProps): JSX.Element|null => {
    const classes = useStyleSheet6();
    return (
        <li className={classes.main}>
            <span>
                { props.name }
            </span>
            <button onClick={props.onRemove}>Remove</button>
        </li>
    )
}
const ToDoItemB  = (props: ToDoItemProps): JSX.Element|null => {
    const classes = useStyleSheet7();
    return (
        <li className={classes.main}>
            <span>
                { props.name }
            </span>
            <button onClick={props.onRemove}>Remove</button>
        </li>
    )
}
const ToDoItemC  = (props: ToDoItemProps): JSX.Element|null => {
    const classes = useStyleSheet7();
    return (
        <li className={classes.main}>
            <ToDoItemCC {...props} />
            <button onClick={props.onRemove}>Remove</button>
        </li>
    )
}
const ToDoItemCC = (props: ToDoItemProps): JSX.Element|null => {
    const classes = useStyleSheet8();
    return (
        <span className={classes.main}>
            { props.name }
        </span>
    );
}
type ToDoItemType = ReactElement<ToDoItemProps, typeof ToDoItemA | typeof ToDoItemB | typeof ToDoItemC>