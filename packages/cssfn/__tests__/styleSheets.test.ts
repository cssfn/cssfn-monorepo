import type {
    JSDOM as _JSDOM,
} from 'jsdom'
import type {
    CssScopeList,
} from '@cssfn/css-types'
import type {
    // style sheets:
    StyleSheet,
    styleSheets  as _styleSheets,
    
    
    
    // scopes:
    scopeOf     as _scopeOf,
    mainScope   as _mainScope,
    globalScope as _globalScope,
} from '../dist/cssfn.js'
import type {
    styleSheetRegistry as _styleSheetRegistry,
} from '../dist/styleSheets.js'
import type {
    Subject as _Subject,
} from 'rxjs'
import {
    jest,
} from '@jest/globals'



const simulateServerSide = () => {
    jest.resetModules();
    
    const oriWindow   = (typeof(window) === 'undefined'  ) ? undefined : window;
    const oriDocument = (typeof(document) === 'undefined') ? undefined : document;
    if (oriWindow !== undefined) {
        delete (globalThis as any).window;
    } // if
    if (oriDocument !== undefined) {
        delete (globalThis as any).document;
        if (typeof(window) !== 'undefined') delete (window as any).document;
    } // if
};
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
    let styleSheets        : typeof _styleSheets        = undefined as any;
    let scopeOf            : typeof _scopeOf            = undefined as any;
    let mainScope          : typeof _mainScope          = undefined as any;
    let globalScope        : typeof _globalScope        = undefined as any;
    let styleSheetRegistry : typeof _styleSheetRegistry = undefined as any;
    let Subject            : typeof _Subject            = undefined as any;
    beforeAll(async () => {
        simulateServerSide();
        
        const cssfnModule      = await import('../dist/cssfn.js')
        const styleSheetModule = await import('../dist/styleSheets.js')
        const rxjsModule       = await import('rxjs')
        
        styleSheets        = cssfnModule.styleSheets
        scopeOf            = cssfnModule.scopeOf
        mainScope          = cssfnModule.mainScope
        globalScope        = cssfnModule.globalScope
        styleSheetRegistry = styleSheetModule.styleSheetRegistry
        
        Subject            = rxjsModule.Subject
    });
    
    
    
    test('[server] test registered styleSheets = 0', () => {
        const activeSheets : StyleSheet[] = [];
        styleSheetRegistry.subscribe((styleSheet) => {
            if (styleSheet.enabled) {
                activeSheets.push(styleSheet);
            } else {
                const index = activeSheets.indexOf(styleSheet);
                if (index >= 0) activeSheets.splice(index, 1);
            } // if
        });
        
        expect(activeSheets.length)
        .toBe(0);
    });
    
    test('[server] test registered styleSheets = 2', () => {
        const sheet1 = styleSheets(() => [
            mainScope([]),
            scopeOf('menuBar', []),
            globalScope([]),
        ], { id: 'sheet1' });
        // @ts-ignore
        const sheet2 = styleSheets(() => [
            mainScope([]),
        ], { id: 'sheet2', enabled: false });
        // @ts-ignore
        const sheet3 = styleSheets(() => [
            mainScope([]),
        ], { id: 'sheet3' });
        
        // @ts-ignore
        const mainClass    = sheet1.classes.main;
        // @ts-ignore
        const menuBarClass = sheet1.classes.menuBar;
        
        
        const activeSheets : StyleSheet[] = [];
        styleSheetRegistry.subscribe((styleSheet) => {
            if (styleSheet.enabled) {
                activeSheets.push(styleSheet);
            } else {
                const index = activeSheets.indexOf(styleSheet);
                if (index >= 0) activeSheets.splice(index, 1);
            } // if
        });
        
        expect(activeSheets.length)
        .toBe(0);
    });
    
    test('[server] test registered styleSheets = 4', () => {
        styleSheets(() => [
            mainScope([]),
        ], { id: 'sheet4' });
        styleSheets(() => [
            mainScope([]),
        ], { id: 'sheet5' });
        
        
        
        const activeSheets : StyleSheet[] = [];
        styleSheetRegistry.subscribe((styleSheet) => {
            if (styleSheet.enabled) {
                activeSheets.push(styleSheet);
            } else {
                const index = activeSheets.indexOf(styleSheet);
                if (index >= 0) activeSheets.splice(index, 1);
            } // if
        });
        
        expect(activeSheets.length)
        .toBe(0);
    });
    
    test('[server] test registered styleSheets = 6', () => {
        const sheet6 = new Subject<CssScopeList<'main'>|null>();
        styleSheets(sheet6, { id: 'sheet6' });
        sheet6.next([
            mainScope([]),
        ]);
        
        const sheet7 = new Subject<CssScopeList<'main'>|null>();
        styleSheets(sheet7, { id: 'sheet7' });
        sheet7.next([
            mainScope([]),
        ]);
        
        const sheet8 = new Subject<CssScopeList<'main'>|null>();
        styleSheets(sheet8, { id: 'sheet8' });
        // sheet8.next([
        //     mainScope([]),
        // ]);
        
        const sheet9 = new Subject<CssScopeList<'main'>|null>();
        styleSheets(sheet9, { id: 'sheet9' });
        sheet9.next([
            mainScope([]),
        ]);
        
        
        
        const activeSheets : StyleSheet[] = [];
        styleSheetRegistry.subscribe((styleSheet) => {
            if (styleSheet.enabled) {
                activeSheets.push(styleSheet);
            } else {
                const index = activeSheets.indexOf(styleSheet);
                if (index >= 0) activeSheets.splice(index, 1);
            } // if
        });
        
        expect(activeSheets.length)
        .toBe(0);
        
        sheet8.next([
            mainScope([]),
        ]);
        
        expect(activeSheets.length)
        .toBe(0);
        
        sheet6.next(null);
        sheet9.next(null);
        
        expect(activeSheets.length)
        .toBe(0);
        
        sheet7.next(null);
        
        expect(activeSheets.length)
        .toBe(0);
        
        sheet6.next([
            mainScope([]),
        ]);
        
        expect(activeSheets.length)
        .toBe(0);
    });
});



jest.isolateModules(() => {
    let JSDOM              : typeof _JSDOM = undefined as any;
    let dom                : _JSDOM = undefined as any;
    let styleSheets        : typeof _styleSheets        = undefined as any;
    let scopeOf            : typeof _scopeOf            = undefined as any;
    let mainScope          : typeof _mainScope          = undefined as any;
    let globalScope        : typeof _globalScope        = undefined as any;
    let styleSheetRegistry : typeof _styleSheetRegistry = undefined as any;
    let Subject            : typeof _Subject            = undefined as any;
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
        
        const cssfnModule      = await import('../dist/cssfn.js')
        const styleSheetModule = await import('../dist/styleSheets.js')
        const rxjsModule       = await import('rxjs')
        
        styleSheets        = cssfnModule.styleSheets
        scopeOf            = cssfnModule.scopeOf
        mainScope          = cssfnModule.mainScope
        globalScope        = cssfnModule.globalScope
        styleSheetRegistry = styleSheetModule.styleSheetRegistry
        
        Subject            = rxjsModule.Subject
    });
    
    
    
    test('[browser] test registered styleSheets = 0', () => {
        const activeSheets : StyleSheet[] = [];
        styleSheetRegistry.subscribe((styleSheet) => {
            if (styleSheet.enabled) {
                activeSheets.push(styleSheet);
            } else {
                const index = activeSheets.indexOf(styleSheet);
                if (index >= 0) activeSheets.splice(index, 1);
            } // if
        });
        
        expect(activeSheets.length)
        .toBe(0);
    });
    
    test('[browser] test registered styleSheets = 2', () => {
        const sheet1 = styleSheets(() => [
            mainScope([]),
            scopeOf('menuBar', []),
            globalScope([]),
        ], { id: 'sheet1' });
        // @ts-ignore
        const sheet2 = styleSheets(() => [
            mainScope([]),
        ], { id: 'sheet2', enabled: false });
        // @ts-ignore
        const sheet3 = styleSheets(() => [
            mainScope([]),
        ], { id: 'sheet3' });
        
        // @ts-ignore
        const mainClass    = sheet1.classes.main;
        // @ts-ignore
        const menuBarClass = sheet1.classes.menuBar;
        
        
        const activeSheets : StyleSheet[] = [];
        styleSheetRegistry.subscribe((styleSheet) => {
            if (styleSheet.enabled) {
                activeSheets.push(styleSheet);
            } else {
                const index = activeSheets.indexOf(styleSheet);
                if (index >= 0) activeSheets.splice(index, 1);
            } // if
        });
        
        expect(activeSheets.length)
        .toBe(2); // 'sheet2' is disabled, active: ['sheet1', 'sheet3']
        
        expect(activeSheets.map((sheet) => sheet.id))
        .toEqual([
            'sheet1', 'sheet3', // 'sheet2' is disabled, active: ['sheet1', 'sheet3']
        ]);
    });
    
    test('[browser] test registered styleSheets = 4', () => {
        styleSheets(() => [
            mainScope([]),
        ], { id: 'sheet4' });
        styleSheets(() => [
            mainScope([]),
        ], { id: 'sheet5' });
        
        
        
        const activeSheets : StyleSheet[] = [];
        styleSheetRegistry.subscribe((styleSheet) => {
            if (styleSheet.enabled) {
                activeSheets.push(styleSheet);
            } else {
                const index = activeSheets.indexOf(styleSheet);
                if (index >= 0) activeSheets.splice(index, 1);
            } // if
        });
        
        expect(activeSheets.length)
        .toBe(4); // 'sheet2' is disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5']
        
        expect(activeSheets.map((sheet) => sheet.id))
        .toEqual([ // 'sheet2' is disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5']
            'sheet1', 'sheet3',
            'sheet4', 'sheet5',
        ]);
    });
    
    test('[browser] test registered styleSheets = 6', () => {
        const sheet6 = new Subject<CssScopeList<'main'>|null>();
        styleSheets(sheet6, { id: 'sheet6' });
        sheet6.next([
            mainScope([]),
        ]);
        
        const sheet7 = new Subject<CssScopeList<'main'>|null>();
        styleSheets(sheet7, { id: 'sheet7' });
        sheet7.next([
            mainScope([]),
        ]);
        
        const sheet8 = new Subject<CssScopeList<'main'>|null>();
        styleSheets(sheet8, { id: 'sheet8' });
        // sheet8.next([
        //     mainScope([]),
        // ]);
        
        const sheet9 = new Subject<CssScopeList<'main'>|null>();
        styleSheets(sheet9, { id: 'sheet9' });
        sheet9.next([
            mainScope([]),
        ]);
        
        
        
        const activeSheets : StyleSheet[] = [];
        styleSheetRegistry.subscribe((styleSheet) => {
            if (styleSheet.enabled) {
                activeSheets.push(styleSheet);
            } else {
                const index = activeSheets.indexOf(styleSheet);
                if (index >= 0) activeSheets.splice(index, 1);
            } // if
        });
        
        expect(activeSheets.length)
        .toBe(7); // ['sheet2', 'sheet8'] are disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet6', 'sheet7', 'sheet9']
        
        expect(activeSheets.map((sheet) => sheet.id))
        .toEqual([ // ['sheet2', 'sheet8'] are disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet6', 'sheet7', 'sheet9']
            'sheet1', 'sheet3',
            'sheet4', 'sheet5',
            'sheet6', 'sheet7', 'sheet9',
        ]);
        
        sheet8.next([
            mainScope([]),
        ]);
        
        expect(activeSheets.length)
        .toBe(8); // 'sheet2' is disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet6', 'sheet7', 'sheet9', 'sheet8']
        
        expect(activeSheets.map((sheet) => sheet.id))
        .toEqual([ // 'sheet2' is disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet6', 'sheet7', 'sheet9', 'sheet8']
            'sheet1', 'sheet3',
            'sheet4', 'sheet5',
            'sheet6', 'sheet7', 'sheet9',
            'sheet8',
        ]);
        
        sheet6.next(null);
        sheet9.next(null);
        
        expect(activeSheets.length)
        .toBe(6); // ['sheet2', 'sheet6', 'sheet9'] are disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet7', 'sheet8']
        
        expect(activeSheets.map((sheet) => sheet.id))
        .toEqual([ // ['sheet2', 'sheet6', 'sheet9'] are disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet7', 'sheet8']
            'sheet1', 'sheet3',
            'sheet4', 'sheet5',
            'sheet7',
            'sheet8',
        ]);
        
        sheet7.next(null);
        
        expect(activeSheets.length)
        .toBe(5); // ['sheet2', 'sheet6', 'sheet7', 'sheet9'] are disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet8']
        
        expect(activeSheets.map((sheet) => sheet.id))
        .toEqual([ // ['sheet2', 'sheet6', 'sheet7', 'sheet9'] are disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet8']
            'sheet1', 'sheet3',
            'sheet4', 'sheet5',
            'sheet8',
        ]);
        
        sheet6.next([
            mainScope([]),
        ]);
        
        expect(activeSheets.length)
        .toBe(6); // ['sheet2', 'sheet7', 'sheet9'] are disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet8', 'sheet6']
        
        expect(activeSheets.map((sheet) => sheet.id))
        .toEqual([ // ['sheet2', 'sheet7', 'sheet9'] are disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet8', 'sheet6']
            'sheet1', 'sheet3',
            'sheet4', 'sheet5',
            'sheet8',
            'sheet6',
        ]);
    });
});
