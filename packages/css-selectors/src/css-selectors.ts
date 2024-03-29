// cssfn:
import type {
    // optionals:
    OptionalOrBoolean,
    
    
    
    // arrays:
    MaybeArray,
    DeepArray,
    MaybeDeepArray,
}                           from '@cssfn/types'



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
const isNotEmptyExpression = (expression: OptionalOrBoolean<string>): expression is string => (
    !!expression           // not `undefined`|`null`|`false`|emptyString
    &&
    (expression !== true)  // not `true`
);
function unwrapExpressions(expressions: DeepArray<OptionalOrBoolean<string>>, result: string[]): void {
    for (const expression of expressions) {
        // handle single item:
        if (!Array.isArray(expression)) {
            if (!isNotEmptyExpression(expression)) continue; // falsy or empty string => ignore
            result.push(expression);
            continue;
        } // if
        
        
        
        // handle multi item(s):
        unwrapExpressions(expression, result);
    } // for
}
const joinExpressions = (expressions: MaybeDeepArray<OptionalOrBoolean<string>>): string => {
    // statically handle single item:
    if (!Array.isArray(expressions)) {
        if (!isNotEmptyExpression(expressions)) return ''; // falsy or empty string => empty result
        return expressions;
    } // if
    
    
    
    // dynamically handle multi item(s):
    const result: string[] = [];
    unwrapExpressions(expressions, result);
    return (
        result
        .join(',')
    );
};

class SelectorsParser {
    //#region private fields
    private _expression       : string = ''
    private _expressionLength : number = 0
    private _pos              : number = 0
    //#endregion private fields
    
    
    
    //#region private parsing functions
    private isEof(): boolean {
        return (this._pos >= this._expressionLength);
    }
    private isWhitespace(): boolean {
        return whitespaceList.includes(this._expression[this._pos]);
    }
    private skipWhitespace(): void {
        while (!this.isEof() && whitespaceList.includes(this._expression[this._pos])) this._pos++;
    }
    
    private parseSelectorToken(): SelectorToken|null {
        const char = this._expression[this._pos];
        switch (char) {
            case '&': // ParentSelectorToken
            case '*': // UniversalSelectorToken
            case '[': // AttrSelectorToken
            case '#': // IdSelectorToken
            case '.': // ClassSelectorToken
                this._pos++; return char;
            
            case ':':
                this._pos++;
                if (this._expression[this._pos] === ':') { this._pos++; return '::'; } // PseudoElementSelectorToken
                return ':'; // PseudoClassSelectorToken
            
            default:
                if (this.isValidIdentifierChar()) return ''; // ElementSelectorToken
                return null; // unknown expression => return null
        } // switch
    }
    private isValidIdentifierChar(): boolean {
        const char = this._expression[this._pos];
        
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
    }
    private parseIdentifierName(): string|null {
        const originPos = this._pos;
        
        while (!this.isEof() && this.isValidIdentifierChar()) this._pos++; // move forward until invalid
        if (this._pos === originPos) return null; // pos was not moved => nothing to parse => no changes made & return null
        
        return this._expression.slice(originPos, this._pos);
    }
    private parseSimpleSelector(): SimpleSelector|null {
        const originPos = this._pos;
        
        const token = this.parseSelectorToken();
        if (token === null) return null; // syntax error: missing token => no changes made & return null
        
        if ((token === '&') || (token === '*')) { // UnnamedSelectorToken
            return [
                token,
            ];
        }
        else if (token === '[') { // AttrSelectorToken
            const attrSelectorParams = this.parseAttrSelectorParams();
            if (!attrSelectorParams) { this._pos = originPos; return null; } // syntax error: missing attrSelectorParams => revert changes & return null
            
            return [
                token,
                null,
                attrSelectorParams,
            ];
        }
        else { // NamedSelectorToken
            const name = this.parseIdentifierName();
            if (!name) { this._pos = originPos; return null; } // syntax error: missing name => revert changes & return null
            
            if (token !== ':') { // NonParamSelector
                return [
                    token,
                    name,
                ];
            }
            else { // PseudoClassSelectorToken
                if (specialPseudoClassList.includes(name)) {
                    const selectorParams = this.parseSelectorParams();
                    if (!selectorParams) { this._pos = originPos; return null; } // syntax error: missing selectorParams => revert changes & return null
                    return [
                        token,
                        name,
                        selectorParams,
                    ];
                }
                else {
                    const wildParams = this.parseWildParams();
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
    }
    private parseCombinator(): Combinator|null {
        const originPos = this._pos;
        
        this.skipWhitespace();
        
        const char = this._expression[this._pos];
        switch (char) {
            case '>': // ChildCombinator
            case '~': // SiblingCombinator
            case '+': // NextSiblingCombinator
                this._pos++; return char;
            
            default:
            if (this._pos > originPos) { // previously had whitespace
                const currentPos = this._pos;           // 1. backup
                const test = this.parseSelectorToken(); // 2. destructive test
                this._pos = currentPos;                 // 3. restore
                
                if (test !== null) return ' '; // DescendantCombinator
            } // if
            return null; // unknown expression => return null
        } // switch
    }
    private parseSelector(): Selector|null {
        const originPos = this._pos;
        
        const selector : Selector = [];
        
        while (!this.isEof()) {
            // this.skipWhitespace(); // already included in `this.parseCombinator()`, do not `this.skipWhitespace()` here => causing DescendantCombinator (space) unrecognized
            
            if (!selector.length) { // a relative Combinator (a Combinator at the beginning)
                const combinator = this.parseCombinator();
                if (combinator) selector.push(combinator);
            }
            else { // an absolute Combinator (a Combinator between SelectorSequence(s))
                // the next SelectorSequence must be separated by combinator:
                const combinator = this.parseCombinator();
                if (!combinator) break; // no more next SelectorSequence
                selector.push(combinator);
            } // if
            
            
            
            // a separator between [prev expression -or- Combinator] and the SelectorSequence(s)
            this.skipWhitespace();
            
            
            
            //#region SelectorSequence(s) - not separated by any spaces
            // first sequence:
            const simpleSelector = this.parseSimpleSelector();
            if (!simpleSelector) { this._pos = originPos; return null; } // syntax error: missing simpleSelector => revert changes & return null
            selector.push(simpleSelector);
            
            // optional next sequence(s):
            let nextSequence : SimpleSelector|null;
            do {
                nextSequence = this.parseSimpleSelector();
                if (nextSequence) selector.push(nextSequence);
            }
            while(nextSequence);
            //#endregion SelectorSequence(s) - not separated by any spaces
        } // while
        
        if (!selector.length) { this._pos = originPos; return null; }; // syntax error: no any simpleSelector => revert changes & return null
        return selector;
    }
    
    private eatComma(): boolean {
        if (this._expression[this._pos] !== ',') return false;
        this._pos++; return true; // move forward & return true
    }
    private eatOpeningBracket(): boolean {
        if (this._expression[this._pos] !== '(') return false;
        this._pos++; return true; // move forward & return true
    }
    private eatClosingBracket(): boolean {
        if (this._expression[this._pos] !== ')') return false;
        this._pos++; return true; // move forward & return true
    }
    private eatClosingSquareBracket(): boolean {
        if (this._expression[this._pos] !== ']') return false;
        this._pos++; return true; // move forward & return true
    }
    private eatNonBracketsOrSpaces(): boolean {
        const originPos = this._pos;
        
        while (!this.isEof() && !this.isWhitespace() && (this._expression[this._pos] !== '(') && (this._expression[this._pos] !== ')')) this._pos++; // move forward until unmatch
        if (this._pos === originPos) return false; // pos was not moved => nothing to eat => no changes made & return false
        
        return true;
    }
    private parseSelectors(): SelectorGroup|null {
        const originPos = this._pos;
        
        const selectors : SelectorGroup = [];
        
        while (!this.isEof()) {
            this.skipWhitespace();
            
            if (selectors.length) {
                // the next Selector must be separated by comma:
                if (!this.eatComma()) break; // no more next Selector
                
                this.skipWhitespace();
            } // if
            
            const selector = this.parseSelector();
            if (!selector) { this._pos = originPos; return null; } // syntax error: missing selector => revert changes & return null
            selectors.push(selector);
        } // while
        
        if (!selectors.length) { this._pos = originPos; return null; }; // syntax error: no any selector => revert changes & return null
        return selectors;
    }
    private parseWildParams(): WildParams|null {
        const originPos = this._pos;
        
        if (!this.eatOpeningBracket()) return null; // syntax error: missing `(` => no changes made & return null
        this.skipWhitespace();
        
        const taken : string[] = [];
        while (!this.isEof()) {
            //#region eat non_nested value
            const startPos = this._pos;
            let eaten = this.eatNonBracketsOrSpaces();
            if (eaten) {
                const endPos = this._pos;
                taken.push(
                    this._expression.slice(startPos, endPos)
                );
                
                this.skipWhitespace();
            } // if
            //#endregion eat non_nested value
            
            // -or- //
            
            //#region eat nested value
            const nestedWildParams = this.parseWildParams();
            if (nestedWildParams !== null) {
                eaten = true;
                
                taken.push(
                    '(',
                    nestedWildParams,
                    ')'
                );
                
                this.skipWhitespace();
            } // if
            //#endregion eat nested value
            
            
            
            if (!eaten) break; // nothing more to eat => break
        } // while
        
        this.skipWhitespace();
        if (!this.eatClosingBracket()) { this._pos = originPos; return null; } // syntax error: missing `)` => revert changes & return null
        
        return taken.join('');
    }
    private parseSelectorParams(): SelectorGroup|null {
        const originPos = this._pos;
        
        if (!this.eatOpeningBracket()) return null; // syntax error: missing `(` => no changes made & return null
        
        const selectors = this.parseSelectors();
        if (!selectors) { this._pos = originPos; return null; } // syntax error: missing selectors => revert changes & return null
        
        if (!this.eatClosingBracket()) { this._pos = originPos; return null; } // syntax error: missing `)` => revert changes & return null
        
        return selectors;
    }
    private parseAttrSelectorOperator(): AttrSelectorOperator|null {
        const originPos = this._pos;
        
        const char = this._expression[this._pos];
        switch (char) {
            case '=': // ExactOperator
                this._pos++; return char;
            
            case '~': // SpaceSeparatedOperator
            case '|': // SubsOperator
            case '^': // BeginsWithOperator
            case '$': // EndsWithOperator
            case '*': // IncludesOperator
                this._pos++;
                if (this._expression[this._pos] !== '=') { this._pos = originPos; return null; } // syntax error: missing `=` => revert changes & return null
                this._pos++;
                return `${char}=`;
            
            default:
                return null; // unknown expression => return null
        } // switch
    }
    private parseAttrSelectorOptions(): AttrSelectorOptions|null {
        const char = this._expression[this._pos];
        switch (char) {
            case 'i': // case-insensitively
            case 'I': // case-insensitively
            case 's': // case-sensitively
            case 'S': // case-sensitively
                this._pos++; return char;
            
            default:
                return null; // unknown expression => return null
        } // switch
    }
    private parseNudeString(): string|null {
        return this.parseIdentifierName();
    }
    private eatQuote(quoteChar: "'" | '"'): boolean {
        if (this._expression[this._pos] !== quoteChar) return false;
        this._pos++; return true; // move forward & return true
    }
    private isValidStringChar(quoteChar: "'" | '"'): boolean {
        const char = this._expression[this._pos];
        if (char === quoteChar) {
            return ((this._pos >= 1) && (this._expression[this._pos - 1] === '\\')); // IF looking_backward: has backward_slash_char => VALID, otherwise: INVALID
        }
        else if (char === '\\') { // backward_slash_char
            return ((this._pos + 1) < this._expressionLength); // IF looking_forward: has any_char => VALID, otherwise: INVALID
        }
        else {
            return true; // any chars other than quoteChar & backwardChar
        } // if
    }
    private parseQuoteString(quoteChar: "'" | '"'): string|null {
        const originPos = this._pos;
        
        if (!this.eatQuote(quoteChar)) return null; // syntax error: missing opening_quoteChar => no changes made & return null
        
        while (!this.isEof() && this.isValidStringChar(quoteChar)) this._pos++; // move forward until invalid
        
        if (!this.eatQuote(quoteChar)) { this._pos = originPos; return null; } // syntax error: missing closing_quoteChar => revert changes & return null
        
        const value = this._expression.slice(originPos + 1, this._pos - 1); // excludes the opening_quoteChar & closing_quoteChar
        if (quoteChar === "'") { // single quoteChar
            // for consistency reason: escape the unescaped double quoteChar, so both single & double quoteChar are escaped:
            // return value.replace(/(?<!\\)"/g, '\\"');     // DO NOT USE look_backward    to maximize browser compatibility
            return value.replace(/(^|[^\\])(")/g, '$1\\$2'); // use an alternative solution to maximize browser compatibility
        }
        else { // double quoteChar
            // for consistency reason: escape the unescaped single quoteChar, so both single & double quoteChar are escaped:
            // return value.replace(/(?<!\\)'/g, "\\'");     // DO NOT USE look_backward    to maximize browser compatibility
            return value.replace(/(^|[^\\])(')/g, '$1\\$2'); // use an alternative solution to maximize browser compatibility
        } // if
    }
    private parseString(): string|null {
        return (
            this.parseQuoteString("'")
            ??
            this.parseQuoteString('"')
            ??
            this.parseNudeString()
        );
    }
    private parseAttrSelectorParams(): AttrSelectorParams|null {
        const originPos = this._pos;
        
        // if (!eatOpeningSquareBracket()) return null; // already eaten by `this.parseSelectorToken()`
        
        this.skipWhitespace();
        
        const name = this.parseIdentifierName();
        if (!name) { this._pos = originPos; return null; } // syntax error: missing name => revert changes & return null
        
        this.skipWhitespace();
        
        const operator = this.parseAttrSelectorOperator();
        if (!operator) { // name only
            if (!this.eatClosingSquareBracket()) { this._pos = originPos; return null; } // syntax error: missing `]` => revert changes & return null
            
            return [
                name,
            ];
        }
        else { // name=value
            this.skipWhitespace();
            
            const value = this.parseString();
            // an empty value "" -or- '' is possible
            if (value === null) { this._pos = originPos; return null; } // syntax error: missing value => revert changes & return null
            
            this.skipWhitespace();
            
            const options = this.parseAttrSelectorOptions();
            if (options) {
                this.skipWhitespace();
            } // if
            
            if (!this.eatClosingSquareBracket()) { this._pos = originPos; return null; } // syntax error: missing `]` => revert changes & return null
            
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
    }
    //#endregion private parsing functions
    
    
    
    process(expressions: MaybeDeepArray<OptionalOrBoolean<string>>): SelectorGroup|null {
        // configure:
        this._expression       = joinExpressions(expressions);
        this._expressionLength = this._expression.length;
        this._pos              = 0;
        
        
        
        // process:
        const allSelectors = this.parseSelectors();
        this.skipWhitespace();
        if (!allSelectors) {
            if (this.isEof()) {
                return []; // empty selector
            } // if
            
            return null;   // syntax error: not all expression are valid selector
        } // if
        if (!this.isEof()) {
            return null;   // syntax error: not all expression are valid selector
        } // if
        
        
        
        // cleanups:
        this._expression = '';
        
        
        
        // result:
        return allSelectors;
    }
}
const selectorsParser : SelectorsParser = new SelectorsParser();
export const parseSelectors = (expressions: MaybeDeepArray<OptionalOrBoolean<string>>): SelectorGroup|null => {
    return selectorsParser.process(expressions);
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
export {
    parentSelector        as createParentSelector,
    universalSelector     as createUniversalSelector,
    attrSelector          as createAttrSelector,
    elementSelector       as createElementSelector,
    idSelector            as createIdSelector,
    classSelector         as createClassSelector,
    pseudoClassSelector   as createPseudoClassSelector,
    pseudoElementSelector as createPseudoElementSelector,
}
//#endregion aliases

export const isSimpleSelector                    = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is SimpleSelector                          => (selectorEntry !== null) && (typeof(selectorEntry) === 'object');
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

export const isAttrSelectorOf                    = (selectorEntry: OptionalOrBoolean<SelectorEntry>, attrName  : MaybeArray<string>)     : boolean => isAttrSelector(selectorEntry)                   && [attrName  ].flat().includes(selectorEntry?.[2]?.[0]); // [ '['     , null      , [ attrName , op , value , opt ] ]
export const isElementSelectorOf                 = (selectorEntry: OptionalOrBoolean<SelectorEntry>, elmName   : MaybeArray<string>)     : boolean => isElementSelector(selectorEntry)                && [elmName   ].flat().includes(selectorEntry?.[1]);      // [ ''      , elmName   ]
export const isIdSelectorOf                      = (selectorEntry: OptionalOrBoolean<SelectorEntry>, id        : MaybeArray<string>)     : boolean => isIdSelector(selectorEntry)                     && [id        ].flat().includes(selectorEntry?.[1]);      // [ '#'     , id        ]
export const isClassSelectorOf                   = (selectorEntry: OptionalOrBoolean<SelectorEntry>, className : MaybeArray<string>)     : boolean => isClassSelector(selectorEntry)                  && [className ].flat().includes(selectorEntry?.[1]);      // [ '.'     , className ]
export const isPseudoClassSelectorOf             = (selectorEntry: OptionalOrBoolean<SelectorEntry>, className : MaybeArray<string>)     : boolean => isPseudoClassSelector(selectorEntry)            && [className ].flat().includes(selectorEntry?.[1]);      // [ ':'     , className ]
export const isClassOrPseudoClassSelectorOf      = (selectorEntry: OptionalOrBoolean<SelectorEntry>, className : MaybeArray<string>)     : boolean => isClassOrPseudoClassSelector(selectorEntry)     && [className ].flat().includes(selectorEntry?.[1]);      // [ '.'|':' , className ]
export const isPseudoElementSelectorOf           = (selectorEntry: OptionalOrBoolean<SelectorEntry>, elmName   : MaybeArray<string>)     : boolean => isPseudoElementSelector(selectorEntry)          && [elmName   ].flat().includes(selectorEntry?.[1]);      // [ '::'    , elmName   ]
export const isElementOrPseudoElementSelectorOf  = (selectorEntry: OptionalOrBoolean<SelectorEntry>, elmName   : MaybeArray<string>)     : boolean => isElementOrPseudoElementSelector(selectorEntry) && [elmName   ].flat().includes(selectorEntry?.[1]);      // [ ''|'::' , elmName   ]

export const combinator = (combinator: Combinator): Combinator => combinator;
//#region aliases
export {
    combinator as createCombinator,
}
//#endregion aliases

export const isCombinator                        = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is Combinator => (typeof(selectorEntry) === 'string');
export const isCombinatorOf                      = (selectorEntry: OptionalOrBoolean<SelectorEntry>, combinator: MaybeArray<Combinator>) : boolean => isCombinator(selectorEntry)                     && [combinator].flat().includes(selectorEntry);

// SimpleSelector & Selector creates & tests:
export const selector          = <TSelector          extends Selector          = Selector         >(...selectorEntries : TSelector         ): TSelector          => selectorEntries;
export const pureSelector      = <TPureSelector      extends PureSelector      = PureSelector     >(...selectorEntries : TPureSelector     ): TPureSelector      => selectorEntries;
export const selectorGroup     = <TSelectorGroup     extends SelectorGroup     = SelectorGroup    >(...selectors       : TSelectorGroup    ): TSelectorGroup     => selectors;
export const pureSelectorGroup = <TPureSelectorGroup extends PureSelectorGroup = PureSelectorGroup>(...selectors       : TPureSelectorGroup): TPureSelectorGroup => selectors;
//#region aliases
export {
    selector          as createSelector,
    pureSelector      as createPureSelector,
    selectorGroup     as createSelectorGroup,
    pureSelectorGroup as createPureSelectorGroup,
}
const createSelector = selector;
//#endregion aliases

export const isNotEmptySelectorEntry = (selectorEntry: OptionalOrBoolean<SelectorEntry>): selectorEntry is SelectorEntry => {
    /*
        SimpleSelector : [ SelectorToken, SelectorName, SelectorParams ]
        Combinator     : non_empty string
    */
   return (!!selectorEntry && (selectorEntry !== true)); // filter out undefined|null|false|true
}
export const isSelector = (test: OptionalOrBoolean<SelectorEntry|Selector>): test is Selector => {
    /*
        SelectorEntry  = SimpleSelector | Combinator
        
        Combinator     : string
        SimpleSelector : [ SelectorToken, SelectorName, SelectorParams                  ] => [ SelectorToken, SelectorName, SelectorParams                ]
        Selector       : [ undefined|null|false|true...SelectorEntry...SelectorEntry... ] => [ undefined|null|false|true...(SimpleSelector|Combinator)... ]
    */
    return (
        (!!test && (test !== true)) // filter out undefined|null|false|true
        &&
        (typeof(test) !== 'string') // filter out Combinator
        &&
        (
            (typeof(test[0]) !== 'string')   // is Selector[0] => [ undefined|null|false|true...SimpleSelector...readonly[***] ]
            ||
            combinatorList.includes(test[0]) // is Combinator|SelectorToken => filter in Combinator
        )
    ); // Selector : the first element (SelectorEntry) must be a NON-string (an array) -or- a string of Combinator
};
export const isNotEmptySelector   = (selector  : OptionalOrBoolean<Selector     >): selector  is Selector      =>  (!!selector  && (selector  !== true)) &&  selector.some(  isNotEmptySelectorEntry);
export const isNotEmptySelectors  = (selectors : OptionalOrBoolean<SelectorGroup>): selectors is SelectorGroup =>  (!!selectors && (selectors !== true)) && selectors.some(  isNotEmptySelector     );
export const countSelectorEntries = (selector  : OptionalOrBoolean<Selector     >): number                     => ((!!selector  && (selector  !== true)) && selectPureSelectorFromSelector(selector).length            ) || 0;
export const countSelectors       = (selectors : OptionalOrBoolean<SelectorGroup>): number                     => ((!!selectors && (selectors !== true)) && selectPureSelectorGroupFromSelectorGroup(selectors).length ) || 0;

export const selectPureSelectorFromSelector           = (selector  : Selector     ): PureSelector      =>  selector.filter(isNotEmptySelectorEntry);
export const selectPureSelectorGroupFromSelectorGroup = (selectors : SelectorGroup): PureSelectorGroup => selectors.filter(isNotEmptySelector);



// renders:
export const selectorParamsToString = (selectorParams: SelectorParams): string => {
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
    const result : string[] = [];
    
    // for (const selectorEntry of selector) { // inefficient : triggering too many garbage collector of creating & destroying `const selectorEntry`
    for (let selectorEntryIndex = 0, maxSelectorEntryIndex = selector.length, selectorEntry : OptionalOrBoolean<SelectorEntry>; selectorEntryIndex < maxSelectorEntryIndex; selectorEntryIndex++) {
        selectorEntry = selector[selectorEntryIndex];
        
        
        
        // conditions:
        if (!isNotEmptySelectorEntry(selectorEntry)) continue; // falsy selectorEntry => ignore
        
        
        
        // render:
        
        // SimpleSelector:
        if (isSimpleSelector(selectorEntry)) {
            const [
                selectorToken,
                selectorName,
                selectorParams,
            ] = selectorEntry;
            
            if (selectorToken === '[') { // AttrSelectorToken
                result.push(
                    selectorParamsToString(selectorParams)
                );
            }
            else {
                result.push(
                    `${selectorToken}${selectorName ?? ''}${(selectorParams === undefined) ? '' : selectorParamsToString(selectorParams)}`
                );
            } // if
            
            
            
            continue; // handled => continue to next loop
        } // if
        
        
        
        // Combinator:
        result.push(selectorEntry);
    } // for
    
    
    
    switch (result.length) {
        case 1  : return result[0];
        case 0  : return '';
        default : return result.join(''); // merge (SimpleSelector|Combinator)+ without altering any space
    } // switch
};
export const selectorsToString      = (selectors: SelectorGroup): string => {
    const result : string[] = [];
    
    // for (const selector of selectors) { // inefficient : triggering too many garbage collector of creating & destroying `const selector`
    for (let selectorIndex = 0, maxSelectorIndex = selectors.length, selector : OptionalOrBoolean<Selector>; selectorIndex < maxSelectorIndex; selectorIndex++) {
        selector = selectors[selectorIndex];
        
        
        
        // conditions:
        if (!isNotEmptySelector(selector)) continue; // falsy or empty selector => ignore
        
        
        
        // render:
        result.push(
            selectorToString(selector)
        );
    } // for
    
    
    
    switch (result.length) {
        case 1  : return result[0];
        case 0  : return '';
        default : return result.join(', ');
    } // switch
};



// transforms:
export type ReplaceSelectorCallback = (selectorEntry: SelectorEntry) => OptionalOrBoolean<SelectorEntry|Selector>
function selectSelectorWithReplacementFromOptionalSelectorEntry(this: ReplaceSelectorCallback, optionalSelectorEntry: OptionalOrBoolean<SelectorEntry>): OptionalOrBoolean<Selector> {
    if (!isNotEmptySelectorEntry(optionalSelectorEntry)) return optionalSelectorEntry; // nullish => ignore
    
    
    
    const callbackFn     = this;
    const callbackResult = callbackFn(optionalSelectorEntry);
    let replacement = (callbackResult === undefined) ? optionalSelectorEntry : callbackResult;
    
    
    
    if (replacement === optionalSelectorEntry) { // if has not been replaced by `callbackFn` (same by reference)
        const [
            selectorToken,
            selectorName,
            selectorParams,
        ] = optionalSelectorEntry;
        
        if (selectorParams && isSelectors(selectorParams)) {
            const oldSelectors = selectorParams;
            const newSelectors = replaceSelectors(oldSelectors, callbackFn); // recursively map the `oldSelectors`
            
            replacement = [
                selectorToken,
                selectorName,
                newSelectors,
            ] as SimpleSelector;
        } // if
    } // if
    
    
    
    if (!replacement || (replacement === true)) return replacement; // nullish => ignore
    return isSelector(replacement) ? replacement /* as Selector */ : createSelector(replacement) /* createSelector(as SelectorEntry) as Selector */;
}
function selectOptionalSelectorWithReplacementFromOptionalSelector(this: ReplaceSelectorCallback, optionalSelector: OptionalOrBoolean<Selector>): OptionalOrBoolean<Selector> {
    if (!isNotEmptySelector(optionalSelector)) return optionalSelector; // nullish => ignore
    
    
    
    const callbackFn = this;
    return (
        optionalSelector
        .flatMap(selectSelectorWithReplacementFromOptionalSelectorEntry, callbackFn)
    );
}
/**
 * Creates a new `SelectorGroup` populated with the results of calling a provided `callbackFn` on every `SelectorEntry` in the `selectors`.  
 * The nested `SelectorEntry` (if any) will also be passed to `callbackFn`.  
 * @param selectors The input `SelectorGroup`.
 * @param callbackFn A function that is called for every `SelectorEntry` in the `selectors`.  
 * Each time `callbackFn` executes, the returned value is added to the output `SelectorGroup`.
 * @returns The output `SelectorGroup`.
 */
export const replaceSelectors = (selectors: OptionalOrBoolean<SelectorGroup>, callbackFn: ReplaceSelectorCallback): SelectorGroup => {
    if (!isNotEmptySelectors(selectors)) return selectorGroup(
        /* an empty SelectorGroup */
    ); // nullish => nothing to replace => return an empty SelectorGroup
    
    
    
    return (
        selectors
        .map(selectOptionalSelectorWithReplacementFromOptionalSelector, callbackFn) // mutates a `Selector` to another `Selector`
    );
};
export const replaceSelector  = (selector : OptionalOrBoolean<Selector>     , callbackFn: ReplaceSelectorCallback): Selector => {
    if (!isNotEmptySelector(selector)) return createSelector(
        /* an empty Selector */
    ); // nullish => nothing to replace => return an empty Selector
    
    
    
    const result = selectOptionalSelectorWithReplacementFromOptionalSelector.call(callbackFn, selector);
    if (!result || (result === true)) return createSelector(
        /* an empty Selector */
    ); // nullish => nothing to replace => return an empty Selector
    return result;
}

// groups:
export interface GroupSelectorOptions {
    selectorName          ?: SelectorName | ('is'|'not'|'has'|'where'),
    cancelGroupIfSingular ?: boolean
}
const defaultGroupSelectorOptions : Required<GroupSelectorOptions> = {
    selectorName           : 'is',
    cancelGroupIfSingular  : false
};
export const groupSelectors = (selectors: OptionalOrBoolean<SelectorGroup>, options: GroupSelectorOptions = defaultGroupSelectorOptions): PureSelectorGroup & [Selector, ...Selector[]] => {
    if (!selectors || (selectors === true)) return pureSelectorGroup(
        createSelector(
            /* an empty Selector */
        ),
    ); // empty selectors => nothing to group => return a SelectorGroup with an empty Selector
    
    
    
    const selectorsWithPseudoElm    : PureSelector[] = [];
    const selectorsWithoutPseudoElm : PureSelector[] = [];
    
    let   selectorEntries           : SelectorEntry[]|undefined = undefined;
    let   hasPseudoElement          : boolean;
    
    let   selectorIndex             : number
    let   maxSelectorIndex          : number
    let   selector                  : OptionalOrBoolean<Selector>
    
    let   selectorEntryIndex        : number
    let   maxSelectorEntryIndex     : number
    let   selectorEntry             : OptionalOrBoolean<SelectorEntry>
    
    // for (const selector of selectors) { // inefficient : triggering too many garbage collector of creating & destroying `const selector`
    for (selectorIndex = 0, maxSelectorIndex = selectors.length; selectorIndex < maxSelectorIndex; selectorIndex++) {
        selector = selectors[selectorIndex];
        
        
        
        // conditions:
        // if (!isNotEmptySelector(selector)) continue; // falsy or empty selector => ignore // inefficient : intrinsically call `isNotEmptySelectorEntry`
        if (!selector || (selector === true)) continue; // falsy selector => ignore
        
        
        
        if (!selectorEntries) selectorEntries = []; // create a new array if not was collected in previous loop
        hasPseudoElement = false;
        // for (const selectorEntry of selector) { // inefficient : triggering too many garbage collector of creating & destroying `const selectorEntry`
        for (selectorEntryIndex = 0, maxSelectorEntryIndex = selector.length; selectorEntryIndex < maxSelectorEntryIndex; selectorEntryIndex++) {
            selectorEntry = selector[selectorEntryIndex];
            
            
            
            // conditions:
            if (!isNotEmptySelectorEntry(selectorEntry)) continue; // falsy selectorEntry => ignore
            
            
            
            // collect:
            selectorEntries.push(selectorEntry);
            
            
            
            // tests:
            if (!hasPseudoElement && isPseudoElementSelector(selectorEntry)) hasPseudoElement = true;
        } // for
        
        
        
        // collect:
        if (selectorEntries.length) {
            if (hasPseudoElement) {
                selectorsWithPseudoElm.push(selectorEntries as PureSelector);
            }
            else {
                selectorsWithoutPseudoElm.push(selectorEntries as PureSelector);
            } // if
            selectorEntries = undefined; // mark as collected, so at the beginning of the next loop will create a new array
        } // if
    } // for
    
    
    
    if (!selectorsWithoutPseudoElm.length) return pureSelectorGroup(
        createSelector(
            /* an empty Selector */
        ),
        
        ...selectorsWithPseudoElm, // additional ungroupable selector(s) (if any)
    ); // empty selectors => nothing to group => return a SelectorGroup with an empty Selector + additional pseudoElm(s) (if any)
    
    
    
    const {
        selectorName          : targetSelectorName = defaultGroupSelectorOptions.selectorName,
        cancelGroupIfSingular                      = defaultGroupSelectorOptions.cancelGroupIfSingular,
    } = options;
    
    
    
    return pureSelectorGroup(
        (
            (cancelGroupIfSingular && (selectorsWithoutPseudoElm.length <= 1))
            ?
            // singular & no grouping is needed:
            // if singular => take it || if zero => undefined => fallback to an empty selector
            selectorsWithoutPseudoElm?.[0] ?? createSelector(
                /* an empty Selector */
            )
            :
            // plural:
            createSelector(
                pseudoClassSelector(targetSelectorName, selectorsWithoutPseudoElm),
            )
        ),
        
        ...selectorsWithPseudoElm,
    );
}
export const groupSelector  = (selector : OptionalOrBoolean<Selector>     , options: GroupSelectorOptions = defaultGroupSelectorOptions): PureSelectorGroup & [Selector, ...Selector[]] => {
    return groupSelectors(selectorGroup(selector), options);
}

// ungroups:
export interface UngroupSelectorOptions {
    selectorName ?: SelectorName[] & ('is'|'not'|'has'|'where')[],
}
const defaultUngroupSelectorOptions : Required<UngroupSelectorOptions> = {
    selectorName  : ['is', 'where'],
};
export const ungroupSelector  = (selector : OptionalOrBoolean<Selector>     , options: UngroupSelectorOptions = defaultUngroupSelectorOptions): PureSelectorGroup => {
    if (!selector || (selector === true)) return pureSelectorGroup(
        /* an empty SelectorGroup */
    ); // empty selector => nothing to ungroup => return an empty SelectorGroup
    
    
    
    let theOnlySelectorEntry : SelectorEntry|undefined = undefined;
    // for (const selectorEntry of selector) { // inefficient : triggering too many garbage collector of creating & destroying `const selectorEntry`
    for (let selectorEntryIndex = 0, maxSelectorEntryIndex = selector.length, selectorEntry : OptionalOrBoolean<SelectorEntry>; selectorEntryIndex < maxSelectorEntryIndex; selectorEntryIndex++) {
        selectorEntry = selector[selectorEntryIndex];
        
        
        
        // conditions:
        if (!isNotEmptySelectorEntry(selectorEntry)) continue; // falsy selectorEntry => ignore
        
        
        
        // collect:
        if (theOnlySelectorEntry !== undefined) { // multiple selectorEntries detected => unable to ungroup
            return pureSelectorGroup(
                selectPureSelectorFromSelector(selector), // no changes - just cleaned up
            );
        } // if
        theOnlySelectorEntry = selectorEntry;
    } // for
    
    
    
    if (theOnlySelectorEntry && isPseudoClassSelector(theOnlySelectorEntry)) {
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
        ] = theOnlySelectorEntry;
        if (
            targetSelectorName.includes(selectorName)
            &&
            selectorParams && isSelectors(selectorParams)
        ) {
            return ungroupSelectors(selectorParams, options); // recursively ungroup sub-selectors
        } // if
    } // if
    
    
    
    // unable to ungroup:
    return pureSelectorGroup(
        selectPureSelectorFromSelector(selector), // no changes - just cleaned up
    );
}
export const ungroupSelectors = (selectors: OptionalOrBoolean<SelectorGroup>, options: UngroupSelectorOptions = defaultUngroupSelectorOptions): PureSelectorGroup => {
    if (!selectors || (selectors === true)) return pureSelectorGroup(
        /* an empty SelectorGroup */
    ); // empty selectors => nothing to ungroup => return an empty SelectorGroup
    
    
    
    const result : Selector[] = [];
    
    // for (const selector of selectors) { // inefficient : triggering too many garbage collector of creating & destroying `const selector`
    for (let selectorIndex = 0, maxSelectorIndex = selectors.length; selectorIndex < maxSelectorIndex; selectorIndex++) {
        result.push(
            ...ungroupSelector(selectors[selectorIndex], options)
        );
    } // for
    
    
    
    return result as PureSelectorGroup;
}



// measures:
export type Specificity = [number, number, number];
export const calculateSpecificity = (selector: OptionalOrBoolean<Selector>): Specificity => {
    // conditions:
    const result : Specificity = [0, 0, 0];
    if (!isNotEmptySelector(selector)) return result; // empty selector => nothing to calculate => return a zero Specificity
    
    
    
    for (const selectorEntry of selector) {
        // conditions:
        if (!isSimpleSelector(selectorEntry)) continue; // falsy or Combinator => skip
        
        
        
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
        ] = selectorEntry; // as SimpleSelector
        
        
        
        if (selectorToken === ':') {
            switch (selectorName) {
                case 'is':
                case 'not':
                case 'has': {
                    if (!selectorParams || !isSelectors(selectorParams)) continue; // no nested Selector(s) => no changes => skip
                    
                    
                    
                    let maxSpecificity: Specificity = [0, 0, 0]
                    for (let nestedSpecificity: Specificity, index = 0, maxIndex = selectorParams.length; index < maxIndex; index++) {
                        // conditions:
                        if (!isNotEmptySelector(selectorParams[index])) continue;
                        
                        
                        
                        nestedSpecificity = calculateSpecificity(selectorParams[index]);
                        if (
                            (nestedSpecificity[0] > maxSpecificity[0])
                            ||
                            (nestedSpecificity[1] > maxSpecificity[1])
                            ||
                            (nestedSpecificity[2] > maxSpecificity[2])
                        ) {
                            // nestedSpecificity is higher than the highest maxSpecificity => replace it
                            maxSpecificity = nestedSpecificity;
                        } // if
                    } // for
                    result[0] += maxSpecificity[0];
                    result[1] += maxSpecificity[1];
                    result[2] += maxSpecificity[2];
                    continue; // process next SimpleSelector(s)
                }
                
                case 'where':
                    continue; // no changes => skip
            } // switch
        } // if
        
        
        
        switch(selectorToken) {
            case '#' : // ID selector
                result[0]++;
                continue; // process next SimpleSelector(s)
            
            case '.' : // class selector
            case '[' : // attribute selector
            case ':' : // pseudo class selector
                result[1]++;
                continue; // process next SimpleSelector(s)
            
            case ''  : // element selector
            case '::': // pseudo element selector
                result[2]++;
                continue; // process next SimpleSelector(s)
            
            case '&' : // parent selector
            case '*' : // universal selector
            default:
                continue; // no changes => skip
        } // switch
    } // for
    
    
    
    return result;
}
