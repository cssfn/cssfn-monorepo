import {
    // style,
}                           from '@cssfn/cssfn'
import {
    memoizeStyle,
    memoizeStyleWithVariants,
}                           from '@cssfn/cssfn-toolkit'
import {
    Subject,
}                           from 'rxjs'
import './jest-custom'



let counter1 = 0;
const someStyle = memoizeStyle(() => {
    counter1++;
    return {
        background: 'lightblue',
        color: 'darkblue',
    };
});
test(`test memoizeStyle - 1-1`, () => {
    expect(counter1)
    .toBe(0);
});
test(`test memoizeStyle - 1-2`, () => {
    const val = someStyle();
    
    expect(counter1)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memoizeStyle - 1-3`, () => {
    const val = someStyle();
    
    expect(counter1)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memoizeStyle - 1-4`, () => {
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
const awesomeStyle = memoizeStyle((opacity?: number) => {
    counter2++;
    return {
        background: 'lightblue',
        color: 'darkblue',
        opacity: opacity ?? 0.55,
    };
});
test(`test memoizeStyle - 2-1`, () => {
    expect(counter2)
    .toBe(0);
});
test(`test memoizeStyle - 2-2`, () => {
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
test(`test memoizeStyle - 2-3`, () => {
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
test(`test memoizeStyle - 2-4`, () => {
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
test(`test memoizeStyle - 2-5`, () => {
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
test(`test memoizeStyle - 2-6`, () => {
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
test(`test memoizeStyle - 2-7`, () => {
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
test(`test memoizeStyle - 2-8`, () => {
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
test(`test memoizeStyle - 2-9`, () => {
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
const otherStyle = memoizeStyle(() => {
    counter3++;
    return {
        background: 'lightblue',
        color: 'darkblue',
    };
}, invalidate3);
test(`test memoizeStyle - 3-1`, () => {
    expect(counter3)
    .toBe(0);
});
test(`test memoizeStyle - 3-2`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memoizeStyle - 3-3`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memoizeStyle - 3-4`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memoizeStyle - 3-5`, () => {
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
test(`test memoizeStyle - 3-6`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(2);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memoizeStyle - 3-7`, () => {
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
test(`test memoizeStyle - 3-8`, () => {
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
test(`test memoizeStyle - 3-9`, () => {
    const val = otherStyle();
    
    expect(counter3)
    .toBe(4);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
    });
});
test(`test memoizeStyle - 3-10`, () => {
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
const stunningStyle = memoizeStyle((opacity?: number) => {
    counter4++;
    return {
        background: 'lightblue',
        color: 'darkblue',
        opacity: opacity ?? 0.55,
    };
}, [invalidate4]);
test(`test memoizeStyle - 4-1`, () => {
    expect(counter4)
    .toBe(0);
});
test(`test memoizeStyle - 4-2`, () => {
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
test(`test memoizeStyle - 4-3`, () => {
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
test(`test memoizeStyle - 4-4`, () => {
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
test(`test memoizeStyle - 4-5`, () => {
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
test(`test memoizeStyle - 4-6`, () => {
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
test(`test memoizeStyle - 4-7`, () => {
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
test(`test memoizeStyle - 4-8`, () => {
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
test(`test memoizeStyle - 4-9`, () => {
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

test(`test memoizeStyle - 4-10`, () => {
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
test(`test memoizeStyle - 4-11`, () => {
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
test(`test memoizeStyle - 4-12`, () => {
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
test(`test memoizeStyle - 4-13`, () => {
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
test(`test memoizeStyle - 4-14`, () => {
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
test(`test memoizeStyle - 4-15`, () => {
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
test(`test memoizeStyle - 4-16`, () => {
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



let counter5 = 0;
const someStyleVar = memoizeStyleWithVariants((padding: number) => {
    counter5++;
    return {
        background: 'lightblue',
        color: 'darkblue',
        padding: `${padding} ${padding}`,
    };
});
test(`test memoizeStyleWithVariants - 1-1`, () => {
    expect(counter5)
    .toBe(0);
});
test(`test memoizeStyleWithVariants - 1-2`, () => {
    const val = someStyleVar(5);
    
    expect(counter5)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
    });
});
test(`test memoizeStyleWithVariants - 1-3`, () => {
    const val = someStyleVar(5);
    
    expect(counter5)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
    });
});
test(`test memoizeStyleWithVariants - 1-4`, () => {
    const val = someStyleVar(5);
    
    expect(counter5)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
    });
});
test(`test memoizeStyleWithVariants - 1-5`, () => {
    const val = someStyleVar(7);
    
    expect(counter5)
    .toBe(2);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '7 7',
    });
});
test(`test memoizeStyleWithVariants - 1-6`, () => {
    const val = someStyleVar(7);
    
    expect(counter5)
    .toBe(2);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '7 7',
    });
});
test(`test memoizeStyleWithVariants - 1-7`, () => {
    const val = someStyleVar(7);
    
    expect(counter5)
    .toBe(2);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '7 7',
    });
});
test(`test memoizeStyleWithVariants - 1-8`, () => {
    const val = someStyleVar(5);
    
    expect(counter5)
    .toBe(2);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
    });
});
test(`test memoizeStyleWithVariants - 1-9`, () => {
    const val = someStyleVar(7);
    
    expect(counter5)
    .toBe(2);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '7 7',
    });
});



let counter6 = 0;
const awesomeStyleVar = memoizeStyleWithVariants((padding: number, opacity?: number) => {
    counter6++;
    return {
        background: 'lightblue',
        color: 'darkblue',
        padding: `${padding} ${padding}`,
        opacity: opacity ?? 0.55,
    };
});
test(`test memoizeStyleWithVariants - 2-1`, () => {
    expect(counter6)
    .toBe(0);
});
test(`test memoizeStyleWithVariants - 2-2`, () => {
    const val = awesomeStyleVar(5);
    
    expect(counter6)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
        opacity: 0.55,
    });
});
test(`test memoizeStyleWithVariants - 2-3`, () => {
    const val = awesomeStyleVar(5);
    
    expect(counter6)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
        opacity: 0.55,
    });
});
test(`test memoizeStyleWithVariants - 2-4`, () => {
    const val = awesomeStyleVar(5);
    
    expect(counter6)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
        opacity: 0.55,
    });
});
test(`test memoizeStyleWithVariants - 2-5`, () => {
    const val = awesomeStyleVar(5, 0.33);
    
    expect(counter6)
    .toBe(2);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
        opacity: 0.33,
    });
});
test(`test memoizeStyleWithVariants - 2-6`, () => {
    const val = awesomeStyleVar(5, 0.1);
    
    expect(counter6)
    .toBe(3);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
        opacity: 0.1,
    });
});
test(`test memoizeStyleWithVariants - 2-7`, () => {
    const val = awesomeStyleVar(5, 0.1);
    
    expect(counter6)
    .toBe(4);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
        opacity: 0.1,
    });
});
test(`test memoizeStyleWithVariants - 2-8`, () => {
    const val = awesomeStyleVar(5, 0.1);
    
    expect(counter6)
    .toBe(5);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
        opacity: 0.1,
    });
});
test(`test memoizeStyleWithVariants - 2-9`, () => {
    const val = awesomeStyleVar(5, 0.4);
    
    expect(counter6)
    .toBe(6);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
        opacity: 0.4,
    });
});
test(`test memoizeStyleWithVariants - 2-10`, () => {
    const val = awesomeStyleVar(7, 0.4);
    
    expect(counter6)
    .toBe(7);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '7 7',
        opacity: 0.4,
    });
});
test(`test memoizeStyleWithVariants - 2-11`, () => {
    const val = awesomeStyleVar(7, 0.4);
    
    expect(counter6)
    .toBe(8);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '7 7',
        opacity: 0.4,
    });
});
test(`test memoizeStyleWithVariants - 2-12`, () => {
    const val = awesomeStyleVar(7, 0.4);
    
    expect(counter6)
    .toBe(9);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '7 7',
        opacity: 0.4,
    });
});
test(`test memoizeStyleWithVariants - 2-13`, () => {
    const val = awesomeStyleVar(5, 0.4);
    
    expect(counter6)
    .toBe(10);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
        opacity: 0.4,
    });
});
test(`test memoizeStyleWithVariants - 2-14`, () => {
    const val = awesomeStyleVar(7, 0.4);
    
    expect(counter6)
    .toBe(11);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '7 7',
        opacity: 0.4,
    });
});



let counter7 = 0;
const invalidate7 = new Subject<void>();
const otherStyleVar = memoizeStyleWithVariants((padding: number) => {
    counter7++;
    return {
        background: 'lightblue',
        color: 'darkblue',
        padding: `${padding} ${padding}`,
    };
}, invalidate7);
test(`test memoizeStyleWithVariants - 3-1`, () => {
    expect(counter7)
    .toBe(0);
});
test(`test memoizeStyleWithVariants - 3-2`, () => {
    const val = otherStyleVar(5);
    
    expect(counter7)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
    });
});
test(`test memoizeStyleWithVariants - 3-3`, () => {
    const val = otherStyleVar(5);
    
    expect(counter7)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
    });
});
test(`test memoizeStyleWithVariants - 3-4`, () => {
    const val = otherStyleVar(5);
    
    expect(counter7)
    .toBe(1);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
    });
});
test(`test memoizeStyleWithVariants - 3-5`, () => {
    invalidate7.next();
    const val = otherStyleVar(5);
    
    expect(counter7)
    .toBe(2);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
    });
});
test(`test memoizeStyleWithVariants - 3-6`, () => {
    const val = otherStyleVar(5);
    
    expect(counter7)
    .toBe(2);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
    });
});
test(`test memoizeStyleWithVariants - 3-7`, () => {
    invalidate7.next();
    const val = otherStyleVar(5);
    
    expect(counter7)
    .toBe(3);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
    });
});
test(`test memoizeStyleWithVariants - 3-8`, () => {
    invalidate7.next();
    const val = otherStyleVar(5);
    
    expect(counter7)
    .toBe(4);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
    });
});
test(`test memoizeStyleWithVariants - 3-9`, () => {
    const val = otherStyleVar(5);
    
    expect(counter7)
    .toBe(4);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
    });
});
test(`test memoizeStyleWithVariants - 3-10`, () => {
    const val = otherStyleVar(5);
    
    expect(counter7)
    .toBe(4);
    
    expect(val)
    .toExactEqual({
        background: 'lightblue',
        color: 'darkblue',
        padding: '5 5',
    });
});
