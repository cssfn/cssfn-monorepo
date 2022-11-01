// cssfn:
import type {
    // cssfn properties:
    CssProps,
}                           from '@cssfn/css-types'

// other libs:
import {
    pascalCase,
}                           from 'pascal-case'

// internals:
import type {
    BrowserInfo,
    PrefixedProp,
}                           from './types.js'



const getPrefixedPropList = ({prefix, browserType} : BrowserInfo) : PrefixedProp[] => [
    { prop: 'colorAdjust' , prefix: `${prefix}Print` as any }, // WebkitPrintColorAdjust
    { prop: 'mask'        , prefix: (prefix !== 'Moz') && (browserType !== 'safari') && 'Webkit' },
    { prop: /^scrollSnap/ , prefix: (prefix === 'ms') },
    { prop: 'transition'  , prefix: (prefix === 'Moz') && 'Webkit' },
    { prop: 'userSelect'  , prefix: (browserType === 'safari') },
    { prop: 'writingMode' , prefix: (prefix === 'Moz') },
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
        
        
        
        const needPrefix = prefixedPropList.find(isPropName.bind(propName))?.prefix;
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
            
            
            
            const prefixedPropName = `${prefix}${pascalCase(propName)}` as keyof CssProps;
            cache.set(propName, prefixedPropName);
            return prefixedPropName;
        } // if
        
        
        
        const prefix = needPrefix;
        const prefixedPropName = `${prefix}${pascalCase(propName)}` as keyof CssProps;
        cache.set(propName, prefixedPropName);
        return prefixedPropName;
    };
}
