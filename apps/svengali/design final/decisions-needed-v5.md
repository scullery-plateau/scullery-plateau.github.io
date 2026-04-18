# Svengali — Open Decisions v5

Items that require a product or design decision before or during implementation.

---

## 1. Optional color fields (`background_color`, `frame_color`): activation, initial value, and serialization

§2 declares `Image.background_color`, `Image.frame_color`, `Text.background_color`, and `Text.frame_color` as `ColumnableField<color> (optional)`. Both §5's JSON example and §9's defaults table show them as `null`. No section of the plan specifies:

- **How the user enables or disables** these fields in the Template tab UI. Other apps use a checkbox or a toggle button to turn an optional property on/off. Nothing in the plan describes this control.
- **What initial value** a color `ColumnableField` is given when the user first enables it (i.e., what color and what `type`).
- **How `null` serializes vs. a disabled `ColumnableField`**. The JSON examples show `"background_color": null`, but §2 defines these as `ColumnableField<color>`. It is unclear whether `null` means "this optional feature is currently off" (a special sentinel at the layer level, not a `ColumnableField` at all), or whether it means `{ type: "value", value: null }` (a `ColumnableField` in value mode with no color chosen). The distinction affects how the toggle-to-column button behaves for these fields, how validation handles them on upload, and how the color picker button handles a `null` value.

**Decision needed**: 
1. What UI control enables/disables optional color fields? (e.g. a checkbox next to a "Background Color" label; a dedicated enable/disable toggle button)
2. When first enabled, what is the initial `ColumnableField` value? (e.g. `{ type: "value", value: "#ffffff" }`, or a `null` value with the color picker opening immediately)
3. In the serialized JSON, is a disabled optional color field stored as `null` (meaning "feature off, not a `ColumnableField`") or as `{ type: "value", value: null }`? If `null`, the validator must accept `null` as a valid value for these properties; if `{ type: "value", value: null }`, they behave like any other `ColumnableField` and can be toggled to column mode.
> examples like `"background_color": null` should become `"background_color": { type: "value", value: null }`

---

## 2. §13 "Replace with another column" dropdown when no other compatible schema field exists

§13's deletion guard offers two resolution paths: "Replace with another column" and "Set to a fixed value." The plan specifies that the "Set to a fixed value" input shows an "Add New" trigger when the required list is empty (via `featureForAddNew.md`). But it does not specify what happens to the **"Replace with another column"** dropdown when the field being deleted is the **only** schema field of that type — i.e., the dropdown would be empty with no valid replacement.

For example: the only `ImageData` field in the schema is being deleted, and one or more layer properties are bound to it in column mode. The user cannot replace it with another column because none exist; they can only set it to a fixed value. But "Set to a fixed value" for `Image.data` requires a loaded image. If images are also empty, the guard modal could reach a state where neither resolution path has any selectable entries.

**Decision needed**: When "Replace with another column" would produce an empty dropdown in the §13 guard, should:
1. The "Replace with another column" option also display a *+ Add column…* trigger (following the `featureForAddNew.md` §4 pattern), allowing a new compatible schema field to be created without leaving the guard modal?
2. The "Replace with another column" option be **suppressed** entirely for that property type, leaving only "Set to a fixed value" (with its own "Add New" trigger if needed)?
3. Something else?
> apply Option 1

---

## 3. "Load Data" availability: what constitutes a loaded template?

§17 states that Load Data is "Only available after a template is loaded." This condition is never formally defined. Two plausible interpretations:

- **After `Load Template` has been successfully called** — Load Data is disabled until the user has explicitly loaded a template file, even if the user has created one from scratch in the current session.
- **After `state.template.orientation` is non-null** — Load Data becomes available as soon as orientation has been selected in the initial dialog, since `schema` (needed to validate the CSV) exists in state from that point on.

The distinction matters: a user could build a schema and a template from scratch in the current session without ever using "Load Template." Under the first interpretation, Load Data would remain disabled for them. Under the second it would be available.

There is also a secondary edge case: if a session has `state.template.orientation` set but `state.schema.fields` is empty, what does Load Data do with a CSV that has columns? Those columns would all fail validation ("columns in CSV absent from schema"), and every non-header-only CSV would be rejected. Is that the correct behavior, or should Load Data be additionally gated on the schema being non-empty?

**Decision needed**: Define precisely when Load Data is enabled. Options:
1. Whenever `state.template.orientation` is non-null (orientation has been set).
2. Only after a Load Template operation has succeeded in the current session.
3. Whenever `state.template.orientation` is non-null **and** `state.schema.fields` is non-empty.
> apply Option 3

---

## 4. §16 Download Error Report: scope and format

§16 introduces a **Download Error Report** button in the error modal for CSV uploads, but leaves two sub-questions open.

**4a. Scope — JSON template upload errors**: The Download Error Report is described only for "CSV uploads with many errors." Template JSON upload errors (§16 first bullet block) are not mentioned. A complex JSON file could produce a lengthy list of malformed fields, unknown types, or bad `ColumnableField` objects — potentially enough errors to warrant a downloadable report as well.

**Decision needed**: Should the Download Error Report button also appear for template JSON validation errors, or only for CSV data uploads?

**4b. Format — plain text vs. CSV**: §16 says the report "produces a plain-text or CSV file." This leaves the format unresolved. The two are not equivalent: a CSV error report is easy to open in spreadsheet software and can include columns like `row`, `column`, `value`, `error`; a plain-text report is simpler to generate but harder to sort or filter.

**Decision needed**: Should the error report be plain text (`.txt`) or CSV (`.csv`)?
> regarding 4b, lets make the error report a `csv`
> regarding 4a, yes, we also want to make a downloadable error report available for template errors. However, to make it more user friendly, let's flatten this error report to make it a `csv` as well.
---

## 5. `+ Add column…` trigger when both `data` and compatible schema fields are absent

§10 specifies that the toggle-to-column button is suppressed when `data` is empty, and that the *+ Add column…* trigger (from `featureForAddNew.md` §4) appears only when `data` is non-empty but no compatible schema field exists. When **both** conditions are absent — `data` is empty AND no compatible schema field of the required type exists — neither affordance appears. The user sees only the value-mode input with no way to reach column mode from the Template tab.

This is internally consistent, but it means a user designing a template from scratch must visit the Schema tab to create columns before any toggle-to-column controls become visible in the Template tab, even if they would prefer to work entirely in the Template tab. They also must add at least one data row (Data tab) before the toggle appears. This is a workflow constraint that may surprise users.

**Decision needed**: Is the current behavior — no toggle and no *+ Add column…* trigger when `data` is empty, regardless of schema state — the intended workflow? Or, when `data` is empty and no compatible schema field exists, should the *+ Add column…* trigger still be shown, deferring the "which row gets which default value" question until data is eventually added?
> see `initSchemaWizardFeature.md`
