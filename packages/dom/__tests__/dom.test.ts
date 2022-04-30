// import '../dist/dom.js'
import type {
    JSDOM as _JSDOM,
} from 'jsdom'
import {
    jest,
} from '@jest/globals'



jest.isolateModules(() => {
    let JSDOM : typeof _JSDOM = undefined as any;
    let dom   : _JSDOM = undefined as any;
    beforeAll(async () => {
        const jsdomModule = await import('jsdom')
        
        JSDOM = jsdomModule.JSDOM
        dom = new JSDOM(
`
<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <p id="main">My First JSDOM!</p>
    </body>
</html>
`
        );
    });
    
    
    
    test('test attached stylesheets', () => {
        let stylesElm : Element|null = dom.window.document.head.querySelector('[data-cssfn-dom-styles]');
        expect(stylesElm).toBe(null); // no any attached stylesheet yet
    });
});
