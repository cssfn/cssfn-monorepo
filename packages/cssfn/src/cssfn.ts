// cssfn:
import type {
    // types:
    OptionalOrBoolean,
    
    Factory,
    
    Dictionary,
}                           from '@cssfn/types'
import type {
    // css special properties:
    CssFontFaceProps,
    
    
    
    // cssfn properties:
    CssCustomValue,
    CssCustomProps,
    
    CssKnownValueOf,
    
    CssProps,
    
    CssRuleData,
    CssRule,
    CssRuleCollection,
    
    CssStyle,
    
    CssKeyframes,
    
    CssSelector,
    CssSelectorCollection,
    CssSelectorOptions,
    
    CssRawSelector,
    CssFinalSelector,
    
    CssScopeName,
    CssScopeOptions,
    CssScopeEntry,
}                           from '@cssfn/css-types'
import type {
    // types:
    Combinator,
}                           from '@cssfn/css-selectors'

// internals:
import {
    flat,
    isFinalSelector,
    normalizeSelectorOptions,
}                           from './utilities.js'
export {
    StyleSheet,
    styleSheet,
}                           from './styleSheets.js'
export {
    camelCase,
}                           from 'camel-case'
export {
    pascalCase,
}                           from 'pascal-case'



// rules:
/**
 * Defines a conditional style(s) that is applied when the specified `selectors` meets the conditions.
 * @returns A `CssRule` represents a conditional style(s).
 */
export const rule = (selectors: CssSelectorCollection, style: CssStyle, options?: CssSelectorOptions): CssRule => ({
    [Symbol()] : [
        [selectors, options],
        style
    ],
});
/**
 * Defines an @rule.
 * @returns A `CssRule` represents an @rule.
 */
export const atRule = (atRule: `@${string}`, style: CssStyle): CssRule => ({
    [Symbol()] : [
        atRule,
        style
    ],
});



// rule groups:
const overwriteSelectorOptions = (selector: CssRawSelector|CssFinalSelector, options: CssSelectorOptions): CssRawSelector => {
    if (isFinalSelector(selector)) {
        return [
            selector,
            options
        ];
    } // if
    
    
    
    // extract raw selector:
    const [selectors, oldOptions] = selector;
    
    const performGrouping      =                      options.performGrouping      ?? oldOptions?.performGrouping;
    const specificityWeight    =                      options.specificityWeight    ?? oldOptions?.specificityWeight;
    const minSpecificityWeight = specificityWeight ?? options.minSpecificityWeight ?? oldOptions?.minSpecificityWeight;
    const maxSpecificityWeight = specificityWeight ?? options.maxSpecificityWeight ?? oldOptions?.maxSpecificityWeight;
    
    return [
        selectors,
        {
            performGrouping,
            
            specificityWeight,
            minSpecificityWeight,
            maxSpecificityWeight,
        }
    ];
}
export const rules    = (rules   : CssRuleCollection, options?: CssSelectorOptions): CssRule => {
    const result = (
        flat(rules)
        .filter((rule): rule is CssRule|Factory<OptionalOrBoolean<CssRule>> => !!rule && (rule !== true))
        .map((ruleOrFactory): OptionalOrBoolean<CssRule> => {
            if (typeof(ruleOrFactory) === 'function') return ruleOrFactory();
            return ruleOrFactory;
        })
        .filter((optionalRule): optionalRule is CssRule => !!optionalRule && (optionalRule !== true))
    );
    if (!options) return Object.assign({}, ...result); // merge multiple CssRule objects to single CssRule object
    
    
    
    return Object.fromEntries(
        result
        .flatMap((rule): (readonly [symbol, CssRuleData])[] => (
            Object.getOwnPropertySymbols(rule)
            .map((symbolProp): readonly [symbol, CssRuleData] => {
                const [selector, style] = rule[symbolProp];
                const rawSelector : CssRawSelector = overwriteSelectorOptions(selector, options);
                const ruleData    : CssRuleData    = [rawSelector, style];
                
                return [
                    symbolProp,
                    ruleData
                ];
            })
        ))
    );
};

const defaultVariantOptions : CssSelectorOptions = {
    maxSpecificityWeight : 2,
}
/**
 * Defines style variants.
 * @returns A `CssRule` represents a style variants.
 */
export const variants = (variants: CssRuleCollection, options?: CssSelectorOptions) => rules(variants, normalizeSelectorOptions(options, defaultVariantOptions));

const defaultStateOptions : CssSelectorOptions = {
    minSpecificityWeight : 3,
}
/**
 * Defines style states.
 * @returns A `CssRule` represents a style states.
 */
export const states   = (states  : CssRuleCollection, options?: CssSelectorOptions) => rules(states  , normalizeSelectorOptions(options, defaultStateOptions  ));



// keyframes:
export const keyframes         = (name: string, items: CssKeyframes) => atRule(`@keyframes ${name}`, (Object.fromEntries(
    Object.entries(items).map(([key, frame]): readonly [symbol, CssRuleData] => [
        Symbol(),
        [
            ` ${key}`, // add a single space as PropRule token
            frame
        ]
    ])
) as CssRule));



// rule shortcuts:
export const noRule            = (style: CssStyle                              ) => rule('&'                   , style         );
export const emptyRule         = (                                             ) => rule(null                  , {}            );
export const fallbacks         = (style: CssStyle                              ) => atRule('@fallbacks'        , style         );
export const fontFace          = (style: CssFontFaceProps                      ) => atRule('@font-face'        , style         );
export const atGlobal          = (rules: CssRule                               ) => atRule('@global'           , rules         );

export const atRoot            = (style: CssStyle, options?: CssSelectorOptions) => rule(':root'               , style, options);
export const isFirstChild      = (style: CssStyle, options?: CssSelectorOptions) => rule(     ':first-child'   , style, options);
export const isNotFirstChild   = (style: CssStyle, options?: CssSelectorOptions) => rule(':not(:first-child)'  , style, options);
export const isLastChild       = (style: CssStyle, options?: CssSelectorOptions) => rule(     ':last-child'    , style, options);
export const isNotLastChild    = (style: CssStyle, options?: CssSelectorOptions) => rule(':not(:last-child)'   , style, options);
export const isNthChild        = (step: number, offset: number, style: CssStyle, options?: CssSelectorOptions): CssRule => {
    if (step === 0) { // no step
        if (offset === 0) return emptyRule();                                    // 0th => never match => return empty rule
        
        if (offset === 1) return isFirstChild(style, options);                   // 1st
        
        return rule(`:nth-child(${offset})`, style, options);                    // 2nd, 3rd, 4th, ...
    }
    else if (step === 1) { // 1 step
        if (offset === 0) return rule(`:nth-child(n)`, style, options);          // always match
        
        return rule(`:nth-child(n+${offset})`, style, options);
    }
    else { // 2+ steps
        if (offset === 0) return rule(`:nth-child(${step}n)`, style, options);
        
        return rule(`:nth-child(${step}n+${offset})`, style, options);
    } // if
};
export const isNotNthChild     = (step: number, offset: number, style: CssStyle, options?: CssSelectorOptions): CssRule => {
    if (step === 0) { // no step
        if (offset === 0) return isNthChild(1, 0, style, options);               // not 0th => not never match => always match
        
        if (offset === 1) return isNotFirstChild(style, options);                // not 1st
        
        return rule(`:not(:nth-child(${offset}))`, style, options);              // not 2nd, not 3rd, not 4th, not ...
    }
    else if (step === 1) { // 1 step
        if (offset === 0) return emptyRule();                                    // never match => return empty rule
        
        return rule(`:not(:nth-child(n+${offset}))`, style, options);
    }
    else { // 2+ steps
        if (offset === 0) return rule(`:not(:nth-child(${step}n))`, style, options);
        
        return rule(`:not(:nth-child(${step}n+${offset}))`, style, options);
    } // if
};
export const isNthLastChild    = (step: number, offset: number, style: CssStyle, options?: CssSelectorOptions): CssRule => {
    if (step === 0) { // no step
        if (offset === 0) return emptyRule();                                    // 0th => never match => return empty rule
        
        if (offset === 1) return isLastChild(style, options);                    // 1st
        
        return rule(`:nth-last-child(${offset})`, style, options);               // 2nd, 3rd, 4th, ...
    }
    else if (step === 1) { // 1 step
        if (offset === 0) return isNthChild(1, 0, style, options);               // always match
        
        return rule(`:nth-last-child(n+${offset})`, style, options);
    }
    else { // 2+ steps
        if (offset === 0) return rule(`:nth-last-child(${step}n)`, style, options);
        
        return rule(`:nth-last-child(${step}n+${offset})`, style, options);
    } // if
};
export const isNotNthLastChild = (step: number, offset: number, style: CssStyle, options?: CssSelectorOptions): CssRule => {
    if (step === 0) { // no step
        if (offset === 0) return isNthChild(1, 0, style, options);               // not 0th last => not never match => always match
        
        if (offset === 1) return isNotLastChild(style, options);                 // not 1st last
        
        return rule(`:not(:nth-last-child(${offset}))`, style, options);         // not 2nd last, not 3rd last, not 4th last, not ... last
    }
    else if (step === 1) { // 1 step
        if (offset === 0) return emptyRule();                                    // never match => return empty rule
        
        return rule(`:not(:nth-last-child(n+${offset}))`, style, options);
    }
    else { // 2+ steps
        if (offset === 0) return rule(`:not(:nth-last-child(${step}n))`, style, options);
        
        return rule(`:not(:nth-last-child(${step}n+${offset}))`, style, options);
    } // if
};
export const isActive          = (style: CssStyle, options?: CssSelectorOptions) => rule(     ':active'        , style, options);
export const isNotActive       = (style: CssStyle, options?: CssSelectorOptions) => rule(':not(:active)'       , style, options);
export const isFocus           = (style: CssStyle, options?: CssSelectorOptions) => rule(     ':focus'         , style, options);
export const isNotFocus        = (style: CssStyle, options?: CssSelectorOptions) => rule(':not(:focus)'        , style, options);
export const isFocusVisible    = (style: CssStyle, options?: CssSelectorOptions) => rule(     ':focus-visible' , style, options);
export const isNotFocusVisible = (style: CssStyle, options?: CssSelectorOptions) => rule(':not(:focus-visible)', style, options);
export const isHover           = (style: CssStyle, options?: CssSelectorOptions) => rule(     ':hover'         , style, options);
export const isNotHover        = (style: CssStyle, options?: CssSelectorOptions) => rule(':not(:hover)'        , style, options);
export const isEmpty           = (style: CssStyle, options?: CssSelectorOptions) => rule(     ':empty'         , style, options);
export const isNotEmpty        = (style: CssStyle, options?: CssSelectorOptions) => rule(':not(:empty)'        , style, options);



// combinators:
export const combinators  = (combinator: Combinator, selectors: CssSelectorCollection, style: CssStyle, options?: CssSelectorOptions): CssRule => {
    const combiSelectors : CssSelector[] = flat(selectors).filter((selector): selector is CssSelector => !!selector && (selector !== true)).map((selector) => {
        if (selector.includes('&')) return selector; // custom combinator
        
        if (selector.startsWith('::')) return `&${selector}`; // pseudo element => directly attach to the parent_selector
        
        return `&${combinator}${selector}`;
    });
    if (!combiSelectors.length) return emptyRule(); // no selector => return empty
    
    
    
    return rule(combiSelectors, style, options);
};
export const descendants  = (selectors: CssSelectorCollection, style: CssStyle, options?: CssSelectorOptions) => combinators(' ', selectors, style, options);
export const children     = (selectors: CssSelectorCollection, style: CssStyle, options?: CssSelectorOptions) => combinators('>', selectors, style, options);
export const siblings     = (selectors: CssSelectorCollection, style: CssStyle, options?: CssSelectorOptions) => combinators('~', selectors, style, options);
export const nextSiblings = (selectors: CssSelectorCollection, style: CssStyle, options?: CssSelectorOptions) => combinators('+', selectors, style, options);



// styles:
/**
 * Defines css properties.
 * @returns A `CssRule` represents the css properties.
 */
export const style   = (style: CssStyle)       => noRule(style);
/**
 * Defines css variables.
 * @returns A `CssRule` represents the css variables.
 */
export const vars    = (items: CssCustomProps) => noRule(items);
export const imports = (styles: CssStyle[])    => rules(styles.map((style) => noRule(style))); // force to use an array bracket [] for syntax consistency



// scopes:
/**
 * Defines an additional scoped styleSheet.
 * @returns A `CssScopeEntry` represents a scoped styleSheet.
 */
export const scopeOf     = <TCssScopeName extends CssScopeName>(scopeName: TCssScopeName, style: CssStyle, options?: CssScopeOptions): CssScopeEntry<TCssScopeName> => [
    scopeName,
    style,
    options
];
/**
 * Defines the main styleSheet.
 * @returns A `CssScopeEntry` represents a main styleSheet.
 */
export const mainScope   = (style: CssStyle, options?: CssScopeOptions) => scopeOf('main' , style, options);
/**
 * Defines an unscoped styleSheet (applied to a whole document).
 * @returns A `CssScopeEntry` represents an unscoped styleSheet.
 */
export const globalScope = (rules :  CssRule                          ) => scopeOf(''     , rules         );



// utilities:
export const iif = <TCssStyle extends (CssProps|CssRule|CssStyle)>(condition: boolean, content: TCssStyle): TCssStyle => {
    return condition ? content : ({} as TCssStyle);
};
/**
 * Escapes some sets of character in svg data, so it will be valid to be written in css.
 * @param svgData The raw svg data to be escaped.
 * @returns A `string` represents an escaped svg data.
 */
export const escapeSvg = (svgData: string): string => {
    const escapedChars: Dictionary<string> = {
        '<': '%3c',
        '>': '%3e',
        '#': '%23',
        '(': '%28',
        ')': '%29',
    };
    
    const svgDataCopy = Array.from(svgData);
    for (const index in svgDataCopy) {
        const char = svgDataCopy[index];
        if (char in escapedChars) svgDataCopy[index] = escapedChars[char];
    }
    
    return svgDataCopy.join('');
};
/**
 * Creates a single layer of solid background based on the specified `color`.
 * @param color The color of the solid background to create.
 * @returns A `CssCustomValue` represents a solid background.
 */
export const solidBackg = (color: CssCustomValue, clip : CssKnownValueOf<'backgroundClip'> = 'border-box'): CssCustomValue => {
    return [[`linear-gradient(${color}, ${color})`, clip]];
}
