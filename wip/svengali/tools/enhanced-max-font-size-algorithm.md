# Enhanced Max Font Size Algorithm

This document outlines enhancements to the initial algorithm proposed in `maxFontSize.md`, incorporating the data-driven insights from the Font Harvester.

## 1. Area-Based Heuristic (Starting Point)

Instead of a linear estimation, we use a more accurate area-based calculation to find the initial `fontSize`.

**Inputs:**
* `frameWidth`, `frameHeight`
* `characterCount` (length of the paragraph)
* `fontRatio` (The `H/AvgW` value from `font-ratios.json` for the selected font)

**Heuristic Calculation:**
```javascript
const frameArea = frameWidth * frameHeight;
// We assume RowHeight = fontSize and CharWidth = fontSize / fontRatio
// Area ≈ characterCount * (fontSize) * (fontSize / fontRatio)
const estimatedFontSize = Math.sqrt((frameArea * fontRatio) / characterCount);
```

## 2. Character-Count Verification (Validation)

Once a candidate `fontSize` is selected, we verify if the text fits both horizontally and vertically.

**Verification Logic:**
```javascript
const avgCharWidth = fontSize / fontRatio;
const maxCharsPerRow = Math.floor(frameWidth / avgCharWidth);

// Account for Line Height (Leading)
// SVG standard leading is typically 1.2 * fontSize
const rowHeight = fontSize * 1.2; 
const maxRows = Math.floor(frameHeight / rowHeight);

const totalCapacity = maxCharsPerRow * maxRows;
```

**Result:**
* If `totalCapacity >= characterCount`, the font size is potentially valid (proceed to word-wrap check).
* If `totalCapacity < characterCount`, decrement `fontSize` and repeat.

## 3. Dynamic Word Wrapping (Final Layout)

After finding a font size that fits mathematically, we must calculate the actual line breaks to ensure no single word overflows `frameWidth`.

1. Split `paragraph` by spaces.
2. Iterate through words, building lines where `line.length <= maxCharsPerRow`.
3. If a word itself is longer than `maxCharsPerRow`, the font size must be reduced further until the longest word fits.
4. Total resulting `lines.length` must be `<= maxRows`.

## 4. Minimum Constraint

* **Floor:** `fontSize` must never drop below **7pt** (approx. 9.33px) as defined in `textSizingConstraints.md`.
* **Feedback:** If the text cannot fit at 7pt, the UI should flag a "Text Overflow" error to the user.
