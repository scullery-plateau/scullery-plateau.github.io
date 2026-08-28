# Text Sizing For Template

As the text in a Text layer may change from card to card per the data table, but the frame remains constant, the font-size will need to be dynamically determined for each card from the frame dimensions and the text contents.

## Options for Implementation

All approaches rely on `CanvasRenderingContext2D.measureText()` to measure rendered text, since card rendering targets a canvas.

---

### Option 1: Binary Search

Set a min font size (e.g. 1px) and a max (e.g. frame height). Repeatedly test the midpoint: render the text at that size (with word-wrapping), measure the resulting bounding box, and halve the search range until converged.

- **Pros**: Accurate; works for any font or text content; handles word-wrap naturally.
- **Cons**: Requires multiple measurement passes (typically ~10–15 iterations for adequate precision).

---

### Option 2: Proportional Scale from Reference Size

Measure the text at a fixed reference font size (e.g. 16px). Compute the scale factor needed to fit the width, apply it to get a candidate font size, then verify it fits the height. Adjust downward if needed.

- **Pros**: Usually converges in 1–2 passes; simple to implement.
- **Cons**: Less accurate when line-wrapping changes the layout non-linearly; may need a correction pass.

---

### Option 3: Shrink-from-Maximum

Start at a large font size (e.g. equal to frame height). Word-wrap and measure the total text block height. Decrease font size by a fixed step until the text fits within both frame width and height.

- **Pros**: Conceptually simple; easy to implement.
- **Cons**: Slowest approach; step size creates a trade-off between accuracy and performance.

---

### Option 4: Area-Based Estimate + Correction

Estimate font size from the ratio of frame area to character count (a heuristic), then do one measurement pass and correct. Optionally follow with a binary search refinement if the estimate is off by more than a threshold.

- **Pros**: Fast in the common case; no iteration needed when the estimate is close.
- **Cons**: Heuristic depends on font metrics; less reliable for short strings or unusual aspect ratios.

---

### Recommendation

**Option 1 (Binary Search)** is the most robust. For a canvas renderer the measurement cost is low, and ~12 iterations of `measureText` is negligible. Word-wrap logic should be extracted as a shared helper used by both the measurement loop and the final render pass to ensure consistency.