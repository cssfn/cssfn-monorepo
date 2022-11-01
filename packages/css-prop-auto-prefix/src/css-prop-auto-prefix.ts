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
        const found = cache.get(propName);
        if (found) return found;
        
        
        
        const needPrefix = prefixedPropList.find(isPropName.bind(propName))?.prefix;
        if (!needPrefix) return propName;
        
        
        
        if (needPrefix === true) {
            const prefix = browserInfo.prefix;
            if (!prefix) return propName;
            return `${prefix}${pascalCase(propName)}` as keyof CssProps;
        } // if
        
        
        
        const prefix = needPrefix;
        return `${prefix}${pascalCase(propName)}` as keyof CssProps;
    };
}
