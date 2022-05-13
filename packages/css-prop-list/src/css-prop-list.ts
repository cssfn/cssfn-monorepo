// cssfn:
import type {
    // types:
    CssKnownName,
}                           from '@cssfn/css-types'



const indexedWordList: string[] = (
    'border,Block,Inline,scroll,text,End,Start,Color,Style,Width,font,Margin,mask,grid,background,Size,Bottom,Left,Right,Top,margin,padding,Padding,animation,Image,Position,Radius,Decoration,column,overflow,Snap,stroke,flex,Variant,inset,Border,Mode,Break,Rule,offset,Behavior,Clip,color,Adjust,gap,max,outline,overscroll,Align,transition,align,Origin,X,Y,Repeat,Rendering,Opacity,Template,justify,line,Height,list,marker,min,motion,shape,Emphasis,transform,Content,Items,Self,Spacing,box,break,clip,Path,counter,fill,Wrap,Orientation,Auto,Column,Row,image,Type,Anchor,page,place,ruby,scrollbar,word,Tracks,Baseline,Delay,Direction,Duration,Fill,Count,Timing,Function,Visibility,backg,Blend,block,Overflow,Outset,Slice,Source,Shadow,Sizing,After,Before,Inside,Gap,content,Flow,flood,Settings,Columns,Rows,Distance,Rotation,object,Offset,Box,perspective,stop,Skip,Underline,accent,alignment,all,anim,Iteration,Name,Play,State,Timeline,appearance,aspect,Ratio,backdrop,Filter,backface,Attachment,baseline,Shift,Collapse,bottom,caption,Side,caret,clear,Interpolation,Scheme,Span,columns,contain,Increment,Reset,Set,cursor,direction,display,dominant,empty,Cells,filter,Basis,Grow,Shrink,float,Family,Feature,Kerning,Language,Override,Optical,Smooth,Stretch,Synthesis,Alternates,Caps,East,Asian,Ligatures,Numeric,Variation,Weight,forced,foreg,glyph,Vertical,Area,Areas,hanging,Punctuation,height,hyphenate,Character,hyphens,Resolution,initial,Letter,inline,input,Security,isolation,left,letter,lighting,Clamp,Step,Mid,Composite,math,Lines,mix,Fit,Rotate,opacity,order,orphans,paint,Order,pointer,Events,position,print,quotes,resize,right,rotate,row,Merge,scale,Stop,Gutter,Threshold,Outside,Dasharray,Dashoffset,Linecap,Linejoin,Miterlimit,tab,table,Layout,Last,Combine,Upright,Line,Ink,Thickness,Indent,Justify,Transform,top,touch,Action,transf,Property,translate,unicode,Bidi,user,Select,vector,Effect,vertical,visibility,white,Space,widows,width,will,Change,writing,z,Index,zoom'
    .split(',')
);

const indexedKnownCssProps : number[][] = (() : number[][] => {
    const prevWordIndexMap = new Map<number, number>();
    
    return (
        '3l-7,1e-1w,-1x,-1y,-2j,3m-2k,3n,3o,n,-2l,-2m,-2n,-2o-10,-3p-2p,-3q,-3r-3s,-3t,-2q-2r,3u,3v-3w,3x-3y,3z-2s,2t,-15,e,-40,-2u-10,-15,-7,-o,-1f,-p,--1g,--1h,-1i,-f,41-42,2v-2w,-f,0,-1,--7,--5,---7,---8,---9,--6,---7,---8,---9,--8,--9,-g,--7,--h-q,--i-,--8,--9,-43,-7,-5-5-,--6-,-o,--2x,--1i,--2y,--2z,--9,-2,--7,--5,---7,---8,---9,--6,---7,---8,---9,--8,--9,-h,--7,--8,--9,-q,-i,--7,--8,--9,-1z,-6-5-q,--6-,-8,-j,--7,--h-,--i-,--8,--9,-9,44,20-r-11,-30,-31,21-32,-33,-34,45-46,47-7,48,22,-23,-12,16,-17,-49,-1j,-4a,s-2p,-2o,-35,-12,--7,--8,--9,-4b,-9,4c,4d,36,-2s,24-4e,-4f,-4g,4h,4i,4j,4k-2k,4l-4m,25,-1k,-12,4n,w,-4o,-2m,-37,-4p,-4q,-26,4r,38-7,-1k,a,-4s,-4t-39,-4u,-4v-4w,-4x-31,-f,--17,-4y,-4z,-8,-50,-x,--51,--52,--53-54,--55,--56,--p,-57-39,-58,59-7-17,5a,18,-1,-2,-1g,-1h,5b-27-5c,d,-5d,-28-3a,--37,--3b,-29,--5,--6,-2a,--5,--6,-1l,--5e,--3a,--3b,5f-5g,5h,5i-5j,5k,2b-27,-1j,-5l,5m-5n,5o-f,5p-5q,y,-1,--5,--6,-2,--5,--6,5r,1m-1w,-1x,-1y,-2j,5s,5t-1z,5u-7,1n-11,-5v,-1o,--5w,1p-8,--o,--p,--2c,k,-1,--5,--6,-g,-2,--5,--6,-h,-i,-j,1q,-5,-5x,-6,c,-z,--10,--2x,--1i,--2y,--2z,--9,-15,-5y,-o,-10,-1f,-p,-1i,-f,-2c,5z-8,19-1-f,-1o,-2-,-60,-9,1r-1-,-1o,-2-,-9,61-2u-10,1s,-3c,-23,-3d,3e-62,-p,13,-2d,-3c,-23,-63,-3d,64,65,66,1a,-7,-3f,-8,-9,t,-2d,-1,-15-3g,--b,-2,-26,-1g,-1h,1b-14,--1,--2,--1g,--1h,l,-1,--5,--6,-g,-2,--5,--6,-h,-i,-j,2e-11-32,--33,--34,67-68,3h,-1f,2f-1w,-1x,-1y,69-6a,6b,6c-7-17,6d,6e,6f,6g,6h-35,2g-1c,-6i,-p,6j,3-14,-b,--1,---5,---6,--g,--2,---5,---6,--h,--i,--j,-m,--1,---5,---6,--g,--2,---5,---6,--h,--i,--j,-u-1c,--b,---g,---h,---i,---j,--6k,--2c,2h-7,-6l,-9,1t-o-6m,-b,-6n,-1j,3i-7,-1k,v,-6o,-6p,-6q,-6r,-6s,-1k,-9,6t-f,6u-6v,4-1c,--6w,-2d,-6x-6y,-r,--7,--6z,--3j,---70,--8,--71,--9,-1u,--7,--p,--8,-72,-73,-27,-2w,-1j,-30,-f-17,-74,-3k-3f,--p,75,76-77,78,1v,-3g,-1f,-8,1d,-2l,-2n,-79,-2q-2r,7a,7b-7c,7d-7e,7f-7g,7h-1c,7i,7j-7k,7l,7m,7n-7o,2i-11,-1z,-26,7p-10,7q-7r,7s'
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
