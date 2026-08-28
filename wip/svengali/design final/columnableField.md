# Columnable Field

Any value in the template that is specific to either of the Frame subtypes (Image, Text) can either be a raw value that would be used by all cards, or can reference a column in the data table, making each card different.

Therefore, each of those values in a given layer must be able to be held as either a column reference or a raw value.

## Object Model

A `ColumnableField` is a discriminated union with two variants:

### RawColumnableField

Holds a fixed value used for every card.

```
RawColumnableField
  type: "value"
  value: T
```

### RefColumnableField

Holds a reference to a named column in the data table. The actual value is resolved per-card at render time by looking up the column name in the row.

```
RefColumnableField
  type: "column"
  column: string
```

### Usage in Frame subtypes

Every property on `Image` and `Text` that varies per card is typed as `ColumnableField<T>` where `T` matches the underlying property type:

| Frame | Property | T |
|---|---|---|
| Image | data | blob (base64) |
| Image | cx | number |
| Image | cy | number |
| Image | magnification | number |
| Image | rotation | number |
| Image | background-color | color |
| Image | frame-color | color |
| Text | text | string |
| Text | font-family | Font |
| Text | font-color | color |
| Text | background-color | color |
| Text | frame-color | color |

### Resolution

At render time, a helper resolves a `ColumnableField<T>` against a data row:

```
resolve(field: ColumnableField<T>, row: Record<string, any>): T
  switch field.type
    case "value"  → return field.value
    case "column" → return row[field.column]
```