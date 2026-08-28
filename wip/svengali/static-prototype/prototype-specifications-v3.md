# Svengali Static UI Prototype Specifications v3

## Overview & Purpose

This document defines the specification for a single-page static UI prototype of Svengali that showcases the main interface layout and all modals/popups. This is **not** a functional demo or complete app prototype—it is strictly for establishing layouts and styling of the UI before implementation.

### Key Principles
- Build directly from `plan-v6` and `ui-design` documentation
- Conform to rules and guidelines in `generalStyleOverview.md`
- Focus on integration with other Scullery Plateau apps
- **Static only**: No functional tabs, modals, or interactions required
- Show all UI states as separate page sections for clarity
- Reference `static-ui-proto.html` original design for accurate patterns

### Technology Stack
- **Bootstrap 5.0.2** CSS only (no JavaScript)
- **Google Fonts**: Caudex and Modern Antiqua
- **Font Awesome 6.0.0** for icons
- **Project stylesheets**: `style/rpg.css`, `style/font.css`, `style/menu.css`
- **Minimal custom CSS**: Only for font pool buttons to display each font in its own typeface
- **Pure HTML**: Zero custom JavaScript required

### File Location
- Output: `apps/svengali/prototyping/static-ui-proto-v#.html` where `#` is the version of the prototype, per the version of `prototype-specifications-v#` being used.

---

## Page Structure

### Header & Footer
- **NO header or footer** on the prototype page
- This is intentional: the prototype focuses solely on UI layout and styling, not app context
- Do not use `header.js` or `footer.js` components

### Main Layout
- Dark theme: `<body class="bg-dark text-light">`
- Full-width content area with padding

### Menu Bar Section
- **Container**: RPG box panel
- **Width**: Only as wide as needed to accommodate buttons (not full width)
- **Position**: Top of page, centered, not locked to top
- **Layout**: Inline (horizontal) icon-only buttons
- **Spacing**: Consistent padding/margins via Bootstrap utilities

### Main Content Section
- **Structure**: Each major section (Template, Data, Schema, Image, Font Pool) as separate RPG box panels
- **Tabs**: NOT included in this prototype (each section shown independently)
- **Approach**: Show each section as a standalone panel demonstrating its layout and styling

---

## Menu Section

### Menu Buttons
- **Style**: Icon-only buttons, NO text labels
- **Icon source**: Font Awesome icons
- **Accessibility**: All text as `title` and `alt` attributes only
- **Layout**: Inline (horizontal), centered
- **Container**: RPG box with padding, width to fit buttons

### Menu Items
Each button has a unique Font Awesome icon with accessibility text in `title` and `alt` attributes:

1. **Download All** — `fa-download`
   - Alt/Title: "Download All"
   
2. **Download Template (JSON)** — `fa-code`
   - Alt/Title: "Download Template"
   
3. **Download Data (CSV)** — `fa-table`
   - Alt/Title: "Download Data"
   
4. **Print** — `fa-print`
   - Alt/Title: "Print"
   
5. **Load Template** — `fa-folder-open`
   - Alt/Title: "Load Template"
   
6. **Load Data** — `fa-upload`
   - Alt/Title: "Load Data"

---

## Template Editor Panel

### Layout
- **Two-column layout**:
  - Left column: Form controls
  - Right column: Card preview (SVG with rounded corners, no background)
- Form inputs: **Truly inline** with labels (label and input on same line, not stacked)
- **Note**: Right column layout varies per section:
  - **Template Editor**: Card preview
  - **Data Panel**: Card preview
  - **Schema Panel**: Bulleted list of all columns
  - **Image Panel**: Standard table (no separate columns)
  - **Font Pool**: Selected fonts display

### Card Preview
- **Background**: No background color on the preview area itself
- **Card background**: First layer of SVG (rounded white rectangle)
- **Format**: SVG (not HTML)
- **Styling**: Rounded corners
- **Aspect ratio**: 3.5:5 (standard card size)

### Frame Properties (Base - Shared by All Layers)
All fields inline with labels. Applies to every layer, whether Image or Text.

| Property | Type | Notes |
|---|---|---|
| `name` | string | Layer name |
| `frame_x` | number | X position |
| `frame_y` | number | Y position |
| `frame_width` | number | Width |
| `frame_height` | number | Height |

### Layer Dropdown
- Single dropdown (not expandable list)
- Shows current layer
- Can have many layers (may exceed 10+)

### Layer Controls (Directly Below Dropdown)
Display directly below Layer dropdown without section header. Icon buttons for layer operations, inline horizontal layout:

| Control | Icon | Title/Alt | Function |
|---|---|---|---|
| Add | `fa-plus` | "Add Layer" | Create new layer |
| Delete | `fa-minus` | "Delete Layer" | Remove current layer |
| Move To Back | `fa-angles-left` | "Move To Back" | Move layer to back of stack |
| Move Back One | `fa-chevron-left` | "Move Back One" | Move layer back one position |
| Move Forward One | `fa-chevron-right` | "Move Forward One" | Move layer forward one position |
| Move To Front | `fa-angles-right` | "Move To Front" | Move layer to front of stack |

### Horizontal Separator
- Visual divider between Frame Properties and Layer-Specific Properties
- Use `<hr>` or border element

### Image Layer Properties
All fields as ColumnableField\<T\> (can be value or column mode). All inline with labels.

| Property | Type | Notes |
|---|---|---|
| `data` | ColumnableField\<string\> | Image filename/identifier |
| `cx` | ColumnableField\<number\> | Center X |
| `cy` | ColumnableField\<number\> | Center Y |
| `magnification` | ColumnableField\<number\> | Scale/zoom |
| `rotation` | ColumnableField\<number\> | Rotation in degrees |
| `background_color` | ColumnableField\<color\> | Optional, button (no label; button text is label) |
| `frame_color` | ColumnableField\<color\> | Optional, button (no label; button text is label) |

### Text Layer Properties
All fields as ColumnableField\<T\> (can be value or column mode). All inline with labels.

| Property | Type | Notes |
|---|---|---|
| `text` | ColumnableField\<string\> | Text content |
| `font_family` | ColumnableField\<Font\> | Font selection |
| `font_color` | ColumnableField\<color\> | Font color button (no label; button text is label) |
| `background_color` | ColumnableField\<color\> | Optional, button (no label; button text is label) |
| `frame_color` | ColumnableField\<color\> | Optional, button (no label; button text is label) |

---

## Data Panel

### Layout & Structure
- **Two-column layout**:
  - Left column: Data entry form
  - Right column: Card preview
- No section headers for row management buttons
- Data row dropdown to select which data row to edit
- Row controls integrated inline with data rows

### Data Row Selector
- Dropdown showing available data rows
- Allows user to see which row is being edited

### Data Form Display
- Clean form layout showing current row's data
- Column labels NOT as inputs (they are fixed headers)
- Column labels cannot be added/removed in this view

### Row Management Controls
Display inline with row management area. Icon buttons for row operations:

| Control | Icon | Color | Title/Alt | Function |
|---|---|---|---|---|
| Add Row | `fa-plus` | Bootstrap success | "Add Row" | Create new data row |
| Delete Row | `fa-minus` | Bootstrap danger | "Delete Row" | Remove current data row |

### Card Preview
- Same as Template Editor: SVG with rounded corners
- Shows rendered card based on current data row

### Example: Data Form with All Field Types

**Layout:**
- Top: Row selector dropdown with Add Row (fa-plus, success) and Delete Row (fa-minus, danger) buttons
- Left column: Data entry form with all field types
- Right column: SVG card preview

**Example Form Fields (one of each type, using Column Labels):**

```
Row Selector: [Dropdown: "Row 1 of 3"] [+ Add Row] [- Delete Row]

Character Name
[Text input: "Aragorn"]

Experience Points
[Number input: "8500"]

Character Class
[Dropdown: "Ranger" ▼]
  Options: Barbarian, Bard, Cleric, Fighter, Ranger, Rogue, Wizard

Title Font
[Font selector: "Georgia" ▼]

Accent Color
[Color picker button: color swatch]

Character Portrait
[Dropdown: "hero.png" ▼]
  Options: hero.png, mage.png, staff.png
```

**Right Column:**
- SVG card preview showing the rendered result with selected values
- Rounded corners, 3.5:5 aspect ratio

---

## Schema Management Panel

### Layout & Structure
- **Two-column layout with spacing**:
  - Left column: Column editing form
  - Right column: Bulleted list of all columns
- No section headers required for "Type Properties"
- Column ID shown as info text underneath Label field (not editable)

### Column Selection
- Dropdown or select element to choose active column
- Add/Delete buttons adjacent to selector
  - **Add button**: Bootstrap success color
  - **Delete button**: Bootstrap danger color
  - Icons: Font Awesome plus/minus
  - Accessibility: `title` and `alt` text only

### Column Editing Form
- **Label**: Inline input with label (label on left, input on right)
  - User-friendly name; user-entered; alphanumeric characters and spaces only
  - Example: "Hero Name"
- **Column ID**: Info text (not editable), styled in Bootstrap info color for readability, displayed underneath Label field
  - Auto-generated from Label using rule: `COLUMN_ID = label.toUpperCase().replace(/ /g, '_')`
  - Example for "Hero Name" label: "HERO_NAME"
  - Shows in real-time as user types the label
- **Type**: Inline dropdown with label
  - Options: TextField, NumberField, Options, Font, Color, ImageData
- Additional properties as per plan-v6, all inline

### Column List Display
- Right column: Bulleted list of all columns
- Each entry shows column name and type
- Clean, compact presentation
- Adequate padding/spacing from left column

### Field Type: TextField
Editing form when Type is set to TextField:
- **Label**: Inline input (example: "Hero Name")
- **Column ID**: Info text (example: "HERO_NAME")
- **Type**: Dropdown (shows "TextField")
- **Min Length**: Inline number input
- **Max Length**: Inline number input
- All inputs truly inline with labels

### Field Type: NumberField
Editing form when Type is set to NumberField:
- **Label**: Inline input (example: "Experience Points")
- **Column ID**: Info text (example: "EXPERIENCE_POINTS")
- **Type**: Dropdown (shows "NumberField")
- **Min**: Inline number input
- **Max**: Inline number input
- **Step**: Inline number input
- All inputs truly inline with labels

### Field Type: Options
Editing form when Type is set to Options:
- **Label**: Inline input (example: "Character Class")
- **Column ID**: Info text (example: "CHARACTER_CLASS")
- **Type**: Dropdown (shows "Options")
- **Options**: Text area or list input for option values (one per line or comma-separated)
- All inputs truly inline with labels

### Field Type: Font
Editing form when Type is set to Font:
- **Label**: Inline input (example: "Title Font")
- **Column ID**: Info text (example: "TITLE_FONT")
- **Type**: Dropdown (shows "Font")
- No additional type-specific properties

### Field Type: Color
Editing form when Type is set to Color:
- **Label**: Inline input (example: "Accent Color")
- **Column ID**: Info text (example: "ACCENT_COLOR")
- **Type**: Dropdown (shows "Color")
- **Default**: Color picker button (inline, no separate label; button text is the label)
- All inputs truly inline with labels

### Field Type: ImageData
Editing form when Type is set to ImageData:
- **Label**: Inline input (example: "Hero Portrait")
- **Column ID**: Info text (example: "HERO_PORTRAIT")
- **Type**: Dropdown (shows "ImageData")
- No additional type-specific properties

---

## Image Management Panel

### Panel Controls

#### Top Center
- **Load Image button**: Bootstrap primary color, Font Awesome upload icon
- **Delete Unused button**: Bootstrap danger color, Font Awesome trash icon
- Accessibility: `title` and `alt` text only

#### Bottom Right
- **Update button**: Bootstrap success color, Font Awesome check icon
- **Cancel button**: Bootstrap secondary color, Font Awesome times icon
- Accessibility: `title` and `alt` text only

### Table Structure
- Standard Bootstrap table styling with info color background for headers
- Rows for each uploaded image (from `state.images` array)
- Each image object contains: `filename`, `dataUrl`, `width`, `height`

### Table Columns (Per ui-design.md)

| Column | Content | Details |
|--------|---------|---------|
| **Filename** | Image filename | The filename string (e.g., `hero.png`) |
| **Loaded?** | Yes/No indicator | Boolean: whether `dataUrl` is populated (loaded into memory) |
| **In Data Table?** | Yes/No indicator | Boolean: whether image filename is referenced in any `ImageData` column in current data |
| **In Template?** | Yes/No indicator | Boolean: whether image filename is referenced in any `Image` frame in template layers |

### Example: Panel with Images

**Layout:**
- Top bar with: `[📤 Load Image]` and `[🗑️ Delete Unused]` buttons (left-aligned in center area)
- Bootstrap info-colored table header row
- Multiple data rows

**Example Table:**

```
| Filename | Loaded? | In Data Table? | In Template? |
|----------|---------|----------------|--------------|
| hero.png | Yes | Yes | Yes |
| mage.png | Yes | Yes | No |
| staff.png | No | No | No |
```

**Bottom bar with:** `[✓ Update]` and `[✕ Cancel]` buttons (right-aligned)

### Example: Panel with Empty Table

**Layout:**
- Top bar with: `[📤 Load Image]` and `[🗑️ Delete Unused]` buttons (left-aligned in center area)
- Empty state message displayed where table would be: "No images uploaded"
- Smaller/grayed Delete Unused button (no unused images to delete)

**Empty message:** Centered text reading "No images uploaded" with secondary styling

**Bottom bar with:** `[✓ Update]` and `[✕ Cancel]` buttons (right-aligned)

### Interaction Details
- **Loaded? status**: Checked during upload; shows whether image data is available in memory for rendering
- **In Data Table? status**: Checked automatically by scanning all ImageData column values
- **In Template? status**: Checked automatically by scanning all Image layer `data` properties
- **Delete Unused button**: Removes all images where both "In Data Table?" and "In Template?" are false (marks for deletion pending Update); disabled when no unused images exist
- **Update button**: Commits pending changes (after deletions or uploads)
- **Cancel button**: Reverts pending changes without updating state
- **Empty state**: Shows "No images uploaded" message when `state.images` is empty

### Full Image Modal
- Triggered by clicking filename or thumbnail (if displayed)
- Minimal styling: Just the image in a centered overlay
- Instruction text: "Click outside or press Esc to close" as `title` and `alt` (not visible on screen)
- Close on: Click outside, `Esc` key
- Minimal padding around image

---

## Font Pool Panel

### Layout & Structure
- **Two-column layout with scrollable content**:
  - **Left column** (2/3 width, scrollable): Available fonts list
  - **Right column** (1/3 width, scrollable): Selected fonts display
- Each font button displays preview text within the button
- No separate font preview section

### Available Fonts (Left Column)
- Scrollable list of all available fonts
- Each button styled in its own font with preview text
- Bootstrap color-coding: Unselected: Bootstrap info color
- Clickable to select and add to right column
- Adequate padding/spacing between entries

**Example Available Fonts (Websafe fonts):**
```
## Arial
> "The quick brown fox jumped over the lazy dog!"

## Verdana
> "The quick brown fox jumped over the lazy dog!"

## Times New Roman
> "The quick brown fox jumped over the lazy dog!"

## Courier New
> "The quick brown fox jumped over the lazy dog!"

## Georgia
> "The quick brown fox jumped over the lazy dog!"

## Trebuchet MS
> "The quick brown fox jumped over the lazy dog!"

## Comic Sans MS
> "The quick brown fox jumped over the lazy dog!"

## Impact
> "The quick brown fox jumped over the lazy dog!"

## Palatino Linotype
> "The quick brown fox jumped over the lazy dog!"

## Lucida Console
> "The quick brown fox jumped over the lazy dog!"

## Tahoma
> "The quick brown fox jumped over the lazy dog!"

## Lucida Grande
> "The quick brown fox jumped over the lazy dog!"
```
*(Scroll shows more fonts; left column is scrollable)*

### Selected Fonts (Right Column)
- Scrollable display of currently selected fonts (user has added via left column)
- Each shown in its own font with preview text
- Bootstrap success color
- Shows which fonts are active in the template
- Adequate padding/spacing between entries
- Empty when no fonts selected

---

## Modals & Popups

### General Modal Approach
- Display as **centered static frames** on the page
- Make them visually appear as modals (centered, bordered, styled)
- **Do not make them functional** for the static prototype
- Show modal variations on the page as separate centered instances

### Modal List

#### 1. Create New Template (Orientation Selection)
- **Title**: "Create New Template"
- **Text**: "Choose the card orientation for your template:"
  - Text styling: Ensure visibility and readability
- **Buttons**: Side by side (not stacked)
- **Button content**: 
  - Large SVG card outlines (white fill, not outline only) for each orientation
  - **Approximately 4x the visual size of v2** (significantly larger)
  - Portrait orientation
  - Landscape orientation
- **Sizing**: Modal width appropriate to content (not full page)
- **Centered**: Absolutely centered on page

#### 2. Alert Modal
- Title: "Alert"
- Text message
- Single OK button (right-aligned)
- Centered on page

#### 3. Confirm Modal
- Title: "Confirm"
- Text prompt/question
- Cancel and OK buttons (right-aligned)
- Centered on page

#### 4. Full Image View Modal
- Minimal display: Just the image
- No visible header or title
- No close button UI
- Instruction text: Title and alt attributes only, not displayed on screen
- Centered on page
- Close on: Click outside, `Esc` key press
- Full-resolution image display
- Minimal padding around image

---

## Styling & Integration

### Color Scheme
- Follow `generalStyleOverview.md` guidelines
- Dark theme throughout
- Bootstrap color classes only:
  - `.btn-primary` — Primary actions and focus states
  - `.btn-success` — Selected fonts, Add buttons
  - `.btn-info` — Unselected fonts, image table headers, readable info text
  - `.btn-danger` — Delete buttons
  - `.btn-secondary` — Cancel buttons
- Use Bootstrap background utilities (`.bg-dark`, `.bg-secondary`, etc.)
- Use Bootstrap text utilities (`.text-light`, `.text-muted`, `.text-info`, etc.)
- No custom hex color values—all styling via Bootstrap classes and utilities

### Tab Styling (If Included in Future)
- Inactive tabs: Light text on dark background for distinction from RPG box background
- Active tabs: Standard Bootstrap active state
- Clear visual separation from content area

### Typography
- Google Fonts: Caudex and Modern Antiqua
- Bootstrap default sizing and weights
- **Exception**: Font Pool buttons display each font in its own typeface via local custom CSS

### Spacing & Layout
- Bootstrap grid system (`.container-fluid`, `.row`, `.col-*`)
- Consistent padding/margins using Bootstrap utilities
- `.rpg-box` class for major content sections (from `rpg.css`)
- Adequate spacing between columns in multi-column layouts

### Forms
- Use `.rpg-textbox` style from `rpg.css`
- Dark backgrounds with subtle borders on focus
- **Inline form layout**: Labels on left, inputs on right, same line
- Toggle switches where applicable
- Consistent input appearance

### Icons
- Font Awesome 6.0.0
- All interactive icons have `title` and `alt` attributes
- Icon-only buttons for compact interface

---

## Implementation Checklist

### Structure
- [ ] Single HTML file: `static-ui-proto-v3.html`
- [ ] No header or footer
- [ ] Full-width content area with padding
- [ ] Menu bar in RPG box (width-fit, not full-width), centered
- [ ] Each section (Template, Data, Schema, Image, Font Pool) as separate RPG box panels
- [ ] Dark theme applied

### Menu Bar
- [ ] 6 icon-only buttons in horizontal layout, centered
- [ ] Inside width-fit RPG box container
- [ ] Icons with accessibility attributes (`title`, `alt`):
  - [ ] New (fa-file-circle-plus)
  - [ ] Open (fa-file-circle-arrow-up)
  - [ ] Save (fa-floppy-disk)
  - [ ] Download (fa-download)
  - [ ] Settings (fa-sliders)
  - [ ] About (fa-circle-info)

### Template Editor Panel
- [ ] Two-column layout with form and SVG preview
- [ ] Frame properties section with inline inputs (name, frame_x, frame_y, frame_width, frame_height)
- [ ] Layer dropdown selector
- [ ] Layer controls below dropdown (6 icon buttons: Add, Delete, Move To Back, Move Back One, Move Forward One, Move To Front)
- [ ] Horizontal divider separating frame from layer-specific properties
- [ ] Image variant: data, cx, cy, magnification, rotation, colors (as ColumnableField)
- [ ] Text variant: text, font_family, font_color, colors (as ColumnableField)
- [ ] SVG card preview on right with rounded corners (3.5:5 aspect ratio)
- [ ] All inputs truly inline with labels

### Data Panel
- [ ] Two-column layout (form + SVG card preview)
- [ ] Data row dropdown selector
- [ ] Column values shown as inline inputs (labels from schema, not editable)
- [ ] Row management controls: Add Row (success, fa-plus), Delete Row (danger, fa-minus)
- [ ] SVG card preview on right with rounded corners
- [ ] All inputs truly inline with labels

### Schema Panel
- [ ] Two-column layout with spacing (form left, column list right)
- [ ] Column selector dropdown with Add (success) and Delete (danger) buttons
- [ ] Column editing form with inline inputs:
  - [ ] Label
  - [ ] Column ID (info text, auto-generated)
  - [ ] Type (dropdown)
  - [ ] Type-specific properties (inline inputs for TextField: min/max; NumberField: min/max/step; Options: options list; Font: none; Color: color picker; ImageData: none)
- [ ] Column list on right showing all columns with types
- [ ] All form inputs truly inline with labels

### Image Management Panel
- [ ] Top center controls: Load Image button (primary, fa-upload), Delete Unused button (danger, fa-trash)
- [ ] Table with 4 columns:
  - [ ] Filename
  - [ ] Loaded? (Yes/No boolean indicator)
  - [ ] In Data Table? (Yes/No boolean indicator)
  - [ ] In Template? (Yes/No boolean indicator)
- [ ] Bootstrap info colored table headers
- [ ] Empty state: "No images uploaded" message when no images
- [ ] Bottom right controls: Update button (success, fa-check), Cancel button (secondary, fa-times)

### Font Pool Panel
- [ ] Two-column layout: Left 2/3 (available fonts, scrollable), Right 1/3 (selected fonts, scrollable)
- [ ] Both columns scrollable to demonstrate scroll behavior
- [ ] Font buttons display preview text in their own typeface
- [ ] Available fonts: All websafe fonts (Arial, Verdana, Times New Roman, Courier New, Georgia, Trebuchet MS, Comic Sans MS, Impact, Palatino Linotype, Lucida Console, Tahoma, Lucida Grande, etc.)
- [ ] Available fonts colored with Bootstrap info
- [ ] Selected fonts colored with Bootstrap success
- [ ] Font buttons include preview text "The quick brown fox jumped over the lazy dog!"

### Modals & Popups (Shown as Static Centered Sections)
- [ ] Create Template modal: Centered with larger (4x) white card SVGs
- [ ] Alert modal: Message with right-aligned OK button
- [ ] Confirm modal: Message with right-aligned Cancel and Confirm buttons
- [ ] Full Image View modal: Minimal styling, centered image only, instruction text in title/alt only

### Styling
- [ ] Only Bootstrap 5.0.2 CSS imported (no JavaScript)
- [ ] Font Awesome 6.0.0 for all icons
- [ ] Google Fonts: Caudex, Modern Antiqua
- [ ] Custom stylesheets: `rpg.css`, `font.css`, `menu.css`
- [ ] Minimal custom CSS for font pool buttons only (display fonts in their own typefaces)
- [ ] No JavaScript
- [ ] Dark theme consistently applied
- [ ] All colors via Bootstrap utility classes only (success, danger, info, primary, secondary)
- [ ] All interactive icons have `title` and `alt` attributes
- [ ] Inline form layout throughout (labels left, inputs right)
- [ ] Adequate spacing between columns and sections
- [ ] RPG boxes for all major panels

---

## Notes

- The focus is on **layout and visual styling**, not functionality
- Each section is shown as a separate RPG box panel to demonstrate layout clearly
- All interactive elements are visual only; no click handlers required
- Bootstrap components should handle all styling needs
- Font Pool panel is the **only** exception to "no custom CSS" rule for displaying fonts in their own typefaces
- Inputs must be truly inline (label left, input right) not stacked
- Remove any styling/information that isn't essential for layout demonstration
- Column ID text must be readable (info color) despite dark background
