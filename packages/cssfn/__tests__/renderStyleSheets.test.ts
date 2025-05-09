import type {
    JSDOM as _JSDOM,
} from 'jsdom'
import {
    // style sheets:
    StyleSheet,
    styleSheets        as _styleSheets,
    styleSheet         as _styleSheet,
    styleSheetRegistry as _styleSheetRegistry,
    
    
    
    // rule shortcuts:
    fallback           as _fallback,
    fontFace           as _fontFace,
    property           as _property,
    keyframes          as _keyframes,
    rule               as _rule,
    atRule             as _atRule,
    rules              as _rules,
    atGlobal           as _atGlobal,
    children           as _children,
    vars               as _vars,
    
    
    
    // styles:
    style              as _style,
    
    
    
    // scopes:
    mainScope          as _mainScope,
    globalScope        as _globalScope,
    
    
    
    // processors:
    renderStyleSheet   as _renderStyleSheet,
} from '../dist/index.js'
import {
    jest,
} from '@jest/globals'



const simulateBrowserSide = (dom: _JSDOM) => {
    jest.resetModules();
    
    const oriWindow   = (typeof(window) === 'undefined'  ) ? undefined : window;
    const oriDocument = (typeof(document) === 'undefined') ? undefined : document;
    if (oriWindow === undefined) {
        const mockWindow : Window = dom.window as any;
        (globalThis as any).window = mockWindow;
    } // if
    if (oriDocument === undefined) {
        const mockDocument : Document = dom.window.document;
        (globalThis as any).document = mockDocument;
    } // if
};



jest.isolateModules(() => {
    let JSDOM              : typeof _JSDOM              = undefined as any;
    let dom                : _JSDOM                     = undefined as any;
    let fallback           : typeof _fallback           = undefined as any;
    let fontFace           : typeof _fontFace           = undefined as any;
    let property           : typeof _property           = undefined as any;
    let keyframes          : typeof _keyframes          = undefined as any;
    let rule               : typeof _rule               = undefined as any;
    let atRule             : typeof _atRule             = undefined as any;
    let rules              : typeof _rules              = undefined as any;
    let atGlobal           : typeof _atGlobal           = undefined as any;
    let children           : typeof _children           = undefined as any;
    let vars               : typeof _vars               = undefined as any;
    let style              : typeof _style              = undefined as any;
    let styleSheets        : typeof _styleSheets        = undefined as any;
    let styleSheet         : typeof _styleSheet         = undefined as any;
    let mainScope          : typeof _mainScope          = undefined as any;
    let globalScope        : typeof _globalScope        = undefined as any;
    let styleSheetRegistry : typeof _styleSheetRegistry = undefined as any;
    let renderStyleSheet   : typeof _renderStyleSheet   = undefined as any;
    let lastStyleSheet     : StyleSheet|null            = null;
    beforeAll(async () => {
        const jsdomModule    = await import('jsdom')
        
        JSDOM = jsdomModule.JSDOM
        dom = new JSDOM(
`
<!DOCTYPE html>
<html>
    <head></head>
    <body>
    </body>
</html>
`
        );
        simulateBrowserSide(dom);
        
        const cssfnModule  = await import('../dist/index.js')
        
        fallback           = cssfnModule.fallback
        fontFace           = cssfnModule.fontFace
        property           = cssfnModule.property
        keyframes          = cssfnModule.keyframes
        rule               = cssfnModule.rule
        atRule             = cssfnModule.atRule
        rules              = cssfnModule.rules
        atGlobal           = cssfnModule.atGlobal
        children           = cssfnModule.children
        vars               = cssfnModule.vars
        style              = cssfnModule.style
        styleSheets        = cssfnModule.styleSheets
        styleSheet         = cssfnModule.styleSheet
        mainScope          = cssfnModule.mainScope
        globalScope        = cssfnModule.globalScope
        styleSheetRegistry = cssfnModule.styleSheetRegistry
        renderStyleSheet   = cssfnModule.renderStyleSheet
        
        
        
        styleSheetRegistry.subscribe(({styleSheet, type}) => {
            lastStyleSheet = styleSheet;
        });
    });
    
    
    
    //#region test known buggies
    test(`buggy#1`, () => {
        styleSheets(() => [
            mainScope(
                style({
                    ...fallback({
                        color: 'red',
                    }),
                    ...fallback({
                        color: 'green',
                    }),
                })
            )
        ], { id: '#buggy#1' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.ylzwq {
color: green;
color: red;
}
`
        );
    });
    test(`buggy#2`, () => {
        styleSheets(() => [
            mainScope(
                style({
                    ...rule('.RED', {
                        color: 'red',
                    }),
                    ...rule('.GREEN', {
                        color: 'green',
                    }),
                })
            )
        ], { id: '#buggy#2' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.z5si3.RED {
color: red;
}

.z5si3.GREEN {
color: green;
}
`
        );
    });
    //#endregion test known buggies
    
    
    
    //#region test properties
    test(`renderStyleSheet() # test standard propName`, () => {
        styleSheets(() => [
            mainScope(
                style({
                    background: 'pink',
                    paddingInline: '1rem',
                    borderStartEndRadius: '0.5px',
                })
            )
        ], { id: '#sheet#1' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.z7qv1 {
background: pink;
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}
`
        );
    });
    test(`renderStyleSheet() # test vendor propName`, () => {
        styleSheets(() => [
            mainScope(
                style({
                    WebkitAnimationDelay: '500ms',
                    MozAnimationDelay: '500ms',
                    OAnimationDelay: '500ms',
                    msFlexDirection: 'column',
                })
            )
        ], { id: '#sheet#2' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test custom propName`, () => {
        styleSheets(() => [
            mainScope(
                style({
                    '--custProp1': '"yeah"',
                    'var(--custProp2)': '"cool"',
                    '--my-custProp1': '"okay"',
                    'var(--my-custProp2)': '"good"',
                })
            )
        ], { id: '#sheet#3' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test propValue`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    
    
    
    test(`renderStyleSheet() # test standard propName`, () => {
        styleSheet(() => ({
            background: 'pink',
            paddingInline: '1rem',
            borderStartEndRadius: '0.5px',
        }), { id: '#sheet#1b' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.mxuj5 {
background: pink;
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}
`
        );
    });
    test(`renderStyleSheet() # test vendor propName`, () => {
        styleSheet(() => ({
            WebkitAnimationDelay: '500ms',
            MozAnimationDelay: '500ms',
            OAnimationDelay: '500ms',
            msFlexDirection: 'column',
        }), { id: '#sheet#2b' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.qzgxc {
-webkit-animation-delay: 500ms;
-moz-animation-delay: 500ms;
-o-animation-delay: 500ms;
-ms-flex-direction: column;
}
`
        );
    });
    test(`renderStyleSheet() # test custom propName`, () => {
        styleSheet(() => ({
            '--custProp1': '"yeah"',
            'var(--custProp2)': '"cool"',
            '--my-custProp1': '"okay"',
            'var(--my-custProp2)': '"good"',
        }), { id: '#sheet#3b' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.l13bj {
--custProp1: "yeah";
--custProp2: "cool";
--my-custProp1: "okay";
--my-custProp2: "good";
}
`
        );
    });
    test(`renderStyleSheet() # test propValue`, () => {
        styleSheet(() => ({
            color: 'pink',
            opacity: 0.5,
            content: '"hello world"',
            
            fontFamily: ['Arial', 'sans-serif'],
            background: ['url(image1.png)', 'url(image2.png)', '!important'],
            
            border: [['solid', '2px', 'red']],
            padding: [['10px', 0, '5px', '3%'], '!important'],
            
            boxShadow: [['10px', '5px', '5px', 'black'], ['inset', '5em', '1em', 'gold']],
            backgroundPosition: [[0, 0], ['1cm', '2cm'], ['center'], '!important'],
        }), { id: '#sheet#4b' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.a2ppq {
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
    
    
    
    //#region test @fallback
    test(`renderStyleSheet() # test @fallback`, () => {
        styleSheets(() => [
            mainScope(
                style({
                    background: 'linear-gradient(to right, red 0%, green 100%)',
                    ...fallback({
                        background: 'red',
                    }),
                })
            )
        ], { id: '#sheet#5' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.x0khl {
background: red;
background: linear-gradient(to right, red 0%, green 100%);
}
`
        );
    });
    test(`renderStyleSheet() # test @fallback`, () => {
        styleSheets(() => [
            mainScope(
                style({
                    display: 'grid',
                    ...fallback({
                        display: 'flex',
                    }),
                    ...fallback({
                        display: 'block',
                    }),
                    ...fallback({
                        display: 'inline',
                    }),
                    ...fallback({
                        display: 'none',
                    }),
                })
            )
        ], { id: '#sheet#6' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    
    
    
    test(`renderStyleSheet() # test @fallback`, () => {
        styleSheet(() => ({
            background: 'linear-gradient(to right, red 0%, green 100%)',
            ...fallback({
                background: 'red',
            }),
        }), { id: '#sheet#5b' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.j4c3x {
background: red;
background: linear-gradient(to right, red 0%, green 100%);
}
`
        );
    });
    test(`renderStyleSheet() # test @fallback`, () => {
        styleSheet(() => ({
            display: 'grid',
            ...fallback({
                display: 'flex',
            }),
            ...fallback({
                display: 'block',
            }),
            ...fallback({
                display: 'inline',
            }),
            ...fallback({
                display: 'none',
            }),
        }), { id: '#sheet#6b' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.k5yi4 {
display: none;
display: inline;
display: block;
display: flex;
display: grid;
}
`
        );
    });
    //#endregion test @fallback
    
    
    
    //#region test @font-face
    test(`renderStyleSheet() # test @font-face`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test @font-face`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    
    
    
    test(`renderStyleSheet() # test @font-face`, () => {
        styleSheet(() => ({
            ...fontFace({
                fontFamily: 'Open Sans',
                src: 'url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf")',
                fontWeight: 'bold',
                fontStyle: [['oblique', '40deg']],
            }),
        }), { id: '#sheet#7b' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test @font-face`, () => {
        styleSheet(() => ({
            ...fontFace({
                fontFamily: 'Open Sans',
                src: 'url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf")',
                ...style({
                    fontWeight: 'bold',
                    fontStyle: [['oblique', '40deg']],
                }),
            }),
        }), { id: '#sheet#8b' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    
    
    
    //#region test @property
    test(`renderStyleSheet() # test @property`, () => {
        styleSheets(() => [
            mainScope(
                style({
                    ...property('--theColor', {
                        syntax: '"<color>"',
                        inherits: true,
                        initialValue: 'red',
                    }),
                })
            )
        ], { id: '#sheet#othfmg' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
@property --theColor {
syntax: "<color>";
inherits: true;
initial-value: red;
}
`
        );
    });
    test(`renderStyleSheet() # test @property`, () => {
        styleSheets(() => [
            mainScope(
                style({
                    ...property('var(--theDistance)', {
                        syntax: '"<length>"',
                        inherits: false,
                        initialValue: '3rem',
                    }),
                })
            )
        ], { id: '#sheet#abcdxyz' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
@property --theDistance {
syntax: "<length>";
inherits: false;
initial-value: 3rem;
}
`
        );
    });
    //#endregion test @property
    
    
    
    //#region test @keyframes
    test(`renderStyleSheet() # test @keyframes`, () => {
        styleSheets(() => [
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
        ], { id: '#sheet#aaaa' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test @keyframes`, () => {
        styleSheets(() => [
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
        ], { id: '#sheet#bbbb' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    
    
    
    test(`renderStyleSheet() # test @keyframes`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#cccc' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test @keyframes`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#dddd' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    
    
    
    test(`renderStyleSheet() # test empty @keyframes`, () => {
        styleSheet(() => ({
            ...keyframes('emptyAnimation', {
            }),
        }), { id: '#sheet#eeee' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
@keyframes emptyAnimation {
}
`
        );
    });
    test(`renderStyleSheet() # test empty @keyframes`, () => {
        styleSheet(() => ({
            ...keyframes('emptyAnimation2', {
                from: {
                    ...style({
                    }),
                },
                to: {
                    ...style({
                    }),
                },
            }),
        }), { id: '#sheet#ffff' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
@keyframes emptyAnimation2 {
}
`
        );
    });
    //#endregion test @keyframes
    
    
    
    //#region test .rule
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    
    
    
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#9qq' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.tyciz {
background: pink;
}

.tyciz.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

.tyciz:hover {
color: red;
opacity: 0.3;
}

.tyciz:is(:active, :checked) {
display: grid;
border: solid 2px red;
}

.tyciz:is(.menu, :valid), .tyciz::before {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#10qq' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.eo8n5.rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

.eo8n5:where(:hover) {
color: red;
opacity: 0.3;
}

.eo8n5:is(:active, :checked):nth-child(n) {
display: grid;
border: solid 2px red;
}

.eo8n5:is(.menu, :valid):nth-child(n), .eo8n5::before:nth-child(n):nth-child(n) {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#11qq' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.eq1kw {
background: pink;
}

.eq1kw.rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

.eq1kw:hover:hover:hover {
color: red;
opacity: 0.3;
}

.eq1kw:is(:active, :checked):nth-child(n):nth-child(n) {
display: grid;
border: solid 2px red;
}

.eq1kw:is(.menu, :valid):nth-child(n):nth-child(n), .eq1kw::before:nth-child(n):nth-child(n):nth-child(n) {
visibility: visible;
overflow: auto;
}
`
        );
    });
    
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#12qq', specificityWeight: 3 });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.y4bsx.y4bsx.y4bsx {
background: pink;
}

.y4bsx.y4bsx.y4bsx.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

.y4bsx.y4bsx.y4bsx:hover {
color: red;
opacity: 0.3;
}

.y4bsx.y4bsx.y4bsx:is(:active, :checked) {
display: grid;
border: solid 2px red;
}

.y4bsx.y4bsx.y4bsx:is(.menu, :valid), .y4bsx.y4bsx.y4bsx::before {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#13qq', specificityWeight: 2 });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.elfy6.elfy6.rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

.elfy6.elfy6:where(:hover) {
color: red;
opacity: 0.3;
}

.elfy6.elfy6:is(:active, :checked):nth-child(n) {
display: grid;
border: solid 2px red;
}

.elfy6.elfy6:is(.menu, :valid):nth-child(n), .elfy6.elfy6::before:nth-child(n):nth-child(n) {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#14qq', specificityWeight: 2 });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.q75q5.q75q5 {
background: pink;
}

.q75q5.q75q5.rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

.q75q5.q75q5:hover:hover:hover {
color: red;
opacity: 0.3;
}

.q75q5.q75q5:is(:active, :checked):nth-child(n):nth-child(n) {
display: grid;
border: solid 2px red;
}

.q75q5.q75q5:is(.menu, :valid):nth-child(n):nth-child(n), .q75q5.q75q5::before:nth-child(n):nth-child(n):nth-child(n) {
visibility: visible;
overflow: auto;
}
`
        );
    });
    
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#15qq', specificityWeight: 0 });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
:where(.wsvi4) {
background: pink;
}

:where(.wsvi4).rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

:where(.wsvi4):hover {
color: red;
opacity: 0.3;
}

:where(.wsvi4):is(:active, :checked) {
display: grid;
border: solid 2px red;
}

:where(.wsvi4):is(.menu, :valid), :where(.wsvi4)::before {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#16qq', specificityWeight: 0 });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
:where(.mlepx).rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

:where(.mlepx):where(:hover) {
color: red;
opacity: 0.3;
}

:where(.mlepx):is(:active, :checked):nth-child(n) {
display: grid;
border: solid 2px red;
}

:where(.mlepx):is(.menu, :valid):nth-child(n), :where(.mlepx)::before:nth-child(n):nth-child(n) {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#17qq', specificityWeight: 0 });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
:where(.azoxy) {
background: pink;
}

:where(.azoxy).rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

:where(.azoxy):hover:hover:hover {
color: red;
opacity: 0.3;
}

:where(.azoxy):is(:active, :checked):nth-child(n):nth-child(n) {
display: grid;
border: solid 2px red;
}

:where(.azoxy):is(.menu, :valid):nth-child(n):nth-child(n), :where(.azoxy)::before:nth-child(n):nth-child(n):nth-child(n) {
visibility: visible;
overflow: auto;
}
`
        );
    });
    //#endregion test .rule
    
    //#region test .rule1 x .rule2
    test(`renderStyleSheet() # test .rule1 x .rule2`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    
    
    
    test(`renderStyleSheet() # test .rule1 x .rule2`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#18X' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.hovdv {
background: pink;
}

.hovdv.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

.hovdv.rule:hover {
color: red;
opacity: 0.3;
}

.hovdv:is(:active, :checked) {
display: grid;
border: solid 2px red;
}

.hovdv:is(:active, :checked):is(.menu, :valid), .hovdv:is(:active, :checked)::before {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#19X', specificityWeight: 0 });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
:where(.yqhs2).rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

:where(.yqhs2).rule.rule.rule:where(:hover) {
color: red;
opacity: 0.3;
}

:where(.yqhs2):is(:active, :checked):nth-child(n) {
display: grid;
border: solid 2px red;
}

:where(.yqhs2):is(:active, :checked):nth-child(n):is(.menu, :valid):nth-child(n), :where(.yqhs2):is(:active, :checked):nth-child(n)::before:nth-child(n):nth-child(n) {
visibility: visible;
overflow: auto;
}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#20X', specificityWeight: 0 });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
:where(.dq6gc) {
background: pink;
}

:where(.dq6gc).rule.rule.rule {
padding-inline: 1rem;
border-start-end-radius: 0.5px;
}

:where(.dq6gc).rule.rule.rule:hover {
color: red;
opacity: 0.3;
}

:where(.dq6gc):is(:active, :checked):nth-child(n):nth-child(n) {
display: grid;
border: solid 2px red;
}

:where(.dq6gc):is(:active, :checked):nth-child(n):nth-child(n):is(.menu, :valid), :where(.dq6gc):is(:active, :checked):nth-child(n):nth-child(n)::before {
visibility: visible;
overflow: auto;
}
`
        );
    });
    
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
            ...rule([':hover', '::backdrop'], {
                color: 'red',
                opacity: 0.3,
                
                ...rule(['.menu', ':valid', '::before', '::after'], {
                    visibility: 'visible',
                    overflow: 'auto',
                }),
            }),
        }), { id: '#sheet#blehX' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.blq8t:hover, .blq8t::backdrop {
color: red;
opacity: 0.3;
}

.blq8t:hover:is(.menu, :valid), .blq8t:hover::before, .blq8t:hover::after, .blq8t::backdrop:is(.menu, :valid), .blq8t::backdrop::before, .blq8t::backdrop::after {
visibility: visible;
overflow: auto;
}
`
        );
    });
    //#endregion test .rule1 x .rule2
    
    
    
    //#region test @global
    test(`renderStyleSheet() # test @global`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test globalScope`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    
    
    
    test(`renderStyleSheet() # test @global`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#22X' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    //#endregion test @global
    
    
    
    //#region test @conditionalRule
    //#region @global
    test(`renderStyleSheet() # test @global`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test globalScope`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test @global`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test globalScope`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    
    
    
    test(`renderStyleSheet() # test @global`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#24R' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test @global`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#26R' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
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
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
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
    
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
            mainScope(
                style({
                    ...rule('.btn', {
                        background: 'pink',
                        color: 'red',
                    }),
                    ...atRule('@media (min-width: 1024px)', {
                        opacity: 0.5,
                        cursor: 'pointer',
                        
                        ...atRule('@supports (display: grid)', {
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
                    }),
                })
            )
        ], { id: '#sheet#32' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.umyu7.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
.umyu7 {
opacity: 0.5;
cursor: pointer;
}

@supports (display: grid) {
.umyu7.sub-menu {
margin: 0;
padding: 0;
background: white;
}

.umyu7.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

.umyu7:is(.checkbox, input[type="checkbox"]):nth-child(n) {
appearance: none;
display: flex;
flex-direction: row;
justify-content: center;
}

}

}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
            mainScope(
                style({
                    ...rule('.btn', {
                        background: 'pink',
                        color: 'red',
                    }),
                    ...atRule('@media (min-width: 1024px)', {
                        ...atRule('@supports (display: grid)', {
                            ...rule('.sub-menu', {
                                margin: 0,
                                padding: 0,
                                background: 'white',
                                
                                ...children(['div', '.container'], {
                                    border: [['solid', '2px', 'black']],
                                    display: 'block',
                                }),
                            }),
                        }),
                    }),
                })
            )
        ], { id: '#sheet#33' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.v6rfk.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
@supports (display: grid) {
.v6rfk.sub-menu {
margin: 0;
padding: 0;
background: white;
}

.v6rfk.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

}

}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
            mainScope(
                style({
                    ...rule('.btn', {
                        background: 'pink',
                        color: 'red',
                    }),
                    ...atRule('@media (min-width: 1024px)', {
                        ...rule('.sub-menu', {
                            ...atRule('@supports (display: grid)', {
                                margin: 0,
                                padding: 0,
                                background: 'white',
                                
                                ...children(['div', '.container'], {
                                    border: [['solid', '2px', 'black']],
                                    display: 'block',
                                }),
                            }),
                        }),
                    }),
                })
            )
        ], { id: '#sheet#34' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.vqk0x.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
@supports (display: grid) {
.vqk0x.sub-menu {
margin: 0;
padding: 0;
background: white;
}

.vqk0x.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

}

}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
            mainScope(
                style({
                    ...rule('.btn', {
                        background: 'pink',
                        color: 'red',
                    }),
                    ...atRule('@media (min-width: 1024px)', {
                        ...rule('.sub-menu', {
                            margin: 0,
                            padding: 0,
                            background: 'white',
                            
                            ...children(['div', '.container'], {
                                ...atRule('@supports (display: grid)', {
                                    border: [['solid', '2px', 'black']],
                                    display: 'block',
                                }),
                            }),
                        }),
                    }),
                })
            )
        ], { id: '#sheet#35' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.wacma.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
.wacma.sub-menu {
margin: 0;
padding: 0;
background: white;
}

@supports (display: grid) {
.wacma.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

}

}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheets(() => [
            mainScope(
                style({
                    ...rule('.btn', {
                        background: 'pink',
                        color: 'red',
                    }),
                    ...atRule('@media (min-width: 1024px)', {
                        ...rule('.sub-menu', {
                            ...children(['div', '.container'], {
                                ...atRule('@supports (display: grid)', {
                                    border: [['solid', '2px', 'black']],
                                    display: 'block',
                                }),
                            }),
                        }),
                    }),
                })
            )
        ], { id: '#sheet#36' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.wu57n.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
@supports (display: grid) {
.wu57n.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

}

}
`
        );
    });
    
    
    
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#28N' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.kl7oa.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
.kl7oa {
opacity: 0.5;
cursor: pointer;
}

.kl7oa.sub-menu {
margin: 0;
padding: 0;
background: white;
}

.kl7oa.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

.kl7oa:is(.checkbox, input[type="checkbox"]):nth-child(n) {
appearance: none;
display: flex;
flex-direction: row;
justify-content: center;
}

}

.kl7oa.footer {
--gutter: 10px;
--gapSm: 0.5rem;
--gapLg: 2rem;
--btn-minHeight: 1.5rem;
}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#29N' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.hmu2h.menu.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
.hmu2h.menu {
opacity: 0.5;
cursor: pointer;
}

.hmu2h.menu.sub-menu {
margin: 0;
padding: 0;
background: white;
}

.hmu2h.menu.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

.hmu2h.menu:is(.checkbox, input[type="checkbox"]):nth-child(n) {
appearance: none;
display: flex;
flex-direction: row;
justify-content: center;
}

}

.hmu2h.menu.footer {
--gutter: 10px;
--gapSm: 0.5rem;
--gapLg: 2rem;
--btn-minHeight: 1.5rem;
}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#30N' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.bhj8d.menu.sub-menu {
margin: 0;
padding: 0;
background: white;
}

@media (min-width: 1024px) {
.bhj8d.menu.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
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
        }), { id: '#sheet#31N' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
@media (min-width: 1024px) {
.nfwu6.menu.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

}
`
        );
    });
    
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
            ...rule('.btn', {
                background: 'pink',
                color: 'red',
            }),
            ...atRule('@media (min-width: 1024px)', {
                opacity: 0.5,
                cursor: 'pointer',
                
                ...atRule('@supports (display: grid)', {
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
            }),
        }), { id: '#sheet#32W' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.ig53q.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
.ig53q {
opacity: 0.5;
cursor: pointer;
}

@supports (display: grid) {
.ig53q.sub-menu {
margin: 0;
padding: 0;
background: white;
}

.ig53q.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

.ig53q:is(.checkbox, input[type="checkbox"]):nth-child(n) {
appearance: none;
display: flex;
flex-direction: row;
justify-content: center;
}

}

}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
            ...rule('.btn', {
                background: 'pink',
                color: 'red',
            }),
            ...atRule('@media (min-width: 1024px)', {
                ...atRule('@supports (display: grid)', {
                    ...rule('.sub-menu', {
                        margin: 0,
                        padding: 0,
                        background: 'white',
                        
                        ...children(['div', '.container'], {
                            border: [['solid', '2px', 'black']],
                            display: 'block',
                        }),
                    }),
                }),
            }),
        }), { id: '#sheet#33W' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.keipj.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
@supports (display: grid) {
.keipj.sub-menu {
margin: 0;
padding: 0;
background: white;
}

.keipj.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

}

}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
            ...rule('.btn', {
                background: 'pink',
                color: 'red',
            }),
            ...atRule('@media (min-width: 1024px)', {
                ...rule('.sub-menu', {
                    ...atRule('@supports (display: grid)', {
                        margin: 0,
                        padding: 0,
                        background: 'white',
                        
                        ...children(['div', '.container'], {
                            border: [['solid', '2px', 'black']],
                            display: 'block',
                        }),
                    }),
                }),
            }),
        }), { id: '#sheet#34W' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.ycwbc.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
@supports (display: grid) {
.ycwbc.sub-menu {
margin: 0;
padding: 0;
background: white;
}

.ycwbc.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

}

}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
            ...rule('.btn', {
                background: 'pink',
                color: 'red',
            }),
            ...atRule('@media (min-width: 1024px)', {
                ...rule('.sub-menu', {
                    margin: 0,
                    padding: 0,
                    background: 'white',
                    
                    ...children(['div', '.container'], {
                        ...atRule('@supports (display: grid)', {
                            border: [['solid', '2px', 'black']],
                            display: 'block',
                        }),
                    }),
                }),
            }),
        }), { id: '#sheet#35W' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.mb9x5.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
.mb9x5.sub-menu {
margin: 0;
padding: 0;
background: white;
}

@supports (display: grid) {
.mb9x5.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

}

}
`
        );
    });
    test(`renderStyleSheet() # test .rule`, () => {
        styleSheet(() => ({
            ...rule('.btn', {
                background: 'pink',
                color: 'red',
            }),
            ...atRule('@media (min-width: 1024px)', {
                ...rule('.sub-menu', {
                    ...children(['div', '.container'], {
                        ...atRule('@supports (display: grid)', {
                            border: [['solid', '2px', 'black']],
                            display: 'block',
                        }),
                    }),
                }),
            }),
        }), { id: '#sheet#36W' });
        expect(renderStyleSheet(lastStyleSheet!))
        .resolves
        .toBe(
`
.o9niy.btn {
background: pink;
color: red;
}

@media (min-width: 1024px) {
@supports (display: grid) {
.o9niy.sub-menu>:is(div, .container) {
border: solid 2px black;
display: block;
}

}

}
`
        );
    });
    //#endregion .rule
    //#endregion test @conditionalRule
});
