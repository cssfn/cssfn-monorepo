import {
    createBulkList,
} from '../dist/bulk-list-builder.js'



const standardLonghandProps = [
'accentColor',
'alignContent',
'alignItems',
'alignSelf',
'alignTracks',
'animationDelay',
'animationDirection',
'animationDuration',
'animationFillMode',
'animationIterationCount',
'animationName',
'animationPlayState',
'animationTimeline',
'animationTimingFunction',
'appearance',
'aspectRatio',
'backdropFilter',
'backfaceVisibility',
'backgroundAttachment',
'backgroundBlendMode',
'backgroundClip',
'backgroundColor',
'backgroundImage',
'backgroundOrigin',
'backgroundPositionX',
'backgroundPositionY',
'backgroundRepeat',
'backgroundSize',
'blockOverflow',
'blockSize',
'borderBlockColor',
'borderBlockEndColor',
'borderBlockEndStyle',
'borderBlockEndWidth',
'borderBlockStartColor',
'borderBlockStartStyle',
'borderBlockStartWidth',
'borderBlockStyle',
'borderBlockWidth',
'borderBottomColor',
'borderBottomLeftRadius',
'borderBottomRightRadius',
'borderBottomStyle',
'borderBottomWidth',
'borderCollapse',
'borderEndEndRadius',
'borderEndStartRadius',
'borderImageOutset',
'borderImageRepeat',
'borderImageSlice',
'borderImageSource',
'borderImageWidth',
'borderInlineColor',
'borderInlineEndColor',
'borderInlineEndStyle',
'borderInlineEndWidth',
'borderInlineStartColor',
'borderInlineStartStyle',
'borderInlineStartWidth',
'borderInlineStyle',
'borderInlineWidth',
'borderLeftColor',
'borderLeftStyle',
'borderLeftWidth',
'borderRightColor',
'borderRightStyle',
'borderRightWidth',
'borderSpacing',
'borderStartEndRadius',
'borderStartStartRadius',
'borderTopColor',
'borderTopLeftRadius',
'borderTopRightRadius',
'borderTopStyle',
'borderTopWidth',
'bottom',
'boxDecorationBreak',
'boxShadow',
'boxSizing',
'breakAfter',
'breakBefore',
'breakInside',
'captionSide',
'caretColor',
'clear',
'clipPath',
'color',
'colorAdjust',
'colorScheme',
'columnCount',
'columnFill',
'columnGap',
'columnRuleColor',
'columnRuleStyle',
'columnRuleWidth',
'columnSpan',
'columnWidth',
'contain',
'content',
'contentVisibility',
'counterIncrement',
'counterReset',
'counterSet',
'cursor',
'direction',
'display',
'emptyCells',
'filter',
'flexBasis',
'flexDirection',
'flexGrow',
'flexShrink',
'flexWrap',
'float',
'fontFamily',
'fontFeatureSettings',
'fontKerning',
'fontLanguageOverride',
'fontOpticalSizing',
'fontSize',
'fontSizeAdjust',
'fontSmooth',
'fontStretch',
'fontStyle',
'fontSynthesis',
'fontVariant',
'fontVariantAlternates',
'fontVariantCaps',
'fontVariantEastAsian',
'fontVariantLigatures',
'fontVariantNumeric',
'fontVariantPosition',
'fontVariationSettings',
'fontWeight',
'forcedColorAdjust',
'gridAutoColumns',
'gridAutoFlow',
'gridAutoRows',
'gridColumnEnd',
'gridColumnStart',
'gridRowEnd',
'gridRowStart',
'gridTemplateAreas',
'gridTemplateColumns',
'gridTemplateRows',
'hangingPunctuation',
'height',
'hyphenateCharacter',
'hyphens',
'imageOrientation',
'imageRendering',
'imageResolution',
'initialLetter',
'inlineSize',
'inputSecurity',
'inset',
'insetBlock',
'insetBlockEnd',
'insetBlockStart',
'insetInline',
'insetInlineEnd',
'insetInlineStart',
'isolation',
'justifyContent',
'justifyItems',
'justifySelf',
'justifyTracks',
'left',
'letterSpacing',
'lineBreak',
'lineHeight',
'lineHeightStep',
'listStyleImage',
'listStylePosition',
'listStyleType',
'marginBlock',
'marginBlockEnd',
'marginBlockStart',
'marginBottom',
'marginInline',
'marginInlineEnd',
'marginInlineStart',
'marginLeft',
'marginRight',
'marginTop',
'maskBorderMode',
'maskBorderOutset',
'maskBorderRepeat',
'maskBorderSlice',
'maskBorderSource',
'maskBorderWidth',
'maskClip',
'maskComposite',
'maskImage',
'maskMode',
'maskOrigin',
'maskPosition',
'maskRepeat',
'maskSize',
'maskType',
'mathStyle',
'maxBlockSize',
'maxHeight',
'maxInlineSize',
'maxLines',
'maxWidth',
'minBlockSize',
'minHeight',
'minInlineSize',
'minWidth',
'mixBlendMode',
'motionDistance',
'motionPath',
'motionRotation',
'objectFit',
'objectPosition',
'offsetAnchor',
'offsetDistance',
'offsetPath',
'offsetRotate',
'offsetRotation',
'opacity',
'order',
'orphans',
'outlineColor',
'outlineOffset',
'outlineStyle',
'outlineWidth',
'overflowAnchor',
'overflowBlock',
'overflowClipBox',
'overflowClipMargin',
'overflowInline',
'overflowWrap',
'overflowX',
'overflowY',
'overscrollBehaviorBlock',
'overscrollBehaviorInline',
'overscrollBehaviorX',
'overscrollBehaviorY',
'paddingBlock',
'paddingBlockEnd',
'paddingBlockStart',
'paddingBottom',
'paddingInline',
'paddingInlineEnd',
'paddingInlineStart',
'paddingLeft',
'paddingRight',
'paddingTop',
'pageBreakAfter',
'pageBreakBefore',
'pageBreakInside',
'paintOrder',
'perspective',
'perspectiveOrigin',
'placeContent',
'pointerEvents',
'position',
'printColorAdjust',
'quotes',
'resize',
'right',
'rotate',
'rowGap',
'rubyAlign',
'rubyMerge',
'rubyPosition',
'scale',
'scrollBehavior',
'scrollMargin',
'scrollMarginBlock',
'scrollMarginBlockEnd',
'scrollMarginBlockStart',
'scrollMarginBottom',
'scrollMarginInline',
'scrollMarginInlineEnd',
'scrollMarginInlineStart',
'scrollMarginLeft',
'scrollMarginRight',
'scrollMarginTop',
'scrollPadding',
'scrollPaddingBlock',
'scrollPaddingBlockEnd',
'scrollPaddingBlockStart',
'scrollPaddingBottom',
'scrollPaddingInline',
'scrollPaddingInlineEnd',
'scrollPaddingInlineStart',
'scrollPaddingLeft',
'scrollPaddingRight',
'scrollPaddingTop',
'scrollSnapAlign',
'scrollSnapMargin',
'scrollSnapMarginBottom',
'scrollSnapMarginLeft',
'scrollSnapMarginRight',
'scrollSnapMarginTop',
'scrollSnapStop',
'scrollSnapType',
'scrollbarColor',
'scrollbarGutter',
'scrollbarWidth',
'shapeImageThreshold',
'shapeMargin',
'shapeOutside',
'tabSize',
'tableLayout',
'textAlign',
'textAlignLast',
'textCombineUpright',
'textDecorationColor',
'textDecorationLine',
'textDecorationSkip',
'textDecorationSkipInk',
'textDecorationStyle',
'textDecorationThickness',
'textDecorationWidth',
'textEmphasisColor',
'textEmphasisPosition',
'textEmphasisStyle',
'textIndent',
'textJustify',
'textOrientation',
'textOverflow',
'textRendering',
'textShadow',
'textSizeAdjust',
'textTransform',
'textUnderlineOffset',
'textUnderlinePosition',
'top',
'touchAction',
'transform',
'transformBox',
'transformOrigin',
'transformStyle',
'transitionDelay',
'transitionDuration',
'transitionProperty',
'transitionTimingFunction',
'translate',
'unicodeBidi',
'userSelect',
'verticalAlign',
'visibility',
'whiteSpace',
'widows',
'width',
'willChange',
'wordBreak',
'wordSpacing',
'wordWrap',
'writingMode',
'zIndex',
'zoom',
];

const standardShorthandProps = [
'all',
'animation',
'background',
'backgroundPosition',
'border',
'borderBlock',
'borderBlockEnd',
'borderBlockStart',
'borderBottom',
'borderColor',
'borderImage',
'borderInline',
'borderInlineEnd',
'borderInlineStart',
'borderLeft',
'borderRadius',
'borderRight',
'borderStyle',
'borderTop',
'borderWidth',
'columnRule',
'columns',
'flex',
'flexFlow',
'font',
'gap',
'grid',
'gridArea',
'gridColumn',
'gridRow',
'gridTemplate',
'lineClamp',
'listStyle',
'margin',
'mask',
'maskBorder',
'motion',
'offset',
'outline',
'overflow',
'overscrollBehavior',
'padding',
'placeItems',
'placeSelf',
'textDecoration',
'textEmphasis',
'transition',
];

const vendorLonghandProps = [
'MozAnimationDelay',
'MozAnimationDirection',
'MozAnimationDuration',
'MozAnimationFillMode',
'MozAnimationIterationCount',
'MozAnimationName',
'MozAnimationPlayState',
'MozAnimationTimingFunction',
'MozAppearance',
'MozBackfaceVisibility',
'MozBorderBottomColors',
'MozBorderEndColor',
'MozBorderEndStyle',
'MozBorderEndWidth',
'MozBorderLeftColors',
'MozBorderRightColors',
'MozBorderStartColor',
'MozBorderStartStyle',
'MozBorderTopColors',
'MozBoxSizing',
'MozColumnCount',
'MozColumnFill',
'MozColumnGap',
'MozColumnRuleColor',
'MozColumnRuleStyle',
'MozColumnRuleWidth',
'MozColumnWidth',
'MozContextProperties',
'MozFontFeatureSettings',
'MozFontLanguageOverride',
'MozHyphens',
'MozImageRegion',
'MozMarginEnd',
'MozMarginStart',
'MozOrient',
'MozOsxFontSmoothing',
'MozPaddingEnd',
'MozPaddingStart',
'MozPerspective',
'MozPerspectiveOrigin',
'MozStackSizing',
'MozTabSize',
'MozTextBlink',
'MozTextSizeAdjust',
'MozTransformOrigin',
'MozTransformStyle',
'MozTransitionDelay',
'MozTransitionDuration',
'MozTransitionProperty',
'MozTransitionTimingFunction',
'MozUserFocus',
'MozUserModify',
'MozUserSelect',
'MozWindowDragging',
'MozWindowShadow',
'msAccelerator',
'msAlignSelf',
'msBlockProgression',
'msContentZoomChaining',
'msContentZoomLimitMax',
'msContentZoomLimitMin',
'msContentZoomSnapPoints',
'msContentZoomSnapType',
'msContentZooming',
'msFilter',
'msFlexDirection',
'msFlexPositive',
'msFlowFrom',
'msFlowInto',
'msGridColumns',
'msGridRows',
'msHighContrastAdjust',
'msHyphenateLimitChars',
'msHyphenateLimitLines',
'msHyphenateLimitZone',
'msHyphens',
'msImeAlign',
'msJustifySelf',
'msLineBreak',
'msOrder',
'msOverflowStyle',
'msOverflowX',
'msOverflowY',
'msScrollChaining',
'msScrollLimitXMax',
'msScrollLimitXMin',
'msScrollLimitYMax',
'msScrollLimitYMin',
'msScrollRails',
'msScrollSnapPointsX',
'msScrollSnapPointsY',
'msScrollSnapType',
'msScrollTranslation',
'msScrollbar3dlightColor',
'msScrollbarArrowColor',
'msScrollbarBaseColor',
'msScrollbarDarkshadowColor',
'msScrollbarFaceColor',
'msScrollbarHighlightColor',
'msScrollbarShadowColor',
'msTextAutospace',
'msTextCombineHorizontal',
'msTextOverflow',
'msTouchAction',
'msTouchSelect',
'msTransform',
'msTransformOrigin',
'msTransitionDelay',
'msTransitionDuration',
'msTransitionProperty',
'msTransitionTimingFunction',
'msUserSelect',
'msWordBreak',
'msWrapFlow',
'msWrapMargin',
'msWrapThrough',
'msWritingMode',
'WebkitAlignContent',
'WebkitAlignItems',
'WebkitAlignSelf',
'WebkitAnimationDelay',
'WebkitAnimationDirection',
'WebkitAnimationDuration',
'WebkitAnimationFillMode',
'WebkitAnimationIterationCount',
'WebkitAnimationName',
'WebkitAnimationPlayState',
'WebkitAnimationTimingFunction',
'WebkitAppearance',
'WebkitBackdropFilter',
'WebkitBackfaceVisibility',
'WebkitBackgroundClip',
'WebkitBackgroundOrigin',
'WebkitBackgroundSize',
'WebkitBorderBeforeColor',
'WebkitBorderBeforeStyle',
'WebkitBorderBeforeWidth',
'WebkitBorderBottomLeftRadius',
'WebkitBorderBottomRightRadius',
'WebkitBorderImageSlice',
'WebkitBorderTopLeftRadius',
'WebkitBorderTopRightRadius',
'WebkitBoxDecorationBreak',
'WebkitBoxReflect',
'WebkitBoxShadow',
'WebkitBoxSizing',
'WebkitClipPath',
'WebkitColumnCount',
'WebkitColumnFill',
'WebkitColumnGap',
'WebkitColumnRuleColor',
'WebkitColumnRuleStyle',
'WebkitColumnRuleWidth',
'WebkitColumnSpan',
'WebkitColumnWidth',
'WebkitFilter',
'WebkitFlexBasis',
'WebkitFlexDirection',
'WebkitFlexGrow',
'WebkitFlexShrink',
'WebkitFlexWrap',
'WebkitFontFeatureSettings',
'WebkitFontKerning',
'WebkitFontSmoothing',
'WebkitFontVariantLigatures',
'WebkitHyphenateCharacter',
'WebkitHyphens',
'WebkitInitialLetter',
'WebkitJustifyContent',
'WebkitLineBreak',
'WebkitLineClamp',
'WebkitMarginEnd',
'WebkitMarginStart',
'WebkitMaskAttachment',
'WebkitMaskBoxImageOutset',
'WebkitMaskBoxImageRepeat',
'WebkitMaskBoxImageSlice',
'WebkitMaskBoxImageSource',
'WebkitMaskBoxImageWidth',
'WebkitMaskClip',
'WebkitMaskComposite',
'WebkitMaskImage',
'WebkitMaskOrigin',
'WebkitMaskPosition',
'WebkitMaskPositionX',
'WebkitMaskPositionY',
'WebkitMaskRepeat',
'WebkitMaskRepeatX',
'WebkitMaskRepeatY',
'WebkitMaskSize',
'WebkitMaxInlineSize',
'WebkitOrder',
'WebkitOverflowScrolling',
'WebkitPaddingEnd',
'WebkitPaddingStart',
'WebkitPerspective',
'WebkitPerspectiveOrigin',
'WebkitPrintColorAdjust',
'WebkitRubyPosition',
'WebkitScrollSnapType',
'WebkitShapeMargin',
'WebkitTapHighlightColor',
'WebkitTextCombine',
'WebkitTextDecorationColor',
'WebkitTextDecorationLine',
'WebkitTextDecorationSkip',
'WebkitTextDecorationStyle',
'WebkitTextEmphasisColor',
'WebkitTextEmphasisPosition',
'WebkitTextEmphasisStyle',
'WebkitTextFillColor',
'WebkitTextOrientation',
'WebkitTextSizeAdjust',
'WebkitTextStrokeColor',
'WebkitTextStrokeWidth',
'WebkitTextUnderlinePosition',
'WebkitTouchCallout',
'WebkitTransform',
'WebkitTransformOrigin',
'WebkitTransformStyle',
'WebkitTransitionDelay',
'WebkitTransitionDuration',
'WebkitTransitionProperty',
'WebkitTransitionTimingFunction',
'WebkitUserModify',
'WebkitUserSelect',
'WebkitWritingMode',
];

const vendorShorthandProps = [
'MozAnimation',
'MozBorderImage',
'MozColumnRule',
'MozColumns',
'MozTransition',
'msContentZoomLimit',
'msContentZoomSnap',
'msFlex',
'msScrollLimit',
'msScrollSnapX',
'msScrollSnapY',
'msTransition',
'WebkitAnimation',
'WebkitBorderBefore',
'WebkitBorderImage',
'WebkitBorderRadius',
'WebkitColumnRule',
'WebkitColumns',
'WebkitFlex',
'WebkitFlexFlow',
'WebkitMask',
'WebkitMaskBoxImage',
'WebkitTextEmphasis',
'WebkitTextStroke',
'WebkitTransition',
];

const obsoleteProps = [
'azimuth',
'boxAlign',
'boxDirection',
'boxFlex',
'boxFlexGroup',
'boxLines',
'boxOrdinalGroup',
'boxOrient',
'boxPack',
'clip',
'gridColumnGap',
'gridGap',
'gridRowGap',
'imeMode',
'offsetBlock',
'offsetBlockEnd',
'offsetBlockStart',
'offsetInline',
'offsetInlineEnd',
'offsetInlineStart',
'scrollSnapCoordinate',
'scrollSnapDestination',
'scrollSnapPointsX',
'scrollSnapPointsY',
'scrollSnapTypeX',
'scrollSnapTypeY',
'scrollbarTrackColor',
'KhtmlBoxAlign',
'KhtmlBoxDirection',
'KhtmlBoxFlex',
'KhtmlBoxFlexGroup',
'KhtmlBoxLines',
'KhtmlBoxOrdinalGroup',
'KhtmlBoxOrient',
'KhtmlBoxPack',
'KhtmlLineBreak',
'KhtmlOpacity',
'KhtmlUserSelect',
'MozBackgroundClip',
'MozBackgroundInlinePolicy',
'MozBackgroundOrigin',
'MozBackgroundSize',
'MozBinding',
'MozBorderRadius',
'MozBorderRadiusBottomleft',
'MozBorderRadiusBottomright',
'MozBorderRadiusTopleft',
'MozBorderRadiusTopright',
'MozBoxAlign',
'MozBoxDirection',
'MozBoxFlex',
'MozBoxOrdinalGroup',
'MozBoxOrient',
'MozBoxPack',
'MozBoxShadow',
'MozFloatEdge',
'MozForceBrokenImageIcon',
'MozOpacity',
'MozOutline',
'MozOutlineColor',
'MozOutlineRadius',
'MozOutlineRadiusBottomleft',
'MozOutlineRadiusBottomright',
'MozOutlineRadiusTopleft',
'MozOutlineRadiusTopright',
'MozOutlineStyle',
'MozOutlineWidth',
'MozTextAlignLast',
'MozTextDecorationColor',
'MozTextDecorationLine',
'MozTextDecorationStyle',
'MozUserInput',
'msImeMode',
'msScrollbarTrackColor',
'OAnimation',
'OAnimationDelay',
'OAnimationDirection',
'OAnimationDuration',
'OAnimationFillMode',
'OAnimationIterationCount',
'OAnimationName',
'OAnimationPlayState',
'OAnimationTimingFunction',
'OBackgroundSize',
'OBorderImage',
'OObjectFit',
'OObjectPosition',
'OTabSize',
'OTextOverflow',
'OTransform',
'OTransformOrigin',
'OTransition',
'OTransitionDelay',
'OTransitionDuration',
'OTransitionProperty',
'OTransitionTimingFunction',
'WebkitBoxAlign',
'WebkitBoxDirection',
'WebkitBoxFlex',
'WebkitBoxFlexGroup',
'WebkitBoxLines',
'WebkitBoxOrdinalGroup',
'WebkitBoxOrient',
'WebkitBoxPack',
'WebkitScrollSnapPointsX',
'WebkitScrollSnapPointsY',
];

const svgProps = [
'alignmentBaseline',
'baselineShift',
'clip',
'clipPath',
'clipRule',
'color',
'colorInterpolation',
'colorRendering',
'cursor',
'direction',
'display',
'dominantBaseline',
'fill',
'fillOpacity',
'fillRule',
'filter',
'floodColor',
'floodOpacity',
'font',
'fontFamily',
'fontSize',
'fontSizeAdjust',
'fontStretch',
'fontStyle',
'fontVariant',
'fontWeight',
'glyphOrientationVertical',
'imageRendering',
'letterSpacing',
'lightingColor',
'lineHeight',
'marker',
'markerEnd',
'markerMid',
'markerStart',
'mask',
'opacity',
'overflow',
'paintOrder',
'pointerEvents',
'shapeRendering',
'stopColor',
'stopOpacity',
'stroke',
'strokeDasharray',
'strokeDashoffset',
'strokeLinecap',
'strokeLinejoin',
'strokeMiterlimit',
'strokeOpacity',
'strokeWidth',
'textAnchor',
'textDecoration',
'textRendering',
'unicodeBidi',
'vectorEffect',
'visibility',
'whiteSpace',
'wordSpacing',
'writingMode',
];

const knownCssProps = [
    ...standardLonghandProps,
    ...standardShorthandProps,
    ...vendorLonghandProps,
    ...vendorShorthandProps,
    ...obsoleteProps,
    ...svgProps,
];



const { encodedSortedWordList, encodedIndexedList } = createBulkList(knownCssProps);



const decodedSortedWordList = encodedSortedWordList.split(',');
test('test decode SortedWordList', () => {
    decodedSortedWordList.forEach((decodedSortedWord) => {
        expect(knownCssProps.some((knownCssProp) => knownCssProp.includes(decodedSortedWord)))
        .toBe(true)
    });
});

test('test decode IndexedList', () => {
    const prevWordIndexMap = new Map<number, number>();
    
    const decodedIndexedList = (
        encodedIndexedList
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
    
    
    const sortedKnownCssProps = Array.from(new Set(knownCssProps)).sort();
    for (let i = 0; i < decodedIndexedList.length; i++) {
        const decodedItem = (
            decodedIndexedList[i]
            .map((wordIndex): string => ( // decode wordIndex to subWord
                decodedSortedWordList[wordIndex]
            ))
            .join('')
        );
        
        expect(decodedItem)
        .toEqual(
            sortedKnownCssProps[i]
        );
    } // for
});