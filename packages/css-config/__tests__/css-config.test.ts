import type {
    JSDOM as _JSDOM,
} from 'jsdom'
import type {
    render      as _render,
} from '@cssfn/cssfn/dist/renders.js'
import {
    // style sheets:
    StyleSheet,
    
    
    
    // rule shortcuts:
    // keyframes   as _keyframes,
} from '@cssfn/cssfn'
import type {
    cssConfig as _cssConfig,
} from '../dist/css-config.js'
import type {
    styleSheetRegistry as _styleSheetRegistry,
} from '@cssfn/cssfn/dist/styleSheets.js'
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
        (globalThis as any).requestAnimationFrame = (callback: FrameRequestCallback): number => {
            callback(0);
            return 123;
        }
    } // if
    if (oriDocument === undefined) {
        const mockDocument : Document = dom.window.document;
        (globalThis as any).document = mockDocument;
    } // if
};



jest.isolateModules(() => {
    let JSDOM              : typeof _JSDOM       = undefined as any;
    let dom                : _JSDOM              = undefined as any;
    // let keyframes          : typeof _keyframes   = undefined as any;
    let cssConfig          : typeof _cssConfig   = undefined as any;
    let styleSheetRegistry : typeof _styleSheetRegistry = undefined as any;
    let render             : typeof _render      = undefined as any;
    let lastStyleSheet     : StyleSheet|null     = null;
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
        
        // const cssfnModule      = await import('@cssfn/cssfn')
        const cssConfigModule  = await import('../dist/css-config.js')
        const styleSheetModule = await import('@cssfn/cssfn/dist/styleSheets.js')
        const renderModule     = await import('@cssfn/cssfn/dist/renders.js')
        
        // keyframes          = cssfnModule.keyframes
        cssConfig          = cssConfigModule.cssConfig
        styleSheetRegistry = styleSheetModule.styleSheetRegistry
        render             = renderModule.render
        
        
        
        styleSheetRegistry.subscribe((newSheet) => {
            lastStyleSheet = newSheet;
        });
    });
    
    
    
    //#region test properties
    test(`render() # test standard propName`, () => {
        const [cssProps, cssVals] = cssConfig(() => {
            return {
                display     : 'grid',
                colRed      : '#ff0000',
                colBlue     : '#0000ff',
                bdWidth     : '1px',
            };
        });
        
        expect(render(lastStyleSheet!))
        .toEqual(
`
:root {
--display: grid;
--colRed: #ff0000;
--colBlue: #0000ff;
--bdWidth: 1px;
}
`
        );
        expect(cssProps.display) .toEqual('var(--display)');
        expect(cssProps.colRed)  .toEqual('var(--colRed)' );
        expect(cssProps.colBlue) .toEqual('var(--colBlue)');
        expect(cssProps.bdWidth) .toEqual('var(--bdWidth)');
        
        expect(cssVals.display) .toEqual('grid'   );
        expect(cssVals.colRed)  .toEqual('#ff0000');
        expect(cssVals.colBlue) .toEqual('#0000ff');
        expect(cssVals.bdWidth) .toEqual('1px'    );
    });
    //#endregion test properties
});
