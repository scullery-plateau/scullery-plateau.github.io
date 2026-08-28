# Svengali Static UI Prototype Specifications v2

## Overview & Purpose

This document defines the specification for a single-page static UI prototype of Svengali that showcases the main interface layout and all modals/popups. This is **not** a functional demo or complete app prototype—it is strictly for establishing layouts and styling of the UI before implementation.

### Key Principles
- Build directly from `plan-v6` and `ui-design` documentation
- Conform to rules and guidelines in `generalStyleOverview.md`
- Focus on integration with other Scullery Plateau apps
- **Static only**: No functional tabs, modals, or interactions required
- Show all UI states as separate page sections for clarity
- Reference `static-ui-proto.html` original design where v1 deviated

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
- Single full-width content area with padding

### Menu Bar Section
- **Container**: RPG box panel
- **Position**: Top of page, centered, not locked to top
- **Layout**: Inline (horizontal) icon-only buttons
- **Spacing**: Consistent padding/margins via Bootstrap utilities

### Main Tab Panel
- **Container**: Single RPG box panel
- **Tab navigation**: At the top of the RPG box, standard Bootstrap tabs
- **Tab content**: Full-width sections below tab navigation
- **Approach**: Show all tab states visible on page (separate instances for each tab state)

---

## Menu Section

### Menu Buttons
- **Style**: Icon-only buttons, NO text labels
- **Icon source**: Font Awesome icons
- **Accessibility**: All text as `title` and `alt` attributes only
- **Layout**: Inline (horizontal), centered
- **Container**: RPG box with padding

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

## Tab Navigation & Content

### Tab Styling & Display
- **Location**: Top of RPG box panel
- **Visual distinction**: Clear Bootstrap tab styling
- **Static prototype approach**: Show each tab state as a separate instance on the page (each RPG box shows one tab active)
- **Template panel variations**: Show two different instances:
  1. Template editor with image properties visible
  2. Template editor with text properties visible

### Tab List
1. **Template** — Template editor and preview
2. **Data** — Data management and display
3. **Schema** — Schema/column definitions
4. **Image** — Image management and thumbnails
5. **Font Pool** — Font selection and styling

---

## Template Editor Panel

### Layout
- **Two-column layout**:
  - Left column: Form controls and layer dropdown
  - Right column: SVG card preview
- Form inputs: Inline with labels on same line
- No section dividers between different property groups

### Card Preview
- **Background**: No background color on the preview area itself
- **Card background**: First layer of SVG (rounded white rectangle)
- **Format**: SVG (not HTML)
- **Styling**: Rounded corners
- **Aspect ratio**: 3.5:5 (standard card size)

### Form Controls

#### Layer Dropdown
- Single dropdown (not expandable list)
- Shows current layer
- Can have many layers (may exceed 10+)

#### Frame Properties
- Frame-level settings (as defined in plan-v6)
- Display directly in form

#### Layer Controls
- Layer-specific controls (as defined in plan-v6)
- Display directly in form without section headers
- Color buttons: Follow other Scullery Plateau apps pattern
  - Button name becomes the text inside the button
  - Not separate label + color indicator

---

## Data Panel

### Layout & Structure
- **Two-column layout**:
  - Left column: Data form/table
  - Right column: Card preview
- No section headers for row management buttons
- Row controls integrated inline with data rows

### Data Form Display
- Scrollable area for data entry
- Table or form layout (per plan-v6)
- Row management buttons (plus/minus):
  - Use Font Awesome plus/minus icons only
  - Place inline with the row they control
  - `title` and `alt` text: "Add Row" and "Delete Row"

### Card Preview
- Same as Template Editor: SVG with rounded corners
- Shows rendered card based on current data row

---

## Schema Management Panel

### Layout & Structure
- **Two-column layout**:
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
- Label field
- Type field
- Column ID: Info text below Label (generated, not editable)
- Additional properties as per plan-v6

### Column List Display
- Right column: Bulleted list of all columns
- Each entry shows column name and type
- Clean, compact presentation
- No styled blocks or borders

---

## Image Management Panel

### Table Structure
- Column headers: Thumbnail, Image Name/ID, Delete
- Standard Bootstrap table styling with info color (per specifications)
- Rows for each uploaded image

### Columns
- **Thumbnail**: 
  - Small icon or placeholder (roughly 40px)
  - Clickable to view full image in modal
- **Image name/ID**: Filename or identifier
- **Delete button**: Trash icon, triggers confirmation

### Full Image Modal
- Triggered by clicking thumbnail
- Minimal styling: Just the image in a centered overlay
- Close on: Click outside, `Esc` key, or close interaction
- No header or close button UI
- Shows full-resolution image

---

## Font Pool Panel

### Layout & Structure
- **Two-column layout**:
  - Left column: Selected font preview area
  - Right column: List of available font buttons
- Font buttons display: Each button styled in its own font (local custom CSS exception)

### Font Preview Area
- Left column: Shows selected font with sample text
- Updates when a font is selected

### Font Buttons
- Each button styled in the font it represents
- Button background colors:
  - **Selected**: Bootstrap success color
  - **Unselected**: Bootstrap info color
- Preview text: Displayed within each button
- Fonts include: Caudex, Modern Antiqua, and others as applicable

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
  - Text styling: Ensure visibility (not too dark)
- **Buttons**: Side by side (not stacked)
- **Button content**: 
  - Large SVG card outline (white fill, not outline only) for each orientation
  - Cards should be approximately twice the size of v1
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

#### Removed/Not Included
- **Download Options Modal**: Removed (not needed for static prototype)
- **File Loader Modal**: Removed (standard OS file dialog will handle this)
- **Print Preview Modal**: Removed (print functionality opens separate tab)

#### 4. Full Image View Modal
- Minimal display: Just the image
- No header
- No close button UI
- Centered on page
- Close on: Click outside, `Esc` key press
- Full-resolution image display

---

## Styling & Integration

### Color Scheme
- Follow `generalStyleOverview.md` guidelines
- Dark theme throughout
- Bootstrap color classes only:
  - `.btn-primary` — Primary actions and focus states
  - `.btn-success` — Selected fonts, Add buttons
  - `.btn-info` — Unselected fonts, image table background
  - `.btn-danger` — Delete buttons
  - `.btn-secondary` — Cancel buttons
- Use Bootstrap background utilities (`.bg-dark`, `.bg-secondary`, etc.)
- Use Bootstrap text utilities (`.text-light`, `.text-muted`, etc.)
- No custom hex color values—all styling via Bootstrap classes and utilities

### Typography
- Google Fonts: Caudex and Modern Antiqua
- Bootstrap default sizing and weights
- **Exception**: Font Pool buttons display each font in its own typeface via local custom CSS

### Spacing & Layout
- Bootstrap grid system (`.container-fluid`, `.row`, `.col-*`)
- Consistent padding/margins using Bootstrap utilities
- `.rpg-box` class for major content sections (from `rpg.css`)

### Forms
- Use `.rpg-textbox` style from `rpg.css`
- Dark backgrounds with subtle borders on focus
- Toggle switches where applicable
- Consistent input appearance

### Icons
- Font Awesome 6.0.0
- All interactive icons have `title` and `alt` attributes
- Icon-only buttons for compact interface

---

## Implementation Checklist

### Structure
- [ ] Single HTML file: `static-ui-proto-v2.html`
- [ ] No header or footer
- [ ] Full-width single-column layout
- [ ] Menu bar in RPG box, centered (not locked to top)
- [ ] Main tab panel in RPG box
- [ ] Tab navigation at top of RPG box
- [ ] Dark theme applied

### Menu
- [ ] Icon-only buttons
- [ ] Inline horizontal layout, centered
- [ ] All accessibility attributes (`title`, `alt`)
- [ ] Inside RPG box container

### Tabs & Navigation
- [ ] Five tabs visible within RPG box
- [ ] Clear visual distinction from rest of page
- [ ] Separate sections for each tab's active state
- [ ] Two template editor variations shown
- [ ] All tabs with tab navigation visible

### Content Panels
- [ ] Template editor with two-column layout
- [ ] SVG card preview with rounded corners
- [ ] Frame properties displayed
- [ ] Layer dropdown (not expandable list)
- [ ] Layer controls without section headers
- [ ] Data panel with two-column layout (form + card preview)
- [ ] Schema panel with two-column layout (form + column list)
- [ ] Column list as bulleted list (no styled blocks)
- [ ] Column ID as info text under Label
- [ ] Add button (success), Delete button (danger)
- [ ] Image panel with proper columns (thumbnail, name, delete)
- [ ] Thumbnail clickable for full image view
- [ ] Font pool with two-column layout (preview + buttons)
- [ ] Font buttons styled in their respective fonts

### Modals
- [ ] All modals displayed as static centered sections
- [ ] Create new template with side-by-side buttons and white card SVGs (2x size)
- [ ] Alert and confirm modals with right-aligned buttons
- [ ] Full image view modal (minimal, no header/close button)
- [ ] No download options, file loader, or print preview modals
- [ ] Modal text readable and visible

### Styling
- [ ] Only Bootstrap CSS + Font Awesome imported
- [ ] Only `rpg.css`, `font.css`, `menu.css` as custom project sheets
- [ ] Minimal custom CSS for font pool buttons only
- [ ] No JavaScript at all
- [ ] Dark theme consistently applied
- [ ] All colors via Bootstrap color classes only (no hex values)

---

## Notes

- The focus is on **layout and visual styling**, not functionality
- Showing multiple tab states on one page helps visualize the UI design
- All interactive elements are visual only; no click handlers required
- Bootstrap components should handle all styling needs
- Font Pool panel is the **only** exception to "no custom CSS" rule for displaying fonts in their own typefaces
- Reference `static-ui-proto.html` for design patterns where v1 differed from plan-v6
- Two-column layouts use Bootstrap grid system for responsiveness
