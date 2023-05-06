import {
    style,
}                           from '@cssfn/cssfn'
import {
    usesCssProps,
}                           from '@cssfn/css-config'
import {
    createStylePack,
}                           from '@cssfn/cssfn-toolkit'
import {
    Observable,
}                           from 'rxjs'
import './jest-custom'



const result = createStylePack({
    name   : 'basic',
    plural : 'basics',
    prefix : 'bsc',
    
    
    
    deps   : [
        /* empty */
    ],
    
    
    
    config : () => ({
        backg  : 'transparent',
        foregr : 'black',
    }),
    
    
    
    mixins : {
        layout     : (counter: number, flip: boolean) => style({
            display: 'block',
            ...usesCssProps(basics),
        }),
        variants   : () => style({
            color: 'red',
        }),
        styleSheet : () => style({
            ...basicLayout(123, true),
            ...basicVariants(),
        }),
    },
});
const {
    basics,
    basicValues,
    cssBasicConfig,
    
    basicLayout,
    basicVariants,
    // basicStyleSheet,
} = result;



test(`basics`, () => {
    expect(basics.backg)
    .toBe('var(--bsc-backg)');
    
    expect(basics.foregr)
    .toBe('var(--bsc-foregr)');
});



test(`basicValues`, () => {
    expect(basicValues.backg)
    .toBe('transparent');
    
    expect(basicValues.foregr)
    .toBe('black');
});



test(`cssBasicConfig`, () => {
    expect(cssBasicConfig.prefix)
    .toBe('bsc');
    
    expect(cssBasicConfig.selector)
    .toBe(':root');
    
    expect(cssBasicConfig.onChange instanceof Observable)
    .toBe(true);
    
    expect(cssBasicConfig.notifyChanged instanceof Function)
    .toBe(true);
});



// console.log(basicLayout(123, true))
// console.log(basicVariants())
// console.log(basicStyleSheet())
