# General Style Overview — Apps Using Header & Footer

## Scope
This review covers the styling patterns used across all applications referenced in the top-level `index.html` that incorporate both `header.js` and `footer.js` components:

1. **Spritely** — Pixel Art Creator
2. **Texture Pack Harvester** — Tile Extraction Tool
3. **Spritely Harvester** — File Format Converter
4. **Runyon** — Dice Roller
5. **Cobblestone** — Map Builder
6. **Grid Cropper** — Map Grid Applicator
7. **Purview** — Player View Map
8. **Outfitter** — Character Art Creator
9. **Minifier** — Paper Minis
10. **Tokenizer** — Image Framing Tool

---

## Commonalities & Shared Architecture

### HTML Structure
All apps follow a consistent HTML skeleton:
- **Bootstrap 5.0.2** for responsive grid layout and component styling
- **Google Fonts**: Caudex and Modern Antiqua loaded for typography
- **Dark Theme**: `<body class="bg-dark text-light">` applied universally
- **React 18** with Babel transpilation for component rendering
- **Namespace Management**: External script from `gizmo-atheneum` handles module imports

### CSS Inheritance Chain
All apps load this consistent stylesheet stack:
1. **`style/rpg.css`** — Core RPG aesthetic
   - Custom form styling (`.rpg-textbox`): dark backgrounds, subtle borders on focus
   - Toggle switches (`.rpg-toggle`): accessibility-focused
   - Form validation states for disabled/readonly inputs
   - Removes browser default input appearances for consistency

2. **`style/font.css`** — Typography settings (not reviewed in detail)

3. **`style/menu.css`** — Dropdown menu styling
   - Position-relative dropdown anchors
   - Absolute positioning for dropdowns and submenus
   - Blue hover state for menu items (`.dropdown-item:hover`)
   - Light text color (`#f8f9fa`) for dark backgrounds

4. **`style/custom.css`** — (Not in all apps; additional customization)

5. **App-specific `./style.css`** — Minimal per-app overrides

### JavaScript Architecture
All apps use a shared namespace system with common modules:
- **`header.js`** — Renders navbar with app title and menu
  - className: `"navbar d-flex justify-content-start"`
  - Displays branding link and menu component
  - Linked back to root `../../index.html`

- **`footer.js`** — Renders footer with copyright and GitHub link
  - Fixed content: Copyright + GitHub repository link
  - Rendered into `<footer id="footer">` element
  - Year dynamically updates via JavaScript

- **Shared utilities**: `colors.js`, `dialog.js`, `editMode.js`, `fileDownload.js`, `fileLoader.js`, `menu.js`, `utilities.js`

- **Optional utilities** (app-specific): `colorPicker.js`, `gridHighlighter.js`, `gridUtil.js`, `print.js`, etc.

### DOM Layout Pattern
All apps use the same rendering pattern:
```html
<body class="bg-dark text-light">
  <div id="[appName]" class="container-fluid"></div>
  <footer id="footer" class="text-center"></footer>
</body>
```

React components mount to the main app container and footer separately, allowing independent rendering.

---

## App-Specific CSS Observations

### Minimal CSS Footprint
Most apps have very lightweight or empty `style.css` files, relying on:
- Bootstrap utilities for layout
- Global RPG aesthetic from `rpg.css`
- Component-level inline styles via React

### Notable App Customizations

**Spritely & Spritely Harvester** (~25 lines each)
- `.palette-color` & `.selected-color`: Border styling for color selection UI
- `.color-picker` form inputs: Compact styling (2px padding, center alignment)
- `.menu-root`: Horizontal margin (1rem) for top-level menu spacing
- Canvas SVG positioning: Absolute overlay for drawing surface

**Cobblestone** (~15 lines)
- Tile button sizing: Fixed 60px × 60px buttons with `!important`
- Tile state indicators: Green (active), red (inactive), white (selected) borders

**Outfitter** (~20 lines)
- Character art flex layout: 2% top/bottom margins for flex items
- Input group margins: Consistent 2% spacing
- Flipped button styling: Purple background + yellow text with transform scale
- Custom spinner sizing: 4em × 4em

**Minifier & Tokenizer** (~10 lines each)
- Thumbnail frame styling: Consistent sizing with centered background-image
  - Minifier: 6em × 6em frames
  - Tokenizer: 11em × 11em frames
- Disabled size picker links: Darkgrey text to indicate unavailability

**Purview** (~3 lines)
- `.card-header-tabs .active`: Blue background (`#06209c`) for active tabs

**Grid Cropper** (~3 lines)
- Preview image constraints: Max 23em × 23em with auto sizing

**Runyon** (~2 lines)
- Table cell alignment: Center text, vertically middle all cells

**Texture Pack Harvester**
- Empty `style.css` — uses only shared styles

---

## React Component Styling Patterns

### Modal Dialog Initialization
Every app initializes all dialog modals with a consistent signature:
```javascript
Dialog.initializeModals(["alert"], { class: 'rpg-box text-light w-75' });
this.modals = Dialog.factory({
  fileDownload: {
    componentClass: FileDownload,
    attrs: { class: 'rpg-box text-light w-75' },  // Consistent across all apps
    onClose: () => {}
  },
  // ... other modals follow the same pattern
});
```
This ensures all modal dialogs have consistent styling without per-app customization.

### Header & Navigation Structure
All root components render the Header first:
```javascript
render() {
  return (
    <>
      <Header menuItems={this.menuItems} appTitle={'Spritely'} />
      {/* App content follows */}
    </>
  );
}
```
The Header component is passed:
- `menuItems`: Array of menu configuration objects
- `appTitle`: String identifying the current app (rendered in navbar)

### Button Styling Conventions
Buttons consistently use Bootstrap classes for semantic meaning:
- **Primary actions**: `btn btn-primary text-light` (File, Transform, interaction buttons)
- **Success actions**: `btn btn-success` (Add, Publish, Apply buttons)
- **Danger actions**: `btn btn-danger` (Delete, Remove buttons)
- **Info/Toggle states**: `btn btn-info` (Held/Selected states in Runyon)
- **Outline/Secondary**: `btn btn-outline-light` (Transparent, Opaque toggles in Spritely)
- **Secondary**: `btn btn-secondary` (Mode switches, back buttons in Spritely)

All buttons include icon elements using FontAwesome:
```javascript
<button className="btn btn-primary text-light" onClick={...}>
  <i className="far fa-folder-open"></i>
</button>
```

### Layout Architecture in Components
All root components use a consistent layout pattern:

1. **Header section** (automatic via Header component)
2. **Main content** wrapped in `container-fluid` (implicit from HTML layout)
3. **Control panels** in Bootstrap grid (`row justify-content-center`)
   - Typically `col-3`, `col-4`, or `col-5` for side panels
   - Wrapped in `.rpg-box` with `m-3` (margin) spacing
4. **Canvas/main work area** (second column if applicable)
5. **Gallery/result section** at bottom
   - Uses `gallery m-3 d-flex flex-wrap justify-content-around` classes

Example structure:
```javascript
<div className="row justify-content-center">
  <div className="col-3">
    <div className="rpg-box m-3">
      {/* Control buttons here */}
    </div>
  </div>
  <div className="col-9">
    {/* Main canvas/content here */}
  </div>
</div>
```

### Flexbox Pattern
All components extensively use Bootstrap flexbox utilities:
- `d-flex` — Enable flexbox
- `justify-content-center` — Center items horizontally
- `justify-content-around` — Distribute with space
- `flex-column` — Stack vertically
- `flex-wrap` — Allow wrapping
- `align-self-center` — Center individual items
- `my-1`, `ms-2` — Vertical/horizontal spacing

Example from Spritely:
```javascript
<div className="d-flex justify-content-around my-1">
  <button className="btn btn-primary text-light">...</button>
  <button className="btn btn-primary text-light">...</button>
</div>
```

### Form Control Styling
Input elements consistently use `.form-control` with inline sizing:
```javascript
<input
  className="form-control text-center"
  style={{ width: '4em' }}
  type="number"
  value={value}
  onChange={(e) => {...}}
/>
<select className="form-control text-center" style={{ width:'4em' }} value={...}>
  {/* options */}
</select>
```

### Content Container Styling
All major content blocks wrapped in `.rpg-box` for consistency:
```javascript
<div className="rpg-box m-3">
  {/* Content with dark background and custom border styling */}
</div>
```

### Gallery/Thumbnail Pattern
Multi-item displays use consistent structure (Minifier, Tokenizer):
```javascript
<div className="gallery m-3 d-flex flex-wrap justify-content-around">
  {items.map((item, index) => (
    <div className="thumbnail rpg-box d-flex flex-column">
      <span className="align-self-center">{item.name}</span>
      <div className="frame align-self-center" 
           style={{ backgroundImage: `url(${item.url})` }}>
      </div>
    </div>
  ))}
</div>
```

### Conditional Rendering
Apps use inline conditional rendering for state-based UI changes:
```javascript
{this.state.minis.length > 0 && (
  <div>Publish button only shows when items exist</div>
)}
{this.state.hilo && (
  <th>Display only when toggle is on</th>
)}
{held ? 'btn-info' : 'btn-outline-light'}  // Dynamic styling based on state
```

---

## Global UI/UX Patterns

### Color Scheme
- **Background**: Dark (Bootstrap `bg-dark`)
- **Text**: Light (`text-light`)
- **Accents**: Blue (menu hover state `#06209c`, dropdown hover)
- **State indicators**: Green (active), red (inactive), white (selected), yellow (special states)
- **Form inputs**: Semi-transparent dark backgrounds (`rgba(0,0,0,0.3)`) with subtle light borders

### Form Controls
- Custom RPG styling removes browser defaults
- Consistent padding: `0.5em` horizontal
- Consistent height: `1.75em` for text inputs
- Focus state: Increased border opacity for visible feedback
- Readonly/disabled states: Reduced opacity (0.55) and no-cursor pointer

### Layout Philosophy
- **Container-fluid** for main app content (Bootstrap responsive grid)
- **Flexbox** for header navigation (`d-flex justify-content-start`)
- **Absolute positioning** for overlay elements (canvas, dropdown menus)
- **Text-center** for footers and centered content blocks

### Responsive Behavior
- Bootstrap 5 breakpoints for responsive typography and spacing
- No custom media queries in reviewed app-specific CSS
- Reliance on Bootstrap utility classes (col-xl, col-md, col-sm, etc.)

---

---

## Component Architecture & Implementation

### Namespace System
All apps use a namespace-based module system (via external `importnamespace` script):
```javascript
namespace('sp.spritely.Spritely', {
  'sp.common.Header': 'Header',
  'sp.common.Footer': 'Footer',
  'sp.common.Dialog': 'Dialog',
  // ... other dependencies
}, ({ Header, Footer, Dialog, ... }) => {
  // Component definition
  return class extends React.Component { ... };
});
```

This provides:
- Clear dependency specification
- Namespace isolation preventing global conflicts
- Reusable module pattern across applications

### Root Component Pattern
Every app follows identical root component structure:
1. Constructor initializes state, modals, and menu items
2. Dialog factory creates reusable modal instances with consistent `attrs`
3. Menu items array defines app-specific menu structure
4. Helper methods handle file I/O, transformations, state updates
5. Render method returns Header + content + managed modals

### Menu Item Configuration
All apps define menu items as objects with consistent structure:
```javascript
{
  id: 'fileMenu',
  label: 'File',
  groupClassName: 'size-picker',  // Optional: for specialized rendering
  items: [
    { id: 'loadFile', label: 'Load File', callback: () => {...} },
    { id: 'download', label: 'Download', callback: () => {...} }
  ]
}
```

### State Management
All components use React class component state pattern:
- Single `this.state` object with all app data
- `this.setState()` for updates (causes re-render)
- Shallow merging via utility functions for nested objects
- No prop drilling (all state managed in root component)

### Lifecycle Hooks
Some components (Cobblestone) use lifecycle methods:
```javascript
componentDidMount() { /* DOM measurements */ }
componentDidUpdate() { /* Responsive calculations */ }
```

### Shared Utility Modules
All apps import from `../common/`:
- **Dialog.js** — Modal factory and alert system
- **Header.js** — Navigation bar component
- **Footer.js** — Copyright + GitHub link component
- **FileDownload.js** — JSON export functionality
- **LoadFile.js** — File import handler
- **EditMode.js** — Keyboard shortcut enabler
- **Colors.js** — Color manipulation utilities
- **Utilities.js** — Generic merge, range, array operations
- **ColorPicker.js** — Reusable color picker modal
- **GridHighlighter.js** — Drawing/selection overlay for canvas apps
- **Menu.js** — Dropdown menu component
- **Print.js** — Print-to-PDF functionality
- **ImageDownload.js** — Canvas/SVG export as PNG

---

## Recommendations for Consistency

### CSS & Styling Best Practices

1. **Maintain the shared CSS stack** — Changes to `rpg.css` or `menu.css` cascade across all apps

2. **Prefer utility-first approach** — Use Bootstrap classes rather than custom CSS in new apps

3. **State indicators** — Continue using the established color strategy:
   - Green = Active/Valid
   - Red = Inactive/Error
   - White = Selected
   - Blue = Hover/Focus

4. **Form styling** — Adhere to `.rpg-textbox` conventions for consistency with the dark theme

5. **Component mounting** — Follow the `<div id="[appName]">` + `<footer id="footer">` pattern for React rendering

6. **Typography** — Caudex for headings, Modern Antiqua for accents (already configured globally)

### React Component Best Practices

7. **Modal Dialog Attrs** — Always initialize modals with `{ class: 'rpg-box text-light w-75' }` for visual consistency

8. **Button Semantics** — Use Bootstrap button colors for semantic meaning:
   - `btn btn-primary text-light` for primary interactions (Load, File operations)
   - `btn btn-success` for publication/finalization actions
   - `btn btn-danger` for destructive operations
   - `btn btn-outline-light` for toggles or secondary states

9. **Layout Pattern** — Use the established grid structure:
   - Control panels: `col-3` or `col-4` wrapped in `.rpg-box.m-3`
   - Main content: `col-6` to `col-9`
   - Always center with `row justify-content-center`

10. **Flexbox Default** — Start with `d-flex justify-content-center` for alignment; use utilities-first approach

11. **Icon Integration** — Use FontAwesome icon elements in all interactive buttons for visual clarity and accessibility

12. **Form Controls** — Always apply `.form-control` with inline `style={{ width: 'Xem' }}` for precise sizing

13. **Namespace Dependencies** — Import shared utilities and components through the namespace system

14. **Menu Configuration** — Define all menu items in the constructor; use callbacks to trigger state changes

15. **Content Wrapping** — All major content containers should use `.rpg-box` class for automatic styling

16. **Minimize Component CSS** — The shared `.rpg-box` and Bootstrap utilities should handle 95% of styling needs; avoid custom CSS in new apps

17. **Inline styles for dynamics only** — Use `style` prop only for colors, sizing, or state-dependent positioning; never for static layout

18. **No per-app customization of shared components** — Header, Footer, Dialog should render identically across all apps

---

## Summary

The Scullery Plateau app suite follows a **highly consistent, minimal-CSS approach** with a strong reliance on:
- **Shared global styles** (`rpg.css`, `menu.css`, `font.css`) for the dark RPG aesthetic
- **Bootstrap 5** for responsive layout and UI components
- **React + namespace system** for modular, reusable component logic
- **App-specific CSS** kept light, focusing only on layout-critical or component-unique styling

This architecture enables rapid app development while maintaining visual and interaction consistency across the entire platform.
