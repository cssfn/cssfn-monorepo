// cssfn:
import type {
    // css values:
    CssSimpleValue,
    CssComplexBaseValueOf,
    
    
    
    // css custom properties:
    CssCustomValue,
}                           from '@cssfn/css-types'



// processors:
const renderSimpleValue = (value: CssComplexBaseValueOf<CssSimpleValue>): string => {
    if (typeof(value) === 'number') return `${value}`; // CssSimpleNumericValue              => number => string
    if (typeof(value) === 'string') return value;      // CssSimpleLiteralValue|CssCustomRef => string
    return value.toString();                           // CssCustomKeyframesRef              => .toString()
};
type ReducedRenderSubValues  = { hasImportant: boolean, rendered: string[] }
const reducedRenderSubValues : ReducedRenderSubValues = { hasImportant: false, rendered: [] }
const reduceRenderSubValues  = (accum: ReducedRenderSubValues, subValue: Extract<CssCustomValue, Array<any>>[number], index: number, array: Extract<CssCustomValue, Array<any>>[number][]): ReducedRenderSubValues => {
    if (!Array.isArray(subValue)) {
        if (typeof(subValue) === 'number') {
            accum.rendered.push(
                `${subValue}`       // CssSimpleNumericValue              => number => string
            );
        }
        else if ((index === (array.length - 1)) && (subValue === '!important')) {
            accum.hasImportant = true;
        }
        else if (typeof(subValue) === 'string') {
            accum.rendered.push(
                subValue            // CssSimpleLiteralValue|CssCustomRef => string
            );
        }
        else {
            accum.rendered.push(
                subValue.toString() // CssCustomKeyframesRef              => .toString()
            );
        } // if
    }
    else {
        accum.rendered.push(
            subValue
            .map(renderSimpleValue)
            .join(' ')              // [[double array]]                   => join separated with [space]
        );
    } // if
    
    
    
    return accum;
};
export const renderValue = (value: CssCustomValue): string => {
    if (!Array.isArray(value)) return renderSimpleValue(value); // CssComplexBaseValueOf<CssSimpleValue>
    
    
    
    try {
        (value as Extract<CssCustomValue, Array<any>>[number][]).reduce(reduceRenderSubValues, reducedRenderSubValues);
        
        
        
        return (
            reducedRenderSubValues.rendered
            .join(', ') // comma_separated_values
            
            +
            
            (reducedRenderSubValues.hasImportant ? ' !important' : '')
        );
    }
    finally {
        // reset the accumulator to be used later:
        reducedRenderSubValues.hasImportant = false;
        reducedRenderSubValues.rendered.splice(0);
    } // try
};
