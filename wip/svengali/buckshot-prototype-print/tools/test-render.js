const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen for console messages from the browser
  page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.text()}`));

  const url = `file://${path.resolve(__dirname, '../index.html')}`;
  console.log(`Loading: ${url}`);
  
  await page.goto(url);

  // Wait for the renderer to finish
  await page.waitForFunction(() => window.rendererDone === true);
  // Take a screenshot of the page area
  const pageElement = await page.$('.page');
  await pageElement.screenshot({ path: path.resolve(__dirname, 'preview.png') });
  
  console.log('Screenshot saved to wip/svengali/buckshot-prototype-print/tools/preview.png');
  
  await browser.close();
})();

