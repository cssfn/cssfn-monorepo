// cssfn:
import type {
    // types:
    OptionalOrBoolean,
    
    Factory,
    
    Dictionary,
}                           from '@cssfn/types'
import type {
    // cssfn properties:
    CssCustomValue,
    CssCustomProps,
    
    CssKnownValueOf,
    
    CssProps,
    
    CssRuleData,
    CssRule,
    CssRuleCollection,
    
    CssStyle,
    CssStyleCollection,
    CssFontFaceStyleCollection,
    
    CssCustomKeyframesRef,
    CssKeyframes,
    CssKeyframesRule,
    
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
    StyleSheetOptions,
    StyleSheet,
    styleSheets,
    styleSheet,
}                           from './styleSheets.js'

// other libs:
export {
    camelCase,
}                           from 'camel-case'
export {
    pascalCase,
}                           from 'pascal-case'
import {
    // tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'



const isClientSide : boolean = isBrowser || isJsDom;



// rules:
/**
 * Defines a conditional style(s) that is applied when the specified `selectors` meets the conditions.
 * @returns A `CssRule` represents a conditional style(s).
 */
export const rule = (selectors: CssSelectorCollection, styles: CssStyleCollection, options?: CssSelectorOptions): CssRule => ({
    [Symbol()] : [
        [selectors, options],
        styles
    ],
});
/**
 * Defines an @rule.
 * @returns A `CssRule` represents an @rule.
 */
export const atRule = (atRule: `@${string}`, styles: CssStyleCollection): CssRule => ({
    [Symbol()] : [
        atRule,
        styles
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
                const [selector, styles] = rule[symbolProp];
                const rawSelector : CssRawSelector = overwriteSelectorOptions(selector, options);
                const ruleData    : CssRuleData    = [rawSelector, styles];
                
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
const globalAutoKeyframesIdRegistry = new Map<CssCustomKeyframesRefImpl, string>(); // should not be added on server side
class CssCustomKeyframesRefImpl implements CssCustomKeyframesRef {
    //#region private properties
    #value         : string|null;
    #onValueChange : (value: string) => void
    //#endregion private properties
    
    
    
    //#region constructors
    constructor(value: string|null, onValueChange: (value: string) => void) {
        this.#value = value || null; // non_empty_string or null
        this.#onValueChange = onValueChange;
    }
    //#endregion constructors
    
    
    
    //#region public properties
    get value(): string|null {
        return this.#value;
    }
    set value(value: string|null) {
        const newValue = value || null; // non_empty_string or null
        if (this.#value === newValue) return;
        this.#value = newValue;
        
        
        
        this.#onValueChange(this.toString());
    }
    //#endregion public properties
    
    
    
    //#region public methods
    toString(): string {
        const staticValue = this.#value;
        if (staticValue) return staticValue;
        
        
        
        // prevents the `globalAutoKeyframesIdRegistry` to grow on server side:
        if (!isClientSide) return 'k0';
        
        
        
        let autoValue = globalAutoKeyframesIdRegistry.get(this);
        if (autoValue) return autoValue;
        
        
        
        autoValue = `k${globalAutoKeyframesIdRegistry.size + 1}`;
        globalAutoKeyframesIdRegistry.set(this, autoValue);
        return autoValue;
    }
    //#endregion public methods
}
export function keyframes(name        : string             , items  : CssKeyframes): CssKeyframesRule;
export function keyframes(                                   items  : CssKeyframes):                    readonly [CssKeyframesRule, CssCustomKeyframesRef];
export function keyframes(nameOrItems : string|CssKeyframes, items ?: CssKeyframes): CssKeyframesRule | readonly [CssKeyframesRule, CssCustomKeyframesRef] {
    // first overloading:
    if (typeof(nameOrItems) === 'string') {
        if (items === undefined) throw TypeError();
        
        return atRule(`@keyframes ${nameOrItems}`, createKeyframesRules(items)) as CssKeyframesRule;
    } // if
    
    
    
    // second overloading:
    if (items !== undefined) throw TypeError();
    const keyframesRef = new CssCustomKeyframesRefImpl(null, (value) => {
        (ruleData as unknown as Array<any>)[0] = `@keyframes ${value}`;
    });
    const ruleData : CssRuleData = [
        `@keyframes ${keyframesRef.toString()}`,
        createKeyframesRules(nameOrItems)
    ];
    const keyframesRule = {
        [Symbol()] : ruleData,
    } as CssKeyframesRule;
    return [
        keyframesRule,
        keyframesRef,
    ];
}
const createKeyframesRules = (items: CssKeyframes): CssRuleCollection => Object.fromEntries(
    Object.entries(items)
    .map(([key, frame]): readonly [symbol, CssRuleData] => [
        Symbol(),
        [
            ` ${key}`, // add a single space as PropRule token
            frame
        ]
    ])
) as CssRuleCollection



// rule shortcuts:
export const alwaysRule        = (styles:         CssStyleCollection                              ) => rule('&'                   , styles         );
export const neverRule         = (                                                                ) => rule(null                  , null           );
export const fallbacks         = (styles:         CssStyleCollection                              ) => atRule('@fallbacks'        , styles         );
export const fontFace          = (styles: CssFontFaceStyleCollection                              ) => atRule('@font-face'        , styles         );
export const atGlobal          = (rules :          CssRuleCollection                              ) => atRule('@global'           , rules          );

export const atRoot            = (styles:         CssStyleCollection, options?: CssSelectorOptions) => rule(':root'               , styles, options);
export const ifFirstChild      = (styles:         CssStyleCollection, options?: CssSelectorOptions) => rule(     ':first-child'   , styles, options);
export const ifNotFirstChild   = (styles:         CssStyleCollection, options?: CssSelectorOptions) => rule(':not(:first-child)'  , styles, options);
export const ifLastChild       = (styles:         CssStyleCollection, options?: CssSelectorOptions) => rule(     ':last-child'    , styles, options);
export const ifNotLastChild    = (styles:         CssStyleCollection, options?: CssSelectorOptions) => rule(':not(:last-child)'   , styles, options);
export const ifNthChild        = (step: number, offset: number, styles: CssStyleCollection, options?: CssSelectorOptions): CssRule => {
    if (step === 0) { // no step
        if (offset === 0) return neverRule();                                    // 0th => never match => return empty rule
        
        if (offset === 1) return ifFirstChild(styles, options);                  // 1st
        
        return rule(`:nth-child(${offset})`, styles, options);                   // 2nd, 3rd, 4th, ...
    }
    else if (step === 1) { // 1 step
        if (offset === 0) return rule(`:nth-child(n)`, styles, options);         // always match
        
        return rule(`:nth-child(n+${offset})`, styles, options);
    }
    else { // 2+ steps
        if (offset === 0) return rule(`:nth-child(${step}n)`, styles, options);
        
        return rule(`:nth-child(${step}n+${offset})`, styles, options);
    } // if
};
export const ifNotNthChild     = (step: number, offset: number, styles: CssStyleCollection, options?: CssSelectorOptions): CssRule => {
    if (step === 0) { // no step
        if (offset === 0) return ifNthChild(1, 0, styles, options);              // not 0th => not never match => always match
        
        if (offset === 1) return ifNotFirstChild(styles, options);               // not 1st
        
        return rule(`:not(:nth-child(${offset}))`, styles, options);             // not 2nd, not 3rd, not 4th, not ...
    }
    else if (step === 1) { // 1 step
        if (offset === 0) return neverRule();                                    // never match => return empty rule
        
        return rule(`:not(:nth-child(n+${offset}))`, styles, options);
    }
    else { // 2+ steps
        if (offset === 0) return rule(`:not(:nth-child(${step}n))`, styles, options);
        
        return rule(`:not(:nth-child(${step}n+${offset}))`, styles, options);
    } // if
};
export const ifNthLastChild    = (step: number, offset: number, styles: CssStyleCollection, options?: CssSelectorOptions): CssRule => {
    if (step === 0) { // no step
        if (offset === 0) return neverRule();                                    // 0th => never match => return empty rule
        
        if (offset === 1) return ifLastChild(styles, options);                   // 1st
        
        return rule(`:nth-last-child(${offset})`, styles, options);              // 2nd, 3rd, 4th, ...
    }
    else if (step === 1) { // 1 step
        if (offset === 0) return ifNthChild(1, 0, styles, options);              // always match
        
        return rule(`:nth-last-child(n+${offset})`, styles, options);
    }
    else { // 2+ steps
        if (offset === 0) return rule(`:nth-last-child(${step}n)`, styles, options);
        
        return rule(`:nth-last-child(${step}n+${offset})`, styles, options);
    } // if
};
export const ifNotNthLastChild = (step: number, offset: number, styles: CssStyleCollection, options?: CssSelectorOptions): CssRule => {
    if (step === 0) { // no step
        if (offset === 0) return ifNthChild(1, 0, styles, options);              // not 0th last => not never match => always match
        
        if (offset === 1) return ifNotLastChild(styles, options);                // not 1st last
        
        return rule(`:not(:nth-last-child(${offset}))`, styles, options);        // not 2nd last, not 3rd last, not 4th last, not ... last
    }
    else if (step === 1) { // 1 step
        if (offset === 0) return neverRule();                                    // never match => return empty rule
        
        return rule(`:not(:nth-last-child(n+${offset}))`, styles, options);
    }
    else { // 2+ steps
        if (offset === 0) return rule(`:not(:nth-last-child(${step}n))`, styles, options);
        
        return rule(`:not(:nth-last-child(${step}n+${offset}))`, styles, options);
    } // if
};
export const ifActive          = (styles:         CssStyleCollection, options?: CssSelectorOptions) => rule(     ':active'        , styles, options);
export const ifNotActive       = (styles:         CssStyleCollection, options?: CssSelectorOptions) => rule(':not(:active)'       , styles, options);
export const ifFocus           = (styles:         CssStyleCollection, options?: CssSelectorOptions) => rule(     ':focus'         , styles, options);
export const ifNotFocus        = (styles:         CssStyleCollection, options?: CssSelectorOptions) => rule(':not(:focus)'        , styles, options);
export const ifFocusVisible    = (styles:         CssStyleCollection, options?: CssSelectorOptions) => rule(     ':focus-visible' , styles, options);
export const ifNotFocusVisible = (styles:         CssStyleCollection, options?: CssSelectorOptions) => rule(':not(:focus-visible)', styles, options);
export const ifHover           = (styles:         CssStyleCollection, options?: CssSelectorOptions) => rule(     ':hover'         , styles, options);
export const ifNotHover        = (styles:         CssStyleCollection, options?: CssSelectorOptions) => rule(':not(:hover)'        , styles, options);
export const ifEmpty           = (styles:         CssStyleCollection, options?: CssSelectorOptions) => rule(     ':empty'         , styles, options);
export const ifNotEmpty        = (styles:         CssStyleCollection, options?: CssSelectorOptions) => rule(':not(:empty)'        , styles, options);



// combinators:
export const combinators  = (combinator: Combinator, selectors: CssSelectorCollection, styles: CssStyleCollection, options?: CssSelectorOptions): CssRule => {
    const combiSelectors : CssSelector[] = flat(selectors).filter((selector): selector is CssSelector => !!selector && (selector !== true)).map((selector) => {
        if (selector.includes('&')) return selector; // custom combinator
        
        if (selector.startsWith('::')) return `&${selector}`; // pseudo element => directly attach to the parent_selector
        
        return `&${combinator}${selector}`;
    });
    if (!combiSelectors.length) return neverRule(); // no selector => return empty
    
    
    
    return rule(combiSelectors, styles, options);
};
export const descendants  = (selectors: CssSelectorCollection, styles: CssStyleCollection, options?: CssSelectorOptions) => combinators(' ', selectors, styles, options);
export const children     = (selectors: CssSelectorCollection, styles: CssStyleCollection, options?: CssSelectorOptions) => combinators('>', selectors, styles, options);
export const siblings     = (selectors: CssSelectorCollection, styles: CssStyleCollection, options?: CssSelectorOptions) => combinators('~', selectors, styles, options);
export const nextSiblings = (selectors: CssSelectorCollection, styles: CssStyleCollection, options?: CssSelectorOptions) => combinators('+', selectors, styles, options);



// styles:
/**
 * Defines css properties.
 * @returns A `CssRule` represents the css properties.
 */
export const style   = (style: CssStyle)              => alwaysRule(style);
/**
 * Defines css variables.
 * @returns A `CssRule` represents the css variables.
 */
export const vars    = (items: CssCustomProps)        => alwaysRule(items);
export const imports = (styles: CssStyleCollection[]) => alwaysRule(styles); // force to use an array bracket [] for syntax consistency



// scopes:
/**
 * Defines an additional scoped styleSheet.
 * @returns A `CssScopeEntry` represents a scoped styleSheet.
 */
export const scopeOf     = <TCssScopeName extends CssScopeName>(scopeName: TCssScopeName, styles: CssStyleCollection, options?: CssScopeOptions): CssScopeEntry<TCssScopeName> => [
    scopeName,
    styles,
    options
];
/**
 * Defines the main styleSheet.
 * @returns A `CssScopeEntry` represents a main styleSheet.
 */
export const mainScope   = (styles: CssStyleCollection, options?: CssScopeOptions) => scopeOf('main' , styles, options);
/**
 * Defines an unscoped styleSheet (applied to a whole document).
 * @returns A `CssScopeEntry` represents an unscoped styleSheet.
 */
export const globalScope = (rules :  CssRuleCollection                           ) => scopeOf(''     , rules          );



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
