/** Extracts a list of values that are exclusive to either union, or `never` if they are identical. */
type ExclusiveValues<FromUnion, ToUnion> = Exclude<FromUnion, ToUnion> | Exclude<ToUnion, FromUnion>;
/** Resolves a string-based enum to a union of its possible values, or `never` for anything else */
type EnumValues<T> = T extends string ? `${T}` : never;
/** Resolves to `ToUnion` but only when both unions have identical values, or `never` if they are incompatible. */
export type CompatibleUnions<U1, U2> = ExclusiveValues<U1, U2> extends never ? U1 : never;
/** Resolves to `ToEnum` but only when both enums have identical values, or `never` if they are incompatible. */
export type CompatibleEnums<E1, E2> = CompatibleUnions<EnumValues<E1>, EnumValues<E2>> extends never ? never : E1;

/**
 * Returns the given value as-is, but typed as `To`. The type safety comes from the use of
 * `CompatibleEnums<From, To>`, which will resolve to `never` if the enums are not compatible by
 * value. In that case, you will get an error regardless of what you pass into the function.
 *
 * You should only use this function when it is intentional that `From` and `To` are identical; that
 * is, they fundamentally refer to a single source of truth, and if they ever differ it is an error.
 * For cases where two enums have commonality but are different, you should write a custom function
 * to transition from one type to another, handling differences in values in whatever way makes
 * sense.
 */
export function safelyConvertEnum<
  From extends string,
  To extends string,
>(fromValue: CompatibleEnums<From, To>) {
  return fromValue as any as To;
}

// Sandbox for testing the above
// export enum TargetEnum { a = 'a', b = 'b' }
// export enum CompatibleEnum { a = 'a', b = 'b' }
// export enum IncompatibleMissingEnum { a = 'a' }
// export enum IncompatibleExtraEnum { a = 'a', b = 'b', c = 'c' }
// export type TestCompatible = CompatibleUnions<`${CompatibleEnum}`, `${TargetEnum}`>;
// export type TestIncompatibleMissing = CompatibleUnions<`${TargetEnum}`, `${IncompatibleMissingEnum}`>;
// export type TestIncompatibleExtra = CompatibleUnions<`${TargetEnum}`, `${IncompatibleExtraEnum}`>;
// export type TestCompatibleEnum = CompatibleEnums<CompatibleEnum, TargetEnum>;
// export type TestIncompatibleMissingEnum = CompatibleEnums<TargetEnum, IncompatibleMissingEnum>;
// export type TestIncompatibleExtraEnum = CompatibleEnums<TargetEnum, IncompatibleExtraEnum>;
// export type From = TargetEnum;
// export type To = CompatibleEnum;
// export type FromValues = EnumValues<From>;
// export type ToValues = EnumValues<To>;
// export type FromToCompat = CompatibleUnions<FromValues, ToValues>;
// export type FromToCompat2 = CompatibleEnums<From, To>;

// function testSafelyConvertEnum( incompatibleSource: IncompatibleExtraEnum, compatibleSource: CompatibleEnum ) {
//   // Error: Argument of type 'IncompatibleExtraEnum' is not assignable to parameter of type 'never'.ts(2345)
//   const failure: TargetEnum = safelyConvertEnum( incompatibleSource );
//   const success: TargetEnum = safelyConvertEnum( compatibleSource );
// }