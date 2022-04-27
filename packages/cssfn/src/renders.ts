// cssfn:
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
    
    CssKeyframes,
    
    CssSelector,
    CssSelectorCollection,
    CssSelectorOptions,
    
    CssRawSelector,
    CssFinalSelector,
    
    CssClassName,
    
    CssScopeName,
    CssScopeEntry,
}                           from '@cssfn/css-types'

// internals:
import type {
    // types:
    StyleSheet,
}                           from './styleSheets.js'
import {
    isMergeableNestedAtRule,
    mergeStyles,
}                           from './mergeStyles.js'
import {
    rule,
    rules,
}                           from './cssfn.js'

// other libs:
import {
    // tests:
    default as warning,
}                           from 'tiny-warning'
import {
    camelCase,
}                           from 'camel-case'



// utilities:
const fastHash = (input: string) => {
    let hash = 0, i, chr;
    for (i = 0; i < input.length; i++) {
        chr   = input.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    } // for
    
    hash = Math.abs(hash);
    return hash.toString(36).slice(-5); // get the last 5 characters
};

const takenHashes = new Map</*hash :*/string, /*owner :*/string>();
export const generateId = (styleSheetId: string, scopeName: CssScopeName): string => {
    const mySelf = `${styleSheetId}${scopeName}`;
    let   myHash = fastHash(mySelf);
    
    
    
    const maxCounter  = 1e10;
    let   counterSalt = 2;
    for (; counterSalt <= maxCounter; counterSalt++) {
        // get the owner of current hash (if already taken):
        const owner = takenHashes.get(myHash);
        
        // the hash is already taken by myself => return myHash:
        if (owner === mySelf) return myHash;
        
        // the owner is free => claim it => return myHash:
        if (owner === undefined) {
            takenHashes.set(myHash, mySelf);
            return myHash;
        } // if
        
        // try to re-generate a unique hash by adding a counter salt (not SSR friendly):
        myHash = fastHash(`${mySelf}${counterSalt}`);
        if ((counterSalt === 2) && (styleSheetId !== '')) {
            warning(false, `[cssfn] The styleSheetId of ${styleSheetId} is not a unique ID. Please re-generate another random ID.`);
        } // if
    } // for
    
    
    
    warning(false, `[cssfn] You might have a memory leak. ID counter is at ${counterSalt}.`);
    return myHash;
};

const conditionalNestedAtRules = ['@media', '@supports', '@document'];
export const isConditionalNestedAtRules = (finalSelector: CssFinalSelector) => conditionalNestedAtRules.some((at) => finalSelector.startsWith(at));



type RuleEntry = readonly [CssFinalSelector, CssStyle]
class RenderRule {
    //#region protected fields
    protected rendered : string[]
    //#endregion protected fields
    
    //#region public fields
    get result() : string|null {
        return this.rendered.join('');
    }
    //#endregion public fields
    
    
    
    //#region protected methods
    protected appendRendered(rendered: string|null): void {
        if (!rendered) return;
        this.rendered.push(rendered);
    }
    
    protected renderPropName(propName: string): string {
        return camelCase(propName);
    }
    protected renderPropValue(propValue: CssCustomValue): string {
        return `${propValue}`;
    }
    protected renderProp(propName: string, propValue: CssCustomValue): void {
        const rendered = this.rendered;
        rendered.push(this.renderPropName(propName));
        rendered.push(': ');
        rendered.push(this.renderPropValue(propValue));
        rendered.push(';\n');
    }
    
    protected renderSelector(finalSelector: CssFinalSelector|null, renderfinalStyle: () => void): void {
        if (!finalSelector) {
            renderfinalStyle();
            return;
        } // if
        
        
        
        const rendered = this.rendered;
        rendered.push(finalSelector);
        rendered.push(' {\n');
        {
            renderfinalStyle();
        }
        rendered.push('\n}\n\n');
    }
    protected renderStyle(finalStyle: CssStyle|null): void {
        this.renderFallbacksRules(finalStyle);
        
        
        
        if (!finalStyle) return;
        for (const propName in finalStyle) {
            this.renderProp(propName, (finalStyle as any)[propName])
        } // for
    }
    protected renderRule(finalSelector: CssFinalSelector|null, finalStyle: CssStyle|null): void {
        this.renderSelector(finalSelector, () => {
            this.renderStyle(finalStyle);
        });
    }
    
    protected renderFallbacksRules(nestedRules: CssRule|null): void {
        if (!nestedRules) return;
        for (const symbolProp of Object.getOwnPropertySymbols(nestedRules)) {
            const ruleData = nestedRules[symbolProp];
            if (ruleData === undefined) continue;
            const [finalSelector, finalStyle] = ruleData;
            if (finalSelector === '@fallbacks') continue;
            if ((finalStyle === null) || (typeof(finalStyle) !== 'object') || Array.isArray(finalStyle)) continue;
            
            
            
            this.renderStyle(finalStyle);
        } // for
    }
    protected renderNestedRules(finalParentSelector: CssFinalSelector|null, nestedRules: CssRule|null): void {
        if (!nestedRules) return;
        for (const symbolProp of Object.getOwnPropertySymbols(nestedRules)) {
            const ruleData = nestedRules[symbolProp];
            if (ruleData === undefined) continue;
            const [finalSelector, finalStyle] = ruleData;
            if (typeof(finalSelector) !== 'string') continue;
            if (finalSelector === '@fallbacks') continue;
            if ((finalStyle === null) || (typeof(finalStyle) !== 'object') || Array.isArray(finalStyle)) continue;
            
            
            
            if (finalSelector === '@global') { // special @global rule
                this.appendRendered(
                    (new RenderRule(null, finalStyle)).result
                );
            }
            else if (isConditionalNestedAtRules(finalSelector)) {
                /*
                    for non-@global parent:
                    
                    from:
                    .parent {                                // parentRule
                        .awesome { fontSize: 'small' }
                        @media (min-width: 1024px) {         // nested conditional
                            .awesome { fontSize: 'large' }   // the nestedStyles
                        }
                    }
                    
                    to:
                    .parent {
                        .awesome { fontSize: 'small' }
                    }
                    @media (min-width: 1024px) {             // move up the nestedSelectorStr
                        .parent {                            // duplicate the parentRule selector
                            .awesome { fontSize: 'large' }   // move the nestedStyles
                        }
                    }
                    
                    
                    
                    for @global parent:
                    
                    from:
                    @global {                                // parentRule
                        .awesome { fontSize: 'small' }
                        @media (min-width: 1024px) {         // nested conditional
                            .awesome { fontSize: 'large' }   // the nestedStyles
                        }
                    }
                    
                    to:
                    @global {
                        .awesome { fontSize: 'small' }
                    }
                    @media (min-width: 1024px) {             // move up the nestedSelectorStr
                        .awesome { fontSize: 'large' }       // keep the nestedStyles
                    }
                */
            }
            else {
                // at rule  , eg: @keyframes, @font-face
                // prop rule, eg: `from`, `to`, `25%`
                
                this.appendRendered(
                    (new RenderRule(finalSelector, finalStyle)).result
                );
            } // if
        } // for
    }
    //#endregion protected methods
    
    
    
    constructor(finalSelector: CssFinalSelector|null, finalStyle: CssStyle|null) {
        this.rendered = [];
        this.renderRule(finalSelector, finalStyle);
        this.renderNestedRules(finalSelector, finalStyle);
    }
}



export const render = (styleSheet: StyleSheet): string|null => {
    if (!styleSheet.enabled) return null;
    
    
    
    const scopesFactory = styleSheet.scopes;
    const scopeList = (typeof(scopesFactory) === 'function') ? scopesFactory() : scopesFactory;
    
    const styleSheetId = styleSheet.id;
    const classes      = styleSheet.classes;
    
    const scopeRules : CssRule[] = scopeList.map(([scopeName, styles]): CssRule|null => {
        // generate unique class:
        const uniqueClass    : CssClassName     = generateId(styleSheetId, scopeName);
        const uniqueSelector : CssFinalSelector = `.${uniqueClass}`;
        
        // map each scopeName => uniqueClass:
        classes[scopeName] = uniqueClass;
        
        // render the styles to single style:
        const style = mergeStyles(styles);
        if(!style) return null;
        
        // the top level rule (scope rule):
        return rule(
            uniqueSelector,
            style
        );
    }).filter((rule): rule is CssRule => !!rule);
    const styleSheetRule = rules(scopeRules);
    
    
    
    // finally, render the structures:
    return (new RenderRule(null, styleSheetRule)).result;
}