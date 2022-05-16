import type {
    CssStyle,
} from '@cssfn/css-types'
import {
    styleSheet,
} from '@cssfn/cssfn'
import {
    Subject,
}                           from 'rxjs'


const sheetContent = new Subject<CssStyle|boolean>();

export const className3 = styleSheet(sheetContent, { id: 'styleSheet-3'});


const colorList = ['red', 'orange', 'yellow', 'green', 'blue', 'violet', 'purple'];
let colorIndex = 0;


export const mutateSheet3 = () => {
    colorIndex = (colorIndex + 1) % colorList.length;
    
    sheetContent.next({
        opacity    : 0.5,
        visibility : 'visible',
        border     : [['solid', '1px', 'black']],
        margin     : '2rem',
        background : colorList[colorIndex],
    });
};

mutateSheet3(); // first mutation


let enabled = true;
export const toggleSheet3 = () => {
    enabled = !enabled;
    sheetContent.next(enabled);
};
