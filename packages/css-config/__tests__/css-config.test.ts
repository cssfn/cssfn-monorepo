import type {
    JSDOM as _JSDOM,
} from 'jsdom'
import type {
    CssKnownProps,
} from '@cssfn/css-types'
import {
    renderStyleSheet   as _renderStyleSheet,
    
    // style sheets:
    StyleSheet,
    styleSheetRegistry as _styleSheetRegistry,
    
    
    
    // rule shortcuts:
    keyframes          as _keyframes,
} from '@cssfn/cssfn'
import type {
    cssConfig as _cssConfig,
} from '../dist/css-config.js'
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
    let keyframes          : typeof _keyframes          = undefined as any;
    let cssConfig          : typeof _cssConfig          = undefined as any;
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
        
        const cssfnModule      = await import('@cssfn/cssfn')
        const cssConfigModule  = await import('../dist/css-config.js')
        
        keyframes          = cssfnModule.keyframes
        styleSheetRegistry = cssfnModule.styleSheetRegistry
        renderStyleSheet   = cssfnModule.renderStyleSheet
        cssConfig          = cssConfigModule.cssConfig
        
        
        
        styleSheetRegistry.subscribe(({styleSheet, type}) => {
            lastStyleSheet = styleSheet;
        });
    });
    
    
    
    //#region test properties
    test(`cssConfig() # test props`, async () => {
        const [cssProps, cssVals] = cssConfig(() => {
            return {
                display     : 'grid'    as CssKnownProps['display'],
                colRed      : '#ff0000' as CssKnownProps['color'],
                colBlue     : '#0000ff' as CssKnownProps['color'],
                bdWidth     : '1px'     as CssKnownProps['borderWidth'],
                padding     : [['10px', 0, '5px', '3%'], '!important'] as CssKnownProps['padding'],
                fontFamily  : ['Arial', 'sans-serif', '!important']    as CssKnownProps['fontFamily'],
            };
        });
        
        await new Promise<void>((resolve) => { setTimeout(() => {
            expect(renderStyleSheet(lastStyleSheet!))
            .resolves
            .toBe(
`
:root {
--display: grid;
--colRed: #ff0000;
--colBlue: #0000ff;
--bdWidth: 1px;
--padding: 10px 0 5px 3% !important;
--fontFamily: Arial, sans-serif !important;
}
`
            );
            expect(cssProps.display)    .toBe('var(--display)'   );
            expect(cssProps.colRed)     .toBe('var(--colRed)'    );
            expect(cssProps.colBlue)    .toBe('var(--colBlue)'   );
            expect(cssProps.bdWidth)    .toBe('var(--bdWidth)'   );
            expect(cssProps.padding)    .toBe('var(--padding)'   );
            expect(cssProps.fontFamily) .toBe('var(--fontFamily)');
            
            expect(cssVals.display)    .toBe('grid'   );
            expect(cssVals.colRed)     .toBe('#ff0000');
            expect(cssVals.colBlue)    .toBe('#0000ff');
            expect(cssVals.bdWidth)    .toBe('1px'    );
            expect(cssVals.padding)    .toEqual([['10px', 0, '5px', '3%'], '!important']);
            expect(cssVals.fontFamily) .toEqual(['Arial', 'sans-serif', '!important']);
            
            
            
            resolve();
        }, 0)});
    });
    
    test(`cssConfig() # test options`, async () => {
        const [cssProps, cssVals] = cssConfig(() => {
            return {
                display     : 'grid'    as CssKnownProps['display'],
                colRed      : '#ff0000' as CssKnownProps['color'],
                colBlue     : '#0000ff' as CssKnownProps['color'],
                bdWidth     : '1px'     as CssKnownProps['borderWidth'],
                padding     : [['10px', 0, '5px', '3%'], '!important'] as CssKnownProps['padding'],
                fontFamily  : ['Arial', 'sans-serif', '!important']    as CssKnownProps['fontFamily'],
            };
        }, { prefix: 'navb', selector: '.navbar' });
        
        await new Promise<void>((resolve) => { setTimeout(() => {
            expect(renderStyleSheet(lastStyleSheet!))
            .resolves
            .toBe(
`
.navbar {
--navb-display: grid;
--navb-colRed: #ff0000;
--navb-colBlue: #0000ff;
--navb-bdWidth: 1px;
--navb-padding: 10px 0 5px 3% !important;
--navb-fontFamily: Arial, sans-serif !important;
}
`
            );
            expect(cssProps.display)    .toBe('var(--navb-display)'   );
            expect(cssProps.colRed)     .toBe('var(--navb-colRed)'    );
            expect(cssProps.colBlue)    .toBe('var(--navb-colBlue)'   );
            expect(cssProps.bdWidth)    .toBe('var(--navb-bdWidth)'   );
            expect(cssProps.padding)    .toBe('var(--navb-padding)'   );
            expect(cssProps.fontFamily) .toBe('var(--navb-fontFamily)');
            
            expect(cssVals.display)    .toBe('grid'   );
            expect(cssVals.colRed)     .toBe('#ff0000');
            expect(cssVals.colBlue)    .toBe('#0000ff');
            expect(cssVals.bdWidth)    .toBe('1px'    );
            expect(cssVals.padding)    .toEqual([['10px', 0, '5px', '3%'], '!important']);
            expect(cssVals.fontFamily) .toEqual(['Arial', 'sans-serif', '!important']);
            
            
            
            resolve();
        }, 0)});
    });
    
    test(`cssConfig() # test linking props`, async () => {
        const [cssProps, cssVals] = cssConfig(() => {
            return {
                display     : 'grid'       as CssKnownProps['display'],
                colRed      : '#ff0000'    as CssKnownProps['color'],
                colBlue     : '#0000ff'    as CssKnownProps['color'],
                bdWidth     : '1px'        as CssKnownProps['borderWidth'],
                theTrap     : '!important' as string,
                myFavFont   : 'sans-serif' as CssKnownProps['fontFamily'],
                padding     : [['10px', 0, '5px', '3%'], '!important'] as CssKnownProps['padding'],
                fontFamily  : ['Arial', 'sans-serif', '!important']    as CssKnownProps['fontFamily'],
                
                colFavorite : '#ff0000'    as CssKnownProps['color'],
                theBorder   : [[ 'solid', '1px', '#0000ff' ]]          as CssKnownProps['border'],
            };
        }, { prefix: 'navb' });
        
        await new Promise<void>((resolve) => { setTimeout(() => {
            expect(renderStyleSheet(lastStyleSheet!))
            .resolves
            .toBe(
`
:root {
--navb-display: grid;
--navb-colRed: #ff0000;
--navb-colBlue: #0000ff;
--navb-bdWidth: 1px;
--navb-theTrap: !important;
--navb-myFavFont: sans-serif;
--navb-padding: 10px 0 5px 3% !important;
--navb-fontFamily: Arial, var(--navb-myFavFont) !important;
--navb-colFavorite: var(--navb-colRed);
--navb-theBorder: solid var(--navb-bdWidth) var(--navb-colBlue);
}
`
            );
            expect(cssProps.display)     .toBe('var(--navb-display)'    );
            expect(cssProps.colRed)      .toBe('var(--navb-colRed)'     );
            expect(cssProps.colBlue)     .toBe('var(--navb-colBlue)'    );
            expect(cssProps.bdWidth)     .toBe('var(--navb-bdWidth)'    );
            expect(cssProps.theTrap)     .toBe('var(--navb-theTrap)'    );
            expect(cssProps.myFavFont)   .toBe('var(--navb-myFavFont)'  );
            expect(cssProps.padding)     .toBe('var(--navb-padding)'    );
            expect(cssProps.fontFamily)  .toBe('var(--navb-fontFamily)' );
            expect(cssProps.colFavorite) .toBe('var(--navb-colFavorite)');
            expect(cssProps.theBorder)   .toBe('var(--navb-theBorder)'  );
            
            expect(cssVals.display)     .toBe('grid'      );
            expect(cssVals.colRed)      .toBe('#ff0000'   );
            expect(cssVals.colBlue)     .toBe('#0000ff'   );
            expect(cssVals.bdWidth)     .toBe('1px'       );
            expect(cssVals.theTrap)     .toBe('!important');
            expect(cssVals.myFavFont)   .toBe('sans-serif');
            expect(cssVals.padding)     .toEqual([['10px', 0, '5px', '3%'], '!important']);
            expect(cssVals.fontFamily)  .toEqual(['Arial', 'var(--navb-myFavFont)', '!important']);
            expect(cssVals.colFavorite) .toBe('var(--navb-colRed)');
            expect(cssVals.theBorder)   .toEqual([['solid', 'var(--navb-bdWidth)', 'var(--navb-colBlue)']]);
            
            
            
            resolve();
        }, 0)});
    });
    
    test(`cssConfig() # test linking props`, async () => {
        const [cssProps, cssVals] = cssConfig(() => {
            return {
                display     : 'grid'    as CssKnownProps['display'],
                colRed      : '#ff0000' as CssKnownProps['color'],
                colBlue     : '#0000ff' as CssKnownProps['color'],
                bdWidth     : '1px'     as CssKnownProps['borderWidth'],
                theTrap     : '!important' as string,
                myFavFont   : 'sans-serif' as CssKnownProps['fontFamily'],
                padding     : [['10px', 0, '5px', '3%'], '!important'] as CssKnownProps['padding'],
                fontFamily  : ['Arial', 'sans-serif', '!important']    as CssKnownProps['fontFamily'],
                
                colFavorite : '#ff0000'    as CssKnownProps['color'],
                theBorder   : [[ 'solid', '1px', '#0000ff' ]]          as CssKnownProps['border'],
            };
        }, { prefix: 'navb' });
        
        await new Promise<void>((resolve) => { setTimeout(() => {
            expect(renderStyleSheet(lastStyleSheet!))
            .resolves
            .toBe(
`
:root {
--navb-display: grid;
--navb-colRed: #ff0000;
--navb-colBlue: #0000ff;
--navb-bdWidth: 1px;
--navb-theTrap: !important;
--navb-myFavFont: sans-serif;
--navb-padding: 10px 0 5px 3% !important;
--navb-fontFamily: Arial, var(--navb-myFavFont) !important;
--navb-colFavorite: var(--navb-colRed);
--navb-theBorder: solid var(--navb-bdWidth) var(--navb-colBlue);
}
`
            );
            expect(cssProps.display)     .toBe('var(--navb-display)'    );
            expect(cssProps.colRed)      .toBe('var(--navb-colRed)'     );
            expect(cssProps.colBlue)     .toBe('var(--navb-colBlue)'    );
            expect(cssProps.bdWidth)     .toBe('var(--navb-bdWidth)'    );
            expect(cssProps.theTrap)     .toBe('var(--navb-theTrap)'    );
            expect(cssProps.myFavFont)   .toBe('var(--navb-myFavFont)'  );
            expect(cssProps.padding)     .toBe('var(--navb-padding)'    );
            expect(cssProps.fontFamily)  .toBe('var(--navb-fontFamily)' );
            expect(cssProps.colFavorite) .toBe('var(--navb-colFavorite)');
            expect(cssProps.theBorder)   .toBe('var(--navb-theBorder)'  );
            
            expect(cssVals.display)     .toBe('grid'      );
            expect(cssVals.colRed)      .toBe('#ff0000'   );
            expect(cssVals.colBlue)     .toBe('#0000ff'   );
            expect(cssVals.bdWidth)     .toBe('1px'       );
            expect(cssVals.theTrap)     .toBe('!important');
            expect(cssVals.myFavFont)   .toBe('sans-serif');
            expect(cssVals.padding)     .toEqual([['10px', 0, '5px', '3%'], '!important']);
            expect(cssVals.fontFamily)  .toEqual(['Arial', 'var(--navb-myFavFont)', '!important']);
            expect(cssVals.colFavorite) .toBe('var(--navb-colRed)');
            expect(cssVals.theBorder)   .toEqual([['solid', 'var(--navb-bdWidth)', 'var(--navb-colBlue)']]);
            
            
            
            cssVals.display     = 'flex';
            cssVals.myFavFont   = 'Arial';
            cssVals.colFavorite = '#0000ff';
            cssVals.theBorder   = [['solid', '4px', '#ff0000']];
            setTimeout(() => {
                expect(renderStyleSheet(lastStyleSheet!))
                .resolves
                .toBe(
`
:root {
--navb-display: flex;
--navb-colRed: #ff0000;
--navb-colBlue: #0000ff;
--navb-bdWidth: 1px;
--navb-theTrap: !important;
--navb-myFavFont: Arial;
--navb-padding: 10px 0 5px 3% !important;
--navb-fontFamily: var(--navb-myFavFont), var(--navb-myFavFont) !important;
--navb-colFavorite: var(--navb-colBlue);
--navb-theBorder: solid 4px var(--navb-colRed);
}
`
                );
                expect(cssProps.display)     .toBe('var(--navb-display)'    );
                expect(cssProps.colRed)      .toBe('var(--navb-colRed)'     );
                expect(cssProps.colBlue)     .toBe('var(--navb-colBlue)'    );
                expect(cssProps.bdWidth)     .toBe('var(--navb-bdWidth)'    );
                expect(cssProps.theTrap)     .toBe('var(--navb-theTrap)'    );
                expect(cssProps.myFavFont)   .toBe('var(--navb-myFavFont)'  );
                expect(cssProps.padding)     .toBe('var(--navb-padding)'    );
                expect(cssProps.fontFamily)  .toBe('var(--navb-fontFamily)' );
                expect(cssProps.colFavorite) .toBe('var(--navb-colFavorite)');
                expect(cssProps.theBorder)   .toBe('var(--navb-theBorder)'  );
                
                expect(cssVals.display)     .toBe('flex'      );
                expect(cssVals.colRed)      .toBe('#ff0000'   );
                expect(cssVals.colBlue)     .toBe('#0000ff'   );
                expect(cssVals.bdWidth)     .toBe('1px'       );
                expect(cssVals.theTrap)     .toBe('!important');
                expect(cssVals.myFavFont)   .toBe('Arial');
                expect(cssVals.padding)     .toEqual([['10px', 0, '5px', '3%'], '!important']);
                expect(cssVals.fontFamily)  .toEqual(['var(--navb-myFavFont)', 'var(--navb-myFavFont)', '!important']);
                expect(cssVals.colFavorite) .toBe('var(--navb-colBlue)');
                expect(cssVals.theBorder)   .toEqual([['solid', '4px', 'var(--navb-colRed)']]);
                
                
                
                (cssVals as any).thickBorder = '4px';
                setTimeout(() => {
                    expect(renderStyleSheet(lastStyleSheet!))
                    .resolves
                    .toBe(
`
:root {
--navb-display: flex;
--navb-colRed: #ff0000;
--navb-colBlue: #0000ff;
--navb-bdWidth: 1px;
--navb-theTrap: !important;
--navb-myFavFont: Arial;
--navb-padding: 10px 0 5px 3% !important;
--navb-fontFamily: var(--navb-myFavFont), var(--navb-myFavFont) !important;
--navb-colFavorite: var(--navb-colBlue);
--navb-theBorder: solid var(--navb-thickBorder) var(--navb-colRed);
--navb-thickBorder: 4px;
}
`
                    );
                    expect(cssProps.display)     .toBe('var(--navb-display)'    );
                    expect(cssProps.colRed)      .toBe('var(--navb-colRed)'     );
                    expect(cssProps.colBlue)     .toBe('var(--navb-colBlue)'    );
                    expect(cssProps.bdWidth)     .toBe('var(--navb-bdWidth)'    );
                    expect(cssProps.theTrap)     .toBe('var(--navb-theTrap)'    );
                    expect(cssProps.myFavFont)   .toBe('var(--navb-myFavFont)'  );
                    expect(cssProps.padding)     .toBe('var(--navb-padding)'    );
                    expect(cssProps.fontFamily)  .toBe('var(--navb-fontFamily)' );
                    expect(cssProps.colFavorite) .toBe('var(--navb-colFavorite)');
                    expect(cssProps.theBorder)   .toBe('var(--navb-theBorder)'  );
                    expect((cssProps as any).thickBorder) .toBe('var(--navb-thickBorder)'  );
                    
                    expect(cssVals.display)     .toBe('flex'      );
                    expect(cssVals.colRed)      .toBe('#ff0000'   );
                    expect(cssVals.colBlue)     .toBe('#0000ff'   );
                    expect(cssVals.bdWidth)     .toBe('1px'       );
                    expect(cssVals.theTrap)     .toBe('!important');
                    expect(cssVals.myFavFont)   .toBe('Arial');
                    expect(cssVals.padding)     .toEqual([['10px', 0, '5px', '3%'], '!important']);
                    expect(cssVals.fontFamily)  .toEqual(['var(--navb-myFavFont)', 'var(--navb-myFavFont)', '!important']);
                    expect(cssVals.colFavorite) .toBe('var(--navb-colBlue)');
                    expect(cssVals.theBorder)   .toEqual([['solid', 'var(--navb-thickBorder)', 'var(--navb-colRed)']]);
                    expect((cssVals as any).thickBorder) .toBe('4px'  );
                    
                    
                    
                    resolve();
                }, 0);
            }, 0);
        }, 0)});
    });
    //#endregion test properties
    
    
    
    //#region test @keyframes
    test(`cssConfig() # test @keyframes`, async () => {
        let flyAwayRefObj : object|null = null;
        const [cssProps, cssVals] = cssConfig(() => {
            const [flyAwayRole, flyAwayRef] = keyframes({
                from: {
                    color      : '#ff0000',
                    background : ['url(image1.png)', 'url(image2.png)'],
                },
                to: {
                    color      : '#ffffff',
                    background : ['url(image1b.png)', 'url(image2b.png)'],
                },
            });
            flyAwayRefObj = flyAwayRef;
            
            return {
                display     : 'grid'    as CssKnownProps['display'],
                colRed      : '#ff0000' as CssKnownProps['color'],
                colBlue     : '#0000ff' as CssKnownProps['color'],
                bdWidth     : '1px'     as CssKnownProps['borderWidth'],
                padding     : [['10px', 0, '5px', '3%'], '!important'] as CssKnownProps['padding'],
                fontFamily  : ['Arial', 'sans-serif', '!important']    as CssKnownProps['fontFamily'],
                
                ...flyAwayRole,
                animation   : [[ '100ms', 'ease', flyAwayRef ]]        as CssKnownProps['animation'],
            };
        });
        
        await new Promise<void>((resolve) => { setTimeout(() => {
            expect(renderStyleSheet(lastStyleSheet!))
            .resolves
            .toBe(
`
:root {
--display: grid;
--colRed: #ff0000;
--colBlue: #0000ff;
--bdWidth: 1px;
--padding: 10px 0 5px 3% !important;
--fontFamily: Arial, sans-serif !important;
--animation: 100ms ease k1;
}

@keyframes k1 {
from {
color: var(--colRed);
background: url(image1.png), url(image2.png);
}

to {
color: #ffffff;
background: url(image1b.png), url(image2b.png);
}

}
`
            );
            expect(cssProps.display)    .toBe('var(--display)'   );
            expect(cssProps.colRed)     .toBe('var(--colRed)'    );
            expect(cssProps.colBlue)    .toBe('var(--colBlue)'   );
            expect(cssProps.bdWidth)    .toBe('var(--bdWidth)'   );
            expect(cssProps.padding)    .toBe('var(--padding)'   );
            expect(cssProps.fontFamily) .toBe('var(--fontFamily)');
            expect(cssProps.animation)  .toBe('var(--animation)');
            
            expect(cssVals.display)    .toBe('grid'   );
            expect(cssVals.colRed)     .toBe('#ff0000');
            expect(cssVals.colBlue)    .toBe('#0000ff');
            expect(cssVals.bdWidth)    .toBe('1px'    );
            expect(cssVals.padding)    .toEqual([['10px', 0, '5px', '3%'], '!important']);
            expect(cssVals.fontFamily) .toEqual(['Arial', 'sans-serif', '!important']);
            expect(cssVals.animation)  .toEqual([[ '100ms', 'ease', flyAwayRefObj ]]);
            
            
            
            resolve();
        }, 0)});
    });
    
    test(`cssConfig() # test @keyframes + options`, async () => {
        let flyAwayRefObj   : object|null = null;
        let bounchingRefObj : object|null = null;
        const [cssProps, cssVals] = cssConfig(() => {
            const [flyAwayRole, flyAwayRef] = keyframes({
                from: {
                    color      : '#ff0000',
                    background : ['url(image1.png)', 'url(image2.png)'],
                },
                to: {
                    color      : '#ffffff',
                    background : ['url(image1b.png)', 'url(image2b.png)'],
                },
            });
            flyAwayRefObj = flyAwayRef;
            
            const [bounchingRole, bounchingRef] = keyframes({
                from: {
                    color      : '#0000ff',
                    padding     : [['10px', 0, '5px', '3%'], '!important'],
                },
                to: {
                    color      : '#ff0000',
                    padding     : [['1px', 0, '5px', '3%']],
                },
            });
            bounchingRefObj = bounchingRef;
            
            return {
                display     : 'grid'    as CssKnownProps['display'],
                colRed      : '#ff0000' as CssKnownProps['color'],
                colBlue     : '#0000ff' as CssKnownProps['color'],
                bdWidth     : '1px'     as CssKnownProps['borderWidth'],
                padding     : [['10px', 0, '5px', '3%'], '!important'] as CssKnownProps['padding'],
                fontFamily  : ['Arial', 'sans-serif', '!important']    as CssKnownProps['fontFamily'],
                
                ...flyAwayRole,
                ...bounchingRole,
                animation   : [[ '100ms', 'ease', flyAwayRef ]]        as CssKnownProps['animation'],
                animation2  : [[ '100ms', 'ease', bounchingRef ]]      as CssKnownProps['animation'],
            };
        }, { prefix: 'navb' });
        
        await new Promise<void>((resolve) => { setTimeout(() => {
            expect(renderStyleSheet(lastStyleSheet!))
            .resolves
            .toBe(
`
:root {
--navb-display: grid;
--navb-colRed: #ff0000;
--navb-colBlue: #0000ff;
--navb-bdWidth: 1px;
--navb-padding: 10px 0 5px 3% !important;
--navb-fontFamily: Arial, sans-serif !important;
--navb-animation: 100ms ease k2;
--navb-animation2: 100ms ease k3;
}

@keyframes k2 {
from {
color: var(--navb-colRed);
background: url(image1.png), url(image2.png);
}

to {
color: #ffffff;
background: url(image1b.png), url(image2b.png);
}

}

@keyframes k3 {
from {
color: var(--navb-colBlue);
padding: var(--navb-padding);
}

to {
color: var(--navb-colRed);
padding: var(--navb-bdWidth) 0 5px 3%;
}

}
`
            );
            expect(cssProps.display)    .toBe('var(--navb-display)'   );
            expect(cssProps.colRed)     .toBe('var(--navb-colRed)'    );
            expect(cssProps.colBlue)    .toBe('var(--navb-colBlue)'   );
            expect(cssProps.bdWidth)    .toBe('var(--navb-bdWidth)'   );
            expect(cssProps.padding)    .toBe('var(--navb-padding)'   );
            expect(cssProps.fontFamily) .toBe('var(--navb-fontFamily)');
            expect(cssProps.animation)  .toBe('var(--navb-animation)');
            expect(cssProps.animation2) .toBe('var(--navb-animation2)');
            
            expect(cssVals.display)    .toBe('grid'   );
            expect(cssVals.colRed)     .toBe('#ff0000');
            expect(cssVals.colBlue)    .toBe('#0000ff');
            expect(cssVals.bdWidth)    .toBe('1px'    );
            expect(cssVals.padding)    .toEqual([['10px', 0, '5px', '3%'], '!important']);
            expect(cssVals.fontFamily) .toEqual(['Arial', 'sans-serif', '!important']);
            expect(cssVals.animation)  .toEqual([[ '100ms', 'ease', flyAwayRefObj ]]);
            expect(cssVals.animation2) .toEqual([[ '100ms', 'ease', bounchingRefObj ]]);
            
            
            
            resolve();
        }, 0)});
    });
    
    test(`cssConfig() # test @keyframes + rename ref`, async () => {
        let flyAwayRefObj   : object|null = null;
        let bounchingRefObj : object|null = null;
        const [cssProps, cssVals] = cssConfig(() => {
            const [flyAwayRole, flyAwayRef] = keyframes({
                from: {
                    color      : '#ff0000',
                    background : ['url(image1.png)', 'url(image2.png)'],
                },
                to: {
                    color      : '#ffffff',
                    background : ['url(image1b.png)', 'url(image2b.png)'],
                },
            });
            flyAwayRef.value = 'flyAway';
            flyAwayRefObj = flyAwayRef;
            
            const [bounchingRole, bounchingRef] = keyframes({
                from: {
                    color      : '#0000ff',
                    padding     : [['10px', 0, '5px', '3%'], '!important'],
                },
                to: {
                    color      : '#ff0000',
                    padding     : [['1px', 0, '5px', '3%']],
                },
            });
            bounchingRef.value = 'bounching';
            bounchingRefObj = bounchingRef;
            
            return {
                display     : 'grid'    as CssKnownProps['display'],
                colRed      : '#ff0000' as CssKnownProps['color'],
                colBlue     : '#0000ff' as CssKnownProps['color'],
                bdWidth     : '1px'     as CssKnownProps['borderWidth'],
                padding     : [['10px', 0, '5px', '3%'], '!important'] as CssKnownProps['padding'],
                fontFamily  : ['Arial', 'sans-serif', '!important']    as CssKnownProps['fontFamily'],
                
                ...flyAwayRole,
                ...bounchingRole,
                animation   : [[ '100ms', 'ease', flyAwayRef ]]        as CssKnownProps['animation'],
                animation2  : [[ '100ms', 'ease', bounchingRef ]]      as CssKnownProps['animation'],
            };
        }, { prefix: 'navb' });
        
        await new Promise<void>((resolve) => { setTimeout(() => {
            expect(renderStyleSheet(lastStyleSheet!))
            .resolves
            .toBe(
`
:root {
--navb-display: grid;
--navb-colRed: #ff0000;
--navb-colBlue: #0000ff;
--navb-bdWidth: 1px;
--navb-padding: 10px 0 5px 3% !important;
--navb-fontFamily: Arial, sans-serif !important;
--navb-animation: 100ms ease navb-flyAway;
--navb-animation2: 100ms ease navb-bounching;
}

@keyframes navb-flyAway {
from {
color: var(--navb-colRed);
background: url(image1.png), url(image2.png);
}

to {
color: #ffffff;
background: url(image1b.png), url(image2b.png);
}

}

@keyframes navb-bounching {
from {
color: var(--navb-colBlue);
padding: var(--navb-padding);
}

to {
color: var(--navb-colRed);
padding: var(--navb-bdWidth) 0 5px 3%;
}

}
`
            );
            expect(cssProps.display)    .toBe('var(--navb-display)'   );
            expect(cssProps.colRed)     .toBe('var(--navb-colRed)'    );
            expect(cssProps.colBlue)    .toBe('var(--navb-colBlue)'   );
            expect(cssProps.bdWidth)    .toBe('var(--navb-bdWidth)'   );
            expect(cssProps.padding)    .toBe('var(--navb-padding)'   );
            expect(cssProps.fontFamily) .toBe('var(--navb-fontFamily)');
            expect(cssProps.animation)  .toBe('var(--navb-animation)');
            expect(cssProps.animation2) .toBe('var(--navb-animation2)');
            
            expect(cssVals.display)    .toBe('grid'   );
            expect(cssVals.colRed)     .toBe('#ff0000');
            expect(cssVals.colBlue)    .toBe('#0000ff');
            expect(cssVals.bdWidth)    .toBe('1px'    );
            expect(cssVals.padding)    .toEqual([['10px', 0, '5px', '3%'], '!important']);
            expect(cssVals.fontFamily) .toEqual(['Arial', 'sans-serif', '!important']);
            expect(cssVals.animation)  .toEqual([[ '100ms', 'ease', flyAwayRefObj ]]);
            expect(cssVals.animation2) .toEqual([[ '100ms', 'ease', bounchingRefObj ]]);
            
            
            
            (cssVals as any).animDuration = '100ms';
            (cssVals as any).thickBorder  = '5px';
            setTimeout(() => {
                expect(renderStyleSheet(lastStyleSheet!))
                .resolves
                .toBe(
`
:root {
--navb-display: grid;
--navb-colRed: #ff0000;
--navb-colBlue: #0000ff;
--navb-bdWidth: 1px;
--navb-padding: 10px 0 var(--navb-thickBorder) 3% !important;
--navb-fontFamily: Arial, sans-serif !important;
--navb-animation: var(--navb-animDuration) ease navb-flyAway;
--navb-animation2: var(--navb-animDuration) ease navb-bounching;
--navb-animDuration: 100ms;
--navb-thickBorder: 5px;
}

@keyframes navb-flyAway {
from {
color: var(--navb-colRed);
background: url(image1.png), url(image2.png);
}

to {
color: #ffffff;
background: url(image1b.png), url(image2b.png);
}

}

@keyframes navb-bounching {
from {
color: var(--navb-colBlue);
padding: var(--navb-padding);
}

to {
color: var(--navb-colRed);
padding: var(--navb-bdWidth) 0 var(--navb-thickBorder) 3%;
}

}
`
                );
                expect(cssProps.display)      .toBe('var(--navb-display)'   );
                expect(cssProps.colRed)       .toBe('var(--navb-colRed)'    );
                expect(cssProps.colBlue)      .toBe('var(--navb-colBlue)'   );
                expect(cssProps.bdWidth)      .toBe('var(--navb-bdWidth)'   );
                expect(cssProps.padding)      .toBe('var(--navb-padding)'   );
                expect(cssProps.fontFamily)   .toBe('var(--navb-fontFamily)');
                expect(cssProps.animation)    .toBe('var(--navb-animation)');
                expect(cssProps.animation2)   .toBe('var(--navb-animation2)');
                expect((cssProps as any).animDuration) .toBe('var(--navb-animDuration)');
                expect((cssProps as any).thickBorder)  .toBe('var(--navb-thickBorder)');
                
                expect(cssVals.display)      .toBe('grid'   );
                expect(cssVals.colRed)       .toBe('#ff0000');
                expect(cssVals.colBlue)      .toBe('#0000ff');
                expect(cssVals.bdWidth)      .toBe('1px'    );
                expect(cssVals.padding)      .toEqual([['10px', 0, 'var(--navb-thickBorder)', '3%'], '!important']);
                expect(cssVals.fontFamily)   .toEqual(['Arial', 'sans-serif', '!important']);
                expect(cssVals.animation)    .toEqual([[ 'var(--navb-animDuration)', 'ease', flyAwayRefObj ]]);
                expect(cssVals.animation2)   .toEqual([[ 'var(--navb-animDuration)', 'ease', bounchingRefObj ]]);
                expect((cssVals as any).animDuration) .toBe('100ms');
                expect((cssVals as any).thickBorder)  .toBe('5px');
                
                
                
                resolve();
            }, 0);
        }, 0)});
    });
    //#endregion test @keyframes
});
