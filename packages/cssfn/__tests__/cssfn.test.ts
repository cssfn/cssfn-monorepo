import type {
    // style sheets:
    StyleSheet,
    styleSheet  as _styleSheet,
    
    
    
    // scopes:
    scopeOf     as _scopeOf,
    mainScope   as _mainScope,
    globalScope as _globalScope,
} from '../src/cssfn'
import type {
    styleSheets as _styleSheets,
} from '../src/styleSheet'
import {
    jest,
} from '@jest/globals'



const simulateBrowserSide = () => {
    jest.resetModules();
    
    const oriWindow   = (typeof(window) === 'undefined'  ) ? undefined : window;
    const oriDocument = (typeof(document) === 'undefined') ? undefined : document;
    if (oriWindow === undefined) {
        const mockWindow = {} as Window;
        (globalThis as any).window = mockWindow;
    } // if
    if (oriDocument === undefined) {
        const mockDocument = { nodeType: 9 } as Document;
        (globalThis as any).document = mockDocument;
        (globalThis as any).window.document = mockDocument;
    } // if
};
const simulateServerSide = () => {
    jest.resetModules();
    
    const oriWindow   = (typeof(window) === 'undefined'  ) ? undefined : window;
    const oriDocument = (typeof(document) === 'undefined') ? undefined : document;
    if (oriWindow !== undefined) {
        (globalThis as any).window = undefined;
    } // if
    if (oriDocument !== undefined) {
        (globalThis as any).document = undefined;
        if (typeof(window) !== 'undefined') window.document = undefined as any;
    } // if
};



jest.isolateModules(() => {
    let styleSheet  : typeof _styleSheet  = undefined as any;
    let scopeOf     : typeof _scopeOf     = undefined as any;
    let mainScope   : typeof _mainScope   = undefined as any;
    let globalScope : typeof _globalScope = undefined as any;
    let styleSheets : typeof _styleSheets = undefined as any;
    beforeAll(async () => {
        simulateBrowserSide();
        
        const cssfnModule      = await import('../src/cssfn')
        const styleSheetModule = await import('../src/styleSheet')
        
        styleSheet  = cssfnModule.styleSheet
        scopeOf     = cssfnModule.scopeOf
        mainScope   = cssfnModule.mainScope
        globalScope = cssfnModule.globalScope
        styleSheets = styleSheetModule.styleSheets
    });
    
    
    
    test('[browser] test registered styleSheets = 0', () => {
        const activeSheets : StyleSheet[] = [];
        styleSheets.subscribe((styleSheet) => {
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
        const sheet1 = styleSheet(() => [
            mainScope(
            ),
            scopeOf('menuBar',
            ),
            globalScope(
            ),
        ], { id: 'sheet1' });
        const sheet2 = styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet2', enabled: false });
        const sheet3 = styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet3' });
        
        const mainClass    = sheet1.classes.main;
        const menuBarClass = sheet1.classes.menuBar;
        
        
        const activeSheets : StyleSheet[] = [];
        styleSheets.subscribe((styleSheet) => {
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
        styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet4' });
        styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet5' });
        
        
        
        const activeSheets : StyleSheet[] = [];
        styleSheets.subscribe((styleSheet) => {
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
        const sheet6 = styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet6' });
        const sheet7 = styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet7' });
        const sheet8 = styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet8', enabled: false });
        const sheet9 = styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet9' });
        
        
        
        const activeSheets : StyleSheet[] = [];
        styleSheets.subscribe((styleSheet) => {
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
        
        sheet8.enabled = true;
        
        expect(activeSheets.length)
        .toBe(8); // 'sheet2' is disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet6', 'sheet7', 'sheet9', 'sheet8']
        
        expect(activeSheets.map((sheet) => sheet.id))
        .toEqual([ // 'sheet2' is disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet6', 'sheet7', 'sheet9', 'sheet8']
            'sheet1', 'sheet3',
            'sheet4', 'sheet5',
            'sheet6', 'sheet7', 'sheet9',
            'sheet8',
        ]);
        
        sheet6.enabled = false;
        sheet9.enabled = false;
        
        expect(activeSheets.length)
        .toBe(6); // ['sheet2', 'sheet6', 'sheet9'] are disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet7', 'sheet8']
        
        expect(activeSheets.map((sheet) => sheet.id))
        .toEqual([ // ['sheet2', 'sheet6', 'sheet9'] are disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet7', 'sheet8']
            'sheet1', 'sheet3',
            'sheet4', 'sheet5',
            'sheet7',
            'sheet8',
        ]);
        
        sheet7.enabled = false;
        
        expect(activeSheets.length)
        .toBe(5); // ['sheet2', 'sheet6', 'sheet7', 'sheet9'] are disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet8']
        
        expect(activeSheets.map((sheet) => sheet.id))
        .toEqual([ // ['sheet2', 'sheet6', 'sheet7', 'sheet9'] are disabled, active: ['sheet1', 'sheet3', 'sheet4', 'sheet5', 'sheet8']
            'sheet1', 'sheet3',
            'sheet4', 'sheet5',
            'sheet8',
        ]);
        
        sheet6.enabled = true;
        
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



jest.isolateModules(() => {
    let styleSheet  : typeof _styleSheet  = undefined as any;
    let scopeOf     : typeof _scopeOf     = undefined as any;
    let mainScope   : typeof _mainScope   = undefined as any;
    let globalScope : typeof _globalScope = undefined as any;
    let styleSheets : typeof _styleSheets = undefined as any;
    beforeAll(async () => {
        simulateServerSide();
        
        const cssfnModule      = await import('../src/cssfn')
        const styleSheetModule = await import('../src/styleSheet')
        
        styleSheet  = cssfnModule.styleSheet
        scopeOf     = cssfnModule.scopeOf
        mainScope   = cssfnModule.mainScope
        globalScope = cssfnModule.globalScope
        styleSheets = styleSheetModule.styleSheets
    });
    
    
    
    test('[server] test registered styleSheets = 0', () => {
        const activeSheets : StyleSheet[] = [];
        styleSheets.subscribe((styleSheet) => {
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
        const sheet1 = styleSheet(() => [
            mainScope(
            ),
            scopeOf('menuBar',
            ),
            globalScope(
            ),
        ], { id: 'sheet1' });
        const sheet2 = styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet2', enabled: false });
        const sheet3 = styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet3' });
        
        const mainClass    = sheet1.classes.main;
        const menuBarClass = sheet1.classes.menuBar;
        
        
        const activeSheets : StyleSheet[] = [];
        styleSheets.subscribe((styleSheet) => {
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
        styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet4' });
        styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet5' });
        
        
        
        const activeSheets : StyleSheet[] = [];
        styleSheets.subscribe((styleSheet) => {
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
        const sheet6 = styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet6' });
        const sheet7 = styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet7' });
        const sheet8 = styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet8', enabled: false });
        const sheet9 = styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet9' });
        
        
        
        const activeSheets : StyleSheet[] = [];
        styleSheets.subscribe((styleSheet) => {
            if (styleSheet.enabled) {
                activeSheets.push(styleSheet);
            } else {
                const index = activeSheets.indexOf(styleSheet);
                if (index >= 0) activeSheets.splice(index, 1);
            } // if
        });
        
        expect(activeSheets.length)
        .toBe(0);
        
        sheet8.enabled = true;
        
        expect(activeSheets.length)
        .toBe(0);
        
        sheet6.enabled = false;
        sheet9.enabled = false;
        
        expect(activeSheets.length)
        .toBe(0);
        
        sheet7.enabled = false;
        
        expect(activeSheets.length)
        .toBe(0);
        
        sheet6.enabled = true;
        
        expect(activeSheets.length)
        .toBe(0);
    });
});
