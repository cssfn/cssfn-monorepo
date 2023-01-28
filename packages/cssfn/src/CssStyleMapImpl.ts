// cssfn:
import type {
    // types:
    OptionalOrBoolean,
}                           from '@cssfn/types'
import type {
    // css custom properties:
    CssCustomProps,
    
    
    
    // css known (standard) properties:
    CssKnownProps,
    
    
    
    // cssfn properties:
    CssRuleData,
    CssRule,
    
    CssStyle,
    CssUnionKey,
    CssUnionValue,
    CssStyleMap,
}                           from '@cssfn/css-types'



const isRuleKey = (key: CssUnionKey) : key is Extract<typeof key, symbol> => typeof(key) === 'symbol';
const isPropKey = (key: CssUnionKey) : key is Extract<typeof key, string> => typeof(key) === 'string';
export class CssStyleMapImpl
    extends
        Map<keyof CssStyle, CssStyle[keyof CssStyle]>
    
    implements
        CssStyleMap
{
    // filtered iterators:
    _ruleKeysCache      : WeakRef<Array<keyof CssRule>>|undefined = undefined
    get ruleKeys()      : Array<keyof CssRule> {
        const cached = this._ruleKeysCache?.deref();
        if (cached) return cached;
        
        
        
        const result = this.keysAsArray.filter(isRuleKey);
        this._ruleKeysCache = new WeakRef<Array<keyof CssRule>>(result);
        return result;
    }
    
    _propKeysCache      : WeakRef<Array<keyof CssCustomProps|keyof CssKnownProps>>|undefined = undefined
    get propKeys()      : Array<keyof CssCustomProps|keyof CssKnownProps> {
        const cached = this._propKeysCache?.deref();
        if (cached) return cached;
        
        
        
        const result = this.keysAsArray.filter(isPropKey);
        this._propKeysCache = new WeakRef<Array<keyof CssCustomProps|keyof CssKnownProps>>(result);
        return result;
    }
    
    _hasRuleKeysCache   : boolean|undefined = undefined
    get hasRuleKeys()   : boolean {
        const cached = this._hasRuleKeysCache;
        if (cached !== undefined) return cached;
        
        
        
        const result = !!this.ruleKeys.length;
        this._hasRuleKeysCache = result;
        return result;
    }
    
    _hasPropKeysCache   : boolean|undefined = undefined
    get hasPropKeys()   : boolean {
        const cached = this._hasPropKeysCache;
        if (cached !== undefined) return cached;
        
        
        
        const result = !!this.propKeys.length;
        this._hasPropKeysCache = result;
        return result;
    }
    
    _rulesCache : WeakRef<Array<CssRuleData>>|undefined = undefined
    get rules() : Array<CssRuleData> {
        const cached = this._rulesCache?.deref();
        if (cached) return cached;
        
        
        
        const result = this.ruleKeys.map(this.get.bind(this)) as CssRuleData[];
        this._rulesCache = new WeakRef<Array<CssRuleData>>(result);
        return result;
    }
    
    
    
    // iterators:
    [Symbol.iterator]() : IterableIterator<[CssUnionKey, CssUnionValue]> {
        return this.entries();
    }
    entries()           : IterableIterator<[CssUnionKey, CssUnionValue]> {
        return super.entries();
    }
    _keysCache          : WeakRef<Array<CssUnionKey>>|undefined = undefined
    get keysAsArray()   : Array<CssUnionKey> {            // do  cached enumerator, optimized for enumerating MULTIPLE TIMES
        const cached = this._keysCache?.deref();
        if (cached) return cached;
        
        
        
        const result = Array.from(super.keys());
        this._keysCache = new WeakRef<Array<CssUnionKey>>(result);
        return result;
    }
    keys()              : IterableIterator<CssUnionKey> { // non cached enumerator, optimized for enumerating ONE TIMES
        const cached = this._keysCache?.deref();
        if (cached) return cached.values();
        
        
        
        return super.keys();
    }
    values()            : IterableIterator<CssUnionValue> {
        return super.values();
    }
    
    
    
    clear(): void {
        super.clear();
        
        this._ruleKeysCache    = undefined; // clear cache
        this._propKeysCache    = undefined; // clear cache
        this._rulesCache       = undefined; // clear cache
        this._keysCache        = undefined; // clear cache
        this._hasRuleKeysCache = false;     // set cache
        this._hasPropKeysCache = false;     // set cache
    }
    
    
    
    delete(key: keyof CssCustomProps): boolean
    delete(key: keyof CssKnownProps ): boolean
    delete(key: keyof CssRule       ): boolean
 // delete(key: keyof CssFinalRule  ): boolean
    delete(key: CssUnionKey         ): boolean {
        const hasChanged = super.delete(key);
        
        if (hasChanged) {
            if (typeof(key) === 'symbol') {
                this._ruleKeysCache    = undefined; // clear cache
                this._rulesCache       = undefined; // clear cache
                this._hasRuleKeysCache = undefined; // clear cache
            }
            else {
                this._propKeysCache    = undefined; // clear cache
                this._hasPropKeysCache = undefined; // clear cache
            } // if
            this._keysCache            = undefined; // clear cache
        } // if
        
        return hasChanged;
    }
    
    
    
    forEach(callbackfn: ((value: any, key: any, map: any) => void), thisArg?: any): void {
        return super.forEach(callbackfn, thisArg);
    }
    
    
    
    get(key: keyof CssCustomProps): CssCustomProps[keyof CssCustomProps] | undefined
    get(key: keyof CssKnownProps ): CssKnownProps[keyof CssKnownProps]   | undefined
    get(key: keyof CssRule       ): CssRule[keyof CssRule]               | undefined
 // get(key: keyof CssFinalRule  ): CssFinalRule[keyof CssFinalRule]     | undefined
    get(key: CssUnionKey         ): any {
        return super.get(key);
    }
    
    
    
    has(key: keyof CssCustomProps): boolean
    has(key: keyof CssKnownProps ): boolean
    has(key: keyof CssRule       ): boolean
 // has(key: keyof CssFinalRule  ): boolean
    has(key: CssUnionKey         ): boolean {
        return super.has(key);
    }
    
    
    
    set(key: keyof CssCustomProps | keyof CssKnownProps, value: CssCustomProps[keyof CssCustomProps] | CssKnownProps[keyof CssKnownProps]): this
    set(key: keyof CssCustomProps, value: CssCustomProps[keyof CssCustomProps]): this
    set(key: keyof CssKnownProps , value: CssKnownProps[keyof CssKnownProps]  ): this
    set(key: keyof CssRule       , value: CssRule[keyof CssRule]              ): this
 // set(key: keyof CssFinalRule  , value: CssFinalRule[keyof CssFinalRule]    ): this
    set(key: CssUnionKey         , value: CssUnionValue                       ): this {
        const _this = super.set(key, value);
        
        if (typeof(key) === 'symbol') {
            this._ruleKeysCache    = undefined; // clear cache
            this._rulesCache       = undefined; // clear cache
            this._hasRuleKeysCache = true;      // set cache
        }
        else {
            this._propKeysCache    = undefined; // clear cache
            this._hasPropKeysCache = true;      // set cache
        } // if
        this._keysCache            = undefined; // clear cache
        
        return _this;
    }
}
export const cssStyleToMap = (style: OptionalOrBoolean<CssStyle>): CssStyleMap|null => {
    if (!style || (style === true)) return null;
    
    
    
    // fetch string props:
    // const map : CssStyleMap = new CssStyleMapImpl(Object.entries(style)); // slow!
    const map : CssStyleMap = new CssStyleMapImpl();
    for (const propName in style) { // faster!
        // an empty_string key is a special key => ignore:
        if ((propName as string) === '') continue;
        
        
        
        const propName2 = propName as keyof Omit<CssStyle, symbol>;
        map.set(propName2, style[propName2]);
    } //
    
    // fetch symbol props:
    for (const propName of Object.getOwnPropertySymbols(style)) {
        map.set(propName, style[propName]);
    } // for
    
    
    
    if (!map.size) return null;
    return map;
}
