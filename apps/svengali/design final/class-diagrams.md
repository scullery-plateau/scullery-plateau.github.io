# Svengali Object Model - Class Diagrams

## Frame Hierarchy

```mermaid
classDiagram
    class Frame {
        <<abstract>>
        -number frame_x
        -number frame_y
        -number frame_width
        -number frame_height
    }

    class Image {
        -blob data
        -number cx
        -number cy
        -number magnification
        -number rotation
        -Color? background_color
        -Color? frame_color
    }

    class Text {
        -string text
        -FontFamily font_family
        -Color font_color
        -Color? background_color
        -Color? frame_color
    }

    Frame <|-- Image
    Frame <|-- Text
```

## Field Hierarchy

```mermaid
classDiagram
    class Field {
        <<abstract>>
        -string name
    }

    class ImageData {
    }

    class TextField {
        -number min_length
        -number max_length
    }

    class NumberField {
        -number min
        -number max
        -number step
    }

    class Options {
        -string[] options
    }

    class Font {
    }

    class Color {
        -Color default
    }

    Field <|-- ImageData
    Field <|-- Font
    Field <|-- TextField
    Field <|-- NumberField
    Field <|-- Options
    Field <|-- Color
```

## Template and Schema

```mermaid
classDiagram
    class Template {
        -Frame[] layers
        -Orientation orientation
    }

    class Orientation {
        <<enumeration>>
        Portrait
        Landscape
    }

    class Schema {
        -Field[] fields
    }

    Template --> Frame
    Template --> Orientation
    Schema --> Field
```

## Complete Object Model

```mermaid
classDiagram
    %% Frame Hierarchy
    class Frame {
        <<abstract>>
        -number frame_x
        -number frame_y
        -number frame_width
        -number frame_height
    }

    class Image {
        -blob data
        -number cx
        -number cy
        -number magnification
        -number rotation
        -Color? background_color
        -Color? frame_color
    }

    class FrameText {
        -string text
        -FontFamily font_family
        -Color font_color
        -Color? background_color
        -Color? frame_color
    }

    %% Field Hierarchy
    class Field {
        <<abstract>>
        -string name
    }

    class ImageData {
    }

    class FieldText {
        -number min_length
        -number max_length
    }

    class NumberField {
        -number min
        -number max
        -number step
    }

    class OptionsField {
        -string[] options
    }

    class Font {
    }

    class ColorField {
        -Color default
    }

    %% Template and Schema
    class Template {
        -Frame[] layers
        -Orientation orientation
    }

    class Schema {
        -Field[] fields
    }

    class Orientation {
        <<enumeration>>
        Portrait
        Landscape
    }

    %% Relationships
    Frame <|-- Image
    Frame <|-- FrameText
    Field <|-- ImageData
    Field <|-- Font
    Field <|-- FieldText
    Field <|-- NumberField
    Field <|-- OptionsField
    Field <|-- ColorField
    Template --> Frame
    Template --> Orientation
    Schema --> Field
```

## Legend

- **Abstract Classes**: Displayed with `<<abstract>>` label
- **Enumerations**: Displayed with `<<enumeration>>` label
- **Inheritance**: Solid arrows pointing from child to parent
- **Composition/Association**: Solid lines with arrows indicating relationships

## Notes

- The `Frame` class is abstract and serves as the base for `Image` and `Text` frame elements
- The `Field` class is abstract and serves as the base for various field types used in schemas
- `Template` contains multiple `Frame` layers and an `Orientation`
- `Schema` contains multiple field definitions
- `Orientation` is an enumeration with two values: Portrait and Landscape
