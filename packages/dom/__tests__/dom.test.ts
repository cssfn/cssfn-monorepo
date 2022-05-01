// import '../dist/dom.js'
import type {
    JSDOM as _JSDOM,
} from 'jsdom'
import type {
    // style sheets:
    styleSheet as _styleSheet,
    
    
    // scopes:
    globalScope as _globalScope,
    mainScope   as _mainScope,
    rule as _rule,
    // children as _children,
}                           from '@cssfn/cssfn'
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
        // (globalThis as any).window.document = mockDocument;
    } // if
};



jest.isolateModules(() => {
    let JSDOM       : typeof _JSDOM = undefined as any;
    let dom         : _JSDOM = undefined as any;
    let styleSheet  : typeof _styleSheet = undefined as any;
    let globalScope : typeof _globalScope = undefined as any;
    let rule        : typeof _rule = undefined as any;
    // let children    : typeof _children = undefined as any;
    // let mainScope  : typeof _mainScope = undefined as any;
    beforeAll(async () => {
        const jsdomModule    = await import('jsdom')
        
        JSDOM = jsdomModule.JSDOM
        dom = new JSDOM(
`
<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <button id="btn1">Click Me!</button>
    </body>
</html>
`
        );
        simulateBrowserSide(dom);
        
        const cssfnModule    = await import('@cssfn/cssfn')
        //@ts-ignore
        const cssfnDomModule = await import('../dist/dom.js')
        
        
        
        styleSheet  = cssfnModule.styleSheet
        globalScope = cssfnModule.globalScope
        // mainScope  = cssfnModule.mainScope
        rule        = cssfnModule.rule
        // children    = cssfnModule.children
    });
    
    
    
    test('test no any attached stylesheet', async () => {
        await new Promise<void>((resolve) => { dom.window.setTimeout(() => {
            let stylesElm : Element|null = dom.window.document.head.querySelector('[data-cssfn-dom-styles]');
            expect(stylesElm).toBe(null); // no any attached stylesheet yet
            
            
            
            resolve();
        }, 0)});
    });
    
    
    
    test('test stylesheet-1', async () => {
        styleSheet(() => [
            globalScope({
                ...rule('button', {
                    appearance: 'none',
                    display: 'flex',
                    flexDirection: 'row',
                }),
            }),
        ]);
        
        await new Promise<void>((resolve) => { dom.window.setTimeout(() => {
            const stylesElm : Element|null = dom.window.document.head.querySelector('[data-cssfn-dom-styles]');
            expect(stylesElm).not.toBe(null); // has some attached stylesheet
            console.log(stylesElm?.outerHTML);
            
            const compStyle1 = dom.window.getComputedStyle(
                dom.window.document.querySelector('#btn1')!
            );
            expect(compStyle1.appearance).toBe('none');
            expect(compStyle1.display).toBe('flex');
            expect(compStyle1.flexDirection).toBe('row');
            
            
            
            resolve();
        }, 0)});
    });
});
