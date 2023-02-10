import {
    // style,
}                           from '@cssfn/cssfn'
import {
    memorizeStyle,
}                           from '@cssfn/cssfn-toolkit'
import {
    Subject,
}                           from 'rxjs'
import './jest-custom'



let counter1 = 0;
const someStyle = memorizeStyle(() => {
    counter1++;
    return {
        background: 'lightblue',
        color: 'darkblue',
    };
});
test(`test memorizeStyle - 1-1`, () => {
    expect(counter1)
    .toBe(0);
});
test(`test memorizeStyle - 1-2`, () => {
    const val = someStyle();
    
    expect(counter1)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizeStyle - 1-3`, () => {
    const val = someStyle();
    
    expect(counter1)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizeStyle - 1-4`, () => {
    const val = someStyle();
    
    expect(counter1)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});



let counter2 = 0;
const awesomeStyle = memorizeStyle((opacity?: number) => {
    counter2++;
    return {
        background: 'lightblue',
        color: 'darkblue',
        opacity: opacity ?? 0.55,
    };
});
test(`test memorizeStyle - 2-1`, () => {
    expect(counter2)
    .toBe(0);
});
test(`test memorizeStyle - 2-2`, () => {
    const val = awesomeStyle();
    
    expect(counter2)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.55,
    });
});
test(`test memorizeStyle - 2-3`, () => {
    const val = awesomeStyle();
    
    expect(counter2)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.55,
    });
});
test(`test memorizeStyle - 2-4`, () => {
    const val = awesomeStyle();
    
    expect(counter2)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.55,
    });
});
test(`test memorizeStyle - 2-5`, () => {
    const val = awesomeStyle(0.33);
    
    expect(counter2)
    .toBe(2);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.33,
    });
});
test(`test memorizeStyle - 2-5`, () => {
    const val = awesomeStyle(0.1);
    
    expect(counter2)
    .toBe(3);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.1,
    });
});
test(`test memorizeStyle - 2-5`, () => {
    const val = awesomeStyle(0.1);
    
    expect(counter2)
    .toBe(4);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.1,
    });
});
test(`test memorizeStyle - 2-5`, () => {
    const val = awesomeStyle(0.1);
    
    expect(counter2)
    .toBe(5);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.1,
    });
});
test(`test memorizeStyle - 2-5`, () => {
    const val = awesomeStyle(0.4);
    
    expect(counter2)
    .toBe(6);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.4,
    });
});



let counter3 = 0;
const invalidate3 = new Subject<void>();
const otherStyle = memorizeStyle(() => {
    counter3++;
    return {
        background: 'lightblue',
        color: 'darkblue',
    };
}, invalidate3);
test(`test memorizeStyle - 3-1`, () => {
    expect(counter3)
    .toBe(0);
});
test(`test memorizeStyle - 3-2`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizeStyle - 3-3`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizeStyle - 3-4`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizeStyle - 3-5`, () => {
    invalidate3.next();
    const val = otherStyle();
    
    expect(counter3)
    .toBe(2);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizeStyle - 3-6`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(2);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizeStyle - 3-7`, () => {
    invalidate3.next();
    const val = otherStyle();
    
    expect(counter3)
    .toBe(3);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizeStyle - 3-8`, () => {
    invalidate3.next();
    const val = otherStyle();
    
    expect(counter3)
    .toBe(4);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizeStyle - 3-9`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(4);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizeStyle - 3-10`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(4);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});



