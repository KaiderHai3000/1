// Erzeugt Bestatter-Kooperation-Sterbegeld.pdf aus onepager.html
// Aufruf: node bestatter-onepager/build-pdf.cjs   (benötigt Playwright mit Chromium)
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.join(__dirname, 'onepager.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: path.join(__dirname, 'Bestatter-Kooperation-Sterbegeld.pdf'),
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
})();
