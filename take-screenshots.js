const { chromium } = require('playwright');
const path = require('path');

const BASE = 'https://labssynova-coder.github.io/LJS';
const outDir = path.resolve('D:/Jewelry store/docs/demo');

const screenshots = [
  { url: `${BASE}/#/`, file: '01-homepage.png', expectTitle: 'LJS' },
  { url: `${BASE}/#/shop`, file: '02-shop.png', expectTitle: 'Shop' },
  { url: `${BASE}/#/categories`, file: '03-categories.png', expectTitle: 'Categories' },
  { url: `${BASE}/#/product/gold-rado-watch`, file: '04-product-detail.png', expectTitle: 'Gold Rado' },
  { url: `${BASE}/#/login`, file: '05-login.png', expectTitle: 'Login' },
  { url: `${BASE}/#/register`, file: '06-register.png', expectTitle: 'Register' },
  { url: `${BASE}/#/search?q=gold`, file: '07-search.png', expectTitle: 'Search' },
  { url: `${BASE}/#/checkout`, file: '08-checkout.png', expectTitle: 'Checkout', setup: 'cart' },
  { url: `${BASE}/#/cart`, file: '09-cart.png', expectTitle: 'Cart', setup: 'cart' },
  { url: `${BASE}/admin/`, file: '10-admin-dashboard.png', expectTitle: 'Admin', admin: true },
  { url: `${BASE}/admin/#/products`, file: '11-admin-products.png', expectTitle: 'Admin', admin: true },
  { url: `${BASE}/admin/#/categories`, file: '12-admin-categories.png', expectTitle: 'Admin', admin: true },
  { url: `${BASE}/admin/#/orders`, file: '13-admin-orders.png', expectTitle: 'Admin', admin: true },
  { url: `${BASE}/#/contact`, file: '14-contact.png', expectTitle: 'Contact' },
  { url: `${BASE}/#/faq`, file: '15-faq.png', expectTitle: 'FAQ' },
  { url: `${BASE}/#/about`, file: '16-about.png', expectTitle: 'About' },
  { url: `${BASE}/#/order-placed`, file: '17-order-placed.png', expectTitle: 'Order Placed' },
  { url: `${BASE}/#/terms`, file: '18-terms.png', expectTitle: 'Terms' },
  { url: `${BASE}/#/privacy`, file: '19-privacy.png', expectTitle: 'Privacy' },
  { url: `${BASE}/#/returns`, file: '20-returns.png', expectTitle: 'Returns' },
  { url: `${BASE}/#/shipping`, file: '21-shipping.png', expectTitle: 'Shipping' },
  { url: `${BASE}/#/wishlist`, file: '22-wishlist.png', expectTitle: 'Wishlist', setup: 'wishlist' },
  { url: `${BASE}/#/blog`, file: '23-blog.png', expectTitle: 'Blog' },
  { url: `${BASE}/#/account`, file: '24-account.png', expectTitle: 'Account' },
  { url: `${BASE}/admin/#/settings`, file: '25-admin-settings.png', expectTitle: 'Admin', admin: true },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  let errors = 0;

  for (const { url, file, expectTitle, setup, admin } of screenshots) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    console.log(`Capturing: ${file}`);

    try {
      if (setup === 'cart') {
        await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.evaluate(() => { localStorage.setItem('ljs_cart', JSON.stringify({ '1': 1, '9': 1, '18': 1 })); });
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } else if (setup === 'wishlist') {
        await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.evaluate(() => { localStorage.setItem('ljs_wishlist', JSON.stringify(['1', '9', '18'])); });
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } else {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      }

      await page.waitForTimeout(3000);

      const title = await page.title();
      if (title.includes('Not Found')) {
        console.log(`  SKIP: ${file} — page shows "Not Found"`);
        errors++;
        await context.close();
        continue;
      }

      if (!admin) {
        const contentLen = await page.evaluate(() => (document.getElementById('app-content') || {}).innerHTML?.length || 0);
        if (contentLen < 100) {
          console.log(`  SKIP: ${file} — empty content (${contentLen} chars)`);
          errors++;
          await context.close();
          continue;
        }
      } else {
        const appActive = await page.evaluate(() => document.getElementById('app-screen')?.classList.contains('active'));
        if (!appActive) {
          console.log(`  SKIP: ${file} — admin not logged in`);
          errors++;
          await context.close();
          continue;
        }
      }

      await page.screenshot({ path: path.join(outDir, file), fullPage: true });
      console.log(`  OK: ${file} (${title})`);
    } catch (err) {
      console.error(`  ERROR: ${file}: ${err.message}`);
      errors++;
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log(`\nDone. ${errors} errors.`);
})();