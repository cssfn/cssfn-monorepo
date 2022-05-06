export type Optional<T>                    = T|null|undefined
export type OptionalOrBoolean<T>           = Optional<T|boolean>
export type SingleOrArray<T>               = T|T[]

export type DeepArray<T>                   = (T|DeepArray<T>)[] // ===       T[]  |  T[][]  |  T[][][]  |  ...
export type SingleOrDeepArray<T>           = T|DeepArray<T>     // === T  |  T[]  |  T[][]  |  T[][][]  |  ...

export type Factory<T>                     = () => T
export type ProductOrFactory<T>            = T|Factory<T>
export type ProductOrFactoryDeepArray<T>   = (ProductOrFactory<T> | ProductOrFactoryDeepArray<T>)[] // ===         T[]|F[]  |  T[][]|F[][]  |  T[][][]|F[][][]  |  ...
export type ProductOrFactoryOrDeepArray<T> =  ProductOrFactory<T> | ProductOrFactoryDeepArray<T>    // === T|F  |  T[]|F[]  |  T[][]|F[][]  |  T[][][]|F[][][]  |  ...

export type Nullable<T>                    = { [Key in keyof T] ?: null | T[Key] }

export type Dictionary<TValue>             = { [key: string]: TValue } // do not use Record<string, TValue> => doesn't support circular ref
export type ValueOf<TDictionary>           = TDictionary[keyof TDictionary]
export type DictionaryOf<TDictionary>      = Dictionary<ValueOf<TDictionary>>
