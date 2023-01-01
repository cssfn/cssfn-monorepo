// cssfn:
import type {
    // css values:
    CssSimpleValue,
    CssComplexBaseValueOf,
    
    
    
    // css custom properties:
    CssCustomValue,
}                           from '@cssfn/css-types'



// processors:
const renderSimpleValue = (propValue: CssComplexBaseValueOf<CssSimpleValue>): string => {
    switch (typeof(propValue)) {
        case 'string' : return propValue;            // CssSimpleLiteralValue|CssCustomRef => string
        case 'number' : return '' + propValue;       // CssSimpleNumericValue              => number => string
        default       : return propValue.toString(); // CssCustomKeyframesRef              => .toString()
    } // switch
};
export const renderValue = (propValue: CssCustomValue): string => {
    if (!Array.isArray(propValue)) {
        return renderSimpleValue(propValue);
    }
    else {
        let hasImportant = false;
        let result = ''; // for a small array : a string concatenation is faster than array.join('')
        
        
        
        for (let subIndex = 0, subMax = propValue.length, propSubValue : typeof propValue[number]; subIndex < subMax; subIndex++) {
            propSubValue = propValue[subIndex];
            
            
            
            if (!Array.isArray(propSubValue)) {
                if ((subIndex >= 1) && (subIndex === (subMax - 1)) && (propSubValue === '!important')) {
                    hasImportant = true;
                }
                else {
                    if (subIndex >= 1) result += ', '; // comma separated values
                    result += renderSimpleValue(propSubValue);
                } // if
            }
            else {
                for (let subSubIndex = 0, subSubMax = propSubValue.length, propSubSubValue : typeof propSubValue[number]; subSubIndex < subSubMax; subSubIndex++) {
                    propSubSubValue = propSubValue[subSubIndex];
                    
                    
                    
                    if ((subSubIndex >= 1) && (subSubIndex === (subSubMax - 1)) && (propSubSubValue === '!important')) {
                        hasImportant = true;
                    }
                    else {
                        if ((subIndex >= 1) && (subSubIndex === 0)) result += ', '; // comma separated values
                        if (subSubIndex >= 1) result += ' '; // space separated values
                        result += renderSimpleValue(propSubSubValue);
                    } // if
                } // for
            } // if
        } // for
        
        
        
        if (hasImportant) result += ' !important';
        return result;
    } // if
};
