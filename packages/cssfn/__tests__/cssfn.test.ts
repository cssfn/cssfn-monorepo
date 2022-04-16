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



const simulateBrowserSide = () => {
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
    simulateBrowserSide();
    
    const cssfnModule = require('../src/cssfn');
    const styleSheet  = cssfnModule.styleSheet  as typeof _styleSheet;
    const scopeOf     = cssfnModule.scopeOf     as typeof _scopeOf;
    const mainScope   = cssfnModule.mainScope   as typeof _mainScope;
    const globalScope = cssfnModule.globalScope as typeof _globalScope;
    
    const styleSheetModule = require('../src/styleSheet');
    const styleSheets = styleSheetModule.styleSheets as typeof _styleSheets;
    
    
    
    test('test registered styleSheets', () => {
    
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
            activeSheets.push(styleSheet);
        });
    
        expect(activeSheets.length)
        .toBe(2);
        
        expect(activeSheets.map((sheet) => sheet.id))
        .toEqual([
            'sheet1', 'sheet3',
        ]);
    });
    
    test('test registered styleSheets', () => {
        styleSheet(() => [
            mainScope(
            ),
            scopeOf('menuBar',
            ),
            globalScope(
            ),
        ], { id: 'sheet4' });
        styleSheet(() => [
            mainScope(
            ),
        ], { id: 'sheet5' });
        
        
        
        const activeSheets : StyleSheet[] = [];
        styleSheets.subscribe((styleSheet) => {
            activeSheets.push(styleSheet);
        });
    
        expect(activeSheets.length)
        .toBe(4);
        
        expect(activeSheets.map((sheet) => sheet.id))
        .toEqual([
            'sheet1', 'sheet3',
            'sheet4', 'sheet5',
        ]);
    });
});

jest.isolateModules(() => {
    simulateBrowserSide();
    
    const cssfnModule = require('../src/cssfn');
    const styleSheet  = cssfnModule.styleSheet  as typeof _styleSheet;
    const scopeOf     = cssfnModule.scopeOf     as typeof _scopeOf;
    const mainScope   = cssfnModule.mainScope   as typeof _mainScope;
    const globalScope = cssfnModule.globalScope as typeof _globalScope;
    
    const styleSheetModule = require('../src/styleSheet');
    const styleSheets = styleSheetModule.styleSheets as typeof _styleSheets;
    
    
    
    test('test registered styleSheets', () => {
        const activeSheets : StyleSheet[] = [];
        styleSheets.subscribe((styleSheet) => {
            activeSheets.push(styleSheet);
        });
    
        expect(activeSheets.length)
        .toBe(0);
    });
});