import type {
    JSDOM as _JSDOM,
} from 'jsdom'
import type {
    // cssfn properties:
    CssStyle,
    CssScopeList,
}                           from '@cssfn/css-types'
import type {
    // style sheets:
    styleSheets as _styleSheets,
    styleSheet  as _styleSheet,
    
    
    // scopes:
    globalScope as _globalScope,
    atGlobal    as _atGlobal,
    mainScope   as _mainScope,
    rule as _rule,
    // children as _children,
}                           from '@cssfn/cssfn'
import type {
    Subject as _Subject,
}                           from 'rxjs'
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
    let styleSheets : typeof _styleSheets = undefined as any;
    let styleSheet  : typeof _styleSheet  = undefined as any;
    let globalScope : typeof _globalScope = undefined as any;
    let atGlobal    : typeof _atGlobal    = undefined as any;
    let rule        : typeof _rule = undefined as any;
    // let children    : typeof _children = undefined as any;
    let mainScope   : typeof _mainScope = undefined as any;
    let Subject     : typeof _Subject = undefined as any;
    beforeAll(async () => {
        simulateServerSide();
        
        const cssfnModule    = await import('@cssfn/cssfn')
        //@ts-ignore
        const cssfnDomModule = await import('../dist/cssfn-dom.js')
        const rxjsModule     = await import('rxjs')
        
        
        
        styleSheets = cssfnModule.styleSheets
        styleSheet  = cssfnModule.styleSheet
        globalScope = cssfnModule.globalScope
        atGlobal    = cssfnModule.atGlobal
        mainScope   = cssfnModule.mainScope
        rule        = cssfnModule.rule
        // children    = cssfnModule.children
        
        Subject     = rxjsModule.Subject
    });
    
    
    
    test('test no any attached stylesheet', async () => {
        styleSheets(() => [
            globalScope({
                ...rule('button', {
                    appearance: 'none',
                    display: 'flex',
                    flexDirection: 'row',
                }),
            }),
        ]);
    });
    
    
    
    test('test no any attached stylesheet', async () => {
        const stylesheet2 = new Subject<CssScopeList<''>|null>();
        styleSheets(stylesheet2);
        stylesheet2.next([
            globalScope({
                ...rule('input[type="checkbox"]', {
                    display: 'inline-flex',
                    flexDirection: 'row',
                    background: 'pink',
                }),
            }),
        ]);
        
        styleSheets(() => [
            globalScope({
                ...rule('input[type="text"]', {
                    display: 'grid',
                    background: 'gray',
                    color: 'rgb(255, 127, 80)',
                }),
            }),
        ]);
        
        await new Promise<void>((resolve, reject) => { setTimeout(() => {
            try {
                stylesheet2.next(null);
                
                
                
                resolve();
            }
            catch (error) {
                reject(error);
            } // try
        }, 100)});
        
    });
    
    
    
    test('test no any attached stylesheet', async () => {
        const styleSheet4 = styleSheets(() => [
            mainScope({
                display: 'grid',
                gridAutoFlow: 'column',
                gap: '1.25rem',
                '--sheetId': '"ss4"',
            }, { specificityWeight: 3 }),
        ], { id: 'stylesheet#4' });
        
        await new Promise<void>((resolve, reject) => { setTimeout(() => {
            try {
                const mainScopeClass = styleSheet4.main;
                expect(mainScopeClass).toBe('ysbco');
                // console.log('scopeName', mainScopeClass);
                
                
                
                resolve();
            }
            catch (error) {
                reject(error);
            } // try
        }, 100)});
    });
    
    
    
    test('test no any attached stylesheet', async () => {
        styleSheet(() => ({
            ...atGlobal({
                ...rule('button', {
                    appearance: 'none',
                    display: 'flex',
                    flexDirection: 'row',
                }),
            }),
        }));
    });
    
    
    
    test('test no any attached stylesheet', async () => {
        const stylesheet2 = new Subject<CssStyle|null>();
        styleSheet(stylesheet2);
        stylesheet2.next({
            ...atGlobal({
                ...rule('input[type="checkbox"]', {
                    display: 'inline-flex',
                    flexDirection: 'row',
                    background: 'pink',
                }),
            }),
        });
        
        styleSheet(() => ({
            ...atGlobal({
                ...rule('input[type="text"]', {
                    display: 'grid',
                    background: 'gray',
                    color: 'rgb(255, 127, 80)',
                }),
            }),
        }));
        
        await new Promise<void>((resolve, reject) => { setTimeout(() => {
            try {
                stylesheet2.next(null);
                
                
                
                resolve();
            }
            catch (error) {
                reject(error);
            } // try
        }, 100)});
        
    });
    
    
    
    test('test no any attached stylesheet', async () => {
        const styleSheet4 = styleSheet(() => ({
            display: 'grid',
            gridAutoFlow: 'column',
            gap: '1.25rem',
            '--sheetId': '"ss4"',
        }), { id: 'stylesheet#4', specificityWeight: 3 });
        
        await new Promise<void>((resolve, reject) => { setTimeout(() => {
            try {
                const mainScopeClass = styleSheet4;
                expect(mainScopeClass).toBe('ysbco');
                // console.log('scopeName', mainScopeClass);
                
                
                
                resolve();
            }
            catch (error) {
                reject(error);
            } // try
        }, 100)});
    });
});



jest.isolateModules(() => {
    let JSDOM       : typeof _JSDOM = undefined as any;
    let dom         : _JSDOM = undefined as any;
    let styleSheets : typeof _styleSheets = undefined as any;
    let styleSheet  : typeof _styleSheet  = undefined as any;
    let globalScope : typeof _globalScope = undefined as any;
    let atGlobal    : typeof _atGlobal    = undefined as any;
    let rule        : typeof _rule = undefined as any;
    // let children    : typeof _children = undefined as any;
    let mainScope   : typeof _mainScope = undefined as any;
    let Subject     : typeof _Subject = undefined as any;
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
        <div role="button" id="btn2">Click Me!</div>
        
        <input id="check1" type="checkbox" />
        <div role="checkbox" id="check2"></div>

        <input id="text1" type="text" />
        <div role="textbox" id="text2"></div>
    </body>
</html>
`
        );
        simulateBrowserSide(dom);
        
        const cssfnModule    = await import('@cssfn/cssfn')
        //@ts-ignore
        const cssfnDomModule = await import('../dist/cssfn-dom.js')
        const rxjsModule     = await import('rxjs')
        
        
        
        styleSheets = cssfnModule.styleSheets
        styleSheet  = cssfnModule.styleSheet
        globalScope = cssfnModule.globalScope
        atGlobal    = cssfnModule.atGlobal
        mainScope   = cssfnModule.mainScope
        rule        = cssfnModule.rule
        // children    = cssfnModule.children
        
        Subject     = rxjsModule.Subject
    });
    
    
    
    test('test no any attached stylesheet', async () => {
        await new Promise<void>((resolve, reject) => { dom.window.setTimeout(() => {
            try {
                let stylesElm : Element|null = Array.from(dom.window.document.head.querySelectorAll('style')).at(-1) ?? null;
                expect(stylesElm).toBe(null); // no any attached stylesheet yet
                
                
                
                resolve();
            }
            catch (error) {
                reject(error);
            } // try
        }, 100)});
    });
    
    
    
    test('test stylesheet-1', async () => {
        styleSheets(() => [
            globalScope({
                ...rule('button', {
                    appearance: 'none',
                    display: 'flex',
                    flexDirection: 'row',
                }),
            }),
        ]);
        
        await new Promise<void>((resolve, reject) => { dom.window.setTimeout(() => {
            try {
                const stylesElm : Element|null = dom.window.document.head;
                expect(stylesElm).not.toBe(null); // has some attached stylesheet
                // console.log(stylesElm?.outerHTML);
                
                
                
                expect(stylesElm?.outerHTML.includes('button {')).toBe(true);
                const btn1Style = dom.window.getComputedStyle(
                    dom.window.document.querySelector('#btn1')!
                );
                expect(btn1Style.appearance).toBe('none');
                expect(btn1Style.display).toBe('flex');
                expect(btn1Style.flexDirection).toBe('row');
                
                
                
                resolve();
            }
            catch (error) {
                reject(error);
            } // try
        }, 100)});
    });
    
    
    
    test('test stylesheet-2 [+] stylesheet-3 [-] stylesheet-2', async () => {
        const stylesheet2 = new Subject<CssScopeList<''>|null>();
        styleSheets(stylesheet2);
        stylesheet2.next([
            globalScope({
                ...rule('input[type="checkbox"]', {
                    display: 'inline-flex',
                    flexDirection: 'row',
                    background: 'pink',
                }),
            }),
        ]);
        
        
        styleSheets(() => [
            globalScope({
                ...rule('input[type="text"]', {
                    display: 'grid',
                    background: 'gray',
                    color: 'rgb(255, 127, 80)',
                }),
            }),
        ]);
        
        await new Promise<void>((resolve, reject) => { dom.window.setTimeout(() => {
            try {
                const stylesElm : Element|null = dom.window.document.head;
                expect(stylesElm).not.toBe(null); // has some attached stylesheet
                // console.log(stylesElm?.outerHTML);
                
                
                
                expect(stylesElm?.outerHTML.includes('button {')).toBe(true);
                const btn1Style = dom.window.getComputedStyle(
                    dom.window.document.querySelector('#btn1')!
                );
                expect(btn1Style.appearance).toBe('none');
                expect(btn1Style.display).toBe('flex');
                expect(btn1Style.flexDirection).toBe('row');
                
                
                
                expect(stylesElm?.outerHTML.includes('input[type="checkbox"] {')).toBe(true);
                const check1Style = dom.window.getComputedStyle(
                    dom.window.document.querySelector('#check1')!
                );
                expect(check1Style.display).toBe('inline-flex');
                expect(check1Style.flexDirection).toBe('row');
                expect(check1Style.background).toBe('pink');
                
                
                
                expect(stylesElm?.outerHTML.includes('input[type="text"] {')).toBe(true);
                const text1Style = dom.window.getComputedStyle(
                    dom.window.document.querySelector('#text1')!
                );
                expect(text1Style.display).toBe('grid');
                expect(text1Style.background).toBe('gray');
                expect(text1Style.color).toBe('rgb(255, 127, 80)');
                
                
                
                resolve();
            }
            catch (error) {
                reject(error);
            } // try
        }, 100)});
        
        await new Promise<void>((resolve, reject) => { dom.window.setTimeout(() => {
            try {
                stylesheet2.next(null);
                
                
                
                dom.window.setTimeout(() => {
                    try {
                        const stylesElm : Element|null = dom.window.document.head;
                        expect(stylesElm).not.toBe(null); // has some attached stylesheet
                        // console.log(stylesElm?.outerHTML);
                        
                        
                        
                        expect(stylesElm?.outerHTML.includes('button {')).toBe(true);
                        const btn1Style = dom.window.getComputedStyle(
                            dom.window.document.querySelector('#btn1')!
                        );
                        expect(btn1Style.appearance).toBe('none');
                        expect(btn1Style.display).toBe('flex');
                        expect(btn1Style.flexDirection).toBe('row');
                        
                        
                        
                        expect(stylesElm?.outerHTML.includes('input[type="checkbox"] {')).toBe(false);
                        // jsdom doesn't update the css correctly:
                        // const check1Style = dom.window.getComputedStyle(
                        //     dom.window.document.querySelector('#check1')!
                        // );
                        // expect(check1Style.display).toBe('');
                        // expect(check1Style.flexDirection).toBe('');
                        // expect(check1Style.background).toBe('');
                        
                        
                        
                        expect(stylesElm?.outerHTML.includes('input[type="text"] {')).toBe(true);
                        const text1Style = dom.window.getComputedStyle(
                            dom.window.document.querySelector('#text1')!
                        );
                        expect(text1Style.display).toBe('grid');
                        expect(text1Style.background).toBe('gray');
                        expect(text1Style.color).toBe('rgb(255, 127, 80)');
                        
                        
                        
                        resolve();
                    }
                    catch (error) {
                        reject(error);
                    } // try
                }, 100);
            }
            catch (error) {
                reject(error);
            } // try
        }, 100)});
        
    });
    
    
    
    test('test stylesheet-4', async () => {
        const styleSheet4 = styleSheets(() => [
            mainScope({
                display: 'grid',
                gridAutoFlow: 'column',
                gap: '1.25rem',
                '--sheetId': '"ss4"',
            }, { specificityWeight: 3 }),
        ], { id: 'stylesheet#4' });
        
        await new Promise<void>((resolve, reject) => { dom.window.setTimeout(() => {
            try {
                const stylesElm : Element|null = dom.window.document.head;
                expect(stylesElm).not.toBe(null); // has some attached stylesheet
                // console.log(stylesElm?.outerHTML);
                
                
                
                expect(stylesElm?.outerHTML.includes('--sheetId: "ss4"')).toBe(true);
                const mainScopeClass = styleSheet4.main;
                expect(mainScopeClass).toBe('ysbco');
                expect(stylesElm?.outerHTML.includes(`.${mainScopeClass}.${mainScopeClass}.${mainScopeClass} {`)).toBe(true);
                // console.log('scopeName', mainScopeClass);
                
                
                
                resolve();
            }
            catch (error) {
                reject(error);
            } // try
        }, 100)});
    });
    
    
    
    test('test stylesheet-5', async () => {
        const styleSheet5DynContent = new Subject<CssScopeList<'main'>|null>();
        const styleSheet5 = styleSheets(styleSheet5DynContent, { id: 'stylesheet#5' });
        
        await new Promise<void>((resolve, reject) => { dom.window.setTimeout(() => {
            try {
                const stylesElm : Element|null = dom.window.document.head;
                expect(stylesElm).not.toBe(null); // has some attached stylesheet
                // console.log(stylesElm?.outerHTML);
                
                
                expect(stylesElm?.outerHTML.includes('--sheetId: "ss5"')).toBe(false);
                expect(stylesElm?.outerHTML.includes('--myFavColor:')).toBe(false);
                
                
                styleSheet5DynContent.next([
                    mainScope({
                        '--sheetId': '"ss5"',
                        '--myFavColor' : 'yellow',
                    }),
                ])
                dom.window.setTimeout(() => {
                    try {
                        expect(stylesElm?.outerHTML.includes('--sheetId: "ss5"')).toBe(true);
                        expect(stylesElm?.outerHTML.includes('--myFavColor: yellow')).toBe(true);
                        const mainScopeClass = styleSheet5.main;
                        expect(mainScopeClass).toBe('zc3y1');
                        expect(stylesElm?.outerHTML.includes(`.${mainScopeClass} {`)).toBe(true);
                        // console.log('scopeName', mainScopeClass);
                        
                        
                        
                        styleSheet5DynContent.next([
                            mainScope({
                                '--sheetId': '"ss5b"',
                                '--myFavColor' : 'purple',
                            }),
                        ])
                        dom.window.setTimeout(() => {
                            try {
                                expect(stylesElm?.outerHTML.includes('--sheetId: "ss5b"')).toBe(true);
                                expect(stylesElm?.outerHTML.includes('--myFavColor: purple')).toBe(true);
                                const mainScopeClass = styleSheet5.main;
                                expect(mainScopeClass).toBe('zc3y1');
                                expect(stylesElm?.outerHTML.includes(`.${mainScopeClass} {`)).toBe(true);
                                // console.log('scopeName', mainScopeClass);
                                
                                
                                
                                styleSheet5DynContent.next([
                                    mainScope({
                                        '--sheetId': '"ss5c"',
                                        '--myFavColor' : 'cornflowerblue',
                                    }),
                                ])
                                dom.window.setTimeout(() => {
                                    try {
                                        expect(stylesElm?.outerHTML.includes('--sheetId: "ss5c"')).toBe(true);
                                        expect(stylesElm?.outerHTML.includes('--myFavColor: cornflowerblue')).toBe(true);
                                        // console.log(stylesElm?.outerHTML);
                                        const mainScopeClass = styleSheet5.main;
                                        expect(mainScopeClass).toBe('zc3y1');
                                        expect(stylesElm?.outerHTML.includes(`.${mainScopeClass} {`)).toBe(true);
                                        // console.log('scopeName', mainScopeClass);
                                        
                                        
                                        
                                        resolve();
                                    }
                                    catch (error) {
                                        reject(error);
                                    } // try
                                }, 100);
                            }
                            catch (error) {
                                reject(error);
                            } // try
                        }, 100);
                    }
                    catch (error) {
                        reject(error);
                    } // try
                }, 100);
            }
            catch (error) {
                reject(error);
            } // try
        }, 100)});
    });
    
    
    
    test('test stylesheet-1b', async () => {
        styleSheet(() => ({
            ...atGlobal({
                ...rule('[role="button"]', {
                    appearance: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                }),
            }),
        }));
        
        await new Promise<void>((resolve, reject) => { dom.window.setTimeout(() => {
            try {
                const stylesElm : Element|null = dom.window.document.head;
                expect(stylesElm).not.toBe(null); // has some attached stylesheet
                // console.log(stylesElm?.outerHTML);
                
                
                
                expect(stylesElm?.outerHTML.includes('[role="button"] {')).toBe(true);
                const btn1Style = dom.window.getComputedStyle(
                    dom.window.document.querySelector('#btn2')!
                );
                expect(btn1Style.appearance).toBe('none');
                expect(btn1Style.display).toBe('flex');
                expect(btn1Style.flexDirection).toBe('column');
                
                
                
                resolve();
            }
            catch (error) {
                reject(error);
            } // try
        }, 100)});
    });
    
    
    
    test('test stylesheet-2b [+] stylesheet-3b [-] stylesheet-2b', async () => {
        const stylesheet2 = new Subject<CssStyle|null>();
        styleSheet(stylesheet2);
        stylesheet2.next({
            ...atGlobal({
                ...rule('[role="checkbox"]', {
                    display: 'inline-flex',
                    flexDirection: 'row-reverse',
                    background: 'red',
                }),
            }),
        });
        
        
        styleSheet(() => ({
            ...atGlobal({
                ...rule('[role="textbox"]', {
                    display: 'inline-grid',
                    background: 'lightblue',
                    color: 'rgb(0, 0, 139)',
                }),
            }),
        }));
        
        await new Promise<void>((resolve, reject) => { dom.window.setTimeout(() => {
            try {
                const stylesElm : Element|null = dom.window.document.head;
                expect(stylesElm).not.toBe(null); // has some attached stylesheet
                // console.log(stylesElm?.outerHTML);
                
                
                
                expect(stylesElm?.outerHTML.includes('[role="button"] {')).toBe(true);
                const btn1Style = dom.window.getComputedStyle(
                    dom.window.document.querySelector('#btn2')!
                );
                expect(btn1Style.appearance).toBe('none');
                expect(btn1Style.display).toBe('flex');
                expect(btn1Style.flexDirection).toBe('column');
                
                
                
                expect(stylesElm?.outerHTML.includes('[role="checkbox"] {')).toBe(true);
                const check1Style = dom.window.getComputedStyle(
                    dom.window.document.querySelector('#check2')!
                );
                expect(check1Style.display).toBe('inline-flex');
                expect(check1Style.flexDirection).toBe('row-reverse');
                expect(check1Style.background).toBe('red');
                
                
                
                expect(stylesElm?.outerHTML.includes('[role="textbox"] {')).toBe(true);
                const text1Style = dom.window.getComputedStyle(
                    dom.window.document.querySelector('#text2')!
                );
                expect(text1Style.display).toBe('inline-grid');
                expect(text1Style.background).toBe('lightblue');
                expect(text1Style.color).toBe('rgb(0, 0, 139)');
                
                
                
                resolve();
            }
            catch (error) {
                reject(error);
            } // try
        }, 100)});
        
        await new Promise<void>((resolve, reject) => { dom.window.setTimeout(() => {
            try {
                stylesheet2.next(null);
                
                
                
                dom.window.setTimeout(() => {
                    try {
                        const stylesElm : Element|null = dom.window.document.head;
                        expect(stylesElm).not.toBe(null); // has some attached stylesheet
                        // console.log(stylesElm?.outerHTML);
                        
                        
                        
                        expect(stylesElm?.outerHTML.includes('[role="button"] {')).toBe(true);
                        const btn1Style = dom.window.getComputedStyle(
                            dom.window.document.querySelector('#btn2')!
                        );
                        expect(btn1Style.appearance).toBe('none');
                        expect(btn1Style.display).toBe('flex');
                        expect(btn1Style.flexDirection).toBe('column');
                        
                        
                        
                        expect(stylesElm?.outerHTML.includes('[role="checkbox"] {')).toBe(false);
                        // jsdom doesn't update the css correctly:
                        // const check1Style = dom.window.getComputedStyle(
                        //     dom.window.document.querySelector('#check2')!
                        // );
                        // expect(check1Style.display).toBe('inline-flex');
                        // expect(check1Style.flexDirection).toBe('row-reverse');
                        // expect(check1Style.background).toBe('red');
                        
                        
                        
                        expect(stylesElm?.outerHTML.includes('[role="textbox"] {')).toBe(true);
                        const text1Style = dom.window.getComputedStyle(
                            dom.window.document.querySelector('#text2')!
                        );
                        expect(text1Style.display).toBe('inline-grid');
                        expect(text1Style.background).toBe('lightblue');
                        expect(text1Style.color).toBe('rgb(0, 0, 139)');
                        
                        
                        
                        resolve();
                    }
                    catch (error) {
                        reject(error);
                    } // try
                }, 100);
            }
            catch (error) {
                reject(error);
            } // try
        }, 100)});
        
    });
    
    
    
    test('test stylesheet-4b', async () => {
        const styleSheet4 = styleSheet(() => ({
            display: 'grid',
            gridAutoFlow: 'column',
            gap: '1.25rem',
            '--sheetId': '"ss4b"',
        }), { id: 'stylesheet#4b', specificityWeight: 3 });
        
        await new Promise<void>((resolve, reject) => { dom.window.setTimeout(() => {
            try {
                const stylesElm : Element|null = dom.window.document.head;
                expect(stylesElm).not.toBe(null); // has some attached stylesheet
                // console.log(stylesElm?.outerHTML);
                
                
                
                expect(stylesElm?.outerHTML.includes('--sheetId: "ss4b"')).toBe(true);
                const mainScopeClass = styleSheet4;
                expect(mainScopeClass).toBe('ggyis');
                expect(stylesElm?.outerHTML.includes(`.${mainScopeClass}.${mainScopeClass}.${mainScopeClass} {`)).toBe(true);
                // console.log('scopeName', mainScopeClass);
                
                
                
                resolve();
            }
            catch (error) {
                reject(error);
            } // try
        }, 100)});
    });
    
    
    
    test('test stylesheet-5b', async () => {
        const styleSheet5DynContent = new Subject<CssStyle|null>();
        const styleSheet5 = styleSheet(styleSheet5DynContent, { id: 'stylesheet#5b' });
        
        await new Promise<void>((resolve, reject) => { dom.window.setTimeout(() => {
            try {
                const stylesElm : Element|null = dom.window.document.head;
                expect(stylesElm).not.toBe(null); // has some attached stylesheet
                // console.log(stylesElm?.outerHTML);
                
                
                expect(stylesElm?.outerHTML.includes('--sheetId: "ss5b"')).toBe(false);
                expect(stylesElm?.outerHTML.includes('--yourFavColor:')).toBe(false);
                
                
                styleSheet5DynContent.next({
                    '--sheetId': '"ss5b"',
                    '--yourFavColor' : 'yellow',
                })
                dom.window.setTimeout(() => {
                    try {
                        expect(stylesElm?.outerHTML.includes('--sheetId: "ss5b"')).toBe(true);
                        expect(stylesElm?.outerHTML.includes('--yourFavColor: yellow')).toBe(true);
                        const mainScopeClass = styleSheet5;
                        expect(mainScopeClass).toBe('zfc4l');
                        expect(stylesElm?.outerHTML.includes(`.${mainScopeClass} {`)).toBe(true);
                        // console.log('scopeName', mainScopeClass);
                        
                        
                        
                        styleSheet5DynContent.next({
                            '--sheetId': '"ss5bb"',
                            '--yourFavColor' : 'purple',
                        })
                        dom.window.setTimeout(() => {
                            try {
                                expect(stylesElm?.outerHTML.includes('--sheetId: "ss5bb"')).toBe(true);
                                expect(stylesElm?.outerHTML.includes('--yourFavColor: purple')).toBe(true);
                                const mainScopeClass = styleSheet5;
                                expect(mainScopeClass).toBe('zfc4l');
                                expect(stylesElm?.outerHTML.includes(`.${mainScopeClass} {`)).toBe(true);
                                // console.log('scopeName', mainScopeClass);
                                
                                
                                
                                styleSheet5DynContent.next({
                                    '--sheetId': '"ss5bc"',
                                    '--yourFavColor' : 'cornflowerblue',
                                })
                                dom.window.setTimeout(() => {
                                    try {
                                        expect(stylesElm?.outerHTML.includes('--sheetId: "ss5bc"')).toBe(true);
                                        expect(stylesElm?.outerHTML.includes('--yourFavColor: cornflowerblue')).toBe(true);
                                        // console.log(stylesElm?.outerHTML);
                                        const mainScopeClass = styleSheet5;
                                        expect(mainScopeClass).toBe('zfc4l');
                                        expect(stylesElm?.outerHTML.includes(`.${mainScopeClass} {`)).toBe(true);
                                        // console.log('scopeName', mainScopeClass);
                                        
                                        
                                        
                                        resolve();
                                    }
                                    catch (error) {
                                        reject(error);
                                    } // try
                                }, 100);
                            }
                            catch (error) {
                                reject(error);
                            } // try
                        }, 100);
                    }
                    catch (error) {
                        reject(error);
                    } // try
                }, 100);
            }
            catch (error) {
                reject(error);
            } // try
        }, 100)});
    });
});
