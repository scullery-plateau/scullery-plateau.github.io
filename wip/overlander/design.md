# Overlander: Old-School Hex Map Builder

## Vision
Overlander is a hybrid tool that merges the **compositional flexibility of Tokenizer** with the **grid-based placement of Cobblestone**. The goal is to allow users to create "Old-School D&D" style hex maps using vector icons, custom terrain colors, and coordinate-based placement.

## Core Concepts

### 1. Hex Tile Composition (The "Tokenizer" Aspect)
Instead of using fixed image files, each hex tile is a "composed" object. A tile is built by layering:
- **Background**: A solid terrain color (e.g., green for forest, tan for desert).
- **Icon**: A vector path (SVG) sourced from the user's "Favorites" (synced from `IconGallery`).
- **Styling**: Adjustable icon color, scale, and X/Y offsets.
- **Frame**: A hexagonal border with adjustable outline thickness and color.
- **Label**: Optional text overlay for locations (e.g., "Greyhawk", "The Lost Cave").

### 2. Tile Palette & Reference System (The "Cobblestone" Aspect)
- **The Palette**: Users build a collection of unique hex tiles.
- **Referential Placement**: The map grid does not store the tile data directly; it stores a reference (index or ID) to a tile in the palette.
- **Reactive Updates**: Updating a tile's definition in the palette (e.g., changing the shade of green for the "Woods" tile) automatically updates every instance of that tile across the entire map.

### 3. Vector-First Architecture
- **Performance**: The map is rendered using SVG `<defs>` and `<use>` tags. This allows for thousands of hexes to be rendered efficiently.
- **Visual Fidelity**: Since the icons and hexes are vector-based, the map remains crisp at any zoom level or print scale.
- **Lightweight Saves**: Save files are tiny, consisting only of icon path strings, color hex codes, and a grid of reference IDs.

## Proposed Component Structure

- **Overlander Controller**: Manages the state of the palette, the map placements, and grid dimensions.
- **Hex Editor**: A UI (modal or side-panel) for composing tiles. Users select an icon from their "Favorites" (synced via `localStorage`) and tweak its properties.
- **Tile Library (`TileDefs`)**: Generates the SVG definitions for all tiles in the palette.
- **Hex Grid**: A coordinate-aware canvas that handles tile placement, painting (dragging), and highlighting.
- **Publisher**: Handles framing the map for print (e.g., 1-inch hexes on 8.5x11 paper) or downloading the full map as a high-resolution image.

## User Workflow
1.  **Sync Assets**: The user visits `Game Icons` or `Font Awesome Sampler` to favorite the icons they need (Trees, Mountains, Castles).
2.  **Compose Tiles**: In Overlander, the user creates "Mountain" or "Grassland" tiles by selecting their synced icons and setting terrain colors.
3.  **Paint Map**: Using the palette, the user paints the hexagonal grid to build their world.
4.  **Labeling**: The user adds specific labels to important hexes.
5.  **Export**: The user downloads the data file for later editing or "Publishes" a multi-page PDF for their gaming table.

## Implementation Priorities
1.  **Data Model**: Redesign `Tile.js` to support the composed hex structure.
2.  **Sync Logic**: Implement `localStorage` lookup for icon favorites.
3.  **Hex Geometry**: Finalize coordinate math for the hexagonal grid and placement highlighter.
4.  **Editor UI**: Build the interactive editor for tweaking icon scale, offset, and colors.
