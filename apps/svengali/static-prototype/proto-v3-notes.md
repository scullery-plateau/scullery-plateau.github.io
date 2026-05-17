# Prototype v3 notes

## Top Priorities

1. ***NO CUSTOM STYLES!!**
   1. No `<style></style>` tags WHATSOEVER
   2. No `style=` attributes anywhere other than the following exceptions:
      * `<button style="font-family: {fontName};">...</button>` -> "Available Fonts" section (see below)
      * `<option style="font-family: {fontName};">{fontName}</option>` -> "Font Family" dropdown for the Text Properties section
      * `<button class="btn btn-secondary" style="background-color: {selectedColor}; color: {foregroundColor};">{fieldName}</button>`
        * *`foregroundColor` is calculated light or dark based on the selected color (see `getForegroundColor` in the `common/colors.js`)*
2. rpg.css
   1. ALL modals should be "rpg-box"
   2. NEVER use "rpg-textbox"
      * use Bootstrap styling for fields (see below)
3. Icons & buttons
   * Buttons should have either text or icons, not both
   * only use free font awesome icons, not pro
   * buttons should only be as large as they need to be
4. Input Field Style:
   1. Input Fields for Template Editor, Data Entry, and Schema Management should use the EXPLICIT html (by field type) from `formFieldLayoutExamples.html`
5. panels should be as follows:
   1. Menu Buttons
   2. Main Panel Versions
      1. Template Editor (Image Variant)
      2. Template Editor (Text Variant)
      3. Schema Management Panel (Text Field)
      4. Schema Management Panel (Number Field)
      5. Schema Management Panel (Options Field)
      6. Schema Management Panel (Font)
      7. Schema Management Panel (Color)
      8.  Schema Management Panel (Image)
      9.  Data Panel
      10. Image Management (with Table Contents)
      11. Image Management (with Empty Table)
      12. Font Pool Panel
      13. Create New Template 
   3.  Modals
       1.  Create New Template 
       2.  Alert
       3.  Confirm
       4.  Full Image View Modal
6.  All Main Panel Versions should include Tabs at the top, with the correct Tab showing as active
7.  Template Editor Field List:
    1.  Layer dropdown
    2.  Layer controls
    3.  horizontal rule
    4.  Frame fields
    5.  horizontal rule
    6.  Text or Image fields
8.  Data Panel
    *  Add and Delete buttons should only be as big as they need to be to fit icons
9.  Schema Management Panel
    *  Add and Delete buttons should only be as big as they need to be to fit icons
10. Image Management Panel
    1. "Load Image" and "Delete Unused" should be centered
    2. Add a "Thumbnail" column
    3.  for the boolean columns (`Loaded?`, `In Data Table?`, `In Template?`), do the following:
        *  a "Yes" should be a `check` font awesome icon with bootstrap `success` color
        *  a "No" should be an `X` or `close` font awesome icon with bootstrap `danger` color
11. Font Pool Panel
    *  "Available Fonts" and "Selected Fonts" section headers should be above the scrollable area
    *  Buttons in "Available Fonts" sections should use the following EXPLICIT html:
```
<button class="btn" style="font-family: {fontName};">
  <h3>{fontName}</h3>
  <p>The Quick Brown Fox Jumped Over The Lazy Dog.</p>
</button>
```
1.  Confirm Modal
    *  Buttons for Confirm modal should be as follows:

| Button Text | Bootstrap button color class |
| ------ | --------- |
| Confirm | btn-primary |
| Cancel | btn-secondary |

13. Create New Template modal
    1.  buttons look good except corners should be rounded
        1.  use `225` x `350` with a corner radius of `25`
        2.  text in card should be darker and about 25% bigger
        3.  use correct ratios underneath: `2.25" x 3.5"` and vice versa

