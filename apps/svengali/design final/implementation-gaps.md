# Svengali Implementation Gaps

Items not yet covered by `draft.md` or its referenced documents.
: instructions are in sub-bullets

---

## Object Model

- **`Simple` frame type** — mentioned in `design-memo.md` Step 1 (background-color, outline-color, corner-radius) but absent from `object-model-draft.md` and `class-diagrams.md`
  -  Ignore this concept
- **Placement of `background-color` / `frame-color`** — currently on `Image` and `Text` individually; unclear whether they should be promoted to the base `Frame`
  - these can be a part of the "Frame" class, but they should be in the individual subclass UIs because I want them to be able to be toggled to columns
- **Font-family enum** — `index.html` loads Caudex and Modern Antiqua but no authoritative list is defined
  - create a separate namespace that contains a list of fonts and start with a list of websafe fonts. We can always add to it later

---

## V/C Toggle Semantics

- How toggle state is serialized in the template (e.g. does a field store `{ mode: "column", columnName: "hero_image" }` vs a raw value?)
  - see `columnableField.md`
- Type-compatibility mapping: which schema field types are valid sources for each frame property in Column mode
  - see `Frame Property → Field Type Mapping` section of `object-model-draft.md`

---

## Card Renderer / Canvas Pipeline

- How layers are composited (draw order, transparency/blending)
  - Layers are simply rendered as SVG in order
    - first in the list is first in the node
- Exact semantics of `cx` / `cy` / `magnification` / `rotation` for image cropping — is cx/cy the center of the source image? Is mag=1.0 fit-to-frame?
  - the image will have its own internal height and width (see `tokenizer` and `minifier` apps)
  - `cx` and `cy` are the center of the image relative to the card. Will need to mathematically translate those to the `x` and `y` offsets to be used by a `translate` function in a `transform` svg attribute
  - `magnification` and `rotation` will also be applied to the same `transform` attribute
  - `rotation` will need to be translated from degrees to radians
  - `magnification` is "as-is"
- How markdown in Text frames is rendered to canvas (`marked.js` is loaded but the HTML→canvas path is not defined)
  - no markdown in Text frames, plain text only (for now). `marked.js` has been removed

---

## File Formats

- **Template JSON schema** — field names, nesting structure, V/C toggle representation
  - template json structure should follow the object model
    - the object we'll be holding in state will be the object being downloaded
  - see `columnableField.md` for V/C structure
- **Data CSV conventions** — column naming rules, how ImageData columns store filenames
- **Schema JSON format** — whether schema is embedded in the template file or separate
  - `schema` and `template` should be siblings in the top-level object

---

## Print Layout

- Margin and bleed spec for the 2.5" × 3.5" card layout
  - see `print-spec.md`
- Implementation approach: CSS `@page` / `window.print()` vs canvas-to-PDF
  - CSS (see other apps that have printable sections: tokenizer, minifier, cobblestone)

---

## App Architecture

- Top-level React state shape for the `Svengali` component
  - look for patterns in other apps across Scullery-Plateau
- Component breakdown and planned file structure (currently only `svengali.js` exists)
  - look for patterns in other apps across Scullery-Plateau
- Default values for new frames (initial position, size, colors)
  - look for patterns in other apps across Scullery-Plateau
---

## TODO

- have AI suggest
  - how ImageData columns store filenames
  - app init state
- add instructions around using `colorPicker.js` for color fields, schema default
- column naming rules
  - as is? (ensure uniqueness in UI)
  - separate schema properties for "Label" vs "COLUMN_NAME"
- rules / guidelines for component breakdown
  - have copilot use these to create a separate claude.md / rules.md / skill.md
- New Frame defaults
  - x, y, width, height
    - initial thought: have frame init to center of card with height and width 1/2 that of the card
  - other values
    - FontFamily: 

## Additional thoughts

- have the `font-pool` as a sibling to `schema` and `template`
- 
