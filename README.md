# Safely Convert Enums Between Compatible Types
Tiny utility function that can be used to safely convert between string-based enums with identical
values.

## Usage

```ts
const sourceEnum = SourceEnum.SomeValue;
const convertedEnum: TargetEnum = safelyConvertEnum(sourceEnum);
```

## How "safe" is it?

This will produce an error in the event that `SourceEnum` and `TargetEnum` are incompatible by
value, or are not `string`-based enums.

The error it produces is unfortunately a little cryptic. Given an incompatible set of enums, the
error will present on the `sourceEnum` variable where it is passed into the function, and the error
will be similar to:

```
Argument of type '...' is not assignable to parameter of type 'never'.ts(2345)
```

## When should I use this?

You should use this only when you are dealing with two enums that are *meaningfully* equivalent.
This means both that they have the same values today, and that they (by design) should always
represent the same set of values. You should *not* use this to convert between enums that are
*coincidentally* equivalent.