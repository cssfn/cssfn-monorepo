// cssfn:
import type {
    // types:
    Factory,
    ProductOrFactory,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssRuleCollection,
    
    CssStyleCollection,
    
    CssClassEntry,
    CssClassList,
    
    CssScopeName,
    CssScopeMap,
}                           from '@cssfn/css-types'

// other libs:
import {
    // tests:
    isBrowser,
}                           from 'is-in-browser'
import {
    Subject,
}                           from 'rxjs'



// style sheets:

export interface StyleSheetOptions {
    enabled ?: boolean
    id      ?: string
}
const defaultStyleSheetOptions : Required<StyleSheetOptions> = {
    enabled  : true,
    id       : '',
}

class StyleSheet<TCssScopeName extends CssScopeName> {
    //#region private properties
    #options     : Required<StyleSheetOptions>
    #subscribers : Subject<StyleSheet<TCssScopeName>>
    
    #factory     : ProductOrFactory<CssClassList<TCssScopeName>>
    #classes     : CssScopeMap<TCssScopeName>
    //#endregion private properties
    
    
    
    //#region constructors
    constructor(classes: ProductOrFactory<CssClassList<TCssScopeName>>, options: Required<StyleSheetOptions>) {
        this.#options = {
            ...options,
            enabled : options.enabled ?? defaultStyleSheetOptions.enabled,
            id      : options.id      ?? defaultStyleSheetOptions.id,
        };
        this.#subscribers = new Subject<StyleSheet<TCssScopeName>>();
        
        this.#factory     = classes;
        this.#classes     = ({} as CssScopeMap<TCssScopeName>);
    }
    //#endregion constructors
    
    
    
    //#region public options
    get enabled() { return this.#options.enabled }
    set enabled(value: boolean) {
        if (this.#options.enabled === value) return; // no change => no need to update
        
        this.#options.enabled = value; // update
        this.#subscribers.next(this);  // notify a StyleSheet updated
    }
    
    get id() { return this.#options.id }
    set id(value: string) {
        if (this.#options.id === value) return; // no change => no need to update
        
        this.#options.id = value;      // update
        this.#subscribers.next(this);  // notify a StyleSheet updated
    }
    //#endregion public options
    
    
    
    //#region public properties
    get factory() {
        return this.#factory;
    }
    
    get classes() {
        return this.#classes;
    }
    //#endregion public properties
    
    
    
    //#region public methods
    subscribe(subscriber: (styleSheet: StyleSheet<TCssScopeName>) => void) {
        return this.#subscribers.subscribe(subscriber); // listen for future updates
    }
    //#endregion public methods
}



class StyleSheetRegistry {
    //#region private properties
    #styleSheets : StyleSheet<CssScopeName>[] = []
    #subscribers : Subject<StyleSheet<CssScopeName>>
    //#endregion private properties
    
    
    
    //#region constructors
    constructor() {
        this.#subscribers = new Subject<StyleSheet<CssScopeName>>();
    }
    //#endregion constructors
    
    
    
    //#region public methods
    add<TCssScopeName extends CssScopeName>(classes: ProductOrFactory<CssClassList<TCssScopeName>>, options = defaultStyleSheetOptions) {
        const newStyleSheet = new StyleSheet<TCssScopeName>(classes, options);
        
        if (isBrowser) { // client side only
            this.#styleSheets.push(newStyleSheet as any);  // register to collection
            
            
            
            this.#subscribers.next(newStyleSheet as any);  // notify a StyleSheet added
            
            newStyleSheet.subscribe((styleSheet) => {      // listen for future updates
                this.#subscribers.next(styleSheet as any); // notify a StyleSheet updated
            });
        } // if
        
        return newStyleSheet;
    }
    
    subscribe(subscriber: (styleSheet: StyleSheet<CssScopeName>) => void) {
        if (!isBrowser) return; // client side only
        
        
        
        //#region notify previously registered StyleSheet(s)
        const styleSheets = this.#styleSheets;
        for (let i = 0; i < styleSheets.length; i ++) {
            const styleSheet = styleSheets[i];
            if (!styleSheet.enabled) continue; // skip disabled styleSheet
            
            subscriber(styleSheet);
        } // for
        //#endregion notify previously registered StyleSheet(s)
        
        return this.#subscribers.subscribe(subscriber); // listen for future updates
    }
    //#endregion public methods
}



export const styleSheets = new StyleSheetRegistry();
export const styleSheet = <TCssScopeName extends CssScopeName>(classes: ProductOrFactory<CssClassList<TCssScopeName>>, options = defaultStyleSheetOptions): StyleSheet<TCssScopeName> => {
    return styleSheets.add(classes, options);
}
