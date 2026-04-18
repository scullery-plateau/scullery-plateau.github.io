/**
 * Text Sizing - Shrink from Maximum Implementation
 * 
 * Option 3: Shrink-from-Maximum
 * Starts at a large font size and decreases by fixed steps until text fits.
 * Conceptually simple but slower than other approaches.
 */
namespace("TextSizingShrinkFromMaximum", {}, function({}) {
  const STEP_SIZE = 1; // Pixels to decrease per iteration

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
   * Find optimal font size by shrinking from maximum
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to fit
   * @param {number} frameWidth - Frame width
   * @param {number} frameHeight - Frame height
   * @returns {number} Optimal font size
   */
  function findOptimalSize(ctx, text, frameWidth, frameHeight) {
    let fontSize = frameHeight; // Start at frame height
    
    while (fontSize > 1) {
      const { width, height } = measureTextWithWrap(ctx, text, fontSize, frameWidth);
      
      if (width <= frameWidth && height <= frameHeight) {
        return fontSize;
      }
      
      fontSize -= STEP_SIZE;
    }
    
    return 1;
  }

  return {
    findOptimalSize,
    measureTextWithWrap
  };
});
