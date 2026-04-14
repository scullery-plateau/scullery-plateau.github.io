Template
* layers: Frame[]
* orientation: Portrait | Landscape

Frame (abstract)
* frame-x: number
* frame-y: number
* frame-width: number
* frame-height: number

Image (extends Frame)
* data: blob (base64)
* cx: number
* cy: number
* magnification: number
* rotation: number (in degrees)
* background-color: color?
* frame-color: color?

Text (extends Frame):
* text: text
* font-family: Font
* font-color: color
* background-color: color?
* frame-color: color?

Schema
* fields: Field[]

Field (abstract)
* name: text

ImageData (extends Field)

Font (extends Field)

Text (extends Field)
* min-length: number
* max-length: number

Number (extends Field)
* min: number
* max: number
* step: number

Options (extends Field)
* options: text[]

Color (extends Field)
* default: color

Frame Property → Field Type Mapping

Image Frame:
* data           → ImageData
* cx             → Number
* cy             → Number
* magnification  → Number
* rotation       → Number
* background-color → Color
* frame-color    → Color

Text Frame:
* text           → Text or Options
* font-family    → Font
* font-color     → Color
* background-color → Color
* frame-color    → Color