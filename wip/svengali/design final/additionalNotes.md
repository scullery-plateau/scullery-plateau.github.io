# Additional Notes

* Card Display should have a white background
* The actively-selected layer in the card display should show an outline using the gradient from "Spritely"
* reference `Spritely` and `Outfitter` for how to use `colorPicker.js` (`sp.common.ColorPicker`) in connection with `dialog.js` (`sp.common.Dialog`)
* Constants in `constants.js` should only be those constants that are used in multiple namespaces, otherwize they should be declared locally, privately, at the top of the namespace, in the scope of that namespace's factory function
* Deselecting a font from the font pool should only be allowed if the font is unused.
  * Attempting to deselect a font from the font pool that is in use should result in opening a modal that lists for the user which layer(s) the font is being used in, and present the user with a dropdown listing the other available selected fonts to choose to replace it with
* Printing will not be available until all images have been loaded.
  * the csv files will contain two tables separated by multiple (2+) new lines
    1. the data table with any image data columns holding just the filename
    2. a table of filenames to data urls (optional for upload, included in download)
* a json upload file that includes fonts in the font pool that are not included in the Fonts namespace will be deemed invalid.
* for column naming, the schema should hold both a "Label" (human friendly name) and a "COLUMN_ID" (machine-safe identifier). 
  * The user will only enter the human friendly name with only alphanumeric characters and spaces, and the UI will generate the machine-friendly version by making all characters upper case and replacing spaces with underscores. 
  * This `id` will be displayed in the schema UI as the user sets / changes the `label`.
  * The csv data table and the template will use the "COLUMN_ID", but the data entry ui and the column dropdown for the columnable field will use the label.
* Look for patterns in other Scullery-Plateau apps to help form Component Breakdown Guidlines