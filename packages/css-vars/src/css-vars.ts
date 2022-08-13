// cssfn:
import type {
    // types:
    OptionalOrBoolean,
    Dictionary,
}                           from '@cssfn/types'
import type {
    // css custom properties:
    CssCustomName,
    CssCustomSimpleRef,
    CssCustomRef,
    CssCustomValue,
}                           from '@cssfn/css-types'

// other libs:
import {
    // tests:
    isBrowser,
    isJsDom,
}                           from 'is-in-browser'
import {
    // tests:
    default as warning,
}                           from 'tiny-warning'



const isClientSide : boolean = isBrowser || isJsDom;



// types:
export type CssVars<TCssCustomProps extends {}>            = Readonly<{ [Key in keyof TCssCustomProps]: CssCustomSimpleRef  }>
export type CssVarsWithOptions<TCssCustomProps extends {}> = readonly [CssVars<TCssCustomProps>, LiveCssVarsOptions]



// options:
export interface CssVarsOptions {
    /**
     * The prefix name of the generated css vars.
     */
    prefix ?: string
    
    /**
     * Replaces the original name with an unique shorter name.
     */
    minify ?: boolean
}
const defaultOptions : Required<CssVarsOptions> = {
    prefix : '',
    minify : true,
}
class LiveCssVarsOptions implements Required<CssVarsOptions> {
    //#region public options
    prefix : string
    minify : boolean
    //#endregion public options
    
    
    
    //#region constructors
    constructor(options?: CssVarsOptions) {
        this.prefix = options?.prefix ?? defaultOptions.prefix;
        this.minify = options?.minify ?? defaultOptions.minify;
    }
    //#endregion constructors
}



// global proxy's handlers:
const unusedObj = {}
const setReadonlyHandler = (_unusedObj: any, propName: string|symbol, _newValue: any): boolean => {
    throw new Error(`Setter \`${String(propName)}\` is not supported.`);
}



let globalIdCounter = 0; // should not be incremented on server side



/**
 * Declares & retrieves *css variables* (css custom properties).
 */
export const cssVars = <TCssCustomProps extends {}>(options: CssVarsOptions = defaultOptions): CssVarsWithOptions<TCssCustomProps> => {
    // options:
    const liveOptions = new LiveCssVarsOptions(options);
    
    
    
    // data generates:
    
    const idMap = new Map<string, number>();
    
    /**
     * Gets the *declaration name* of the specified `propName`, eg: `--my-favColor`.
     * @param propName The prop name to retrieve.
     * @returns A `CssCustomName` represents the declaration name of the specified `propName`.
     */
    const decl = (propName: string): CssCustomName => {
        if (process.env.NODE_ENV === 'dev') {
            warning(
                isClientSide        // must run in browser
                ||                  // or
                !liveOptions.minify // not minified
                ,
                '`css-vars` with option `minify = true (default)` is not supported to be fetched on server side. Assign an option `{ minify: false }` to fix it.'
            )
        } // if
        
        
        
        const name = (
            liveOptions.minify
            ?
            `v${((): number => {
                let id = idMap.get(propName);
                if (id === undefined) {
                    id = (++globalIdCounter);
                    idMap.set(propName, id);
                } // if
                return id;
            })()}`
            :
            propName
        );
        
        return liveOptions.prefix ? `--${liveOptions.prefix}-${name}` : `--${name}`; // add double dash with prefix `--prefix-` or double dash without prefix `--`
    };
    
    /**
     * Gets the *value* (reference) of the specified `propName`, not the *direct* value, eg: `var(--my-favColor)`.
     * @param propName The prop name to retrieve.
     * @returns A `CssCustomSimpleRef` represents the expression for retrieving the value of the specified `propName`.
     */
    const ref = (propName: string): CssCustomSimpleRef => {
        return `var(${decl(propName)})`;
    };
    
    
    
    return [
        // data proxy:
        new Proxy<Dictionary<CssCustomSimpleRef>>(unusedObj, {
            get : (_unusedObj, propName: string|symbol): string|undefined => {
                // ignores symbol & number props:
                if (typeof(propName) !== 'string') return undefined;
                
                
                
                return ref(propName);
            },
            set : setReadonlyHandler,
        }) as CssVars<TCssCustomProps>,
        
        
        
        // options:
        liveOptions,
    ];
}
export {
    cssVars as default,
    cssVars as createCssVars,
}



// utilities:
const renderPropValue = (propValue: CssCustomValue): { rendered: string, hasImportant: boolean } => {
    if (!Array.isArray(propValue)) {
        if (typeof(propValue) === 'number') return { rendered: `${propValue}`, hasImportant: false }; // CssSimpleNumericValue => number => convert to string
        if (typeof(propValue) === 'string') return { rendered:    propValue  , hasImportant: false }; // CssSimpleLiteralValue|CssCustomRef => string
        return { rendered: propValue.toString(), hasImportant: false } // CssCustomKeyframesRef => toString();
    } // if
    
    
    
    let hasImportant = false;
    return {
        rendered : (
            propValue
            .map((propSubValue, index, array): string|null => {
                if (!Array.isArray(propSubValue)) {
                    if (typeof(propSubValue) === 'number') return `${propSubValue}`; // CssSimpleNumericValue => number => convert to string
                    if ((index === (array.length - 1)) && (propSubValue === '!important')) {
                        hasImportant = true;
                        return null; // do not comma_separated_!important
                    }
                    if (typeof(propSubValue) === 'string') return propSubValue; // CssSimpleLiteralValue|CssCustomRef => string
                    return propSubValue.toString(); // CssCustomKeyframesRef => toString();
                } // if
                
                
                
                return (
                    propSubValue
                    .map((propSubSubValue): string => {
                        if (typeof(propSubSubValue) === 'number') return `${propSubSubValue}`; // CssSimpleNumericValue => number => convert to string
                        if (typeof(propSubSubValue) === 'string') return propSubSubValue; // CssSimpleLiteralValue|CssCustomRef => string
                        return propSubSubValue.toString(); // CssCustomKeyframesRef => toString();
                    })
                    .join(' ') // space_separated_values
                );
            })
            .filter((propSubValue): propSubValue is string => (propSubValue !== null))
            .join(', ') // comma_separated_values
        ),
        hasImportant
    };
};
const filterEmptyVars = (next: OptionalOrBoolean<CssCustomRef|CssCustomValue>): next is CssCustomRef|CssCustomValue => !!next && (next !== true)
export const switchOf = (first: CssCustomRef, ...nexts: [...OptionalOrBoolean<CssCustomRef>[], OptionalOrBoolean<CssCustomRef|CssCustomValue>]|[]): CssCustomRef => {
    // conditions:
    if (!nexts || !nexts.length) return first;
    const nextsAbs = nexts.filter(filterEmptyVars) as (CssCustomRef|CssCustomValue)[];
    if (!nextsAbs.length) return first;
    
    
    
    const refs : (CssCustomRef|CssCustomValue)[] = [first, ...nextsAbs];
    let totalClosingCount = 0;
    let hasImportantValue = false;
    return (
        refs
        .map((ref, index): string => {
            if ((typeof(ref) !== 'string') || !ref.startsWith('var(--')) {
                const {rendered, hasImportant} = renderPropValue(ref);
                if (hasImportant) hasImportantValue = true;
                return rendered;
            } // if
            
            
            
            if (ref.endsWith('!important')) {
                hasImportantValue = true;
                ref = ref.replace(/\s*!important/, '');
            } // if
            
            const closingCount = (ref.match(/\)+$/)?.[0]?.length ?? 0);
            totalClosingCount += closingCount;
            
            return (
                ref.slice(0, - closingCount)
                +
                ((index < (refs.length - 1)) ? ', ' : '') // add a comma except the last one
            );
        })
        .join('')
        +
        (new Array(/*arrayLength: */totalClosingCount)).fill(')').join('')
        +
        (hasImportantValue ? ' !important' : '')
    ) as CssCustomRef;
}
