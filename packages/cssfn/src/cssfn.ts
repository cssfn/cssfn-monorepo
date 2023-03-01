// cssfn:
import type {
    // optionals:
    OptionalOrBoolean,
    
    
    
    // factories:
    MaybeFactory,
    
    
    
    // dictionaries/maps:
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
    isNotFalsySelector,
    isNotFalsyRule,
    normalizeSelectorOptions,
}                           from './utilities.js'



// rules:
/**
 * Defines a conditional style(s) that is applied when the specified `selectors` meets the conditions.
 * @returns A `CssRule` represents a conditional style(s).
 */
export const rule = (selectors: CssSelectorCollection, styles: CssStyleCollection, options?: CssSelectorOptions): CssRule => ({
    // reserved! an empty string key is a special property for storing (nested) rules at rendering phase-1:
    ['' as any] : undefined as any,
    
    [Symbol() ] : [
        [selectors, options],
        styles
    ],
});
/**
 * Defines an @rule.
 * @returns A `CssRule` represents an @rule.
 */
export const atRule = (atRule: `@${string}`, styles: CssStyleCollection): CssRule => ({
    // reserved! an empty string key is a special property for storing (nested) rules at rendering phase-1:
    ['' as any] : undefined as any,
    
    [Symbol() ] : [
        atRule,
        styles
    ],
});



// rule groups:
const selectOptionalRuleFromOptionalRuleOrFactory = (optionalRuleOrFactory: MaybeFactory<OptionalOrBoolean<CssRule>>): OptionalOrBoolean<CssRule> => {
    // conditions:
    if (!optionalRuleOrFactory || (optionalRuleOrFactory === true)) return optionalRuleOrFactory;
    
    
    
    if (typeof(optionalRuleOrFactory) === 'function') return optionalRuleOrFactory();
    return optionalRuleOrFactory;
}
const overwriteSelectorOptions = (selector: undefined|CssRawSelector|CssFinalSelector = '&', newOptions: CssSelectorOptions): CssRawSelector => {
    if (isFinalSelector(selector)) {
        // a CssFinalSelector => just convert to CssRawSelector with additional options:
        return [
            selector,
            newOptions
        ];
    } // if
    
    
    
    // a CssRawSelector => mutate to another CssRawSelector with overriden options:
    const [selectors, oldOptions] = selector;
    
    if (!oldOptions) {
        // no oldOptions => just convert to CssRawSelector with newOptions:
        return [
            selectors,
            newOptions
        ];
    } // if
    
    // mutated CssRawSelector:
    return [
        selectors,
        normalizeSelectorOptions(newOptions, /*defaultOptions: */oldOptions)
    ];
}
function selectRuleEntryWithOptionsFromRuleKey(this: [CssRule, CssSelectorOptions], ruleKey: symbol): readonly [symbol, CssRuleData] {
    const [selector, styles] = this[0][ruleKey];
    const rawSelector        = overwriteSelectorOptions(selector, this[1]);
    
    return [
        ruleKey,
        [rawSelector, styles]
    ];
}
function selectRuleEntriesWithOptionsFromRule(this: CssSelectorOptions, rule: CssRule): (readonly [symbol, CssRuleData])[] {
    return (
        Object.getOwnPropertySymbols(rule)
        .map(selectRuleEntryWithOptionsFromRuleKey, [rule, this])
    );
}
export const rules    = (rules   : CssRuleCollection, options?: CssSelectorOptions): CssRule => {
    const result = (
        flat(rules)
        .map(selectOptionalRuleFromOptionalRuleOrFactory)
        .filter(isNotFalsyRule)
    );
    if (!options) { // no options => no further mutate, just merge them
        switch(result.length) {
            case 0:
                return neverRule();     // empty rule => nothing to merge => just return a `neverRule` (an empty object)
            case 1:
                return result[0];       // only singular CssRule object => nothing to merge => just return it
            default:
                return Object.assign({
                    // reserved! an empty string key is a special property for storing (nested) rules at rendering phase-1:
                    ['' as any] : undefined as any,
                }, ...result);          // merge multiple CssRule objects to single CssRule object (merges the symbol props)
        } // switch
    } // if
    
    
    
    return Object.fromEntries([
        // reserved! an empty string key is a special property for storing (nested) rules at rendering phase-1:
        [ '' , undefined ],
        
        ...result.flatMap(selectRuleEntriesWithOptionsFromRule, options)
    ]);
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
const globalAutoKeyframesIdRegistry = new Map<CssCustomKeyframesRefImpl, string>();
class CssCustomKeyframesRefImpl implements CssCustomKeyframesRef {
    //#region private properties
    private _value         : string|null;
    private _onValueChange : (value: string) => void
    //#endregion private properties
    
    
    
    //#region constructors
    constructor(value: string|null, onValueChange: (value: string) => void) {
        this._value = value || null; // non_empty_string or null
        this._onValueChange = onValueChange;
    }
    //#endregion constructors
    
    
    
    //#region public properties
    get value(): string|null {
        return this._value;
    }
    set value(value: string|null) {
        const newValue = value || null; // non_empty_string or null
        if (this._value === newValue) return;
        this._value = newValue;
        
        
        
        this._onValueChange(this.toString());
    }
    //#endregion public properties
    
    
    
    //#region public methods
    toString(): string {
        const staticValue = this._value;
        if (staticValue) return staticValue;
        
        
        
        let autoValue = globalAutoKeyframesIdRegistry.get(this);
        if (autoValue) return autoValue;
        
        
        
        /*
            The `autoValue` may increase on the first call of `keyframes() => toString()`.
            In practice, the `keyframes()` is always be called inside the callback initiator of `cssConfig(() => { })`, in which the `cssConfig()` is always be called on *top-level-module*.
            So, when the (component) modules are RE_LOADED, the `cssVars()` WON'T be re-called.
            So, the MEMORY_LEAK is NEVER occured.
        */
        /*
            In a rare cases, the `keyframes()` may be called inside the callback of `[dynamic]StyleSheet[s]()`.
            When the corresponding components are RE_MOUNTED, the styleSheet may be re-created and the `autoValue` increases.
            So, the MEMORY_LEAK is OCCURED but in SLOWLY_RATE at client_side.
            At server_side, the interaction of components are NEVER_HAPPENED, so the MEMORY_LEAK is NEVER occured.
        */
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
        // reserved! an empty string key is a special property for storing (nested) rules at rendering phase-1:
        ['' as any] : undefined as any,
        
        [Symbol() ] : ruleData,
    } as CssKeyframesRule;
    return [
        keyframesRule,
        keyframesRef,
    ];
}
const selectCssRuleEntryFromCssKeyframesEntry = ([key, frame]: readonly [string, CssStyleCollection]): readonly [symbol, CssRuleData] => [
    Symbol(),
    [
        ` ${key}`, // add a single space as PropRule token
        frame
    ]
];
const createKeyframesRules = (items: CssKeyframes): CssRuleCollection => Object.fromEntries([
    // reserved! an empty string key is a special property for storing (nested) rules at rendering phase-1:
    [ '' , undefined ],
    
    ...Object.entries(items)
    .map(selectCssRuleEntryFromCssKeyframesEntry)
]) as CssRuleCollection



// rule shortcuts:
// export const alwaysRule       = (styles:         CssStyleCollection                              ) => rule('&'                   , styles         );
export const alwaysRule        = (styles:         CssStyleCollection                              ) => ({
    // reserved! an empty string key is a special property for storing (nested) rules at rendering phase-1:
    ['' as any] : undefined as any,
    
    [Symbol() ] : [/*'&'*/ /* empty */, styles]
}) as CssRule; // a bit faster
// export const neverRule         = (                                                                ) => rule(null                  , null           );
const neverRuleCache           : CssRule = {
    // reserved! an empty string key is a special property for storing (nested) rules at rendering phase-1:
    ['' as any] : undefined as any,
    
    /* empty object */
};
Object.freeze(neverRuleCache);
export const neverRule         = (                                                                ) => neverRuleCache; // a bit faster
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
function selectSelectorWithCombinatorFromOptionalSelector(this: Combinator, selector: OptionalOrBoolean<CssSelector>): OptionalOrBoolean<CssSelector> {
    if (!isNotFalsySelector(selector)) return selector;
    
    
    
    if (selector.includes('&')) return selector; // custom combinator
    
    if (selector.startsWith('::')) return `&${selector}`; // pseudo element => directly attach to the parent_selector
    
    return `&${this}${selector}`;
};
export const combinators  = (combinator: Combinator, selectors: CssSelectorCollection, styles: CssStyleCollection, options?: CssSelectorOptions): CssRule => {
    const combiSelectors : CssSelectorCollection = (
        !Array.isArray(selectors)
        ?
        selectSelectorWithCombinatorFromOptionalSelector.call(combinator, selectors)
        :
        flat(selectors).map(
            selectSelectorWithCombinatorFromOptionalSelector,
            combinator
        )
    );
    
    
    
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
/**
 * @deprecated use spread operator instead.
 */
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
    return condition ? content : (neverRule() as TCssStyle);
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
