import {
    CssStyle,
} from '@cssfn/css-types'
import {
    styleSheet,
} from '@cssfn/cssfn'
import {
    Subject,
}                           from 'rxjs'


const sheetContent = new Subject<CssStyle>();

export const className5 = styleSheet(sheetContent, { id: 'styleSheet-5'});


const colorList = ['red', 'orange', 'yellow', 'green', 'blue', 'violet', 'purple'];
let colorIndex = 5;


export const mutateSheet5 = () => {
    colorIndex = (colorIndex + 1) % colorList.length;
    
    sheetContent.next({
        display    : 'grid',
        margin     : '2rem',
        color      : colorList[colorIndex],
    });
};

mutateSheet5(); // first mutation
