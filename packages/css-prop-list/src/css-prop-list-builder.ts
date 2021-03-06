/**
 * This script is a tool for building and compressing the source of __css_prop_list__ (`known-css-props.ts`).
 * 
 * This script __is_not_exported__ to this package entry point,
 * so it wouldn't affected to client's project performance.
 * 
 * -== just a script for making a script ==-
 * The final script is `css-prop-list.ts` => `css-prop-list.js`
 */



// cssfn:
import {
    createBulkList,
}                           from '@cssfn/bulk-list-builder'
// internals:
import {
    standardLonghandProps,
    standardShorthandProps,
    svgProps,
}                           from './known-css-props.js'



const { encodedSortedWordList, encodedIndexedList } = createBulkList([
    ...standardLonghandProps,
    ...standardShorthandProps,
    ...svgProps,

    'foreg',
    'backg',
    'backgClip',
    'anim',
    'transf',
    'gapX',
    'gapY',
    'gapInline',
    'gapBlock',
]);



// show the result:
console.log(encodedSortedWordList);
console.log(encodedIndexedList);
console.log('succcess. Please copy the results above to your script!');
debugger;
