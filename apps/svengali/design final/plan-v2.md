# Svengali Implementation Plan v2

## References

- `class-diagrams.md` — Mermaid class diagrams for the full object model
- `columnableField.md` — V/C toggle object model and resolution logic
- `object-model-draft.md` — Field/Frame hierarchy and Frame Property → Field Type mapping
- `print-spec.md` — Print layout dimensions and page arrangements
- `text-sizing-for-template.md` — Text-fit algorithm options
- `ui-design.md` — Tab-by-tab UI specification
- `ui-diagrams.md` — ASCII wireframes for each tab
- `implementationInstructions.md` — Coding style, namespace pattern, dependencies

---

## 1. Coding Style / Stack

- **React**: stateless components as functions; stateful components as classes extending `React.Component`
- **Namespaces**: all JS files use the `namespace()` pattern (`sp.svengali.*`)
- **Styling**: Bootstrap 5.0.2 + `../../../style/custom.css`, `font.css`, `menu.css`, `rpg.css`
- **Modals**: use `dialog.js`

---

## 2. Object Model

### Frame Hierarchy

`Frame` (abstract) holds position/size properties shared by all layer types:

| Property | Type |
|---|---|
| `frame_x` | `number` |
| `frame_y` | `number` |
| `frame_width` | `number` |
| `frame_height` | `number` |

`Image` (extends Frame) — all variable properties are `ColumnableField<T>`:

| Property | ColumnableField\<T\> |
|---|---|
| `data` | `ColumnableField<blob (base64)>` |
| `cx` | `ColumnableField<number>` |
| `cy` | `ColumnableField<number>` |
| `magnification` | `ColumnableField<number>` |
| `rotation` | `ColumnableField<number>` (degrees) |
| `background_color` | `ColumnableField<color>` (optional) |
| `frame_color` | `ColumnableField<color>` (optional) |

`Text` (extends Frame) — all variable properties are `ColumnableField<T>`:

| Property | ColumnableField\<T\> |
|---|---|
| `text` | `ColumnableField<string>` |
| `font_family` | `ColumnableField<Font>` |
| `font_color` | `ColumnableField<color>` |
| `background_color` | `ColumnableField<color>` (optional) |
| `frame_color` | `ColumnableField<color>` (optional) |

> Note: `background_color` and `frame_color` remain on the **subclasses** (not the base `Frame`), with per-subtype UI panels so they can be individually toggled to column mode.

### ColumnableField\<T\>

A discriminated union — see `columnableField.md` for full definition:

```
{ type: "value", value: T }         // fixed value for every card
{ type: "column", column: string }  // resolved per-card from the data row
```

Resolution at render time:

```
resolve(field, row) → field.type === "value" ? field.value : row[field.column]
```

### Schema / Field Hierarchy

Each field carries both a human-friendly **label** and a machine-safe **COLUMN_ID** (see §3 Column Naming below).

| Subtype | Extra Properties |
|---|---|
| `ImageData` | (none) |
| `TextField` | `min_length`, `max_length` |
| `NumberField` | `min`, `max`, `step` |
| `Options` | `options: string[]` |
| `Font` | (none) |
| `Color` | `default: color` |

### Frame Property → Field Type Mapping

Used to restrict column-mode dropdowns to compatible schema fields:

| Frame | Property | Valid Field Types |
|---|---|---|
| Image | `data` | `ImageData` |
| Image | `cx`, `cy`, `magnification`, `rotation` | `NumberField` |
| Image | `background_color`, `frame_color` | `Color` |
| Text | `text` | `TextField`, `Options` |
| Text | `font_family` | `Font` |
| Text | `font_color`, `background_color`, `frame_color` | `Color` |

---

## 3. Column Naming

Each schema field stores two identifiers:

| Key | Description |
|---|---|
| `label` | Human-friendly name; user-entered; only alphanumeric characters and spaces allowed |
| `COLUMN_ID` | Machine-safe identifier; auto-generated from `label`; all uppercase, spaces replaced with underscores |

**Generation rule**: `COLUMN_ID = label.toUpperCase().replace(/ /g, '_')`

**UI behaviour**:
- The user types only the `label`.
- The derived `COLUMN_ID` is displayed immediately beside/below the label input as the user types, so naming conflicts are visible in real time.
- The CSV data table and the template both use `COLUMN_ID` as the column key.
- The data-entry UI (Data tab) and the column dropdown in V/C toggles both display the `label`.
- Uniqueness is enforced on `COLUMN_ID`; duplicate `COLUMN_ID` values are not allowed.

**JSON serialization**:

```json
{
  "type": "TextField",
  "label": "Hero Name",
  "COLUMN_ID": "HERO_NAME",
  "min_length": 1,
  "max_length": 40
}
```

---

## 4. Font Namespace

Create a dedicated namespace `sp.svengali.Fonts` that exports an ordered list of available font families. **Start with web-safe fonts only**; the pool can be extended later.

Initial list (web-safe):
- Arial
- Georgia
- Times New Roman
- Courier New
- Verdana
- Trebuchet MS
- Impact
- Comic Sans MS

Fonts loaded via `<link>` in `index.html` (e.g. Caudex, Modern Antiqua) can be added to this list as the project evolves.

---

## 5. Top-Level File Format (JSON)

The downloaded/uploaded JSON file has three sibling top-level keys:

```json
{
  "template": { ... },
  "schema":   { ... },
  "font_pool": [ ... ]
}
```

**Validation on upload**: If `font_pool` contains any font name not present in the `sp.svengali.Fonts` list, the file is deemed **invalid** and upload is rejected with an error message.

### `template` structure

```json
{
  "orientation": "Portrait",
  "layers": [
    {
      "type": "Image",
      "frame_x": 0, "frame_y": 0, "frame_width": 100, "frame_height": 100,
      "data":          { "type": "column", "column": "HERO_IMAGE" },
      "cx":            { "type": "value",  "value": 50 },
      "cy":            { "type": "value",  "value": 50 },
      "magnification": { "type": "value",  "value": 1.0 },
      "rotation":      { "type": "value",  "value": 0 },
      "background_color": null,
      "frame_color":   null
    },
    {
      "type": "Text",
      "frame_x": 10, "frame_y": 80, "frame_width": 80, "frame_height": 15,
      "text":        { "type": "column", "column": "HERO_NAME" },
      "font_family": { "type": "value",  "value": "Georgia" },
      "font_color":  { "type": "value",  "value": "#000000" },
      "background_color": null,
      "frame_color":  null
    }
  ]
}
```

### `schema` structure

```json
{
  "fields": [
    { "type": "ImageData", "label": "Hero Image", "COLUMN_ID": "HERO_IMAGE" },
    { "type": "TextField", "label": "Hero Name", "COLUMN_ID": "HERO_NAME", "min_length": 1, "max_length": 40 },
    { "type": "NumberField", "label": "Power", "COLUMN_ID": "POWER", "min": 0, "max": 10, "step": 1 },
    { "type": "Color", "label": "Accent", "COLUMN_ID": "ACCENT", "default": "#cc0000" }
  ]
}
```

### `font_pool` structure

A plain array of font-family name strings selected by the user in the Font Pool tab:

```json
["Georgia", "Caudex", "Modern Antiqua"]
```

### Data CSV Format

The CSV file contains **two tables** separated by two or more blank lines:

1. **Data table** — column headers are `COLUMN_ID` values; `ImageData` columns hold the **filename** of the image (not a data URL).
2. **Filename-to-data-URL table** — maps each image filename to its base64 data URL. This table is **optional on upload** (images can be loaded separately via the Image tab) but is **always included in the download**.

Example:

```
HERO_IMAGE,HERO_NAME,POWER
hero.png,Aragorn,8
mage.png,Gandalf,10


FILENAME,DATA_URL
hero.png,data:image/png;base64,...
mage.png,data:image/png;base64,...
```

---

## 6. Card Renderer (SVG Pipeline)

Cards are rendered as SVG. Layers are drawn in list order — index 0 is the first `<svg>` child (bottom-most), last index is the top-most.

**Card display background**: The card display area always has a white background.

**Selected layer outline**: The actively-selected layer in the card display is indicated by a `<rect>` drawn at the frame's position/size with `fill="none"` and `stroke="url(#selectedGradient)"`. The stroke uses the same rainbow diagonal `linearGradient` used in Spritely (red → yellow → green → cyan → blue → magenta, stop-opacity 0.2 at 20% offsets). Define the gradient in `<defs>` in `index.html`.

### Image Frame Rendering

Each `Image` layer renders as an `<image>` element inside a `<clipPath>` rect:

```svg
<clipPath id="clip-{layerId}">
  <rect x="{frame_x}" y="{frame_y}" width="{frame_width}" height="{frame_height}" />
</clipPath>
<image
  href="{base64 data}"
  clip-path="url(#clip-{layerId})"
  transform="translate({tx}, {ty}) scale({magnification}) rotate({rotation})"
/>
```

**cx/cy translation**: `cx` and `cy` are the center of the image relative to the card coordinate system. The `translate` values are computed as:

```
tx = cx - (imageNativeWidth  * magnification / 2)
ty = cy - (imageNativeHeight * magnification / 2)
```

**rotation**: SVG `rotate()` accepts degrees directly — no conversion needed.

**magnification**: applied as-is to `scale()`.

**frame_color** (border): rendered as a `<rect>` with `fill="none"` and `stroke="{frame_color}"` at the same position/size as the frame.

**background_color**: rendered as a `<rect>` with `fill="{background_color}"` behind the `<image>`.

### Text Frame Rendering

Text frames render as `<foreignObject>` or `<text>` elements. Plain text only (no markdown).

Font size is determined dynamically per card using **Binary Search** (Option 1 from `text-sizing-for-template.md`) via `CanvasRenderingContext2D.measureText()`. The word-wrap helper is shared between the measurement loop and the final render pass.

---

## 7. App State Shape

```javascript
{
  orientation: null,           // "Portrait" | "Landscape" — null until initial dialog
  template: {
    layers: []                 // Frame[]
  },
  schema: {
    fields: []                 // Field[]
  },
  fontPool: [],                // string[] — selected font names
  data: [],                    // object[] — array of row objects (keyed by COLUMN_ID)
  images: [],                  // { filename, dataUrl, width, height }[]
  selectedTab: "Template",     // "Template" | "Data" | "Schema" | "Image" | "FontPool"
  selectedLayerIndex: null,    // index into template.layers; null when layers is empty
  selectedRowIndex: 0,         // index into data
  selectedFieldIndex: null,    // index into schema.fields; null when fields is empty
}
```

`selectedLayerIndex` and `selectedFieldIndex` use `null` as the no-selection sentinel (when the respective list is empty).

State object serializes directly to the download JSON (sans UI-only fields like `selectedTab`, `selectedLayerIndex`, etc.). Image resolution at render time uses `images` as a `Map<filename, dataUrl>`.

---

## 8. Component Breakdown / File Structure

```
scripts/
  svengali.js           — Top-level Svengali component (state owner, tab switcher)
  constants.js          — sp.svengali.Constants — card dimensions and other cross-namespace constants
  fonts.js              — sp.svengali.Fonts — font name list
  cardRenderer.js       — sp.svengali.CardRenderer — SVG generation from a template + data row
  textSizer.js          — sp.svengali.TextSizer — binary-search font-size algorithm
  templateTab.js        — sp.svengali.TemplateTab — Template tab component
  dataTab.js            — sp.svengali.DataTab — Data tab component
  schemaTab.js          — sp.svengali.SchemaTab — Schema tab component
  imageTab.js           — sp.svengali.ImageTab — Image tab component
  fontPoolTab.js        — sp.svengali.FontPoolTab — Font Pool tab component
  columnableField.js    — sp.svengali.ColumnableField — resolve() helper + VC toggle UI widget
  printCards.js         — sp.svengali.PrintCards — print layout (CSS @page / window.print())
```

`constants.js` (`sp.svengali.Constants`) is **only** for constants used across **multiple** namespaces (e.g. card pixel dimensions used by both `cardRenderer.js` and `printCards.js`). Constants private to a single namespace are declared locally at the top of that namespace's factory function.

### Component Breakdown Guidelines

Follow the patterns established in Spritely and Outfitter:

- **One namespace per file.** Each file exports exactly one `namespace()` call.
- **Tab components are stateless.** They receive all data and callbacks via props from the top-level stateful component; they own no state of their own.
- **Top-level component owns all state.** The `Svengali` class is the single source of truth; tabs call prop callbacks to request state changes.
- **Modals registered once at top level.** `Dialog.factory()` is called once in the `Svengali` constructor; modal refs flow down to tabs as needed via props.
- **Small pure helpers stay inline.** A helper used in only one place and fewer than ~10 lines is inlined rather than extracted.
- **Extract to a new file when**: a logical unit is used from two or more files, or when a single file exceeds a comfortable reading size (~300–400 lines).

---

## 9. New Frame Defaults

When a new layer is added, it initializes to the center of the card with half-card dimensions:

| Property | Default |
|---|---|
| `frame_x` | `cardWidth / 4` |
| `frame_y` | `cardHeight / 4` |
| `frame_width` | `cardWidth / 2` |
| `frame_height` | `cardHeight / 2` |
| Image `data` | `{ type: "value", value: null }` — no image selected |
| Image `cx` / `cy` | center of frame |
| Image `magnification` | `1.0` |
| Image `rotation` | `0` |
| Image `background_color` | `null` |
| Image `frame_color` | `null` |
| Text `font_family` | `{ type: "value", value: <first font in fontPool> }` — see §12 for empty pool behavior |
| Text `font_color` | `"#000000"` |
| Text `background_color` | `null` |
| Text `frame_color` | `null` |
| Text `text` | `{ type: "value", value: "" }` |

Card dimensions (in pixel units used for SVG coordinate space) are defined in `constants.js`.

---

## 10. V/C Toggle UI

Each columnable field in the Template tab renders a toggle widget (implemented in `columnableField.js`):

- **Value mode**: shows the appropriate direct input (number input, color picker button, text area, font dropdown, or loaded-image dropdown for `data`)
- **Column mode**: shows a dropdown listing only the schema fields whose `COLUMN_ID` is compatible (per the Frame Property → Field Type Mapping); display text uses the field's `label`
- **Toggle-to-column button** is **not rendered** unless at least one compatible schema field exists. Once at least one compatible field exists, the button appears and allows switching to column mode.
- Toggle button switches between modes and updates the `ColumnableField` discriminant

**`data` field (Image layer) in value mode**: renders a dropdown listing all currently loaded images (by filename). The selected entry stores its `dataUrl` as `{ type: "value", value: dataUrl }`. If no images are loaded, the dropdown is empty with a placeholder ("No images loaded").

Color fields use `colorPicker.js` when in Value mode (see §11). Color columns on the Data tab also use `colorPicker.js`.

---

## 11. ColorPicker Integration

`sp.common.ColorPicker` is used as a `dialog.js`-managed modal. Follow this pattern (established in Spritely and Outfitter):

**Registration** (in top-level constructor, or passed from top-level to the tab that owns it):

```javascript
this.modals = Dialog.factory({
  colorPicker: {
    componentClass: ColorPicker,
    attrs: { class: 'rpg-box text-light w-75' },
    onClose: ({ color, index }) => {
      // index is any identifier passed at open() to route the result
      this.applyColor(index, color);
    },
  },
  // ... other modals
});
```

**Opening** (from a button's `onClick`):

```javascript
this.modals.colorPicker.open({
  color: currentColorValue || '#999999',
  index: fieldIdentifier,   // echoed back in onClose
});
```

**Color picker button pattern** (from Outfitter — use as a reusable helper or inline):

```jsx
<button
  className={`btn ${value ? 'btn-secondary' : 'btn-outline-light'}`}
  title={`${label}: ${value}; click to select color, right-click to clear`}
  style={value ? { backgroundColor: value, color: Colors.getForegroundColor(value) } : {}}
  onClick={() => this.modals.colorPicker.open({ color: value || '#999999', index: fieldId })}
  onDoubleClick={() => this.clearColor(fieldId)}
  onContextMenu={(e) => { e.preventDefault(); this.clearColor(fieldId); }}
>{label}</button>
```

The `Colors.getForegroundColor(value)` call chooses black or white text for legibility against the chosen background. Double-click or right-click clears the color (sets to `null`/`undefined`).

---

## 12. Font Pool Behavior

**Adding a Text layer with an empty font pool**: If `fontPool` is empty when the user adds a Text layer, open a modal that:
1. Explains the purpose of the Font Pool.
2. Displays all fonts in the `sp.svengali.Fonts` list.
3. Lets the user select one font, which is then **added to `fontPool`** and used as the new layer's `font_family` default.
4. Does not create the layer until a font is selected (cancelling the modal cancels the layer addition).

**Deselecting a font is only allowed if the font is unused** by any Text layer in value mode — i.e., no layer has `font_family` set to `{ type: "value", value: fontName }`. Layers where `font_family.type === "column"` do **not** count as using a pool font; the user is responsible for keeping data values within the active pool.

**If a font is in use** (value mode) and the user attempts to deselect it, open a modal that:
1. Lists the layer(s) that reference the font (by layer index and/or type label).
2. Presents a dropdown of the remaining *selected* font pool entries (excluding the font being removed) so the user can choose a replacement.
3. On confirmation: replaces all value-mode occurrences of that font in `template.layers` with the chosen replacement, then removes the font from `fontPool`.
4. On cancel: takes no action.

---

## 13. Print Layout

**Card count logic**:
- If `data` is empty (no rows), the print run renders **one card** using only the template's raw values, repeated to fill the page (8 copies for Portrait cards, 8 copies for Landscape cards).
- If `data` has rows, each row produces exactly one card; the page count is determined by how many cards fill each page.
- Print is disabled (grayed out) if any `ImageData` column value in any data row refers to a filename not present in `state.images`.

Implemented via CSS `@page` and `window.print()`, following the pattern in `tokenizer` / `minifier`.

- Card size: **2.25" × 3.5"** (Bridge size)
- Paper: letter (8.5" × 11"), printable area 8" × 10" centered
- **Landscape cards → Portrait paper**: 4 rows × 2 columns; 0.25" row gap, 0.5" column gap
- **Portrait cards → Landscape paper**: 2 rows × 4 columns; 0.5" row gap, 0.25" column gap

---

## 14. Initial Dialog

On first load (before any state exists), display a modal via `dialog.js` prompting the user to select **Portrait** or **Landscape** orientation.

**Dismissal handling**: If the modal closes without returning a valid orientation (e.g. user pressed Escape), it **re-opens immediately** with an added warning message: *"You must select an orientation before proceeding."* The warning is not shown on the first open. This loop continues until a valid value is returned.

Once orientation is confirmed, `state.orientation` is set and the template initializes with an empty layer list.

---

## 15. Menu Bar Actions

| Action | Behavior | Notes |
|---|---|---|
| Download Template | Serialize `{ template, schema, fontPool }` → JSON download | |
| Download Data | Serialize `data` → CSV download (two-table format, includes filename→dataURL table) | |
| Download All | Trigger Download Template and Download Data simultaneously as two separate file downloads | |
| Print | Open new tab with CSS print layout of all cards | Disabled if any referenced image filename is not loaded |
| Load Template | File picker → parse JSON → if data/images exist, show confirmation modal first; on confirm, populate `template`, `schema`, `fontPool` and clear `data`/`images` | Rejected if `font_pool` contains any name not in `sp.svengali.Fonts` |
| Load Data | File picker → parse CSV → populate `data` and optionally `images` from second table | Only available after a template is loaded; validated against `schema` and `fontPool` |

### Load Template — Confirmation Modal

When `data` is non-empty or `images` is non-empty, **Load Template** must first show a warning modal with:
- A message explaining that loading a new template will clear the current data and images.
- A **Confirm** button (proceeds with load and clears `data`/`images`).
- A **Cancel** button (aborts the load, no state change).
- A **Download Data** button (triggers the data CSV download without closing the modal).
- A **Download Template** button (triggers the current template JSON download without closing the modal).
- A **Download All** button (triggers both downloads without closing the modal).
