// Optionals:

/**
 * Represents a value that can be `T`, `null`, or `undefined`.
 * - `T` ➝ Indicates the value exists.
 * - `null` or `undefined` ➝ Represents the absence of a value.
 */
export type Optional<T>                    = T | null | undefined

/**
 * Represents a value that can be `T`, `null`, `undefined`, or `boolean`.
 * - `T` ➝ Indicates the value exists.
 * - `null`, `undefined`, or `true` ➝ Represents the absence of a value.
 * - `true` specifically acts as a truthy flag for non-existence.
 * Useful for conditionally toggling values.
 */
export type OptionalOrBoolean<T>           = Optional<T | boolean>



// Arrays:

/**
 * Represents a value that can be either a single instance of `T` or an array of `T`.
 */
export type MaybeArray<T>                  = T | Array<T>

/**
 * Represents a deeply nested array of `T`.
 */
export type DeepArray<T>                   = Array<T | DeepArray<T>>

/**
 * Represents a value that can be either a single instance of `T` or a deeply nested array of `T`.
 */
export type MaybeDeepArray<T>              = T | DeepArray<T>



// Promises:

/**
 * Represents a value that can be either `T` or a Promise resolving to `T`.
 */
export type MaybePromise<T>                = T | Promise<T>



// Factories:

/**
 * Represents a function that returns a value of type `T`.
 */
export type Lazy<out T>                    = () => T

/**
 * @deprecated Use `Lazy<T>` instead.  
 * Represents a function that returns a value of type `T`.
 */
export type Factory<out T>                 = Lazy<T>


/**
 * Represents a value that can be either `T` or a function that returns `T`.
 */
export type MaybeLazy<T>                   = T | Lazy<T>

/**
 * @deprecated Use `MaybeLazy<T>` instead.  
 * Represents a value that can be either `T` or a function that returns `T`.
 */
export type MaybeFactory<T>                = MaybeLazy<T>


/**
 * Represents a deeply nested array where the elements can be either `T` or a function that returns `T`.
 */
export type DeepArrayMaybeLazy<T>          = Array<MaybeLazy<T> | DeepArrayMaybeLazy<T>>

/**
 * @deprecated Use `DeepArrayMaybeLazy<T>` instead.  
 * Represents a deeply nested array where the elements can be either `T` or a function that returns `T`.
 */
export type MaybeFactoryDeepArray<T>       = DeepArrayMaybeLazy<T>


/**
 * Represents a value that can be `T` or a function that returns `T` or a deeply nested array of such values.
 */
export type MaybeLazyDeepArray<T>          = MaybeLazy<T> | DeepArrayMaybeLazy<T>

/**
 * @deprecated Use `MaybeLazyDeepArray<T>` instead.  
 * Represents a value that can be `T` or a function that returns `T` or a deeply nested array of such values.
 */
export type MaybeFactoryMaybeDeepArray<T>  = MaybeLazyDeepArray<T>



// Modules:

/**
 * Represents an object wrapping a `default` property of type `T`, used for module imports.
 * - Accepts only default imports, excluding named exports.
 */
export type ModuleDefault<out T>           = { default: T }

/**
 * Represents a value that can be either:
 * - A direct instance of `T`, or
 * - A module default wrapping `T`.
 */
export type MaybeModuleDefault<T>          = T | ModuleDefault<T>


/**
 * Defines a lazy dynamic import, represented as a function that returns a Promise resolving to a `ModuleDefault<T>`.
 *
 * - Ensures deferred loading of a module.
 * - Returns a Promise-wrapped `ModuleDefault<T>` upon execution.
 */
export type LazyModuleDefault<out T>       = Lazy<Promise<ModuleDefault<T>>>

/**
 * Represents a value that can be either:
 * - A direct instance of `T`, or
 * - A lazy dynamic import resolving to `ModuleDefault<T>`.
 *
 * Enables deferred loading of modules while keeping type flexibility.
 */
export type MaybeLazyModuleDefault<T>      = T | LazyModuleDefault<T>



// Lazy resolutions:

/**
 * Represents a value that can be:
 * - A direct instance of `T`.
 * - A module default wrapping `T`.
 * - A Promise resolving to `T`.
 * - A Promise resolving to a module default wrapping `T`.
 *
 * Provides flexibility for handling both direct values and deferred resolution.
 */
export type MaybeDeferred<T>               = MaybePromise<MaybeModuleDefault<T>>

/**
 * Represents a function that returns one of the following:
 * - A direct instance of `T`.
 * - A module default wrapping `T`.
 * - A Promise resolving to `T`.
 * - A Promise resolving to a module default wrapping `T`.
 *
 * Enables lazy evaluation while supporting both direct values and deferred resolution.
 */
export type LazyMaybeDeferred<T>           = Lazy<MaybeDeferred<T>>

/**
 * Represents a value that can be:
 * - A direct instance of `T`.
 * - A module default wrapping `T`.
 * - A Promise resolving to `T`.
 * - A Promise resolving to a module default wrapping `T`.
 *
 * Alternatively, it can be a function that returns one of the above:
 * - A direct instance of `T`.
 * - A module default wrapping `T`.
 * - A Promise resolving to `T`.
 * - A Promise resolving to a module default wrapping `T`.
 *
 * Provides flexibility for both direct values and deferred resolution with optional lazy evaluation.
 */
export type MaybeLazyDeferred<T>           = MaybeLazy<MaybeDeferred<T>>



// Collections:

/**
 * Represents a partial object where properties can be:
 * - Their original value (`T[Key]`).
 * - `null`, explicitly allowing nullable fields.
 * - `undefined`, due to optional (`?:`) properties.
 *
 * Useful for handling objects with optional nullable properties.
 */
export type PartialNullish<T>              = { [Key in keyof T] ?: null |  T[Key]                  }

/**
 * Represents an object where all properties are required and cannot be `undefined` or `null`.
 * - Ensures all values are explicitly defined.
 * - Excludes both `undefined` and `null` from property types.
 */
export type RequiredNotNullish<T>          = { [Key in keyof T]  : Exclude<T[Key], undefined|null> }


/**
 * Defines a dictionary where keys are `string` and values are of type `TValue`.
 * - Avoids `Record<string, TValue>` due to lack of circular reference support.
 * - Provides flexibility for structured key-value mappings.
 */
export type Dictionary<TValue>             = { [key: string]: TValue }

/**
 * Extracts the union of all possible value types from a dictionary-like object.
 * - Resolves to `TDictionary[keyof TDictionary]`, capturing all property values.
 * - If `TDictionary` has multiple value types, the result is a union of those types.
 *
 * Example:
 * ```ts
 * type ExampleDict = { id: number; name: string; active: boolean };
 * type ExampleValue = ValueOf<ExampleDict>; // number | string | boolean
 * ```
 */
export type ValueOf<TDictionary>           = TDictionary[keyof TDictionary]

/**
 * Defines a dictionary where keys are `string` and values are derived from another dictionary.
 * - The value type is a union of all possible value types within `TDictionary`.
 * - Provides structured key-value mappings based on extracted data.
 *
 * Example:
 * ```ts
 * type ExampleDict = { id: number; name: string; active: boolean };
 * type ExampleDictionary = DictionaryOf<ExampleDict>; // { [key: string]: number | string | boolean }
 * ```
 */
export type DictionaryOf<TDictionary>      = Dictionary<ValueOf<TDictionary>>

/**
 * Defines a `Map` where keys correspond to the properties of `TDictionary`,
 * and values represent the union of all possible value types within `TDictionary`.
 *
 * - Ensures key-value mappings based on extracted dictionary types.
 * - Preserves structured lookups while supporting dynamic key resolution.
 *
 * Example:
 * ```ts
 * type ExampleDict = { id: number; name: string; active: boolean };
 * type ExampleMap = MapOf<ExampleDict>; // Map<"id" | "name" | "active", number | string | boolean>
 * ```
 */
export type MapOf<TDictionary>             = Map<keyof TDictionary, ValueOf<TDictionary>>
