/**
 * Text Sizing - Binary Search Implementation
 * 
 * Option 1: Binary Search
 * Iteratively narrows the font size range to find the optimal size that fits the frame.
 * Most accurate and handles word-wrap naturally.
 */
namespace("TextSizingBinarySearch", {}, function({}) {
  const MIN_FONT_SIZE = 1;
  const MAX_FONT_SIZE = 200;
  const PRECISION = 0.5; // Stop when range is smaller than this

  /**
   * Measure text with word-wrap at a given font size
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to measure
   * @param {number} fontSize - Font size to test
   * @param {number} maxWidth - Maximum width for word-wrap
   * @returns {Object} {width, height, lines}
   */
  function measureTextWithWrap(ctx, text, fontSize, maxWidth) {
    ctx.font = `${fontSize}px sans-serif`;
    const lineHeight = fontSize * 1.2;
    
    let lines = [];
    let currentLine = '';
    
    text.split(' ').forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) lines.push(currentLine);
    
    const width = Math.max(...lines.map(line => ctx.measureText(line).width));
    const height = lines.length * lineHeight;
    
    return { width, height, lines };
  }

  /**
   * Find optimal font size using binary search
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to fit
   * @param {number} frameWidth - Frame width
   * @param {number} frameHeight - Frame height
   * @returns {number} Optimal font size
   */
  function findOptimalSize(ctx, text, frameWidth, frameHeight) {
    let min = MIN_FONT_SIZE;
    let max = MAX_FONT_SIZE;
    let bestSize = MIN_FONT_SIZE;
    
    while (max - min > PRECISION) {
      const mid = (min + max) / 2;
      const { width, height } = measureTextWithWrap(ctx, text, mid, frameWidth);
      
      if (width <= frameWidth && height <= frameHeight) {
        bestSize = mid;
        min = mid;
      } else {
        max = mid;
      }
    }
    
    return bestSize;
  }

  return {
    findOptimalSize,
    measureTextWithWrap
  };
});
