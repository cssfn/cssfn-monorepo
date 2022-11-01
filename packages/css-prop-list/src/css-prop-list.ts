// cssfn:
import type {
    // types:
    CssKnownName,
}                           from '@cssfn/css-types'



const indexedWordList: string[] = (
    'border,Block,Inline,scroll,End,Start,text,Color,Style,font,Width,Margin,mask,grid,background,Size,animation,Bottom,Left,Right,Top,margin,padding,Padding,Image,Position,Radius,column,overflow,Decoration,Snap,stroke,flex,Variant,inset,Border,Mode,Break,Rule,offset,Behavior,Clip,color,Adjust,gap,line,max,outline,overscroll,Align,transition,align,Override,Origin,X,Y,Repeat,Rendering,Opacity,Template,justify,Height,list,marker,min,motion,shape,Emphasis,transform,Content,Items,Self,Spacing,box,break,clip,Path,Gap,counter,fill,Wrap,Orientation,Auto,Column,Row,image,Type,math,Anchor,page,place,ruby,scrollbar,word,Tracks,Baseline,Delay,Direction,Duration,Fill,Count,Timing,Function,Visibility,backg,Blend,Shift,block,Overflow,Outset,Slice,Source,Shadow,Sizing,After,Before,Inside,content,Flow,flood,Settings,Columns,Rows,Distance,Rotation,object,Offset,Box,perspective,stop,Skip,Underline,unicode,accent,alignment,all,anim,Composition,Iteration,Name,Play,State,Timeline,appearance,ascent,aspect,Ratio,backdrop,Filter,backface,Attachment,baseline,Collapse,bottom,caption,Side,caret,clear,Interpolation,Scheme,Span,columns,contain,Increment,Reset,Set,cursor,descent,direction,display,dominant,empty,Cells,filter,Basis,Grow,Shrink,float,Family,Feature,Kerning,Language,Optical,Smooth,Stretch,Synthesis,Alternates,Caps,East,Asian,Ligatures,Numeric,Variation,Weight,forced,foreg,foreground,glyph,Vertical,Area,Areas,hanging,Punctuation,height,hyphenate,Character,hyphens,Resolution,initial,Letter,inline,input,Security,isolation,left,letter,lighting,Clamp,Step,Mid,Composite,Depth,Lines,mix,Fit,Rotate,opacity,order,orphans,paint,Order,pointer,Events,position,print,quotes,resize,right,rotate,row,Merge,scale,Stop,Gutter,Threshold,Outside,src,Dasharray,Dashoffset,Linecap,Linejoin,Miterlimit,tab,table,Layout,Last,Combine,Upright,Line,Ink,Thickness,Indent,Justify,Transform,top,touch,Action,transf,Property,translate,Bidi,Range,user,Select,vector,Effect,vertical,visibility,white,Space,widows,width,will,Change,writing,z,Index,zoom'
    .split(',')
);

const indexedKnownCssProps : number[][] = (() : number[][] => {
    const prevWordIndexMap = new Map<number, number>();
    
    return (
        '3p-7,1f-1x,-1y,-1z,-2m,3q-2n,3r,3s,g,-3t,-2o,-2p,-2q,-2r-10,-3u-2s,-3v,-3w-3x,-3y,-2t-2u,3z,40-1g,41-42,43-44,45-2v,2w,-15,e,-46,-2x-10,-15,-7,-o,-1h,-p,--1i,--1j,-1k,-f,47-2y,2z-30,-f,0,-1,--7,--4,---7,---8,---a,--5,---7,---8,---a,--8,--a,-h,--7,--i-q,--j-,--8,--a,-48,-7,-4-4-,--5-,-o,--31,--1k,--32,--33,--a,-2,--7,--4,---7,---8,---a,--5,---7,---8,---a,--8,--a,-i,--7,--8,--a,-q,-j,--7,--8,--a,-20,-5-4-q,--5-,-8,-k,--7,--i-,--j-,--8,--a,-a,49,21-t-11,-34,-35,22-36,-37,-38,4a-4b,4c-7,4d,23,-24,-12,16,-17,-4e,-1l,-4f,r-2s,-2r,-25,-12,--7,--8,--a,-4g,-a,4h,4i,39,-2v,26-4j,-4k,-4l,4m,4n-1g,4o,4p,4q-2n,4r-4s,27,-1m,-12,4t,w,-4u,-2p,-3a,-4v,-4w,-28,4x,3b-7,-1m,9,-4y,-4z-3c,-50,-51-1g,-52-35,-f,--17,-53,-54,-8,-55,-x,--56,--57,--58-59,--5a,--5b,--p,-5c-3c,-5d,5e-7-17,5f,5g,18,-1,-2,-1i,-1j,5h-29-5i,d,-5j,-2a-3d,--3a,--3e,-2b,--4,--5,-2c,--4,--5,-1n,--5k,--3d,--3e,5l-5m,5n,5o-5p,5q,2d-29,-1l,-5r,5s-5t,5u-f,5v-5w,y,-1,--4,--5,-2,--4,--5,5x,1o-1x,-1y,-1z,-2m,5y,5z-20,60-7,19-11,-61,-25-1g,-1p,--62,1q-8,--o,--p,--2e,l,-1,--4,--5,-h,-2,--4,--5,-i,-j,-k,1r,-4,-63,-5,c,-z,--10,--31,--1k,--32,--33,--a,-15,-64,-o,-10,-1h,-p,-1k,-f,-2e,2f-65,-2y,-8,1a-1-f,-1p,-2-,-66,-a,1s-1-,-1p,-2-,-a,67-2x-10,1t,-3f,-24,-3g,3h-68,-p,13,-2g,-3f,-24,-69,-3g,6a,6b,6c,1b,-7,-3i,-8,-a,s,-2g,-1,-15-3j,--b,-2,-28,-1i,-1j,1c-14,--1,--2,--1i,--1j,m,-1,--4,--5,-h,-2,--4,--5,-i,-j,-k,2h-11-36,--37,--38,6d-6e,3k,-1h,2i-1x,-1y,-1z,6f-6g,6h,6i-7-17,6j,6k,6l,6m,6n-25,2j-1d,-6o,-p,6p,3-14,-b,--1,---4,---5,--h,--2,---4,---5,--i,--j,--k,-n,--1,---4,---5,--h,--2,---4,---5,--i,--j,--k,-u-1d,--b,---h,---i,---j,---k,--6q,--2e,2k-7,-6r,-a,1u-o-6s,-b,-6t,-1l,6u,3l-7,-1m,v,-6v,-6w,-6x,-6y,-6z,-1m,-a,70-f,71-72,6-1d,--73,-2g,-74-75,-t,--7,--76,--3m,---77,--8,--78,-1v,--7,--p,--8,-79,-7a,-29,-30,-1l,-34,-f-17,-7b,-3n-3i,--p,7c,7d-7e,7f,1w,-3j,-1h,-8,1e,-2o,-2q,-7g,-2t-2u,7h,3o-7i,-7j,7k-7l,7m-7n,7o-1d,7p,7q-7r,7s,7t,7u-7v,2l-11,-20,-28,7w-10,7x-7y,7z'
        .split(',')
        .map((encodedItem): number[] => ( // decode the base36[] to subWordIndices
            encodedItem.split('-')
            .map((encodedWord, index): number => { // decode the base36 to wordIndex
                if (encodedWord === '') {
                    return prevWordIndexMap.get(index) ?? 0;
                }
                else {
                    const wordIndex = Number.parseInt(encodedWord, 36);
                    prevWordIndexMap.set(index, wordIndex);
                    
                    return wordIndex;
                } // if
            })
        ))
    );
})();



export const getKnownCssPropList = (): string[] => (
    indexedKnownCssProps
    .map((subWordIndices): string => ( // decode subWordIndices to word
        subWordIndices
        .map((wordIndex): string => ( // decode wordIndex to subWord
            indexedWordList[wordIndex]
        ))
        .join('')
    ))
);



// utilities:
const isUppercase  = (test: string) => (test >= 'A') && (test <= 'Z');



const indexedKnownCssPropsMaxIndex = indexedKnownCssProps.length - 1;
const resolveWord = (wordIndex: number): string => indexedWordList[wordIndex];
export const isKnownCssProp = (propName: string): propName is CssKnownName => {
         if (propName.startsWith('Moz')    && isUppercase(propName[3])) return true; // Moz[A-Z]    => always considered valid
    else if (propName.startsWith('ms')     && isUppercase(propName[2])) return true; // ms[A-Z]     => always considered valid
    else if (propName.startsWith('Webkit') && isUppercase(propName[6])) return true; // Webkit[A-Z] => always considered valid
    
    
    
    let min = 0, max = indexedKnownCssPropsMaxIndex, middle : number;
    let middleWordIndices: number[];
    let middlePropName: string;
    
    while (min <= max) {
        middle = ((min + max) / 2)|0;
        
        middleWordIndices = indexedKnownCssProps[middle];
        middlePropName    = middleWordIndices.map(resolveWord).join('');
        if (propName < middlePropName) {
            max = (middle - 1); // search in smaller range, excluding the middle
        }
        else if (propName > middlePropName) {
            min = (middle + 1); // search in bigger range, excluding the middle
        }
        else {
            return true; // found
        } // if
    } // while
    
    return false; // not found
};
