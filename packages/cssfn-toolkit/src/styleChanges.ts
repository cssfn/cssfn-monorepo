// other libs:
import {
    Observable,
    Subject,
}                           from 'rxjs'



export const watchDependencies = (...deps: Array<Observable<void>>): Observable<void> => {
    const onStylesChange = new Subject<void>();
    
    
    
    for (const dep of deps) {
        dep.subscribe(onStylesChange.next);
    } // for
    
    
    
    return onStylesChange;
};
