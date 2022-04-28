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
`
        );
    });
    //#endregion test .rule
});