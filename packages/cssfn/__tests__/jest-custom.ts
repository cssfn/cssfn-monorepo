import type {
    CssStyle,
    CssKeyframes,
} from '@cssfn/css-types'
import {
    diff,
} from 'jest-diff'



const isDeepEqual     = (received: any, expected: any): boolean => {
    if (received === undefined) {
        return (expected === undefined);
    }
    else if (received === null) {
        return (expected === null);
    }
    else if (typeof(received) === 'object') {
        if (Array.isArray(received) !== Array.isArray(expected)) return false;
        
        
        
        const receivedKeys = [
            ...Object.keys(received),
            ...Object.getOwnPropertySymbols(received),
        ];
        const expectedKeys = [
            ...Object.keys(expected),
            ...Object.getOwnPropertySymbols(expected),
        ];
        
        if (receivedKeys.length !== expectedKeys.length) return false;
        
        for (let i = 0; i < receivedKeys.length; i++) {
            if (receivedKeys[i] !== expectedKeys[i]) return false;
            
            const receivedValue = received[receivedKeys[i]];
            const expectedValue = expected[expectedKeys[i]];
            
            if (!isDeepEqual(receivedValue, expectedValue)) return false;
        } // for
        
        return true;
    }
    else {
        return Object.is(received, expected);
    } // if
}


interface ExactEqualMatchers<R = unknown> {
    toExactEqual(expected: CssStyle|CssKeyframes): R
}
declare global {
    namespace jest {
        interface Expect extends ExactEqualMatchers {}
        interface Matchers<R> extends ExactEqualMatchers<R> {}
        interface InverseAsymmetricMatchers extends ExactEqualMatchers {}
    }
}
expect.extend({
    toExactEqual(this, received, expected) {
        const isMatch = isDeepEqual(received, expected);
        return {
            message : () => isMatch ? 'ok' : `Differences:\n\n${diff(expected, received)}`,
            pass    : isMatch,
        }
    },
});



test('ok', () => { // Your test suite must contain at least one test.
});
