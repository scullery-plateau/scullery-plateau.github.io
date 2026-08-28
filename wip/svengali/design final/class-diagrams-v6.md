# Svengali Object Model — Class Diagrams (v6)

## Frame Hierarchy

All variable properties on `Image` and `Text` are `ColumnableField<T>` (abbreviated `CF<T>`).
Optional color fields use a `null` inner value (`{ type:"value", value:null }`) to mean "disabled / not rendered."

```mermaid
classDiagram
    class Frame {
        <<abstract>>
        +string name
        +number frame_x
        +number frame_y
        +number frame_width
        +number frame_height
    }

    class Image {
        +CF~string~ data
        +CF~number~ cx
        +CF~number~ cy
        +CF~number~ magnification
        +CF~number~ rotation
        +CF~color~ background_color
        +CF~color~ frame_color
    }

    class Text {
        +CF~string~ text
        +CF~Font~ font_family
        +CF~color~ font_color
        +CF~color~ background_color
        +CF~color~ frame_color
    }

    Frame <|-- Image
    Frame <|-- Text
```

> `background_color` and `frame_color` on `Image` and `Text` are optional: an inner `value` of `null` means the color is disabled and the corresponding SVG element is not rendered.

---

## ColumnableField\<T\>

A discriminated union. Every variable property on a `Frame` subclass is stored as one of these two variants:

```mermaid
classDiagram
    class ColumnableField~T~ {
        <<union>>
        +string type
    }

    class ValueMode~T~ {
        +string type = "value"
        +T value
    }

    class ColumnMode {
        +string type = "column"
        +string column
    }

    ColumnableField~T~ <|-- ValueMode~T~
    ColumnableField~T~ <|-- ColumnMode
```

**Resolution at render time**:
```
resolve(field, row) → field.type === "value" ? field.value : row[field.column]
```

---

## Field Hierarchy

Each schema field carries both a human-friendly `label` and a machine-safe `COLUMN_ID`.

```mermaid
classDiagram
    class Field {
        <<abstract>>
        +string label
        +string COLUMN_ID
    }

    class ImageData {
    }

    class TextField {
        +number min_length
        +number max_length
    }

    class NumberField {
        +number min
        +number max
        +number step
    }

    class Options {
        +string[] options
    }

    class Font {
    }

    class Color {
        +color default
    }

    Field <|-- ImageData
    Field <|-- TextField
    Field <|-- NumberField
    Field <|-- Options
    Field <|-- Font
    Field <|-- Color
```

---

## Template and Schema

```mermaid
classDiagram
    class Template {
        +Orientation orientation
        +Frame[] layers
    }

    class Orientation {
        <<enumeration>>
        Portrait
        Landscape
    }

    class Schema {
        +Field[] fields
    }

    Template --> Frame : layers
    Template --> Orientation : orientation
    Schema --> Field : fields
```

---

## App State Shape

```mermaid
classDiagram
    class AppState {
        +Template template
        +Schema schema
        +string[] fontPool
        +object[] data
        +ImageEntry[] images
        +string selectedTab
        +number|null selectedLayerIndex
        +number selectedRowIndex
        +number|null selectedFieldIndex
    }

    class ImageEntry {
        +string filename
        +string dataUrl
        +number width
        +number height
    }

    AppState --> Template : template
    AppState --> Schema : schema
    AppState --> ImageEntry : images
```

---

## Frame Property → Field Type Mapping

Which schema field types are valid for each frame property's column-mode dropdown:

```mermaid
classDiagram
    class ImagePropertyMap {
        <<mapping>>
        data → ImageData
        cx, cy, magnification, rotation → NumberField
        background_color, frame_color → Color
    }

    class TextPropertyMap {
        <<mapping>>
        text → TextField, Options
        font_family → Font
        font_color, background_color, frame_color → Color
    }
```

---

## Complete Object Model

```mermaid
classDiagram
    %% ColumnableField union
    class ColumnableField~T~ {
        <<union>>
        +string type
    }
    class ValueMode~T~ {
        +string type = "value"
        +T value
    }
    class ColumnMode {
        +string type = "column"
        +string column
    }
    ColumnableField~T~ <|-- ValueMode~T~
    ColumnableField~T~ <|-- ColumnMode

    %% Frame hierarchy
    class Frame {
        <<abstract>>
        +string name
        +number frame_x
        +number frame_y
        +number frame_width
        +number frame_height
    }
    class Image {
        +CF~string~ data
        +CF~number~ cx
        +CF~number~ cy
        +CF~number~ magnification
        +CF~number~ rotation
        +CF~color~ background_color
        +CF~color~ frame_color
    }
    class Text {
        +CF~string~ text
        +CF~Font~ font_family
        +CF~color~ font_color
        +CF~color~ background_color
        +CF~color~ frame_color
    }
    Frame <|-- Image
    Frame <|-- Text

    %% Field hierarchy
    class Field {
        <<abstract>>
        +string label
        +string COLUMN_ID
    }
    class ImageData {
    }
    class TextField {
        +number min_length
        +number max_length
    }
    class NumberField {
        +number min
        +number max
        +number step
    }
    class Options {
        +string[] options
    }
    class Font {
    }
    class Color {
        +color default
    }
    Field <|-- ImageData
    Field <|-- TextField
    Field <|-- NumberField
    Field <|-- Options
    Field <|-- Font
    Field <|-- Color

    %% Template and Schema
    class Template {
        +Orientation orientation
        +Frame[] layers
    }
    class Orientation {
        <<enumeration>>
        Portrait
        Landscape
    }
    class Schema {
        +Field[] fields
    }
    Template --> Frame : layers
    Template --> Orientation : orientation
    Schema --> Field : fields

    %% App State
    class AppState {
        +Template template
        +Schema schema
        +string[] fontPool
        +object[] data
        +ImageEntry[] images
        +string selectedTab
        +number|null selectedLayerIndex
        +number selectedRowIndex
        +number|null selectedFieldIndex
    }
    class ImageEntry {
        +string filename
        +string dataUrl
        +number width
        +number height
    }
    AppState --> Template : template
    AppState --> Schema : schema
    AppState --> ImageEntry : images
```

---

## Legend

- `CF<T>` / `CF~T~` — shorthand for `ColumnableField<T>`; a discriminated union of `ValueMode<T>` and `ColumnMode`
- `<<abstract>>` — abstract class; not instantiated directly
- `<<union>>` — discriminated union (not a traditional class)
- `<<enumeration>>` — fixed set of named values
- `<<mapping>>` — lookup table (not a runtime class)
- Inheritance arrows (`<|--`) — child → parent
- Association arrows (`-->`) — owner → owned
- Optional color fields (`background_color`, `frame_color`): inner `value: null` means disabled; `value: "#rrggbb"` means enabled
