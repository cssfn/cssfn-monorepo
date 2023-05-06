// optionals:
export type Optional<T>                    = T|null|undefined
export type OptionalOrBoolean<T>           = Optional<T|boolean>



// arrays:
export type MaybeArray<T>                  = T|Array<T>

export type DeepArray<T>                   = Array<T|DeepArray<T>> // recursive
export type MaybeDeepArray<T>              = T|DeepArray<T>



// promises:
export type MaybePromise<T>                = T|Promise<T>



// factories:
export type Factory<out T>                 = () => T
export type MaybeFactory<T>                = T|Factory<T>

export type MaybeFactoryDeepArray<T>       = Array<MaybeFactory<T> | MaybeFactoryDeepArray<T>> // recursive

export type MaybeFactoryMaybeDeepArray<T>  = MaybeFactory<T> | MaybeFactoryDeepArray<T>



// modules:
export type ModuleDefault<out T>           = { default: T } // only accept the default export, ignores named exports
export type LazyModuleDefault<out T>       = Factory<Promise<ModuleDefault<T>>>
export type MaybeLazyModuleDefault<T>      = T|LazyModuleDefault<T>



// dictionaries/maps:
export type PartialNullish<T>              = { [Key in keyof T] ?: null |  T[Key]                  }
export type RequiredNotNullish<T>          = { [Key in keyof T]  : Exclude<T[Key], undefined|null> }

export type Dictionary<TValue>             = { [key: string]: TValue } // do not use Record<string, TValue> => doesn't support circular ref
export type ValueOf<TDictionary>           = TDictionary[keyof TDictionary]
export type DictionaryOf<TDictionary>      = Dictionary<ValueOf<TDictionary>>

export type MapOf<T>                       = Map<keyof T, ValueOf<T>>
