/**
 * Text Sizing for Template - Multiple Implementation Options
 * Each namespace provides a different approach to dynamically sizing text
 * to fit within a defined frame on canvas.
 */

/**
 * Option 1: Binary Search
 * Iteratively narrows the font size range to find the optimal size that fits the frame.
 * Most accurate and handles word-wrap naturally.
 */
const TextSizingBinarySearch = (() => {
  const MIN_FONT_SIZE = 1;
  const MAX_FONT_SIZE = 200;
  const PRECISION = 0.5; // Stop when range is smaller than this

  /**
   * Measure text with word-wrap at a given font size
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to measure
   * @param {number} fontSize - Font size to test
   * @param {number} maxWidth - Maximum width for word-wrap
   * @returns {Object} {width, height}
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
})();

/**
 * Option 2: Proportional Scale from Reference Size
 * Measures text at a reference size, calculates scale factors, and adjusts with minimal passes.
 * Usually converges in 1-2 passes; simpler than binary search.
 */
const TextSizingProportionalScale = (() => {
  const REFERENCE_SIZE = 16;

  /**
   * Measure text with word-wrap at a given font size
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to measure
   * @param {number} fontSize - Font size to test
   * @param {number} maxWidth - Maximum width for word-wrap
   * @returns {Object} {width, height}
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
})();

/**
 * Option 3: Shrink-from-Maximum
 * Starts at a large font size and decreases by fixed steps until text fits.
 * Conceptually simple but slower than other approaches.
 */
const TextSizingShrinkFromMaximum = (() => {
  const STEP_SIZE = 1; // Pixels to decrease per iteration

  /**
   * Measure text with word-wrap at a given font size
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to measure
   * @param {number} fontSize - Font size to test
   * @param {number} maxWidth - Maximum width for word-wrap
   * @returns {Object} {width, height}
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
})();

/**
 * Option 4: Area-Based Estimate + Correction
 * Uses a heuristic based on character count and frame area, then corrects with measurement.
 * Fast in common cases; optionally refines with binary search if estimate is far off.
 */
const TextSizingAreaBasedEstimate = (() => {
  const CORRECTION_THRESHOLD = 0.2; // 20% tolerance for refinement
  const AVERAGE_CHAR_WIDTH_RATIO = 0.6; // Empirical ratio for typical fonts

  /**
   * Measure text with word-wrap at a given font size
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to measure
   * @param {number} fontSize - Font size to test
   * @param {number} maxWidth - Maximum width for word-wrap
   * @returns {Object} {width, height}
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
   * Estimate initial font size from area heuristic
   * @param {string} text - Text to measure
   * @param {number} frameWidth - Frame width
   * @param {number} frameHeight - Frame height
   * @returns {number} Estimated font size
   */
  function estimateFontSize(text, frameWidth, frameHeight) {
    const charCount = text.length;
    const frameArea = frameWidth * frameHeight;
    
    // Heuristic: font size proportional to available area per character
    const areaPerChar = frameArea / charCount;
    const estimatedSize = Math.sqrt(areaPerChar) * AVERAGE_CHAR_WIDTH_RATIO;
    
    return Math.max(1, estimatedSize);
  }

  /**
   * Find optimal font size using area-based estimate with correction
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to fit
   * @param {number} frameWidth - Frame width
   * @param {number} frameHeight - Frame height
   * @returns {number} Optimal font size
   */
  function findOptimalSize(ctx, text, frameWidth, frameHeight) {
    // Initial estimate
    let fontSize = estimateFontSize(text, frameWidth, frameHeight);
    let { width, height } = measureTextWithWrap(ctx, text, fontSize, frameWidth);
    
    // Check if correction is needed
    const widthRatio = width / frameWidth;
    const heightRatio = height / frameHeight;
    const maxRatio = Math.max(widthRatio, heightRatio);
    
    if (maxRatio > 1 + CORRECTION_THRESHOLD || maxRatio < 1 - CORRECTION_THRESHOLD) {
      // Apply correction
      fontSize *= (1 / maxRatio) * 0.95; // 0.95 adds safety margin
      
      // Optional: verify correction
      const result = measureTextWithWrap(ctx, text, fontSize, frameWidth);
      if (result.width > frameWidth || result.height > frameHeight) {
        fontSize *= Math.min(frameWidth / result.width, frameHeight / result.height) * 0.95;
      }
    }
    
    return Math.max(1, fontSize);
  }

  return {
    findOptimalSize,
    measureTextWithWrap,
    estimateFontSize
  };
})();
