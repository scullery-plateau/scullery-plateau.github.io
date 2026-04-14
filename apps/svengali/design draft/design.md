layers: _________v + - |<<  <  >  >>|

layer type:
* Frame (abstract)
  * Frame X (number)
  * Frame Y (number)
  * Frame Width (number)
  * Frame Height (number)
* Image (extends Frame)
  * data (imageData)
  * cx, cy (number)
  * magnification (number)
  * rotation-in-degrees (number)
* Text (extends Frame)
  * cx, cy (number)
  * text (text)
  * width, height (number)
  * font color (color)
  * font family (options)

-----------------------------------------------------

Data View

Schema types
* imageData (base64 blob)
* text
  * min length
  * max length
* number
  * min
  * max
  * step
* options
  * options
* color
  * default

------------------------------------------------------

Functions
* Data tab (csv - two rows of headers - first row is labels, second row is types)
  * Import Data (upload)
  * Export Data (download)
* Schema tab (json containing both schema and layout)
  * Import Schema (upload)
  * Export Schema (download)
* Layout tab 
  * Export ZIP (zip containing layout, data, and schema)
  * Print (print)
  * Export Layout (download json containing both schema and layout)
  * Import Layout (upload json containing both schema and layout)

