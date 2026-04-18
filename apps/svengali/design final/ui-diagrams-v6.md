# Svengali UI Design — ASCII Diagrams (v6)

## Initial Dialog

Shown on first load; re-shown with warning if dismissed without selecting. Orientation is fixed for the lifetime of the session.

```
╔════════════════════════════════════════════╗
║     Choose Layout Orientation              ║
╠════════════════════════════════════════════╣
║                                            ║
║  ┌──────────────────┐  ┌──────────────────┐║
║  │    Portrait      │  │    Landscape     │║
║  │                  │  │                  │║
║  │    (Select)      │  │    (Select)      │║
║  └──────────────────┘  └──────────────────┘║
║                                            ║
║  [warning message — shown after first      ║
║   dismissed attempt only]                  ║
║                                            ║
╚════════════════════════════════════════════╝
```

---

## Menu Bar Structure

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [✦] Init Schema │ [⬇] All │ [📄] Template │ [📊] Data │ [🖨] Print │ [📂] Load Template │ [📂] Load Data │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

Availability rules:

| Action | Enabled when |
|---|---|
| Initialize Schema… | `schema.fields` empty AND `data` empty AND `template.layers` non-empty |
| Download Data | `data` non-empty |
| Print | Always enabled, but grayed-out if any column-mode `ImageData` reference is unresolved |
| Load Data | `template.orientation` non-null AND `schema.fields` non-empty |

---

## Main Application Layout

```
╔════════════════════════════════════════════════════════════════════════════╗
║ [✦] Init Schema │ [⬇] All │ [📄] Template │ [📊] Data │ [🖨] Print     ║
║                 │ [📂] Load Template │ [📂] Load Data                    ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌──────────────────────────────┬──────────────────────────────────────┐   ║
║  │ [Template][Data][Schema]     │                                      │   ║
║  │ [Image][Font Pool]           │        CARD DISPLAY                  │   ║
║  ├──────────────────────────────┤        (Current Row)                 │   ║
║  │                              │                                      │   ║
║  │   TAB CONTENT                │                                      │   ║
║  │   (see below)                │                                      │   ║
║  │                              │                                      │   ║
║  └──────────────────────────────┴──────────────────────────────────────┘   ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
```

---

## Template Tab

```
╔════════════════════════════════════════════════════════════════════════════╗
║ [Template] [Data] [Schema] [Image] [Font Pool]                             ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌──────────────────────────────┬──────────────────────────────────────┐   ║
║  │ LEFT COLUMN                  │ RIGHT COLUMN                         │   ║
║  ├──────────────────────────────┤                                      │   ║
║  │                              │  ┌────────────────────────────────┐  │   ║
║  │ Row:   [Dropdown          ▼] │  │                                │  │   ║
║  │                              │  │      CARD DISPLAY              │  │   ║
║  │ Layer: [Dropdown          ▼] │  │    (Currently Selected Row)    │  │   ║
║  │ [+Add] [-Del] [↑] [↓]        │  │                                │  │   ║
║  │                              │  └────────────────────────────────┘  │   ║
║  │ ┌─ Layer ───────────────────┐│                                      │   ║
║  │ │ Name: [________________]  ││                                      │   ║
║  │ └────────────────────────── ┘│                                      │   ║
║  │                              │                                      │   ║
║  │ ┌─ Frame Fields ────────────┐│                                      │   ║
║  │ │ frame-x:      [________]  ││                                      │   ║
║  │ │ frame-y:      [________]  ││                                      │   ║
║  │ │ frame-width:  [________]  ││                                      │   ║
║  │ │ frame-height: [________]  ││                                      │   ║
║  │ └───────────────────────────┘│                                      │   ║
║  │                              │                                      │   ║
║  │ (Image layer shown below;    │                                      │   ║
║  │  Text layer on next diagram) │                                      │   ║
║  │                              │                                      │   ║
║  │ ┌─ Image Panel ─────────────┐│                                      │   ║
║  │ │ data:   [img.png      ▼]  ││                                      │   ║
║  │ │         [↔ Column]        ││                                      │   ║
║  │ │                           ││                                      │   ║
║  │ │ cx:     [_______] [↔ Col] ││                                      │   ║
║  │ │ cy:     [_______] [↔ Col] ││                                      │   ║
║  │ │ mag.:   [_______] [↔ Col] ││                                      │   ║
║  │ │ rot.:   [_______] [↔ Col] ││                                      │   ║
║  │ │                           ││                                      │   ║
║  │ │ bg:  [■ #cc0000 ] [↔ Col] ││                                      │   ║
║  │ │ border:[■ #000000] [↔ Col]││                                      │   ║
║  │ └───────────────────────────┘│                                      │   ║
║  └──────────────────────────────┴──────────────────────────────────────┘   ║
╚════════════════════════════════════════════════════════════════════════════╝
```

### Template Tab — Text Layer Panel

```
║  │ ┌─ Text Panel ──────────────┐│                                      │   ║
║  │ │ text: ┌───────────────┐   ││                                      │   ║
║  │ │       │ (text area)   │   ││                                      │   ║
║  │ │       └───────────────┘   ││                                      │   ║
║  │ │       [↔ Column]          ││                                      │   ║
║  │ │                           ││                                      │   ║
║  │ │ font: [Georgia        ▼]  ││                                      │   ║
║  │ │       [↔ Column]          ││                                      │   ║
║  │ │                           ││                                      │   ║
║  │ │ color:[■ #000000 ] [↔ Col]││                                      │   ║
║  │ │                           ││                                      │   ║
║  │ │ bg:  [■ #ffffff ] [↔ Col] ││                                      │   ║
║  │ │ border:[        ] [↔ Col] ││  (empty button = color disabled)     │   ║
║  │ └───────────────────────────┘│                                      │   ║
```

### V/C Toggle — Three States

Each columnable field may show one of three affordances depending on state:

```
State A — toggle button visible (data non-empty AND compatible column exists):
  [value-input]  [↔ Column]

State B — value mode with empty required list, data non-empty but no compatible column:
  [+ Add column…]          ← "Add New" trigger; see featureForAddNew.md §4

State B′ — Image data field, no images loaded:
  [+ Load image…]          ← "Add New" trigger; see featureForAddNew.md §3

State C — toggle suppressed (data empty AND no compatible column):
  [value-input]            ← no toggle affordance shown; use Initialize Schema… to bootstrap

State D — column mode active:
  [COLUMN_LABEL        ▼]  ← dropdown of compatible schema fields
  [↔ Value]                ← toggle back to value mode
```

---

## Data Tab

```
╔════════════════════════════════════════════════════════════════════════════╗
║ [Template] [Data] [Schema] [Image] [Font Pool]                             ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌──────────────────────────────┬──────────────────────────────────────┐   ║
║  │ LEFT COLUMN                  │ RIGHT COLUMN                         │   ║
║  ├──────────────────────────────┤                                      │   ║
║  │                              │  ┌────────────────────────────────┐  │   ║
║  │ Row: [Dropdown           ▼]  │  │                                │  │   ║
║  │ [+Add Row]  [-Del Row]        │  │      CARD DISPLAY              │  │   ║
║  │                              │  │    (Currently Selected Row)    │  │   ║
║  │ ┌─ Row Form ────────────────┐│  │                                │  │   ║
║  │ │ Hero Name:  [__________]  ││  │                                │  │   ║
║  │ │             (TextField)   ││  │                                │  │   ║
║  │ │                           ││  │                                │  │   ║
║  │ │ Power:      [__5_______]  ││  │                                │  │   ║
║  │ │             (NumberField) ││  │                                │  │   ║
║  │ │                           ││  │                                │  │   ║
║  │ │ Class:  [Warrior       ▼] ││  │                                │  │   ║
║  │ │             (Options)     ││  └────────────────────────────────┘  │   ║
║  │ │                           ││                                      │   ║
║  │ │ Accent: [■ #cc0000 ]      ││                                      │   ║
║  │ │             (Color)       ││                                      │   ║
║  │ │                           ││                                      │   ║
║  │ │ Hero Image: [hero.png  ▼] ││                                      │   ║
║  │ │             (ImageData)   ││                                      │   ║
║  │ │                           ││                                      │   ║
║  │ │ Card Font: [Georgia    ▼] ││                                      │   ║
║  │ │             (Font —       ││                                      │   ║
║  │ │              fontPool only)│                                      │   ║
║  │ └───────────────────────────┘│                                      │   ║
║  └──────────────────────────────┴──────────────────────────────────────┘   ║
╚════════════════════════════════════════════════════════════════════════════╝

Notes:
  • TextField  → text input; min_length/max_length enforced
  • NumberField → number input; min/max/step enforced
  • Options    → dropdown restricted to field's options[]
  • Color      → color picker button (right-click to clear)
  • ImageData  → dropdown from state.images; shows [+ Load image…] when images empty
  • Font       → dropdown restricted to fontPool entries; shows [+ Add font…] when pool empty
  • Last data row cannot be deleted while any layer field is in column mode
```

---

## Schema Tab

```
╔════════════════════════════════════════════════════════════════════════════╗
║ [Template] [Data] [Schema] [Image] [Font Pool]                             ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌──────────────────────────────┬──────────────────────────────────────┐   ║
║  │ LEFT COLUMN                  │ RIGHT COLUMN                         │   ║
║  ├──────────────────────────────┤                                      │   ║
║  │                              │  • Hero Name                         │   ║
║  │ Field: [Dropdown          ▼] │    COLUMN_ID: HERO_NAME              │   ║
║  │ [+Add] [-Del] [↑] [↓]        │    Type: TextField                   │   ║
║  │                              │    min_length: 1  max_length: 40     │   ║
║  │ ┌─ Field Editor ────────────┐│                                      │   ║
║  │ │ Label:  [Hero Name______] ││  • Power                             │   ║
║  │ │ ID:      HERO_NAME        ││    COLUMN_ID: POWER                  │   ║
║  │ │          (live preview)   ││    Type: NumberField                 │   ║
║  │ │                           ││    min: 0  max: 10  step: 1          │   ║
║  │ │ Type: [TextField       ▼] ││                                      │   ║
║  │ │  ├ ImageData              ││  • Class                             │   ║
║  │ │  ├ TextField              ││    COLUMN_ID: CLASS                  │   ║
║  │ │  ├ NumberField            ││    Type: Options                     │   ║
║  │ │  ├ Options                ││    options: [Warrior, Mage, Rogue]   │   ║
║  │ │  ├ Font                   ││                                      │   ║
║  │ │  └ Color                  ││  • Accent                            │   ║
║  │ │                           ││    COLUMN_ID: ACCENT                 │   ║
║  │ │ (type-specific fields)    ││    Type: Color                       │   ║
║  │ │ min_length: [1___]        ││    default: #cc0000                  │   ║
║  │ │ max_length: [40__]        ││                                      │   ║
║  │ │ (adjusts per type)        ││                                      │   ║
║  │ └───────────────────────────┘│                                      │   ║
║  └──────────────────────────────┴──────────────────────────────────────┘   ║
╚════════════════════════════════════════════════════════════════════════════╝

Notes:
  • COLUMN_ID is derived live from Label: label.toUpperCase().replace(/ /g,'_')
  • COLUMN_ID uniqueness is enforced; conflicts shown in real time
  • Deleting a field that is in column-mode use opens the §13 deletion guard modal
```

---

## Image Tab

```
╔════════════════════════════════════════════════════════════════════════════╗
║ [Template] [Data] [Schema] [Image] [Font Pool]                             ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  [Load Image]  [Remove Unused]                                             ║
║                                                                            ║
║  ┌────────────────────────────────────────┐                                ║
║  │ Thumbnail  │ Filename                   │                               ║
║  ├────────────────────────────────────────┤                                ║
║  │  [img]     │  hero.png                  │                               ║
║  │  [img]     │  mage.png                  │                               ║
║  │  [img]     │  dragon.jpg                │                               ║
║  │            │                            │                               ║
║  └────────────────────────────────────────┘                                ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

Notes:
  • No per-row delete buttons. Use [Remove Unused] to bulk-remove unreferenced images.
  • An image is "in use" if its filename appears in any value-mode Image.data field
    OR in any ImageData-type column in state.data rows.
  • Duplicate filenames on load are rejected with an inline message.
```

---

## Font Pool Tab

```
╔════════════════════════════════════════════════════════════════════════════╗
║ [Template] [Data] [Schema] [Image] [Font Pool]                             ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌──────────────────────────────────────────┬──────────────────────────┐   ║
║  │ ALL AVAILABLE FONTS (left, 2/3)          │ ACTIVE POOL (right, 1/3) │   ║
║  ├──────────────────────────────────────────┤                          │   ║
║  │  ┌──────────────────────────────────┐    │  Selected fonts:         │   ║
║  │  │ ╔══════════════════════════════╗ │    │                          │   ║
║  │  │ ║  Georgia                     ║ │    │  ● Georgia               │   ║
║  │  │ ║  "The quick brown fox…"      ║ │    │  ● Caudex                │   ║
║  │  │ ╚══════════════════════════════╝ │    │                          │   ║
║  │  │                                  │    │                          │   ║
║  │  │ ╔══════════════════════════════╗ │    │                          │   ║
║  │  │ ║  Caudex                      ║ │    │                          │   ║
║  │  │ ║  "The quick brown fox…"      ║ │    │                          │   ║
║  │  │ ╚══════════════════════════════╝ │    │                          │   ║
║  │  │                                  │    │                          │   ║
║  │  │ ┌──────────────────────────────┐ │    │                          │   ║
║  │  │ │  Arial                       │ │    │                          │   ║
║  │  │ │  "The quick brown fox…"      │ │    │                          │   ║
║  │  │ └──────────────────────────────┘ │    │                          │   ║
║  │  │                                  │    │                          │   ║
║  │  │ ┌──────────────────────────────┐ │    │                          │   ║
║  │  │ │  Verdana                     │ │    │                          │   ║
║  │  │ │  "The quick brown fox…"      │ │    │                          │   ║
║  │  │ └──────────────────────────────┘ │    │                          │   ║
║  │  └──────────────────────────────────┘    │                          │   ║
║  └──────────────────────────────────────────┴──────────────────────────┘   ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

Legend:
  ╔══╗ = Font is in the active pool (thick border, selected)
  ┌──┐ = Font is not in the active pool (thin border, unselected)
  Click a font card to toggle it in/out of the pool.

Notes:
  • A font in use (value-mode Text.font_family references it) cannot be deselected without
    first specifying a replacement font via the guard modal (see §12).
  • If the last pool font is removed, the replacement dropdown expands to the full Fonts list.
```

---

## Initialize Schema Wizard

### Screen 1 — Field Selection

```
╔════════════════════════════════════════════════════════════════════════════╗
║ Initialize Schema                                               [×] Cancel ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Select which layer properties to expose as schema columns.                ║
║  All unchecked by default.                                                 ║
║                                                                            ║
║  ┌─ Layer 1: Hero Background (Image) ───────────────────────────────────┐  ║
║  │  [ ] data               (ImageData)                                  │  ║
║  │  [ ] cx                 (NumberField)                                │  ║
║  │  [ ] cy                 (NumberField)                                │  ║
║  │  [ ] magnification      (NumberField)                                │  ║
║  │  [ ] rotation           (NumberField)                                │  ║
║  │  [ ] background color   (Color)      [disabled — value is null]      │  ║
║  │  [ ] border color       (Color)      [disabled — value is null]      │  ║
║  └──────────────────────────────────────────────────────────────────────┘  ║
║                                                                            ║
║  ┌─ Layer 2: Title Text (Text) ─────────────────────────────────────────┐  ║
║  │  [✓] text               (TextField)                                  │  ║
║  │  [ ] font family        (Font)                                       │  ║
║  │  [ ] font color         (Color)                                      │  ║
║  │  [ ] background color   (Color)      [disabled — value is null]      │  ║
║  │  [ ] border color       (Color)      [disabled — value is null]      │  ║
║  └──────────────────────────────────────────────────────────────────────┘  ║
║                                                                            ║
║                                         [Next →]  [Cancel]                ║
╚════════════════════════════════════════════════════════════════════════════╝
```

### Screen 2 — Schema Preview

```
╔════════════════════════════════════════════════════════════════════════════╗
║ Initialize Schema — Review                                      [×] Cancel ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Edit column labels below. COLUMN_IDs are derived automatically.           ║
║                                                                            ║
║  ┌──────────────────────┬────────────────────────┬──────────────────────┐  ║
║  │ Label                │ COLUMN_ID (auto)        │ Type                 │  ║
║  ├──────────────────────┼────────────────────────┼──────────────────────┤  ║
║  │ [Title Text text___] │  TITLE_TEXT_TEXT        │ TextField            │  ║
║  │                      │  ⚠ collision — suffix   │                      │  ║
║  │ [Layer 2 text______] │  LAYER_2_TEXT           │ TextField            │  ║
║  └──────────────────────┴────────────────────────┴──────────────────────┘  ║
║                                                                            ║
║  On confirm:                                                               ║
║  • Schema fields will be created as shown above.                           ║
║  • A first data row will be created from the current layer values.         ║
║  • Each selected field will be switched to column mode.                    ║
║                                                                            ║
║                                [← Back]  [Confirm]  [Cancel]              ║
╚════════════════════════════════════════════════════════════════════════════╝
```

---

## Schema Field Deletion Guard

```
╔════════════════════════════════════════════════════════════════════════════╗
║ Schema Field In Use                                                        ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  "Hero Image" (ImageData) is referenced by:                                ║
║    • Layer 1 — Image › data                                                ║
║                                                                            ║
║  How would you like to resolve this?                                       ║
║                                                                            ║
║  ─ Replace with another column ────────────────────────────────────────    ║
║    [+ Add column…]                (no compatible column exists)            ║
║    ─ or ─                                                                  ║
║    [Hero Gallery            ▼]    (if another ImageData column exists)     ║
║                                                                            ║
║  ─ Set to a fixed value ───────────────────────────────────────────────    ║
║    [hero.png              ▼]      (images dropdown)                        ║
║    ─ or ─                                                                  ║
║    [+ Load image…]                (if no images are loaded)                ║
║                                                                            ║
║  ℹ To resolve usages individually, click Cancel and update each            ║
║    layer in the Template tab before deleting this field.                   ║
║                                                                            ║
║                                             [Confirm]  [Cancel]           ║
╚════════════════════════════════════════════════════════════════════════════╝
```

---

## Load Data — Column-Mode Guard

```
╔════════════════════════════════════════════════════════════════════════════╗
║ Cannot Load Empty Data Set                                                 ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  The file contains no data rows, but one or more layer fields are          ║
║  currently in column mode:                                                 ║
║                                                                            ║
║    • Layer 1 — Image › data  (column: HERO_IMAGE)                          ║
║    • Layer 2 — Text  › text  (column: HERO_NAME)                           ║
║                                                                            ║
║  Switch all column-mode fields to value mode in the Template tab           ║
║  before loading an empty data set.                                         ║
║                                                                            ║
║                                                              [OK]          ║
╚════════════════════════════════════════════════════════════════════════════╝
```

---

## Validation Error Modal (with Download Error Report)

```
╔════════════════════════════════════════════════════════════════════════════╗
║ File Validation Failed                                                     ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  The uploaded file contains errors and was not loaded:                     ║
║                                                                            ║
║  • [row 3, HERO_NAME] Value "x" is shorter than min_length (1).            ║
║  • [row 5, POWER] Value "99" exceeds max (10).                             ║
║  • [row 8, CARD_FONT] "Impact" is not in the current font pool.            ║
║  …(N more errors)                                                          ║
║                                                                            ║
║  [Download Error Report (.csv)]                                            ║
║                                                              [OK]          ║
╚════════════════════════════════════════════════════════════════════════════╝
```

CSV (data upload) error report columns: `row`, `column`, `value`, `error`
CSV (JSON upload) error report columns: `path`, `value`, `error`

---

## Tab Navigation Structure

```
┌──────────────────────────────────────────────────────┐
│ [Template] [Data] [Schema] [Image] [Font Pool]       │
├──────────────────────────────────────────────────────┤
│                                                      │
│   Tab Content Area                                   │
│                                                      │
└──────────────────────────────────────────────────────┘
```
