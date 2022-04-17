import type {
    CssStyle,
} from '@cssfn/css-types'
import {
    mergeLiteral,
    mergeParent,
    mergeNested,
    mergeStyles,
} from '../src/compiler'



//#region test mergeLiteral()
test(`mergeLiteral({empty}, {empty})`, () => {
    const mainStyle: CssStyle = {
        /* empty */
    };
    const addStyle: CssStyle = {
        /* empty */
    };
    mergeLiteral(mainStyle, addStyle);
    expect(mainStyle)
    .toEqual({
        /* empty */
    });
});

test(`mergeLiteral({some}, {empty})`, () => {
    const mainStyle: CssStyle = {
        background: 'red',
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
    };
    const addStyle: CssStyle = {
        /* empty */
    };
    mergeLiteral(mainStyle, addStyle);
    expect(mainStyle)
    .toEqual({
        background: 'red',
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
    });
});

test(`mergeLiteral({empty}, {some})`, () => {
    const mainStyle: CssStyle = {
        /* empty */
    };
    const addStyle: CssStyle = {
        background: 'red',
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
    };
    mergeLiteral(mainStyle, addStyle);
    expect(mainStyle)
    .toEqual({
        background: 'red',
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
    });
});

test(`mergeLiteral({some+symbols}, {empty})`, () => {
    const symbol1 = Symbol('symbol1');
    const symbol2 = Symbol('symbol2');
    const mainStyle: CssStyle = {
        background: 'red',
        color: 'blue',
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
        paddingInline: '2rem',
    };
    const addStyle: CssStyle = {
        /* empty */
    };
    mergeLiteral(mainStyle, addStyle);
    expect(mainStyle)
    .toEqual({
        background: 'red',
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
    });
});

test(`mergeLiteral({empty}, {some+symbols})`, () => {
    const symbol1 = Symbol('symbol1');
    const symbol2 = Symbol('symbol2');
    const mainStyle: CssStyle = {
        /* empty */
    };
    const addStyle: CssStyle = {
        background: 'red',
        color: 'blue',
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
        paddingInline: '2rem',
    };
    mergeLiteral(mainStyle, addStyle);
    expect(mainStyle)
    .toEqual({
        background: 'red',
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
    });
});

test(`mergeLiteral({some}, {some})`, () => {
    const mainStyle: CssStyle = {
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
    };
    const addStyle: CssStyle = {
        background: 'red',
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
    };
    mergeLiteral(mainStyle, addStyle);
    expect(mainStyle)
    .toEqual({
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        background: 'red',
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
    });
});

test(`mergeLiteral({some+symbols}, {some+symbols})`, () => {
    const symbol1 = Symbol('symbol1');
    const symbol2 = Symbol('symbol2');
    const symbol3 = Symbol('symbol3');
    const symbol4 = Symbol('symbol4');
    const mainStyle: CssStyle = {
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        color: 'blue',
        opacity: 0.5,
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
        border: [['solid', '2px', 'dashed']],
    };
    const addStyle: CssStyle = {
        background: 'red',
        [symbol3]: {
            justifySelf: 'stretch',
            flex: [[0, 0, 'auto']],
        },
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        [symbol4]: {
            cursor: 'pointer',
            opacity: 0.9,
        },
        paddingInline: '2rem',
    };
    mergeLiteral(mainStyle, addStyle);
    expect(mainStyle)
    .toEqual({
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        background: 'red',
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
        [symbol3]: {
            justifySelf: 'stretch',
            flex: [[0, 0, 'auto']],
        },
        [symbol4]: {
            cursor: 'pointer',
            opacity: 0.9,
        },
    });
});

test(`mergeLiteral({conflict}, {conflict})`, () => {
    const mainStyle: CssStyle = {
        background: 'red',
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
    };
    const addStyle: CssStyle = {
        appearance: 'none',
        opacity: 0.85,
        display: 'flex',
        boxShadow: [
            ['10px', '5px', '5px', 'black'],
            ['30px', '20px', 'purple'],
        ],
        background: 'black',
    };
    mergeLiteral(mainStyle, addStyle);
    expect(mainStyle)
    .toEqual({
        color: 'blue',
        border: [['solid', '2px', 'dashed']],
        paddingInline: '2rem',
        
        appearance: 'none',
        opacity: 0.85,
        display: 'flex',
        boxShadow: [
            ['10px', '5px', '5px', 'black'],
            ['30px', '20px', 'purple'],
        ],
        background: 'black',
    });
});

test(`mergeLiteral({conflict+symbols}, {conflict+symbols})`, () => {
    const symbol1 = Symbol('symbol1');
    const symbol2 = Symbol('symbol2');
    const symbol3 = Symbol('symbol3');
    const symbol4 = Symbol('symbol4');
    const mainStyle: CssStyle = {
        background: 'red',
        color: 'blue',
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
    };
    const addStyle: CssStyle = {
        appearance: 'none',
        opacity: 0.85,
        display: 'flex',
        [symbol3]: {
            justifySelf: 'stretch',
            flex: [[0, 0, 'auto']],
        },
        boxShadow: [
            ['10px', '5px', '5px', 'black'],
            ['30px', '20px', 'purple'],
        ],
        [symbol4]: {
            cursor: 'pointer',
            opacity: 0.9,
        },
        background: 'black',
    };
    mergeLiteral(mainStyle, addStyle);
    expect(mainStyle)
    .toEqual({
        color: 'blue',
        border: [['solid', '2px', 'dashed']],
        paddingInline: '2rem',
        
        appearance: 'none',
        opacity: 0.85,
        display: 'flex',
        boxShadow: [
            ['10px', '5px', '5px', 'black'],
            ['30px', '20px', 'purple'],
        ],
        background: 'black',
        
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
        [symbol3]: {
            justifySelf: 'stretch',
            flex: [[0, 0, 'auto']],
        },
        [symbol4]: {
            cursor: 'pointer',
            opacity: 0.9,
        },
    });
});
//#endregion test mergeLiteral()



//#region test mergeParent()
test(`mergeParent( &{empty} )`, () => {
    const mainStyle: CssStyle = {
        /* empty */
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        /* empty */
    });
});

test(`mergeParent( &{unique} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol(':active&');
    const rule3 = Symbol('@media (min-width: 900px)');
    const rule4 = Symbol('@supports (display: grid)');
    const rule5 = Symbol('@global');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeParent( &{same-all} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('&:hover');
    const rule3 = Symbol('&:hover');
    const rule4 = Symbol('&:hover');
    const rule5 = Symbol('&:hover');
    const root  = Symbol('&:hover');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeParent( &{same-partial} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('@supports (display: grid)');
    const rule3 = Symbol('&:hover');
    const rule4 = Symbol('@supports (display: grid)');
    const rule5 = Symbol('@supports (display: grid)');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeParent( &{same-partial} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol(':active&');
    const rule3 = Symbol('&:active');
    const rule4 = Symbol(':active&');
    const rule5 = Symbol('&:hover');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeParent( &{same-partial empty-partial} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('@supports (display: grid)');
    const rule3 = Symbol('&:hover');
    const rule4 = Symbol('@supports (display: grid)');
    const rule5 = Symbol('@supports (display: grid)');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeParent( &{same-partial empty-partial} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('@supports (display: grid)');
    const rule3 = Symbol('&:hover');
    const rule4 = Symbol('@supports (display: grid)');
    const rule5 = Symbol('@supports (display: grid)');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeParent( &{same-partial empty-all} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('@supports (display: grid)');
    const rule3 = Symbol('&:hover');
    const rule4 = Symbol('@supports (display: grid)');
    const rule5 = Symbol('@supports (display: grid)');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeParent( &{same-partial empty-all} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('@supports (display: grid)');
    const rule3 = Symbol('&:hover');
    const rule4 = Symbol('@supports (display: grid)');
    const rule5 = Symbol('@supports (display: grid)');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
        },
        [rule5]: {
        },
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
        },
        [rule5]: {
        },
    });
});

test(`mergeParent( &{parent-all} )`, () => {
    const rule1 = Symbol('&');
    const rule2 = Symbol('&');
    const rule3 = Symbol('&');
    const rule4 = Symbol('&');
    const rule5 = Symbol('&');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
        },
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        color: 'red',
        opacity: 0.5,
        
        margin: '2rem',
        minWidth: '100px',
        
        visibility: 'hidden',
        animation: 'none',
        
        paddingInline: '2rem',
    });
});

test(`mergeParent( &{parent-all} )`, () => {
    const rule1 = Symbol('&');
    const rule2 = Symbol('&');
    const rule3 = Symbol('&');
    const rule4 = Symbol('&');
    const rule5 = Symbol('&');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        color: 'red',
        opacity: 0.5,
        
        margin: '2rem',
        minWidth: '100px',
        
        visibility: 'hidden',
        animation: 'none',
        
        paddingInline: '2rem',
        
        [root]: {
            background: 'white',
        },
    });
});

test(`mergeParent( &{parent-all-deep} )`, () => {
    const rule1 = Symbol('&');
    const rule2 = Symbol('&');
    const rule3 = Symbol('&');
    const rule4 = Symbol('&');
    const rule5 = Symbol('&');
    const rule6  = Symbol('&');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
            [rule4]: {
                paddingInline: '2rem',
                [rule5]: {
                    [rule6]: {
                        background: 'white',
                    },
                },
            },
        },
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        color: 'red',
        opacity: 0.5,
        
        margin: '2rem',
        minWidth: '100px',
        
        visibility: 'hidden',
        animation: 'none',
        
        paddingInline: '2rem',
        
        background: 'white',
    });
});

test(`mergeParent( &{parent-all-deep} )`, () => {
    const rule1 = Symbol('&');
    const rule2 = Symbol('&');
    const rule3 = Symbol('&');
    const rule4 = Symbol('&');
    const rule5 = Symbol('&:active');
    const rule6  = Symbol('&');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
            [rule3]: {
                visibility: 'hidden',
                animation: 'none',
                [rule4]: {
                    paddingInline: '2rem',
                },
            },
        },
        [rule5]: {
            [rule6]: {
                background: 'white',
            },
        },
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        color: 'red',
        opacity: 0.5,
        
        margin: '2rem',
        minWidth: '100px',
        
        visibility: 'hidden',
        animation: 'none',
        
        paddingInline: '2rem',
        
        [rule5]: {
            [rule6]: {
                background: 'white',
            },
        },
    });
});

test(`mergeParent( &{parent unique} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('&');
    const rule3 = Symbol('@media (min-width: 900px)');
    const rule4 = Symbol('&');
    const rule5 = Symbol('@global');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        margin: '2rem',
        minWidth: '100px',
        
        paddingInline: '2rem',
        
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeParent( &{parent-some unique-partial} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('&');
    const rule3 = Symbol('@media (min-width: 900px)');
    const rule4 = Symbol('&');
    const rule5 = Symbol('@global');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        margin: '2rem',
        minWidth: '100px',
        
        paddingInline: '2rem',
        
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeParent( &{parent-some nested-rule preserve-order} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('&');
    const rule3 = Symbol('&:disabled');
    const rule4 = Symbol('&');
    const rule5 = Symbol('&.selected');
    const rule6  = Symbol(':focus&');
    const rule7  = Symbol('&:first-child');
    const rule8  = Symbol('&:checked');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
            
            [rule3]: {
                visibility: 'hidden',
                animation: 'none',
            },
        },
        [rule4]: {
            paddingInline: '2rem',
            [rule5]: {
                aspectRatio: '2/5',
            },
            [rule6]: {
                background: 'white',
            },
        },
        [rule7]: {
            background: 'white',
        },
        [rule8]: {
            width: '10px',
            height: '50vh',
        },
    };
    mergeParent(mainStyle);
    expect(mainStyle)
    .toEqual({
        margin: '2rem',
        minWidth: '100px',
        
        paddingInline: '2rem',
        
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        
        [rule5]: {
            aspectRatio: '2/5',
        },
        [rule6]: {
            background: 'white',
        },
        
        [rule7]: {
            background: 'white',
        },
        [rule8]: {
            width: '10px',
            height: '50vh',
        },
    });
});
//#endregion test mergeParent()



//#region test mergeNested()
test(`mergeNested( &{empty} )`, () => {
    const mainStyle: CssStyle = {
        /* empty */
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        /* empty */
    });
});

test(`mergeNested( &{unique} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol(':active&');
    const rule3 = Symbol('@media (min-width: 900px)');
    const rule4 = Symbol('@supports (display: grid)');
    const rule5 = Symbol('@global');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeNested( &{same-all} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('&:hover');
    const rule3 = Symbol('&:hover');
    const rule4 = Symbol('&:hover');
    const rule5 = Symbol('&:hover');
    const root  = Symbol('&:hover');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule5]: {
            color: 'red',
            opacity: 0.5,
            
            margin: '2rem',
            minWidth: '100px',
            
            visibility: 'hidden',
            animation: 'none',
            
            paddingInline: '2rem',
            
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeNested( &{same-partial} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('@supports (display: grid)');
    const rule3 = Symbol('&:hover');
    const rule4 = Symbol('@supports (display: grid)');
    const rule5 = Symbol('@supports (display: grid)');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule3]: {
            color: 'red',
            opacity: 0.5,
            
            visibility: 'hidden',
            animation: 'none',
        },
        [rule5]: {
            margin: '2rem',
            minWidth: '100px',
            
            paddingInline: '2rem',
            
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeNested( &{same-partial} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol(':active&');
    const rule3 = Symbol('&:active');
    const rule4 = Symbol(':active&');
    const rule5 = Symbol('&:hover');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            margin: '2rem',
            minWidth: '100px',
            
            paddingInline: '2rem',
        },
        [rule5]: {
            color: 'red',
            opacity: 0.5,
            
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeNested( &{same-partial empty-partial} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('@supports (display: grid)');
    const rule3 = Symbol('&:hover');
    const rule4 = Symbol('@supports (display: grid)');
    const rule5 = Symbol('@supports (display: grid)');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule5]: {
            margin: '2rem',
            minWidth: '100px',
            
            paddingInline: '2rem',
            
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeNested( &{same-partial empty-partial} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('@supports (display: grid)');
    const rule3 = Symbol('&:hover');
    const rule4 = Symbol('@supports (display: grid)');
    const rule5 = Symbol('@supports (display: grid)');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule3]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule5]: {
            margin: '2rem',
            minWidth: '100px',
            
            paddingInline: '2rem',
            
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeNested( &{same-partial empty-all} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('@supports (display: grid)');
    const rule3 = Symbol('&:hover');
    const rule4 = Symbol('@supports (display: grid)');
    const rule5 = Symbol('@supports (display: grid)');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule5]: {
            margin: '2rem',
            minWidth: '100px',
            
            paddingInline: '2rem',
            
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeNested( &{same-partial empty-all} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('@supports (display: grid)');
    const rule3 = Symbol('&:hover');
    const rule4 = Symbol('@supports (display: grid)');
    const rule5 = Symbol('@supports (display: grid)');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
        },
        [rule5]: {
        },
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule3]: {
            color: 'red',
            opacity: 0.5,
            
            visibility: 'hidden',
            animation: 'none',
        },
    });
});

test(`mergeNested( &{parent-all} )`, () => {
    const rule1 = Symbol('&');
    const rule2 = Symbol('&');
    const rule3 = Symbol('&');
    const rule4 = Symbol('&');
    const rule5 = Symbol('&');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
        },
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
        },
    });
});

test(`mergeNested( &{parent-all} )`, () => {
    const rule1 = Symbol('&');
    const rule2 = Symbol('&');
    const rule3 = Symbol('&');
    const rule4 = Symbol('&');
    const rule5 = Symbol('&');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeNested( &{parent-all-deep} )`, () => {
    const rule1 = Symbol('&');
    const rule2 = Symbol('&');
    const rule3 = Symbol('&');
    const rule4 = Symbol('&');
    const rule5 = Symbol('&');
    const rule6  = Symbol('&');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
            [rule4]: {
                paddingInline: '2rem',
                [rule5]: {
                    [rule6]: {
                        background: 'white',
                    },
                },
            },
        },
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
            [rule4]: {
                paddingInline: '2rem',
                [rule5]: {
                    [rule6]: {
                        background: 'white',
                    },
                },
            },
        },
    });
});

test(`mergeNested( &{parent-all-deep} )`, () => {
    const rule1 = Symbol('&');
    const rule2 = Symbol('&');
    const rule3 = Symbol('&');
    const rule4 = Symbol('&');
    const rule5 = Symbol('&:active');
    const rule6  = Symbol('&');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
            [rule3]: {
                visibility: 'hidden',
                animation: 'none',
                [rule4]: {
                    paddingInline: '2rem',
                },
            },
        },
        [rule5]: {
            [rule6]: {
                background: 'white',
            },
        },
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
            [rule3]: {
                visibility: 'hidden',
                animation: 'none',
                [rule4]: {
                    paddingInline: '2rem',
                },
            },
        },
        [rule5]: {
            [rule6]: {
                background: 'white',
            },
        },
    });
});

test(`mergeNested( &{parent unique} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('&');
    const rule3 = Symbol('@media (min-width: 900px)');
    const rule4 = Symbol('&');
    const rule5 = Symbol('@global');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeNested( &{parent-some unique-partial} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('&');
    const rule3 = Symbol('@media (min-width: 900px)');
    const rule4 = Symbol('&');
    const rule5 = Symbol('@global');
    const root  = Symbol('&:root');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [rule3]: {
            visibility: 'hidden',
            animation: 'none',
        },
        [rule4]: {
            paddingInline: '2rem',
        },
        [rule5]: {
            [root]: {
                background: 'white',
            },
        },
    });
});

test(`mergeNested( &{parent-some nested-rule preserve-order} )`, () => {
    const rule1 = Symbol('&:hover');
    const rule2 = Symbol('&');
    const rule3 = Symbol('&:disabled');
    const rule4 = Symbol('&');
    const rule5 = Symbol('&.selected');
    const rule6  = Symbol(':focus&');
    const rule7  = Symbol('&:first-child');
    const rule8  = Symbol('&:checked');
    const mainStyle: CssStyle = {
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
            
            [rule3]: {
                visibility: 'hidden',
                animation: 'none',
            },
        },
        [rule4]: {
            paddingInline: '2rem',
            [rule5]: {
                aspectRatio: '2/5',
            },
            [rule6]: {
                background: 'white',
            },
        },
        [rule7]: {
            background: 'white',
        },
        [rule8]: {
            width: '10px',
            height: '50vh',
        },
    };
    mergeNested(mainStyle);
    expect(mainStyle)
    .toEqual({
        [rule1]: {
            color: 'red',
            opacity: 0.5,
        },
        [rule2]: {
            margin: '2rem',
            minWidth: '100px',
            
            [rule3]: {
                visibility: 'hidden',
                animation: 'none',
            },
        },
        [rule4]: {
            paddingInline: '2rem',
            [rule5]: {
                aspectRatio: '2/5',
            },
            [rule6]: {
                background: 'white',
            },
        },
        [rule7]: {
            background: 'white',
        },
        [rule8]: {
            width: '10px',
            height: '50vh',
        },
    });
});
//#endregion test mergeNested()



//#region test mergeStyles()
//#region test with empty style(s)
const allBasicFalsies = [undefined, null, false, true];
allBasicFalsies.forEach((basicFalsy) => {
    test(`mergeStyles(falsy)`, () => {
        expect(mergeStyles(
            basicFalsy
        ))
        .toBe(
            null
        );
    });
});

allBasicFalsies.forEach((basicFalsy) => {
    test(`mergeStyles([falsy])`, () => {
        expect(mergeStyles([
            basicFalsy
        ]))
        .toBe(
            null
        );
    });
});

test(`mergeStyles({empty})`, () => {
    expect(mergeStyles(
        {}
    ))
    .toBe(
        null
    );
});

test(`mergeStyles([{empty}])`, () => {
    expect(mergeStyles([
        {}
    ]))
    .toBe(
        null
    );
});

test(`mergeStyles([{empty}...{empty}])`, () => {
    expect(mergeStyles([
        {},
        {},
        {},
    ]))
    .toBe(
        null
    );
});

test(`mergeStyles([{empty}|falsy...{empty}|falsy])`, () => {
    expect(mergeStyles([
        {},
        undefined,
        {},
        null,
        {},
        true,
        {},
        false,
        {},
    ]))
    .toBe(
        null
    );
});
//#endregion test with empty style(s)



//#region test with single style
test(`mergeStyles({some})`, () => {
    const mainStyle: CssStyle = {
        background: 'red',
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
    };
    expect(mergeStyles(mainStyle))
    .toEqual(mainStyle);
    expect(mergeStyles([mainStyle]))
    .toEqual(mainStyle);
});

test(`mergeStyles({some+symbols})`, () => {
    const symbol1 = Symbol('symbol1');
    const symbol2 = Symbol('symbol2');
    const mainStyle: CssStyle = {
        background: 'red',
        color: 'blue',
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
        paddingInline: '2rem',
    };
    expect(mergeStyles(mainStyle))
    .toEqual(mainStyle);
    expect(mergeStyles([mainStyle]))
    .toEqual(mainStyle);
});
//#endregion test with single style



//#region test with some style(s)
test(`mergeStyles({some}, {empty})`, () => {
    const mainStyle: CssStyle = {
        background: 'red',
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
    };
    const addStyle: CssStyle = {
        /* empty */
    };
    expect(mergeStyles([mainStyle, addStyle]))
    .toEqual({
        background: 'red',
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
    });
});

test(`mergeStyles({empty}, {some})`, () => {
    const mainStyle: CssStyle = {
        /* empty */
    };
    const addStyle: CssStyle = {
        background: 'red',
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
    };
    expect(mergeStyles([mainStyle, addStyle]))
    .toEqual({
        background: 'red',
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
    });
});

test(`mergeStyles({some+symbols}, {empty})`, () => {
    const symbol1 = Symbol('symbol1');
    const symbol2 = Symbol('symbol2');
    const mainStyle: CssStyle = {
        background: 'red',
        color: 'blue',
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
        paddingInline: '2rem',
    };
    const addStyle: CssStyle = {
        /* empty */
    };
    expect(mergeStyles([mainStyle, addStyle]))
    .toEqual({
        background: 'red',
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
    });
});

test(`mergeStyles({empty}, {some+symbols})`, () => {
    const symbol1 = Symbol('symbol1');
    const symbol2 = Symbol('symbol2');
    const mainStyle: CssStyle = {
        /* empty */
    };
    const addStyle: CssStyle = {
        background: 'red',
        color: 'blue',
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
        paddingInline: '2rem',
    };
    expect(mergeStyles([mainStyle, addStyle]))
    .toEqual({
        background: 'red',
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
    });
});

test(`mergeStyles({some}, {some})`, () => {
    const mainStyle: CssStyle = {
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
    };
    const addStyle: CssStyle = {
        background: 'red',
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
    };
    expect(mergeStyles([mainStyle, addStyle]))
    .toEqual({
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        background: 'red',
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
    });
});

test(`mergeStyles({some+symbols}, {some+symbols})`, () => {
    const symbol1 = Symbol('symbol1');
    const symbol2 = Symbol('symbol2');
    const symbol3 = Symbol('symbol3');
    const symbol4 = Symbol('symbol4');
    const mainStyle: CssStyle = {
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        color: 'blue',
        opacity: 0.5,
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
        border: [['solid', '2px', 'dashed']],
    };
    const addStyle: CssStyle = {
        background: 'red',
        [symbol3]: {
            justifySelf: 'stretch',
            flex: [[0, 0, 'auto']],
        },
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        [symbol4]: {
            cursor: 'pointer',
            opacity: 0.9,
        },
        paddingInline: '2rem',
    };
    expect(mergeStyles([mainStyle, addStyle]))
    .toEqual({
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        background: 'red',
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
        [symbol3]: {
            justifySelf: 'stretch',
            flex: [[0, 0, 'auto']],
        },
        [symbol4]: {
            cursor: 'pointer',
            opacity: 0.9,
        },
    });
});

test(`mergeStyles({conflict}, {conflict})`, () => {
    const mainStyle: CssStyle = {
        background: 'red',
        color: 'blue',
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
    };
    const addStyle: CssStyle = {
        appearance: 'none',
        opacity: 0.85,
        display: 'flex',
        boxShadow: [
            ['10px', '5px', '5px', 'black'],
            ['30px', '20px', 'purple'],
        ],
        background: 'black',
    };
    expect(mergeStyles([mainStyle, addStyle]))
    .toEqual({
        color: 'blue',
        border: [['solid', '2px', 'dashed']],
        paddingInline: '2rem',
        
        appearance: 'none',
        opacity: 0.85,
        display: 'flex',
        boxShadow: [
            ['10px', '5px', '5px', 'black'],
            ['30px', '20px', 'purple'],
        ],
        background: 'black',
    });
});

test(`mergeStyles({conflict+symbols}, {conflict+symbols})`, () => {
    const symbol1 = Symbol('symbol1');
    const symbol2 = Symbol('symbol2');
    const symbol3 = Symbol('symbol3');
    const symbol4 = Symbol('symbol4');
    const mainStyle: CssStyle = {
        background: 'red',
        color: 'blue',
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        opacity: 0.5,
        border: [['solid', '2px', 'dashed']],
        boxShadow: [
            ['10px', '5px', '5px', 'red'],
            ['60px', '-16px', 'teal'],
            ['inset', '5em', '1em', 'gold'],
            ['3px', '3px', 'red'],
            ['-1em', '0', '.4em', 'olive'],
        ],
        paddingInline: '2rem',
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
    };
    const addStyle: CssStyle = {
        appearance: 'none',
        opacity: 0.85,
        display: 'flex',
        [symbol3]: {
            justifySelf: 'stretch',
            flex: [[0, 0, 'auto']],
        },
        boxShadow: [
            ['10px', '5px', '5px', 'black'],
            ['30px', '20px', 'purple'],
        ],
        [symbol4]: {
            cursor: 'pointer',
            opacity: 0.9,
        },
        background: 'black',
    };
    expect(mergeStyles([mainStyle, addStyle]))
    .toEqual({
        color: 'blue',
        border: [['solid', '2px', 'dashed']],
        paddingInline: '2rem',
        
        appearance: 'none',
        opacity: 0.85,
        display: 'flex',
        boxShadow: [
            ['10px', '5px', '5px', 'black'],
            ['30px', '20px', 'purple'],
        ],
        background: 'black',
        
        [symbol1]: {
            margin: '2rem',
            minWidth: '100px',
        },
        [symbol2]: {
            gap: '2rem',
            visibility: 'hidden',
            animation: 'none',
        },
        [symbol3]: {
            justifySelf: 'stretch',
            flex: [[0, 0, 'auto']],
        },
        [symbol4]: {
            cursor: 'pointer',
            opacity: 0.9,
        },
    });
});
//#endregion test with some style(s)
//#endregion test mergeStyles()
