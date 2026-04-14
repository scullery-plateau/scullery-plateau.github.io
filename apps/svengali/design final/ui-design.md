# Svengali UI Design

## Initial Dialog

* Prompt to choose Portrait or Landscape layout

## Menu bar

* Download All
* Download Template (with schema, as json)
* Download Data (as csv)
* Print (opens new tab with printable set of cards)
* Load Template
* Load Data

## Template Tab

* Right Column
  * Card display - displays currently selected row
* Left Column
  * Row Dropdown
  * Layer Dropdown
  * Layer Controls ( +, -, <<, <, >, >>)
  * Panel containing Frame fields
    * per `object-model-draft.md`
  * Frame-subtype-specific panel
    * Image vs Text
    * per `object-model-draft.md`

## Data Tab

* Right Column
  * Card display - displays currently selected row
* Left Column
  * Row dropdown
  * Add / Delete row controls ( + / - )
  * generated form
    * `<label>` is column name
    * input type is based on Field type - see `object-model-draft.md`)

## Schema Tab

* Right Column
  * bulleted list of column names
    * sub-bullets contain metadata (type, etc. - see `object-model-draft.md`)
* Left Column
  * Dropdown list of columns
  * layer controls ( +, -, <<, <, >, >>)
  * Column Type dropdown
    * "ImageData", "Text", "Number", "Options", "Color"
  * Type-specific fields / inputs
    * per `object-model-draft.md`

## Image Tab

* top center
  * Load Image button
* table
  * columns:
    * Filename
    * Loaded?
    * In Data Table?
    * In Template?
    * Delete button
* bottom right
  * Update button
  * Cancel button

## Font Pool Tab

* left column (2/3)
  * Font Display: a scrollable list of all available fonts displayed as follows
    * ```
        ## {Font Name}
        > "The quick brown fox jumped over the lazy dog!"
    * each font section is clickable
      * Clicking toggles whether or not a font is selected for the pool
      * when selected, the section gains a thick outline of the Bootstrap `success` color
      * when not selected, the section has a thin outline of the Bootstrap `secondary` color
    * when selected, the font name is also added to the pool
* right column (1/3)
  * Plain text list of all fonts selected for the pool

