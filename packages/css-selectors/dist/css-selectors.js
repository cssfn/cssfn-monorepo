const whitespaceList = [' ', '\n', '\r', '\t', '\f', '\v'];
const specialPseudoClassList = ['is', 'not', 'where', 'has'];
// parses:
export const parseSelectors = (expressions) => {
    const expression = [expressions].flat(Infinity).filter((exp) => !!exp && (exp !== true)).join(',');
    const expressionLength = expression.length;
    let pos = 0;
    const isEof = () => {
        return (pos >= expressionLength);
    };
    const skipWhitespace = () => {
        while (!isEof() && whitespaceList.includes(expression[pos]))
            pos++;
    };
    const parseSelectorToken = () => {
        const char = expression[pos];
        switch (char) {
            case '&': // ParentSelectorToken
            case '*': // UniversalSelectorToken
            case '[': // AttrSelectorToken
            case '#': // IdSelectorToken
            case '.': // ClassSelectorToken
                pos++;
                return char;
            case ':':
                pos++;
                if (expression[pos] === ':') {
                    pos++;
                    return '::';
                } // PseudoElementSelectorToken
                return ':'; // PseudoClassSelectorToken
            default:
                if (isValidIdentifierChar())
                    return ''; // ElementSelectorToken
                return null; // unknown expression => return null
        } // switch
    };
    const isValidIdentifierChar = () => {
        const char = expression[pos];
        /*
            using regex is easier, but the performance is slow
        */
        // return /[\w0-9-_]/.test(char);
        /*
            using hard coded is more complex, but the performance is about 10-12x faster
        */
        if ((char >= 'a') && (char <= 'z'))
            return true;
        if ((char >= 'A') && (char <= 'Z'))
            return true;
        if ((char >= '0') && (char <= '9'))
            return true;
        if (char === '-')
            return true;
        if (char === '_')
            return true;
        return false;
    };
    const parseIdentifierName = () => {
        const originPos = pos;
        while (!isEof() && isValidIdentifierChar())
            pos++; // move forward until invalid
        if (pos === originPos)
            return null; // pos was not moved => nothing to parse => no changes made & return null
        return expression.slice(originPos, pos);
    };
    const parseSimpleSelector = () => {
        const originPos = pos;
        const token = parseSelectorToken();
        if (token === null)
            return null; // syntax error: missing token => no changes made & return null
        if ((token === '&') || (token === '*')) { // UnnamedSelectorToken
            return [
                token,
            ];
        }
        else if (token === '[') { // AttrSelectorToken
            const attrSelectorParams = parseAttrSelectorParams();
            if (!attrSelectorParams) {
                pos = originPos;
                return null;
            } // syntax error: missing attrSelectorParams => revert changes & return null
            return [
                token,
                null,
                attrSelectorParams,
            ];
        }
        else { // NamedSelectorToken
            const name = parseIdentifierName();
            if (!name) {
                pos = originPos;
                return null;
            } // syntax error: missing name => revert changes & return null
            if (token !== ':') { // NonParamSelector
                return [
                    token,
                    name,
                ];
            }
            else { // PseudoClassSelectorToken
                if (specialPseudoClassList.includes(name)) {
                    const selectorParams = parseSelectorParams();
                    if (!selectorParams) {
                        pos = originPos;
                        return null;
                    } // syntax error: missing selectorParams => revert changes & return null
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
    const parseCombinator = () => {
        const originPos = pos;
        skipWhitespace();
        const char = expression[pos];
        switch (char) {
            case '>': // ChildCombinator
            case '~': // SiblingCombinator
            case '+': // NextSiblingCombinator
                pos++;
                return char;
            default:
                if (pos > originPos) { // previously had whitespace
                    const currentPos = pos; // 1. backup
                    const test = parseSelectorToken(); // 2. destructive test
                    pos = currentPos; // 3. restore
                    if (test !== null)
                        return ' '; // DescendantCombinator
                } // if
                return null; // unknown expression => return null
        } // switch
    };
    const parseSelector = () => {
        const originPos = pos;
        const selector = [];
        while (!isEof()) {
            // skipWhitespace(); // already included in `parseCombinator()`, do not `skipWhitespace()` here => causing DescendantCombinator (space) unrecognized
            if (selector.length) {
                // the next SelectorSequence must be separated by combinator:
                const combinator = parseCombinator();
                if (!combinator)
                    break; // no more next SelectorSequence
                selector.push(combinator);
            } // if
            skipWhitespace();
            const simpleSelector = parseSimpleSelector();
            if (!simpleSelector) {
                pos = originPos;
                return null;
            } // syntax error: missing simpleSelector => revert changes & return null
            selector.push(simpleSelector);
            //#region SelectorSequence
            let nextSequence;
            do {
                nextSequence = parseSimpleSelector();
                if (nextSequence)
                    selector.push(nextSequence);
            } while (nextSequence);
            //#endregion SelectorSequence
        } // while
        return selector;
    };
    const eatComma = () => {
        if (expression[pos] !== ',')
            return false;
        pos++;
        return true; // move forward & return true
    };
    const eatOpeningBracket = () => {
        if (expression[pos] !== '(')
            return false;
        pos++;
        return true; // move forward & return true
    };
    const eatClosingBracket = () => {
        if (expression[pos] !== ')')
            return false;
        pos++;
        return true; // move forward & return true
    };
    const eatClosingSquareBracket = () => {
        if (expression[pos] !== ']')
            return false;
        pos++;
        return true; // move forward & return true
    };
    const eatNonBrackets = () => {
        const originPos = pos;
        while (!isEof() && (expression[pos] !== '(') && (expression[pos] !== ')'))
            pos++; // move forward until unmatch
        if (pos === originPos)
            return false; // pos was not moved => nothing to eat => no changes made & return false
        return true;
    };
    const parseSelectors = () => {
        const originPos = pos;
        const selectors = [];
        while (!isEof()) {
            skipWhitespace();
            if (selectors.length) {
                // the next Selector must be separated by comma:
                if (!eatComma())
                    break; // no more next Selector
                skipWhitespace();
            } // if
            const selector = parseSelector();
            if (!selector) {
                pos = originPos;
                return null;
            } // syntax error: missing selector => revert changes & return null
            selectors.push(selector);
        } // while
        return selectors;
    };
    const parseWildParams = () => {
        const originPos = pos;
        if (!eatOpeningBracket())
            return null; // syntax error: missing `(` => no changes made & return null
        while (!isEof()) {
            let eaten = eatNonBrackets();
            const nestedWildParams = parseWildParams();
            if (nestedWildParams !== null) {
                eaten = true;
                eatNonBrackets();
            } // if
            if (!eaten)
                break; // nothing more to eat => break
        } // while
        if (!eatClosingBracket()) {
            pos = originPos;
            return null;
        } // syntax error: missing `)` => revert changes & return null
        return expression.slice(originPos + 1, pos - 1);
    };
    const parseSelectorParams = () => {
        const originPos = pos;
        if (!eatOpeningBracket())
            return null; // syntax error: missing `(` => no changes made & return null
        const selectors = parseSelectors();
        if (!selectors) {
            pos = originPos;
            return null;
        } // syntax error: missing selectors => revert changes & return null
        if (!eatClosingBracket()) {
            pos = originPos;
            return null;
        } // syntax error: missing `)` => revert changes & return null
        return selectors;
    };
    const parseAttrSelectorOperator = () => {
        const originPos = pos;
        const char = expression[pos];
        switch (char) {
            case '=': // ExactOperator
                pos++;
                return char;
            case '~': // SpaceSeparatedOperator
            case '|': // SubsOperator
            case '^': // BeginsWithOperator
            case '$': // EndsWithOperator
            case '*': // IncludesOperator
                pos++;
                if (expression[pos] !== '=') {
                    pos = originPos;
                    return null;
                } // syntax error: missing `=` => revert changes & return null
                pos++;
                return `${char}=`;
            default:
                return null; // unknown expression => return null
        } // switch
    };
    const parseAttrSelectorOptions = () => {
        const char = expression[pos];
        switch (char) {
            case 'i': // case-insensitively
            case 'I': // case-insensitively
            case 's': // case-sensitively
            case 'S': // case-sensitively
                pos++;
                return char;
            default:
                return null; // unknown expression => return null
        } // switch
    };
    const parseNudeString = () => {
        return parseIdentifierName();
    };
    const eatQuote = (quoteChar) => {
        if (expression[pos] !== quoteChar)
            return false;
        pos++;
        return true; // move forward & return true
    };
    const isValidStringChar = (quoteChar) => {
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
    const parseQuoteString = (quoteChar) => {
        const originPos = pos;
        if (!eatQuote(quoteChar))
            return null; // syntax error: missing opening_quoteChar => no changes made & return null
        while (!isEof() && isValidStringChar(quoteChar))
            pos++; // move forward until invalid
        if (!eatQuote(quoteChar)) {
            pos = originPos;
            return null;
        } // syntax error: missing closing_quoteChar => revert changes & return null
        const value = expression.slice(originPos + 1, pos - 1); // excludes the opening_quoteChar & closing_quoteChar
        if (quoteChar === "'") { // single quoteChar
            return value.replace(/(?<!\\)"/g, '\\"'); // escape the unescaped double quoteChar, so both single & double quoteChar are escaped
        }
        else { // double quoteChar
            return value.replace(/(?<!\\)'/g, "\\'"); // escape the unescaped single quoteChar, so both single & double quoteChar are escaped
        } // if
    };
    const parseString = () => {
        return (parseQuoteString("'")
            ??
                parseQuoteString('"')
            ??
                parseNudeString());
    };
    const parseAttrSelectorParams = () => {
        const originPos = pos;
        // if (!eatOpeningSquareBracket()) return null; // already eaten by `parseSelectorToken()`
        skipWhitespace();
        const name = parseIdentifierName();
        if (!name) {
            pos = originPos;
            return null;
        } // syntax error: missing name => revert changes & return null
        skipWhitespace();
        const operator = parseAttrSelectorOperator();
        if (!operator) { // name only
            if (!eatClosingSquareBracket()) {
                pos = originPos;
                return null;
            } // syntax error: missing `]` => revert changes & return null
            return [
                name,
            ];
        }
        else { // name=value
            skipWhitespace();
            const value = parseString();
            // an empty value "" -or- '' is possible
            if (value === null) {
                pos = originPos;
                return null;
            } // syntax error: missing value => revert changes & return null
            skipWhitespace();
            const options = parseAttrSelectorOptions();
            if (options) {
                skipWhitespace();
            } // if
            if (!eatClosingSquareBracket()) {
                pos = originPos;
                return null;
            } // syntax error: missing `]` => revert changes & return null
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
    if (!allSelectors)
        return null; // syntax error: no recognized selector(s)
    if (!isEof())
        return null; // syntax error: not all expression are valid selector
    return allSelectors;
};
// tests:
// SelectorParams tests:
export const isWildParams = (selectorParams) => {
    return (typeof (selectorParams) === 'string');
};
export const isAttrSelectorParams = (selectorParams) => {
    return (!isWildParams(selectorParams)
        &&
            /*
                AttrSelectorParams : readonly array : [ AttrSelectorName, AttrSelectorOperator, AttrSelectorValue, AttrSelectorOptions ]
                SelectorList       : mutable  array : [ undefined|null|false...Selector...Selector...[undefined|null|false...SimpleSelector|Combinator]... ]
                
                [0]                : AttrSelectorName | undefined|null|false | Selector
                [0]                : -----string----- | -------others------- | -array--
            */
            (typeof (selectorParams[0]) === 'string') // AttrSelectorParams : the first element (AttrSelectorName) must be a string
    );
};
export const isSelectors = (selectorParams) => {
    return (!isWildParams(selectorParams)
        &&
            /*
                AttrSelectorParams : readonly array : [ AttrSelectorName, AttrSelectorOperator, AttrSelectorValue, AttrSelectorOptions ]
                SelectorList       : mutable  array : [ undefined|null|false...Selector...Selector...[undefined|null|false...SimpleSelector|Combinator]... ]
                
                [0]                : AttrSelectorName | undefined|null|false | Selector
                [0]                : -----string----- | -------others------- | -array--
            */
            (typeof (selectorParams[0]) !== 'string') // SelectorList : the first element (Selector) must be a NON-string or undefined|null|false
    );
};
// SelectorEntry creates & tests:
export const parentSelector = () => ['&' /* no_name */ /* no_param */];
export const universalSelector = () => ['*' /* no_name */ /* no_param */];
const requiredName = (name) => { if (!name)
    throw Error('The `name` cannot be empty.'); return true; };
export const attrSelector = (name, operator, value, options) => {
    requiredName(name);
    if (operator) {
        if (value !== undefined) { // value might be an empty string '', so `undefined` is used for comparison
            if (options) {
                return [
                    '[',
                    null,
                    [
                        name,
                        operator,
                        value,
                        options, // AttrSelectorOptions
                    ],
                ];
            }
            else {
                return [
                    '[',
                    null,
                    [
                        name,
                        operator,
                        value, // AttrSelectorValue
                    ],
                ];
            } // options
        } // if
        throw Error('The `value` must be provided if the `operator` defined.');
    }
    else {
        return [
            '[',
            null,
            [
                name, // AttrSelectorName
            ],
        ];
    } // if operator
};
export const elementSelector = (elmName) => requiredName(elmName) && ['', elmName /* no_param */];
export const idSelector = (id) => requiredName(id) && ['#', id /* no_param */];
export const classSelector = (className) => requiredName(className) && ['.', className /* no_param */];
export const pseudoClassSelector = (className, params) => {
    requiredName(className);
    if (params !== undefined) { // value might be an empty string '', so `undefined` is used for comparison
        return [
            ':',
            className,
            params, // PseudoClassSelectorParams
        ];
    }
    else {
        return [
            ':',
            className, // SelectorName
        ];
    } // if
};
export const pseudoElementSelector = (elmName) => requiredName(elmName) && ['::', elmName /* no_param */];
//#region aliases
export const [createParentSelector, createUniversalSelector, createAttrSelector, createElementSelector, createIdSelector, createClassSelector, createPseudoClassSelector, createPseudoElementSelector,] = [
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
export const isSimpleSelector = (selectorEntry) => !!selectorEntry && (selectorEntry !== true) && (typeof (selectorEntry) !== 'string');
export const isParentSelector = (selectorEntry) => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === '&');
export const isUniversalSelector = (selectorEntry) => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === '*');
export const isAttrSelector = (selectorEntry) => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === '[');
export const isElementSelector = (selectorEntry) => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === '');
export const isIdSelector = (selectorEntry) => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === '#');
export const isClassSelector = (selectorEntry) => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === '.');
export const isPseudoClassSelector = (selectorEntry) => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === ':');
export const isClassOrPseudoClassSelector = (selectorEntry) => isSimpleSelector(selectorEntry) && ['.', ':'].includes(selectorEntry?.[0]);
export const isPseudoElementSelector = (selectorEntry) => isSimpleSelector(selectorEntry) && (selectorEntry?.[0] === '::');
export const isElementOrPseudoElementSelector = (selectorEntry) => isSimpleSelector(selectorEntry) && ['', '::'].includes(selectorEntry?.[0]);
export const isNotParentSelector = (selectorEntry) => !isParentSelector(selectorEntry);
export const isNotUniversalSelector = (selectorEntry) => !isUniversalSelector(selectorEntry);
export const isNotAttrSelector = (selectorEntry) => !isAttrSelector(selectorEntry);
export const isNotElementSelector = (selectorEntry) => !isElementSelector(selectorEntry);
export const isNotIdSelector = (selectorEntry) => !isIdSelector(selectorEntry);
export const isNotClassSelector = (selectorEntry) => !isClassSelector(selectorEntry);
export const isNotPseudoClassSelector = (selectorEntry) => !isPseudoClassSelector(selectorEntry);
export const isNotClassOrPseudoClassSelector = (selectorEntry) => !isClassOrPseudoClassSelector(selectorEntry);
export const isNotPseudoElementSelector = (selectorEntry) => !isPseudoElementSelector(selectorEntry);
export const isNotElementOrPseudoElementSelector = (selectorEntry) => !isElementOrPseudoElementSelector(selectorEntry);
export const isAttrSelectorOf = (selectorEntry, attrName) => isAttrSelector(selectorEntry) && [attrName].flat().includes(selectorEntry?.[2]?.[0]); // [ '['     , null      , [ attrName , op , value , opt ] ]
export const isElementSelectorOf = (selectorEntry, elmName) => isElementSelector(selectorEntry) && [elmName].flat().includes(selectorEntry?.[1]); // [ ''      , elmName   ]
export const isIdSelectorOf = (selectorEntry, id) => isIdSelector(selectorEntry) && [id].flat().includes(selectorEntry?.[1]); // [ '#'     , id        ]
export const isClassSelectorOf = (selectorEntry, className) => isClassSelector(selectorEntry) && [className].flat().includes(selectorEntry?.[1]); // [ '.'     , className ]
export const isPseudoClassSelectorOf = (selectorEntry, className) => isPseudoClassSelector(selectorEntry) && [className].flat().includes(selectorEntry?.[1]); // [ ':'     , className ]
export const isClassOrPseudoClassSelectorOf = (selectorEntry, className) => isClassOrPseudoClassSelector(selectorEntry) && [className].flat().includes(selectorEntry?.[1]); // [ '.'|':' , className ]
export const isPseudoElementSelectorOf = (selectorEntry, elmName) => isPseudoElementSelector(selectorEntry) && [elmName].flat().includes(selectorEntry?.[1]); // [ '::'    , elmName   ]
export const isElementOrPseudoElementSelectorOf = (selectorEntry, elmName) => isElementOrPseudoElementSelector(selectorEntry) && [elmName].flat().includes(selectorEntry?.[1]); // [ ''|'::' , elmName   ]
export const combinator = (combinator) => combinator;
//#region aliases
export const [createCombinator,] = [
    combinator,
];
//#endregion aliases
export const isCombinator = (selectorEntry) => (typeof (selectorEntry) === 'string');
export const isCombinatorOf = (selectorEntry, combinator) => isCombinator(selectorEntry) && [combinator].flat().includes(selectorEntry);
// SimpleSelector & Selector creates & tests:
export const selector = (...selectorEntries) => selectorEntries;
export const pureSelector = (...selectorEntries) => selectorEntries;
export const selectorList = (...selectors) => selectors;
export const pureSelectorList = (...selectors) => selectors;
//#region aliases
export const [createSelector, createPureSelector, createSelectorList, createPureSelectorList,] = [
    selector,
    pureSelector,
    selectorList,
    pureSelectorList,
];
//#endregion aliases
export const isNotEmptySelectorEntry = (selectorEntry) => {
    /*
        SimpleSelector : [ SelectorToken, SelectorName, SelectorParams ]
        Combinator     : non_empty string
    */
    return !!selectorEntry && (selectorEntry !== true);
};
export const isSelector = (test) => {
    /*
        SimpleSelector : [ SelectorToken, SelectorName, SelectorParams ]
        Selector       : [ SimpleSelector...(SimpleSelector|Combinator)... ]
    */
    return !!test && (test !== true) && (typeof (test[0]) !== 'string'); // Selector : the first element (SelectorEntry) must be a NON-string, the Combinator is guaranteed NEVER be the first element
};
export const isNotEmptySelector = (selector) => !!selector && (selector !== true) && selector.some(isNotEmptySelectorEntry);
export const isNotEmptySelectors = (selectors) => !!selectors && (selectors !== true) && selectors.some(isNotEmptySelector);
export const countSelectorEntries = (selector) => (!!selector && (selector !== true) && selector.filter(isNotEmptySelectorEntry).length) || 0;
export const countSelectors = (selectors) => (!!selectors && (selectors !== true) && selectors.filter(isNotEmptySelector).length) || 0;
// renders:
export const selectorParamsToString = (selectorParams) => {
    if ((!selectorParams || (selectorParams === true)) && (selectorParams !== ''))
        return ''; // filter out undefined|null|false
    // note: an empty string (selectorParams === '') is considered a valid WildParams
    if (isWildParams(selectorParams)) {
        return `(${selectorParams})`;
    }
    else if (isAttrSelectorParams(selectorParams)) {
        const [name, operator, value, options,] = selectorParams;
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
export const selectorToString = (selector) => {
    return (selector
        .filter(isNotEmptySelectorEntry) // remove empty SelectorEntry(es) in Selector
        .map((selectorEntry) => {
        if (isSimpleSelector(selectorEntry)) {
            const [selectorToken, selectorName, selectorParams,] = selectorEntry;
            if (selectorToken === '[') { // AttrSelectorToken
                return selectorParamsToString(selectorParams);
            }
            else {
                return `${selectorToken}${selectorName ?? ''}${selectorParamsToString(selectorParams)}`;
            } // if
        } // if SimpleSelector
        return selectorEntry;
    })
        .join(''));
};
export const selectorsToString = (selectors) => {
    return (selectors
        .filter(isNotEmptySelector) // remove empty Selector(s) in SelectorList, we don't want to join some rendered empty string '' => `.boo , , #foo`
        .map(selectorToString)
        .join(', '));
};
/**
 * Creates a new `SelectorList` populated with the results of calling a provided `callbackFn` on every `SimpleSelector` in the `selectors`.
 * The nested `SimpleSelector` (if any) will also be passed to `callbackFn`.
 * The `Combinator` and its nested (if any) will not be passed to `callbackFn`.
 * @param selectors The input `SelectorList`.
 * @param callbackFn A function that is called for every `SimpleSelector` in the `selectors`.
 * Each time `callbackFn` executes, the returned value is added to the output `SelectorList`.
 * @returns The output `SelectorList`.
 */
export const flatMapSelectors = (selectors, callbackFn) => {
    return (selectors
        .filter(isNotEmptySelector) // remove empty Selector(s) in SelectorList
        .map((selector) => // mutates a `Selector` to another `Selector`
     selector
        .filter(isNotEmptySelectorEntry) // remove empty SelectorEntry(es) in Selector
        .flatMap((selectorEntry) => {
        if (isSimpleSelector(selectorEntry)) {
            let callbackResult = callbackFn(selectorEntry);
            if (callbackResult === true)
                callbackResult = null;
            let replacement = callbackResult || selectorEntry;
            if (replacement === selectorEntry) { // if has not been replaced by `callbackFn` (same by reference)
                const [selectorToken, selectorName, selectorParams,] = selectorEntry;
                if (selectorParams && isSelectors(selectorParams)) {
                    const oldSelectors = selectorParams;
                    const newSelectors = flatMapSelectors(oldSelectors, callbackFn); // recursively map the `oldSelectors`
                    replacement = [
                        selectorToken,
                        selectorName,
                        newSelectors,
                    ];
                } // if
            } // if
            return isSelector(replacement) ? replacement /* as Selector */ : createSelector(replacement) /* createSelector(as SimpleSelector) as Selector */;
        } // if SimpleSelector
        return createSelector(selectorEntry);
    })));
};
export { flatMapSelectors as mutateSelectors };
const defaultGroupSelectorOptions = {
    selectorName: 'is',
    cancelGroupIfSingular: false
};
export const groupSelectors = (selectors, options = defaultGroupSelectorOptions) => {
    if (!isNotEmptySelectors(selectors))
        return pureSelectorList(selector(...[] // an empty Selector
        )); // empty selectors => nothing to group => return a SelectorList with an empty Selector
    const selectorsWithoutPseudoElm = selectors.filter(isNotEmptySelector).filter((selector) => selector.every(isNotPseudoElementSelector)); // not contain ::pseudo-element
    const selectorsOnlyPseudoElm = selectors.filter(isNotEmptySelector).filter((selector) => selector.some(isPseudoElementSelector)); // do  contain ::pseudo-element
    if (!isNotEmptySelectors(selectorsWithoutPseudoElm))
        return pureSelectorList(selector(...[] // an empty Selector
        ), ...selectorsOnlyPseudoElm); // empty selectors => nothing to group => return a SelectorList with an empty Selector
    const { selectorName: targetSelectorName = defaultGroupSelectorOptions.selectorName, cancelGroupIfSingular = defaultGroupSelectorOptions.cancelGroupIfSingular, } = options;
    return pureSelectorList(((cancelGroupIfSingular && (selectorsWithoutPseudoElm.length < 2))
        ?
            selectorsWithoutPseudoElm?.[0]
        :
            selector(pseudoClassSelector(targetSelectorName, selectorsWithoutPseudoElm))), ...selectorsOnlyPseudoElm);
};
export const groupSelector = (selector, options = defaultGroupSelectorOptions) => {
    return groupSelectors(selectorList(selector), options);
};
const defaultUngroupSelectorOptions = {
    selectorName: ['is', 'where'],
};
export const ungroupSelector = (selector, options = defaultUngroupSelectorOptions) => {
    if (!selector || (selector === true))
        return pureSelectorList(...[]); // nothing to ungroup => return an empty SelectorList
    const filteredSelector = selector.filter(isNotEmptySelectorEntry);
    if (filteredSelector.length === 1) {
        const selectorEntry = filteredSelector[0]; // get the only one SelectorEntry
        if (isPseudoClassSelector(selectorEntry)) {
            const { selectorName: targetSelectorName = defaultUngroupSelectorOptions.selectorName, } = options;
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
                string       = the parameter of pseudo class selector, eg: nth-child(2n+3) => '2n+3'
                array        = [name, operator, value, options] of attribute selector, eg: [data-msg*="you & me" i] => ['data-msg', '*=', 'you & me', 'i']
                SelectorList = nested selector(s) of pseudo class [:is(...), :where(...), :not(...)]
            */
            selectorParams,] = selectorEntry;
            if (targetSelectorName.includes(selectorName)
                &&
                    selectorParams && isSelectors(selectorParams)) {
                return ungroupSelectors(selectorParams, options); // recursively ungroup sub-selectors
            } // if
        } // if
    } // if
    return pureSelectorList(filteredSelector);
};
export const ungroupSelectors = (selectors, options = defaultUngroupSelectorOptions) => {
    if (!selectors || (selectors === true))
        return pureSelectorList(...[]); // nothing to ungroup => return an empty SelectorList
    return selectors.filter(isNotEmptySelector).flatMap((selector) => ungroupSelector(selector, options));
};
export const calculateSpecificity = (selector) => {
    return (selector
        .filter(isSimpleSelector) // filter out Combinator(s)
        .reduce((accum, simpleSelector, index, array) => {
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
            string       = the parameter of pseudo class selector, eg: nth-child(2n+3) => '2n+3'
            array        = [name, operator, value, options] of attribute selector, eg: [data-msg*="you & me" i] => ['data-msg', '*=', 'you & me', 'i']
            SelectorList = nested selector(s) of pseudo class [:is(...), :where(...), :not(...)]
        */
        selectorParams,] = simpleSelector;
        if (selectorToken === ':') {
            switch (selectorName) {
                case 'is':
                case 'not':
                case 'has': {
                    if (!selectorParams || !isSelectors(selectorParams))
                        return accum; // no changes
                    const moreSpecificities = (selectorParams
                        .filter(isNotEmptySelector) // remove empty Selector(s) in SelectorList
                        .map((selectorParam) => calculateSpecificity(selectorParam)));
                    const maxSpecificity = moreSpecificities.reduce((accum, current) => {
                        if ((current[0] > accum[0])
                            ||
                                (current[1] > accum[1])
                            ||
                                (current[2] > accum[2]))
                            return current;
                        return accum;
                    }, [0, 0, 0]);
                    return [
                        accum[0] + maxSpecificity[0],
                        accum[1] + maxSpecificity[1],
                        accum[2] + maxSpecificity[2]
                    ];
                }
                case 'where':
                    return accum; // no changes
            } // switch
        } // if
        switch (selectorToken) {
            case '#': // ID selector
                array.splice(1); // eject early by mutating iterated copy - it's okay to **mutate** the `array` because it already cloned at `filter(isSimpleSelector)`
                return [
                    accum[0] + 1,
                    accum[1],
                    accum[2]
                ];
            case '.': // class selector
            case '[': // attribute selector
            case ':': // pseudo class selector
                return [
                    accum[0],
                    accum[1] + 1,
                    accum[2]
                ];
            case '': // element selector
            case '::': // pseudo element selector
                return [
                    accum[0],
                    accum[1],
                    accum[2] + 1
                ];
            case '&': // parent selector
            case '*': // universal selector
            default:
                return accum; // no changes
        } // switch
    }, [0, 0, 0]));
};
