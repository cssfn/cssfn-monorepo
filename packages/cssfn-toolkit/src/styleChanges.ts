// other libs:
import {
    Observable,
    Subject,
}                           from 'rxjs'



export const watchChanges = (...deps: Array<Observable<void>>): Observable<void> => {
    const onStylesChange = new Subject<void>();
    
    
    
    for (const dep of deps) {
        // dep.subscribe(onStylesChange.next);
        dep.subscribe(() => onStylesChange.next()); // workaround for `this === undefined` issue
    } // for
    
    
    
    return onStylesChange;
};
