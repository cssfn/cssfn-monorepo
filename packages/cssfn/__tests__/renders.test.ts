import type {
    render      as _render,
} from '../dist/renders.js'
import {
    // style sheets:
    styleSheet  as _styleSheet,
    
    
    
    // rule shortcuts:
    fallbacks   as _fallbacks,
    fontFace    as _fontFace,
    keyframes   as _keyframes,
    rule        as _rule,
    rules       as _rules,
    
    
    
    // styles:
    style       as _style,
    
    
    
    // scopes:
    scopeOf     as _scopeOf,
    mainScope   as _mainScope,
    globalScope as _globalScope,
} from '../dist/cssfn.js'
import {
    jest,
} from '@jest/globals'



jest.isolateModules(() => {
    let fallbacks   : typeof _fallbacks   = undefined as any;
    let fontFace    : typeof _fontFace    = undefined as any;
    let keyframes   : typeof _keyframes   = undefined as any;
    let rule        : typeof _rule        = undefined as any;
    let rules       : typeof _rules       = undefined as any;
    let style       : typeof _style       = undefined as any;
    let styleSheet  : typeof _styleSheet  = undefined as any;
    let scopeOf     : typeof _scopeOf     = undefined as any;
    let mainScope   : typeof _mainScope   = undefined as any;
    let globalScope : typeof _globalScope = undefined as any;
    let render      : typeof _render      = undefined as any;
    beforeAll(async () => {
        const cssfnModule      = await import('../dist/cssfn.js')
        const renderModule     = await import('../dist/renders.js')
        
        fallbacks   = cssfnModule.fallbacks
        fontFace    = cssfnModule.fontFace
        keyframes   = cssfnModule.keyframes
        rule        = cssfnModule.rule,
        rules       = cssfnModule.rules,
        style       = cssfnModule.style
        styleSheet  = cssfnModule.styleSheet
        scopeOf     = cssfnModule.scopeOf
        mainScope   = cssfnModule.mainScope
        globalScope = cssfnModule.globalScope
        render      = renderModule.render
    });
    
    
    
    //#region test properties
    test(`render() # test standard propName`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    background: 'pink',
                    paddingInline: '1rem',
                    borderStartEndRadius: '0.5px',
                })
            )
        ], { id: '#sheet#1' });
        expect(render(sheet1))
        .toEqual(
`
.z7qv1 {
background: pink;
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}
`
        );
    });
    test(`render() # test vendor propName`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    WebkitAnimationDelay: '500ms',
                    MozAnimationDelay: '500ms',
                    OAnimationDelay: '500ms',
                    msFlexDirection: 'column',
                })
            )
        ], { id: '#sheet#2' });
        expect(render(sheet1))
        .toEqual(
`
.yny9o {
-webkit-animation-delay: 500ms;
-moz-animation-delay: 500ms;
-o-animation-delay: 500ms;
-ms-flex-direction: column;
}
`
        );
    });
    test(`render() # test custom propName`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    '--custProp1': '"yeah"',
                    'var(--custProp2)': '"cool"',
                    '--my-custProp1': '"okay"',
                    'var(--my-custProp2)': '"good"',
                })
            )
        ], { id: '#sheet#3' });
        expect(render(sheet1))
        .toEqual(
`
.y45ob {
--custProp1: "yeah";
--custProp2: "cool";
--my-custProp1: "okay";
--my-custProp2: "good";
}
`
        );
    });
    test(`render() # test propValue`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    color: 'pink',
                    opacity: 0.5,
                    content: '"hello world"',
                    
                    fontFamily: ['Arial', 'sans-serif'],
                    background: ['url(image1.png)', 'url(image2.png)', '!important'],
                    
                    border: [['solid', '2px', 'red']],
                    padding: [['10px', 0, '5px', '3%'], '!important'],
                    
                    boxShadow: [['10px', '5px', '5px', 'black'], ['inset', '5em', '1em', 'gold']],
                    backgroundPosition: [[0, 0], ['1cm', '2cm'], ['center'], '!important'],
                })
            )
        ], { id: '#sheet#4' });
        expect(render(sheet1))
        .toEqual(
`
.xkd2y {
color: pink;
opacity: 0.5;
content: "hello world";
font-family: Arial, sans-serif;
background: url(image1.png), url(image2.png) !important;
border: solid 2px red;
padding: 10px 0 5px 3% !important;
box-shadow: 10px 5px 5px black, inset 5em 1em gold;
background-position: 0 0, 1cm 2cm, center !important;
}
`
        );
    });
    //#endregion test properties
    
    
    
    //#region test @fallbacks
    test(`render() # test @fallbacks`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    background: 'linear-gradient(to right, red 0%, green 100%)',
                    ...fallbacks({
                        background: 'red',
                    }),
                })
            )
        ], { id: '#sheet#5' });
        expect(render(sheet1))
        .toEqual(
`
.x0khl {
background: red;
background: linear-gradient(to right, red 0%, green 100%);
}
`
        );
    });
    test(`render() # test @fallbacks`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    display: 'grid',
                    ...fallbacks({
                        display: 'flex',
                    }),
                    ...fallbacks({
                        display: 'block',
                    }),
                    ...fallbacks({
                        display: 'inline',
                    }),
                    ...fallbacks({
                        display: 'none',
                    }),
                })
            )
        ], { id: '#sheet#6' });
        expect(render(sheet1))
        .toEqual(
`
.wgrw8 {
display: none;
display: inline;
display: block;
display: flex;
display: grid;
}
`
        );
    });
    //#endregion test @fallbacks
    
    
    
    //#region test @font-face
    test(`render() # test @font-face`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...fontFace({
                        fontFamily: 'Open Sans',
                        src: 'url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf")',
                        fontWeight: 'bold',
                        fontStyle: [['oblique', '40deg']],
                    }),
                })
            )
        ], { id: '#sheet#7' });
        expect(render(sheet1))
        .toEqual(
`
@font-face {
font-family: Open Sans;
src: url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf");
font-weight: bold;
font-style: oblique 40deg;
}
`
        );
    });
    test(`render() # test @font-face`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...fontFace({
                        fontFamily: 'Open Sans',
                        src: 'url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf")',
                        ...style({
                            fontWeight: 'bold',
                            fontStyle: [['oblique', '40deg']],
                        }),
                    }),
                })
            )
        ], { id: '#sheet#8' });
        expect(render(sheet1))
        .toEqual(
`
@font-face {
font-family: Open Sans;
src: url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf");
font-weight: bold;
font-style: oblique 40deg;
}
`
        );
    });
    //#endregion test @font-face
    
    
    
    //#region test @keyframes
    test(`render() # test @keyframes`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...keyframes('awesome', {
                        from: {
                            background: 'pink',
                            color: 'red',
                            opacity: 0.3,
                        },
                        to: {
                            background: 'lightblue',
                            color: 'blue',
                            opacity: 0.9,
                        },
                    }),
                })
            )
        ], { id: '#sheet#7' });
        expect(render(sheet1))
        .toEqual(
`
@keyframes awesome {
from {
background: pink;
color: red;
opacity: 0.3;
}

to {
background: lightblue;
color: blue;
opacity: 0.9;
}

}
`
        );
    });
    test(`render() # test @keyframes`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...keyframes('awesome', {
                        from: {
                            background: 'pink',
                            color: 'red',
                            ...style({
                                opacity: 0.3,
                                border: [['solid', '2px', 'red']],
                            }),
                        },
                        to: {
                            background: 'lightblue',
                            color: 'blue',
                            ...style({
                                opacity: 0.9,
                                border: [['solid', '4px', 'blue']],
                            }),
                        },
                    }),
                })
            )
        ], { id: '#sheet#8' });
        expect(render(sheet1))
        .toEqual(
`
@keyframes awesome {
from {
background: pink;
color: red;
opacity: 0.3;
border: solid 2px red;
}

to {
background: lightblue;
color: blue;
opacity: 0.9;
border: solid 4px blue;
}

}
`
        );
    });
    //#endregion test @keyframes
    
    
    
    //#region test .rule
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    background: 'pink',
                    ...rule('.rule', {
                        paddingInline: '1rem',
                        borderStartEndRadius: '0.5px',
                    }),
                    ...rule(':hover', {
                        color: 'red',
                        opacity: 0.3,
                    }),
                    ...rule([':active', ':checked'], {
                        display: 'grid',
                        border: [['solid', '2px', 'red']],
                    }),
                    ...rule(['.menu', ':valid', '::before'], {
                        visibility: 'visible',
                        overflow: 'auto',
                    }),
                })
            )
        ], { id: '#sheet#9' });
        expect(render(sheet1))
        .toEqual(
`
.ute45 {
background: pink;
}

.ute45.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

.ute45:hover {
color: red;
opacity: 0.3;
}

.ute45:is(:active, :checked) {
display: grid;
border: solid 2px red;
}

.ute45:is(.menu, :valid), .ute45::before {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...rule('.rule', {
                        paddingInline: '1rem',
                        borderStartEndRadius: '0.5px',
                    }, { minSpecificityWeight: 3 }),
                    ...rule(':hover', {
                        color: 'red',
                        opacity: 0.3,
                    }, { maxSpecificityWeight: 0 }),
                    ...rule([':active', ':checked'], {
                        display: 'grid',
                        border: [['solid', '2px', 'red']],
                    }, { specificityWeight: 2 }),
                    ...rule(['.menu', ':valid', '::before'], {
                        visibility: 'visible',
                        overflow: 'auto',
                    }, { specificityWeight: 2 }),
                })
            )
        ], { id: '#sheet#10' });
        expect(render(sheet1))
        .toEqual(
`
.vg4v3.rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

.vg4v3:where(:hover) {
color: red;
opacity: 0.3;
}

.vg4v3:is(:active, :checked):nth-child(n) {
display: grid;
border: solid 2px red;
}

.vg4v3:is(.menu, :valid):nth-child(n), .vg4v3::before:nth-child(n):nth-child(n) {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    background: 'pink',
                    ...rules([
                        rule('.rule', {
                            paddingInline: '1rem',
                            borderStartEndRadius: '0.5px',
                        }),
                        rule(':hover', {
                            color: 'red',
                            opacity: 0.3,
                        }),
                        rule([':active', ':checked'], {
                            display: 'grid',
                            border: [['solid', '2px', 'red']],
                        }),
                        rule(['.menu', ':valid', '::before'], {
                            visibility: 'visible',
                            overflow: 'auto',
                        }),
                    ], { specificityWeight: 3 }),
                })
            )
        ], { id: '#sheet#11' });
        expect(render(sheet1))
        .toEqual(
`
.vzxgg {
background: pink;
}

.vzxgg.rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

.vzxgg:hover:hover:hover {
color: red;
opacity: 0.3;
}

.vzxgg:is(:active, :checked):nth-child(n):nth-child(n) {
display: grid;
border: solid 2px red;
}

.vzxgg:is(.menu, :valid):nth-child(n):nth-child(n), .vzxgg::before:nth-child(n):nth-child(n):nth-child(n) {
visibility: visible;
overflow: auto;
}
`
        );
    });
    
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    background: 'pink',
                    ...rule('.rule', {
                        paddingInline: '1rem',
                        borderStartEndRadius: '0.5px',
                    }),
                    ...rule(':hover', {
                        color: 'red',
                        opacity: 0.3,
                    }),
                    ...rule([':active', ':checked'], {
                        display: 'grid',
                        border: [['solid', '2px', 'red']],
                    }),
                    ...rule(['.menu', ':valid', '::before'], {
                        visibility: 'visible',
                        overflow: 'auto',
                    }),
                }),
                { specificityWeight: 3 }
            )
        ], { id: '#sheet#12' });
        expect(render(sheet1))
        .toEqual(
`
.wjq1t.wjq1t.wjq1t {
background: pink;
}

.wjq1t.wjq1t.wjq1t.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

.wjq1t.wjq1t.wjq1t:hover {
color: red;
opacity: 0.3;
}

.wjq1t.wjq1t.wjq1t:is(:active, :checked) {
display: grid;
border: solid 2px red;
}

.wjq1t.wjq1t.wjq1t:is(.menu, :valid), .wjq1t.wjq1t.wjq1t::before {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...rule('.rule', {
                        paddingInline: '1rem',
                        borderStartEndRadius: '0.5px',
                    }, { minSpecificityWeight: 3 }),
                    ...rule(':hover', {
                        color: 'red',
                        opacity: 0.3,
                    }, { maxSpecificityWeight: 0 }),
                    ...rule([':active', ':checked'], {
                        display: 'grid',
                        border: [['solid', '2px', 'red']],
                    }, { specificityWeight: 2 }),
                    ...rule(['.menu', ':valid', '::before'], {
                        visibility: 'visible',
                        overflow: 'auto',
                    }, { specificityWeight: 2 }),
                }),
                { specificityWeight: 2 }
            ),
        ], { id: '#sheet#13' });
        expect(render(sheet1))
        .toEqual(
`
.x3in6.x3in6.rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

.x3in6.x3in6:where(:hover) {
color: red;
opacity: 0.3;
}

.x3in6.x3in6:is(:active, :checked):nth-child(n) {
display: grid;
border: solid 2px red;
}

.x3in6.x3in6:is(.menu, :valid):nth-child(n), .x3in6.x3in6::before:nth-child(n):nth-child(n) {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    background: 'pink',
                    ...rules([
                        rule('.rule', {
                            paddingInline: '1rem',
                            borderStartEndRadius: '0.5px',
                        }),
                        rule(':hover', {
                            color: 'red',
                            opacity: 0.3,
                        }),
                        rule([':active', ':checked'], {
                            display: 'grid',
                            border: [['solid', '2px', 'red']],
                        }),
                        rule(['.menu', ':valid', '::before'], {
                            visibility: 'visible',
                            overflow: 'auto',
                        }),
                    ], { specificityWeight: 3 }),
                }),
                { specificityWeight: 2 }
            )
        ], { id: '#sheet#14' });
        expect(render(sheet1))
        .toEqual(
`
.xnb8j.xnb8j {
background: pink;
}

.xnb8j.xnb8j.rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

.xnb8j.xnb8j:hover:hover:hover {
color: red;
opacity: 0.3;
}

.xnb8j.xnb8j:is(:active, :checked):nth-child(n):nth-child(n) {
display: grid;
border: solid 2px red;
}

.xnb8j.xnb8j:is(.menu, :valid):nth-child(n):nth-child(n), .xnb8j.xnb8j::before:nth-child(n):nth-child(n):nth-child(n) {
visibility: visible;
overflow: auto;
}
`
        );
    });
    
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    background: 'pink',
                    ...rule('.rule', {
                        paddingInline: '1rem',
                        borderStartEndRadius: '0.5px',
                    }),
                    ...rule(':hover', {
                        color: 'red',
                        opacity: 0.3,
                    }),
                    ...rule([':active', ':checked'], {
                        display: 'grid',
                        border: [['solid', '2px', 'red']],
                    }),
                    ...rule(['.menu', ':valid', '::before'], {
                        visibility: 'visible',
                        overflow: 'auto',
                    }),
                }),
                { specificityWeight: 0 }
            )
        ], { id: '#sheet#15' });
        expect(render(sheet1))
        .toEqual(
`
:where(.y73tw) {
background: pink;
}

:where(.y73tw).rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

:where(.y73tw):hover {
color: red;
opacity: 0.3;
}

:where(.y73tw):is(:active, :checked) {
display: grid;
border: solid 2px red;
}

:where(.y73tw):is(.menu, :valid), :where(.y73tw)::before {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...rule('.rule', {
                        paddingInline: '1rem',
                        borderStartEndRadius: '0.5px',
                    }, { minSpecificityWeight: 3 }),
                    ...rule(':hover', {
                        color: 'red',
                        opacity: 0.3,
                    }, { maxSpecificityWeight: 0 }),
                    ...rule([':active', ':checked'], {
                        display: 'grid',
                        border: [['solid', '2px', 'red']],
                    }, { specificityWeight: 2 }),
                    ...rule(['.menu', ':valid', '::before'], {
                        visibility: 'visible',
                        overflow: 'auto',
                    }, { specificityWeight: 2 }),
                }),
                { specificityWeight: 0 }
            ),
        ], { id: '#sheet#16' });
        expect(render(sheet1))
        .toEqual(
`
:where(.yqwf9).rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

:where(.yqwf9):where(:hover) {
color: red;
opacity: 0.3;
}

:where(.yqwf9):is(:active, :checked):nth-child(n) {
display: grid;
border: solid 2px red;
}

:where(.yqwf9):is(.menu, :valid):nth-child(n), :where(.yqwf9)::before:nth-child(n):nth-child(n) {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    background: 'pink',
                    ...rules([
                        rule('.rule', {
                            paddingInline: '1rem',
                            borderStartEndRadius: '0.5px',
                        }),
                        rule(':hover', {
                            color: 'red',
                            opacity: 0.3,
                        }),
                        rule([':active', ':checked'], {
                            display: 'grid',
                            border: [['solid', '2px', 'red']],
                        }),
                        rule(['.menu', ':valid', '::before'], {
                            visibility: 'visible',
                            overflow: 'auto',
                        }),
                    ], { specificityWeight: 3 }),
                }),
                { specificityWeight: 0 }
            )
        ], { id: '#sheet#17' });
        expect(render(sheet1))
        .toEqual(
`
:where(.zap0m) {
background: pink;
}

:where(.zap0m).rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

:where(.zap0m):hover:hover:hover {
color: red;
opacity: 0.3;
}

:where(.zap0m):is(:active, :checked):nth-child(n):nth-child(n) {
display: grid;
border: solid 2px red;
}

:where(.zap0m):is(.menu, :valid):nth-child(n):nth-child(n), :where(.zap0m)::before:nth-child(n):nth-child(n):nth-child(n) {
visibility: visible;
overflow: auto;
}
`
        );
    });
    //#endregion test .rule
    
    //#region test .rule1 x .rule2
    test(`render() # test .rule1 x .rule2`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    background: 'pink',
                    ...rule('.rule', {
                        paddingInline: '1rem',
                        borderStartEndRadius: '0.5px',
                        
                        ...rule(':hover', {
                            color: 'red',
                            opacity: 0.3,
                        }),
                    }),
                    ...rule([':active', ':checked'], {
                        display: 'grid',
                        border: [['solid', '2px', 'red']],
                        
                        ...rule(['.menu', ':valid', '::before'], {
                            visibility: 'visible',
                            overflow: 'auto',
                        }),
                    }),
                })
            )
        ], { id: '#sheet#18' });
        expect(render(sheet1))
        .toEqual(
`
.zuhlz {
background: pink;
}

.zuhlz.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

.zuhlz.rule:hover {
color: red;
opacity: 0.3;
}

.zuhlz:is(:active, :checked) {
display: grid;
border: solid 2px red;
}

.zuhlz:is(:active, :checked):is(.menu, :valid), .zuhlz:is(:active, :checked)::before {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...rule('.rule', {
                        paddingInline: '1rem',
                        borderStartEndRadius: '0.5px',
                        
                        ...rule(':hover', {
                            color: 'red',
                            opacity: 0.3,
                        }, { maxSpecificityWeight: 0 }),
                    }, { minSpecificityWeight: 3 }),
                    ...rule([':active', ':checked'], {
                        display: 'grid',
                        border: [['solid', '2px', 'red']],
                        
                        ...rule(['.menu', ':valid', '::before'], {
                            visibility: 'visible',
                            overflow: 'auto',
                        }, { specificityWeight: 2 }),
                    }, { specificityWeight: 2 }),
                }),
                { specificityWeight: 0 }
            ),
        ], { id: '#sheet#19' });
        expect(render(sheet1))
        .toEqual(
`
:where(.wea7c).rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

:where(.wea7c).rule.rule.rule:where(:hover) {
color: red;
opacity: 0.3;
}

:where(.wea7c):is(:active, :checked):nth-child(n) {
display: grid;
border: solid 2px red;
}

:where(.wea7c):is(:active, :checked):nth-child(n):is(.menu, :valid):nth-child(n), :where(.wea7c):is(:active, :checked):nth-child(n)::before:nth-child(n):nth-child(n) {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    background: 'pink',
                    ...rules([
                        rule('.rule', {
                            paddingInline: '1rem',
                            borderStartEndRadius: '0.5px',
                            
                            ...rule(':hover', {
                                color: 'red',
                                opacity: 0.3,
                            }),
                        }),
                        rule([':active', ':checked'], {
                            display: 'grid',
                            border: [['solid', '2px', 'red']],
                            
                            ...rule(['.menu', ':valid', '::before'], {
                                visibility: 'visible',
                                overflow: 'auto',
                            }),
                        }),
                    ], { specificityWeight: 3 }),
                }),
                { specificityWeight: 0 }
            )
        ], { id: '#sheet#20' });
        expect(render(sheet1))
        .toEqual(
`
:where(.chr9a) {
background: pink;
}

:where(.chr9a).rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

:where(.chr9a).rule.rule.rule:hover {
color: red;
opacity: 0.3;
}

:where(.chr9a):is(:active, :checked):nth-child(n):nth-child(n) {
display: grid;
border: solid 2px red;
}

:where(.chr9a):is(:active, :checked):nth-child(n):nth-child(n):is(.menu, :valid), :where(.chr9a):is(:active, :checked):nth-child(n):nth-child(n)::before {
visibility: visible;
overflow: auto;
}
`
        );
    });
    //#endregion test .rule1 x .rule2
});
