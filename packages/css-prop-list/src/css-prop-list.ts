const indexedWordList: string[] = (
    'border,Block,Inline,scroll,text,End,Start,Color,Style,Width,font,Margin,mask,grid,background,Size,Bottom,Left,Right,Top,margin,padding,Padding,animation,Image,Position,Radius,Decoration,column,overflow,Snap,stroke,flex,Variant,inset,Border,Mode,Break,Rule,offset,Behavior,color,Adjust,max,outline,overscroll,Align,transition,align,Clip,Origin,Repeat,Rendering,Opacity,Template,justify,line,Height,list,marker,min,motion,shape,Emphasis,transform,Content,Items,Self,X,Y,Spacing,box,break,clip,Path,counter,fill,Wrap,Orientation,Auto,Column,Row,image,Type,Anchor,page,place,ruby,scrollbar,word,Tracks,Baseline,Delay,Direction,Duration,Fill,Count,Timing,Function,Visibility,Blend,block,Overflow,Outset,Slice,Source,Shadow,Sizing,After,Before,Inside,Gap,content,Flow,flood,Settings,Columns,Rows,Distance,Rotation,object,Offset,Box,perspective,stop,Skip,Underline,accent,alignment,all,Iteration,Name,Play,State,Timeline,appearance,aspect,Ratio,backdrop,Filter,backface,Attachment,baseline,Shift,Collapse,bottom,caption,Side,caret,clear,Interpolation,Scheme,Span,columns,contain,Increment,Reset,Set,cursor,direction,display,dominant,empty,Cells,filter,Basis,Grow,Shrink,float,Family,Feature,Kerning,Language,Override,Optical,Smooth,Stretch,Synthesis,Alternates,Caps,East,Asian,Ligatures,Numeric,Variation,Weight,forced,gap,glyph,Vertical,Area,Areas,hanging,Punctuation,height,hyphenate,Character,hyphens,Resolution,initial,Letter,inline,input,Security,isolation,left,letter,lighting,Clamp,Step,Mid,Composite,math,Lines,mix,Fit,Rotate,opacity,order,orphans,paint,Order,pointer,Events,position,print,quotes,resize,right,rotate,row,Merge,scale,Stop,Gutter,Threshold,Outside,Dasharray,Dashoffset,Linecap,Linejoin,Miterlimit,tab,table,Layout,Last,Combine,Upright,Line,Ink,Thickness,Indent,Justify,Transform,top,touch,Action,Property,translate,unicode,Bidi,user,Select,vector,Effect,vertical,visibility,white,Space,widows,width,will,Change,writing,z,Index,zoom'
    .split(',')
);

const indexedKnownCssProps : number[][] = (() : number[][] => {
    const prevWordIndexMap = new Map<number, number>();
    
    return (
        '3j-7,1c-1t,-1u,-1v,-2i,3k-2j,3l,n,-2k,-2l,-2m,-2n-10,-3m-2o,-3n,-3o-3p,-3q,-2p-2q,3r,3s-3t,3u-3v,3w-2r,e,-3x,-2s-10,-1d,-7,-o,-1e,-p,--1w,--1x,-1f,-f,3y-3z,2t-2u,-f,0,-1,--7,--5,---7,---8,---9,--6,---7,---8,---9,--8,--9,-g,--7,--h-q,--i-,--8,--9,-40,-7,-5-5-,--6-,-o,--2v,--1f,--2w,--2x,--9,-2,--7,--5,---7,---8,---9,--6,---7,---8,---9,--8,--9,-h,--7,--8,--9,-q,-i,--7,--8,--9,-1y,-6-5-q,--6-,-8,-j,--7,--h-,--i-,--8,--9,-9,41,1z-r-11,-2y,-2z,20-30,-31,-32,42-43,44-7,45,21,-22,-12,15,-16,-46,-1g,-47,s-2o,-2n,-33,-12,--7,--8,--9,-48,-9,49,4a,34,-2r,23-4b,-4c,-4d,4e,4f,4g,4h-2j,4i-4j,24,-1h,-12,4k,w,-4l,-2l,-35,-4m,-4n,-25,4o,36-7,-1h,a,-4p,-4q-37,-4r,-4s-4t,-4u-2z,-f,--16,-4v,-4w,-8,-4x,-x,--4y,--4z,--50-51,--52,--53,--p,-54-37,-55,56-7-16,57,58-26-59,d,-5a,-27-38,--35,--39,-28,--5,--6,-29,--5,--6,-1i,--5b,--38,--39,5c-5d,5e,5f-5g,5h,2a-26,-1g,-5i,5j-5k,5l-f,5m-5n,y,-1,--5,--6,-2,--5,--6,5o,1j-1t,-1u,-1v,-2i,5p,5q-1y,5r-7,1k-11,-5s,-1l,--5t,1m-8,--o,--p,--2b,k,-1,--5,--6,-g,-2,--5,--6,-h,-i,-j,1n,-5,-5u,-6,c,-z,--10,--2v,--1f,--2w,--2x,--9,-1d,-5v,-o,-10,-1e,-p,-1f,-f,-2b,5w-8,17-1-f,-1l,-2-,-5x,-9,1o-1-,-1l,-2-,-9,5y-2s-10,1p,-3a,-22,-3b,3c-5z,-p,13,-2c,-3a,-22,-60,-3b,61,62,63,18,-7,-3d,-8,-9,t,-2c,-1,-1d-3e,--b,-2,-25,-1w,-1x,19-14,--1,--2,--1w,--1x,l,-1,--5,--6,-g,-2,--5,--6,-h,-i,-j,2d-11-30,--31,--32,64-65,3f,-1e,2e-1t,-1u,-1v,66-67,68,69-7-16,6a,6b,6c,6d,6e-33,2f-1a,-6f,-p,6g,3-14,-b,--1,---5,---6,--g,--2,---5,---6,--h,--i,--j,-m,--1,---5,---6,--g,--2,---5,---6,--h,--i,--j,-u-1a,--b,---g,---h,---i,---j,--6h,--2b,2g-7,-6i,-9,1q-o-6j,-b,-6k,-1g,3g-7,-1h,v,-6l,-6m,-6n,-6o,-6p,-1h,-9,6q-f,6r-6s,4-1a,--6t,-2c,-6u-6v,-r,--7,--6w,--3h,---6x,--8,--6y,--9,-1r,--7,--p,--8,-6z,-70,-26,-2u,-1g,-2y,-f-16,-71,-3i-3d,--p,72,73-74,1s,-3e,-1e,-8,1b,-2k,-2m,-75,-2p-2q,76,77-78,79-7a,7b-7c,7d-1a,7e,7f-7g,7h,7i,7j-7k,2h-11,-1y,-25,7l-10,7m-7n,7o'
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



const indexedKnownCssPropsMaxIndex = indexedKnownCssProps.length - 1;
const resolveWord = (wordIndex: number): string => indexedWordList[wordIndex];
export const isKnownCssProp = (propName: string): boolean => {
    let min = 0, max = indexedKnownCssPropsMaxIndex, middle : number;
    let middleWordIndices: number[];
    let middlePropName: string;
    
    while (min <= max) {
        middle = ((min + max) / 2)|0;
        
        middleWordIndices = indexedKnownCssProps[middle];
        middlePropName    = middleWordIndices.map(resolveWord).join();
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
