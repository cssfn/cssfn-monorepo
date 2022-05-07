// cssfn:
import type {
    ProductOrFactory,
    
    Nullable,
    
    ValueOf,
}                           from '@cssfn/types'
import type {
    // css custom properties:
    CssCustomName,
    
    CssCustomKeyframesRef,
    CssCustomSimpleRef,
    CssCustomValue,
    
    
    
    // cssfn properties:
    CssRuleData,
    
    CssStyle,
    
    CssKeyframesRule,
    
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
    mergeStyles,
}                           from '@cssfn/cssfn/dist/mergeStyles.js'
import {
    Subject,
}                           from 'rxjs'



// general types:
export type CssConfigProps =
    & Nullable<{
        [name: string] : CssCustomValue
    }>
    & CssKeyframesRule
export type Refs<TConfigProps extends CssConfigProps> = { [Key in keyof TConfigProps]: CssCustomSimpleRef                  }
export type Vals<TConfigProps extends CssConfigProps> = { [Key in keyof TConfigProps]: TConfigProps[Key]  | CssCustomValue }

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
    // replace `@keyframes fooSomething` => `keyframes-fooSomething`
    // propName = propName.replace(/^@keyframes\s+/, 'keyframes-');                                   // slow!
    if (propName.startsWith('@keyframes ')) propName = `keyframes-${propName.slice(11).trimStart()}`; // faster!
    
    // add double dash with prefix `--prefix-` or double dash without prefix `--`
    return options.prefix ? `--${options.prefix}-${propName}` : `--${propName}`;
}

class TransformDuplicatesBuilder<TSrcPropName extends string|number|symbol, TSrcPropValue extends CssCustomValue|CssRuleData|undefined|null,   TRefPropName extends string|number|symbol, TRefPropValue extends CssCustomValue|CssRuleData|undefined|null> {
    //#region private properties
    readonly #srcProps     : Map<TSrcPropName, TSrcPropValue>
    readonly #refProps     : Map<TRefPropName, TRefPropValue>
    readonly #genKeyframes : Map<string, CssCustomKeyframesRef>
    readonly #options      : LiveCssConfigOptions
    //#endregion private properties
    
    //#region public properties
    readonly #result        : Map<TSrcPropName, TSrcPropValue|CssCustomValue|CssRuleData> | null
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
     * Creates the *value* (reference) of the specified `keyframesName`.
     * @param keyframesName The `@keyframes` name to create.
     * @returns A `CssCustomKeyframesRef` represents the expression for retrieving the reference of the specified `keyframesName`.
     */
    #createKeyframesRef(keyframesName: string): CssCustomKeyframesRef {
        // add prefix `prefix-` or just a `keyframesName`
        return this.#options.prefix ? `${this.#options.prefix}-${keyframesName}` : keyframesName;
    }
    
    /**
     * Determines if the specified `srcPropValue` can be transformed to another equivalent prop link `var(...)`.
     * @param srcPropValue The value to test.
     * @returns `true` indicates it's transformable, otherwise `false`.
     */
    #isTransformableProp(srcPropValue: TSrcPropValue): boolean {
        if ((srcPropValue === undefined) || (srcPropValue === null)) return false; // skip nullish prop
        
        if ((typeof(srcPropValue) === 'string')) {
            switch(srcPropValue) {
                // ignore global keywords:
                case 'none':
                case 'unset':
                case 'inherit':
                case 'initial':
                case 'revert':
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
        if (!Object.is(this.#srcProps, this.#refProps)) return false; // if `#srcProps` & `#refProps` are not the same object in memory => always return `false`
        
        return ((srcPropName as string|number|symbol) === (refPropName as string|number|symbol));
    }
    
    /**
     * Determines if the specified `srcPropValue` and `refPropValue` are deeply the same by value or by reference.
     * @param srcPropValue The first value to test.
     * @param refPropValue The second value to test.
     * @returns `true` if both are equal, otherwise `false`.
     */
    #isDeepEqual(srcPropValue: TSrcPropValue, refPropValue: TRefPropValue): boolean {
        // shallow equal comparison:
        if (Object.is(srcPropValue, refPropValue)) return true;
        
        
        
        //#region deep equal comparison
        // both must not nullable:
        if ((srcPropValue === undefined) || (srcPropValue === null)) return false;
        if ((refPropValue === undefined) || (refPropValue === null)) return false;
        
        
        
        // both must be an object:
        if (typeof(srcPropValue) !== 'object') return false;
        if (typeof(refPropValue) !== 'object') return false;
        
        
        
        // both must be an array -or- both must not be an array:
        if (Array.isArray(srcPropValue) !== Array.isArray(refPropValue)) return false;
        
        
        
        // both props count must be the same:
        if (Object.keys(srcPropValue).length !== Object.keys(refPropValue).length) return false;
        
        
        
        // both prop values must be the same:
        for (const deepPropName in srcPropValue) {
            if (!this.#isDeepEqual((srcPropValue as any)[deepPropName], (refPropValue as any)[deepPropName])) return false; // the same prop name with different prop value => false
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
    #findEqualProp(srcPropName: TSrcPropName, srcPropValue: TSrcPropValue): CssCustomSimpleRef|null {
        for (const [refPropName, refPropValue] of this.#refProps) { // search for duplicates
            // skip non-string ref prop:
            if (typeof(refPropName) !== 'string') continue;
            
            // skip empty ref:
            if ((refPropValue === undefined) || (refPropValue === null)) continue;
            
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
    //#endregion private utility methods
    
    //#region protected utility methods
    /**
     * Creates the *declaration name* of the specified `propName`, eg: `--my-favColor`.
     * @param propName The prop name to create.
     * @returns A `CssCustomName` represents the declaration name of the specified `propName`.
     */
    _createDecl(propName: string): CssCustomName {
        return createDecl(propName, this.#options);
    }
    //#endregion protected utility methods
    
    //#region virtual methods
    protected _onCreatePropName(srcPropName: TSrcPropName): TSrcPropName {
        return srcPropName;
    }
    protected _onCombineModified(modified: Map<TSrcPropName, TSrcPropValue|CssCustomValue|CssRuleData>): Map<TSrcPropName, TSrcPropValue|CssCustomValue|CssRuleData> {
        // clone the entrire #srcProps:
        const combined = new Map<TSrcPropName, TSrcPropValue|CssCustomValue|CssRuleData>(this.#srcProps);
        
        // then update the changes:
        for (const [propName, propValue] of modified) {
            combined.set(propName, propValue);
        } // for
        
        // here the original + modified:
        return combined;
    }
    //#endregion virtual methods
    
    
    
    /**
     * Transforms the specified `srcProps` with the equivalent `Map<TSrcPropName, TSrcPropValue|CssCustomSimpleRef|CssCustomKeyframesRef|CssComplexMultiValueOf<CssSimpleValue>>` object,  
     * in which some values might be partially/fully *transformed*.  
     * The duplicate values will be replaced with a `var(...)` linked to the existing props in `refProps` or in `genKeyframes`.  
     * @param srcProps     The `Map<TSrcPropName, TSrcPropValue>` object to transform.
     * @param refProps     The `Map<TRefPropName, TRefPropValue>` object as the prop duplicate references.
     * @param genKeyframes The `Map<CssCustomKeyframesRef, CssKeyframes>` object as the keyframes duplicate references and as a storage for the generated one.
     */
    constructor(srcProps: Map<TSrcPropName, TSrcPropValue>, refProps: Map<TRefPropName, TRefPropValue>, genKeyframes: Map<string, CssCustomKeyframesRef>, options: LiveCssConfigOptions) {
        this.#srcProps     = srcProps;
        this.#refProps     = refProps;
        this.#genKeyframes = genKeyframes;
        this.#options      = options;
        
        
        
        const modified = new Map<TSrcPropName, TSrcPropValue|CssCustomValue|CssRuleData>(); // create a blank storage for collecting the changes
        
        
        
        for (const [srcPropName, srcPropValue] of this.#srcProps) { // collect all @keyframes name
            if (typeof(srcPropName) !== 'symbol')    continue;
            const [selector, styles] = srcPropValue as CssRuleData;
            if (typeof(selector) !== 'string')       continue;
            if (!selector.startsWith('@keyframes ')) continue;
            
            
            
            const oldkeyframesName    = selector.slice(11).trimStart();
            const newKeyframesName = this.#createKeyframesRef(oldkeyframesName);
            this.#genKeyframes.set(
                oldkeyframesName,
                newKeyframesName
            );
            
            
            
            // store the modified `newKeyframesName`:
            modified.set(
                this._onCreatePropName(srcPropName),
                [`@keyframes ${newKeyframesName}`, styles]
            );
        }  // collect all @keyframes name
        
        
        
        for (const [srcPropName, srcPropValue] of this.#srcProps) { // walk each entry in `#srcProps`
            // skip empty src:
            if ((srcPropValue === undefined) || (srcPropValue === null)) continue;
            
            
            
            //#region handle nested style (recursive)
            if (typeof(srcPropName) === 'symbol') {
                if (typeof(srcPropName) !== 'symbol')    continue;
                const [selector, styles] = srcPropValue as CssRuleData;
                const mergedStyles = mergeStyles(styles);
                if (mergedStyles) {
                    // convert the style to Map:
                    const srcNestedStyle = new Map<keyof CssStyle, ValueOf<CssStyle>>([
                        ...Object.entries(mergedStyles) as [keyof CssStyle, ValueOf<CssStyle>][],
                        ...Object.getOwnPropertySymbols(mergedStyles).map((symbolProp) => [ symbolProp, mergedStyles[symbolProp] ]) as [keyof CssStyle, ValueOf<CssStyle>][],
                    ]);
                    for (const symbolProp of Object.getOwnPropertySymbols(mergedStyles)) {
                        srcNestedStyle.set(symbolProp, mergedStyles[symbolProp]);
                    } // for
                    
                    
                    
                    const equalNestedStyle = (new TransformDuplicatesBuilder(srcNestedStyle, refProps, genKeyframes, options)).result;
                    if (equalNestedStyle) {
                        // convert the Map back to style:
                        const srcNestedStyle = Object.fromEntries(equalNestedStyle) as CssStyle;
                        
                        
                        
                        // store the modified `srcNestedStyle`:
                        modified.set(
                            this._onCreatePropName(srcPropName),
                            [selector, srcNestedStyle]
                        );
                    } // if
                } // if
                
                
                
                // mission done => continue walk to the next entry:
                continue;
            } // if
            //#endregion handle nested style (recursive)
            
            
            
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
                const srcNestedValues: CssCustomValueArr = srcPropValue;
                
                
                
                // convert the array to Map:
                const srcNestedProps = new Map(
                    srcNestedValues.map((item, index) => [index, item])
                );
                
                
                
                const equalNestedValues = (new TransformDuplicatesBuilder(srcNestedProps, refProps, genKeyframes, options)).result;
                if (equalNestedValues) {
                    // convert the Map back to an array:
                    const srcNestedValues = Array.from(equalNestedValues.values()) as CssCustomValueArr;
                    
                    
                    
                    // store the modified `srcPropValue`:
                    modified.set(
                        this._onCreatePropName(srcPropName),
                        srcNestedValues
                    );
                    
                    // mission done => continue walk to the next entry:
                    continue;
                } // if
            } // if
            //#endregion handle multi_value (recursive)
            
            
            
            //#region handle no value change
            const srcPropName2 = this._onCreatePropName(srcPropName);
            if (srcPropName2 !== srcPropName) {
                // The `srcPropValue` was not modified but the `srcPropName` needs to be renamed:
                modified.set(
                    srcPropName2,
                    srcPropValue
                );
            } // if
            //#endregion handle no value change
            
            
            
            //#region handle `@keyframes foo`
            /*const keyframesData = this.#isKeyframesRule(srcPropName, srcPropValue);
            if (keyframesData) {
                const [keyframesName, rules] = keyframesData;
                
                
                
                const equalKeyframes = this.#findEqualKeyframes(srcKeyframes);
                if (equalKeyframes) srcKeyframes = equalKeyframes; // replace with the equivalent (if any)
                
                
                
                // create a link to current `@keyframes` name:
                const keyframesReference = this.#createKeyframesRef(keyframesName);
                
                
                
                // if @keyframes was not exist => store the new one:
                if (!equalKeyframes) {
                    this.#genKeyframes.set(keyframesReference, srcKeyframes);
                } // if
                
                
                
                // store the modified `srcPropValue`:
                modified.set(
                    this._onCreatePropName(srcPropName),
                    keyframesReference
                );
                
                // mission done => continue walk to the next entry:
                continue;
            } // if*/
            //#endregion handle `@keyframes foo`
        }  // walk each entry in `#srcProps`
        
        
        
        // if the `modified` is not empty (has any modifications) => return the (original + modified):
        if (modified.size) {
            this.#result = this._onCombineModified(modified);
        } // if
        
        
        
        this.#result = null; // `null` means no modification was performed
    }
}
class TransformCssConfigDuplicatesBuilder<TConfigProps extends CssConfigProps> extends TransformDuplicatesBuilder<keyof TConfigProps, ValueOf<TConfigProps>, keyof TConfigProps, ValueOf<TConfigProps>> {
    //#region overrides
    protected _onCreatePropName(srcPropName: keyof TConfigProps): keyof TConfigProps {
        if (typeof(srcPropName) !== 'string') return srcPropName; // no change for symbol props
        return this._createDecl(srcPropName) as keyof TConfigProps;
    }
    protected _onCombineModified(modified: Map<keyof TConfigProps, ValueOf<Omit<TConfigProps, symbol>>|CssCustomValue|ValueOf<Pick<TConfigProps, symbol>>>): Map<keyof TConfigProps, ValueOf<Omit<TConfigProps, symbol>>|CssCustomValue|ValueOf<Pick<TConfigProps, symbol>>> {
        return modified;
    }
    
    get result() {
        return super.result as Map<CssCustomName, ValueOf<Omit<TConfigProps, symbol>>|CssCustomValue|ValueOf<Pick<TConfigProps, symbol>>> | null
    }
    //#endregion overrides
    
    
    
    constructor(srcProps: Map<keyof TConfigProps, ValueOf<TConfigProps>>, genKeyframes: Map<string, CssCustomKeyframesRef>, options: LiveCssConfigOptions) {
        super(srcProps, srcProps, genKeyframes, options);
    }
}

class CssConfigBuilder<TConfigProps extends CssConfigProps> {
    //#region private properties
    readonly #propsFactory : ProductOrFactory<TConfigProps>
    readonly #options      : LiveCssConfigOptions
    
    readonly #refs         : Refs<TConfigProps>
    readonly #vals         : Vals<TConfigProps>
    
    
    
    //#region data sources
    #_propsCache : Map<keyof TConfigProps, ValueOf<TConfigProps>>|null = null
    /**
     * A *virtual css*.  
     * The source of truth.  
     * If mutated, the `#genProps` and `genKeyframes` need to `update()`.
     */
    get #props() : Map<keyof TConfigProps, ValueOf<TConfigProps>> {
        if (!this.#_propsCache) {
            const props : TConfigProps = (
                (typeof(this.#propsFactory) === 'function')
                ?
                this.#propsFactory()
                :
                this.#propsFactory
            );
            
            // convert props to Map:
            this.#_propsCache = new Map<keyof TConfigProps, ValueOf<TConfigProps>>([
                ...Object.entries(props) as [keyof TConfigProps, ValueOf<TConfigProps>][],
                ...Object.getOwnPropertySymbols(props).map((symbolProp) => [ symbolProp, props[symbolProp] ]) as [keyof TConfigProps, ValueOf<TConfigProps>][],
            ]);
        } // if
        
        return this.#_propsCache;
    }
    //#endregion data sources
    
    
    
    //#region generated data
    /**
     * The *generated css custom props* as an editable_config_storage.  
     * Similar to `#props` but all keys has been prefixed and some values has been partially/fully *transformed*.  
     * The duplicate values has been replaced with a `var(...)` linked to the previously existing ones.  
     * eg:  
     * // origin:  
     * #props = {  
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
     * #genProps = {  
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
    #genProps = new Map<CssCustomName, ValueOf<Omit<TConfigProps, symbol>>|CssCustomValue|ValueOf<Pick<TConfigProps, symbol>>>(); // create a blank generated props collection
    
    /**
     * The *generated css* attached on dom (by default).
     */
    readonly #liveStyleSheet : Subject<CssStyle|null>;
    //#endregion generated data
    //#endregion private properties
    
    
    
    //#region data builds
    #rebuild() {
        const props = this.#props;
        
        
        
        //#region transform the `props`
        const genKeyframes = new Map<string, CssCustomKeyframesRef>(); // create a blank @keyframes collection
        this.#genProps = (
            (new TransformCssConfigDuplicatesBuilder<TConfigProps>(props, genKeyframes, this.#options)).result
            ??
            (props as Map<CssCustomName, ValueOf<Omit<TConfigProps, symbol>>|CssCustomValue|ValueOf<Pick<TConfigProps, symbol>>>)
        );
        //#endregion transform the `props`
        
        
        
        // update styleSheet:
        this.#liveStyleSheet.next({
            ...atGlobal({
                ...rule(this.#options.selector, Object.fromEntries(this.#genProps) as CssStyle),
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
            requestAnimationFrame(() => {
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
     * @returns A `ValueOf<TConfigProps>` or `CssCustomValue` represents the value of the specified `propName` -or- `undefined` if it doesn't exist.
     */
    #getVal(propName: string): ValueOf<Omit<TConfigProps, symbol>>|CssCustomValue|ValueOf<Pick<TConfigProps, symbol>>|undefined {
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
    #setDirect(propName: string, newValue: ValueOf<TConfigProps>|undefined|null) {
        // the original props:
        const props = this.#props;
        
        
        
        if ((newValue === undefined) || (newValue === null)) {
            props.delete(propName);
            
            this.#update(); // setting changed => the `#genProps` and `genKeyframes` need to `update()`
        }
        else {
            if (props.get(propName) !== newValue) {
                props.set(propName, newValue);
                
                this.#update(); // setting changed => the `#genProps` and `genKeyframes` need to `update()`
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
            Array.from(this.#props.keys())
            .filter((propName): propName is string => (typeof(propName) === 'string'))
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
        this.#refs = new Proxy<{ [Key in keyof TConfigProps] : /*getter: */                                                                    CssCustomSimpleRef | /*setter: */ValueOf<TConfigProps> }>(unusedObj as any, {
            get            : (_unusedObj, propName: string)                                  => this.#getRef(propName),
            set            : (_unusedObj, propName: string, newValue: ValueOf<TConfigProps>) => this.#setDirect(propName, newValue),
            deleteProperty : (_unusedObj, propName: string)                                  => this.#setDirect(propName, undefined),
            
            ownKeys        : (_unusedObj)                                                    => this.#getPropList(),
        }) as Refs<TConfigProps>;
        this.#vals = new Proxy<{ [Key in keyof TConfigProps] : /*getter: */ValueOf<Omit<TConfigProps, symbol>>|CssCustomValue|ValueOf<Pick<TConfigProps, symbol>> | /*setter: */ValueOf<TConfigProps> }>(unusedObj as any, {
            get            : (_unusedObj, propName: string)                                  => this.#getVal(propName),
            set            : (_unusedObj, propName: string, newValue: ValueOf<TConfigProps>) => this.#setDirect(propName, newValue),
            deleteProperty : (_unusedObj, propName: string)                                  => this.#setDirect(propName, undefined),
            
            ownKeys        : (_unusedObj)                                                    => this.#getPropList(),
        }) as Vals<TConfigProps>;
    }
    //#endregion constructors
    
    
    
    //#region public properties
    get options() { return this.#options }
    
    get refs() { return this.#refs }
    get vals() { return this.#vals }
    //#endregion public properties
}



/**
 * A configurable css variables (css custom properties).  
 * The config's values can be *accessed directly* in CSS and in JS.
 */
const createCssConfig = <TConfigProps extends CssConfigProps>(initialProps: ProductOrFactory<TConfigProps>, options?: CssConfigOptions): CssConfig<TConfigProps> => {
    const cssConfig = new CssConfigBuilder<TConfigProps>(initialProps, options);
    return [
        cssConfig.refs,
        cssConfig.vals,
        
        cssConfig.options,
    ];
}
export { createCssConfig, createCssConfig as default }
