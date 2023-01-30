// cssfn:
import type {
    // cssfn properties:
    CssProps,
}                           from '@cssfn/css-types'

// internals:
import type {
    BrowserInfo,
    PrefixedProp,
}                           from './types.js'



// utilities:
const startsCapitalized = (propName: string): string => {
    // conditions:
    if (!propName) return propName; // ignore empty string
    
    
    
    return propName[0].toUpperCase() + propName.slice(1);
};



const getPrefixedPropList = ({prefix, browserType} : BrowserInfo) : PrefixedProp[] => [
    { prop: 'colorAdjust'      , prefix: (((prefix === 'Webkit') && (browserType !== 'safari')) || (prefix === 'O')) && `WebkitPrint` as any }, // WebkitPrintColorAdjust, all Webkit browsers (excluding Safari) and Opera uses Webkit
    { prop: 'printColorAdjust' , prefix: (((prefix === 'Webkit') && (browserType !== 'safari')) || (prefix === 'O')) && 'Webkit'             }, // WebkitPrintColorAdjust, all Webkit browsers (excluding Safari) and Opera uses Webkit
    
    { prop: /^mask/            , prefix: ((prefix === 'Webkit') || (prefix === 'O')) && 'Webkit' }, // WebkitMaskXxx, all Webkit browsers and Opera uses Webkit
    { prop: /^scrollSnap/      , prefix: (browserType === 'edge') && 'ms' }, // msScrollSnapXxx
    { prop: /^transition/      , prefix: (prefix === 'Moz') && 'Webkit'   }, // WebkitTransitionXxx, the latest Firefox remove full support and prefixed with Webkit
    { prop: 'userSelect'       , prefix: (browserType === 'safari')       }, // WebkitUserSelect, Safari is the only browser requires Webkit prefix
];



function isPropName(this: keyof CssProps, prefixedProp: PrefixedProp) {
    return this.match(prefixedProp.prop);
}
export const createCssPropAutoPrefix = (browserInfo: BrowserInfo): ((propName: keyof CssProps) => keyof CssProps) => {
    const prefixedPropList = getPrefixedPropList(browserInfo);
    const cache = new Map<keyof CssProps, keyof CssProps>();
    
    
    
    return (propName: keyof CssProps): keyof CssProps => {
        const cached = cache.get(propName);
        if (cached) return cached;
        
        
        
        const needPrefix = prefixedPropList.find(isPropName, propName)?.prefix;
        if (!needPrefix) {
            cache.set(propName, propName);
            return propName;
        } // if
        
        
        
        if (needPrefix === true) {
            const prefix = browserInfo.prefix;
            if (!prefix) {
                cache.set(propName, propName);
                return propName;
            };
            
            
            
            const prefixedPropName = `${prefix}${startsCapitalized(propName)}` as keyof CssProps;
            cache.set(propName, prefixedPropName);
            return prefixedPropName;
        } // if
        
        
        
        const prefix = needPrefix;
        const prefixedPropName = `${prefix}${startsCapitalized(propName)}` as keyof CssProps;
        cache.set(propName, prefixedPropName);
        return prefixedPropName;
    };
}
