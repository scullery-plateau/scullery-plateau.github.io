# Svengali — "Add New" Feature Spec

Several controls across the app are populated from lists that may be empty: the font pool, the loaded-images list, and the set of schema columns. Rather than showing a disabled or blank dropdown in these cases, the app follows a consistent **"Add New" pattern**: the empty control presents a single affordance that opens the appropriate creation flow, and on successful completion the new item is simultaneously added to its underlying list and selected in the originating control.

This document specifies the pattern for each list type and its application across all call sites, including its use within the §13 Schema Field Deletion Guard.

---

## 1. Pattern Overview

**When a list is empty** (or when no compatible entries exist for a filtered list), replace the normal dropdown/selector content with a single labeled trigger:

| List type | Trigger label |
|---|---|
| `fontPool` | *+ Add font…* |
| `state.images` | *+ Load image…* |
| Compatible schema fields (V/C toggle) | *+ Add column…* |

The trigger may be rendered as a dropdown option (if the control is always a `<select>`) or as a small button adjacent to the control — whichever is consistent with the surrounding layout.

**On completion** of the creation flow:
- The new item is added to the underlying list.
- The originating control is immediately updated to reflect the populated list.
- The new item is **pre-selected** in the originating control (if exactly one item was created; if multiple were created — possible with image loading — the user must select from the now-populated list).
- If the "Add New" flow was triggered from **within an already-open modal** (e.g. the §13 guard), the parent modal remains open throughout; the creation flow runs as a nested interaction and returns control to the parent when complete.

**On cancel** of the creation flow: no changes are made; the originating control reverts to showing the trigger.

---

## 2. Font Pool Empty

**Applies to:**
- Template tab: `Text.font_family` value-mode dropdown when `fontPool` is empty
- Data tab form: `Font`-type field input when `fontPool` is empty
- §13 Deletion Guard: "Set to a fixed value" input for a `font_family` property when `fontPool` is empty after excluding the font being removed

**Trigger**: *+ Add font…*

**Creation flow** (same modal used by §12 "Adding a Text layer with an empty font pool"):
1. Modal opens displaying the full `sp.svengali.Fonts` list.
2. User selects one font and confirms.
3. The font is added to `fontPool`.
4. The originating dropdown becomes populated; the new font is pre-selected and the underlying `ColumnableField` or row value is updated to it.

> Note: This case overlaps with the §12 behavior for adding a new Text layer with an empty pool. The same modal component is reused; the difference is only in what happens on confirmation (§12 also creates the layer; here only the pool is updated and the control is populated).

---

## 3. Images List Empty

**Applies to:**
- Template tab: `Image.data` value-mode dropdown when `state.images` is empty (existing §10 behavior; this pattern formalizes it)
- Data tab form: `ImageData`-type field input when `state.images` is empty
- §13 Deletion Guard: "Set to a fixed value" input for an `Image.data` property when `state.images` is empty — **this is the resolution of decisions-needed-v4 §3**

**Trigger**: *+ Load image…*

**Creation flow** (same file-picker flow used by the Image tab's "Load Image" button):
1. A file picker opens (accepting common image formats: PNG, JPG, GIF, WEBP, etc.).
2. User selects one or more image files.
3. Each file is read as a data URL, validated (duplicate filename check), and appended to `state.images`.
4. The originating dropdown is repopulated with the loaded filenames.
   - If exactly one image was loaded: it is pre-selected automatically; the `ColumnableField` or row value is updated.
   - If multiple were loaded: the dropdown is populated and the user selects from it before confirming the parent action.
5. On cancel of the file picker: no images are loaded; the control reverts to showing *+ Load image…*.

**§13 Deletion Guard — specific behavior:**

When the guard modal offers "Set to a fixed value" for an `Image.data` property and `state.images` is empty, the image filename dropdown is replaced by a *+ Load image…* button (styled consistently with the other "Add New" triggers). Clicking it launches the file-picker flow described above. The guard modal **stays open** while the image is being selected. Once loading succeeds the button is replaced by the now-populated filename dropdown with the first loaded image pre-selected, and the user can continue to confirm the guard resolution. If the user cancels image loading, the *+ Load image…* button is shown again and the guard modal remains open.

---

## 4. Compatible Schema Columns Missing (V/C Toggle)

**Applies to:**
- Template tab V/C toggle for any layer property when `data` is non-empty but no compatible schema field of the required type exists

§10 states the toggle-to-column button is suppressed unless both a compatible field and at least one data row exist. This extension adds a second affordance when data rows exist but no compatible field does: instead of silently suppressing the button, show a *+ Add column…* button.

**Trigger**: *+ Add column…*

**Creation flow:**
1. A modal opens pre-configured for the required field type. The type is **locked and non-editable** — it is determined by the property being toggled (e.g., toggling `Image.data` locks the type to `ImageData`; toggling `Text.font_family` locks to `Font`; toggling a color property locks to `Color`).
2. User fills in:
   - **Label** (required; COLUMN_ID is derived and shown live per §3)
   - Any **type-specific metadata** (e.g., `min`/`max`/`step` for `NumberField`; `options` for `Options`)
3. User chooses how to **populate the new column across all existing data rows**. Two options are presented:

   | Option | Behaviour |
   |---|---|
   | *Use the current field value* | The layer property's current value-mode value is used as the default for every data row. This value is shown as a preview in the modal. |
   | *Specify a value* | An appropriate type-matched input is shown (number input, color picker, font dropdown, etc.); the entered value is written to all rows. |

4. On confirmation:
   - The new schema field is appended to `schema.fields`.
   - Every row in `data` gains a new key (`COLUMN_ID`) set to the chosen default value.
   - The originating layer property is switched to column mode, pointing at the new field's `COLUMN_ID`.
   - The V/C toggle reflects the new column-mode state, with the new field selected in the column dropdown.
5. On cancel: no changes are made; the V/C toggle remains in value mode and the *+ Add column…* button is shown again.

**Interaction with `ImageData` type**: The "Use the current field value" option is pre-populated with the current `Image.data` value-mode filename. If `state.images` is also empty at this point (unlikely — `Image.data` value mode requires a loaded image — but theoretically possible if an image was removed), the *+ Load image…* sub-trigger from §3 appears inline in the default-value input.

**Interaction with `Font` type**: The "Specify a value" dropdown for a `Font`-type column follows the same "Add New" behavior from §2 if `fontPool` is empty.
