// cssfn:
import type {
    // types:
    CssKnownName,
}                           from '@cssfn/css-types'



const indexedWordList: string[] = (
    'border,scroll,Block,Inline,End,Start,text,Color,font,Style,Width,Margin,mask,Size,grid,background,margin,animation,Position,Bottom,Left,Right,Top,padding,Padding,Image,Radius,column,overflow,Decoration,Variant,Snap,stroke,flex,inset,Border,offset,Mode,Break,Rule,contain,Behavior,Clip,color,Adjust,Intrinsic,Height,gap,max,outline,overscroll,Align,transition,align,Name,Timeline,Origin,X,Y,Repeat,Rendering,Type,Opacity,Template,justify,line,list,marker,min,motion,page,shape,Emphasis,transform,Content,Items,Self,Spacing,box,break,clip,Path,container,counter,fill,Wrap,Orientation,Auto,Column,Row,image,math,Anchor,place,ruby,scrollbar,word,Tracks,Baseline,Delay,Direction,Duration,Fill,Count,Timing,Function,Visibility,backg,Blend,Shift,block,Overflow,Outset,Slice,Source,Shadow,Sizing,After,Before,Inside,caret,Gap,content,Flow,flood,Settings,Columns,Rows,hyphenate,Distance,Rotation,object,Offset,Box,perspective,stop,Skip,Underline,accent,alignment,all,anim,Composition,Iteration,Play,State,appearance,aspect,Ratio,backdrop,Filter,backface,Attachment,baseline,Collapse,bottom,caption,Side,Shape,clear,Interpolation,Scheme,Span,columns,Increment,Reset,Set,cursor,direction,display,dominant,empty,Cells,filter,Basis,Grow,Shrink,float,Family,Feature,Kerning,Language,Override,Optical,Palette,Smooth,Stretch,Synthesis,Alternates,Caps,East,Asian,Emoji,Ligatures,Numeric,Variation,Weight,forced,foreg,foreground,glyph,Vertical,Area,Areas,hanging,Punctuation,height,Character,Limit,Chars,hyphens,Resolution,initial,Letter,inline,input,Security,isolation,left,letter,lighting,Clamp,Step,Trim,Mid,Composite,Depth,Lines,mix,Fit,Rotate,opacity,order,orphans,paint,Order,pointer,Events,position,print,quotes,resize,right,rotate,row,Merge,scale,Stop,Axis,Gutter,Threshold,Outside,Dasharray,Dashoffset,Linecap,Linejoin,Miterlimit,tab,table,Layout,Last,Combine,Upright,Line,Ink,Thickness,Indent,Justify,Transform,top,touch,Action,transf,Property,translate,unicode,Bidi,user,Select,vector,Effect,vertical,view,Transition,visibility,white,Space,widows,width,will,Change,writing,z,Index,zoom'
    .split(',')
);

const indexedKnownCssProps : number[][] = (() : number[][] => {
    const prevWordIndexMap = new Map<number, number>();
    
    return (
        '3u-7,1h-22,-23,-24,-2p,3v-2q,3w,3x,h,-3y,-2r,-2s,-2t,-2u-11,-3z-2v,-1i,-40-41,-1j,-2w-2x,42,43-44,45-46,47-2y,2z,-16,f,-48,-30-11,-16,-7,-p,-1k,-i,--1l,--1m,-1n,-d,49-31,32-33,-d,0,-2,--7,--4,---7,---9,---a,--5,---7,---9,---a,--9,--a,-j,--7,--k-q,--l-,--9,--a,-4a,-7,-4-4-,--5-,-p,--34,--1n,--35,--36,--a,-3,--7,--4,---7,---9,---a,--5,---7,---9,---a,--9,--a,-k,--7,--9,--a,-q,-l,--7,--9,--a,-25,-5-4-q,--5-,-9,-m,--7,--k-,--l-,--9,--a,-a,4b,26-t-12,-37,-38,27-39,-3a,-3b,4c-4d,3c-7,-4e,4f,28,-29,-13,17,-18,-4g,-1o,-4h,r-2v,-2u,-3d,-13,--7,--9,--a,-4i,-a,4j,14,-19-2-d,--1a,--3-,--d,--a,2a,-1i,-1p,3e,-2y,2b-4k,-4l,-4m,4n,4o,4p,4q-2q,4r-4s,2c,-1q,-13,4t,x,-4u,-2s,-3f,-4v,-4w,-2d,4x,3g-7,-1q,8,-4y,-4z-3h,-50,-51-52,-53-38,-54,-d,--18,-55,-56,-9,-57,-u,--58,--59,--5a-5b,--5c,--5d,--5e,--i,-5f-3h,-5g,5h-7-18,5i,5j,1b,-2,-3,-1l,-1m,5k-2e-5l,e,-5m,-2f-3i,--3f,--3j,-2g,--4,--5,-2h,--4,--5,-1r,--5n,--3i,--3j,5o-5p,5q,3k-5r,-5s-5t,5u,2i-2e,-1o,-5v,5w-5x,5y-d,5z-60,y,-2,--4,--5,-3,--4,--5,61,1s-22,-23,-24,-2p,62,63-25,64-7,1t-12,-65,-1a,--66,1u-9,--p,--i,--1p,g,-2,--4,--5,-j,-3,--4,--5,-k,-l,-m,-67,1v,-4,-68,-5,c,-z,--11,--34,--1n,--35,--36,--a,-16,-69,-p,-11,-1k,-i,-1n,-d,-1p,2j-6a,-31,-9,1c-2-d,-1a,-3-,-6b,-a,1w-2-,-1a,-3-,-a,6c-30-11,1x,-3l,-29,-3m,3n-6d,-i,10,-2k,-3l,-29,-i,-6e,-3m,6f,6g,6h,1d,-7,-3o,-9,-a,s,-2k,-2,-16-3p,--b,-3,-2d,-1l,-1m,1e-15,--2,--3,--1l,--1m,n,-2,--4,--5,-j,-3,--4,--5,-k,-l,-m,1y,-12-39,--3a,--3b,6i-6j,3q,-1k,2l-22,-23,-24,6k-6l,6m,6n-7-18,6o,6p,6q,6r,6s-3d,2m-1f,-6t,-i,6u,1-15,-b,--2,---4,---5,--j,--3,---4,---5,--k,--l,--m,-o,--2,---4,---5,--j,--3,---4,---5,--k,--l,--m,-v-1f,--b,---j,---k,---l,---m,--6v,--1p,-1j,--6w,--1i,2n-7,-6x,-a,1z-p-6y,-b,-6z,-1o,3r-7,-1q,w,-70,-71,-72,-73,-74,-1q,-a,75-d,76-77,6-1f,--78,-2k,-79-7a,-t,--7,--7b,--3s,---7c,--9,--7d,-20,--7,--i,--9,-7e,-7f,-2e,-33,-1o,-37,-d-18,-7g,-3t-3o,--i,7h,7i-7j,7k,21,-3p,-1k,-9,1g,-2r,-2t,-7l,-2w-2x,7m,7n-7o,7p-7q,7r-7s,7t-1f,7u-7v-1i,7w,7x-7y,7z,80,81-82,2o-12,-25,-2d,83-11,84-85,86'
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



// utilities:
const isUppercase = (test: string) => (test >= 'A') && (test <= 'Z');
const resolveWord = (wordIndex: number): string => indexedWordList[wordIndex];



export const getKnownCssPropList = (): string[] => (
    indexedKnownCssProps
    .map((subWordData, index, array): string => ( // decode subWordIndices to word
        subWordData.map(resolveWord).join('')
    ))
);



const cache = new Map<string, boolean>();
export const isKnownCssProp = (propName: string): propName is CssKnownName => {
    const cached = cache.get(propName);
    if (cached !== undefined) return cached;
    
    
    
    const result = isKnownCssPropInternal(propName);
    cache.set(propName, result);
    return result;
}

const indexedKnownCssPropsMaxIndex = indexedKnownCssProps.length - 1;
export const isKnownCssPropInternal = (propName: string): propName is CssKnownName => {
         if (propName.startsWith('Moz')    && isUppercase(propName[3])) return true; // Moz[A-Z]    => always considered valid
    else if (propName.startsWith('ms')     && isUppercase(propName[2])) return true; // ms[A-Z]     => always considered valid
    else if (propName.startsWith('Webkit') && isUppercase(propName[6])) return true; // Webkit[A-Z] => always considered valid
    
    
    
    let min = 0, max = indexedKnownCssPropsMaxIndex, middle : number;
    let middleWordData: (number[]|string);
    let middlePropName: string;
    
    while (min <= max) {
        // get the middle index:
        middle = ((min + max) / 2)|0;
        
        
        
        // get the middle word:
        middleWordData = indexedKnownCssProps[middle];
        middlePropName = middleWordData.map(resolveWord).join('');
        
        
        
        // compare the middle word:
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
