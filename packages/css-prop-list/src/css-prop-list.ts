const sortedWordList = (
    'Webkit,Moz,ms,border,Color,scroll,Box,Inline,Block,Border,End,Style,Start,Width,Animation,Text,text,Snap,Radius,Margin,Image,O,Size,Column,font,Transition,Mask,grid,Flex,Decoration,Position,mask,Scroll,Align,Padding,Bottom,Left,Right,Top,Rule,Mode,Origin,Content,X,Y,background,offset,Khtml,Direction,Break,box,margin,Limit,padding,Transform,animation,Delay,Duration,Timing,Function,Outline,Adjust,column,overflow,User,Fill,Background,Clip,Overflow,Variant,Repeat,Type,Emphasis,stroke,Group,Line,Count,Gap,Font,Wrap,Points,flex,inset,Zoom,Scrollbar,Opacity,Select,Shadow,Self,Before,Flow,Behavior,Lines,Orient,Sizing,Columns,Property,color,max,outline,overscroll,transition,Ordinal,Pack,Iteration,Name,Play,State,Visibility,Colors,Settings,Perspective,Items,Filter,Slice,Path,Hyphenate,Max,Orientation,align,Rendering,Row,Template,justify,line,Height,list,marker,min,motion,scrollbar,shape,transform,Feature,Hyphens,Justify,Outset,Source,Order,Combine,Skip,Stroke,Underline,Touch,Spacing,break,clip,counter,fill,Auto,Rows,image,Min,Anchor,page,place,ruby,word,Appearance,Backface,Bottomleft,Bottomright,Topleft,Topright,Language,Override,Smoothing,Tab,Last,Modify,Window,Object,Fit,Span,Basis,Grow,Shrink,Kerning,Ligatures,Character,Letter,Clamp,Attachment,Composite,Highlight,Writing,Tracks,Baseline,Blend,block,After,Inside,content,flood,Distance,Rotation,Chaining,Grid,Ime,Track,Action,object,Offset,perspective,stop,Policy,Binding,Context,Properties,Float,Edge,Force,Broken,Icon,Region,Osx,Stack,Blink,Focus,Input,Dragging,Backdrop,Reflect,Initial,Scrolling,Print,Ruby,Shape,Tap,Callout,accent,alignment,all,Timeline,appearance,aspect,Ratio,azimuth,backdrop,backface,baseline,Shift,Collapse,bottom,caption,Side,caret,clear,Interpolation,Scheme,columns,contain,Increment,Reset,Set,cursor,direction,display,dominant,empty,Cells,filter,float,Family,Optical,Smooth,Stretch,Synthesis,Alternates,Caps,East,Asian,Numeric,Variation,Weight,forced,gap,glyph,Vertical,Area,Areas,hanging,Punctuation,height,hyphenate,hyphens,Resolution,ime,initial,inline,input,Security,isolation,left,letter,lighting,Step,Mid,math,mix,Accelerator,Progression,Zooming,Positive,From,Into,High,Contrast,Chars,Zone,Rails,Translation,Scrollbar3dlight,Arrow,Base,Darkshadow,Face,Autospace,Horizontal,Word,Through,Rotate,opacity,order,orphans,paint,pointer,Events,position,print,quotes,resize,right,rotate,row,Merge,scale,Coordinate,Destination,Stop,Gutter,Threshold,Outside,Dasharray,Dashoffset,Linecap,Linejoin,Miterlimit,tab,table,Layout,Upright,Ink,Thickness,Indent,top,touch,translate,unicode,Bidi,user,vector,Effect,vertical,visibility,white,Space,widows,width,will,Change,writing,z,Index,zoom'
    .split(',')
);

const indexedKnownCssProps = [
    [47, 6, 33],
    [47, 6, 48],
    [47, 6, 28],
    [47, 6, 28, 74],
    [47, 6, 92],
    [47, 6, 102, 74],
    [47, 6, 93],
    [47, 6, 103],
    [47, 75, 49],
    [47, 85],
    [47, 64, 86],
    [1, 14],
    [1, 14, 56],
    [1, 14, 48],
    [1, 14, 57],
    [1, 14, 65, 40],
    [1, 14, 104, 76],
    [1, 14, 105],
    [1, 14, 106, 107],
    [1, 14, 58, 59],
    [1, 158],
    [1, 159, 108],
    [1, 66, 67],
    [1, 66, 7, 205],
    [1, 66, 41],
    [1, 66, 22],
    [1, 206],
    [1, 9, 35, 109],
    [1, 9, 10, 4],
    [1, 9, 10, 11],
    [1, 9, 10, 13],
    [1, 9, 20],
    [1, 9, 36, 109],
    [1, 9, 18],
    [1, 9, 18, 160],
    [1, 9, 18, 161],
    [1, 9, 18, 162],
    [1, 9, 18, 163],
    [1, 9, 37, 109],
    [1, 9, 12, 4],
    [1, 9, 12, 11],
    [1, 9, 38, 109],
    [1, 6, 33],
    [1, 6, 48],
    [1, 6, 28],
    [1, 6, 102, 74],
    [1, 6, 93],
    [1, 6, 103],
    [1, 6, 87],
    [1, 6, 94],
    [1, 23, 76],
    [1, 23, 65],
    [1, 23, 77],
    [1, 23, 39],
    [1, 23, 39, 4],
    [1, 23, 39, 11],
    [1, 23, 39, 13],
    [1, 23, 13],
    [1, 95],
    [1, 207, 208],
    [1, 209, 210],
    [1, 78, 133, 110],
    [1, 78, 164, 165],
    [1, 211, 212, 20, 213],
    [1, 134],
    [1, 20, 214],
    [1, 19, 10],
    [1, 19, 12],
    [1, 85],
    [1, 93],
    [1, 215, 78, 166],
    [1, 60],
    [1, 60, 4],
    [1, 60, 18],
    [1, 60, 18, 160],
    [1, 60, 18, 161],
    [1, 60, 18, 162],
    [1, 60, 18, 163],
    [1, 60, 11],
    [1, 60, 13],
    [1, 34, 10],
    [1, 34, 12],
    [1, 111],
    [1, 111, 41],
    [1, 216, 94],
    [1, 167, 22],
    [1, 15, 33, 168],
    [1, 15, 217],
    [1, 15, 29, 4],
    [1, 15, 29, 75],
    [1, 15, 29, 11],
    [1, 15, 22, 61],
    [1, 54, 41],
    [1, 54, 11],
    [1, 25],
    [1, 25, 56],
    [1, 25, 57],
    [1, 25, 96],
    [1, 25, 58, 59],
    [1, 64, 218],
    [1, 64, 219],
    [1, 64, 169],
    [1, 64, 86],
    [1, 170, 220],
    [1, 170, 87],
    [21, 14],
    [21, 14, 56],
    [21, 14, 48],
    [21, 14, 57],
    [21, 14, 65, 40],
    [21, 14, 104, 76],
    [21, 14, 105],
    [21, 14, 106, 107],
    [21, 14, 58, 59],
    [21, 66, 22],
    [21, 9, 20],
    [21, 171, 172],
    [21, 171, 30],
    [21, 167, 22],
    [21, 15, 68],
    [21, 54],
    [21, 54, 41],
    [21, 25],
    [21, 25, 56],
    [21, 25, 57],
    [21, 25, 96],
    [21, 25, 58, 59],
    [0, 33, 42],
    [0, 33, 112],
    [0, 33, 88],
    [0, 14],
    [0, 14, 56],
    [0, 14, 48],
    [0, 14, 57],
    [0, 14, 65, 40],
    [0, 14, 104, 76],
    [0, 14, 105],
    [0, 14, 106, 107],
    [0, 14, 58, 59],
    [0, 158],
    [0, 221, 113],
    [0, 159, 108],
    [0, 66, 67],
    [0, 66, 41],
    [0, 66, 22],
    [0, 9, 89],
    [0, 9, 89, 4],
    [0, 9, 89, 11],
    [0, 9, 89, 13],
    [0, 9, 35, 36, 18],
    [0, 9, 35, 37, 18],
    [0, 9, 20],
    [0, 9, 20, 114],
    [0, 9, 18],
    [0, 9, 38, 36, 18],
    [0, 9, 38, 37, 18],
    [0, 6, 33],
    [0, 6, 29, 49],
    [0, 6, 48],
    [0, 6, 28],
    [0, 6, 28, 74],
    [0, 6, 92],
    [0, 6, 102, 74],
    [0, 6, 93],
    [0, 6, 103],
    [0, 6, 222],
    [0, 6, 87],
    [0, 6, 94],
    [0, 67, 115],
    [0, 23, 76],
    [0, 23, 65],
    [0, 23, 77],
    [0, 23, 39],
    [0, 23, 39, 4],
    [0, 23, 39, 11],
    [0, 23, 39, 13],
    [0, 23, 173],
    [0, 23, 13],
    [0, 95],
    [0, 113],
    [0, 28],
    [0, 28, 174],
    [0, 28, 48],
    [0, 28, 90],
    [0, 28, 175],
    [0, 28, 176],
    [0, 28, 79],
    [0, 78, 133, 110],
    [0, 78, 177],
    [0, 78, 166],
    [0, 78, 69, 178],
    [0, 116, 179],
    [0, 134],
    [0, 223, 180],
    [0, 135, 42],
    [0, 75, 49],
    [0, 75, 181],
    [0, 19, 10],
    [0, 19, 12],
    [0, 26],
    [0, 26, 182],
    [0, 26, 6, 20],
    [0, 26, 6, 20, 136],
    [0, 26, 6, 20, 70],
    [0, 26, 6, 20, 114],
    [0, 26, 6, 20, 137],
    [0, 26, 6, 20, 13],
    [0, 26, 67],
    [0, 26, 183],
    [0, 26, 20],
    [0, 26, 41],
    [0, 26, 30],
    [0, 26, 30, 43],
    [0, 26, 30, 44],
    [0, 26, 70],
    [0, 26, 70, 43],
    [0, 26, 70, 44],
    [0, 26, 22],
    [0, 117, 7, 22],
    [0, 138],
    [0, 68, 224],
    [0, 34, 10],
    [0, 34, 12],
    [0, 111],
    [0, 111, 41],
    [0, 225, 4, 61],
    [0, 226, 30],
    [0, 32, 17, 80, 43],
    [0, 32, 17, 80, 44],
    [0, 32, 17, 71],
    [0, 227, 19],
    [0, 228, 184, 4],
    [0, 15, 139],
    [0, 15, 29, 4],
    [0, 15, 29, 75],
    [0, 15, 29, 140],
    [0, 15, 29, 11],
    [0, 15, 72],
    [0, 15, 72, 4],
    [0, 15, 72, 30],
    [0, 15, 72, 11],
    [0, 15, 65, 4],
    [0, 15, 118],
    [0, 15, 22, 61],
    [0, 15, 141],
    [0, 15, 141, 4],
    [0, 15, 141, 13],
    [0, 15, 142, 30],
    [0, 143, 229],
    [0, 54],
    [0, 54, 41],
    [0, 54, 11],
    [0, 25],
    [0, 25, 56],
    [0, 25, 57],
    [0, 25, 96],
    [0, 25, 58, 59],
    [0, 64, 169],
    [0, 64, 86],
    [0, 185, 40],
    [230, 4],
    [119, 42],
    [119, 112],
    [119, 88],
    [119, 186],
    [231, 187],
    [232],
    [55],
    [55, 56],
    [55, 48],
    [55, 57],
    [55, 65, 40],
    [55, 104, 76],
    [55, 105],
    [55, 106, 107],
    [55, 233],
    [55, 58, 59],
    [234],
    [235, 236],
    [237],
    [238, 113],
    [239, 108],
    [45],
    [45, 182],
    [45, 188, 40],
    [45, 67],
    [45, 4],
    [45, 20],
    [45, 41],
    [45, 30],
    [45, 30, 43],
    [45, 30, 44],
    [45, 70],
    [45, 22],
    [240, 241],
    [189, 68],
    [189, 22],
    [3],
    [3, 8],
    [3, 8, 4],
    [3, 8, 10],
    [3, 8, 10, 4],
    [3, 8, 10, 11],
    [3, 8, 10, 13],
    [3, 8, 12],
    [3, 8, 12, 4],
    [3, 8, 12, 11],
    [3, 8, 12, 13],
    [3, 8, 11],
    [3, 8, 13],
    [3, 35],
    [3, 35, 4],
    [3, 35, 36, 18],
    [3, 35, 37, 18],
    [3, 35, 11],
    [3, 35, 13],
    [3, 242],
    [3, 4],
    [3, 10, 10, 18],
    [3, 10, 12, 18],
    [3, 20],
    [3, 20, 136],
    [3, 20, 70],
    [3, 20, 114],
    [3, 20, 137],
    [3, 20, 13],
    [3, 7],
    [3, 7, 4],
    [3, 7, 10],
    [3, 7, 10, 4],
    [3, 7, 10, 11],
    [3, 7, 10, 13],
    [3, 7, 12],
    [3, 7, 12, 4],
    [3, 7, 12, 11],
    [3, 7, 12, 13],
    [3, 7, 11],
    [3, 7, 13],
    [3, 36],
    [3, 36, 4],
    [3, 36, 11],
    [3, 36, 13],
    [3, 18],
    [3, 37],
    [3, 37, 4],
    [3, 37, 11],
    [3, 37, 13],
    [3, 144],
    [3, 12, 10, 18],
    [3, 12, 12, 18],
    [3, 11],
    [3, 38],
    [3, 38, 4],
    [3, 38, 36, 18],
    [3, 38, 37, 18],
    [3, 38, 11],
    [3, 38, 13],
    [3, 13],
    [243],
    [50, 33],
    [50, 29, 49],
    [50, 48],
    [50, 28],
    [50, 28, 74],
    [50, 92],
    [50, 102, 74],
    [50, 93],
    [50, 103],
    [50, 87],
    [50, 94],
    [145, 190],
    [145, 89],
    [145, 191],
    [244, 245],
    [246, 4],
    [247],
    [146],
    [146, 115],
    [146, 39],
    [97],
    [97, 61],
    [97, 248],
    [97, 120],
    [97, 249],
    [62, 76],
    [62, 65],
    [62, 77],
    [62, 39],
    [62, 39, 4],
    [62, 39, 11],
    [62, 39, 13],
    [62, 173],
    [62, 13],
    [250],
    [251],
    [192],
    [192, 108],
    [147, 252],
    [147, 253],
    [147, 254],
    [255],
    [256],
    [257],
    [258, 187],
    [259, 260],
    [148],
    [148, 85],
    [148, 39],
    [261],
    [81],
    [81, 174],
    [81, 48],
    [81, 90],
    [81, 175],
    [81, 176],
    [81, 79],
    [262],
    [193, 4],
    [193, 85],
    [24],
    [24, 263],
    [24, 133, 110],
    [24, 177],
    [24, 164, 165],
    [24, 264, 94],
    [24, 22],
    [24, 22, 61],
    [24, 265],
    [24, 266],
    [24, 11],
    [24, 267],
    [24, 69],
    [24, 69, 268],
    [24, 69, 269],
    [24, 69, 270, 271],
    [24, 69, 178],
    [24, 69, 272],
    [24, 69, 30],
    [24, 273, 110],
    [24, 274],
    [275, 4, 61],
    [276],
    [277, 118, 278],
    [27],
    [27, 279],
    [27, 149, 95],
    [27, 149, 90],
    [27, 149, 150],
    [27, 23],
    [27, 23, 10],
    [27, 23, 77],
    [27, 23, 12],
    [27, 77],
    [27, 121],
    [27, 121, 10],
    [27, 121, 77],
    [27, 121, 12],
    [27, 122],
    [27, 122, 280],
    [27, 122, 95],
    [27, 122, 150],
    [281, 282],
    [283],
    [284, 179],
    [285],
    [151, 118],
    [151, 120],
    [151, 286],
    [287, 40],
    [288, 180],
    [289, 22],
    [290, 291],
    [82],
    [82, 8],
    [82, 8, 10],
    [82, 8, 12],
    [82, 7],
    [82, 7, 10],
    [82, 7, 12],
    [292],
    [123, 42],
    [123, 112],
    [123, 88],
    [123, 186],
    [293],
    [294, 144],
    [295, 4],
    [124, 49],
    [124, 181],
    [124, 125],
    [124, 125, 296],
    [126, 11],
    [126, 11, 20],
    [126, 11, 30],
    [126, 11, 71],
    [51],
    [51, 8],
    [51, 8, 10],
    [51, 8, 12],
    [51, 35],
    [51, 7],
    [51, 7, 10],
    [51, 7, 12],
    [51, 36],
    [51, 37],
    [51, 38],
    [127],
    [127, 10],
    [127, 297],
    [127, 12],
    [31],
    [31, 9],
    [31, 9, 40],
    [31, 9, 136],
    [31, 9, 70],
    [31, 9, 114],
    [31, 9, 137],
    [31, 9, 13],
    [31, 67],
    [31, 183],
    [31, 20],
    [31, 40],
    [31, 41],
    [31, 30],
    [31, 70],
    [31, 22],
    [31, 71],
    [298, 11],
    [98, 8, 22],
    [98, 125],
    [98, 7, 22],
    [98, 92],
    [98, 13],
    [128, 8, 22],
    [128, 125],
    [128, 7, 22],
    [128, 13],
    [299, 188, 40],
    [129],
    [129, 194],
    [129, 115],
    [129, 195],
    [2, 300],
    [2, 33, 88],
    [2, 8, 301],
    [2, 42, 83, 196],
    [2, 42, 83, 52],
    [2, 42, 83, 52, 117],
    [2, 42, 83, 52, 152],
    [2, 42, 83, 17],
    [2, 42, 83, 17, 80],
    [2, 42, 83, 17, 71],
    [2, 42, 302],
    [2, 113],
    [2, 28],
    [2, 28, 48],
    [2, 28, 303],
    [2, 90, 304],
    [2, 90, 305],
    [2, 197, 95],
    [2, 197, 150],
    [2, 306, 307, 61],
    [2, 116, 52, 308],
    [2, 116, 52, 92],
    [2, 116, 52, 309],
    [2, 134],
    [2, 198, 33],
    [2, 198, 40],
    [2, 135, 88],
    [2, 75, 49],
    [2, 138],
    [2, 68, 11],
    [2, 68, 43],
    [2, 68, 44],
    [2, 32, 196],
    [2, 32, 52],
    [2, 32, 52, 43, 117],
    [2, 32, 52, 43, 152],
    [2, 32, 52, 44, 117],
    [2, 32, 52, 44, 152],
    [2, 32, 310],
    [2, 32, 17, 80, 43],
    [2, 32, 17, 80, 44],
    [2, 32, 17, 71],
    [2, 32, 17, 43],
    [2, 32, 17, 44],
    [2, 32, 311],
    [2, 312, 4],
    [2, 84, 313, 4],
    [2, 84, 314, 4],
    [2, 84, 315, 4],
    [2, 84, 316, 4],
    [2, 84, 184, 4],
    [2, 84, 87, 4],
    [2, 84, 199, 4],
    [2, 15, 317],
    [2, 15, 139, 318],
    [2, 15, 68],
    [2, 143, 200],
    [2, 143, 86],
    [2, 54],
    [2, 54, 41],
    [2, 25],
    [2, 25, 56],
    [2, 25, 57],
    [2, 25, 96],
    [2, 25, 58, 59],
    [2, 64, 86],
    [2, 319, 49],
    [2, 79, 90],
    [2, 79, 19],
    [2, 79, 320],
    [2, 185, 40],
    [201, 172],
    [201, 30],
    [46],
    [46, 153],
    [46, 8],
    [46, 8, 10],
    [46, 8, 12],
    [46, 194],
    [46, 7],
    [46, 7, 10],
    [46, 7, 12],
    [46, 115],
    [46, 321],
    [46, 195],
    [322],
    [323],
    [324],
    [99],
    [99, 4],
    [99, 202],
    [99, 11],
    [99, 13],
    [63],
    [63, 153],
    [63, 8],
    [63, 67, 6],
    [63, 67, 19],
    [63, 7],
    [63, 79],
    [63, 43],
    [63, 44],
    [100, 91],
    [100, 91, 8],
    [100, 91, 7],
    [100, 91, 43],
    [100, 91, 44],
    [53],
    [53, 8],
    [53, 8, 10],
    [53, 8, 12],
    [53, 35],
    [53, 7],
    [53, 7, 10],
    [53, 7, 12],
    [53, 36],
    [53, 37],
    [53, 38],
    [154, 49, 190],
    [154, 49, 89],
    [154, 49, 191],
    [325, 138],
    [203],
    [203, 41],
    [155, 42],
    [155, 112],
    [155, 88],
    [326, 327],
    [328],
    [329, 4, 61],
    [330],
    [331],
    [332],
    [333],
    [334, 77],
    [156, 33],
    [156, 335],
    [156, 30],
    [336],
    [5, 91],
    [5, 19],
    [5, 19, 8],
    [5, 19, 8, 10],
    [5, 19, 8, 12],
    [5, 19, 35],
    [5, 19, 7],
    [5, 19, 7, 10],
    [5, 19, 7, 12],
    [5, 19, 36],
    [5, 19, 37],
    [5, 19, 38],
    [5, 34],
    [5, 34, 8],
    [5, 34, 8, 10],
    [5, 34, 8, 12],
    [5, 34, 35],
    [5, 34, 7],
    [5, 34, 7, 10],
    [5, 34, 7, 12],
    [5, 34, 36],
    [5, 34, 37],
    [5, 34, 38],
    [5, 17, 33],
    [5, 17, 337],
    [5, 17, 338],
    [5, 17, 19],
    [5, 17, 19, 35],
    [5, 17, 19, 36],
    [5, 17, 19, 37],
    [5, 17, 19, 38],
    [5, 17, 80, 43],
    [5, 17, 80, 44],
    [5, 17, 339],
    [5, 17, 71],
    [5, 17, 71, 43],
    [5, 17, 71, 44],
    [130, 4],
    [130, 340],
    [130, 199, 4],
    [130, 13],
    [131, 20, 341],
    [131, 19],
    [131, 342],
    [131, 120],
    [204, 4],
    [204, 85],
    [73],
    [73, 343],
    [73, 344],
    [73, 345],
    [73, 346],
    [73, 347],
    [73, 85],
    [73, 13],
    [348, 22],
    [349, 350],
    [16, 33],
    [16, 33, 168],
    [16, 153],
    [16, 139, 351],
    [16, 29],
    [16, 29, 4],
    [16, 29, 75],
    [16, 29, 140],
    [16, 29, 140, 352],
    [16, 29, 11],
    [16, 29, 353],
    [16, 29, 13],
    [16, 72],
    [16, 72, 4],
    [16, 72, 30],
    [16, 72, 11],
    [16, 354],
    [16, 135],
    [16, 118],
    [16, 68],
    [16, 120],
    [16, 87],
    [16, 22, 61],
    [16, 54],
    [16, 142, 202],
    [16, 142, 30],
    [355],
    [356, 200],
    [132],
    [132, 6],
    [132, 41],
    [132, 11],
    [101],
    [101, 56],
    [101, 57],
    [101, 96],
    [101, 58, 59],
    [357],
    [358, 359],
    [360, 86],
    [361, 362],
    [363, 33],
    [364],
    [365, 366],
    [367],
    [368],
    [369, 370],
    [157, 49],
    [157, 144],
    [157, 79],
    [371, 40],
    [372, 373],
    [374],
];



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
