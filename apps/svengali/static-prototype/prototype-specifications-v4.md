# Svengali Static UI Prototype Specifications v4

## Overview & Purpose

This document defines the specification for a single-page static UI prototype of Svengali that showcases the main interface layout and all modals/popups. This is **not** a functional demo or complete app prototype—it is strictly for establishing layouts and styling of the UI before implementation.

### Key Principles
- Build directly from `plan-v6` and `ui-design` documentation
- Conform to rules and guidelines in `generalStyleOverview.md`
- Focus on integration with other Scullery Plateau apps
- **Static only**: No functional tabs, modals, or interactions required
- Show all panel variations and states on a single page for clarity
- Reference `static-ui-proto.html` original design for accurate patterns

### Technology Stack
- **Bootstrap 5.0.2** CSS only (no JavaScript)
- **Google Fonts**: Caudex and Modern Antiqua
- **Font Awesome 6.0.0** for icons (free version only)
- **Project stylesheets**: `style/rpg.css`, `style/font.css`, `style/menu.css`
- **Pure HTML**: Zero custom JavaScript required
- **CRITICAL: NO CUSTOM STYLES** - See "Styling Rules" section below

### File Location
- Output: `apps/svengali/prototyping/static-ui-proto-v4.html`

---

## Styling Rules

### NO Custom CSS - CRITICAL REQUIREMENT
- **ABSOLUTELY NO `<style>` tags** in the HTML file
- **ABSOLUTELY NO `style=` attributes** anywhere EXCEPT:
  1. Font family styling: `<button style="font-family: {fontName};">...</button>` (Font Pool section only)
  2. Font family in options: `<option style="font-family: {fontName};">{fontName}</option>` (Text Properties font dropdown)
  3. Color backgrounds on buttons: `<button class="btn btn-secondary" style="background-color: {selectedColor}; color: {foregroundColor};">{fieldName}</button>`
     - `foregroundColor` calculated based on selected color contrast (use `getForegroundColor` from `common/colors.js`)
     - Default color values:
       - **Purple (`#7B68EE`)** → Foreground: `#FFFFFF`
       - **Orange (`#FF8C00`)** → Foreground: `#FFFFFF`
       - **Brown (`#8B4513`)** → Foreground: `#FFFFFF`
     
     **Color Button Assignment**:
     | Button | Location | Background | Foreground |
     |--------|----------|------------|-----------|
     | Background Color | Template Editor (Image Variant) | `#7B68EE` (Purple) | `#FFFFFF` |
     | Frame Color | Template Editor (Image Variant) | `#8B4513` (Brown) | `#FFFFFF` |
     | Font Color | Template Editor (Text Variant) | `#FF8C00` (Orange) | `#FFFFFF` |
     | Background Color | Template Editor (Text Variant) | `#7B68EE` (Purple) | `#FFFFFF` |
     | Frame Color | Template Editor (Text Variant) | `#8B4513` (Brown) | `#FFFFFF` |
     | Accent Color | Data Panel | `#FF8C00` (Orange) | `#FFFFFF` |
     | Default | Schema Panel (Color Variant) | `#7B68EE` (Purple) | `#FFFFFF` |

### Input Field Styling
- **DO NOT use `.rpg-textbox`** - This is NOT allowed
- Use explicit Bootstrap classes and HTML from `formFieldLayoutExamples.html`
- All styling comes from Bootstrap grid system and utility classes
- Form fields must use proper semantic HTML with Bootstrap's form classes

### Container Styling
- **All modals and major sections**: Use `.rpg-box` class from `rpg.css`
- **No borders or custom styling** beyond rpg-box
- Let Bootstrap and project stylesheets handle all presentation

### Icons
- Font Awesome 6.0.0 free version only (no pro icons)
- All interactive icons have `title` and `alt` attributes
- Buttons should be as small as possible while remaining usable

---

## Page Structure

### Header & Footer
- **NO header or footer** on the prototype page

### Main Layout
- Dark theme
- Full-width content area with padding
- **All panels stack vertically** in a single column (top to bottom):
  1. Menu Bar
  2. Template Editor (Image Variant)
  3. Template Editor (Text Variant)
  4. Schema Panel (TextField)
  5. Schema Panel (NumberField)
  6. Schema Panel (Options)
  7. Schema Panel (Font)
  8. Schema Panel (Color)
  9. Schema Panel (ImageData)
  10. Data Panel
  11. Image Management Panel (Populated)
  12. Image Management Panel (Empty)
  13. Font Pool Panel
  14. Modals Section (containing all 4 modals stacked vertically)

### Menu Bar
- **Container**: RPG box panel
- **Width**: Only as wide as needed to accommodate 6 buttons (not full width)
- **Position**: Centered, not locked to top
- **Layout**: Inline (horizontal) icon-only buttons

---

## Panel Structure & Variations

### Panel List (Order of Appearance)

1. **Menu Bar** — 6 icon-only buttons
2. **Template Editor (Image Variant)** — With tabs showing this tab active
3. **Template Editor (Text Variant)** — With tabs showing this tab active
4. **Schema Panel (TextField)** — With tabs showing Schema tab active
5. **Schema Panel (NumberField)** — With tabs showing Schema tab active
6. **Schema Panel (Options)** — With tabs showing Schema tab active
7. **Schema Panel (Font)** — With tabs showing Schema tab active
8. **Schema Panel (Color)** — With tabs showing Schema tab active
9. **Schema Panel (ImageData)** — With tabs showing Schema tab active
10. **Data Panel** — With tabs showing Data tab active
11. **Image Management Panel (Populated)** — With tabs showing Image tab active, with sample data
12. **Image Management Panel (Empty)** — With tabs showing Image tab active, empty state
13. **Font Pool Panel** — With tabs showing Font Pool tab active
14. **Create New Template Modal** — Static centered section
15. **Alert Modal** — Static centered section
16. **Confirm Modal** — Static centered section
17. **Full Image View Modal** — Static centered section

---

## Tabs

### Tab Implementation
- All main content panels (Template, Data, Schema, Image, Font Pool) have tabs at the top
- Each panel shows its respective tab as "active" (visually distinct)
- Tabs are visual only (no tab switching functionality)
- Use Bootstrap tab classes (`.nav`, `.nav-link`) with custom styling for active/inactive states

### Tab Visual Styling
**Active Tab** (currently displayed panel):
- Dark text on light background
- Example: `style="color: #000000; background-color: #f8f9fa;"`
- Use Bootstrap class `.active`

**Inactive Tab** (not currently displayed):
- Light text on dark background
- Example: `style="color: #ffffff; background-color: #343a40;"`
- Use Bootstrap class `.nav-link` without `.active`

**HTML Example**:
```html
<div class="nav nav-tabs">
  <button class="nav-link active" style="color: #000000; background-color: #f8f9fa;">Template</button>
  <button class="nav-link" style="color: #ffffff; background-color: #343a40;">Data</button>
  <button class="nav-link" style="color: #ffffff; background-color: #343a40;">Schema</button>
  <button class="nav-link" style="color: #ffffff; background-color: #343a40;">Image</button>
  <button class="nav-link" style="color: #ffffff; background-color: #343a40;">Font Pool</button>
</div>
```

### Tab List
1. Template
2. Data
3. Schema
4. Image
5. Font Pool

---

## Menu Section

### Menu Bar Container
- **Style**: RPG box panel
- **Width**: Fit content (not full width)
- **Alignment**: Centered
- **Button Spacing**: Buttons placed directly adjacent with standard Bootstrap button padding creating natural spacing between them (no gap wrapper needed)

### Menu Buttons (6 Total)
- **Style**: Icon-only buttons, NO text labels
- **Icons**: Font Awesome free icons
- **Accessibility**: All text as `title` and `alt` attributes only
- **Layout**: Inline (horizontal)
- **Sizing**: Only as large as needed to fit icon
- **Color**: Bootstrap primary

| Function | Icon | Alt/Title |
|---|---|---|
| Download All | fa-download | Download All |
| Download Template | fa-code | Download Template |
| Download Data | fa-table | Download Data |
| Print | fa-print | Print |
| Load Template | fa-folder-open | Load Template |
| Load Data | fa-upload | Load Data |

---

## Template Editor Panel

### Layout Structure
- **Two-column layout with tabs**:
  - Top: Tab navigation (Template (active), Data, Schema, Image, Font Pool)
  - Left column: Form with layer and frame properties
  - Right column: SVG card preview
- **Container**: RPG box

### Form Organization
Order of fields in form:
1. Layer dropdown selector
2. Layer controls (6 icon buttons inline)
3. Horizontal divider line
4. Frame properties (5 fields: name, frame_x, frame_y, frame_width, frame_height)
5. Horizontal divider line
6. Variant-specific properties (Image or Text)

### Layer Dropdown
- Shows available layers
- Allow selection of which layer is being edited

### Layer Controls
Display as inline icon buttons, wrapped in `<div class="d-flex gap-2">`:

| Control | Icon | Color | Size | Title/Alt |
|---|---|---|---|---|
| Add Layer | fa-plus | Bootstrap info | `btn` (regular) | Add Layer |
| Delete Layer | fa-minus | Bootstrap danger | `btn` (regular) | Delete Layer |
| Move To Back | fa-angles-left | Bootstrap secondary | `btn` (regular) | Move To Back |
| Move Back One | fa-chevron-left | Bootstrap secondary | `btn` (regular) | Move Back One |
| Move Forward One | fa-chevron-right | Bootstrap secondary | `btn` (regular) | Move Forward One |
| Move To Front | fa-angles-right | Bootstrap secondary | `btn` (regular) | Move To Front |

All buttons inline with `gap-2` spacing between them.

### Frame Properties
All fields use proper Bootstrap form HTML (from `formFieldLayoutExamples.html`):
- **Name**: Text input
- **Frame X**: Number input
- **Frame Y**: Number input
- **Frame Width**: Number input
- **Frame Height**: Number input

### Image Variant Properties
All fields use proper Bootstrap form HTML:
- **Image Source**: Dropdown of filenames from Image panel
- **Center X**: Number input
- **Center Y**: Number input
- **Magnification**: Number input
- **Rotation**: Number input
- **Background Color**: Button with color swatch and text
- **Frame Color**: Button with color swatch and text

### Text Variant Properties
All fields use proper Bootstrap form HTML:
- **Text**: Text area
- **Font Family**: Dropdown showing font names, **each option must have `style="font-family: {fontName}"` attribute** (exception to no-custom-CSS rule for font preview)
- **Font Color**: Button with color swatch and text
- **Background Color**: Button with color swatch and text
- **Frame Color**: Button with color swatch and text

### Card Preview
- Right column: SVG with rounded corners
- **Dimensions**: 225px × 350px
- Aspect ratio: 2.25:3.5 (standard card)
- **Content**: Rounded rectangle filled white (no rendered content)
- Example SVG:
```html
<svg width="225" height="350" viewBox="0 0 225 350" class="card-preview">
  <rect x="5" y="5" width="215" height="340" rx="8" ry="8" fill="white" stroke="#cccccc" stroke-width="1" />
</svg>
```

---

## Data Panel

### Layout Structure
- **Two-column layout with tabs**:
  - Top: Tab navigation (Template, Data (active), Schema, Image, Font Pool)
  - Left column: Row selector and form with data entry fields
  - Right column: SVG card preview
- **Container**: RPG box

### Row Selector
- Dropdown showing "Row X of Y"
- **Add Row button**: Icon-only (fa-plus), Bootstrap success, `btn-sm`, wrapped in `<div class="d-flex gap-1">`
- **Delete Row button**: Icon-only (fa-minus), Bootstrap danger, `btn-sm`
- All inline: `[Dropdown] [+ Add Row] [- Delete Row]`

### Data Entry Form
- Column labels (not editable, from schema)
- Input fields for each column using proper Bootstrap HTML:
  - **TextField**: Text input
  - **NumberField**: Number input
  - **Options**: Dropdown selector
  - **Font**: Font selector dropdown, **each option must have `style="font-family: {fontName}"` attribute** (exception to no-custom-CSS rule for font preview)
  - **Color**: Button with color swatch
  - **ImageData**: Dropdown of filenames from Image panel

### Card Preview
- Right column: SVG with rounded corners
- **Dimensions**: 225px × 350px
- Aspect ratio: 2.25:3.5
- **Content**: Rounded rectangle filled white (no rendered content)
- Example SVG:
```html
<svg width="225" height="350" viewBox="0 0 225 350" class="card-preview">
  <rect x="5" y="5" width="215" height="340" rx="8" ry="8" fill="white" stroke="#cccccc" stroke-width="1" />
</svg>
```

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
- Rounded corners, 2.25:3.5 aspect ratio

---

## Schema Management Panel

### Layout Structure
- **Two-column layout with tabs**:
  - Top: Tab navigation (Schema active: Template, Data, Image, Font Pool)
  - Left column: Column selector and editing form
  - Right column: List of all columns
- **Container**: RPG box

### Column Selector
- Dropdown showing available columns
- **Add Column button**: Icon-only (fa-plus), Bootstrap success, `btn-sm`, wrapped in `<div class="d-flex gap-1">`
- **Delete Column button**: Icon-only (fa-minus), Bootstrap danger, `btn-sm`
- All inline: `[Dropdown] [+ Add Column] [- Delete Column]`

### Column Editing Form (Multiple Variations)

#### TextField Variant
- **Label** with **Column ID**: Text input with auto-generated Column ID displayed as info text on same line (auto-generated: `LABEL.toUpperCase().replace(/ /g, '_')`)
- **Type**: Dropdown (shows "TextField")
- **Min Length**: Number input
- **Max Length**: Number input

#### NumberField Variant
- **Label** with **Column ID**: Text input with auto-generated Column ID displayed as info text on same line
- **Type**: Dropdown (shows "NumberField")
- **Min**: Number input
- **Max**: Number input
- **Step**: Number input

#### Options Variant
- **Label** with **Column ID**: Text input with auto-generated Column ID displayed as info text on same line
- **Type**: Dropdown (shows "Options")
- **Options**: Textarea or list for option values

#### Font Variant
- **Label** with **Column ID**: Text input with auto-generated Column ID displayed as info text on same line
- **Type**: Dropdown (shows "Font")
- (No additional type-specific properties)

#### Color Variant
- **Label** with **Column ID**: Text input with auto-generated Column ID displayed as info text on same line
- **Type**: Dropdown (shows "Color")
- **Default**: Color picker button

#### ImageData Variant
- **Label** with **Column ID**: Text input with auto-generated Column ID displayed as info text on same line
- **Type**: Dropdown (shows "ImageData")
- (No additional type-specific properties)

### Column List (Right Column)
- Bulleted list of all columns with metadata
- **Layout**: Scrollable container with `max-height: 280px`, `overflow-y: auto`
- **Selected Column Styling**: The currently selected column is highlighted with a `border-5 border-success` around its container
- Each column shows:
  - Column name (label)
    - Column ID (auto-generated identifier)
    - Type (field type name)
    - Additional type-specific metadata (min/max, options, default color, etc.)
- Example:
  - Character Name
    - CHARACTER_NAME
    - TextField
    - Min Length: 1
    - Max Length: 100
  - Experience Points
    - EXPERIENCE_POINTS
    - NumberField
    - Min: 0
    - Max: 999999
    - Step: 1
  - Character Class
    - CHARACTER_CLASS
    - Options
    - Options: Barbarian, Bard, Cleric, Fighter, Ranger, Rogue, Wizard
  - Title Font
    - TITLE_FONT
    - Font
  - Accent Color
    - ACCENT_COLOR
    - Color
    - Default: #FF5733
  - Character Portrait
    - CHARACTER_PORTRAIT
    - ImageData

All fields use proper Bootstrap form HTML from `formFieldLayoutExamples.html`.

---

## Image Management Panel

### Layout Structure
- **Full-width layout with tabs**:
  - Top: Tab navigation (Image active: Template, Data, Schema, Font Pool)
  - Top controls: Load Image and Delete Unused buttons
  - Table with image data
  - Bottom controls: Update and Cancel buttons
- **Container**: RPG box

### Top Controls
- **Alignment**: Centered
- **Load Image button**: Text + icon (fa-upload), Bootstrap primary
- **Delete Unused button**: Text + icon (fa-trash), Bootstrap danger
- Minimal spacing

### Table Structure
- Bootstrap table styling with info color headers
- **Layout**: Scrollable container with `max-height: 300px`, `overflow-y: auto`
- Columns (in order):
  1. **Thumbnail**: Small SVG preview (~40px)
  2. **Filename**: Image filename
  3. **Loaded?**: Boolean (see below)
  4. **In Data Table?**: Boolean (see below)
  5. **In Template?**: Boolean (see below)

### Boolean Column Display
For `Loaded?`, `In Data Table?`, and `In Template?` columns:
- **Yes**: Check icon (fa-check) with Bootstrap success color text
- **No**: X icon (fa-xmark) with Bootstrap danger color text

### Example: Populated Table

```
| Thumbnail | Filename | Loaded? | In Data Table? | In Template? |
|-----------|----------|---------|----------------|--------------|
| [SVG] | hero.png | ✓ | ✓ | ✓ |
| [SVG] | mage.png | ✓ | ✓ | ✗ |
| [SVG] | staff.png | ✗ | ✗ | ✗ |
```

### Example: Empty Table
- Show same table structure
- Display "No images uploaded" message in center
- Delete Unused button should be visually disabled (use btn-outline-danger)

### Bottom Controls
- **Alignment**: Right-aligned
- **Update button**: Text + icon (fa-check), Bootstrap success, small
- **Cancel button**: Text + icon (fa-times), Bootstrap secondary, small
- Minimal spacing

---

## Font Pool Panel

### Layout Structure
- **Two-column layout with tabs**:
  - Top: Tab navigation (Font Pool active: Template, Data, Schema, Image)
  - Left column (2/3 width, scrollable `max-height: 250px`): Available fonts
  - Right column (1/3 width, scrollable `max-height: 250px`): Selected fonts
- **Container**: RPG box
- **Height**: Fixed scrollable containers

### Available Fonts (Left Column)
- **Header**: "Available Fonts" text above scrollable area
- **Content**: Scrollable list of ALL web-safe fonts (10 total)
  - **All Fonts (alphabetical)**:
    - Arial
    - Comic Sans MS
    - Courier New ⭐ (selected)
    - Georgia ⭐ (selected)
    - Impact
    - Lucida Console
    - Palatino
    - Times New Roman
    - Trebuchet MS ⭐ (selected)
    - Verdana
- **Button styling**: EXACT HTML structure (required):
  ```html
  <button class="btn {appropriate button class}" style="font-family: {fontName};">
    <h3>{fontName}</h3>
    <p>The Quick Brown Fox Jumped Over The Lazy Dog.</p>
  </button>
  ```
  - **Selected fonts** (Georgia, Trebuchet MS, Courier New): Use `btn-success`
  - **Non-selected fonts**: Use `btn-info`

### Selected Fonts (Right Column)
- **Header**: "Selected Fonts" text above scrollable area
- **Content**: Scrollable list of 3 selected fonts (pre-populated)
  - Georgia
  - Trebuchet MS
  - Courier New
- **Button styling**: Same as Available Fonts (EXACT HTML structure above), using `btn-success`
- **State**: Buttons are **disabled** (visually disabled, not interactive)
- **Empty state**: Shows empty space when no fonts selected (not applicable with 3 pre-selected)

---

## Modals & Popups

### General Modal Approach
- Display as **static preview panels in their own section**
- **Layout**: Stacked vertically below the Font Pool Panel
- **Alignment**: Centered on page
- All modals use `.rpg-box` class
- Visual styling makes them appear as modals (centered, bordered)
- All static - no click handlers required
- **Vertical Spacing**: Use Bootstrap utility class `my-3` on all panel containers for consistent spacing

### Modal List

#### Create New Template Modal
- **Title**: None (or implicit from context)
- **Content**: Two button options showing orientation choices
- **Button Layout**: Side by side, centered
- **Button Styling**: 
  - Each button is an SVG card representation
  - Dimensions: 225px × 350px (portrait) or 350px × 225px (landscape)
  - Border radius: 25px
  - Background: Full white (not outline)
  - Text inside: Larger (about 25% bigger than default), darker color
  - Ratio text: "2.25" × 3.5"" for portrait, "3.5" × 2.25"" for landscape
- **HTML Structure**:
```html
<div class="d-flex gap-2 justify-content-center">
  <button class="btn btn-primary">
    <svg width="225" height="350">Portrait SVG</svg>
  </button>
  <button class="btn btn-primary">
    <svg width="350" height="225">Landscape SVG</svg>
  </button>
</div>
```

#### Alert Modal
- **Title**: Alert heading
- **Content**: Message text
- **Buttons**: Single OK button aligned right
- **Button Color**: Bootstrap primary

#### Confirm Modal
- **Title**: Confirmation heading
- **Content**: Question/confirmation text
- **Buttons**: Two buttons aligned bottom right
  - **Confirm**: Bootstrap primary
  - **Cancel**: Bootstrap secondary
- **Order**: Confirm on left, Cancel on right

#### Full Image View Modal
- **Content**: Full-resolution image, centered
- **Styling**: Minimal
  - No header
  - No close button
  - Centered with dark background around it
- **Accessibility**: Instruction text in `title` and `alt` attributes only ("Click outside or press Esc to close")
- **Interaction**: Visual only - no click handlers

---

## Form Field Requirements

### Input Field HTML
All form fields must use explicit HTML structure from `formFieldLayoutExamples.html`:
- Use Bootstrap's `.form-group`, `.form-label`, `.form-control` classes
- Inline label + input layout
- Proper semantic HTML
- Bootstrap validation classes as needed

### Colors
- Use Bootstrap color utility classes for all styling
- Exception: Color picker buttons can use `style="background-color: {color};"` with calculated foreground color

### Typography
- Google Fonts: Caudex and Modern Antiqua
- Bootstrap default sizing
- No custom font styling

---

## Implementation Checklist

### Critical Requirements
- [ ] NO `<style>` tags in HTML
- [ ] NO `style=` attributes EXCEPT: font families on dropdown options, color picker button backgrounds/foregrounds, font pool button fonts
- [ ] All modals use `.rpg-box` class
- [ ] NEVER use `.rpg-textbox` - use Bootstrap form classes instead
- [ ] Use explicit HTML from `formFieldLayoutExamples.html` for all inputs
- [ ] Font Awesome free version only (no pro icons)

### Structure
- [ ] Single HTML file: `static-ui-proto-v4.html`
- [ ] No header or footer
- [ ] Menu bar as centered RPG box (not full width, not locked to top)
- [ ] All major sections as separate RPG box panels
- [ ] Dark theme throughout

### Panel Variations
- [ ] Menu Bar section with 6 buttons (Download All, Download Template, Download Data, Print, Load Template, Load Data)
- [ ] Template Editor (Image Variant) with tabs
- [ ] Template Editor (Text Variant) with tabs
- [ ] Schema Panel for each field type (6 variations: TextField, NumberField, Options, Font, Color, ImageData) with tabs
- [ ] Data Panel with tabs
- [ ] Image Management (Populated) with tabs
- [ ] Image Management (Empty) with tabs
- [ ] Font Pool Panel with tabs

### Template Editor
- [ ] Tabs visible with correct tab active
- [ ] Layer dropdown + 6 layer control buttons inline
- [ ] Horizontal divider
- [ ] Frame properties (5 fields)
- [ ] Horizontal divider
- [ ] Variant-specific properties (Image or Text)
- [ ] Text Variant: Text field is a text area (not text input)
- [ ] Text Variant: Font Family dropdown with `style="font-family: {fontName}"` on each option
- [ ] SVG card preview on right

### Data Panel
- [ ] Tabs visible with correct tab active
- [ ] Row selector dropdown with Add/Delete buttons (icon-only, small)
- [ ] Example fields shown: Character Name (TextField), Experience Points (NumberField), Character Class (Options), Title Font (Font), Accent Color (Color), Character Portrait (ImageData)
- [ ] Font selector dropdown with `style="font-family: {fontName}"` on each option
- [ ] SVG card preview on right with 2.25:3.5 aspect ratio

### Schema Panel Variations
- [ ] 6 separate schema panel sections (one for each field type: TextField, NumberField, Options, Font, Color, ImageData)
- [ ] Each with tabs showing Schema as active
- [ ] Column selector with Add/Delete buttons (icon-only, small)
- [ ] Label field with Column ID displayed inline as info text on same line
- [ ] Type dropdown selector
- [ ] Appropriate type-specific fields for each variation (min/max/step, options list, default color, etc.)
- [ ] Column list on right showing:
  - [ ] Column name as main bullet
  - [ ] Column ID as sub-bullet
  - [ ] Field Type as sub-bullet
  - [ ] Additional metadata (min/max, options, defaults) as sub-bullets

### Image Management
- [ ] Two sections: Populated and Empty
- [ ] Each with tabs showing Image as active
- [ ] Top controls centered: "Load Image" button (text + icon, primary) and "Delete Unused" button (text + icon, danger)
- [ ] Table with 5 columns:
  - [ ] Thumbnail (small SVG preview ~40px)
  - [ ] Filename
  - [ ] Loaded? (check icon success / X icon danger)
  - [ ] In Data Table? (check icon success / X icon danger)
  - [ ] In Template? (check icon success / X icon danger)
- [ ] Boolean columns show check/X icons with colors (not Yes/No text)
- [ ] Bottom controls right-aligned: Update button (success), Cancel button (secondary)
- [ ] Empty state shows "No images uploaded" message

### Font Pool
- [ ] Tabs visible with Font Pool active
- [ ] Two-column scrollable layout (left 2/3 available, right 1/3 selected)
- [ ] "Available Fonts" header above left scrollable area
- [ ] Available fonts buttons using EXACT HTML structure (h3 and p tags)
- [ ] Available fonts buttons styled in their own fonts (only style exception)
- [ ] Available fonts colored with Bootstrap info
- [ ] "Selected Fonts" header above right scrollable area
- [ ] Selected fonts buttons using EXACT HTML structure
- [ ] Selected fonts colored with Bootstrap success
- [ ] Selected fonts buttons are disabled (not interactive)
- [ ] Empty state shows empty space when no fonts selected

### Modals
- [ ] All modals use `.rpg-box` class
- [ ] Create Template: Two rounded card buttons (225×350 and 350×225), 25px radius, white background, text 25% larger and darker, with size ratios (2.25" × 3.5" and 3.5" × 2.25")
- [ ] Alert: Title, message, single OK button right-aligned (primary)
- [ ] Confirm: Title, message, Confirm button (primary) and Cancel button (secondary) buttons bottom-right (Confirm first, then Cancel)
- [ ] Full Image View: Minimal, centered image only, no header, no close button, instruction in title/alt

### Styling
- [ ] Only Bootstrap 5.0.2 CSS + Font Awesome 6.0.0 (free version) imported
- [ ] Only `rpg.css`, `font.css`, `menu.css` as custom sheets
- [ ] NO custom `<style>` tags anywhere
- [ ] NO `style=` attributes EXCEPT:
  - [ ] Font family styling for font pool buttons
  - [ ] Font family styling in font dropdown options
  - [ ] Background/foreground colors on color picker buttons
- [ ] Dark theme consistently applied
- [ ] All colors via Bootstrap utility classes
- [ ] Card previews have 2.25:3.5 aspect ratio

---

## Notes

- The focus is on **layout and visual styling**, not functionality
- This is a **static UI prototype** — show all major panel variations on one page to demonstrate design completeness
- All interactive elements are visual only; no click handlers required
- **CRITICAL: Absolutely NO custom `<style>` tags or `style=` attributes** EXCEPT for:
  - Font families on Available/Selected fonts buttons (required for font preview)
  - Font families in font dropdown options (required for font preview)
  - Background/foreground colors on color picker buttons (required for visual representation)
- Bootstrap 5.0.2 classes handle all other styling needs (spacing, sizing, borders, colors)
- Reference [formFieldLayoutExamples.html](formFieldLayoutExamples.html) for exact input field HTML structure — match exactly
- **Input fields**: Use explicit HTML with Bootstrap form classes, NOT `.rpg-textbox`
- **Text Variant**: The Text field uses `<textarea>` (not `<input type="text">`)
- **Column ID**: Display inline with Label field using info text on same line (match formFieldLayoutExamples pattern)
- **Column List**: Show hierarchical metadata — Column name → Column ID → Type → additional properties (min/max, options, defaults)
- **Card previews**: All cards must maintain 2.25:3.5 aspect ratio (2.25" × 3.5" and 3.5" × 2.25" in Create Template modal)
- **Selected Fonts**: Buttons are disabled (visual state, not interactive)
- **Confirm Modal**: Confirm button first, Cancel second, both bottom-right
- **Modals**: Use `.rpg-box` class only
- Only import Bootstrap 5.0.2 CSS, Font Awesome 6.0.0 (free), and existing sheets (`rpg.css`, `font.css`, `menu.css`)
