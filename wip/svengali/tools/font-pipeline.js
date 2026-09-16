const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const config = require('./harvester-config.json');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const harvesterUrl = `file://${path.resolve(__dirname, 'harvester.html')}`;
  await page.goto(harvesterUrl);

  const charCodes = [];
  config.charRanges.forEach(([start, end]) => {
    for (let i = start; i <= end; i++) charCodes.push(i);
  });

  const sortedSizes = [...config.sizes].sort((a, b) => b - a);
  
  const rawData = {};
  const analysis = {};
  const finalData = {}; // Changed from finalRatios to store more data
  for (const font of config.fonts) {
    console.log(`Processing Font: ${font}...`);
    rawData[font] = {};
    analysis[font] = {};
    finalData[font] = {
      avgRatio: 0,
      charRatios: {}
    };

    let hAvgWTotal = 0;
    
    for (const size of sortedSizes) {
      console.log(`  - Harvesting ${size}px...`);
      
      const metrics = await page.evaluate(async ({ font, size, codes }) => {
        return await window.measureFont(font, size, codes);
      }, { font, size, codes: charCodes });

      rawData[font][size] = metrics;

      let totalCalculatedWidth = 0;
      let maxCalculatedWidth = 0;
      let maxAscent = 0;
      let maxDescent = 0;

      Object.values(metrics).forEach(m => {
        const calcW = Math.max(m.actualWidth, Math.ceil(m.width));
        // Calculate ratio per char relative to this size
        finalData[font].charRatios[m.char] = parseFloat((calcW / size).toFixed(4));

        totalCalculatedWidth += calcW;
        if (calcW > maxCalculatedWidth) maxCalculatedWidth = calcW;
        if (m.ascent > maxAscent) maxAscent = m.ascent;
        if (m.descent > maxDescent) maxDescent = m.descent;
      });

      const maxHeight = maxAscent + maxDescent;
      const avgWidth = Math.ceil(totalCalculatedWidth / charCodes.length);
      const hAvgW = maxHeight / avgWidth;
      hAvgWTotal += hAvgW;

      analysis[font][size] = {
        maxHeight,
        avgWidth,
        maxWidth: maxCalculatedWidth,
        hAvgW,
        hMaxW: maxHeight / maxCalculatedWidth,
        flagHeightOverflow: maxHeight > parseInt(size)
      };
    }

    finalData[font].avgRatio = parseFloat((hAvgWTotal / sortedSizes.length).toFixed(4));
  }

  // --- Output Generation ---
  const assetDir = path.resolve(__dirname, '../assets');
  if (!fs.existsSync(assetDir)) fs.mkdirSync(assetDir, { recursive: true });

  // Saving the full finalData structure
  fs.writeFileSync(path.join(assetDir, 'font-metrics.json'), JSON.stringify(finalData, null, 2));

  console.log('\nPipeline Complete!');
  console.log('- Runtime metrics saved to font-metrics.json');

  await browser.close();
})();

