# Svengali — Open Decisions v3

Items that require a product or design decision before or during implementation.
> responses added as blockquote

---

## 1. Column-mode fields when all data rows are deleted

§10 says the toggle-to-column button is not rendered when `data` is empty. But the plan says nothing about what happens to layer properties that are **already in column mode** when all data rows are subsequently deleted (e.g. the user loads data, sets some layers to column mode, then deletes all rows or loads a new empty CSV).

**Decision needed**: When `data` becomes empty, should any existing column-mode `ColumnableField`s automatically revert to value mode? If so, what value do they revert to — the field's default, or `null`/empty? Or do they stay in column mode (with the toggle button hidden and no column selected), remaining dormant until data is loaded again?
> if any fields are in `column` mode, there must be at least one record in the table. Prevent the last record from being deleted.

---

## 2. `data` field: toggling from column mode to value mode with no images loaded

§10 specifies that if no images are loaded when an Image layer is **first added**, a modal opens to load one (and the layer is removed on cancel). But this behavior is only described for the "first added" case. It is not specified what happens when the user **manually toggles** an existing Image layer's `data` field from column mode back to value mode and there are no loaded images at that point.

**Decision needed**: When the user clicks the toggle to switch an existing `data` field from column to value mode, and `state.images` is empty, should the same load-image modal open (with the toggle reverting on cancel)? Or should the field silently switch to value mode with `value: null` (showing an empty/disabled dropdown)?
> lets reuse the same load-image modal for this scenario
---

## 3. Data tab form: input control for `Font`-type schema fields

The Data tab presents a form for entering row values for each schema field. The plan specifies controls for most field types (text input, number input, color picker, etc.) but **never specifies what form control appears for `Font`-type fields**. A `Font`-type column stores a font name string per row.

**Decision needed**: What control appears in the Data tab form for a `Font`-type field? Options:
- A dropdown restricted to the current `fontPool` entries (most consistent with the app's design intent, and easiest to validate)
- A dropdown of the full `sp.svengali.Fonts` list (wider selection, but bypasses the pool concept)
- A free-text input (most flexible, but requires extra validation)
> a dropdown restricted to the current `fontPool` entries
---

## 4. Print gate: value-mode `Image.data` with unresolved filename

§14 states that print is disabled "if any `ImageData` column value in any data row refers to a filename not present in `state.images`." This covers column-mode fields (where the filename comes from a data row). But an Image layer in **value mode** could also store a filename (`{ type: "value", value: "hero.png" }`) that is not present in `state.images` — for example after the user manually removed it from the Image tab.

**Decision needed**: Should a value-mode `Image.data` field with an unresolved filename also block print? Should it be treated the same as a missing column-mode image reference, or handled differently (e.g. allowed but renders a blank frame)?
> Let's make it so this cannot happen. Let's remove the column with the "Del" buttons from the image tab, and instead present a button at the top along side the "Load Image" button and call it "Remove Unused"
---

## 5. `state.orientation` placement in the download JSON

§5 shows `orientation` **inside** the `template` key in the JSON:

```json
{
  "template": { "orientation": "Portrait", "layers": [...] },
  "schema":   { ... },
  "font_pool": [...]
}
```

But §7 shows `orientation` as a **top-level state property** sitting alongside `template`:

```javascript
{
  orientation: null,
  template: { layers: [] },
  schema: { ... },
  ...
}
```

These two representations are inconsistent. A serializer following §7 would produce `{ template, schema, font_pool, orientation }` at the top level, not `{ template: { orientation, layers }, schema, font_pool }`.

**Decision needed**: Should `orientation` be placed **inside** `template` in the JSON (as shown in §5), or **alongside** it as a top-level sibling key (consistent with §7's state shape)?
> inside
---

## 6. Font pool deselection when the target font is the only pool entry in use

§12 specifies that deselecting an in-use font shows a replacement modal with "a dropdown of the remaining *selected* font pool entries (excluding the font being removed)." But if the font being removed is the **only** entry in `fontPool` and it is referenced by one or more value-mode layers, that replacement dropdown would be empty — the user could not complete the modal's required action.

**Decision needed**: What happens when the user tries to deselect the last font in the pool while it is still in use? Options:
1. Block the deselection entirely (show a message explaining they must either add another pool font first, or clear all value-mode references to this font).
2. Expand the replacement dropdown to include the full `sp.svengali.Fonts` list (not just current pool members), treating font selection here as an implicit pool addition.
3. Allow replacing with a fixed value drawn from any font in the full Fonts list without adding it to the pool.
> option 2