# Svengali Wizard Roadmap

The Svengali Wizard is a sequential resource gatherer and validator designed to prepare layouts, data, and icons for the Svengali rendering engine.

## Immediate Priorities
- [ ] **Refine Layout Schema**
  - **Remove "scale":** Hardcode standard Poker Size constants (240x336 at 96 DPI) in `Classes.SvengaliLayout`.
  - **Add "orientation":** Add a required `orientation` field (portrait/landscape) to the layout schema to determine which dimension is the width vs. height.
- [ ] **Dynamic Schema Generation & Testing**
  - Implement generator in `scripts/schema-generator.js`.
  - Create tests using the `buckshot` data to verify generated schemas are accurate.
- [ ] **Visual Preview Integration**
  - Display single instances of each card in the wizard once the data/layout is resolved to confirm results before publishing.

## Phase 1: Foundation (Current State)
- [x] Agnostic project structure in `wip/svengali/wizard/`
- [x] Shared core logic in `wip/svengali/scripts/` (Renderer, Classes, Metrics)
- [x] Integrated `apps/common/print.js` for library-standard output
- [x] Initial React shell with sequential file loading placeholders
- [x] Agile Validation utility using AJV in `validator.js`
- [x] Defined `layoutSchema.json` and `iconCollectionSchema.json`

## Phase 2: Layout & Schema Intelligence
- [ ] **Step 1: Layout Validation**
  - Integrate `Validator.validate` into `wizard.js` to check loaded layouts against `layoutSchema.json`.
  - Display validation errors in the UI if the layout is malformed.
- [ ] **Step 2: Dynamic Schema Generation**
  - Traverse all `propertyBinding` paths in the layout layers.
  - Generate a custom JSON schema for the data file, enforcing types based on layer type (e.g., strings for headers, icons for icon layers).

## Phase 3: Data & Resource Discovery
- [ ] **Step 3: Data Validation**
  - Load data files and validate them against the **dynamically generated** schema from Phase 2.
- [ ] **Step 4: Icon Reference Extraction**
  - Scan valid data records for strings bound to `IconLayer` properties.
  - Compile a "Required Icons" list.
  - Identify which required icons are currently missing from the session.

## Phase 4: Icon Collection Management
- [ ] **Step 5: Sequential Icon Loading**
  - Provide a UI for loading multiple icon collection files.
  - Validate each file against `iconCollectionSchema.json`.
  - Merge icons into a central session object.
  - Real-time update of the "Missing Icons" list as files are loaded.

## Phase 5: Finalization
- [ ] **Step 6: Completion Logic**
  - Enable the "Publish" button ONLY when:
    1. Layout is valid.
    2. Data is valid.
    3. All referenced icons are present in the merged collection.
- [ ] **Step 7: UI Refinement**
  - Add progress indicators for each stage.
  - Add "Summary" view of loaded resources before publishing.
