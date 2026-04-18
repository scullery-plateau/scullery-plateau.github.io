# Svengali — Open Decisions v4

Items that require a product or design decision before or during implementation.

---

## 1. Load Data resulting in zero rows when column-mode fields exist

§10 guards against the last data row being deleted while any field is in column mode. But this guard is described only for the **row-delete action**. The **Load Data** operation (§17) replaces `data` wholesale. If the loaded CSV contains no data rows (empty file, header-only, or all rows filtered out by validation), `data` would be set to `[]` while column-mode fields still exist — the same invariant violation that §10 is meant to prevent, but through a different code path.

**Decision needed**: When a Load Data operation would result in `data` being set to an empty array while one or more fields are currently in column mode, should:
1. The load be **blocked** with an error modal explaining that column-mode fields must be reverted to value mode before loading an empty data set?
2. The load proceed, with all column-mode fields **automatically reverted to value mode** (using each field's appropriate default or `null`)?
3. The load proceed **without** reverting column-mode fields, treating them as dormant (column-mode with no data to resolve) until new data is loaded?
> apply option 1 - the load should be blocked. Furthermore, individual rows should **not** be being filtered out by validation; instead, the upload should be rejected and the error modal should list out the errors and/or provide a downloadable error report for each offending row in the upload

---

## 2. `Remove Unused` and images referenced by data-row values

§18 defines the "Remove Unused" button as removing every entry from `state.images` whose filename "is not referenced by any value-mode `Image.data` field across all layers." But column-mode `Image.data` fields resolve their filenames at render time from data rows — a row might contain `HERO_IMAGE = "hero.png"`. Under the current definition, `hero.png` would be removed by "Remove Unused" if no value-mode layer references it directly, even though it is required to render one or more cards. This would leave valid data rows with unresolvable image references and trigger the print-disabled gate in §14.

**Decision needed**: Should "Remove Unused" also preserve images whose filenames appear as values in any `ImageData`-type column across the data rows? Options:
1. **Yes** — "Remove Unused" scans data-row values for every `ImageData`-type column in addition to value-mode layer fields. An image is only removed if it is referenced by neither.
2. **No** — "Remove Unused" only checks value-mode layer fields. Data-row image references are the user's responsibility; the §14 print gate catches any mismatch before printing.
> apply Option 1 - "Yes" - the word "Unused" in this context should mean **not** appearing anywhere in either the template **or** the data table.
---

## 3. §13 schema deletion guard: resolving an `ImageData` column to value mode when no images are loaded

§13 allows an in-use schema field to be deleted by resolving each affected column-mode property to either another column or a fixed value. For an `Image.data` property the "fixed value" input is an image filename dropdown (the same control used in value mode per §10 and §19). If `state.images` is empty at the time the guard modal is open, this dropdown has no entries and the user cannot complete the required resolution.

**Decision needed**: When the §13 deletion guard offers "Set to a fixed value" for an `Image.data` property and `state.images` is empty, should:
1. The option be **augmented** with an inline "Load image…" trigger that opens the load-image modal before the dropdown is populated, allowing the user to load an image without leaving the guard dialog?
2. The "Set to a fixed value" option be **suppressed** for empty-images cases, leaving "Replace with another column" as the only available resolution for that property?
3. The entire schema field deletion be **blocked** with a message instructing the user to load at least one image (or revert the affected layer to value mode in the Template tab) before deleting the field?
> see `featureForAddNew.md`

---

## 4. §9 `font_color` default value is a plain string, not a `ColumnableField`

§2 declares `Text.font_color` as `ColumnableField<color>`. Every other `ColumnableField` default in §9's table is given in the discriminated-union form (e.g. `{ type: "value", value: null }`, `{ type: "value", value: "" }`). The `font_color` row is the sole exception:

```
Text `font_color` | `"#000000"`
```

It should read:

```
Text `font_color` | `{ type: "value", value: "#000000" }`
```

**Decision needed**: Confirm `font_color`'s §9 default should use the `ColumnableField` form and update accordingly. (No behavioral change — this is a documentation fix to prevent an implementer from initializing `font_color` as a bare string instead of a `ColumnableField` object.)
> use the suggestion from `It should read:` above
---

## 5. §17 serialization description uses `fontPool` (camelCase); §5 JSON shows `font_pool` (snake_case)

§5 specifies the downloaded JSON key as `"font_pool"` (snake_case), consistent with the other snake_case keys in that file (`font_pool`, `COLUMN_ID`, etc.). §17's Download Template row describes the output as:

> Serialize `{ template, schema, fontPool }` → JSON download

`fontPool` is the JS runtime property name (camelCase). An implementer following §17 literally would serialize the key as `"fontPool"`, producing a file that fails §5's format and would be rejected by §16 upload validation on round-trip.

**Decision needed**: Confirm the serialized JSON key is `"font_pool"` (as shown in §5), and update the §17 description to either use `font_pool` or add a note clarifying that `fontPool` serializes as `font_pool`.
> use camelCasing