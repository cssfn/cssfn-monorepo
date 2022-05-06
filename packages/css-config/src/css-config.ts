// cssfn:
import type {
    Factory,
    ProductOrFactory,
    
    Nullable,
    
    Dictionary,
    ValueOf,
}                           from '@cssfn/types'
import type {
    // css custom properties:
    CssCustomName,
    
    CssCustomKeyframesRef,
    CssCustomSimpleRef,
    CssCustomValue,
    
    
    
    // cssfn properties:
    CssProps,
    CssStyle,
    
    CssKeyframes,
    
    CssSelector,
}                           from '@cssfn/css-types'
import {
    // rules:
    rule,
    
    
    
    // keyframes:
    keyframes,
    
    
    
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
export type CssConfigProps = Nullable<{
    [name: string] : CssCustomValue
}>
export type Refs<TConfigProps extends CssConfigProps> = { [Key in keyof TConfigProps]: CssCustomSimpleRef }
export type Vals<TConfigProps extends CssConfigProps> = { [Key in keyof TConfigProps]: TConfigProps[Key]  }

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



// proxy helpers:
const unusedObj = {};



/**
 * Create, read, update, and delete configurations using *css variables* (css custom properties) stored at `:root` level (default) or at the desired `rule`.  
 * The config's values can be *accessed directly* in CSS and DOM.
 * 
 * Supports get property by *declaration*, eg:  
 * `myButtonConfig.decls.myFavColor` => returns `'--myBtn-myFavColor'`.  
 * 
 * Supports get property by *reference*, eg:  
 * `myButtonConfig.refs.myFavColor`  => returns `'var(--myBtn-myFavColor)'`.  
 * 
 * Supports get property by *value*, eg:  
 * `myButtonConfig.vals.myFavColor`  => returns `'#ff0000'`.  
 * 
 * Supports set property, eg:  
 * `myButtonConfig.vals.myFavColor = 'red'`  
 * 
 * Supports delete property, eg:  
 * `myButtonConfig.vals.myFavColor = undefined
 */
export const createCssConfig2 = <TProps extends CssConfigProps>(initialProps: ProductOrFactory<TProps>, options?: CssConfigOptions): CssConfig<TProps> => {
    // options:
    const liveOptions = new LiveCssConfigOptions(() => {
        update();
    }, options);
    
    
    
    // data sources:
    
    type TValue       = ValueOf<TProps>
    
    /**
     * A *virtual css*.  
     * The source of truth.  
     * If modified, causing the `genProps` & `genKeyframes` need to `update()`.
     */
    let _propsCache    : Dictionary</*original: */TValue>|null = null;
    const getProps    = (): Dictionary</*original: */TValue> => {
        if (!_propsCache) {
            _propsCache = ((typeof(initialProps) === 'function') ? (initialProps as Factory<TProps>)() : initialProps) as unknown as Dictionary</*original: */TValue>;
        } // if
        
        
        
        return _propsCache;
    }
    
    
    
    // data generates:
    
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
     * };  
     */
    let   genProps      : Dictionary</*original: */TValue | /*transformed: */CssCustomValue> = {};
    
    /**
     * The *generated css* of `@keyframes` resides on memory only.
     */
    let   genKeyframes  : Dictionary<CssKeyframes> = {};
    
    /**
     * The *generated css* attached on dom.
     */
    const liveStyleSheet = new Subject<CssStyle|null>();
    // TODO: remove any:
    styleSheet(liveStyleSheet as any);
    
    /**
     * Creates the *declaration name* of the specified `propName`, eg: `--my-favColor`.
     * @param propName The prop name to create.
     * @returns A `CssCustomName` represents the declaration name of the specified `propName`.
     */
    const createDecl = (propName: string): CssCustomName => {
        // replace `@keyframes fooSomething` => `keyframes-fooSomething`
        // propName = propName.replace(/^@keyframes\s+/, 'keyframes-');                                   // slow!
        if (propName.startsWith('@keyframes ')) propName = `keyframes-${propName.slice(11).trimStart()}`; // faster!
        
        // add double dash with prefix `--prefix-` or double dash without prefix `--`
        return liveOptions.prefix ? `--${liveOptions.prefix}-${propName}` : `--${propName}`;
    }
    
    /**
     * Creates the *value* (reference) of the specified `propName`, not the *direct* value, eg: `var(--my-favColor)`.
     * @param propName The prop name to create.
     * @returns A `CssCustomSimpleRef` represents the expression for retrieving the value of the specified `propName`.
     */
    const createRef = (propName: string): CssCustomSimpleRef => {
        return `var(${createDecl(propName)})`;
    }
    
    /**
     * Creates the *value* (reference) of the specified `keyframesName`.
     * @param keyframesName The `@keyframes` name to create.
     * @returns A `CssCustomKeyframesRef` represents the expression for retrieving the value of the specified `keyframesName`.
     */
    const createKeyframesRef = (keyframesName: string): CssCustomKeyframesRef => {
        return liveOptions.prefix ? `${liveOptions.prefix}-${keyframesName}` : keyframesName; // add prefix `prefix-` or just a `keyframesName`
    }
    
    
    
    // constructions:
    
    /**
     * Transforms the specified `srcProps` with the equivalent literal object,  
     * in which some values might be partially/fully *transformed*.  
     * The duplicate values will be replaced with a `var(...)` linked to the existing props in `refProps`.  
     * @param srcProps The literal object to transform.
     * @param refProps The literal object as the props reference.
     * @param propRename A handler to rename the prop names of `srcProps`.
     * @returns  
     * `null` => *no* transformation was performed.  
     * -or-  
     * A literal object which is equivalent to `srcProps`.
     */
    const transformDuplicates = <TSrcValue, TRefValue>(srcProps: Dictionary<TSrcValue>, refProps: Dictionary<TRefValue>, propRename?: ((srcPropName: string) => string)): (Dictionary<TSrcValue|CssCustomValue> | null) => {
        /**
         * Determines if the specified `srcPropValue` can be transformed to another equivalent prop link `var(...)`.
         * @param srcPropValue The value to test.
         * @returns `true` indicates it's transformable, otherwise `false`.
         */
        const isTransformableProp = <TTSrcValue,>(srcPropValue: TTSrcValue): boolean => {
            if ((srcPropValue === undefined) || (srcPropValue === null)) return false; // skip nullish prop
            
            if ((typeof(srcPropValue) === 'string')) {
                switch(srcPropValue) {
                    // ignore global keywords
                    case 'none':
                    case 'unset':
                    case 'inherit':
                    case 'initial':
                    case 'revert':
                        return false;
                } // switch
            } // if
            
            return true; // passed, transformable
        };
        
        /**
         * Determines if the specified `srcPropName` and `refPropName` are pointed to the same object.
         * @param srcPropName The prop name of `srcProps`.
         * @param refPropName The prop name of `refProps`.
         * @returns `true` indicates the same object, otherwise `false`.
         */
        const isSelfProp = (srcPropName: string, refPropName: string): boolean => {
            if (!Object.is(srcProps, refProps)) return false; // if `srcProps` & `refProps` are not the same object in memory => always return `false`
            
            return (srcPropName === refPropName);
        };
        
        /**
         * Determines if the specified `srcPropName` is a special `@keyframes name`.
         * @param srcPropName The prop name of `srcProps`.
         * @returns  
         * A `string` represents the name of `@keyframes`.  
         * -or-  
         * `null` if not a special `@keyframes name`.
         */
        const isKeyframesName = (srcPropName: string): CssCustomKeyframesRef|null => {
            if (!srcPropName.startsWith('@keyframes ')) return null;
            return srcPropName.slice(11).trimStart();
        }
        
        /**
         * Determines if the specified `refPropValue` was exist in `genKeyframes`.
         * @param refPropValue The prop value of `refProps`.
         * @returns `true` if it was exist in `genKeyframes`, otherwise `false`.
         */
        const isExistingKeyframes = <TTRefValue,>(refPropValue: TTRefValue): boolean => {
            if (!refPropValue)                     return false; // must not null|undefined
            if (typeof(refPropValue) !== 'object') return false; // must an object
            if (Array.isArray(refPropValue))       return false; // not  an array
            
            
            
            return (
                Object.values(genKeyframes)
                .some((keyframesRef) => Object.is(keyframesRef, refPropValue))
            );
        };
        
        /**
         * Determines if the specified `srcPropValue` and `refPropValue` are deeply the same by value or by reference.
         * @param srcPropValue The first value to test.
         * @param refPropValue The second value to test.
         * @returns `true` if both are equal, otherwise `false`.
         */
        const deepEqual = <TTSrcValue, TTRefValue>(srcPropValue: TTSrcValue, refPropValue: TTRefValue): boolean => {
            if (Object.is(srcPropValue, refPropValue)) return true; // shallow equal
            
            
            
            if (isExistingKeyframes(refPropValue)) return false; // `@keyframes` must be compared by reference, no deep equal
            
            
            
            // both must be an object:
            if (typeof(srcPropValue) !== 'object') return false;
            if (typeof(refPropValue) !== 'object') return false;
            
            // both must be an array -or- both must not be an array:
            if (Array.isArray(srcPropValue) !== Array.isArray(refPropValue)) return false;
            
            
            
            // both props count must be the same:
            if (Object.keys(srcPropValue).length !== Object.keys(refPropValue).length) return false;
            
            for (const [deepPropName, deepSrcPropValue] of Object.entries(srcPropValue)) {
                if (!deepEqual(deepSrcPropValue, (refPropValue as any)[deepPropName])) return false; // the same prop name with different prop value => false
            } // for
            
            
            
            return true; // no differences detected => true
        };
        
        /**
         * Determines if the specified entry [`srcPropName`, `srcPropValue`] has the equivalent entry in `refProps`.
         * @param srcPropName The prop name of `srcProps`.
         * @param srcPropValue The prop value of `srcProps`.
         * @returns A `CssCustomSimpleRef` represents the link to the equivalent entry in `refProps`.  
         * -or- `null` if no equivalent found.
         */
        const findEqualProp = <TTSrcValue,>(srcPropName: string, srcPropValue: TTSrcValue): (CssCustomSimpleRef|null) => {
            for (const [refPropName, refPropValue] of Object.entries(refProps)) { // search for duplicates
                if ((refPropValue === undefined) || (refPropValue === null)) continue; // skip empty ref
                if (isSelfProp(srcPropName, refPropName)) break;                       // stop search if reaches current entry (search for prev entries only)
                
                
                
                if (!isTransformableProp(srcPropValue)) continue; // skip non transformable prop
                
                
                
                // comparing the `srcPropValue` & `refPropValue` deeply:
                if (deepEqual(srcPropValue, refPropValue)) return createRef(refPropName); // return the link to the ref
            } // for // search for duplicates
            
            return null; // not found
        }
        
        /**
         * Determines if the specified `srcKeyframes` has the equivalent value in `genKeyframes`.
         * @param srcKeyframes The value of `@keyframes`.
         * @returns A `CssKeyframes` represents the object reference to the equivalent value in `genKeyframes`.  
         * -or- `null` if no equivalent found.
         */
        const findEqualKeyframes = (srcKeyframes: CssKeyframes): (CssKeyframes|null) => {
            for (const refKeyframes of Object.values(genKeyframes)) { // search for duplicates
                // if ((refKeyframes === undefined) || (refKeyframes === null)) continue; // skip empty ref
                
                
                
                // comparing the `srcKeyframes` & `refKeyframes` deeply:
                if (deepEqual(srcKeyframes, refKeyframes)) return refKeyframes; // return the object reference to the ref
            } // for // search for duplicates
            
            return null; // not found
        }
        
        
        
        /**
         * Stores the modified entries of `srcProps`.
         */
        const modifSrcProps: Dictionary<TSrcValue|CssCustomValue> = {}; // initially empty (no modification)
        
        
        
        for (const [srcPropName, srcPropValue] of Object.entries(srcProps)) { // walk each entry in `srcProps`
            if ((srcPropValue === undefined) || (srcPropValue === null)) continue; // skip empty src
            
            
            
            //#region handle `@keyframes foo`
            {
                const keyframesName = isKeyframesName(srcPropName);
                if (keyframesName) {
                    let srcKeyframes = srcPropValue as unknown as CssKeyframes; // assumes the current `srcPropValue` is a valid `@keyframes`' value.
                    srcKeyframes = findEqualKeyframes(srcKeyframes) ?? srcKeyframes;
                    
                    
                    
                    // create a link to current `@keyframes` name:
                    const keyframesReference = createKeyframesRef(keyframesName); // `@keyframes`' name is always created even if the content is the same as the another `@keyframes`
                    
                    // store the new `@keyframes`:
                    genKeyframes[keyframesReference] = srcKeyframes;
                    
                    
                    
                    // store the modified `srcProps`' entry:
                    modifSrcProps[propRename?.(srcPropName) ?? srcPropName] = keyframesReference;
                    
                    // mission done => continue walk to the next entry:
                    continue;
                } // if
            }
            //#endregion handle `@keyframes foo`
            
            
            
            //#region handle equal entry
            {
                const equalPropRef = findEqualProp(srcPropName, srcPropValue);
                if (equalPropRef) {
                    // store the modified `srcProps`' entry:
                    modifSrcProps[propRename?.(srcPropName) ?? srcPropName] = equalPropRef;
                    
                    // mission done => continue walk to the next entry:
                    continue;
                } // if
            }
            //#endregion handle equal entry
            
            
            
            //#region handle array
            if (Array.isArray(srcPropValue)) {
                // convert the array as a literal object:
                const srcLiteralProps = srcPropValue as Dictionary<any>;
                
                
                
                const equalLiteral = transformDuplicates(/*srcProps: */srcLiteralProps, /*refProps: */refProps);
                if (equalLiteral) {
                    // convert the literal object back to an array:
                    const equalArray: ValueOf<typeof equalLiteral>[] = [];
                    Object.assign(equalArray, equalLiteral); // convert literal object to array
                    
                    
                    
                    // store the modified `srcProps`' entry:
                    modifSrcProps[propRename?.(srcPropName) ?? srcPropName] = equalArray;
                    
                    // mission done => continue walk to the next entry:
                    continue;
                } // if
            } // if
            //#endregion handle array
            
            
            
            //#region handle no value change
            if (propRename) {
                // The `srcPropValue` was not modified but the `srcPropName` needs to be renamed:
                modifSrcProps[propRename(srcPropName)] = srcPropValue;
            } // if
            //#endregion handle no value change
        } // for // walk each entry in `srcProps`
        
        
        
        // if the `modifSrcProps` is not empty (has any modifications) => return the (original + modified):
        if (Object.keys(modifSrcProps).length) {
            // `propRename` does exists    => all entries are always modified => return the modified:
            if (propRename) return modifSrcProps;
            
            // `propRename` doesn't exists => return (original + modified):
            return {...srcProps, ...modifSrcProps};
        } // if
        
        
        
        return null; // `null` means no modification was performed
    }
    
    const rebuild = () => {
        // // backup prev generated data for comparison:
        // const oldGenKeyframes = genKeyframes;
        // const oldGenProps     = genProps;
        
        
        
        const props = getProps();
        
        
        
        // transform the `props`:
        genKeyframes = {}; // clear cached `@keyframes`
        genProps     = transformDuplicates(/*srcProps: */props, /*refProps: */props, /*propRename: */(srcPropName) => createDecl(srcPropName)) ?? props;
        
        
        
        //#region transform the keyframes
        /*
            Dictionary<CssKeyframes>:
            keyframesName     : keyframes
            ------------------:---------------------------
            string            : CssKeyframes
            string            : Dictionary<Style>
            ------------------:---------------------------
            '@keyframes foo'  : { '0%': {'opacity': 0.5} },
            '@keyframes dude' : { 'to': {'opacity': 1.0} },
        */
        for (const keyframes of Object.values(genKeyframes)) {
            /*
                CssKeyframes
                Dictionary<Style>
                -------:---------------
                key    : frame
                -------:---------------
                string : Style
                -------:---------------
                '12%'  : {
                            'opacity' : 0.5,
                            'color'   : 'red',
                            'some'    : CssCustomValue,
                         }
            */
            for (const [key, frame] of Object.entries(keyframes)) {
                const frameStyle = mergeStyles(frame);
                if (!frameStyle) {
                    delete keyframes[key]; // delete empty frames
                    continue; // skip empty frames
                } // if
                
                
                
                const equalFrameProps = transformDuplicates(/*srcProps: */frameStyle, /*refProps: */props);
                if (equalFrameProps) {
                    keyframes[key] = equalFrameProps;
                } // if
            } // for
        } // for
        //#endregion transform the keyframes
        
        
        
        // // calculate the generated data changes:
        // const remGenKeyframes = Object.entries(oldGenKeyframes).filter(([name, value]) => !(name in    genKeyframes) /*not exist in new*/ /* || !Object.is(value,    genKeyframes[name])*/ /*old !== new*/);
        // const addGenKeyframes = Object.entries(   genKeyframes).filter(([name, value]) => !(name in oldGenKeyframes) /*not exist in old*/    || !Object.is(value, oldGenKeyframes[name])   /*new !== old*/);
        // const remGenProps     = Object.entries(oldGenProps)    .filter(([name, value]) => !(name in    genProps)     /*not exist in new*/ /* || !Object.is(value,    genProps[name])*/     /*old !== new*/);
        // const addGenProps     = Object.entries(   genProps)    .filter(([name, value]) => !(name in oldGenProps)     /*not exist in old*/    || !Object.is(value, oldGenProps[name])       /*new !== old*/);
        
        
        
        // (re)build the styleSheet:
        
        // update styleSheet:
        liveStyleSheet.next({
            ...atGlobal({
                ...rule(liveOptions.selector, genProps as Dictionary<CssCustomValue>),
                ...Object.entries(genKeyframes).map(([name, items]) => keyframes(name, items)),
            }),
        });
    }
    
    /**
     * Holds the validity status of the `genProps` & `genKeyframes`.  
     * `false` is invalid or never built.  
     * `true`  is valid.
     */
    let _valid = false;
    
    /**
     * Regenerates the `genProps` & `genKeyframes`.
     * @param immediately `true` to update immediately (guaranteed has fully updated after `update()` returned) -or- `false` to update shortly after current execution finished.
     */
    const update = (immediately = false): void => {
        if (immediately) {
            // regenerate the data now:
            
            rebuild();
            _valid = true; // mark the `genProps` & `genKeyframes` as valid
            
            // now the data is guaranteed regenerated.
        }
        else {
            // promise to regenerate the data in the future as soon as possible:
            
            _valid = false;         // mark the `genProps` as invalid
            requestAnimationFrame(() => {
                if (_valid) return; // has been previously generated => abort
                rebuild();
                _valid = true;      // mark the `genProps` as valid
            });
        } // if
    }
    update(); // regenerate the `genProps` & `genKeyframes` for the first time
    
    /**
     * Ensures the `genProps` & `genKeyframes` was fully generated.
     */
    const ensureGenerated = () => {
        if (_valid) {
            // console.log('update not required');
            return; // if was valid => return immediately
        } // if
        
        
        update(/*immediately*/true); // regenerate the `genProps` & `genKeyframes` and wait until completed
        // console.log(`update done - prefix: ${prefix}`);
    }
    
    
    
    // Proxy's getters & setters:
    
    /**
     * Gets the *declaration name* of the specified `propName`, eg: `--my-favColor`.
     * @param propName The `props`'s prop name to retrieve.
     * @returns A `CssCustomName` represents the declaration name of the specified `propName` -or- `undefined` if it doesn't exist.
     */
    const getDecl   = (propName: string): CssCustomName|undefined => {
        if (propName === '$$typeof') return undefined; // react runtime type check
        
        
        
        /*
            source    props:
            {
                '@keyframes foo' :  {...}
                'myFavColor'     : 'blue',
            }

            generated genProps:
            {
                '--pfx-keyframes-foo' : 'pfx-foo',             // '@keyframes foo'  => decl() => '--pfx-keyframes-foo'
                '--pfx-myFavColor'    : 'var(--col-primary)',  // 'myFavColor'      => decl() => '--pfx-myFavColor'
                '@keyframes pfx-foo'  : {...}
            }
        */
        
        
        
        ensureGenerated(); // ensures the `genProps` & `genKeyframes` was fully generated.
        
        
        
        const propDecl = createDecl(propName);
        
        // check if the `genProps` has `propDecl`:
        if (!(propDecl in genProps)) return undefined; // not found
        
        return propDecl;
    }
    
    /**
     * Gets the *value* (reference) of the specified `propName`, not the *direct* value, eg: `var(--my-favColor)`.
     * @param propName The `props`'s prop name to retrieve.
     * @returns A `CssCustomSimpleRef` represents the expression for retrieving the value of the specified `propName` -or- `undefined` if it doesn't exist.
     */
    const getRef    = (propName: string): CssCustomSimpleRef|undefined => {
        const propDecl = getDecl(propName);
        if (!propDecl) return undefined; // not found
        
        return `var(${propDecl})`;
    }
    
    /**
     * Gets the *equivalent value* of the specified `propName`, might be the *transformed* value, eg: `[['var(--pad-y)', 'var(--pad-x)']]` -or- the *direct* value, eg: `[['5px', '10px']]`.
     * @param propName The `props`'s prop name to retrieve.
     * @returns A `ValueOf<TProps>` or `CssCustomValue` represents the value of the specified `propName` -or- `undefined` if it doesn't exist.
     */
    const getVal    = (propName: string): /*original: */TValue | /*transformed: */CssCustomValue | /*not found: */undefined => {
        const propDecl = getDecl(propName);
        if (!propDecl) return undefined; // not found
        
        return genProps[propDecl];
    }
    
    /**
     * Sets the *direct* value of the specified `propName`.
     * @param propName The `props`'s prop name to update.
     * @param newValue The new value.
     * @returns Always return `true`.
     */
    const setDirect = (propName: string, newValue: TValue): boolean => {
        const props = getProps();
        
        if ((newValue === undefined) || (newValue === null)) {
            delete props[propName];
            
            update(); // setting changed => need to `update()` the jss
        }
        else
        {
            if (props[propName] !== newValue) {
                props[propName] = newValue; // oldValue is different than newValue => update the value
                
                update(); // setting changed => need to `update()` the jss
            } // if
        } // if
        
        return true; // notify update was successful
    }
    
    const getPropList = (): ArrayLike<string|symbol> => {
        return Object.keys(getProps());
    }
    
    const getPropDescRef = (propName: string): PropertyDescriptor|undefined => {
        const propRef = getRef(propName);
        if (!propRef) return undefined; // not found
        
        return {
            value        : propRef,
            
            writable     : true,
            enumerable   : true,
            configurable : true,
        };
    }
    const getPropDescVal = (propName: string): PropertyDescriptor|undefined => {
        const propVal = getVal(propName);
        if (!propVal) return undefined; // not found
        
        return {
            value        : propVal,
            
            writable     : true,
            enumerable   : true,
            configurable : true,
        };
    }
    
    
    
    return [
        //#region proxies - representing data in various formats
        new Proxy<Dictionary</*getter: */     CssCustomSimpleRef | /*setter: */TValue>>(unusedObj, {
            get                      : (_unusedObj, propName: string)                   => getRef(propName),
            set                      : (_unusedObj, propName: string, newValue: TValue) => setDirect(propName, newValue),
            deleteProperty           : (_unusedObj, propName: string)                   => setDirect(propName, null as any),
            
            ownKeys                  : (_unusedObj)                                     => getPropList(),
            getOwnPropertyDescriptor : (_unusedObj, propName: string)                   => getPropDescRef(propName),
        }) as Refs<TProps>,
        
        new Proxy<Dictionary</*getter: */TValue | CssCustomValue | /*setter: */TValue>>(unusedObj, {
            get                      : (_unusedObj, propName: string)                   => getVal(propName),
            set                      : (_unusedObj, propName: string, newValue: TValue) => setDirect(propName, newValue),
            deleteProperty           : (_unusedObj, propName: string)                   => setDirect(propName, null as any),
            
            ownKeys                  : (_unusedObj)                                     => getPropList(),
            getOwnPropertyDescriptor : (_unusedObj, propName: string)                   => getPropDescVal(propName),
        }) as Vals<TProps>,
        //#endregion proxies - representing data in various formats
        
        
        
        // options:
        liveOptions,
    ];
}




// utilities:

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

class TransformDuplicatesBuilder<TSrcPropName extends string|number|symbol, TSrcPropValue extends CssCustomValue|undefined|null,   TRefPropName extends string|number|symbol, TRefPropValue extends CssCustomValue|undefined|null> {
    //#region private properties
    readonly #srcProps     : Map<TSrcPropName, TSrcPropValue>
    readonly #refProps     : Map<TRefPropName, TRefPropValue>
    readonly #genKeyframes : Map<CssCustomKeyframesRef, CssKeyframes>
    readonly #options      : LiveCssConfigOptions
    //#endregion private properties
    
    //#region public properties
    readonly #result        : Map<TSrcPropName, TSrcPropValue|CssCustomValue>|null
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
     * Determines if the specified `srcPropName` is a special `@keyframes name`.
     * @param srcPropName The prop name of `#srcProps`.
     * @returns  
     * A `CssCustomKeyframesRef` represents the name of `@keyframes`.  
     * -or-  
     * `null` if it's not a special `@keyframes name`.
     */
    #isKeyframesName(srcPropName: TSrcPropName & string): CssCustomKeyframesRef|null {
        if (!srcPropName.startsWith('@keyframes ')) return null;
        return srcPropName.slice(11).trimStart();
    }
    
    /**
     * Determines if the specified `refPropValue` was exist in `#genKeyframes`.
     * @param refPropValue The prop value of `#refProps`.
     * @returns `true` if it was exist in `#genKeyframes`, otherwise `false`.
     */
    #isExistingKeyframesRef(refPropValue: TRefPropValue|CssKeyframes): boolean {
        if (!refPropValue)                     return false; // must not null|undefined
        if (typeof(refPropValue) !== 'object') return false; // must an object
        if (Array.isArray(refPropValue))       return false; // not  an array
        
        
        
        return (
            Array.from(this.#genKeyframes.values())
            .some((keyframesRef) => Object.is(keyframesRef, refPropValue))
        );
    }
    
    /**
     * Determines if the specified `srcPropValue` and `refPropValue` are deeply the same by value or by reference.
     * @param srcPropValue The first value to test.
     * @param refPropValue The second value to test.
     * @returns `true` if both are equal, otherwise `false`.
     */
    #isDeepEqual(srcPropValue: TSrcPropValue|CssKeyframes, refPropValue: TRefPropValue|CssKeyframes): boolean {
        // shallow equal comparison:
        if (Object.is(srcPropValue, refPropValue)) return true;
        
        
        
        // prevents a @keyframes object be compared deeply:
        if (this.#isExistingKeyframesRef(refPropValue)) return false;
        
        
        
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
        for (const deepPropName in (srcPropValue as TSrcPropValue & CssKeyframes)) {
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
    
    /**
     * Determines if the specified `srcKeyframes` has the equivalent `@keyframes` in `#genKeyframes`.
     * @param srcKeyframes The reference of `@keyframes`.
     * @returns A `CssKeyframes` represents the object reference to the equivalent `@keyframes` in `#genKeyframes`.  
     * -or- `null` if no equivalent found.
     */
    #findEqualKeyframes(srcKeyframes: CssKeyframes): CssKeyframes|null {
        for (const refKeyframes of this.#genKeyframes.values()) { // search for duplicates
            // comparing the `srcKeyframes` & `refKeyframes` deeply:
            if (this.#isDeepEqual(srcKeyframes, refKeyframes)) return refKeyframes; // return the object reference to the ref
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
    protected _onCombineModified(modified: Map<TSrcPropName, TSrcPropValue|CssCustomValue>): Map<TSrcPropName, TSrcPropValue|CssCustomValue> {
        const combined = new Map<TSrcPropName, TSrcPropValue|CssCustomValue>(this.#srcProps);
        
        for (const [propName, propValue] of modified) {
            combined.set(propName, propValue);
        } // for
        
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
    constructor(srcProps: Map<TSrcPropName, TSrcPropValue>, refProps: Map<TRefPropName, TRefPropValue>, genKeyframes: Map<CssCustomKeyframesRef, CssKeyframes>, options: LiveCssConfigOptions) {
        this.#srcProps     = srcProps;
        this.#refProps     = refProps;
        this.#genKeyframes = genKeyframes;
        this.#options      = options;
        
        
        
        const modified = new Map<TSrcPropName, TSrcPropValue|CssCustomValue>();
        for (const [srcPropName, srcPropValue] of this.#srcProps) { // walk each entry in `#srcProps`
            // skip empty src:
            if ((srcPropValue === undefined) || (srcPropValue === null)) continue;
            
            
            
            //#region handle `@keyframes foo`
            const keyframesName = (typeof(srcPropName) === 'string') && this.#isKeyframesName(srcPropName);
            if (keyframesName) {
                let srcKeyframes = srcPropValue as unknown as CssKeyframes; // assumes the current `srcPropValue` is a valid `@keyframes`' value.
                
                
                
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
            } // if
            //#endregion handle `@keyframes foo`
            
            
            
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
            
            
            
            //#region handle multi_value
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
                    const srcNestedValues = equalNestedValues.values() as unknown as CssCustomValueArr;
                    
                    
                    
                    // store the modified `srcPropValue`:
                    modified.set(
                        this._onCreatePropName(srcPropName),
                        srcNestedValues
                    );
                    
                    // mission done => continue walk to the next entry:
                    continue;
                } // if
            } // if
            //#endregion handle multi_value
            
            
            
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
    protected _onCreatePropName(srcPropName: keyof TConfigProps): (keyof TConfigProps) {
        if (typeof(srcPropName) !== 'string') return srcPropName;
        return this._createDecl(srcPropName) as (keyof TConfigProps);
    }
    protected _onCombineModified(modified: Map<keyof TConfigProps, ValueOf<TConfigProps>|CssCustomValue>): Map<keyof TConfigProps, ValueOf<TConfigProps>|CssCustomValue> {
        return modified;
    }
    
    get result() {
        return super.result as Map<CssCustomName, ValueOf<TConfigProps>|CssCustomValue>|null
    }
    //#endregion overrides
    
    
    
    constructor(srcProps: Map<keyof TConfigProps, ValueOf<TConfigProps>>, genKeyframes: Map<CssCustomKeyframesRef, CssKeyframes>, options: LiveCssConfigOptions) {
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
                (this.#propsFactory as Factory<TConfigProps>)()
                :
                this.#propsFactory
            );
            this.#_propsCache = new Map<keyof TConfigProps, ValueOf<TConfigProps>>(
                Object.entries(props)
                .map(([propName, propValue]) => [propName as keyof TConfigProps, propValue as ValueOf<TConfigProps>] as const)
            );
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
     * };  
     */
    #genProps = new Map<CssCustomName, ValueOf<TConfigProps>|CssCustomValue>();
    
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
        const genKeyframes = new Map<CssCustomKeyframesRef, CssKeyframes>();
        this.#genProps = (
            (new TransformCssConfigDuplicatesBuilder<TConfigProps>(props, genKeyframes, this.#options)).result
            ??
            (props as Map<CssCustomName, ValueOf<TConfigProps>|CssCustomValue>)
        );
        //#endregion transform the `props` 
        
        
        
        //#region transform the keyframes
        for (const keyframes of genKeyframes.values()) { // walk each value in `genKeyframes`
            for (const [key, frame] of Object.entries(keyframes)) {
                const frameStyle = mergeStyles(frame);
                if (!frameStyle) {
                    delete keyframes[key]; // delete empty frames
                    continue; // skip empty frames
                } // if
                
                
                
                let frameProps : Map<keyof CssProps, ValueOf<CssProps>|CssCustomValue> = new Map(
                    Object.entries(frameStyle)
                    .map(([propName, propValue]) => [propName as keyof CssProps, propValue as ValueOf<CssProps>] as const)
                );
                const equalFrameProps = (new TransformDuplicatesBuilder(frameProps, props, genKeyframes, this.#options)).result;
                if (equalFrameProps) {
                    keyframes[key] = Object.fromEntries(equalFrameProps) as CssStyle;
                } // if
            } // for
        } // walk each value in `genKeyframes`
        //#endregion transform the keyframes
        
        
        
        // update styleSheet:
        this.#liveStyleSheet.next({
            ...atGlobal({
                ...rule(this.#options.selector, Object.fromEntries(this.#genProps)),
                ...Array.from(genKeyframes).map(([name, value]) => keyframes(name, value)),
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
    #getVal(propName: string): ValueOf<TConfigProps>|CssCustomValue|undefined {
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
        // TODO: remove any:
        styleSheet(this.#liveStyleSheet as any);
        
        
        
        // regenerate the `#genProps` for the first time:
        this.#update();
        
        
        
        // proxies - representing data in various formats:
        this.#refs = new Proxy<Dictionary</*getter: */                  CssCustomSimpleRef | /*setter: */ValueOf<TConfigProps>>>(unusedObj, {
            get            : (_unusedObj, propName: string)                                  => this.#getRef(propName),
            set            : (_unusedObj, propName: string, newValue: ValueOf<TConfigProps>) => this.#setDirect(propName, newValue),
            deleteProperty : (_unusedObj, propName: string)                                  => this.#setDirect(propName, undefined),
            
            ownKeys        : (_unusedObj)                                                    => this.#getPropList(),
        }) as Refs<TConfigProps>;
        this.#vals = new Proxy<Dictionary</*getter: */ValueOf<TConfigProps>|CssCustomValue | /*setter: */ValueOf<TConfigProps>>>(unusedObj, {
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
