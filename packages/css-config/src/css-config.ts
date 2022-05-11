// cssfn:
import type {
    ProductOrFactory,
    
    PartialNullish,
    RequiredNotNullish,
    
    ValueOf,
    
    MapOf,
}                           from '@cssfn/types'
import type {
    // css custom properties:
    CssCustomName,
    CssCustomSimpleRef,
    CssCustomValue,
    CssCustomProps,
    
    
    
    // cssfn properties:
    CssProps,
    
    CssRuleData,
    CssRuleMap,
    
    CssStyle,
    CssStyleMap,
    
    CssCustomKeyframesRef,
    CssKeyframesRule,
    CssKeyframesRuleMap,
    
    CssSelector,
}                           from '@cssfn/css-types'
import {
    // rules:
    rule,
    
    
    
    // rule shortcuts:
    atGlobal,
    
    
    
    // style sheets:
    styleSheet,
}                           from '@cssfn/cssfn'
import {
    isFinalSelector,
}                           from '@cssfn/cssfn/dist/utilities.js'
import {
    mergeStyles,
}                           from '@cssfn/cssfn/dist/mergeStyles.js'
import {
    Subject,
}                           from 'rxjs'



// utilities:
const asyncExecute = (
    (typeof(requestAnimationFrame) === 'function')
    ?
    requestAnimationFrame
    :
    (callback: () => void): void => {
        Promise.resolve().then(callback);
    }
);



// general types:
export type CssConfigProps =
    & PartialNullish<{
        [name: string] : CssCustomValue
    }>
    & CssKeyframesRule
    & CssProps // for better js doc
type CssConfigCustomPropsMap =
    & MapOf<RequiredNotNullish<CssCustomProps>>
    & CssKeyframesRuleMap
export type Refs<TConfigProps extends CssConfigProps> = { [Key in keyof TConfigProps]: CssCustomSimpleRef }
export type Vals<TConfigProps extends CssConfigProps> = { [Key in keyof TConfigProps]: CssCustomValue     }

export interface CssConfigOptions {
    /**
     * The prefix name of the generated css vars.
     */
    prefix   ?: string
    
    /**
     * The declaring location (selector) of the generated css vars.
     */
    selector ?: CssSelector
}
const defaultOptions : Required<CssConfigOptions> = {
    prefix    : '',
    selector  : ':root',
}
class LiveCssConfigOptions implements Required<CssConfigOptions> {
    //#region private properties
    #prefix   : string
    #selector : CssSelector
    
    readonly #updatedCallback : () => void
    //#endregion private properties
    
    
    
    //#region constructors
    constructor(updatedCallback: () => void, options?: CssConfigOptions) {
        this.#prefix   = options?.prefix   ?? defaultOptions.prefix;   // an empty prefix   is allowed
        this.#selector = options?.selector || defaultOptions.selector; // an empty selector is not allowed
        
        this.#updatedCallback = updatedCallback;
    }
    //#endregion constructors
    
    
    
    //#region public properties
    get prefix() {
        return this.#prefix;
    }
    set prefix(value: string) {
        // an empty prefix is allowed
        if (this.#prefix === value) return; // no change => no need to update
        
        this.#prefix = value; // update
        this.update(); // notify a css-config updated
    }
    
    get selector() {
        return this.#selector;
    }
    set selector(value: CssSelector) {
        value = value || defaultOptions.selector; // an empty selector is not allowed
        if (this.#selector === value) return; // no change => no need to update
        
        this.#selector = value; // update
        this.update(); // notify a css-config updated
    }
    //#endregion public properties
    
    
    
    //#region public methods
    update() {
        this.#updatedCallback(); // notify a css-config updated
    }
    //#endregion public methods
}

export type CssConfig<TConfigProps extends CssConfigProps> = readonly [Refs<TConfigProps>, Vals<TConfigProps>, LiveCssConfigOptions]



// utilities:
const unusedObj = {};

/**
 * Creates the *declaration name* of the specified `propName`, eg: `--my-favColor`.
 * @param propName The prop name to create.
 * @returns A `CssCustomName` represents the declaration name of the specified `propName`.
 */
const createDecl = (propName: string, options: LiveCssConfigOptions): CssCustomName => {
    // add double dash with prefix `--prefix-` or double dash without prefix `--`
    return options.prefix ? `--${options.prefix}-${propName}` : `--${propName}`;
}

class TransformDuplicatesBuilder<TSrcPropName extends string|number|symbol, TSrcPropValue extends CssCustomValue|CssRuleData|undefined|null,   TRefPropName extends string|number|symbol, TRefPropValue extends CssCustomValue|CssRuleData|undefined|null> {
    //#region private properties
    readonly #srcProps     : Map<TSrcPropName, TSrcPropValue>
    readonly #refProps     : Map<TRefPropName, TRefPropValue>
    readonly #genKeyframes : Map<string, string>|null
    readonly #options      : LiveCssConfigOptions|null
    //#endregion private properties
    
    //#region public properties
    readonly #result       : (Map<TSrcPropName, Exclude<TSrcPropValue, undefined|null>|CssCustomValue> & CssRuleMap) | null
    get result() {
        return this.#result;
    }
    //#endregion public properties
    
    
    
    //#region private utility methods
    /**
     * Creates the *value* (reference) of the specified `propName`, not the *direct* value, eg: `var(--my-favColor)`.
     * @param propName The prop name to create.
     * @returns A `CssCustomSimpleRef` represents the expression for retrieving the value of the specified `propName`.
     */
    #createRef(propName: string): CssCustomSimpleRef {
        return `var(${this._createDecl(propName)})`;
    }
    
    /**
     * Creates the name of `@keyframes` rule.
     * @param basicKeyframesName The basic name of `@keyframes` rule to create.
     * @returns A `string` represents the name of `@keyframes` rule.
     */
    #createKeyframesName(basicKeyframesName: string): string {
        // add prefix `prefix-` or just a `basicKeyframesName`
        return this.#options?.prefix ? `${this.#options.prefix}-${basicKeyframesName}` : basicKeyframesName;
    }
    
    /**
     * Determines if the specified `value` is neither `undefined` nor `null`.
     * @param value The value to test.
     * @returns `true` if the `value` is not nullish, otherwise `false`.
     */
    #hasValue<TValue>(value: TValue): value is Exclude<TValue, undefined|null> {
        return (value !== undefined) && (value !== null);
    }
    
    /**
     * Determines if the specified `srcPropValue` can be transformed to another equivalent prop link `var(...)`.
     * @param srcPropValue The value to test.
     * @returns `true` indicates it's transformable, otherwise `false`.
     */
    #isTransformableProp(srcPropValue: Exclude<TSrcPropValue, undefined|null>): boolean {
        if ((typeof(srcPropValue) === 'string')) {
            switch(srcPropValue) {
                // ignore global keywords:
                case 'none':
                case 'unset':
                case 'inherit':
                case 'initial':
                case 'revert':
                case 'revert-layer':
                    return false;
            } // switch
        } // if
        
        return true; // passed, transformable
    }
    
    /**
     * Determines if the specified `srcPropName` and `refPropName` are pointed to the same object.
     * @param srcPropName The prop name of `#srcProps`.
     * @param refPropName The prop name of `#refProps`.
     * @returns `true` indicates the same object, otherwise `false`.
     */
    #isSelfProp(srcPropName: TSrcPropName, refPropName: TRefPropName): boolean {
        if (!Object.is(this.#srcProps, this.#refProps)) return false; // if `#srcProps` and `#refProps` are not the same object in memory => always return `false`
        
        return ((srcPropName as string|number|symbol) === (refPropName as string|number|symbol));
    }
    
    /**
     * Determines if the specified `srcPropValue` and `refPropValue` are deeply the same by value or by reference.
     * @param srcPropValue The first value to test.
     * @param refPropValue The second value to test.
     * @returns `true` if both are equal, otherwise `false`.
     */
    #isDeepEqual(srcPropValue: Exclude<TSrcPropValue, undefined|null>, refPropValue: Exclude<TRefPropValue, undefined|null>): boolean {
        // shallow equal comparison:
        if (Object.is(srcPropValue, refPropValue)) return true;
        
        
        
        //#region deep equal comparison
        // both must be an object:
        if (typeof(srcPropValue) !== 'object') return false;
        if (typeof(refPropValue) !== 'object') return false;
        
        
        
        // both must be an array -or- both must not be an array:
        const isArraySrcPropValue = Array.isArray(srcPropValue);
        const isArrayRefPropValue = Array.isArray(refPropValue);
        if (isArraySrcPropValue !== isArrayRefPropValue) return false;
        
        
        
        // if not an array => must be a literal object:
        if (!isArraySrcPropValue && (Object.getPrototypeOf(srcPropValue) !== Object.prototype)) return false;
        if (!isArrayRefPropValue && (Object.getPrototypeOf(refPropValue) !== Object.prototype)) return false;
        
        
        
        // both props count must be the same:
        if (Object.keys(srcPropValue).length !== Object.keys(refPropValue).length) return false;
        
        
        
        // both prop values must be the same:
        for (const deepPropName in srcPropValue) {
            const srcNestedValue = srcPropValue[deepPropName];
            
            if (!(deepPropName in refPropValue)) return false;
            const refNestedValue = refPropValue[deepPropName as Extract<keyof Exclude<TRefPropValue, undefined|null>, string>];
            
            if (!this.#hasValue(srcNestedValue) || !this.#hasValue(refNestedValue)) {
                if (!Object.is(srcNestedValue, refNestedValue)) return false; // the same prop name with different prop value => false
                continue; // continue to next check loop
            } // if
            
            if (!this.#isDeepEqual(srcNestedValue as any, refNestedValue as any)) return false; // the same prop name with different prop value => false
        } // for
        
        
        
        // no any diff detected:
        return true;
        //#endregion deep equal comparison
    }
    
    /**
     * Determines if the specified entry [`srcPropName`, `srcPropValue`] has the equivalent entry in `#refProps`.
     * @param srcPropName  The prop name of `#srcProps`.
     * @param srcPropValue The prop value of `#srcProps`.
     * @returns A `CssCustomSimpleRef` represents the link to the equivalent entry in `#refProps`.  
     * -or- `null` if no equivalent found.
     */
    #findEqualProp(srcPropName: TSrcPropName, srcPropValue: Exclude<TSrcPropValue, undefined|null>): CssCustomSimpleRef|null {
        for (const [refPropName, refPropValue] of this.#refProps) { // search for duplicates
            // skip non-string ref prop:
            if (typeof(refPropName) !== 'string') continue; // symbol & number props are ignored
            
            // skip empty ref:
            if (!this.#hasValue(refPropValue)) continue; // undefined & null values are ignored
            
            // stop search if reaches current entry (search for prev entries only):
            if (this.#isSelfProp(srcPropName, refPropName)) break;
            
            // skip non transformable prop:
            if (!this.#isTransformableProp(srcPropValue)) continue;
            
            
            
            // comparing the `srcPropValue` & `refPropValue` deeply:
            if (this.#isDeepEqual(srcPropValue, refPropValue)) return this.#createRef(refPropName); // return the link to the ref
        } // search for duplicates
        
        // not found:
        return null;
    }
    
    /**
     * Re-link the existing `@keyframes` reference (if found) to the modified `@keyframes`.
     * @param srcPropValue The prop value of `#srcProps`.
     * @returns `true` if found and updated, otherwise `false`.
     */
    #updateKeyframesRef(srcPropValue: TSrcPropValue): boolean {
        const genKeyframes = this.#genKeyframes;
        if (!genKeyframes || !genKeyframes.size) return false; // nothing to update
        
        
        
        if (srcPropValue && (typeof(srcPropValue) === 'object') && !Array.isArray(srcPropValue) && (Object.getPrototypeOf(srcPropValue) !== Object.prototype)) {
            const keyframesRef = srcPropValue as CssCustomKeyframesRef;
            const oldkeyframesName = keyframesRef.value;
            if (oldkeyframesName) { // if not auto_name
                const newKeyframesName = genKeyframes.get(oldkeyframesName);
                if (newKeyframesName) {
                    keyframesRef.value = newKeyframesName;
                    return true; // updated
                } // if
            } // if
        } // if
        
        return false; // nothing was updated
    }
    //#endregion private utility methods
    
    //#region protected utility methods
    /**
     * Creates the *declaration name* of the specified `propName`, eg: `--my-favColor`.
     * @param propName The prop name to create.
     * @returns A `CssCustomName` represents the declaration name of the specified `propName`.
     */
    protected _createDecl(propName: string): CssCustomName {
        if (this.#options === null) return propName as CssCustomName;
        return createDecl(propName, this.#options);
    }
    //#endregion protected utility methods
    
    //#region virtual methods
    protected _onCreatePropName<TTSrcPropName extends TSrcPropName|symbol>(srcPropName: TTSrcPropName): TTSrcPropName {
        return srcPropName; // the default behavior is preserve the original prop name
    }
    protected _onCombineModified(modified: (Map<TSrcPropName, Exclude<TSrcPropValue, undefined|null>|CssCustomValue> & CssRuleMap)): (Map<TSrcPropName, Exclude<TSrcPropValue, undefined|null>|CssCustomValue> & CssRuleMap) {
        // clone the entire #srcProps:
        const combined = new Map(this.#srcProps) as (Map<TSrcPropName, Exclude<TSrcPropValue, undefined|null>|CssCustomValue> & CssRuleMap);
        
        // then update the changes:
        for (const [propName, propValue] of modified) {
            combined.set(propName, propValue);
        } // for
        
        // here the original + modified:
        return combined;
    }
    //#endregion virtual methods
    
    
    
    /**
     * Transforms the specified `srcProps` with the equivalent `(Map<TSrcPropName, Exclude<TSrcPropValue, undefined|null>|CssCustomValue> & CssRuleMap)` object,  
     * in which some values might be partially/fully *transformed*.  
     * The duplicate values will be replaced with a `var(...)` linked to the existing props in `refProps`.  
     * @param srcProps     The `Map<TSrcPropName, TSrcPropValue>` object to transform.
     * @param refProps     The `Map<TRefPropName, TRefPropValue>` object as the prop duplicate references.
     * @param genKeyframes The `Map<string, string>` object as a storage for the generated `@keyframes`.
     */
    constructor(srcProps: Map<TSrcPropName, TSrcPropValue>, refProps: Map<TRefPropName, TRefPropValue>, genKeyframes: Map<string, string>|null, options: LiveCssConfigOptions|null) {
        this.#srcProps     = srcProps;
        this.#refProps     = refProps;
        this.#genKeyframes = genKeyframes;
        this.#options      = options;
        
        
        
        const modified = new Map() as (Map<TSrcPropName, Exclude<TSrcPropValue, undefined|null>|CssCustomValue> & CssRuleMap); // create a blank storage for collecting the changes
        
        
        
        if (genKeyframes) {
            for (const [srcPropName, srcPropValue] of this.#srcProps) {  // rename all @keyframes name
                if (typeof(srcPropName) !== 'symbol')    continue;       // only interested of symbol props
                const [selector, styles] = srcPropValue  as CssRuleData; // assumes the value of symbol prop always be `CssRuleData`
                if (!isFinalSelector(selector))          continue;       // only interested of rendered selector
                if (!selector.startsWith('@keyframes ')) continue;       // only interested of @keyframes rule selector
                
                
                
                const oldkeyframesName = selector.slice(11).trimStart();              // extract the name of @keyframes rule
                const newKeyframesName = this.#createKeyframesName(oldkeyframesName); // rename the @keyframes rule
                if (newKeyframesName === oldkeyframesName) continue;                  // no difference => skip
                
                
                
                // track the change of @keyframes name:
                genKeyframes.set(
                    oldkeyframesName,
                    newKeyframesName
                );
                
                
                
                // store the modified `newKeyframesName`:
                modified.set(
                    this._onCreatePropName(srcPropName),
                    [`@keyframes ${newKeyframesName}`, styles]
                );
            }  // rename all @keyframes name
        } // if
        
        
        
        for (const [srcPropName, srcPropValue] of this.#srcProps) { // walk each entry in `#srcProps`
            // skip empty src:
            if (!this.#hasValue(srcPropValue)) continue; // undefined & null values are ignored
            
            // skip !important modifier:
            if ((typeof(srcPropName) === 'number') && (srcPropName >= 1) && (srcPropName === (this.#srcProps.size - 1)) && (srcPropValue === '!important')) continue;
            
            
            
            //#region handle nested style (recursive) 
            if (typeof(srcPropName) === 'symbol') {
                const [selector, styles] = srcPropValue as CssRuleData; // assumes the value of symbol prop always be `CssRuleData`
                const mergedStyles = mergeStyles(styles); // render the `CssStyleCollection` to `CssStyle`, so the contents are easily to compare
                if (mergedStyles) {
                    // convert the style to Map:
                    const srcNestedStyle = new Map<keyof CssStyle, ValueOf<CssStyle>>([
                        ...Object.entries(mergedStyles) as [keyof CssStyle, ValueOf<CssStyle>][],
                        ...Object.getOwnPropertySymbols(mergedStyles).map((symbolProp) => [ symbolProp, mergedStyles[symbolProp] ]) as [keyof CssStyle, ValueOf<CssStyle>][],
                    ]) as CssStyleMap;
                    
                    
                    
                    const equalNestedStyle = (new TransformCssStyleDuplicatesBuilder<TRefPropName, TRefPropValue>(srcNestedStyle, refProps, genKeyframes, options)).style;
                    if (equalNestedStyle) {
                        // store the modified `srcNestedStyle`:
                        modified.set(
                            this._onCreatePropName(srcPropName),
                            [selector, equalNestedStyle]
                        );
                    } // if
                } // if
                
                
                
                // mission done => continue walk to the next entry:
                continue;
            } // if
            //#endregion handle nested style (recursive) 
            
            
            
            //#region re-link the @keyframes name
            if (genKeyframes) {
                if (this.#updateKeyframesRef(srcPropValue)) continue; // if found & updated => mission done => continue walk to the next entry
            } // if
            //#endregion re-link the @keyframes name
            
            
            
            //#region handle single_value
            const equalPropRef = this.#findEqualProp(srcPropName, srcPropValue);
            if (equalPropRef) {
                // store the modified `srcPropValue`:
                modified.set(
                    this._onCreatePropName(srcPropName),
                    equalPropRef
                );
                
                // mission done => continue walk to the next entry:
                continue;
            } // if
            //#endregion handle single_value
            
            
            
            //#region handle multi_value (recursive) 
            if (Array.isArray(srcPropValue)) {
                type CssCustomValueArr = Extract<CssCustomValue, Array<any>>
                const srcNestedValues = srcPropValue as CssCustomValueArr;
                
                
                
                // convert the array to Map:
                const srcNestedProps = new Map(
                    srcNestedValues.map((item, index) => [index, item])
                );
                
                
                
                const equalNestedValues = (new TransformArrayDuplicatesBuilder<CssCustomValueArr, TRefPropName, TRefPropValue>(srcNestedProps, refProps, genKeyframes, options)).array as CssCustomValueArr|null;
                if (equalNestedValues) {
                    // store the modified `srcPropValue`:
                    modified.set(
                        this._onCreatePropName(srcPropName),
                        equalNestedValues
                    );
                    
                    // mission done => continue walk to the next entry:
                    continue;
                } // if
            } // if
            //#endregion handle multi_value (recursive) 
            
            
            
            //#region handle no value change
            const srcPropRenamed = this._onCreatePropName(srcPropName);
            if (srcPropRenamed !== srcPropName) {
                // The `srcPropValue` was not modified but the `srcPropName` needs to be renamed:
                modified.set(
                    srcPropRenamed,
                    srcPropValue
                );
            } // if
            //#endregion handle no value change
        } // walk each entry in `#srcProps`
        
        
        
        if (modified.size) {
            // if the `modified` is not empty (has any modifications) => return the (original + modified):
            this.#result = this._onCombineModified(modified);
        }
        else {
            this.#result = null; // `null` means no modification was performed
        } // if
    }
}
class TransformArrayDuplicatesBuilder<TArray extends Array<any>,   TRefPropName extends string|number|symbol, TRefPropValue extends CssCustomValue|CssRuleData|undefined|null>
    extends TransformDuplicatesBuilder<number, TArray[number],   TRefPropName, TRefPropValue>
{
    get array() {
        const result = this.result;
        if (!result) return null;
        return Array.from(result.values())
    }
}
class TransformCssStyleDuplicatesBuilder<TRefPropName extends string|number|symbol, TRefPropValue extends CssCustomValue|CssRuleData|undefined|null>
    extends TransformDuplicatesBuilder<keyof CssStyle, ValueOf<CssStyle>,   TRefPropName, TRefPropValue>
{
    get style() {
        const result = this.result as (CssStyleMap|null);
        if (!result) return null;
        return Object.fromEntries(result) as unknown as CssStyle;
    }
}
class TransformCssConfigFactoryDuplicatesBuilder<TConfigProps extends CssConfigProps>
    extends TransformDuplicatesBuilder<keyof TConfigProps, ValueOf<TConfigProps>, keyof TConfigProps, ValueOf<TConfigProps>>
{
    //#region overrides
    protected _onCreatePropName<TTSrcPropName extends keyof TConfigProps|symbol>(srcPropName: TTSrcPropName): TTSrcPropName {
        if (typeof(srcPropName) !== 'string') return srcPropName; // no change for symbol props
        return this._createDecl(srcPropName) as CssCustomName as TTSrcPropName;
    }
    protected _onCombineModified(modified: (Map<keyof TConfigProps, Exclude<ValueOf<TConfigProps>, undefined|null>|CssCustomValue> & CssRuleMap)) {
        return modified;
    }
    //#endregion overrides
    
    
    
    constructor(srcProps: Map<keyof TConfigProps, ValueOf<TConfigProps>>, options: LiveCssConfigOptions|null) {
        super(srcProps, srcProps, new Map<string, string>(), options);
    }
    
    
    
    get props() {
        return this.result as CssConfigCustomPropsMap|null
    }
}
class TransformCssConfigDuplicatesBuilder
    extends TransformCssStyleDuplicatesBuilder<(keyof CssCustomProps)|symbol, CssCustomValue|CssKeyframesRule[symbol]>
{
    constructor(configCustomProps: CssConfigCustomPropsMap) {
        super(configCustomProps, configCustomProps, new Map<string, string>(), null);
    }
    
    
    
    get props() {
        return this.result as CssConfigCustomPropsMap|null
    }
}



class CssConfigBuilder<TConfigProps extends CssConfigProps> {
    //#region private properties
    readonly #propsFactory : ProductOrFactory<TConfigProps>
    
    
    
    //#region data sources
    #_propsCache : CssConfigCustomPropsMap|null = null
    /**
     * A *generated css custom props* as the *source of truth*.  
     *   
     * Similar to `propsMap` but all keys has been prefixed and some values has been partially/fully *transformed*.  
     * The duplicate values has been replaced with a `var(...)` linked to the previously existing ones.  
     *   
     * If mutated, the `#genProps` needs to `update()`.  
     *   
     * eg data:  
     * // origin:  
     * propsMap = {  
     *    colRed      : '#ff0000',  
     *    colBlue     : '#0000ff',  
     *    bdWidth     : '1px',  
     *    
     *    colFavorite : '#ff0000',  
     *    theBorder   : [[ 'solid', '1px', '#0000ff' ]],  
     *    
     *    [symbol]    : ['@keyframes fly-away', {
     *       [symbol] : [' from', {
     *          color : '#ff0000',
     *       }]
     *       [symbol] : [' to', {
     *          color : '#ffffff',
     *       }]
     *    }],
     *    animation   : [[ '100ms', 'ease', 'fly-away' ]],
     * };  
     *   
     * // transformed:  
     * #props = {  
     *    --navb-colRed      : '#ff0000',  
     *    --navb-colBlue     : '#0000ff',  
     *    --navb-bdWidth     : '1px',  
     *    
     *    --navb-colFavorite : 'var(--navb-colRed)',  
     *    --navb-theBorder   : [[ 'solid', 'var(--navb-bdWidth)', 'var(--navb-colBlue)' ]],  
     *    
     *    [symbol]    : ['@keyframes navb-fly-away', {
     *       [symbol] : [' from', {
     *          color : 'var(--navb-colRed)',
     *       }]
     *       [symbol] : [' to', {
     *          color : '#ffffff',
     *       }]
     *    }],
     *    animation   : [[ '100ms', 'ease', 'navb-fly-away' ]],
     * };  
     */
    get #props() : CssConfigCustomPropsMap {
        //#region construct `#props` for the first time
        if (!this.#_propsCache) {
            const propsFactory = this.#propsFactory;
            const props : TConfigProps = (
                (typeof(propsFactory) === 'function')
                ?
                propsFactory()
                :
                propsFactory
            );
            
            
            
            // convert props to propsMap:
            const propsMap = new Map<keyof TConfigProps, ValueOf<TConfigProps>>([
                ...Object.entries(props) as [keyof TConfigProps, ValueOf<TConfigProps>][],
                ...Object.getOwnPropertySymbols(props).map((symbolProp) => [ symbolProp, props[symbolProp] ]) as [keyof TConfigProps, ValueOf<TConfigProps>][],
            ]);
            
            
            
            // convert propsMap to cssCustomPropsMap:
            const cssCustomPropsMap : CssConfigCustomPropsMap = (
                (new TransformCssConfigFactoryDuplicatesBuilder<TConfigProps>(propsMap, this.#options)).props
                ??
                propsMap as CssConfigCustomPropsMap
            );
            
            
            
            // now the cssCustomPropsMap becomes a new *source of truth*:
            this.#_propsCache = cssCustomPropsMap;
        } // if
        //#endregion construct `#props` for the first time
        
        
        
        return this.#_propsCache;
    }
    //#endregion data sources
    
    
    
    //#region generated data
    /**
     * The *generated css custom props* as an editable_config_storage.  
     *   
     * Similar to `#props` but some values has been partially/fully *transformed*.  
     * The duplicate values has been replaced with a `var(...)` linked to the previously existing ones.  
     */
    #genProps = new Map() as CssConfigCustomPropsMap; // create a blank generated props collection
    
    /**
     * The *generated css* attached on dom (by default).
     */
    readonly #liveStyleSheet : Subject<CssStyle|null>;
    //#endregion generated data
    //#endregion private properties
    
    //#region public properties
    readonly #options : LiveCssConfigOptions
    readonly #refs    : Refs<TConfigProps>
    readonly #vals    : Vals<TConfigProps>
    
    get options() { return this.#options }
    get refs()    { return this.#refs    }
    get vals()    { return this.#vals    }
    //#endregion public properties
    
    
    
    //#region data builds
    #rebuild() {
        //#region transform the `props`
        this.#genProps = (
            (new TransformCssConfigDuplicatesBuilder(this.#props)).props
            ??
            this.#props
        );
        //#endregion transform the `props`
        
        
        
        // update styleSheet:
        this.#liveStyleSheet.next({
            ...atGlobal({
                ...rule(this.#options.selector, Object.fromEntries(this.#genProps) as unknown as (CssCustomProps & CssKeyframesRule)),
            }),
        });
    }
    
    /**
     * Holds the validity status of the `#genProps`.  
     * `false` is invalid or never built.  
     * `true`  is valid.
     */
    #valid = false;
    /**
     * Regenerates the `#genProps`.
     * @param immediately `true` to update immediately (guaranteed has fully updated after `#update()` returned) -or- `false` to update shortly after current execution finished.
     */
    #update(immediately = false) {
        if (immediately) {
            // regenerate the data right now:
            
            this.#rebuild();
            this.#valid = true; // mark the `#genProps` as valid
            
            // now the data is guaranteed regenerated.
        }
        else {
            // promise to regenerate the data in the future as soon as possible, before browser repaint:
            
            this.#valid = false;         // mark the `#genProps` as invalid
            asyncExecute(() => {
                if (this.#valid) return; // has been previously generated => abort
                this.#rebuild();
                this.#valid = true;      // mark the `#genProps` as valid
            });
        } // if
    }
    
    /**
     * Ensures the `#genProps` was fully generated.
     */
    #ensureGenerated() {
        if (this.#valid) {
            // console.log('update not required');
            return; // if was valid => return immediately
        } // if
        
        
        
        this.#update(/*immediately*/true); // regenerate the `#genProps` and wait until completed
        // console.log(`update done - prefix: ${this.#options.prefix}`);
    }
    //#endregion data builds
    
    
    
    //#region private utility methods
    /**
     * Creates the *declaration name* of the specified `propName`, eg: `--my-favColor`.
     * @param propName The prop name to create.
     * @returns A `CssCustomName` represents the declaration name of the specified `propName`.
     */
    #createDecl(propName: string): CssCustomName {
        return createDecl(propName, this.#options);
    }
    //#endregion private utility methods
    
    
    
    //#region proxy getters & setters
    /**
     * Gets the *declaration name* of the specified `propName`, eg: `--my-favColor`.
     * @param propName The prop name to retrieve.
     * @returns A `CssCustomName` represents the declaration name of the specified `propName` -or- `undefined` if it doesn't exist.
     */
    #getDecl(propName: string): CssCustomName|undefined {
        // ignores react runtime type check:
        if (propName === '$$typeof') return undefined;
        
        
        
        // ensures the `#genProps` was fully generated:
        this.#ensureGenerated();
        
        
        
        const propDecl = this.#createDecl(propName);
        
        // check if the `#genProps` has `propDecl`:
        if (!this.#genProps.has(propDecl)) return undefined; // not found
        
        return propDecl;
    }
    
    /**
     * Gets the *value* (reference) of the specified `propName`, not the *direct* value, eg: `var(--my-favColor)`.
     * @param propName The prop name to retrieve.
     * @returns A `CssCustomSimpleRef` represents the expression for retrieving the value of the specified `propName` -or- `undefined` if it doesn't exist.
     */
    #getRef(propName: string): CssCustomSimpleRef|undefined {
        const propDecl = this.#getDecl(propName);
        if (!propDecl) return undefined; // not found
        
        return `var(${propDecl})`;
    }
    
    /**
     * Gets the *equivalent value* of the specified `propName`, might be the *transformed* value, eg: `[['var(--pad-y)', 'var(--pad-x)']]` -or- the *direct* value, eg: `[['5px', '10px']]`.
     * @param propName The prop name to retrieve.
     * @returns A `CssCustomValue` represents the value of the specified `propName` -or- `undefined` if it doesn't exist.
     */
    #getVal(propName: string): CssCustomValue|undefined {
        const propDecl = this.#getDecl(propName);
        if (!propDecl) return undefined; // not found
        
        return this.#genProps.get(propDecl);
    }
    
    /**
     * Sets the *direct* value of the specified `propName`.
     * @param propName The prop name to update.
     * @param newValue The new value.
     * @returns Always return `true`.
     */
    #setDirect(propName: string, newValue: CssCustomValue|undefined|null) {
        const propDecl = this.#createDecl(propName);
        
        
        
        // the source of truth:
        const props = this.#props;
        
        
        
        if ((newValue === undefined) || (newValue === null)) {
            props.delete(propDecl);
            
            this.#update(); // setting changed => the `#genProps` needs to `update()`
        }
        else {
            if (props.get(propDecl) !== newValue) {
                props.set(propDecl, newValue);
                
                this.#update(); // setting changed => the `#genProps` needs to `update()`
            } // if
        } // if
        
        
        
        return true; // notify update/delete was successful
    }
    
    /**
     * Gets the *all possible* `propName`s in the css-config.
     * @returns An `Array<string>` contains *all possible* `propName`s in the css-config.
     */
    #getPropList(): ArrayLike<string|symbol> {
        return (
            Array.from(this.#props.keys() as IterableIterator<CssCustomName|symbol>)
            .filter((propName): propName is CssCustomName => (typeof(propName) === 'string')) // only show string props, ignores symbol props
            .map((cssCustomName): string => cssCustomName.slice(2)) // remove double dash prefix
        );
    }
    //#endregion proxy getters & setters
    
    
    
    //#region constructors
    constructor(initialProps: ProductOrFactory<TConfigProps>, options?: CssConfigOptions) {
        this.#propsFactory = initialProps;
        this.#options = new LiveCssConfigOptions(() => {
            this.#update();
        }, options);
        
        
        
        this.#liveStyleSheet = new Subject<CssStyle|null>();
        styleSheet(this.#liveStyleSheet);
        
        
        
        // regenerate the `#genProps` for the first time:
        this.#update();
        
        
        
        // proxies - representing data in various formats:
        this.#refs = new Proxy<{ [Key in keyof TConfigProps] : /*getter: */CssCustomSimpleRef | /*setter: */CssCustomValue|undefined|null }>(unusedObj as any, {
            get            : (_unusedObj, propName: string)                                          => this.#getRef(propName),
            set            : (_unusedObj, propName: string, newValue: CssCustomValue|undefined|null) => this.#setDirect(propName, newValue),
            deleteProperty : (_unusedObj, propName: string)                                          => this.#setDirect(propName, undefined),
            
            ownKeys        : (_unusedObj)                                                            => this.#getPropList(),
        }) as Refs<TConfigProps>;
        this.#vals = new Proxy<{ [Key in keyof TConfigProps] : /*getter: */    CssCustomValue | /*setter: */CssCustomValue|undefined|null }>(unusedObj as any, {
            get            : (_unusedObj, propName: string)                                          => this.#getVal(propName),
            set            : (_unusedObj, propName: string, newValue: CssCustomValue|undefined|null) => this.#setDirect(propName, newValue),
            deleteProperty : (_unusedObj, propName: string)                                          => this.#setDirect(propName, undefined),
            
            ownKeys        : (_unusedObj)                                                            => this.#getPropList(),
        }) as Vals<TConfigProps>;
    }
    //#endregion constructors
}

/**
 * A configurable css variables (css custom properties).  
 */
const cssConfig = <TConfigProps extends CssConfigProps>(initialProps: ProductOrFactory<TConfigProps>, options?: CssConfigOptions): CssConfig<TConfigProps> => {
    const cssConfig = new CssConfigBuilder<TConfigProps>(initialProps, options);
    return [
        cssConfig.refs,
        cssConfig.vals,
        
        cssConfig.options,
    ];
}
export { cssConfig, cssConfig as default }
