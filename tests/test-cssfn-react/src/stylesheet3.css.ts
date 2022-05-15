import {
    styleSheet,
} from '@cssfn/cssfn'
import {
    Observable,
}                           from 'rxjs'



styleSheet(new Observable((observer) => {
    const colorList = ['red', 'orange', 'yellow', 'green', 'blue', 'violet', 'purple'];
    let colorIndex = 0;
    let remainingCounter = 3;
    const tickHandler = setInterval(() => {
        colorIndex = (colorIndex + 1) % colorList.length;
        
        observer.next({
            opacity    : 0.5,
            visibility : 'visible',
            color      : colorList[colorIndex],
        });
        
        remainingCounter--;
        if (!remainingCounter) clearInterval(tickHandler);
    }, 3000);
}), { id: 'styleSheet-3'});