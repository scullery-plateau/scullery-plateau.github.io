# Svengali — Initialize Schema Wizard Feature Spec

The Initialize Schema Wizard is the designed solution to the workflow gap described in decisions-needed-v5 §5. When a user builds a template from scratch in the Template tab — designing all layers with raw value-mode fields — there is intentionally no per-field *+ Add column…* trigger visible because `data` is empty. The wizard is the intended entry point for transitioning from a raw template into a schema-and-data-backed one in a single guided flow.

---

## 1. Prerequisites: Layer Names

Each layer must carry a **human-readable name** (`name` property on the `Frame` object) before the wizard can run. This name serves two purposes:

1. It is the display identifier for the layer throughout the wizard UI.
2. It seeds the generated column label for each selected field.

### Layer name property

Add `name: string` to the base `Frame` object. It is stored and serialized alongside the frame's position/size properties:

```json
{
  "type": "Image",
  "name": "Hero Portrait",
  "frame_x": 0, "frame_y": 0, ...
}
```

### Default name on layer creation

When a new layer is added its name defaults to `"Layer {n}"` where `n` is the 1-based position at the time of creation (e.g. `"Layer 1"`, `"Layer 2"`). This value is editable; it is not auto-updated if the layer is reordered.

### Editing the name

The layer name input appears at the top of the selected layer's property panel in the Template tab, above the frame position/size inputs. It follows the same label-uniqueness rules as schema field labels: only alphanumeric characters and spaces are allowed. Names need not be unique across layers (uniqueness is enforced at the COLUMN_ID level after generation), but the user is warned during the wizard preview if two layers share the same name, because their generated column labels would also collide.

---

## 2. Eligibility: When the Wizard Is Available

The Initialize Schema Wizard is available when **all three** of the following conditions are true:

1. `state.schema.fields` is empty.
2. `state.data` is empty.
3. `state.template.layers` is non-empty (there is at least one layer to work with).

When all three are true, the wizard entry point is shown (see §3). When any condition is false, the entry point is hidden. The wizard is a one-time bootstrapping tool; once a schema exists the user transitions to the per-field *+ Add column…* flow (`featureForAddNew.md` §4) for incremental schema growth.

---

## 3. Entry Point

The wizard is accessible via a **"Initialize Schema…"** item in the menu bar, grouped with the other template-level actions. It is only rendered (not merely disabled) when the eligibility conditions in §2 are met, so it disappears automatically once a schema or data row exists.

---

## 4. Generated Column Label Format

For each selected field, a column label is generated using the following template:

```
{layer name} {layer type} {field display name}
```

| Segment | Source |
|---|---|
| `layer name` | The layer's `name` property |
| `layer type` | `"Image"` or `"Text"` |
| `field display name` | A fixed human-readable string for the property (see table below) |

**Field display names:**

| Property | Display name |
|---|---|
| `data` | `"Data"` |
| `cx` | `"X Center"` |
| `cy` | `"Y Center"` |
| `magnification` | `"Magnification"` |
| `rotation` | `"Rotation"` |
| `background_color` | `"Background Color"` |
| `frame_color` | `"Frame Color"` |
| `text` | `"Content"` |
| `font_family` | `"Font"` |
| `font_color` | `"Font Color"` |

**Example**: a layer named `"Hero"` of type `Image`, `data` field → label `"Hero Image Data"` → COLUMN_ID `"HERO_IMAGE_DATA"`.

**COLUMN_ID uniqueness**: COLUMN_ID values are derived from labels per §3 of the plan (`label.toUpperCase().replace(/ /g, '_')`). If two selected fields would produce the same COLUMN_ID (e.g. two layers both named `"Hero"` both contributing a `"Data"` field), the wizard detects the collision during the preview step and appends a numeric suffix to disambiguate: `"HERO_IMAGE_DATA_1"`, `"HERO_IMAGE_DATA_2"`. The user sees the resolved labels in the preview and can rename them before confirming.

---

## 5. Wizard Flow

The wizard is a two-screen modal opened via `dialog.js`.

### Screen 1 — Field Selection

The modal displays the full list of columnable fields across all template layers, grouped by layer. For each layer the heading shows the layer's `name` and type. Under each heading, the columnable fields appear as labeled checkboxes.

**What is included:**

All `ColumnableField` properties that are currently in value mode. Optional color fields (`background_color`, `frame_color`) are included only if their current `value` is non-null (i.e. the user has actually set a color). Optional color fields with `value: null` are excluded from the list because they have no meaningful value to seed a data row with.

**Checkbox layout per field:**

```
☑  [field display name]          current value shown as a preview chip
```

Example:
```
Layer: Hero Portrait (Image)
  ☑  Data              hero.png
  ☑  X Center          200
  ☑  Y Center          350
  ☐  Magnification     1.0
  ☐  Rotation          0

Layer: Title Bar (Text)
  ☑  Content           "Aragorn"
  ☑  Font              Georgia
  ☑  Font Color        ████ #000000
```

All checkboxes default to **unchecked**. The user explicitly selects the fields they want to promote to columns.

**Validation before proceeding:**

- At least one field must be checked.
- The **"Next"** button is disabled until this condition is met.
- A **"Cancel"** button closes the wizard without any state changes.

---

### Screen 2 — Schema Preview

After clicking **"Next"**, the modal transitions to a preview of the schema that will be created.

The preview renders each selected field as a schema field card in the same visual style used by the Schema tab. Each card shows:
- The generated **label** (editable inline — user can change it before confirming)
- The derived **COLUMN_ID** (updates live as the label changes, same as the Schema tab)
- The inferred **field type** (read-only; determined by the property's type mapping)
- Any **COLUMN_ID collision warnings** (shown inline under the affected cards if two labels resolve to the same COLUMN_ID; the Next/Confirm button remains disabled until all collisions are resolved)

The field type mapping follows the Frame Property → Field Type mapping from §2 of the plan:

| Property | Generated field type |
|---|---|
| `Image.data` | `ImageData` |
| `Image.cx`, `cy`, `magnification`, `rotation` | `NumberField` |
| `Image.background_color`, `frame_color` | `Color` |
| `Text.text` | `TextField` |
| `Text.font_family` | `Font` |
| `Text.font_color`, `background_color`, `frame_color` | `Color` |

**Note on type-specific metadata** (`min`/`max`/`step` for `NumberField`, `options` for `Options`, `default` for `Color`, etc.): the wizard does **not** attempt to set these at generation time. All generated numeric fields have no `min`/`max`/`step` set; generated `Color` fields have no `default` set. The user is expected to visit the Schema tab after the wizard to apply metadata.

**Buttons on Screen 2:**

| Button | Action |
|---|---|
| **Back** | Returns to Screen 1 with all previous selections preserved |
| **Confirm** | Executes the commit sequence (see §6) |
| **Cancel** | Closes the wizard; no state changes |

---

## 6. Commit Sequence (on Confirm)

When the user clicks **Confirm** on Screen 2, the following operations are applied atomically (a single state update):

1. **Create the schema**: all generated schema fields (with their final labels and COLUMN_IDs, as edited on Screen 2) are written to `state.schema.fields`.

2. **Create the first data row**: a new row object is constructed by iterating over every generated schema field and setting its `COLUMN_ID` key to the current value-mode value of the corresponding layer property. This produces the first entry in `state.data`.

   - For `ImageData` fields: the value is the filename currently stored in `Image.data.value`.
   - For `NumberField`, `Color`, `Font`, `TextField` fields: the value is the current `.value` of the respective `ColumnableField`.
   - Optional color fields are only present in this row if they were selected in Screen 1 (i.e. they had a non-null value at time of entry).

3. **Switch selected fields to column mode**: for each layer property that was selected in Screen 1, its `ColumnableField` is updated from `{ type: "value", value: ... }` to `{ type: "column", column: COLUMN_ID }`, pointing at the newly created schema field.

4. **Set `selectedRowIndex` to `0`**: the new row is selected in the Data tab.

Fields that were **not** selected in Screen 1 remain in value mode unchanged.

---

## 7. Resolution of decisions-needed-v5 §5

The current §10 behavior — no V/C toggle and no *+ Add column…* trigger when `data` is empty — is the **intended workflow**. Users who want to begin with column mode should use the Initialize Schema Wizard, not the per-field *+ Add column…* affordance. This distinction is intentional:

- The *+ Add column…* trigger (`featureForAddNew.md` §4) is designed for **incremental** column addition when data already exists — it is optimized for adding one column at a time and immediately seeding all existing rows.
- The Initialize Schema Wizard is designed for **bulk bootstrapping** from a raw template — it optimizes for defining all columns at once, naming them coherently from layer identities, and creating a first seed row in a single commit.

Showing the *+ Add column…* trigger when data is empty would create a partial path that leaves `data` still empty after column creation, leading back to the same invariant problem the §10 guard is designed to prevent. The wizard avoids this by always creating both the schema and the first data row together.

The §10 rule therefore remains:
- Toggle-to-column button: suppressed when `data` is empty.
- *+ Add column…* trigger: shown only when `data` is non-empty and no compatible schema field exists.
- Initialize Schema Wizard: the entry point for the zero-schema, zero-data starting state.
