const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  const screenshotDir = path.resolve('D:/Jewelry store/screenshots');

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
    }
  });

  // Navigate to categories page and find all links
  consoleErrors.length = 0;
  await page.goto('http://localhost:8000/categories/', { waitUntil: 'networkidle', timeout: 15000 });

  // Get all links on the page
  const allLinks = await page.$$eval('a', links =>
    links.map(a => ({
      href: a.getAttribute('href'),
      text: a.textContent.trim().substring(0, 60),
      visible: a.offsetParent !== null
    }))
  );

  console.log('All links on categories page:');
  for (const link of allLinks) {
    if (link.href && link.visible) {
      console.log(`  [visible] ${link.href} -> "${link.text}"`);
    } else if (link.href) {
      console.log(`  [hidden]  ${link.href} -> "${link.text}"`);
    }
  }

  // Find a category link that is NOT just /categories/
  const catLink = allLinks.find(l => l.visible && l.href && l.href.includes('/category') && !l.href.endsWith('/categories/'));
  if (catLink) {
    console.log(`\nClicking category: ${catLink.href} -> "${catLink.text}"`);
    const fullUrl = catLink.href.startsWith('http') ? catLink.href : `http://localhost:8000${catLink.href}`;
    await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 15000 });
    const screenshotPath = path.join(screenshotDir, '08-category-products.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`[OK] 08-category-products - saved to ${screenshotPath}`);
    console.log(`  URL: ${page.url()}`);
    console.log(`  Console errors: ${consoleErrors.join('; ') || 'none'}`);
  } else {
    console.log('No visible category link found (other than /categories/ itself)');
    // Try directly navigating to a likely category URL
    // First, check the HTML for category patterns
    const html = await page.content();
    const catMatches = html.match(/href="\/categories?\/([^"]+)"/g);
    console.log('Category href matches:', catMatches);
  }

  await browser.close();
})();