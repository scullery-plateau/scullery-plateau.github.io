# Outfitter Architectural Refinement Plan

This document outlines the transition plan for Outfitter to move toward a local, text-based SVG rendering architecture, removing dependencies on the external `Paper-doll` namespace.

## Goals
- Decentralize rendering: Move from external `Paper-doll` dependencies to a local, unified rendering approach.
- Improve Data Integrity: Facilitate manual corrections to alignment datasets.
- Performance: Standardize on `dangerouslySetInnerHTML` for all SVG rendering.

## Detailed Breakdown

### Step 1: Localizing Data & Logic
- [ ] **Create Local Loader**: Develop `scripts/datasetLoader.js` to handle loading local `./datasets/*.json` files, replacing the external `Dataset.load` functionality.
- [ ] **Catch Orphaned Logic**: Create new local namespaces to house logic from external `Paper-doll` and `Dataset` that isn't already covered by `outfitter-svg.js`.
- [ ] **Cleanup `index.html`**: Remove `<script>` tags for external `gizmo-atheneum` rendering/dataset namespaces and add local counterparts.
- [ ] **Refactor `outfitter.js`**: Update to use local `datasetLoader` and new local logic namespaces, removing all `gizmo-atheneum` rendering dependencies.
### Step 2: Update Diagnostics Application
- [ ] **Localize diagnostic data**: Update the diagnostic tool to load local dataset JSONs.
- [ ] **Implement manual correction workflow**: Add functionality in `diagnostics/` to update and save the `*.json` files in `./datasets/` directly for iterative alignment corrections.

### Step 3: Modernize Rendering
- [ ] **Integrate `SvgClick`**: Integrate `SvgClick` for interactive character components.
- [ ] **Consolidated Refactoring**: Refactor `outfitter-svg.js` and the new local namespaces together, standardizing on the `dangerouslySetInnerHTML` approach for all SVG elements.
- [ ] **Update `outfitter.js`**: Transition to new rendering methods, ensuring string generation is centralized.
### Step 4: Data Validation
- [ ] Create JSON schemas and validation logic for both the `dataset` definitions and `schematic` configurations.

### Step 5: Final Review & Re-generalization
- [ ] **Migrate to Namespaces**: Migrate rendering logic from `outfitter-svg` into the new localized namespaces created in Step 1.
- [ ] **Re-generalize**: Move these stable, centralized namespaces back into `gizmo-atheneum` for cross-project reuse.

