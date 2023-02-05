export type Optional<T>                    = T|null|undefined
export type OptionalOrBoolean<T>           = Optional<T|boolean>
export type SingleOrArray<T>               = T|T[]

export type DeepArray<T>                   = (T|DeepArray<T>)[] // ===       T[]  |  T[][]  |  T[][][]  |  ...
export type SingleOrDeepArray<T>           = T|DeepArray<T>     // === T  |  T[]  |  T[][]  |  T[][][]  |  ...

export type MaybePromise<T>                = T|Promise<T>
export type ModuleDefault<T>               = { default: T } // only accept the default export, ignores named exports
export type MaybeModuleDefault<T>          = T|ModuleDefault<T>
export type Factory<T>                     = () => T
export type ProductOrFactory<T>            = T|Factory<T>
export type ProductOrFactoryDeepArray<T>   = (ProductOrFactory<T> | ProductOrFactoryDeepArray<T>)[] // ===         T[]|F[]  |  T[][]|F[][]  |  T[][][]|F[][][]  |  ...
export type ProductOrFactoryOrDeepArray<T> =  ProductOrFactory<T> | ProductOrFactoryDeepArray<T>    // === T|F  |  T[]|F[]  |  T[][]|F[][]  |  T[][][]|F[][][]  |  ...

export type PartialNullish<T>              = { [Key in keyof T] ?: null |  T[Key]                  }
export type RequiredNotNullish<T>          = { [Key in keyof T]  : Exclude<T[Key], undefined|null> }

export type Dictionary<TValue>             = { [key: string]: TValue } // do not use Record<string, TValue> => doesn't support circular ref
export type ValueOf<TDictionary>           = TDictionary[keyof TDictionary]
export type DictionaryOf<TDictionary>      = Dictionary<ValueOf<TDictionary>>

export type MapOf<T>                       = Map<keyof T, ValueOf<T>>
