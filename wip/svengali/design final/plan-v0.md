# Svengali Implementation Plan

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

## 3. Font Namespace

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

## 4. Top-Level File Format (JSON)

The downloaded/uploaded JSON file has three sibling top-level keys:

```json
{
  "template": { ... },
  "schema":   { ... },
  "font_pool": [ ... ]
}
```

### `template` structure

Mirrors the object model directly. The in-memory state object **is** the structure that gets serialized:

```json
{
  "orientation": "Portrait",
  "layers": [
    {
      "type": "Image",
      "frame_x": 0, "frame_y": 0, "frame_width": 100, "frame_height": 100,
      "data":          { "type": "column", "column": "hero_image" },
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
      "text":        { "type": "column", "column": "name" },
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
    { "type": "ImageData", "name": "hero_image" },
    { "type": "TextField", "name": "name", "min_length": 1, "max_length": 40 },
    { "type": "NumberField", "name": "power", "min": 0, "max": 10, "step": 1 },
    { "type": "Color", "name": "accent", "default": "#cc0000" }
  ]
}
```

### `font_pool` structure

A plain array of font-family name strings selected by the user in the Font Pool tab:

```json
["Georgia", "Caudex", "Modern Antiqua"]
```

### Data CSV

- First row: column headers matching `Field.name` values from the schema
- Subsequent rows: one card per row
- `ImageData` columns store the **filename** of the image (e.g. `hero.png`); the image blob is loaded separately via the Image tab and matched by filename
- Column names are used as-is for matching; uniqueness is enforced in the Schema UI

---

## 5. Card Renderer (SVG Pipeline)

Cards are rendered as SVG. Layers are drawn in list order — index 0 is the first `<svg>` child (bottom-most), last index is the top-most.

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

## 6. App State Shape

Following the patterns from apps like `tokenizer` and `spritely`, the top-level `Svengali` component state holds:

```javascript
{
  orientation: null,         // "Portrait" | "Landscape" — null until initial dialog
  template: {
    layers: []               // Frame[]
  },
  schema: {
    fields: []               // Field[]
  },
  fontPool: [],              // string[] — selected font names
  data: [],                  // object[] — array of row objects (keyed by column name)
  images: [],                // { filename, dataUrl, width, height }[]
  selectedTab: "Template",   // "Template" | "Data" | "Schema" | "Image" | "FontPool"
  selectedLayerIndex: 0,     // index into template.layers
  selectedRowIndex: 0,       // index into data
  selectedFieldIndex: 0,     // index into schema.fields (Schema tab)
}
```

State object serializes directly to the download JSON (sans UI-only fields like `selectedTab`, `selectedLayerIndex`, etc.).

---

## 7. Component Breakdown / File Structure

```
scripts/
  svengali.js           — Top-level Svengali component (state owner, tab switcher)
  constants.js          — sp.svengali.Constants — card dimensions, default values
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

---

## 8. New Frame Defaults

When a new layer is added, it initializes to the center of the card with half-card dimensions:

| Property | Default |
|---|---|
| `frame_x` | `cardWidth / 4` |
| `frame_y` | `cardHeight / 4` |
| `frame_width` | `cardWidth / 2` |
| `frame_height` | `cardHeight / 2` |
| Image `cx` / `cy` | center of frame |
| Image `magnification` | `1.0` |
| Image `rotation` | `0` |
| Image `background_color` | `null` |
| Image `frame_color` | `null` |
| Text `font_family` | first font in `font_pool` (or first in `Fonts` list) |
| Text `font_color` | `"#000000"` |
| Text `background_color` | `null` |
| Text `frame_color` | `null` |
| Text `text` | `{ type: "value", value: "" }` |

Card dimensions (in pixel units used for SVG coordinate space) are defined in `constants.js`.

---

## 9. V/C Toggle UI

Each columnable field in the Template tab renders a toggle widget (implemented in `columnableField.js`):

- **Value mode**: shows the appropriate direct input (number input, color picker, text area, font dropdown)
- **Column mode**: shows a dropdown listing only the schema fields whose type is compatible (per the Frame Property → Field Type Mapping)
- Toggle button switches between modes and updates the `ColumnableField` discriminant

Color fields use `colorPicker.js` when in Value mode.
Color columns on the "Data" tab will also use `colorPicker.js`

---

## 10. Print Layout

Implemented via CSS `@page` and `window.print()`, following the pattern in `tokenizer` / `minifier`.

- Card size: **2.25" × 3.5"** (Bridge size)
- Paper: letter (8.5" × 11"), printable area 8" × 10" centered
- **Landscape cards → Portrait paper**: 4 rows × 2 columns; 0.25" row gap, 0.5" column gap
- **Portrait cards → Landscape paper**: 2 rows × 4 columns; 0.5" row gap, 0.25" column gap

---

## 11. Initial Dialog

On first load (before any state exists), display a modal via `dialog.js` prompting the user to select **Portrait** or **Landscape** orientation. This sets `state.orientation` and initializes the template with an empty layer list.

---

## 12. Menu Bar Actions

| Action | Behavior | Notes |
|---|---|---|
| Download All | Serialize `{ template, schema, fontPool }` as JSON and `data` as csv, and download wrapped as ZIP | |
| Download Template | Serialize `{ template, schema, fontPool }` → JSON download | |
| Download Data | Serialize `data` → CSV download | |
| Print | Open new tab with CSS print layout of all cards | |
| Load Template | File picker → parse JSON → populate `template`, `schema`, `fontPool` | data will be validated |
| Load Data | File picker → parse CSV → populate `data` | `Load Data` only available when Template has been loaded. Data will be validated against `schema` and `fontPool` |

---

## Implementation Gaps

The following items are **not yet fully resolved** and require decisions before or during implementation:

### App Init / Column Naming

- **Column naming rules**: Should `Field.name` be stored as-is (spaces allowed) and used directly as CSV headers, or should there be a separate `label` (display) vs `columnName` (machine-safe identifier)? Uniqueness enforcement needs a decision.
- **App init state**: Exact initialization flow when a template JSON is loaded that contains `fontPool` entries not currently in the `Fonts` namespace list.

### Image Handling

- **How ImageData columns store filenames**: The current design says CSV `ImageData` columns hold a filename string. The decision needed is: how does the renderer resolve that filename to a loaded base64 blob at render time? Proposed: maintain a `Map<filename, dataUrl>` in state (the `images` array), and require the user to load all referenced images in the Image tab before rendering/printing.

### Color Fields

- **`colorPicker.js` usage**: No instructions yet on how to wire `colorPicker.js` into a React component for the color picker inputs in the Template tab and Schema tab. Needs a usage example or wrapper component.
- **Schema `Color` field default**: The `Color` field has a `default` property; it needs to be used when generating the Data tab form (pre-fill the color input) and when a new Color schema field is created.

### Component Breakdown Guidelines

- **Rules / guidelines for component breakdown**: No formal guidelines written yet. The file structure above is a proposal — it should be reviewed and formalized (e.g. when to split a component into its own file, naming conventions, what belongs in `constants.js` vs inline).

### Font Pool

- **Font pool behavior**: When the user deselects a font from the pool that is currently referenced by a Text layer's `font_family` value field, the behavior is undefined (warn? auto-reassign? silently allow?).
