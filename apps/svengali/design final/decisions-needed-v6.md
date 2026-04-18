# Svengali — Open Decisions v6

Items that require a product or design decision before or during implementation.

---

## 1. Optional color fields (`background_color`, `frame_color`): examples inconsistent with specification

§2 provides a detailed note explaining the resolved data model for optional colors:

> Optional color fields always have the full `ColumnableField<color>` form — they are never bare `null`. A `null` inner value (`{ type: "value", value: null }`) means the color is disabled (not rendered).

However, the **examples and defaults throughout the plan contradict this specification**:

- **§5 (JSON serialization examples)** shows `"background_color": null` instead of `"background_color": { type: "value", value: null }`
- **§9 (New Frame Defaults table)** lists default values as `null` instead of `{ type: "value", value: null }`
- **§11 (ColorPicker Integration code pattern)** uses the ternary pattern `value ? ... : ...`, which assumes `value` can be `null` directly, rather than accessing `field.value`

These inconsistencies create ambiguity for the implementer: which should be trusted, the specification in §2 or the examples in §5/§9/§11?

**Decision needed**: 
1. Update **all JSON examples in §5** to use the correct format: `{ type: "value", value: null }`
2. Update **the defaults table in §9** to show: `{ type: "value", value: null }`
3. Update **the code pattern in §11** to correctly destructure the `ColumnableField` wrapper and access `.value`
4. Add a note in the Validation Error Reporting section (§16) confirming that **both `null` and `{ type: "value", value: null }` are invalid for optional color fields on upload** — only the latter is valid. This ensures that malformed JSON files are rejected during import with a clear error message identifying the field(s) in question.

---

## 2. Optional color fields: UI control for toggling enable/disable is not formally specified

§2 notes that optional color fields can be "disabled" (not rendered), and §10 references a *right-click to clear* pattern. However, **no section of the plan describes the primary UI affordance for toggling an optional color field between "enabled" and "disabled"** (other than the clearing behavior via right-click).

In other Svengali components:
- A checkbox or toggle button typically controls whether an optional feature is active.
- §11 shows a button rendering pattern but does not address how it appears/disappears or how the user initiates the enable/disable state change.

The questions remain unanswered:

- **How does the user first enable** a `background_color` or `frame_color` that starts disabled? Is there a dedicated button, checkbox, or toggle adjacent to the field label?
- **How does the visual state change** when toggled from disabled to enabled (or vice versa)? (e.g., the button might become clickable or change color)
- **When the user enables an optional color field for the first time, what initial value does it take?** (e.g., `{ type: "value", value: "#ffffff" }`, a prompt to the color picker, or a sensible default like the current frame color if one exists)

**Decision needed**: Formally specify the UI control and interaction flow for toggling optional color fields between enabled and disabled states. Include:
1. The UI element (checkbox, toggle button, or other affordance)
2. Its placement in the Template tab UI
3. The initial color value when first enabled
4. Visual feedback or state changes during the transition

---

## 3. File format validation: are optional color fields with `null` accepted on template upload?

§16 specifies validation of JSON template and CSV data uploads, but leaves one edge case unresolved.

Given that §2 defines optional color fields as `ColumnableField<color>` with `{ type: "value", value: null }` as the disabled state, and §5's examples show `null` serialization:

- **Should a template JSON file with `"background_color": null` (bare `null`) be rejected during upload validation?**
- **Or should the validator accept both bare `null` and the proper `{ type: "value", value: null }` format for backward compatibility?**

If bare `null` is accepted, it must be **normalized to the proper format** during parsing. If it is rejected, the error report (§16) must clearly identify the field path and suggest the correct format.

**Decision needed**: 
1. When a template JSON upload contains bare `null` for an optional color field, should the file be:
   - **Rejected** with an error identifying the field and the correct format?
   - **Accepted and auto-corrected** to `{ type: "value", value: null }` during import (with or without user notification)?
2. If accepted and auto-corrected, should a **warning** appear in the Import Success dialog (if one exists) listing the auto-corrected fields?

---

## 4. Validation scope: is validation of optional color fields complete for all upload paths?

§16 lists template JSON validation errors, but does not explicitly state whether **optional color fields with `null` inner values** are validated as part of the standard field validation, or whether they require special handling.

Specifically:
- Is a `ColumnableField<color>` with `value: null` considered "valid" for a `Color`-type schema field in the data CSV?
- Are there any restrictions on when `null` is valid vs. invalid (e.g., only valid for optional frame/background colors on layers, but not for schema field defaults)?

**Decision needed**: Clarify the validation rules for `null` color values in both template layer properties and schema field defaults. Ensure the error report (§16) produces a clear message if validation fails.

---

## 5. Cross-reference coverage: are all referenced "Add New" patterns in `featureForAddNew.md` documented?

Multiple sections reference `featureForAddNew.md`:

- **§10 "V/C Toggle UI"**: references *+ Add column…* (§4) and *+ Load image…* (§3)
- **§12 "Font Pool Behavior"**: references *+ Add font…* (§2)
- **§13 "Schema Field Deletion Guard"**: references *+ Add column…* (§4) and *+ Load image…* (§3)
- **§18 "Image Tab"**: references *+ Load image…* (§3)
- **§19 "Data Tab Form Controls"**: references *+ Load image…* (§3) and *+ Add font…* (§2)

This plan assumes all referenced sections (§2, §3, §4) are fully documented in `featureForAddNew.md`.

**Decision needed** (verification task): 
1. Confirm that `featureForAddNew.md` covers all referenced patterns and sections.
2. If any section is missing or incomplete, extend `featureForAddNew.md` or inline the description into the plan.
3. If `featureForAddNew.md` does not exist, create it with documented flows for *+ Add font…*, *+ Load image…*, and *+ Add column…*.

---

## 6. Text sizing algorithm: is "Binary Search (Option 1)" the only strategy, or are alternatives documented?

§6 specifies:

> Font size is determined dynamically per card using **Binary Search** (Option 1 from `text-sizing-for-template.md`) via `CanvasRenderingContext2D.measureText()`.

The reference to "Option 1" implies multiple strategies were considered. However, **no fallback strategy or alternative is documented in this plan** if binary search proves inadequate or if performance issues arise during implementation.

**Decision needed**: 
1. Confirm that `text-sizing-for-template.md` contains the full rationale and algorithm for the Binary Search approach.
2. If implementation discovers performance or quality issues with binary search, what is the escalation path? Should a secondary strategy (Option 2, Option 3, etc. from the referenced doc) be documented here as a fallback?
3. Alternatively, confirm that binary search is the only acceptable approach and remove the "Option 1" qualifier to eliminate ambiguity.
