import { atGlobal, rule, style } from '@cssfn/core'



export default () => {
    // debugger;
    return style({
        '--sheet2': '"sheet2"',
        background: 'lightblue',
        color: 'darkblue',
        ...atGlobal({
            ...rule('body', {
                background: 'pink',
            })
        })
    });
};

// debugger;
console.log('module sheet 2 loaded!');