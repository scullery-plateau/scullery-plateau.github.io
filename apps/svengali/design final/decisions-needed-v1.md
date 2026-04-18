# Svengali — Open Decisions

Items that require a product or design decision before or during implementation.
: responses added as definition list
---

## 1. Image `data` — value mode or column-only?

`data` is typed as `ColumnableField<blob (base64)>`, which implies it can be set to a fixed value for every card. In practice, there is no obvious UI for entering a data URL as a raw value — any image must come from a file. 

**Decision needed**: Is `data` always column-mode (i.e., plain `column: string` rather than a `ColumnableField`)? Or should value mode be supported via a file-picker in the Template tab that embeds the blob directly into the template?
: if the user wishes to select a fixed image for the template, they should be able to do so and be presented with a dropdown listing all **loaded** images
---

## 2. ZIP library for "Download All"

"Download All" bundles JSON + CSV into a ZIP. No ZIP library is currently listed in `index.html`.

**Decision needed**: Which library should be used (e.g. JSZip via CDN), or should the feature be re-scoped to download the two files separately rather than as a ZIP?
: just trigger the download for each file separate file at the same time. We can always add a ZIP library later
---

## 3. V/C toggle with no compatible schema fields

If a frame property is toggled to column mode but no schema fields of a compatible type exist yet, the column dropdown would be empty.

**Decision needed**: Should the toggle-to-column button be disabled when no compatible fields exist, or should it be allowed with an empty/placeholder dropdown?
: toggle-to-column should not be visible / rendered until there are compatible fields in the schema
---

## 4. Adding a Text layer when the font pool is empty

The default `font_family` falls back to the first font in `fontPool`, or to the first font in the `Fonts` list if the pool is empty. Using a font that is not in the pool as a silent fallback contradicts the pool's purpose as a curated selection.

**Decision needed**: Should adding a Text layer be blocked (with a prompt to add a font first) when `fontPool` is empty, or is the silent fallback to the `Fonts` list acceptable?
: adding a text layer without any available fonts in the font pool should open a modal explaining the `Font Pool` to the user and show them a list of all fonts in the list with the understanding that the font they select will be added to the `Font Pool`, but will be the only available font for them to choose until they add more to the pool.

---

## 5. Print when there are no data rows

The image-loading gate is vacuously satisfied when `data` is empty (no rows → no missing images). This would allow print to proceed and produce zero cards.

**Decision needed**: Should Print be disabled when `data` is empty, or is a print run of zero cards acceptable?
: If the user creates a template with **only** raw values and no data, then the print run will show a single page of 8 cards, all the same card. If they have a single data row, the page will only one instance of the one card.

---

## 6. Initial dialog — user dismisses without choosing orientation

If the user closes the orientation dialog without making a selection, the app is left with `orientation: null` and no defined behavior.

**Decision needed**: Should the close/X button be hidden on the initial dialog (forcing a choice), or should the dialog re-open whenever the user interacts with the app before orientation is set?
: since the user is able to exit the modal by simply hitting the `esc` key, the ui should re-open the dialog box if it returns anything other than a valid value for `orientation`. When reopening, it should include a warning message communicating to the user that they must select a valid orientation before proceeding.

---

## 7. Loading a template when data already exists

Loading a new template likely makes existing `data` and `images` stale or incompatible with the new schema.

**Decision needed**: Should loading a new template silently clear `data` and `images`, warn the user first, or attempt to re-validate/retain compatible columns?
: attempting to load a new template should open a modal warning the user of what they are about to do, and offer them `Confirm` and `Cancel` options, along with a buttons for `Download Data`, `Download Template`, and `Download All`. If they confirm, `data` and `images` should be cleared. 