import type {
    render      as _render,
} from '../dist/renders.js'
import type {
    // style sheets:
    styleSheet  as _styleSheet,
    
    
    
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
    let style       : typeof _style       = undefined as any;
    let styleSheet  : typeof _styleSheet  = undefined as any;
    let scopeOf     : typeof _scopeOf     = undefined as any;
    let mainScope   : typeof _mainScope   = undefined as any;
    let globalScope : typeof _globalScope = undefined as any;
    let render      : typeof _render      = undefined as any;
    beforeAll(async () => {
        const cssfnModule      = await import('../dist/cssfn.js')
        const renderModule     = await import('../dist/renders.js')
        
        style       = cssfnModule.style
        styleSheet  = cssfnModule.styleSheet
        scopeOf     = cssfnModule.scopeOf
        mainScope   = cssfnModule.mainScope
        globalScope = cssfnModule.globalScope
        render      = renderModule.render
    });
    
    
    
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
`.z7qv1 {
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
`.yny9o {
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
`.y45ob {
--custProp1: "yeah";
--custProp2: "cool";
--my-custProp1: "okay";
--my-custProp2: "good";

}

`
        );
    });
});