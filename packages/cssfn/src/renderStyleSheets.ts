// Cssfn:
import {
    // Cssfn properties:
    type CssRule,
    type CssRuleCollection,
    
    type CssFinalSelector,
    
    type CssClassName,
    
    type CssScopeName,
    type CssScopeEntry,
    type CssScopeList,
    type CssScopeMap,
}                           from '@cssfn/css-types'
import {
    // Utilities:
    browserInfo,
    createCssPropAutoPrefix,
}                           from '@cssfn/css-prop-auto-prefix'

// Internals:
import {
    // Types:
    type StyleSheetsFactoryBase,
    type StyleSheet,
}                           from './styleSheets.js'
import {
    // Rules:
    rule,
    
    
    
    // Rule shortcuts:
    atGlobal,
}                           from './cssfn.js'
import {
    renderRule,
}                           from './renderRules.js'



// Utilities:
const cssPropAutoPrefix = createCssPropAutoPrefix(browserInfo);



// Processors:

/**
 * Resolves a `CssScopeList<>` from a potentially deferred or module-wrapped source.
 * Ensures the final result is fully resolved for serialization and worker communication.
 */

/**
 * Resolves a `CssScopeList<>` from a potentially module-wrapped source.
 * - If the source contains a `default` import, it returns the default value.
 * - Directly returns the input if it is already a `CssScopeList<>` or `null`.
 * - No `await` is needed here since this function only deals with already-resolved values.
 */
const resolveStaticScopeList   = <TCssScopeName extends CssScopeName = CssScopeName>(scopeSource: Exclude<StyleSheetsFactoryBase<TCssScopeName>, Function | Promise<unknown>>): CssScopeList<CssScopeName> | null => {
    // Validate and normalize scope source:
    if (!scopeSource || (typeof scopeSource !== 'object') || !('default' in scopeSource)) return scopeSource;
    
    
    
    // Directly returns the input:
    return scopeSource.default;
};

/**
 * Resolves a `CssScopeList<>` from a potentially deferred source.
 * - If the source is a `Promise<>`, `await scopeSource` ensures it is fully resolved.
 * - Once awaited, it is passed to `resolveStaticScopeList()` for extraction.
 * - Ensures that deferred values are resolved properly before processing.
 */
const resolveDeferredScopeList = async <TCssScopeName extends CssScopeName = CssScopeName>(scopeSource: Exclude<StyleSheetsFactoryBase<TCssScopeName>, Function>): Promise<CssScopeList<CssScopeName> | null> => {
    if (!(scopeSource instanceof Promise)) return resolveStaticScopeList(scopeSource);
    
    
    
    // Await resolution before extracting scope list:
    const awaitedScopeSource = await scopeSource;
    return resolveStaticScopeList(awaitedScopeSource);
};

/**
 * Resolves any stylesheet factory input into a fully resolved `CssScopeList<>`.
 * - If the source is **already a static value**, it is directly passed to `resolveDeferredScopeList()`.
 * - If the source is a **function**, it is executed (`scopeSource()`).
 * - If `scopeSource()` returns a `Promise<>`, `await resolvedScope` ensures it is fully resolved.
 * - Guarantees that the final value is correctly resolved for serialization and worker communication.
 */
const resolveScopeList         = async <TCssScopeName extends CssScopeName = CssScopeName>(scopeSource: StyleSheetsFactoryBase<TCssScopeName>): Promise<CssScopeList<CssScopeName> | null> => {
    // Directly resolve non-lazy values:
    if (typeof scopeSource !== 'function') return resolveDeferredScopeList(scopeSource);
    
    
    
    // Execute the factory function to get the actual scope definition:
    const resolvedScope = scopeSource();
    
    
    
    // Extract immediately if not a Promise:
    if (!(resolvedScope instanceof Promise)) return resolveStaticScopeList(resolvedScope);
    
    
    
    // Await resolution before extracting scope list:
    const awaitedScopeSource = await resolvedScope;
    return resolveStaticScopeList(awaitedScopeSource);
};


/**
 * Resolves a scoped style definition into a `CssRule` object with a uniquely stable CSS class selector.
 * 
 * This function is used in `scopeList.map(resolveCssRule, scopeMap)`, where `scopeMap` provides the context (`this`).
 * Since `scopeMap` is passed as `this`, a standard function definition is required instead of an arrow function.
 * 
 * Example output (pseudo code):
 * `.header-unique-123 { color: red; opacity: 0.5; }`
 * 
 * @param this - Contextual `CssScopeMap` providing unique stable CSS class mappings.
 * @param scopeEntry - A tuple representing a scoped style entry.
 * @returns A `CssRule` object, or `null` if unscoped.
 */
function resolveCssRule<TCssScopeName extends CssScopeName = CssScopeName>(this: CssScopeMap<TCssScopeName>, scopeEntry: CssScopeEntry<TCssScopeName>): CssRule | null {
    // Extract scope entry properties:
    const [
        scopeName, // The scope name       , e.g. 'header'.
        styles,    // The style definition , e.g. `{ color: 'red', opacity: 0,5 }`.
        options,   // The style options    , e.g. `{ performGrouping: false, minSpecificityWeight: 3 }`.
    ] = scopeEntry;
    
    
    
    // Handle unscoped styles (@global rules):
    if (scopeName === '') {
        // The `atGlobal` rule applies bare styles that may globally affect styling:
        return atGlobal(
            styles
        );
    } // if
    
    
    
    // Generate a uniquely stable CSS class name:
    const uniqueClass    : CssClassName     = this[scopeName]; // Computed within `CssScopeMap`.
    
    
    
    // Convert class name to a CSS selector:
    const uniqueSelector : CssFinalSelector = `.${uniqueClass}`;
    
    
    
    // Example of generated CSS rule:
    /*
        ```
        const cssRule = {
            // The symbol prop guarantees uniqueness, allowing the cssRule to be spread 
            // (`{ ...cssRule1, ...cssRule2 }`) into a parent `CssStyle` object, ensuring separate rules.
            [Symbol()]: [
                [selectors, options],
                styles
            ],
        }
        ```
    */
    
    
    
    // Construct the final scoped CSS rule:
    return rule(
        uniqueSelector,
        styles,
        { ...options, performGrouping: false } // Ensures each scoped rule remains distinct.
    );
}

/**
 * Resolves a collection of scoped CSS rules from the provided `styleSheet` object.
 * 
 * - Processes scoped styles to generate unique, stable CSS class mappings.
 * - Ensures proper handling of empty scope lists by returning `null` when no rules exist.
 * - Converts each scope entry into corresponding CSS rules for further rendering.
 * 
 * @param styleSheet - The stylesheet containing scoped definitions and class mappings.
 * @returns A collection of resolved `CssRule` objects, or `null` if no styles exist.
 */
export const resolveCssRuleCollection    = async <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): Promise<CssRuleCollection> => {
    // Resolve scope list from the source:
    const scopeList = await resolveScopeList<TCssScopeName>(styleSheet.scopes);
    
    
    
    // Return `null` if no scoped rules exist:
    if (!scopeList || !scopeList.length) return null;
    
    
    
    // Retrieve `CssScopeMap` for generating unique CSS classes:
    const scopeMap   = styleSheet.classes;
    
    
    
    // Convert each scope entry into corresponding CSS rules:
    const scopeRules = scopeList.map(resolveCssRule, scopeMap);
    
    
    
    // Return the final collection of CSS rules:
    return scopeRules;
};
/**
 * @deprecated Use `resolveCssRuleCollection` instead.  
 */
export const generateRulesFromStyleSheet = resolveCssRuleCollection;

/**
 * Renders a `StyleSheet` object into a valid CSS string that the browser can interpret.
 * 
 * Example output:
 * ```css
 * .header-unique-123 { color: red; opacity: 0.5; }
 * .footer-unique-456 { display: grid; }
 * ```
 * 
 * @param styleSheet - The stylesheet containing scoped CSS definitions.
 * @returns A fully resolved CSS string, or `null` if no styles exist.
 */
export const renderStyleSheet            = async <TCssScopeName extends CssScopeName = CssScopeName>(styleSheet: StyleSheet<TCssScopeName>): Promise<string | null> => {
    // Resolve scoped CSS rules from the stylesheet:
    const scopeRules = await resolveCssRuleCollection(styleSheet);
    
    
    
    // Return `null` if no scoped rules are present:
    if (!scopeRules) return null;
    
    
    
    // Render scoped styles into a CSS string that the browser understands:
    return renderRule(        // `renderRule()` resolves deeply nested `CssStyle` structures into final CSS syntax. This is the most expensive computation.
        scopeRules,           // The list of scoped CSS rules to render.
        { cssPropAutoPrefix } // Auto-prefixing for browser-specific properties (e.g., 'mask' → ['-webkit-mask', '-moz-mask', '-o-mask']).
    );
};
