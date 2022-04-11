// cssfn:
import type {
    OptionalOrBoolean,
    SingleOrArray,
    SingleOrDeepArray,
}                           from '@cssfn/types'       // cssfn's types



// types:

export type ParentSelectorToken        = '&'
export type UniversalSelectorToken     = '*'
export type UnnamedSelectorToken       = ParentSelectorToken | UniversalSelectorToken

export type AttrSelectorToken          = '['

export type ElementSelectorToken       = ''
export type IdSelectorToken            = '#'
export type ClassSelectorToken         = '.'
export type PseudoClassSelectorToken   = ':'
export type PseudoElementSelectorToken = '::'
export type NamedSelectorToken         = ElementSelectorToken | IdSelectorToken | ClassSelectorToken | PseudoClassSelectorToken | PseudoElementSelectorToken

export type SelectorToken              = UnnamedSelectorToken | AttrSelectorToken | NamedSelectorToken
export type SelectorName               = string & {}

export type AttrSelectorName           = string & {}
export type AttrSelectorOperator       = '=' | '~=' | '|=' | '^=' | '$=' | '*='
export type AttrSelectorValue          = string & {}
export type AttrSelectorOptions        = 'i' | 'I' | 's' | 'S'
export type AttrSelectorParams         = | readonly [AttrSelectorName                                                              ]
                                         | readonly [AttrSelectorName, AttrSelectorOperator, AttrSelectorValue                     ]
                                         | readonly [AttrSelectorName, AttrSelectorOperator, AttrSelectorValue, AttrSelectorOptions]

export type WildParams                 = string & {}
export type SelectorParams             = AttrSelectorParams | SelectorGroup | WildParams
export type PseudoClassSelectorParams  = Exclude<SelectorParams, AttrSelectorParams>


export type ParentSelector             =   readonly [ ParentSelectorToken               /* no_name */  /* no_param */            ]
export type UniversalSelector          =   readonly [ UniversalSelectorToken            /* no_name */  /* no_param */            ]
export type UnnamedSelector            =   ParentSelector | UniversalSelector

export type AttrSelector               =   readonly [ AttrSelectorToken          , null /* no_name */, AttrSelectorParams        ]

export type ElementSelector            =   readonly [ ElementSelectorToken       , SelectorName        /* no_param */            ]
export type IdSelector                 =   readonly [ IdSelectorToken            , SelectorName        /* no_param */            ]
export type ClassSelector              =   readonly [ ClassSelectorToken         , SelectorName        /* no_param */            ]
export type PseudoClassSelector        = | readonly [ PseudoClassSelectorToken   , SelectorName        /* no_param */            ]
                                         | readonly [ PseudoClassSelectorToken   , SelectorName      , PseudoClassSelectorParams ]
export type PseudoElementSelector      =   readonly [ PseudoElementSelectorToken , SelectorName        /* no_param */            ]
export type NamedSelector              =   ElementSelector | IdSelector | ClassSelector | PseudoClassSelector | PseudoElementSelector

export type SimpleSelector             = | UnnamedSelector
                                         | AttrSelector
                                         | NamedSelector


export type DescendantCombinator       = ' '
export type ChildCombinator            = '>'
export type SiblingCombinator          = '~'
export type NextSiblingCombinator      = '+'
export type Combinator                 = DescendantCombinator | ChildCombinator | SiblingCombinator | NextSiblingCombinator

export type SelectorEntry              = SimpleSelector | Combinator
export type Selector                   = OptionalOrBoolean<SelectorEntry>[]
export type SelectorGroup              = OptionalOrBoolean<Selector>[]

export type PureSelector               = SelectorEntry[]
export type PureSelectorGroup          = Selector[]



const whitespaceList                   = [' ', '\n', '\r', '\t', '\f', '\v'];
const specialPseudoClassList           = ['is', 'not', 'where', 'has'];
const combinatorList                   = [' ', '>', '~', '+'];



// parses:
export const parseSelectors = (expressions: SingleOrDeepArray<OptionalOrBoolean<string>>): SelectorGroup|null => {
    const expression = [expressions].flat(Infinity).filter((exp) => !!exp && (exp !== true)).join(',');
    const expressionLength = expression.length;
    let pos = 0;
    
    
    
    const isEof = (): boolean => {
        return (pos >= expressionLength);
    };
    const isWhitespace = (): boolean => {
        return whitespaceList.includes(expression[pos]);
    }
    const skipWhitespace = (): void => {
        while (!isEof() && whitespaceList.includes(expression[pos])) pos++;
    };
    
    const parseSelectorToken = (): SelectorToken|null => {
        const char = expression[pos];
        switch (char) {
            case '&': // ParentSelectorToken
            case '*': // UniversalSelectorToken
            case '[': // AttrSelectorToken
            case '#': // IdSelectorToken
            case '.': // ClassSelectorToken
                pos++; return char;
            
            case ':':
                pos++;
                if (expression[pos] === ':') { pos++; return '::'; } // PseudoElementSelectorToken
                return ':'; // PseudoClassSelectorToken
            
            default:
                if (isValidIdentifierChar()) return ''; // ElementSelectorToken
                return null; // unknown expression => return null
        } // switch
    };
    const isValidIdentifierChar = (): boolean => {
        const char = expression[pos];
        
        /*
            using regex is easier, but the performance is slow
        */
        // return /[\w0-9-_]/.test(char);
        
        /*
            using hard coded is more complex, but the performance is about 10-12x faster
        */
        if ((char >= 'a') && (char <= 'z')) return true;
        if ((char >= 'A') && (char <= 'Z')) return true;
        if ((char >= '0') && (char <= '9')) return true;
        if (char === '-') return true;
        if (char === '_') return true;
        return false;
    };
    const parseIdentifierName = (): string|null => {
        const originPos = pos;
        
        while (!isEof() && isValidIdentifierChar()) pos++; // move forward until invalid
        if (pos === originPos) return null; // pos was not moved => nothing to parse => no changes made & return null
        
        return expression.slice(originPos, pos);
    };
    const parseSimpleSelector = (): SimpleSelector|null => {
        const originPos = pos;
        
        const token = parseSelectorToken();
        if (token === null) return null; // syntax error: missing token => no changes made & return null
        
        if ((token === '&') || (token === '*')) { // UnnamedSelectorToken
            return [
                token,
            ];
        }
        else if (token === '[') { // AttrSelectorToken
            const attrSelectorParams = parseAttrSelectorParams();
            if (!attrSelectorParams) { pos = originPos; return null; } // syntax error: missing attrSelectorParams => revert changes & return null
            
            return [
                token,
                null,
                attrSelectorParams,
            ];
        }
        else { // NamedSelectorToken
            const name = parseIdentifierName();
            if (!name) { pos = originPos; return null; } // syntax error: missing name => revert changes & return null
            
            if (token !== ':') { // NonParamSelector
                return [
                    token,
                    name,
                ];
            }
            else { // PseudoClassSelectorToken
                if (specialPseudoClassList.includes(name)) {
                    const selectorParams = parseSelectorParams();
                    if (!selectorParams) { pos = originPos; return null; } // syntax error: missing selectorParams => revert changes & return null
                    return [
                        token,
                        name,
                        selectorParams,
                    ];
                }
                else {
                    const wildParams = parseWildParams();
                    if (wildParams === null) {
                        return [
                            token,
                            name,
                        ];
                    }
                    else {
                        return [
                            token,
                            name,
                            wildParams,
                        ];
                    } // if
                } // if
            } // if
        } // if
    };
    const parseCombinator = (): Combinator|null => {
        const originPos = pos;
        
        skipWhitespace();
        
        const char = expression[pos];
        switch (char) {
            case '>': // ChildCombinator
            case '~': // SiblingCombinator
            case '+': // NextSiblingCombinator
                pos++; return char;
            
            default:
            if (pos > originPos) { // previously had whitespace
                const currentPos = pos;            // 1. backup
                const test = parseSelectorToken(); // 2. destructive test
                pos = currentPos;                  // 3. restore
                
                if (test !== null) return ' '; // DescendantCombinator
            } // if
            return null; // unknown expression => return null
        } // switch
    };
    const parseSelector = (): Selector|null => {
        const originPos = pos;
        
        const selector : Selector = [];
        
        while (!isEof()) {
            // skipWhitespace(); // already included in `parseCombinator()`, do not `skipWhitespace()` here => causing DescendantCombinator (space) unrecognized
            
            if (selector.length) {
                // the next SelectorSequence must be separated by combinator:
                const combinator = parseCombinator();
                if (!combinator) break; // no more next SelectorSequence
                selector.push(combinator);
            } // if
            
            skipWhitespace();
            
            const simpleSelector = parseSimpleSelector();
            if (!simpleSelector) { pos = originPos; return null; } // syntax error: missing simpleSelector => revert changes & return null
            selector.push(simpleSelector);
            
            //#region SelectorSequence
            let nextSequence : SimpleSelector|null;
            do {
                nextSequence = parseSimpleSelector();
                if (nextSequence) selector.push(nextSequence);
            }
            while(nextSequence);
            //#endregion SelectorSequence
        } // while
        
        if (!selector.length) { pos = originPos; return null; }; // syntax error: no any simpleSelector => revert changes & return null
        return selector;
    };
    
    const eatComma = (): boolean => {
        if (expression[pos] !== ',') return false;
        pos++; return true; // move forward & return true
    };
    const eatOpeningBracket = (): boolean => {
        if (expression[pos] !== '(') return false;
        pos++; return true; // move forward & return true
    };
    const eatClosingBracket = (): boolean => {
        if (expression[pos] !== ')') return false;
        pos++; return true; // move forward & return true
    };
    const eatClosingSquareBracket = (): boolean => {
        if (expression[pos] !== ']') return false;
        pos++; return true; // move forward & return true
    };
    const eatNonBracketsOrSpaces = (): boolean => {
        const originPos = pos;
        
        while (!isEof() && !isWhitespace() && (expression[pos] !== '(') && (expression[pos] !== ')')) pos++; // move forward until unmatch
        if (pos === originPos) return false; // pos was not moved => nothing to eat => no changes made & return false
        
        return true;
    };
    const parseSelectors = (): SelectorGroup|null => {
        const originPos = pos;
        
        const selectors : SelectorGroup = [];
        
        while (!isEof()) {
            skipWhitespace();
            
            if (selectors.length) {
                // the next Selector must be separated by comma:
                if (!eatComma()) break; // no more next Selector
                
                skipWhitespace();
            } // if
            
            const selector = parseSelector();
            if (!selector) { pos = originPos; return null; } // syntax error: missing selector => revert changes & return null
            selectors.push(selector);
        } // while
        
        if (!selectors.length) { pos = originPos; return null; }; // syntax error: no any selector => revert changes & return null
        return selectors;
    };
    const parseWildParams = (): WildParams|null => {
        const originPos = pos;
        
        if (!eatOpeningBracket()) return null; // syntax error: missing `(` => no changes made & return null
        skipWhitespace();
        
        const taken : string[] = [];
        while (!isEof()) {
            //#region eat non_nested value
            const startPos = pos;
            let eaten = eatNonBracketsOrSpaces();
            if (eaten) {
                const endPos = pos;
                taken.push(
                    expression.slice(startPos, endPos)
                );
                
                skipWhitespace();
            } // if
            //#endregion eat non_nested value
            
            // -or- //
            
            //#region eat nested value
            const nestedWildParams = parseWildParams();
            if (nestedWildParams !== null) {
                eaten = true;
                
                taken.push(
                    '(',
                    nestedWildParams,
                    ')'
                );
                
                skipWhitespace();
            } // if
            //#endregion eat nested value
            
            
            
            if (!eaten) break; // nothing more to eat => break
        } // while
        
        skipWhitespace();
        if (!eatClosingBracket()) { pos = originPos; return null; } // syntax error: missing `)` => revert changes & return null
        
        return taken.join('');
    };
    const parseSelectorParams = (): SelectorGroup|null => {
        const originPos = pos;
        
        if (!eatOpeningBracket()) return null; // syntax error: missing `(` => no changes made & return null
        
        const selectors = parseSelectors();
        if (!selectors) { pos = originPos; return null; } // syntax error: missing selectors => revert changes & return null
        
        if (!eatClosingBracket()) { pos = originPos; return null; } // syntax error: missing `)` => revert changes & return null
        
        return selectors;
    };
    const parseAttrSelectorOperator = (): AttrSelectorOperator|null => {
        const originPos = pos;
        
        const char = expression[pos];
        switch (char) {
            case '=': // ExactOperator
                pos++; return char;
            
            case '~': // SpaceSeparatedOperator
            case '|': // SubsOperator
            case '^': // BeginsWithOperator
            case '$': // EndsWithOperator
            case '*': // IncludesOperator
                pos++;
                if (expression[pos] !== '=') { pos = originPos; return null; } // syntax error: missing `=` => revert changes & return null
                pos++;
                return `${char}=`;
            
            default:
                return null; // unknown expression => return null
        } // switch
    };
    const parseAttrSelectorOptions = (): AttrSelectorOptions|null => {
        const char = expression[pos];
        switch (char) {
            case 'i': // case-insensitively
            case 'I': // case-insensitively
            case 's': // case-sensitively
            case 'S': // case-sensitively
                pos++; return char;
            
            default:
                return null; // unknown expression => return null
        } // switch
    };
    const parseNudeString = (): string|null => {
        return parseIdentifierName();
    };
    const eatQuote = (quoteChar: "'" | '"'): boolean => {
        if (expression[pos] !== quoteChar) return false;
        pos++; return true; // move forward & return true
    };
    const isValidStringChar = (quoteChar: "'" | '"'): boolean => {
        const char = expression[pos];
        if (char === quoteChar) {
            return ((pos >= 1) && (expression[pos - 1] === '\\')); // looking backward escape char
        }
        else if (char === '\\') {
            return ((pos + 1) < expressionLength); // looking forward has any char
        }
        else {
            return true; // any chars other than quoteChar & backwardChar
        } // if
    };
    const parseQuoteString = (quoteChar: "'" | '"'): string|null => {
        const originPos = pos;
        
        if (!eatQuote(quoteChar)) return null; // syntax error: missing opening_quoteChar => no changes made & return null
        
        while (!isEof() && isValidStringChar(quoteChar)) pos++; // move forward until invalid
        
        if (!eatQuote(quoteChar)) { pos = originPos; return null; } // syntax error: missing closing_quoteChar => revert changes & return null
        
        const value = expression.slice(originPos + 1, pos - 1); // excludes the opening_quoteChar & closing_quoteChar
        if (quoteChar === "'") { // single quoteChar
            return value.replace(/(?<!\\)"/g, '\\"'); // escape the unescaped double quoteChar, so both single & double quoteChar are escaped
        }
        else { // double quoteChar
            return value.replace(/(?<!\\)'/g, "\\'"); // escape the unescaped single quoteChar, so both single & double quoteChar are escaped
        } // if
    };
    const parseString = (): string|null => {
        return (
            parseQuoteString("'")
            ??
            parseQuoteString('"')
            ??
            parseNudeString()
        );
    };
    const parseAttrSelectorParams = (): AttrSelectorParams|null => {
        const originPos = pos;
        
        // if (!eatOpeningSquareBracket()) return null; // already eaten by `parseSelectorToken()`
        
        skipWhitespace();
        
        const name = parseIdentifierName();
        if (!name) { pos = originPos; return null; } // syntax error: missing name => revert changes & return null
        
        skipWhitespace();
        
        const operator = parseAttrSelectorOperator();
        if (!operator) { // name only
            if (!eatClosingSquareBracket()) { pos = originPos; return null; } // syntax error: missing `]` => revert changes & return null
            
            return [
                name,
            ];
        }
        else { // name=value
            skipWhitespace();
            
            const value = parseString();
            // an empty value "" -or- '' is possible
            if (value === null) { pos = originPos; return null; } // syntax error: missing value => revert changes & return null
            
            skipWhitespace();
            
            const options = parseAttrSelectorOptions();
            if (options) {
                skipWhitespace();
            } // if
            
            if (!eatClosingSquareBracket()) { pos = originPos; return null; } // syntax error: missing `]` => revert changes & return null
            
            if (!options) { // name=value without options
                return [
                    name,
                    operator,
                    value,
                ];
            }
            else { // name=value options
                return [
                    name,
                    operator,
                    value,
                    options,
                ];
            } // if
        } // if
    };
    
    
    
    const allSelectors = parseSelectors();
    skipWhitespace();
    if (!allSelectors) {
        if (isEof()) return []; // empty selector
        return null;            // syntax error: not all expression are valid selector
    } // if
    if (!isEof()) return null;  // syntax error: not all expression are valid selector
    return allSelectors;
};



// tests:

// SelectorParams tests:
export const isWildParams         = (selectorParams: SelectorParams): selectorParams is WildParams => {
    return (typeof(selectorParams) === 'string');
};
export const isAttrSelectorParams = (selectorParams: SelectorParams): selectorParams is AttrSelectorParams => {
    return (
        !isWildParams(selectorParams)
        &&
        /*
            AttrSelectorParams : readonly array : [ AttrSelectorName, AttrSelectorOperator, AttrSelectorValue, AttrSelectorOptions ]
            SelectorGroup      : mutable  array : [ undefined|null|false|true...Selector...Selector...[undefined|null|false|true...SimpleSelector|Combinator]... ]
            
            [0]                : AttrSelectorName | undefined|null|false|true | Selector
            [0]                : -----string----- | ---------others---------- | -array--
        */
        (typeof(selectorParams[0]) === 'string') // AttrSelectorParams : the first element (AttrSelectorName) must be a string
    );
};
export const isSelectors          = (selectorParams: SelectorParams): selectorParams is SelectorGroup => {
    return (
        !isWildParams(selectorParams)
        &&
        /*
            AttrSelectorParams : readonly array : [ AttrSelectorName, AttrSelectorOperator, AttrSelectorValue, AttrSelectorOptions ]
            SelectorGroup      : mutable  array : [ undefined|null|false|true...Selector...Selector...[undefined|null|false|true...SimpleSelector|Combinator]... ]
            
            [0]                : AttrSelectorName | undefined|null|false|true | Selector
            [0]                : -----string----- | ---------others---------- | -array--
        */
        (typeof(selectorParams[0]) !== 'string') // SelectorGroup : the first element (Selector) must be a NON-string (an array) or undefined|null|false|true
    );
};

// SelectorEntry creates & tests:
export const parentSelector                      = (): ParentSelector                                => [ '&'    /* no_name */  /* no_param */ ];
export const universalSelector                   = (): UniversalSelector                             => [ '*'    /* no_name */  /* no_param */ ];
const requiredName = (name: AttrSelectorName|SelectorName): true => { if (!name) throw Error('The `name` cannot be empty.'); return true; };
export const attrSelector                        = (name: AttrSelectorName, operator?: AttrSelectorOperator, value?: AttrSelectorValue, options?: AttrSelectorOptions): AttrSelector => {
    requiredName(name);
    
    if (operator) {
        if (value !== undefined) { // value might be an empty string '', so `undefined` is used for comparison
            if (options) {
                return [
                    '[',          // AttrSelectorToken
                    null,         // no_SelectorName
                    [             // AttrSelectorParams
                        name,     // AttrSelectorName
                        operator, // AttrSelectorOperator
                        value,    // AttrSelectorValue
                        options,  // AttrSelectorOptions
                    ],
                ];
            }
            else {
                return [
                    '[',          // AttrSelectorToken
                    null,         // no_SelectorName
                    [             // AttrSelectorParams
                        name,     // AttrSelectorName
                        operator, // AttrSelectorOperator
                        value,    // AttrSelectorValue
                    ],
                ];
            } // options
        } // if
        
        throw Error('The `value` must be provided if the `operator` defined.');
    }
    else {
        return [
            '[',      // AttrSelectorToken
            null,     // no_SelectorName
            [         // AttrSelectorParams
                name, // AttrSelectorName
            ],
        ];
    } // if operator
};
export const elementSelector                     = (elmName   : SelectorName): ElementSelector       => requiredName(elmName  ) && [ ''   , elmName        /* no_param */ ];
export const idSelector                          = (id        : SelectorName): IdSelector            => requiredName(id       ) && [ '#'  , id             /* no_param */ ];
export const classSelector                       = (className : SelectorName): ClassSelector         => requiredName(className) && [ '.'  , className      /* no_param */ ];
export const pseudoClassSelector                 = (className : SelectorName, params?: PseudoClassSelectorParams): PseudoClassSelector => {
    requiredName(className);
    
    if (params !== undefined) { // value might be an empty string '', so `undefined` is used for comparison
        return [
            ':',       // PseudoClassSelectorToken
            className, // SelectorName
            params,    // PseudoClassSelectorParams
        ];
    }
    else {
        return [
            ':',       // PseudoClassSelectorToken
            className, // SelectorName
        ];
    } // if
};
export const pseudoElementSelector               = (elmName   : SelectorName): PseudoElementSelector => requiredName(elmName  ) && [ '::' , elmName        /* no_param */ ];
//#region aliases
export const [
    createParentSelector,
    createUniversalSelector,
    createAttrSelector,
    createElementSelector,
    createIdSelector,
    createClassSelector,
    createPseudoClassSelector,
    createPseudoElementSelector,
] = [
    parentSelector,
    universalSelector,
    attrSelector,
    elementSelector,
    idSelector,
    classSelector,
    pseudoClassSelector,
    pseudoElementSelector,
];
//#endregion aliases

export const isSimpleSelector                    = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is SimpleSelector                          => !!selectorEntry && (selectorEntry !== true) && (typeof(selectorEntry) !== 'string');
export const isParentSelector                    = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is ParentSelector                          => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === '&' );
export const isUniversalSelector                 = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is UniversalSelector                       => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === '*' );
export const isAttrSelector                      = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is AttrSelector                            => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === '[' );
export const isElementSelector                   = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is ElementSelector                         => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === ''  );
export const isIdSelector                        = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is IdSelector                              => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === '#' );
export const isClassSelector                     = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is ClassSelector                           => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === '.' );
export const isPseudoClassSelector               = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is PseudoClassSelector                     => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === ':' );
export const isClassOrPseudoClassSelector        = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is ClassSelector | PseudoClassSelector     => isSimpleSelector(selectorEntry) && ['.', ':'].includes(selectorEntry?.[0]);
export const isPseudoElementSelector             = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is PseudoElementSelector                   => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === '::');
export const isElementOrPseudoElementSelector    = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is ElementSelector | PseudoElementSelector => isSimpleSelector(selectorEntry) && ['', '::'].includes(selectorEntry?.[0]);

export const isNotSimpleSelector                 = (selectorEntry: OptionalOrBoolean<SelectorEntry>) => !isSimpleSelector(selectorEntry);
export const isNotParentSelector                 = (selectorEntry: OptionalOrBoolean<SelectorEntry>) => !isParentSelector(selectorEntry);
export const isNotUniversalSelector              = (selectorEntry: OptionalOrBoolean<SelectorEntry>) => !isUniversalSelector(selectorEntry);
export const isNotAttrSelector                   = (selectorEntry: OptionalOrBoolean<SelectorEntry>) => !isAttrSelector(selectorEntry);
export const isNotElementSelector                = (selectorEntry: OptionalOrBoolean<SelectorEntry>) => !isElementSelector(selectorEntry);
export const isNotIdSelector                     = (selectorEntry: OptionalOrBoolean<SelectorEntry>) => !isIdSelector(selectorEntry);
export const isNotClassSelector                  = (selectorEntry: OptionalOrBoolean<SelectorEntry>) => !isClassSelector(selectorEntry);
export const isNotPseudoClassSelector            = (selectorEntry: OptionalOrBoolean<SelectorEntry>) => !isPseudoClassSelector(selectorEntry);
export const isNotClassOrPseudoClassSelector     = (selectorEntry: OptionalOrBoolean<SelectorEntry>) => !isClassOrPseudoClassSelector(selectorEntry);
export const isNotPseudoElementSelector          = (selectorEntry: OptionalOrBoolean<SelectorEntry>) => !isPseudoElementSelector(selectorEntry);
export const isNotElementOrPseudoElementSelector = (selectorEntry: OptionalOrBoolean<SelectorEntry>) => !isElementOrPseudoElementSelector(selectorEntry);

export const isAttrSelectorOf                    = (selectorEntry: OptionalOrBoolean<SelectorEntry>, attrName  : SingleOrArray<string>)     : boolean => isAttrSelector(selectorEntry)                   && [attrName  ].flat().includes(selectorEntry?.[2]?.[0]); // [ '['     , null      , [ attrName , op , value , opt ] ]
export const isElementSelectorOf                 = (selectorEntry: OptionalOrBoolean<SelectorEntry>, elmName   : SingleOrArray<string>)     : boolean => isElementSelector(selectorEntry)                && [elmName   ].flat().includes(selectorEntry?.[1]);      // [ ''      , elmName   ]
export const isIdSelectorOf                      = (selectorEntry: OptionalOrBoolean<SelectorEntry>, id        : SingleOrArray<string>)     : boolean => isIdSelector(selectorEntry)                     && [id        ].flat().includes(selectorEntry?.[1]);      // [ '#'     , id        ]
export const isClassSelectorOf                   = (selectorEntry: OptionalOrBoolean<SelectorEntry>, className : SingleOrArray<string>)     : boolean => isClassSelector(selectorEntry)                  && [className ].flat().includes(selectorEntry?.[1]);      // [ '.'     , className ]
export const isPseudoClassSelectorOf             = (selectorEntry: OptionalOrBoolean<SelectorEntry>, className : SingleOrArray<string>)     : boolean => isPseudoClassSelector(selectorEntry)            && [className ].flat().includes(selectorEntry?.[1]);      // [ ':'     , className ]
export const isClassOrPseudoClassSelectorOf      = (selectorEntry: OptionalOrBoolean<SelectorEntry>, className : SingleOrArray<string>)     : boolean => isClassOrPseudoClassSelector(selectorEntry)     && [className ].flat().includes(selectorEntry?.[1]);      // [ '.'|':' , className ]
export const isPseudoElementSelectorOf           = (selectorEntry: OptionalOrBoolean<SelectorEntry>, elmName   : SingleOrArray<string>)     : boolean => isPseudoElementSelector(selectorEntry)          && [elmName   ].flat().includes(selectorEntry?.[1]);      // [ '::'    , elmName   ]
export const isElementOrPseudoElementSelectorOf  = (selectorEntry: OptionalOrBoolean<SelectorEntry>, elmName   : SingleOrArray<string>)     : boolean => isElementOrPseudoElementSelector(selectorEntry) && [elmName   ].flat().includes(selectorEntry?.[1]);      // [ ''|'::' , elmName   ]

export const combinator = (combinator: Combinator): Combinator => combinator;
//#region aliases
export const [
    createCombinator,
] = [
    combinator,
];
//#endregion aliases

export const isCombinator                        = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is Combinator => (typeof(selectorEntry) === 'string');
export const isCombinatorOf                      = (selectorEntry: OptionalOrBoolean<SelectorEntry>, combinator: SingleOrArray<Combinator>) : boolean => isCombinator(selectorEntry)                     && [combinator].flat().includes(selectorEntry);

// SimpleSelector & Selector creates & tests:
export const selector          = <TSelector          extends Selector          = Selector         >(...selectorEntries : TSelector         ): TSelector          => selectorEntries;
export const pureSelector      = <TPureSelector      extends PureSelector      = PureSelector     >(...selectorEntries : TPureSelector     ): TPureSelector      => selectorEntries;
export const selectorGroup     = <TSelectorGroup     extends SelectorGroup     = SelectorGroup    >(...selectors       : TSelectorGroup    ): TSelectorGroup     => selectors;
export const pureSelectorGroup = <TPureSelectorGroup extends PureSelectorGroup = PureSelectorGroup>(...selectors       : TPureSelectorGroup): TPureSelectorGroup => selectors;
//#region aliases
export const [
    createSelector,
    createPureSelector,
    
    createSelectorGroup,
    createPureSelectorGroup,
] = [
    selector,
    pureSelector,
    
    selectorGroup,
    pureSelectorGroup,
];
//#endregion aliases

export const isNotEmptySelectorEntry = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is SelectorEntry => {
    /*
        SimpleSelector : [ SelectorToken, SelectorName, SelectorParams ]
        Combinator     : non_empty string
    */
   return !!selectorEntry && (selectorEntry !== true);
}
export const isSelector = (test: OptionalOrBoolean<SimpleSelector|Selector>): test is Selector => {
    /*
        SimpleSelector : [ SelectorToken, SelectorName, SelectorParams ]
        Selector       : [ SimpleSelector...(SimpleSelector|Combinator)... ]
    */
    return !!test && (test !== true) && ((typeof(test[0]) !== 'string') || combinatorList.includes(test[0])); // Selector : the first element (SelectorEntry) must be a NON-string (an array) -or- a string of Combinator
};
export const isNotEmptySelector   = (selector  : OptionalOrBoolean<Selector     >): selector  is PureSelector      =>  !!selector  && (selector  !== true) &&  selector.some(  isNotEmptySelectorEntry);
export const isNotEmptySelectors  = (selectors : OptionalOrBoolean<SelectorGroup>): selectors is PureSelectorGroup =>  !!selectors && (selectors !== true) && selectors.some(  isNotEmptySelector     );
export const countSelectorEntries = (selector  : OptionalOrBoolean<Selector     >): number                         => (!!selector  && (selector  !== true) &&  selector.filter(isNotEmptySelectorEntry).length) || 0;
export const countSelectors       = (selectors : OptionalOrBoolean<SelectorGroup>): number                         => (!!selectors && (selectors !== true) && selectors.filter(isNotEmptySelector     ).length) || 0;



// renders:
export const selectorParamsToString = (selectorParams: OptionalOrBoolean<SelectorParams>): string => {
    if ((!selectorParams || (selectorParams === true)) && (selectorParams !== '')) return ''; // filter out undefined|null|false|true
    // note: an empty string (selectorParams === '') is considered a valid WildParams
    
    if (isWildParams(selectorParams)) {
        return `(${selectorParams})`;
    }
    else if (isAttrSelectorParams(selectorParams)) {
        const [
            name,
            operator,
            value,
            options,
        ] = selectorParams;
        
        if (options) {
            return `[${name}${operator}"${value}" ${options}]`;
        }
        else if (value !== undefined) { // an empty value "" -or- '' is possible
            return `[${name}${operator}"${value}"]`;
        }
        else {
            return `[${name}]`;
        } // if
    }
    else { // if (isSelectors(selectorParams)) {
        return `(${selectorsToString(selectorParams)})`;
    } // if
};
export const selectorToString       = (selector: Selector): string => {
    return (
        selector
        .filter(isNotEmptySelectorEntry) // remove empty SelectorEntry(es) in Selector
        .map((selectorEntry): string => {
            if (isSimpleSelector(selectorEntry)) {
                const [
                    selectorToken,
                    selectorName,
                    selectorParams,
                ] = selectorEntry;
                
                if (selectorToken === '[') { // AttrSelectorToken
                    return selectorParamsToString(selectorParams);
                }
                else {
                    return `${selectorToken}${selectorName ?? ''}${selectorParamsToString(selectorParams)}`;
                } // if
            } // if SimpleSelector
            
            
            
            return selectorEntry;
        })
        .join('')
    );
};
export const selectorsToString      = (selectors: SelectorGroup): string => {
    return (
        selectors
        .filter(isNotEmptySelector) // remove empty Selector(s) in SelectorGroup, we don't want to join some rendered empty string '' => `.boo , , #foo`
        .map(selectorToString)
        .join(', ')
    );
};



// transforms:
export type MapSelectorsCallback = (selector: SimpleSelector) => OptionalOrBoolean<SimpleSelector|Selector>
/**
 * Creates a new `SelectorGroup` populated with the results of calling a provided `callbackFn` on every `SimpleSelector` in the `selectors`.  
 * The nested `SimpleSelector` (if any) will also be passed to `callbackFn`.  
 * The `Combinator` and its nested (if any) will not be passed to `callbackFn`.
 * @param selectors The input `SelectorGroup`.
 * @param callbackFn A function that is called for every `SimpleSelector` in the `selectors`.  
 * Each time `callbackFn` executes, the returned value is added to the output `SelectorGroup`.
 * @returns The output `SelectorGroup`.
 */
export const flatMapSelectors = (selectors: SelectorGroup, callbackFn: MapSelectorsCallback): SelectorGroup => {
    return (
        selectors
        .filter(isNotEmptySelector) // remove empty Selector(s) in SelectorGroup
        .map((selector: Selector): Selector => // mutates a `Selector` to another `Selector`
            selector
            .filter(isNotEmptySelectorEntry) // remove empty SelectorEntry(es) in Selector
            .flatMap((selectorEntry: SelectorEntry): Selector => { // mutates a (SimpleSelector|Combinator) to ([SimpleSelector]|Selector)
                if (isSimpleSelector(selectorEntry)) {
                    let callbackResult = callbackFn(selectorEntry);
                    if (callbackResult === true) callbackResult = null;
                    let replacement : SimpleSelector|Selector = callbackResult || selectorEntry;
                    
                    
                    
                    if (replacement === selectorEntry) { // if has not been replaced by `callbackFn` (same by reference)
                        const [
                            selectorToken,
                            selectorName,
                            selectorParams,
                        ] = selectorEntry;
                        
                        if (selectorParams && isSelectors(selectorParams)) {
                            const oldSelectors = selectorParams;
                            const newSelectors = flatMapSelectors(oldSelectors, callbackFn); // recursively map the `oldSelectors`
                            
                            replacement = [
                                selectorToken,
                                selectorName,
                                newSelectors,
                            ] as SimpleSelector;
                        } // if
                    } // if
                    
                    
                    
                    return isSelector(replacement) ? replacement /* as Selector */ : createSelector(replacement) /* createSelector(as SimpleSelector) as Selector */;
                } // if SimpleSelector
                
                
                
                return createSelector(selectorEntry);
            })
        )
    );
};
export { flatMapSelectors as mutateSelectors }

// groups:
export interface GroupSelectorOptions {
    selectorName          ?: SelectorName | ('is'|'not'|'has'|'where'),
    cancelGroupIfSingular ?: boolean
}
const defaultGroupSelectorOptions : Required<GroupSelectorOptions> = {
    selectorName           : 'is',
    cancelGroupIfSingular  : false
};
export const groupSelectors = (selectors: OptionalOrBoolean<SelectorGroup>, options: GroupSelectorOptions = defaultGroupSelectorOptions): PureSelectorGroup & { 0: Selector } => {
    if (!isNotEmptySelectors(selectors)) return pureSelectorGroup(
        selector(
            ...[] // an empty Selector
        ),
    ); // empty selectors => nothing to group => return a SelectorGroup with an empty Selector
    
    
    
    const selectorsWithoutPseudoElm : PureSelector[] = selectors.filter(isNotEmptySelector).filter((selector) => selector.every(isNotPseudoElementSelector)); // not contain ::pseudo-element
    const selectorsOnlyPseudoElm    : PureSelector[] = selectors.filter(isNotEmptySelector).filter((selector) => selector.some(isPseudoElementSelector));     // do  contain ::pseudo-element
    
    
    
    if (!isNotEmptySelectors(selectorsWithoutPseudoElm)) return pureSelectorGroup(
        selector(
            ...[] // an empty Selector
        ),
        
        ...selectorsOnlyPseudoElm,
    ); // empty selectors => nothing to group => return a SelectorGroup with an empty Selector
    
    
    
    const {
        selectorName          : targetSelectorName = defaultGroupSelectorOptions.selectorName,
        cancelGroupIfSingular                      = defaultGroupSelectorOptions.cancelGroupIfSingular,
    } = options;
    
    
    
    return pureSelectorGroup(
        (
            (cancelGroupIfSingular && (selectorsWithoutPseudoElm.length < 2))
            ?
            selectorsWithoutPseudoElm?.[0]
            :
            selector(
                pseudoClassSelector(targetSelectorName, selectorsWithoutPseudoElm),
            )
        ),
        
        ...selectorsOnlyPseudoElm,
    );
}
export const groupSelector  = (selector: OptionalOrBoolean<Selector>     , options: GroupSelectorOptions = defaultGroupSelectorOptions): PureSelectorGroup & { 0: Selector } => {
    return groupSelectors(selectorGroup(selector), options);
}

// ungroups:
export interface UngroupSelectorOptions {
    selectorName ?: SelectorName[] & ('is'|'not'|'has'|'where')[],
}
const defaultUngroupSelectorOptions : Required<UngroupSelectorOptions> = {
    selectorName  : ['is', 'where'],
};
export const ungroupSelector  = (selector: OptionalOrBoolean<Selector>     , options: UngroupSelectorOptions = defaultUngroupSelectorOptions): PureSelectorGroup => {
    if (!selector || (selector === true)) return pureSelectorGroup(...[]); // nothing to ungroup => return an empty SelectorGroup
    
    
    
    const filteredSelector = selector.filter(isNotEmptySelectorEntry);
    if (filteredSelector.length === 1) {
        const selectorEntry = filteredSelector[0]; // get the only one SelectorEntry
        if (isPseudoClassSelector(selectorEntry)) {
            const {
                selectorName : targetSelectorName = defaultUngroupSelectorOptions.selectorName,
            } = options;
            
            
            
            const [
                /*
                    selector tokens:
                    '&'  = parent         selector
                    '*'  = universal      selector
                    '['  = attribute      selector
                    ''   = element        selector
                    '#'  = ID             selector
                    '.'  = class          selector
                    ':'  = pseudo class   selector
                    '::' = pseudo element selector
                */
                // selectorToken
                ,
                
                /*
                    selector name:
                    string = the name of [element, ID, class, pseudo class, pseudo element] selector
                */
                selectorName,
                
                /*
                    selector parameter(s):
                    string        = the parameter of pseudo class selector, eg: nth-child(2n+3) => '2n+3'
                    array         = [name, operator, value, options] of attribute selector, eg: [data-msg*="you & me" i] => ['data-msg', '*=', 'you & me', 'i']
                    SelectorGroup = nested selector(s) of pseudo class [:is(...), :where(...), :not(...)]
                */
                selectorParams,
            ] = selectorEntry;
            if (
                targetSelectorName.includes(selectorName)
                &&
                selectorParams && isSelectors(selectorParams)
            ) {
                return ungroupSelectors(selectorParams, options); // recursively ungroup sub-selectors
            } // if
        } // if
    } // if
    
    
    
    return pureSelectorGroup(
        filteredSelector, // no changes - just cleaned up
    );
}
export const ungroupSelectors = (selectors: OptionalOrBoolean<SelectorGroup>, options: UngroupSelectorOptions = defaultUngroupSelectorOptions): PureSelectorGroup => {
    if (!selectors || (selectors === true)) return pureSelectorGroup(...[]); // nothing to ungroup => return an empty SelectorGroup
    
    
    
    return selectors.filter(isNotEmptySelector).flatMap((selector) => ungroupSelector(selector, options));
}



// measures:
export type Specificity = [number, number, number];
export const calculateSpecificity = (selector: Selector): Specificity => {
    return (
        selector
        .filter(isSimpleSelector) // filter out Combinator(s)
        .reduce((accum, simpleSelector, index, array): Specificity => {
            const [
                /*
                    selector tokens:
                    '&'  = parent         selector
                    '*'  = universal      selector
                    '['  = attribute      selector
                    ''   = element        selector
                    '#'  = ID             selector
                    '.'  = class          selector
                    ':'  = pseudo class   selector
                    '::' = pseudo element selector
                */
                selectorToken,
                
                /*
                    selector name:
                    string = the name of [element, ID, class, pseudo class, pseudo element] selector
                */
                selectorName,
                
                /*
                    selector parameter(s):
                    string        = the parameter of pseudo class selector, eg: nth-child(2n+3) => '2n+3'
                    array         = [name, operator, value, options] of attribute selector, eg: [data-msg*="you & me" i] => ['data-msg', '*=', 'you & me', 'i']
                    SelectorGroup = nested selector(s) of pseudo class [:is(...), :where(...), :not(...)]
                */
                selectorParams,
            ] = simpleSelector;
            
            
            
            if (selectorToken === ':') {
                switch (selectorName) {
                    case 'is':
                    case 'not':
                    case 'has': {
                        if (!selectorParams || !isSelectors(selectorParams)) return accum; // no changes
                        const moreSpecificities = (
                            selectorParams
                            .filter(isNotEmptySelector) // remove empty Selector(s) in SelectorGroup
                            .map((selectorParam) => calculateSpecificity(selectorParam))
                        );
                        const maxSpecificity    = moreSpecificities.reduce((accum, current): Specificity => {
                            if (
                                (current[0] > accum[0])
                                ||
                                (current[1] > accum[1])
                                ||
                                (current[2] > accum[2])
                            ) return current;
                            
                            return accum;
                        }, ([0,0,0] as Specificity));
                        return [
                            accum[0] + maxSpecificity[0],
                            accum[1] + maxSpecificity[1],
                            accum[2] + maxSpecificity[2]
                        ] as Specificity;
                    }
                    
                    case 'where':
                        return accum; // no changes
                } // switch
            } // if
            
            
            
            switch(selectorToken) {
                case '#' : // ID selector
                    array.splice(1); // eject early by mutating iterated copy - it's okay to **mutate** the `array` because it already cloned at `filter(isSimpleSelector)`
                    return [
                        accum[0] + 1,
                        accum[1],
                        accum[2]
                    ] as Specificity;
                
                case '.' : // class selector
                case '[' : // attribute selector
                case ':' : // pseudo class selector
                    return [
                        accum[0],
                        accum[1] + 1,
                        accum[2]
                    ] as Specificity;
                
                case ''  : // element selector
                case '::': // pseudo element selector
                    return  [
                        accum[0],
                        accum[1],
                        accum[2] + 1
                    ] as Specificity;
                
                case '&' : // parent selector
                case '*' : // universal selector
                default:
                    return accum; // no changes
            } // switch
        }, ([0,0,0] as Specificity))
    );
}
