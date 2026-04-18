/**
 * Text Sizing - Proportional Scale Implementation
 * 
 * Option 2: Proportional Scale from Reference Size
 * Measures text at a reference size, calculates scale factors, and adjusts with minimal passes.
 * Usually converges in 1-2 passes; simpler than binary search.
 */
namespace("TextSizingProportionalScale", {}, function({}) {
  const REFERENCE_SIZE = 16;

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
   * Find optimal font size using proportional scaling
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to fit
   * @param {number} frameWidth - Frame width
   * @param {number} frameHeight - Frame height
   * @returns {number} Optimal font size
   */
  function findOptimalSize(ctx, text, frameWidth, frameHeight) {
    // Measure at reference size
    let { width: refWidth, height: refHeight } = measureTextWithWrap(ctx, text, REFERENCE_SIZE, frameWidth);
    
    // Calculate scale factors
    const widthScale = frameWidth / refWidth;
    const heightScale = frameHeight / refHeight;
    const targetScale = Math.min(widthScale, heightScale);
    
    // Apply scale to get candidate size
    let fontSize = REFERENCE_SIZE * targetScale;
    
    // Verify and adjust if needed
    let { width, height } = measureTextWithWrap(ctx, text, fontSize, frameWidth);
    
    if (width > frameWidth || height > frameHeight) {
      // Correction pass: reduce further if needed
      const correctedScale = Math.min(frameWidth / width, frameHeight / height);
      fontSize *= correctedScale;
    }
    
    return fontSize;
  }

  return {
    findOptimalSize,
    measureTextWithWrap
  };
});
