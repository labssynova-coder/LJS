const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });

  const screenshotDir = path.resolve('D:/Jewelry store/screenshots');

  const pages = [
    { name: '01-homepage', url: 'http://localhost:8000/' },
    { name: '02-shop', url: 'http://localhost:8000/shop/' },
    { name: '03-categories', url: 'http://localhost:8000/categories/' },
    { name: '04-login', url: 'http://localhost:8000/accounts/login/' },
    { name: '05-register', url: 'http://localhost:8000/accounts/register/' },
    { name: '06-search-gold', url: 'http://localhost:8000/search/?q=gold' },
    { name: '09-cart', url: 'http://localhost:8000/cart/' },
  ];

  const page = await context.newPage();
  const results = [];

  // Collect console errors across all navigations
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
    }
  });

  // ---- Screenshot static URL pages ----
  for (const p of pages) {
    consoleErrors.length = 0;
    try {
      const response = await page.goto(p.url, { waitUntil: 'networkidle', timeout: 15000 });
      const status = response ? response.status() : 'no response';
      const screenshotPath = path.join(screenshotDir, `${p.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      results.push({
        page: p.name,
        url: p.url,
        status,
        errors: [...consoleErrors],
        currentUrl: page.url(),
      });
      console.log(`[OK] ${p.name} - HTTP ${status} - saved to ${screenshotPath}`);
    } catch (err) {
      results.push({
        page: p.name,
        url: p.url,
        status: 'error',
        errors: [err.message],
        currentUrl: page.url(),
      });
      console.log(`[ERROR] ${p.name} - ${err.message}`);
    }
  }

  // ---- Screenshot product detail page (click first product from homepage) ----
  consoleErrors.length = 0;
  try {
    await page.goto('http://localhost:8000/', { waitUntil: 'networkidle', timeout: 15000 });
    // Find first product link
    const productLink = await page.$('a[href*="/product/"], a[href*="/detail/"], .product-card a, .product a, .card a');
    if (productLink) {
      const href = await productLink.getAttribute('href');
      console.log(`Found product link: ${href}`);
      await productLink.click();
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      const currentUrl = page.url();
      const screenshotPath = path.join(screenshotDir, '07-product-detail.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });
      results.push({
        page: '07-product-detail',
        url: currentUrl,
        status: 200,
        errors: [...consoleErrors],
        currentUrl,
      });
      console.log(`[OK] 07-product-detail - saved to ${screenshotPath}`);
    } else {
      // Try a different selector approach
      const allLinks = await page.$$('a');
      let productUrl = null;
      for (const link of allLinks) {
        const href = await link.getAttribute('href');
        if (href && (href.includes('/product') || href.includes('/detail'))) {
          productUrl = href;
          break;
        }
      }
      if (productUrl) {
        const fullUrl = productUrl.startsWith('http') ? productUrl : `http://localhost:8000${productUrl}`;
        console.log(`Found product URL: ${fullUrl}`);
        await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 15000 });
        const screenshotPath = path.join(screenshotDir, '07-product-detail.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        results.push({
          page: '07-product-detail',
          url: fullUrl,
          status: 200,
          errors: [...consoleErrors],
          currentUrl: page.url(),
        });
        console.log(`[OK] 07-product-detail - saved to ${screenshotPath}`);
      } else {
        results.push({
          page: '07-product-detail',
          url: 'n/a',
          status: 'skipped',
          errors: ['No product link found on homepage'],
          currentUrl: page.url(),
        });
        console.log('[SKIP] 07-product-detail - no product link found');
      }
    }
  } catch (err) {
    results.push({
      page: '07-product-detail',
      url: 'n/a',
      status: 'error',
      errors: [err.message],
      currentUrl: page.url(),
    });
    console.log(`[ERROR] 07-product-detail - ${err.message}`);
  }

  // ---- Screenshot category products page (click first category from categories page) ----
  consoleErrors.length = 0;
  try {
    await page.goto('http://localhost:8000/categories/', { waitUntil: 'networkidle', timeout: 15000 });
    const categoryLink = await page.$('a[href*="/category/"], a[href*="/categories/"], .category-card a, .category a');
    if (categoryLink) {
      const href = await categoryLink.getAttribute('href');
      console.log(`Found category link: ${href}`);
      await categoryLink.click();
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      const currentUrl = page.url();
      const screenshotPath = path.join(screenshotDir, '08-category-products.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });
      results.push({
        page: '08-category-products',
        url: currentUrl,
        status: 200,
        errors: [...consoleErrors],
        currentUrl,
      });
      console.log(`[OK] 08-category-products - saved to ${screenshotPath}`);
    } else {
      const allLinks = await page.$$('a');
      let catUrl = null;
      for (const link of allLinks) {
        const href = await link.getAttribute('href');
        if (href && href.includes('/category')) {
          catUrl = href;
          break;
        }
      }
      if (catUrl) {
        const fullUrl = catUrl.startsWith('http') ? catUrl : `http://localhost:8000${catUrl}`;
        console.log(`Found category URL: ${fullUrl}`);
        await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 15000 });
        const screenshotPath = path.join(screenshotDir, '08-category-products.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        results.push({
          page: '08-category-products',
          url: fullUrl,
          status: 200,
          errors: [...consoleErrors],
          currentUrl: page.url(),
        });
        console.log(`[OK] 08-category-products - saved to ${screenshotPath}`);
      } else {
        results.push({
          page: '08-category-products',
          url: 'n/a',
          status: 'skipped',
          errors: ['No category link found on categories page'],
          currentUrl: page.url(),
        });
        console.log('[SKIP] 08-category-products - no category link found');
      }
    }
  } catch (err) {
    results.push({
      page: '08-category-products',
      url: 'n/a',
      status: 'error',
      errors: [err.message],
      currentUrl: page.url(),
    });
    console.log(`[ERROR] 08-category-products - ${err.message}`);
  }

  await browser.close();

  // Print summary
  console.log('\n========== SUMMARY ==========');
  for (const r of results) {
    console.log(`\n--- ${r.page} ---`);
    console.log(`  URL navigated: ${r.url}`);
    console.log(`  Final URL: ${r.currentUrl}`);
    console.log(`  HTTP status: ${r.status}`);
    console.log(`  Console errors: ${r.errors.length > 0 ? r.errors.join('; ') : 'none'}`);
  }
})();