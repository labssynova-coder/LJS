const { chromium } = require('playwright');
const path = require('path');

const BASE = 'https://labssynova-coder.github.io/LJS';
const outDir = path.resolve('D:/Jewelry store/docs/demo');

const screenshots = [
  // Storefront
  { url: `${BASE}/`, file: '01-homepage.png' },
  { url: `${BASE}/#/shop`, file: '02-shop.png' },
  { url: `${BASE}/#/categories`, file: '03-categories.png' },
  { url: `${BASE}/#/product/gold-rado-watch`, file: '04-product-detail.png' },
  { url: `${BASE}/#/login`, file: '05-login.png' },
  { url: `${BASE}/#/register`, file: '06-register.png' },
  { url: `${BASE}/#/search?q=gold`, file: '07-search.png' },
  // Checkout needs cart data
  { url: `${BASE}/#/checkout`, file: '08-checkout.png', setup: 'cart' },
  { url: `${BASE}/#/cart`, file: '09-cart.png', setup: 'cart' },
  // New pages
  { url: `${BASE}/#/contact`, file: '14-contact.png' },
  { url: `${BASE}/#/faq`, file: '15-faq.png' },
  { url: `${BASE}/#/about`, file: '16-about.png' },
  { url: `${BASE}/#/order-placed`, file: '17-order-placed.png' },
  { url: `${BASE}/#/terms`, file: '18-terms.png' },
  { url: `${BASE}/#/privacy`, file: '19-privacy.png' },
  { url: `${BASE}/#/returns`, file: '20-returns.png' },
  { url: `${BASE}/#/shipping`, file: '21-shipping.png' },
  // Wishlist needs wishlist data
  { url: `${BASE}/#/wishlist`, file: '22-wishlist.png', setup: 'wishlist' },
  { url: `${BASE}/#/blog`, file: '23-blog.png' },
  { url: `${BASE}/#/account`, file: '24-account.png' },
  // Admin
  { url: `${BASE}/admin/`, file: '10-admin-dashboard.png' },
  { url: `${BASE}/admin/#/products`, file: '11-admin-products.png' },
  { url: `${BASE}/admin/#/categories`, file: '12-admin-categories.png' },
  { url: `${BASE}/admin/#/orders`, file: '13-admin-orders.png' },
  { url: `${BASE}/admin/#/settings`, file: '25-admin-settings.png' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  for (const { url, file, setup } of screenshots) {
    console.log(`Navigating to: ${url}`);
    const page = await context.newPage();
    try {
      // Pre-populate localStorage before navigating for pages that need state
      if (setup === 'cart') {
        await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.evaluate(() => {
          localStorage.setItem('ljs_cart', JSON.stringify({ '1': 1, '9': 1, '18': 1 }));
        });
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
      } else if (setup === 'wishlist') {
        await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.evaluate(() => {
          localStorage.setItem('ljs_wishlist', JSON.stringify(['1', '9', '18']));
        });
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
      } else {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      }

      // Extra wait for JS rendering (SPA routing, animations, etc.)
      await page.waitForTimeout(3000);
      const filePath = path.join(outDir, file);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`  Saved: ${filePath}`);
    } catch (err) {
      console.error(`  ERROR screenshotting ${url}: ${err.message}`);
      // Try again with a simpler wait
      try {
        await page.waitForTimeout(2000);
        const filePath = path.join(outDir, file);
        await page.screenshot({ path: filePath, fullPage: true });
        console.log(`  Saved on retry: ${filePath}`);
      } catch (err2) {
        console.error(`  RETRY FAILED for ${url}: ${err2.message}`);
      }
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('Done.');
})();