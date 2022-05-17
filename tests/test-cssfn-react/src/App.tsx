import {
    default as React,
    FC,
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



import './stylesheet1_css.ts'
import './stylesheet2_css.ts'
import { className3, mutateSheet3, toggleSheet3 } from './stylesheet3_css'
import { toggleSheet4 } from './stylesheet4_css'
import { mutateSheet5 } from './stylesheet5_css'
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
    const handleAddListItem = () => {
        const thisJsx : { item?: ToDoItemType } = {};
        const listItem : ToDoItemType = <ToDoItem name={`to do # ${++listItemIdCounter.current}`} onRemove={() => handleRemoveListItem(thisJsx.item!)} />
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
                    <button onClick={handleAddListItem}>Add new</button>
                </ul>
            </article>
        </div>
    );
}

export default App;


interface ToDoItemProps {
    name      : string
    onRemove ?: () => void
}
const ToDoItem : FC<ToDoItemProps> = (props) => {
    return (
        <li>
            <span>
                { props.name }
            </span>
            <button onClick={props.onRemove}>Remove</button>
        </li>
    )
}
type ToDoItemType = ReactElement<ToDoItemProps, typeof ToDoItem>