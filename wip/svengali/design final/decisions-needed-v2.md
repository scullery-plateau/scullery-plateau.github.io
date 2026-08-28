# Svengali — Open Decisions v2

Items that require a product or design decision before or during implementation.

---

## 1. Image `data` value-mode — inline blob or filename reference?

§10 specifies that when the `data` field is in value mode, it stores the full base64 data URL inline: `{ type: "value", value: dataUrl }`. This means the template JSON can contain a large embedded blob.

**Decision needed**: Should value-mode image data be stored as an inline base64 data URL inside the template JSON, or should it be stored as a filename reference (resolved from `state.images` at render time, the same way column-mode images are resolved)?
: value mode should contain the file name reference, since the dropdown should only present the *loaded* images. If *no* images have been loaded, let's open a modal that prompts the user to load an image, and add that image to the image table. If the user exits the modal without selecting the image, remove the image layer that was just added.

---

## 2. Rendering a column-mode `data` field during zero-row print

§13 specifies that if `data` is empty, the print run renders one card using raw values. But if an Image layer's `data` field is in column mode (i.e., it has no raw value), there is nothing to resolve for that layer.

**Decision needed**: What should an Image layer whose `data` is in column mode render when there are no data rows? Options: an empty/transparent rect, the frame background color (if set), or should Print be additionally blocked when any Image layer's `data` is in column mode and `data` is empty?
: column mode should not be available for **any** field if there are no data rows.

---

## 3. `selectedRowIndex` sentinel when `data` is empty

§7 updated `selectedLayerIndex` and `selectedFieldIndex` to use `null` as the no-selection sentinel. `selectedRowIndex` was not updated — it still initializes to `0`, but `data` starts empty.

**Decision needed**: Should `selectedRowIndex` also use `null` as its empty sentinel, consistent with the other index fields?
: selectedRowIndex should initialize to -1

---

## 4. Schema field deletion with active column references

The plan specifies a guard for font pool removal (check for value-mode references, prompt for replacement). No equivalent guard is specified for deleting a schema field that is currently referenced by a column-mode `ColumnableField` in one or more template layers.

**Decision needed**: Should deleting a schema field be blocked (or prompt for resolution) when any template layer has a column-mode field pointing to that field's `COLUMN_ID`? Or should those layer fields silently revert to value mode on deletion?
: when deleting a schema field that is currently used, take the same approach as removal of a font from the pool, **except** prompt the user for an explicit value or alternative column instead of a replacement font. Communicate to the user that this choice would be applied to **all** uses of that column to be deleted, and that if they wish to make changes to individual usages, they should first `Cancel`, then make the individual changes prior to attempting to delete the column.
---

## 5. "Validated against fontPool" for Load Data — meaning unclear

§15 states that loaded CSV data is "validated against `schema` and `fontPool`". Validation against the schema is clear (column presence, type checking, min/max, etc.), but the meaning of fontPool validation is not specified. Schema `Font` fields would produce data rows containing font name strings.

**Decision needed**: Should data rows with `Font`-type column values be validated to only contain font names present in the current `fontPool`? If so, what happens when a row fails: reject the entire file, skip the row, or substitute the first pool font?
: reject the entire file and report the offending row. Any and every validation error for both schema/template import and data import should be effectively communicated to the user.
---

## 6. Changing orientation after initial setup

The initial dialog sets orientation once, and there is no mechanism in the menu bar or elsewhere to change it afterward. If the user wants to switch from Portrait to Landscape (or vice versa), they have no recourse short of refreshing the page and losing all work.

**Decision needed**: Should there be a way to change orientation after initial setup? If so, what happens to existing layers — are their frame coordinates preserved as-is, scaled/mapped to the new dimensions, or cleared?
: orientation should ***NEVER*** be allowed to change after initial setup. It is a fixed reality for the template, like `bodyType` in the `Outfitter` app.