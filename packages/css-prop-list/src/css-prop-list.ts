const sortedWordList = (
    'Webkit,Moz,ms,border,Color,scroll,Box,Inline,Block,Border,End,Style,Start,Width,Animation,Text,text,Snap,Radius,Margin,Image,O,Size,Column,font,Transition,Mask,grid,Flex,Decoration,Position,mask,Scroll,Align,Padding,Bottom,Left,Right,Top,Rule,Mode,Origin,Content,X,Y,background,offset,Khtml,Direction,Break,box,margin,Limit,padding,Transform,animation,Delay,Duration,Timing,Function,Outline,Adjust,column,overflow,User,Fill,Background,Clip,Overflow,Variant,Repeat,Type,Emphasis,stroke,Group,Line,Count,Gap,Font,Wrap,Points,flex,inset,Zoom,Scrollbar,Opacity,Select,Shadow,Self,Before,Flow,Behavior,Lines,Orient,Sizing,Columns,Property,color,max,outline,overscroll,transition,Ordinal,Pack,Iteration,Name,Play,State,Visibility,Colors,Settings,Perspective,Items,Filter,Slice,Path,Hyphenate,Max,Orientation,align,Rendering,Row,Template,justify,line,Height,list,marker,min,motion,scrollbar,shape,transform,Feature,Hyphens,Justify,Outset,Source,Order,Combine,Skip,Stroke,Underline,Touch,Spacing,break,clip,counter,fill,Auto,Rows,image,Min,Anchor,page,place,ruby,word,Appearance,Backface,Bottomleft,Bottomright,Topleft,Topright,Language,Override,Smoothing,Tab,Last,Modify,Window,Object,Fit,Span,Basis,Grow,Shrink,Kerning,Ligatures,Character,Letter,Clamp,Attachment,Composite,Highlight,Writing,Tracks,Baseline,Blend,block,After,Inside,content,flood,Distance,Rotation,Chaining,Grid,Ime,Track,Action,object,Offset,perspective,stop,Policy,Binding,Context,Properties,Float,Edge,Force,Broken,Icon,Region,Osx,Stack,Blink,Focus,Input,Dragging,Backdrop,Reflect,Initial,Scrolling,Print,Ruby,Shape,Tap,Callout,accent,alignment,all,Timeline,appearance,aspect,Ratio,azimuth,backdrop,backface,baseline,Shift,Collapse,bottom,caption,Side,caret,clear,Interpolation,Scheme,columns,contain,Increment,Reset,Set,cursor,direction,display,dominant,empty,Cells,filter,float,Family,Optical,Smooth,Stretch,Synthesis,Alternates,Caps,East,Asian,Numeric,Variation,Weight,forced,gap,glyph,Vertical,Area,Areas,hanging,Punctuation,height,hyphenate,hyphens,Resolution,ime,initial,inline,input,Security,isolation,left,letter,lighting,Step,Mid,math,mix,Accelerator,Progression,Zooming,Positive,From,Into,High,Contrast,Chars,Zone,Rails,Translation,Scrollbar3dlight,Arrow,Base,Darkshadow,Face,Autospace,Horizontal,Word,Through,Rotate,opacity,order,orphans,paint,pointer,Events,position,print,quotes,resize,right,rotate,row,Merge,scale,Coordinate,Destination,Stop,Gutter,Threshold,Outside,Dasharray,Dashoffset,Linecap,Linejoin,Miterlimit,tab,table,Layout,Upright,Ink,Thickness,Indent,top,touch,translate,unicode,Bidi,user,vector,Effect,vertical,visibility,white,Space,widows,width,will,Change,writing,z,Index,zoom'
    .split(',')
);

const indexedKnownCssProps : number[][] = (() : number[][] => {
    const prevWordIndexMap = new Map<number, number>();
    
    return (
        '1b-6-x,--1c,--s,---22,--2k,--2u-,--2l,--2v,-23-1d,-2d,-1s-2e,1-e,--1k,--1c,--1l,--1t-14,--2w-24,--2x,--2y-2z,--1m-1n,-4e,-4f-30,-1u-1v,--7-5p,--15,--m,-5q,-9-z-31,--a-4,---b,---d,--k,--10-31,--i,---4g,---4h,---4i,---4j,--11-31,--c-4,---b,--12-31,-6-x,--1c,--s,--2u-22,--2l,--2v,--2f,--2m,-n-24,--1t,--25,--13,---4,---b,---d,--d,-2n,-5r-5s,-5t-5u,-26-3p-32,--4k-4l,-5v-5w-k-5x,-3q,-k-5y,-j-a,--c,-2d,-2l,-5z-26-4m,-1o,--4,--i,---4g,---4h,---4i,---4j,--b,--d,-y-a,--c,-33,--15,-60-2m,-4n-m,-f-x-4o,--61,--t-4,---23,---b,--m-1p,-1i-15,--b,-p,--1k,--1l,--2o,--1m-1n,-1s-62,--63,--4p,--2e,-4q-64,--2f,l-e,--1k,--1c,--1l,--1t-14,--2w-24,--2x,--2y-2z,--1m-1n,-1u-m,-9-k,-4r-4s,--u,-4n-m,-f-1w,-1i,--15,-p,--1k,--1l,--2o,--1m-,0-x-16,--34,--2g,-e,--1k,--1c,--1l,--1t-14,--2w-24,--2x,--2y-2z,--1m-1n,-4e,-65-35,-4f-30,-1u-1v,--15,--m,-9-2h,---4,---b,---d,--z-10-i,---11-,--k,---36,--i,--12-10-,---11-,-6-x,--t-1d,--1c,--s,---22,--2k,--2u-,--2l,--2v,--66,--2f,--2m,-1v-37,-n-24,--1t,--25,--13,---4,---b,---d,--4t,--d,-2n,-35,-s,--4u,--1c,--2i,--4v,--4w,--27,-26-3p-32,--4x,--4m,--1x-4y,-38-4z,-3q,-67-50,-3r-16,-23-1d,--51,-j-a,--c,-q,--52,--6-k,----3s,----1y,----36,----3t,----d,--1v,--53,--k,--15,--u,---17,---18,--1y,---17,---18,--m,-39-7-m,-3u,-1w-68,-y-a,--c,-33,--15,-69-4-1p,-6a-u,-w-h-28-17,----18,---1z,-6b-j,-6c-54-4,-f-3v,--t-,---23,---3w,---b,--20,---4,---u,---b,--1t-4,--3a,--m-1p,--3x,---4,---d,--3y-u,-3z-6d,-1i,--15,--b,-p,--1k,--1l,--2o,--1m-1n,-1s-4p,--2e,-55-14,6e-4,3b-16,-34,-2g,-56,6f-57,6g,1j,-1k,-1c,-1l,-1t-,-2w-24,-2x,-2y-2z,-6h,-1m-1n,6i,6j-6k,6l,6m-35,6n-30,19,-52,-58-14,-1v,-4,-k,-15,-u,--17,--18,-1y,-m,6o-6p,59-1w,-m,3,-8,--4,--a,---4,---b,---d,--c,---4,---b,---d,--b,--d,-z,--4,--10-i,--11-,--b,--d,-6q,-4,-a-a-,--c-,-k,--3s,--1y,--36,--3t,--d,-7,--4,--a,---4,---b,---d,--c,---4,---b,---d,--b,--d,-10,--4,--b,--d,-i,-11,--4,--b,--d,-40,-c-a-i,--c-,-b,-12,--4,--10-,--11-,--b,--d,-d,6r,1e-x,-t-1d,-1c,-s,--22,-2k,-2u-,-2l,-2v,-2f,-2m,41-5a,-2h,-5b,6s-6t,6u-4,6v,42,-37,-13,2p,-1p,-6w,-3c,-6x,1q-24,-1t,-25,-13,--4,--b,--d,-4t,-d,6y,6z,5c,-30,43-70,-71,-72,73,74,75,76-57,77-78,44,-2d,-13,79,29,-4u,-1c,-2i,-4v,-4w,-27,7a,5d-4,-2d,o,-7b,-3p-32,-4x,-4k-4l,-7c-2m,-m,--1p,-7d,-7e,-b,-7f,-1x,--7g,--7h,--7i-7j,--4y,--7k,--u,-7l-32,-7m,7n-4-1p,7o,7p-3a-7q,r,-7r,-45-2n,--2i,--46,-n,--a,--25,--c,-25,-3d,--a,--25,--c,-3e,--7s,--2n,--46,7t-7u,7v,7w-4z,7x,47-3a,-3c,-7y,7z-14,80-50,81-m,82-83,2a,-8,--a,--c,-7,--a,--c,84,3f-16,-34,-2g,-56,85,86-40,87-4,3g-1d,-51,-3h,--88,3i-b,--k,--u,--1z,1f,-8,--a,--c,-z,-7,--a,--c,-10,-11,-12,3j,-a,-89,-c,v,-9,--14,--3s,--1y,--36,--3t,--d,-1v,-53,-k,-14,-15,-u,-1y,-m,-1z,8a-b,2q-8-m,-3h,-7-,-2k,-d,3k-8-,-3h,-7-,-d,8b-58-14,3l,-5e,-37,-5f,2-8c,-x-2g,-8-8d,-16-2b-5g,---1g,----39,----48,---h,----28,----1z,--8e,-35,-s,--1c,--8f,-2i-8g,--8h,-5h-2n,--46,-8i-8j-1p,-38-1g-8k,---2k,---8l,-3q,-5i-x,--14,-3r-2g,-23-1d,-3u,-1w-b,--17,--18,-w-5g,--1g,---17-39,----48,---18-39,----48,--8m,--h-28-17,----18,---1z,---17,---18,--8n,-8o-4,-2c-8p-4,--8q-,--8r-,--8s-,--54-,--2f-,--5j-,-f-8t,--3v-8u,--1w,-3z-5k,--2e,-1i,--15,-p,--1k,--1l,--2o,--1m-1n,-1s-2e,-8v-1d,-27-2i,--j,--8w,-55-14,5l-4s,-u,1a,-49,-8,--a,--c,-5e,-7,--a,--c,-37,-8x,-5f,8y,8z,90,2r,-4,-5m,-b,-d,1r,-49,-8,-1v-6,--j,-7,-27,-17,-18,2s-2j,--8,--7,--17,--18,1h,-8,--a,--c,-z,-7,--a,--c,-10,-11,-12,4a-1d-5a,--2h,--5b,91-3u,5n,-15,4b-16,-34,-2g,92-93,94,95-4-1p,96,97,98,99,9a-25,4c-x,-9b,-u,9c,5-2j,-j,--8,---a,---c,--z,--7,---a,---c,--10,--11,--12,-y,--8,---a,---c,--z,--7,---a,---c,--10,--11,--12,-h-x,--9d,--9e,--j,---z,---10,---11,---12,--28-17,---18,--9f,--1z,---17,---18,3m-4,-9g,-5j-4,-d,3n-k-9h,-j,-9i,-3c,5o-4,-2d,21,-9j,-9k,-9l,-9m,-9n,-2d,-d,9o-m,9p-9q,g-x,--4o,-49,-3v-9r,-t,--4,--23,--3w,---9s,--b,--9t,--d,-20,--4,--u,--b,-9u,-3r,-3a,-1w,-3c,-2f,-m-1p,-1i,-3y-5m,--u,9v,9w-5k,3o,-6,-15,-b,2t,-1k,-1l,-2o,-1m-1n,9x,9y-9z,a0-2e,a1-a2,a3-x,a4,a5-a6,a7,a8,a9-aa,4d-1d,-40,-27,ab-14,ac-ad,ae'
        .split(',')
        .map((encodedItem): number[] => (
            encodedItem.split('-')
            .map((encodedWord, index): number => {
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



export const getKnownCssPropList = () => (
    indexedKnownCssProps
    .map((wordIndices) => (
        wordIndices
        .map((wordIndex) => sortedWordList[wordIndex])
        .join('')
    ))
);



const indexedKnownCssPropsMaxIndex = indexedKnownCssProps.length - 1;
const resolveIndexedWord = (wordIndex: number) => sortedWordList[wordIndex];
export const isKnownCssProp = (propName: string) => {
    let min = 0, max = indexedKnownCssPropsMaxIndex, middle : number;
    let find: number[];
    let findPropName: string;
    
    while (min <= max) {
        middle = ((min + max) / 2)|0;
        
        find = indexedKnownCssProps[middle];
        findPropName = find.map(resolveIndexedWord).join();
        if (propName < findPropName) {
            max = (middle - 1); // search in smaller range, excluding the middle
        }
        else if (propName > findPropName) {
            min = (middle + 1); // search in bigger range, excluding the middle
        }
        else {
            return true; // found
        } // if
    } // while
    
    return false; // not found
};
