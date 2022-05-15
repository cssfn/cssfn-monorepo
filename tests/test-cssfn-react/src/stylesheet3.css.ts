import {
    styleSheet,
} from '@cssfn/cssfn'
import {
    Observable,
}                           from 'rxjs'



styleSheet(new Observable((observer) => {
    const colorList = ['red', 'orange', 'yellow', 'green', 'blue', 'violet', 'purple'];
    let colorIndex = 0;
    setInterval(() => {
        colorIndex = (colorIndex + 1) % colorList.length;
        
        observer.next({
            opacity    : 0.5,
            visibility : 'visible',
            color      : colorList[colorIndex],
        });
    }, 5000);
}), { id: 'styleSheet-3'});