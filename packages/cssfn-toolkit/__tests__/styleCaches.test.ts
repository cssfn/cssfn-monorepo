import {
    // style,
}                           from '@cssfn/cssfn'
import {
    memorizedStyle,
}                           from '@cssfn/cssfn-toolkit'
import {
    Subject,
}                           from 'rxjs'
import './jest-custom'



let counter1 = 0;
const someStyle = memorizedStyle(() => {
    counter1++;
    return {
        background: 'lightblue',
        color: 'darkblue',
    };
});
test(`test memorizedStyle - 1-1`, () => {
    expect(counter1)
    .toBe(0);
});
test(`test memorizedStyle - 1-2`, () => {
    const val = someStyle();
    
    expect(counter1)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizedStyle - 1-3`, () => {
    const val = someStyle();
    
    expect(counter1)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizedStyle - 1-4`, () => {
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
const awesomeStyle = memorizedStyle((opacity?: number) => {
    counter2++;
    return {
        background: 'lightblue',
        color: 'darkblue',
        opacity: opacity ?? 0.55,
    };
});
test(`test memorizedStyle - 2-1`, () => {
    expect(counter2)
    .toBe(0);
});
test(`test memorizedStyle - 2-2`, () => {
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
test(`test memorizedStyle - 2-3`, () => {
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
test(`test memorizedStyle - 2-4`, () => {
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
test(`test memorizedStyle - 2-5`, () => {
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
test(`test memorizedStyle - 2-5`, () => {
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
test(`test memorizedStyle - 2-5`, () => {
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
test(`test memorizedStyle - 2-5`, () => {
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
test(`test memorizedStyle - 2-5`, () => {
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
const otherStyle = memorizedStyle(() => {
    counter3++;
    return {
        background: 'lightblue',
        color: 'darkblue',
    };
}, invalidate3);
test(`test memorizedStyle - 3-1`, () => {
    expect(counter3)
    .toBe(0);
});
test(`test memorizedStyle - 3-2`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizedStyle - 3-3`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizedStyle - 3-4`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizedStyle - 3-5`, () => {
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
test(`test memorizedStyle - 3-6`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(2);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizedStyle - 3-7`, () => {
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
test(`test memorizedStyle - 3-8`, () => {
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
test(`test memorizedStyle - 3-9`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(4);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memorizedStyle - 3-10`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(4);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});



let counter4 = 0;
const invalidate4 = new Subject<void>();
const stunningStyle = memorizedStyle((opacity?: number) => {
    counter4++;
    return {
        background: 'lightblue',
        color: 'darkblue',
        opacity: opacity ?? 0.55,
    };
}, [invalidate4]);
test(`test memorizedStyle - 4-1`, () => {
    expect(counter4)
    .toBe(0);
});
test(`test memorizedStyle - 4-2`, () => {
    const val = stunningStyle();
    
    expect(counter4)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.55,
    });
});
test(`test memorizedStyle - 4-3`, () => {
    const val = stunningStyle();
    
    expect(counter4)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.55,
    });
});
test(`test memorizedStyle - 4-4`, () => {
    const val = stunningStyle();
    
    expect(counter4)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.55,
    });
});
test(`test memorizedStyle - 4-5`, () => {
    const val = stunningStyle(0.33);
    
    expect(counter4)
    .toBe(2);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.33,
    });
});
test(`test memorizedStyle - 4-5`, () => {
    const val = stunningStyle(0.1);
    
    expect(counter4)
    .toBe(3);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.1,
    });
});
test(`test memorizedStyle - 4-5`, () => {
    const val = stunningStyle(0.1);
    
    expect(counter4)
    .toBe(4);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.1,
    });
});
test(`test memorizedStyle - 4-5`, () => {
    const val = stunningStyle(0.1);
    
    expect(counter4)
    .toBe(5);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.1,
    });
});
test(`test memorizedStyle - 4-5`, () => {
    const val = stunningStyle(0.4);
    
    expect(counter4)
    .toBe(6);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.4,
    });
});

test(`test memorizedStyle - 4-6`, () => {
    const val = stunningStyle();
    
    expect(counter4)
    .toBe(6);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.55,
    });
});
test(`test memorizedStyle - 4-7`, () => {
    const val = stunningStyle();
    
    expect(counter4)
    .toBe(6);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.55,
    });
});
test(`test memorizedStyle - 4-8`, () => {
    invalidate4.next();
    const val = stunningStyle();
    
    expect(counter4)
    .toBe(7);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.55,
    });
});
test(`test memorizedStyle - 4-9`, () => {
    const val = stunningStyle();
    
    expect(counter4)
    .toBe(7);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.55,
    });
});
test(`test memorizedStyle - 4-10`, () => {
    invalidate4.next();
    const val = stunningStyle();
    
    expect(counter4)
    .toBe(8);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.55,
    });
});
test(`test memorizedStyle - 4-11`, () => {
    invalidate4.next();
    const val = stunningStyle();
    
    expect(counter4)
    .toBe(9);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.55,
    });
});
test(`test memorizedStyle - 4-12`, () => {
    const val = stunningStyle();
    
    expect(counter4)
    .toBe(9);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        opacity: 0.55,
    });
});
