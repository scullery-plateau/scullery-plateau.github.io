/**
 * Text Sizing Initialization
 * 
 * Include this file after loading the namespace framework and all text sizing implementations.
 * Usage example:
 * 
 *   // Import a specific text sizing implementation
 *   const binarySearch = importNamespace("TextSizingBinarySearch");
 *   const fontSize = binarySearch.findOptimalSize(ctx, text, width, height);
 * 
 *   // Or import multiple implementations at once
 *   const {TextSizingBinarySearch, TextSizingProportionalScale} = imports([
 *     "TextSizingBinarySearch",
 *     "TextSizingProportionalScale"
 *   ]);
 */

// Optional: Make implementations globally available
window.TextSizing = {
  BinarySearch: () => importNamespace("TextSizingBinarySearch"),
  ProportionalScale: () => importNamespace("TextSizingProportionalScale"),
  ShrinkFromMaximum: () => importNamespace("TextSizingShrinkFromMaximum"),
  AreaBasedEstimate: () => importNamespace("TextSizingAreaBasedEstimate")
};
