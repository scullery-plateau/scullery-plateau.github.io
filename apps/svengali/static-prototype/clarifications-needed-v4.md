# Prototype Specifications v4 — Clarifications Needed

This document outlines areas of ambiguity in `prototype-specifications-v4.md` that require user input before implementation of `static-ui-proto-v4.html`.

---

## 1. Overall Page Layout

**Issue**: How should all 17 panel variations be arranged on a single page?

- **Options**:
  - Stack vertically (all panels in a single column)?
  - Use columns/grid layout?
  - Include section headers or dividers between groups?
  - Should there be spacing/margins between panels?

**Context**: The specification lists panels in order (Menu Bar → Template Editor Image → Template Editor Text → 6 Schema panels → Data Panel → 2 Image Management panels → Font Pool → 4 Modals), but doesn't specify layout arrangement.

**User Input Needed**: Preferred page layout structure and flow.
: stack vertically

---

## 2. Modal Display

**Issue**: How should the 4 modals (Create Template, Alert, Confirm, Full Image View) be presented on the page?

- **Options**:
  - Display as actual modal overlays on top of the page content?
  - Display as static preview panels in their own section?
  - Display as centered boxes without overlay?
  - Should they be hidden/visible by default, or always visible?

**Context**: Specification says "Static centered section" but doesn't clarify whether they're overlaid, in-page, or in a dedicated section.

**User Input Needed**: How modals should be displayed and positioned.
: display as static preview panelse in their own section, stacked vertically below the other panels

---

## 3. Sample Data Consistency

**Issue**: Should sample data be consistent across all panels?

- **Current State**: 
  - Data Panel example uses: Character Name (Aragorn), Experience Points (8500), Class (Ranger), Font (Georgia), Color (swatch), Portrait (hero.png)
  - Schema panels show Column List with similar fields

- **Question**: Should this same sample data be used consistently across all related panels (Template Editor, Schema, Data, Image Management)?

**Context**: Using the same data throughout would demonstrate how the panels relate to each other.

**User Input Needed**: Whether to standardize sample data across all panels, and if so, which dataset to use.
: Lets have the schema panel column list show the same fields that are specified for the data panel
---

## 4. SVG Card Preview Content

**Issue**: What should the SVG card previews actually display?

- **Options**:
  - Placeholder/dummy content only?
  - Realistic card renderings that reflect the current field values?
  - Just show a generic card outline?
  - Show sample text with the selected font/color?

**Context**: Preview should demonstrate the template/data editing, but level of detail is unclear.

**User Input Needed**: Desired content and detail level for card previews.
: just the blank card.
---

## 5. Font Dropdown Options

**Issue**: Which fonts should be available in Font Family dropdowns?

- **Options**:
  - Only Caudex and Modern Antiqua (from project)?
  - Extended set of web-safe fonts?
  - Specific list of fonts for demonstration?

**Context**: Specification says "showing font names" but doesn't specify which fonts to include.

**User Input Needed**: List of fonts to display in Font Family dropdowns.
: lets use a small (3+) subset of the web-safe fonts list. Let's have that same list be the "Selected Fonts" on the Font Panel

**Font List** (Web-Safe):

**Selected Fonts** (3 primary fonts):
- **Georgia** (serif)
- **Trebuchet MS** (sans-serif)
- **Courier New** (monospace)

**All Web-Safe Fonts** (in Font Pool Available section):
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

**Font Appearance Locations**:
- **Template Editor (Text Variant) → Font Family dropdown**: Only the 3 selected fonts
- **Data Panel → Font field dropdown**: Only the 3 selected fonts
- **Font Pool → Available Fonts section**: ALL web-safe fonts listed, with selected 3 visually marked/highlighted
- **Font Pool → Selected Fonts section**: Only the 3 selected fonts (pre-populated)

---

## 6. Color Picker Button Display

**Issue**: How should color picker buttons visually represent colors?

- **Options**:
  - Show colored square swatch inline with button text?
  - Use colored background on entire button?
  - Show swatch and separate text label?
  - What default colors to use?

**Context**: The spec mentions "button with color swatch" but doesn't specify visual implementation.

**User Input Needed**: Visual design for color picker buttons and default color values.

**Implementation**:
- Use three default hex colors representing variations of purple, orange, and chocolate brown:
  - **Purple**: `#7B68EE` (Medium Slate Blue)
  - **Orange**: `#FF8C00` (Dark Orange)
  - **Brown**: `#8B4513` (Saddle Brown)

- For each color button, use the format:
  ```html
  <button class="btn btn-secondary" style="background-color: {hex}; color: {foreground};">{fieldName}</button>
  ```

- Calculate foreground color using `getForegroundColor()` from `common/colors.js`:
  ```javascript
  import { getForegroundColor } from '../common/colors.js';
  const foreground = getForegroundColor(hexColor); // returns '#FFFFFF' or '#000000' for contrast
  ```

- Examples for each color:
  - Purple (`#7B68EE`) → foreground: `#FFFFFF`
  - Orange (`#FF8C00`) → foreground: `#000000` or `#FFFFFF` (depending on contrast)
  - Brown (`#8B4513`) → foreground: `#FFFFFF`

**Color Button Assignment Table**:

| Button | Location | Background Color | Foreground |
|--------|----------|------------------|-----------|
| Background Color | Template Editor (Image Variant) | `#7B68EE` (Purple) | `#FFFFFF` |
| Frame Color | Template Editor (Image Variant) | `#8B4513` (Brown) | `#FFFFFF` |
| Font Color | Template Editor (Text Variant) | `#FF8C00` (Orange) | `#FFFFFF` |
| Background Color | Template Editor (Text Variant) | `#7B68EE` (Purple) | `#FFFFFF` |
| Frame Color | Template Editor (Text Variant) | `#8B4513` (Brown) | `#FFFFFF` |
| Accent Color | Data Panel | `#FF8C00` (Orange) | `#FFFFFF` |
| Default | Schema Panel (Color Variant) | `#7B68EE` (Purple) | `#FFFFFF` |

---

## 7. Scrolling Behavior

**Issue**: What should be the scroll heights/limits for scrollable areas?

- **Scrollable Areas**:
  - Image Management table (number of visible rows before scroll?)
  - Font Pool columns (Available Fonts and Selected Fonts — visible height before scroll?)
  - Column List in Schema panels (visible items before scroll?)

- **Question**: Fixed heights? Dynamic? Minimum/maximum visible items?

**Context**: Specification indicates these areas are "scrollable" but doesn't specify dimensions.

**User Input Needed**: Scroll behavior and sizing for each scrollable area.
: The rpg-box panel should remain fully visible on screen, so the scrollable areas should facilitate that. Can you calculate an appropriate fixed max-height for each section?

**Calculated Max-Heights** (Fixed):

| Scrollable Area | Max-Height | Rationale |
|---|---|---|
| Image Management Table | `300px` | Displays ~7-8 rows before scroll (allows full visibility with controls) |
| Font Pool (Available Fonts) | `250px` | Displays 6-8 font buttons before scroll |
| Font Pool (Selected Fonts) | `250px` | Displays 6-8 font buttons before scroll |
| Column List (Schema Panels) | `280px` | Displays 6-8 columns with metadata before scroll |

Implementation: Use CSS class or inline style on scrollable containers:
```css
max-height: 300px; /* adjust per area */
overflow-y: auto;
overflow-x: hidden;
```
---

## 8. Empty vs. Populated States

**Issue**: Which panels should demonstrate both empty and populated states?

- **Current Specification**:
  - Image Management: YES (two separate sections)
  
- **Question**: Should other panels also show empty states?
  - Data Panel with no rows?
  - Schema Panel with no columns?
  - Font Pool with no selected fonts?

**Context**: Showing empty states helps users understand UI behavior when no data is present.

**User Input Needed**: Which panels should include empty state variations.
: for the scenarios in question, no, we don't need empty state variations at this time
---

## 9. Button Sizing & Spacing

**Issue**: What button sizes should be used throughout?

- **Options**:
  - Bootstrap's `btn-sm` (small) for all icon buttons?
  - Regular size for some buttons?
  - Different sizes for different button types?

- **Spacing**: How much spacing between inline buttons (Layer Controls, Row Selector buttons, Column Selector buttons)?

**Context**: Specification uses "small" for some but "regular" sizing isn't explicitly defined.

**User Input Needed**: Button size specifications and spacing guidelines.
: lets use `btn-sm` for only in-line icon buttons (the +/- for row and column), but for the rest lets stick to normal size

**Button Sizing & Spacing Guidelines**:

| Button Type | Size | Spacing | Example |
|---|---|---|---|
| Add/Delete Row (Data Panel) | `btn-sm` | `gap-1` between buttons | `[+ Add Row] [- Delete Row]` |
| Add/Delete Column (Schema Panel) | `btn-sm` | `gap-1` between buttons | `[+ Add Column] [- Delete Column]` |
| Layer Controls (Template Editor) | `btn` (regular) | `gap-2` between buttons | `[fa-plus] [fa-minus] [fa-angles-left] [fa-chevron-left] [fa-chevron-right] [fa-angles-right]` |
| Menu Bar Buttons | `btn` (regular) | No gap (buttons touch) | 6 icon-only buttons inline |
| Color Picker Buttons | `btn` (regular) | Standard Bootstrap padding | Single button |
| Form Action Buttons | `btn` (regular) | `gap-2` or right-aligned | Update, Cancel buttons |

**Implementation**:
- Use Bootstrap's gap utility classes: `gap-1` for `0.25rem` spacing, `gap-2` for `0.5rem` spacing
- Wrap inline button groups in `<div class="d-flex gap-1">` for consistent spacing
- For no spacing, buttons can be placed directly adjacent or use `gap-0`
---

## 10. Column List in Schema Panels

**Issue**: How should the Column List on the right side of Schema panels behave?

- **Options**:
  - Show ALL columns in the schema?
  - Show only the currently selected column?
  - Show all with the selected one highlighted?

- **Editability**: Should the list be read-only, or should users be able to interact with it?

**Context**: Specification says "Column list on right" but doesn't clarify scope or interactivity.

**User Input Needed**: Scope of Column List display and whether it should be interactive.
: Column List should show all columns in the schema. It should be scrollable so it doesn't overflow the screen, and the selected column should be highlighted with a size 5 success border
---

---

## 11. Tab Visual Styling

**Issue**: How should active vs. inactive tabs be visually distinguished?

**User Input**: 
- **Active tabs**: Dark text on light background
- **Inactive tabs**: Light text on dark background

**Implementation**:
```html
<!-- Active Tab (currently visible panel) -->
<button class="nav-link active" style="color: #000000; background-color: #f8f9fa;">Template</button>

<!-- Inactive Tab (not currently visible) -->
<button class="nav-link" style="color: #ffffff; background-color: #343a40;">Data</button>
```

Use Bootstrap's `.nav` and `.nav-link` classes combined with inline styles for the color scheme above.

---

## 12. SVG Card Preview Dimensions

**Issue**: What pixel dimensions should the card preview SVG use?

**User Input**: `225px × 350px`

**Implementation**:
```html
<svg width="225" height="350" viewBox="0 0 225 350" class="card-preview">
  <!-- Content inside -->
</svg>
```

This maintains the 2.25:3.5 aspect ratio at the specified size.

---

## 13. Blank Card SVG Content

**Issue**: What should the SVG card preview actually display?

**User Input**: Just the rounded rectangle filled white

**Implementation**:
```html
<svg width="225" height="350" viewBox="0 0 225 350" class="card-preview">
  <rect x="5" y="5" width="215" height="340" rx="8" ry="8" fill="white" stroke="#cccccc" stroke-width="1" />
</svg>
```

No content rendering or text—just an outline and white fill to show the card boundary.

---

## 14. Create Template Modal Layout

**Issue**: How should buttons in the Create Template modal be arranged?

**User Input**: Side by side

**Implementation**:
```html
<div class="d-flex gap-2 justify-content-center">
  <button class="btn btn-primary">Portrait</button>
  <button class="btn btn-secondary">Landscape</button>
</div>
```

Buttons displayed horizontally with consistent spacing.

---

## 15. Sample Image Filenames

**Issue**: Should specific filenames be used in the Image Management section?

**User Input**: Current filenames (hero.png, mage.png, staff.png) are fine

**Implementation**: Keep as specified in the prototype.

---

## 16. Panel Spacing & Margins

**Issue**: What vertical spacing should exist between stacked panels?

**User Input**: `my-3` is fine

**Implementation**: Use Bootstrap margin utility class `my-3` on each panel container to maintain consistent vertical spacing between stacked panels throughout the page.

---

## 17. Menu Bar Button Spacing

**Issue**: How should Menu Bar buttons be spaced?

**User Input**: Use standard bootstrap padding between buttons

**Implementation**: Buttons are placed directly adjacent to each other, relying on Bootstrap's standard button padding for spacing. Do NOT use `gap-0` or a gap wrapper. Each button naturally has padding, creating space between them.

---

## Summary

**ALL 17 AREAS COMPLETE** ✅

1. ✅ Overall page layout structure
2. ✅ Modal display/positioning
3. ✅ Sample data consistency
4. ✅ Card preview content detail level
5. ✅ Font dropdown options
6. ✅ Color picker button design
7. ✅ Scrollable area dimensions
8. ✅ Empty state variations
9. ✅ Button sizing & spacing
10. ✅ Column List scope & interactivity
11. ✅ Tab visual styling
12. ✅ SVG card preview dimensions
13. ✅ Blank card SVG content
14. ✅ Create Template modal layout
15. ✅ Sample image filenames
16. ✅ Panel spacing & margins
17. ✅ Menu Bar button spacing

**STATUS**: Specification `prototype-specifications-v4.md` is now **FULLY SPECIFIED AND READY FOR HTML IMPLEMENTATION**. All ambiguities have been resolved. Proceed with creating `static-ui-proto-v4.html`.
