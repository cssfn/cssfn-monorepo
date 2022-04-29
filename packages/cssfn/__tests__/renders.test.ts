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
    atRule      as _atRule,
    rules       as _rules,
    atGlobal    as _atGlobal,
    children    as _children,
    vars        as _vars,
    
    
    
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
    let atRule      : typeof _atRule      = undefined as any;
    let rules       : typeof _rules       = undefined as any;
    let atGlobal    : typeof _atGlobal    = undefined as any;
    let children    : typeof _children    = undefined as any;
    let vars        : typeof _vars        = undefined as any;
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
        rule        = cssfnModule.rule
        atRule      = cssfnModule.atRule
        rules       = cssfnModule.rules
        atGlobal    = cssfnModule.atGlobal
        children    = cssfnModule.children
        vars        = cssfnModule.vars
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
    
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...rule([':hover', '::backdrop'], {
                        color: 'red',
                        opacity: 0.3,
                        
                        ...rule(['.menu', ':valid', '::before', '::after'], {
                            visibility: 'visible',
                            overflow: 'auto',
                        }),
                    }),
                })
            )
        ], { id: '#sheet#bleh' });
        expect(render(sheet1))
        .toEqual(
`
.rmnfx:hover, .rmnfx::backdrop {
color: red;
opacity: 0.3;
}

.rmnfx:hover:is(.menu, :valid), .rmnfx:hover::before, .rmnfx:hover::after, .rmnfx::backdrop:is(.menu, :valid), .rmnfx::backdrop::before, .rmnfx::backdrop::after {
visibility: visible;
overflow: auto;
}
`
        );
    });
    //#endregion test .rule1 x .rule2
    
    
    
    //#region test @global
    test(`render() # test @global`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...atGlobal({
                        ...rule('.btn', {
                            background: 'pink',
                            color: 'red',
                        }),
                        ...rule('body', {
                            margin: 0,
                            padding: 0,
                            background: 'white',
                            ...children(['div', '.container'], {
                                border: [['solid', '2px', 'black']],
                                display: 'block',
                            }),
                        }),
                        ...rule(['.checkbox', 'input[type="checkbox"]'], {
                            appearance: 'none',
                            display: 'flex',
                            
                            ...style({
                                flexDirection: 'row',
                                justifyContent: 'center',
                            })
                        }, { specificityWeight: 2 }),
                        ...rule(':root', {
                            ...vars({
                                '--gutter': '10px',
                                '--gapSm': '0.5rem',
                                '--gapLg': '2rem',
                                '--btn-minHeight': '1.5rem',
                            })
                        }),
                    }),
                })
            )
        ], { id: '#sheet#22' });
        expect(render(sheet1))
        .toEqual(
`
.btn {
background: pink;
color: red;
}

body {
margin: 0;
padding: 0;
background: white;
}

body>:is(div, .container) {
border: solid 2px black;
display: block;
}

:is(.checkbox, input[type="checkbox"]):nth-child(n) {
appearance: none;
display: flex;
flex-direction: row;
justify-content: center;
}

:root {
--gutter: 10px;
--gapSm: 0.5rem;
--gapLg: 2rem;
--btn-minHeight: 1.5rem;
}
`
        );
    });
    test(`render() # test globalScope`, () => {
        const sheet1 = styleSheet(() => [
            globalScope({
                ...rule('.navbar', {
                    display: 'grid',
                    background: 'pink',
                }),
                ...rule('html', {
                    margin: 0,
                    padding: 0,
                    background: 'unset',
                    ...children(['div', '.container'], {
                        border: [['solid', '2px', 'black']],
                        display: 'block',
                        
                        ...children('.item', {
                            display: 'inline-flex',
                            margin: '1rem',
                            padding: [['2rem', '1rem']],
                            
                            ...children(['img', '.image'], {
                                boxShadow: [['inset', '5em', '1em', 'gold']],
                                width: 'fit-content',
                                height: '100%',
                            }),
                        })
                    }),
                }),
                ...rule(['.checkbox', 'input[type="checkbox"]', '.btn-check'], {
                    appearance: 'none',
                    display: 'inline-flex',
                    
                    ...style({
                        flexDirection: 'row',
                        justifyContent: 'stretch',
                        flex: [[0, 0, 'auto'], '!important'],
                    })
                }, { specificityWeight: 2 }),
                ...rule(':root', {
                    ...vars({
                        '--gutter': '10px',
                        '--gapSm': '0.5rem',
                        '--gapLg': '2rem',
                        '--btn-minHeight': '1.5rem',
                    })
                }),
            }),
        ], { id: '#sheet#23' });
        expect(render(sheet1))
        .toEqual(
`
.navbar {
display: grid;
background: pink;
}

html {
margin: 0;
padding: 0;
background: unset;
}

html>:is(div, .container) {
border: solid 2px black;
display: block;
}

html>:is(div, .container)>.item {
display: inline-flex;
margin: 1rem;
padding: 2rem 1rem;
}

html>:is(div, .container)>.item>:is(img, .image) {
box-shadow: inset 5em 1em gold;
width: fit-content;
height: 100%;
}

:is(.checkbox, input[type="checkbox"], .btn-check):nth-child(n) {
appearance: none;
display: inline-flex;
flex-direction: row;
justify-content: stretch;
flex: 0 0 auto !important;
}

:root {
--gutter: 10px;
--gapSm: 0.5rem;
--gapLg: 2rem;
--btn-minHeight: 1.5rem;
}
`
        );
    });
    //#endregion test @global
    
    
    
    //#region test @conditionalRule
    //#region @global
    test(`render() # test @global`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...atGlobal({
                        ...rule('.btn', {
                            background: 'pink',
                            color: 'red',
                        }),
                        ...atRule('@media (min-width: 1024px)', {
                            ...rule('body', {
                                margin: 0,
                                padding: 0,
                                background: 'white',
                                
                                ...children(['div', '.container'], {
                                    border: [['solid', '2px', 'black']],
                                    display: 'block',
                                }),
                            }),
                            ...rule(['.checkbox', 'input[type="checkbox"]'], {
                                appearance: 'none',
                                display: 'flex',
                                
                                ...style({
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                })
                            }, { specificityWeight: 2 }),
                        }),
                        ...rule(':root', {
                            ...vars({
                                '--gutter': '10px',
                                '--gapSm': '0.5rem',
                                '--gapLg': '2rem',
                                '--btn-minHeight': '1.5rem',
                            })
                        }),
                    }),
                })
            )
        ], { id: '#sheet#24' });
        expect(render(sheet1))
        .toEqual(
`
.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
body {
margin: 0;
padding: 0;
background: white;
}

body>:is(div, .container) {
border: solid 2px black;
display: block;
}

:is(.checkbox, input[type="checkbox"]):nth-child(n) {
appearance: none;
display: flex;
flex-direction: row;
justify-content: center;
}

}

:root {
--gutter: 10px;
--gapSm: 0.5rem;
--gapLg: 2rem;
--btn-minHeight: 1.5rem;
}
`
        );
    });
    test(`render() # test globalScope`, () => {
        const sheet1 = styleSheet(() => [
            globalScope({
                ...rule('.btn', {
                    background: 'pink',
                    color: 'red',
                }),
                ...atRule('@media (min-width: 1024px)', {
                    ...rule('body', {
                        margin: 0,
                        padding: 0,
                        background: 'white',
                        
                        ...children(['div', '.container'], {
                            border: [['solid', '2px', 'black']],
                            display: 'block',
                        }),
                    }),
                    ...rule(['.checkbox', 'input[type="checkbox"]'], {
                        appearance: 'none',
                        display: 'flex',
                        
                        ...style({
                            flexDirection: 'row',
                            justifyContent: 'center',
                        })
                    }, { specificityWeight: 2 }),
                }),
                ...rule(':root', {
                    ...vars({
                        '--gutter': '10px',
                        '--gapSm': '0.5rem',
                        '--gapLg': '2rem',
                        '--btn-minHeight': '1.5rem',
                    })
                }),
            }),
        ], { id: '#sheet#25' });
        expect(render(sheet1))
        .toEqual(
`
.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
body {
margin: 0;
padding: 0;
background: white;
}

body>:is(div, .container) {
border: solid 2px black;
display: block;
}

:is(.checkbox, input[type="checkbox"]):nth-child(n) {
appearance: none;
display: flex;
flex-direction: row;
justify-content: center;
}

}

:root {
--gutter: 10px;
--gapSm: 0.5rem;
--gapLg: 2rem;
--btn-minHeight: 1.5rem;
}
`
        );
    });
    test(`render() # test @global`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...atGlobal({
                        ...atRule('@media (min-width: 1024px)', {
                            ...rule('.btn', {
                                background: 'pink',
                                color: 'red',
                            }),
                            ...rule('body', {
                                margin: 0,
                                padding: 0,
                                background: 'white',
                                
                                ...children(['div', '.container'], {
                                    border: [['solid', '2px', 'black']],
                                    display: 'block',
                                }),
                            }),
                            ...rule(['.checkbox', 'input[type="checkbox"]'], {
                                appearance: 'none',
                                display: 'flex',
                                
                                ...style({
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                })
                            }, { specificityWeight: 2 }),
                            ...rule(':root', {
                                ...vars({
                                    '--gutter': '10px',
                                    '--gapSm': '0.5rem',
                                    '--gapLg': '2rem',
                                    '--btn-minHeight': '1.5rem',
                                })
                            }),
                        }),
                    }),
                })
            )
        ], { id: '#sheet#26' });
        expect(render(sheet1))
        .toEqual(
`
@media (min-width: 1024px) {
.btn {
background: pink;
color: red;
}

body {
margin: 0;
padding: 0;
background: white;
}

body>:is(div, .container) {
border: solid 2px black;
display: block;
}

:is(.checkbox, input[type="checkbox"]):nth-child(n) {
appearance: none;
display: flex;
flex-direction: row;
justify-content: center;
}

:root {
--gutter: 10px;
--gapSm: 0.5rem;
--gapLg: 2rem;
--btn-minHeight: 1.5rem;
}

}
`
        );
    });
    test(`render() # test globalScope`, () => {
        const sheet1 = styleSheet(() => [
            globalScope({
                ...atRule('@media (min-width: 1024px)', {
                    ...rule('.btn', {
                        background: 'pink',
                        color: 'red',
                    }),
                    ...rule('body', {
                        margin: 0,
                        padding: 0,
                        background: 'white',
                        
                        ...children(['div', '.container'], {
                            border: [['solid', '2px', 'black']],
                            display: 'block',
                        }),
                    }),
                    ...rule(['.checkbox', 'input[type="checkbox"]'], {
                        appearance: 'none',
                        display: 'flex',
                        
                        ...style({
                            flexDirection: 'row',
                            justifyContent: 'center',
                        })
                    }, { specificityWeight: 2 }),
                    ...rule(':root', {
                        ...vars({
                            '--gutter': '10px',
                            '--gapSm': '0.5rem',
                            '--gapLg': '2rem',
                            '--btn-minHeight': '1.5rem',
                        })
                    }),
                }),
            }),
        ], { id: '#sheet#27' });
        expect(render(sheet1))
        .toEqual(
`
@media (min-width: 1024px) {
.btn {
background: pink;
color: red;
}

body {
margin: 0;
padding: 0;
background: white;
}

body>:is(div, .container) {
border: solid 2px black;
display: block;
}

:is(.checkbox, input[type="checkbox"]):nth-child(n) {
appearance: none;
display: flex;
flex-direction: row;
justify-content: center;
}

:root {
--gutter: 10px;
--gapSm: 0.5rem;
--gapLg: 2rem;
--btn-minHeight: 1.5rem;
}

}
`
        );
    });
    //#endregion @global
    
    
    
    //#region .rule
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...rule('.btn', {
                        background: 'pink',
                        color: 'red',
                    }),
                    ...atRule('@media (min-width: 1024px)', {
                        opacity: 0.5,
                        cursor: 'pointer',
                        
                        ...rule('.sub-menu', {
                            margin: 0,
                            padding: 0,
                            background: 'white',
                            
                            ...children(['div', '.container'], {
                                border: [['solid', '2px', 'black']],
                                display: 'block',
                            }),
                        }),
                        ...rule(['.checkbox', 'input[type="checkbox"]'], {
                            appearance: 'none',
                            display: 'flex',
                            
                            ...style({
                                flexDirection: 'row',
                                justifyContent: 'center',
                            })
                        }, { specificityWeight: 2 }),
                    }),
                    ...rule('.footer', {
                        ...vars({
                            '--gutter': '10px',
                            '--gapSm': '0.5rem',
                            '--gapLg': '2rem',
                            '--btn-minHeight': '1.5rem',
                        })
                    }),
                })
            )
        ], { id: '#sheet#28' });
        expect(render(sheet1))
        .toEqual(
`
.gw406.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
.gw406 {
opacity: 0.5;
cursor: pointer;
}

.gw406.sub-menu {
margin: 0;
padding: 0;
background: white;
}

.gw406.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

.gw406:is(.checkbox, input[type="checkbox"]):nth-child(n) {
appearance: none;
display: flex;
flex-direction: row;
justify-content: center;
}

}

.gw406.footer {
--gutter: 10px;
--gapSm: 0.5rem;
--gapLg: 2rem;
--btn-minHeight: 1.5rem;
}
`
        );
    });
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...rule('.menu', {
                        ...rule('.btn', {
                            background: 'pink',
                            color: 'red',
                        }),
                        ...atRule('@media (min-width: 1024px)', {
                            opacity: 0.5,
                            cursor: 'pointer',
                            
                            ...rule('.sub-menu', {
                                margin: 0,
                                padding: 0,
                                background: 'white',
                                
                                ...children(['div', '.container'], {
                                    border: [['solid', '2px', 'black']],
                                    display: 'block',
                                }),
                            }),
                            ...rule(['.checkbox', 'input[type="checkbox"]'], {
                                appearance: 'none',
                                display: 'flex',
                                
                                ...style({
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                })
                            }, { specificityWeight: 2 }),
                        }),
                        ...rule('.footer', {
                            ...vars({
                                '--gutter': '10px',
                                '--gapSm': '0.5rem',
                                '--gapLg': '2rem',
                                '--btn-minHeight': '1.5rem',
                            })
                        }),
                    }),
                })
            )
        ], { id: '#sheet#29' });
        expect(render(sheet1))
        .toEqual(
`
.hfwlj.menu.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
.hfwlj.menu {
opacity: 0.5;
cursor: pointer;
}

.hfwlj.menu.sub-menu {
margin: 0;
padding: 0;
background: white;
}

.hfwlj.menu.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

.hfwlj.menu:is(.checkbox, input[type="checkbox"]):nth-child(n) {
appearance: none;
display: flex;
flex-direction: row;
justify-content: center;
}

}

.hfwlj.menu.footer {
--gutter: 10px;
--gapSm: 0.5rem;
--gapLg: 2rem;
--btn-minHeight: 1.5rem;
}
`
        );
    });
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...rule('.menu', {
                        ...rule('.sub-menu', {
                            margin: 0,
                            padding: 0,
                            background: 'white',
                            
                            ...children(['div', '.container'], {
                                ...atRule('@media (min-width: 1024px)', {
                                    border: [['solid', '2px', 'black']],
                                    display: 'block',
                                }),
                            }),
                        }),
                    }),
                })
            )
        ], { id: '#sheet#30' });
        expect(render(sheet1))
        .toEqual(
`
.tjdnh.menu.sub-menu {
margin: 0;
padding: 0;
background: white;
}

@media (min-width: 1024px) {
.tjdnh.menu.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

}
`
        );
    });
    test(`render() # test .rule`, () => {
        const sheet1 = styleSheet(() => [
            mainScope(
                style({
                    ...rule('.menu', {
                        ...rule('.sub-menu', {
                            ...children(['div', '.container'], {
                                ...atRule('@media (min-width: 1024px)', {
                                    border: [['solid', '2px', 'black']],
                                    display: 'block',
                                }),
                            }),
                        }),
                    }),
                })
            )
        ], { id: '#sheet#31' });
        expect(render(sheet1))
        .toEqual(
`
@media (min-width: 1024px) {
.u368u.menu.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

}
`
        );
    });
    //#endregion .rule
    //#endregion test @conditionalRule
});
