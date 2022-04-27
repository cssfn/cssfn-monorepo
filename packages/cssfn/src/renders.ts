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
    mergeStyles,
}                           from './mergeStyles.js'

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



type RuleEntry = readonly [CssFinalSelector, CssStyleCollection]
class RenderRules {
    //#region private fields
    #rendered : string[]
    //#endregion private fields
    
    //#region public fields
    readonly result : string|null
    //#endregion public fields
    
    
    
    //#region private methods
    #renderPropName(propName: string): string {
        return camelCase(propName);
    }
    #renderPropValue(propValue: CssCustomValue): string {
        return `${propValue}`;
    }
    #renderProp(propName: string, propValue: CssCustomValue): void {
        const rendered = this.#rendered;
        rendered.push(this.#renderPropName(propName));
        rendered.push(': ');
        rendered.push(this.#renderPropValue(propValue));
        rendered.push(';\n');
    }
    #renderNested(finalStyle: CssStyle): void {
        for (const symbolProp of Object.getOwnPropertySymbols(finalStyle)) {
            const ruleData = finalStyle[symbolProp];
            if (ruleData === undefined) continue;
            const [selector, styles] = ruleData;
            if (typeof(selector) !== 'string') continue;
            if (Array.isArray(styles)) continue;
            if (typeof(styles) === 'function') continue;
            if (!styles || (styles === true)) continue;
            const nestedFinalStyle = styles;
            
            
            
            if (selector === '@fallbacks') {
                this.#renderStyle(nestedFinalStyle);
            }
            else if (selector === '@global') {
                //
            }
            else if (selector.startsWith('@keyframes ')) {
                
            }
        } // for
    }
    #renderStyle(finalStyle: CssStyle): void {
        for (const propName in finalStyle) {
            this.#renderProp(propName, (finalStyle as any)[propName])
        } // for
    }
    #renderRule(finalSelector: CssFinalSelector, finalStyle: CssStyle): void {
        const rendered = this.#rendered;
        rendered.push(finalSelector);
        rendered.push(' {\n');
        {
            this.#renderNested(finalStyle);
            this.#renderStyle(finalStyle);
        }
        rendered.push('\n}\n\n');
    }
    //#endregion private methods
    
    
    
    constructor(rules: RuleEntry[]) {
        this.#rendered = [];
        for (const [finalSelector, styles] of rules) {
            const finalStyle = mergeStyles(styles);
            if (!finalStyle) continue; // blank style => nothing to render
            
            
            
            this.#renderRule(finalSelector, finalStyle);
        } // for
        
        
        
        this.result = this.#rendered.join('') || null;
    }
}



export const render = (styleSheet: StyleSheet): string|null => {
    if (!styleSheet.enabled) return null;
    
    
    
    const scopesFactory = styleSheet.scopes;
    const scopeList = (typeof(scopesFactory) === 'function') ? scopesFactory() : scopesFactory;
    
    const styleSheetId = styleSheet.id;
    const classes      = styleSheet.classes;
    
    const rules : RuleEntry[] = scopeList.map(([scopeName, styles]): RuleEntry => {
        // generate unique class:
        const uniqueClass    : CssClassName     = generateId(styleSheetId, scopeName);
        const uniqueSelector : CssFinalSelector = `.${uniqueClass}`;
        
        // map each scopeName => uniqueClass:
        classes[scopeName] = uniqueClass;
        
        return [
            uniqueSelector,
            styles,
        ];
    });
    
    
    
    // finally, render the structures:
    return (new RenderRules(rules)).result;
}