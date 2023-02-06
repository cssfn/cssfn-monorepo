// optionals:
export type Optional<T>                    = T|null|undefined
export type OptionalOrBoolean<T>           = Optional<T|boolean>



// arrays:
export type MaybeArray<T>                  = T|Array<T>
/**
 * @deprecated renamed to `MaybeArray<T>`
 */
export type SingleOrArray<T>               = MaybeArray<T>

export type DeepArray<T>                   = Array<T|DeepArray<T>> // recursive
export type MaybeDeepArray<T>              = T|DeepArray<T>
/**
 * @deprecated renamed to `MaybeDeepArray<T>`
 */
export type SingleOrDeepArray<T>           = MaybeDeepArray<T>



// promises:
export type MaybePromise<T>                = T|Promise<T>



// factories:
export type Factory<T>                     = () => T
export type MaybeFactory<T>                = T|Factory<T>
/**
 * @deprecated renamed to `MaybeFactory<T>`
 */
export type ProductOrFactory<T>            = MaybeFactory<T>

export type MaybeFactoryDeepArray<T>       = Array<MaybeFactory<T> | MaybeFactoryDeepArray<T>> // recursive
/**
 * @deprecated renamed to `MaybeFactoryDeepArray<T>`
 */
export type ProductOrFactoryDeepArray<T>   = MaybeFactoryDeepArray<T>

export type MaybeFactoryMaybeDeepArray<T>  = MaybeFactory<T> | MaybeFactoryDeepArray<T>
/**
 * @deprecated renamed to `MaybeFactoryMaybeDeepArray<T>`
 */
export type ProductOrFactoryOrDeepArray<T> = MaybeFactoryMaybeDeepArray<T>



// modules:
export type ModuleDefault<T>               = { default: T } // only accept the default export, ignores named exports
/**
 * @deprecated please upgrade to `MaybeLazyModuleDefault<T>`, because non_lazy of dynamic_module doesn't make sense
 */
export type MaybeModuleDefault<T>          = T|ModuleDefault<T>
export type MaybeLazyModuleDefault<T>      = T|Factory<ModuleDefault<T>>



// dictionaries/maps:
export type PartialNullish<T>              = { [Key in keyof T] ?: null |  T[Key]                  }
export type RequiredNotNullish<T>          = { [Key in keyof T]  : Exclude<T[Key], undefined|null> }

export type Dictionary<TValue>             = { [key: string]: TValue } // do not use Record<string, TValue> => doesn't support circular ref
export type ValueOf<TDictionary>           = TDictionary[keyof TDictionary]
export type DictionaryOf<TDictionary>      = Dictionary<ValueOf<TDictionary>>

export type MapOf<T>                       = Map<keyof T, ValueOf<T>>
