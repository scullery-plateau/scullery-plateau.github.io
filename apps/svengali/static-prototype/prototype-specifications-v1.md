# Svengali Static UI Prototype Specifications

## Overview & Purpose

This document defines the specification for a single-page static UI prototype of Svengali that showcases the main interface layout and all modals/popups. This is **not** a functional demo or complete app prototype—it is strictly for establishing layouts and styling of the UI before implementation.

### Key Principles
- Build directly from `plan-v6` and `ui-design` documentation
- Conform to rules and guidelines in `generalStyleOverview.md`
- Focus on integration with other Scullery Plateau apps
- **Static only**: No functional tabs, modals, or interactions required
- Show all UI states as separate page sections for clarity

### Technology Stack
- **Bootstrap 5.0.2** CSS only (no JavaScript)
- **Google Fonts**: Caudex and Modern Antiqua
- **Font Awesome 6.0.0** for icons
- **Project stylesheets**: `style/rpg.css`, `style/font.css`, `style/menu.css`
- **Minimal custom CSS**: Only as fallback; styling should come from Bootstrap and project sheets
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
- Single full-width content area:
  - **Top menu bar**: Icon-only menu buttons in an inline horizontal bar
  - **Tab navigation**: Below menu bar, at the top of main panel
  - **Tab content**: Full-width panels below tabs

---

## Menu Section

### Menu Buttons
- **Style**: Icon-only buttons, NO text labels
- **Icon source**: Font Awesome icons
- **Accessibility**: All text as `title` and `alt` attributes only
- **Layout**: Inline (horizontal), not vertical
- **Position**: Top of page, above the main frame

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
- **Location**: Top of main content area (standard tab placement)
- **Visual distinction**: Tabs must be clearly distinguishable from the rest of the page so users know where to click
- **Static prototype approach**: Create separate page sections showing each panel with its respective tab as "active" (visual focus)
- **Template panel variations**: Show two different versions:
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
- Form inputs should be **inline with labels** (label and input on same line)
- No separate section headers for layer controls

### Card Preview
- **Background**: No background color on the preview area itself
- **Card background**: First layer of SVG (rounded white rectangle)
- **Format**: SVG (not HTML)
- **Styling**: Rounded corners
- **Aspect ratio**: 3.5:5 (standard card size)

### Form Controls
- Layer controls: No section header
- Color buttons: Follow other Scullery Plateau apps pattern
  - Button name becomes the text inside the button
  - Not separate label + color indicator
- Input fields: All form controls flush-aligned with their labels

---

## Data Panel

### Layout & Structure
- **Row controls**: No section header for "form field"
- **Card preview**: No section header
- **Row management buttons**: 
  - Use Font Awesome plus/minus icons only (no "+" or "−" text characters)
  - Place inline with the current row they control
  - `title` and `alt` text: "Add Row" and "Delete Row"

### Form Display
- Scrollable area for data entry
- Clean, compact layout

---

## Schema Management Panel

### Layout & Structure
- **Type Properties**: No section header required
- **All Columns section**: Optional visual grouping with dark gray background
  - Column blocks: Single solid color (no left border)
  - Remove left border styling: Not part of Scullery Plateau aesthetic

### Column ID Field
- Not displayed as an editable field (it's generated)
- Show as info text underneath the label field instead

### Column Management Buttons
- **Add/Delete buttons**: Icon-only (same as data panel)
- **Placement**: After the select column dropdown
- **Icons**: Font Awesome plus/minus
- **Accessibility**: `title` and `alt` text only

### Column Display
- Each column as a solid-color block
- Dark gray background for the section
- Clean list presentation

---

## Image Management Panel

### Table Structure
- **Background color**: Bootstrap info color (not dark gray)
- **New column**: Thumbnail preview
  - Size: Roughly same as delete button
  - Interactive: Clickable to view full image in a modal

### Columns
- Thumbnail
- Image name/ID
- Metadata (as applicable)
- Delete button

### Full Image Modal
- Triggered by clicking thumbnail
- Shows full-resolution image
- Modal overlay with centered content

---

## Font Pool Panel

### Font Selection Styling
- **Selected fonts**: Bootstrap success color (full button background)
- **Unselected fonts**: Bootstrap info color (full button background)
- **Remove borders**: No border-based highlighting
- **Approach**: Color entire button background, not just borders

### Font Display
- Font preview area showing selected font
- List of available fonts with color-coded selection state

---

## Modals & Popups

### General Modal Approach
- Display as **centered static frames** on the page, not as interactive modals
- Make them visually appear as modals (centered, bordered, styled)
- **Do not make them functional** for the static prototype
- Show all modal states/variations on the page

### Modal List

#### 1. Create New Template (Orientation Selection)
- **Buttons**: Side by side (not stacked vertically)
- **Button content**: 
  - SVG of blank card for each orientation (part of the button)
  - Portrait orientation
  - Landscape orientation
- **Visual**: Show both orientations clearly

#### 2. Alert Modal
- Single text message
- OK button

#### 3. Confirm Modal
- Text prompt/question
- Cancel and OK buttons

#### 4. Download Options Modal
- Radio buttons for download format:
  - All (Template + Schema + Data)
  - Template (JSON)
  - Data (CSV)
- Cancel and Download buttons

#### 5. File Loader Modal
- File input field
- File type selection (if applicable)
- Cancel and Load buttons

#### 6. Print Preview Modal
- Preview of cards to be printed
- Shows count of selected cards
- Print and Cancel buttons

#### 7. Full Image View Modal
- Triggered from image thumbnail
- Shows full-resolution image
- Close button

---

## Styling & Integration

### Color Scheme
- Follow `generalStyleOverview.md` guidelines
- Dark theme throughout
- Bootstrap color classes only:
  - `.btn-primary` — Primary actions and focus states
  - `.btn-success` — Selected state for fonts
  - `.btn-info` — Unselected fonts, image table background
  - `.btn-secondary` / `.btn-danger` as needed
- Use Bootstrap background utilities (`.bg-dark`, `.bg-secondary`, etc.)
- Use Bootstrap text utilities (`.text-light`, `.text-muted`, etc.)
- No custom hex color values—all styling via Bootstrap classes and utilities

### Typography
- Google Fonts: Caudex and Modern Antiqua
- Bootstrap default sizing and weights
- No custom font styling needed

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
- [ ] Single HTML file: `static-ui-proto-v1.html`
- [ ] No header or footer
- [ ] Full-width single-column layout
- [ ] Top menu bar with icon-only buttons
- [ ] Tab navigation below menu bar
- [ ] Dark theme applied

### Menu
- [ ] Icon-only buttons
- [ ] Inline horizontal layout
- [ ] All accessibility attributes (`title`, `alt`)

### Tabs & Navigation
- [ ] Five tabs visible
- [ ] Clear visual distinction from rest of page
- [ ] Separate sections for each tab's active state
- [ ] Two template editor variations shown

### Content Panels
- [ ] Template editor with inline form controls
- [ ] SVG card preview with rounded corners
- [ ] Data panel with inline row controls
- [ ] Schema panel with proper styling and no left borders
- [ ] Image panel with thumbnails and info color table
- [ ] Font pool with color-coded button backgrounds

### Modals
- [ ] All modals displayed as static centered sections
- [ ] Create new template with side-by-side buttons and card SVGs
- [ ] Alert, confirm, file download, file loader, print preview modals
- [ ] Full image view modal

### Styling
- [ ] Only Bootstrap CSS + Font Awesome imported
- [ ] Only `rpg.css`, `font.css`, `menu.css` as custom project sheets
- [ ] No custom CSS whatsoever
- [ ] No JavaScript at all
- [ ] Dark theme consistently applied
- [ ] All colors via Bootstrap color classes only (no hex values)

---

## Notes

- The focus is on **layout and visual styling**, not functionality
- Showing multiple tab states on one page helps visualize the UI design
- All interactive elements are visual only; no click handlers required
- Bootstrap components should handle all styling needs
- If custom CSS is needed, the design should be reconsidered per Scullery Plateau guidelines
