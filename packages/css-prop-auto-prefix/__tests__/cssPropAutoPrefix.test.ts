import {
    BrowserInfo,
    createCssPropAutoPrefix,
} from '../dist/index.js'
import {
    cssKnownProps,
} from '@cssfn/css-prop-list/src/known-css-props'
import {
    pascalCase,
}                           from 'pascal-case'



test(`Simulate Chrome`, () => {
    const browserInfo : BrowserInfo = { prefix: 'Webkit', browserType: '' };
    const cssPropAutoPrefix = createCssPropAutoPrefix(browserInfo);
    
    
    for (const cssProp of cssKnownProps) {
        if (cssProp === 'colorAdjust' || cssProp === 'printColorAdjust') {
            expect(cssPropAutoPrefix(cssProp))
            .toBe('WebkitPrintColorAdjust');
        }
        else if(cssProp.startsWith('mask')) {
            expect(cssPropAutoPrefix(cssProp))
            .toBe('Webkit' + pascalCase(cssProp));
        }
        else {
            expect(cssPropAutoPrefix(cssProp))
                .toBe(cssProp);
        } // if
    } // for
});

test(`Simulate Firefox`, () => {
    const browserInfo : BrowserInfo = { prefix: 'Moz', browserType: '' };
    const cssPropAutoPrefix = createCssPropAutoPrefix(browserInfo);
    
    
    for (const cssProp of cssKnownProps) {
        if(cssProp.startsWith('transition')) {
            expect(cssPropAutoPrefix(cssProp))
            .toBe('Webkit' + pascalCase(cssProp));
        }
        else {
            expect(cssPropAutoPrefix(cssProp))
                .toBe(cssProp);
        } // if
    } // for
});

test(`Simulate Safari`, () => {
    const browserInfo : BrowserInfo = { prefix: 'Webkit', browserType: 'safari' };
    const cssPropAutoPrefix = createCssPropAutoPrefix(browserInfo);
    
    
    for (const cssProp of cssKnownProps) {
        if(cssProp.startsWith('mask')) {
            expect(cssPropAutoPrefix(cssProp))
            .toBe('Webkit' + pascalCase(cssProp));
        }
        else if(cssProp === 'userSelect') {
            expect(cssPropAutoPrefix(cssProp))
            .toBe('Webkit' + pascalCase(cssProp));
        }
        else {
            expect(cssPropAutoPrefix(cssProp))
                .toBe(cssProp);
        } // if
    } // for
});

test(`Simulate Opera`, () => {
    const browserInfo : BrowserInfo = { prefix: 'O', browserType: '' };
    const cssPropAutoPrefix = createCssPropAutoPrefix(browserInfo);
    
    
    for (const cssProp of cssKnownProps) {
        if (cssProp === 'colorAdjust' || cssProp === 'printColorAdjust') {
            expect(cssPropAutoPrefix(cssProp))
            .toBe('WebkitPrintColorAdjust');
        }
        else if(cssProp.startsWith('mask')) {
            expect(cssPropAutoPrefix(cssProp))
            .toBe('Webkit' + pascalCase(cssProp));
        }
        else {
            expect(cssPropAutoPrefix(cssProp))
                .toBe(cssProp);
        } // if
    } // for
});

test(`Simulate Edge`, () => {
    const browserInfo : BrowserInfo = { prefix: 'Webkit', browserType: 'edge' };
    const cssPropAutoPrefix = createCssPropAutoPrefix(browserInfo);
    
    
    for (const cssProp of cssKnownProps) {
        if (cssProp === 'colorAdjust' || cssProp === 'printColorAdjust') {
            expect(cssPropAutoPrefix(cssProp))
            .toBe('WebkitPrintColorAdjust');
        }
        else if(cssProp.startsWith('mask')) {
            expect(cssPropAutoPrefix(cssProp))
            .toBe('Webkit' + pascalCase(cssProp));
        }
        else if(cssProp.startsWith('scrollSnap')) {
            expect(cssPropAutoPrefix(cssProp))
            .toBe('ms' + pascalCase(cssProp));
        }
        else {
            expect(cssPropAutoPrefix(cssProp))
                .toBe(cssProp);
        } // if
    } // for
});