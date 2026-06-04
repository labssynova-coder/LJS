const { chromium } = require('playwright');
const path = require('path');

const BASE = 'https://labssynova-coder.github.io/LJS';
const outDir = path.resolve('D:/Jewelry store/docs/demo');

const screenshots = [
  // Storefront
  { url: `${BASE}/#/`, file: '01-homepage.png', expectTitle: 'LJS' },
  { url: `${BASE}/#/shop`, file: '02-shop.png', expectTitle: 'Shop' },
  { url: `${BASE}/#/categories`, file: '03-categories.png', expectTitle: 'Categories' },
  { url: `${BASE}/#/product/gold-rado-watch`, file: '04-product-detail.png', expectTitle: 'Gold Rado' },
  { url: `${BASE}/#/login`, file: '05-login.png', expectTitle: 'Login' },
  { url: `${BASE}/#/register`, file: '06-register.png', expectTitle: 'Register' },
  { url: `${BASE}/#/search?q=gold`, file: '07-search.png', expectTitle: 'Search' },
  { url: `${BASE}/#/checkout`, file: '08-checkout.png', expectTitle: 'Checkout', setup: 'cart' },
  { url: `${BASE}/#/cart`, file: '09-cart.png', expectTitle: 'Cart', setup: 'cart' },
  // Admin
  { url: `${BASE}/admin/`, file: '10-admin-dashboard.png', expectTitle: 'Admin', admin: true },
  { url: `${BASE}/admin/#/products`, file: '11-admin-products.png', expectTitle: 'Admin', admin: true },
  { url: `${BASE}/admin/#/categories`, file: '12-admin-categories.png', expectTitle: 'Admin', admin: true },
  { url: `${BASE}/admin/#/orders`, file: '13-admin-orders.png', expectTitle: 'Admin', admin: true },
  // More storefront
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
    // Use a fresh context for each screenshot to avoid caching
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });

    const page = await context.newPage();
    console.log(`Capturing: ${file} (${url})`);

    try {
      if (setup === 'cart') {
        // Load base page first to set localStorage
        await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.evaluate(() => {
          localStorage.setItem('ljs_cart', JSON.stringify({ '1': 1, '9': 1, '18': 1 }));
        });
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } else if (setup === 'wishlist') {
        await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.evaluate(() => {
          localStorage.setItem('ljs_wishlist', JSON.stringify(['1', '9', '18']));
        });
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } else {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      }

      // Wait for JS to render
      await page.waitForTimeout(3000);

      // Verify page is correct before screenshot
      const title = await page.title();
      if (title.includes('Not Found') || title.includes('Page Not Found')) {
        console.log(`  SKIP: ${file} — page shows "Not Found" (title: ${title})`);
        errors++;
        await context.close();
        continue;
      }

      if (expectTitle && !title.includes(expectTitle)) {
        console.log(`  WARNING: ${file} — title "${title}" doesn't contain "${expectTitle}"`);
      }

      // For storefront: verify app-content has real content
      if (!admin) {
        const content = await page.evaluate(() => {
          const el = document.getElementById('app-content');
          return el ? el.innerHTML.length : 0;
        });
        if (content < 100) {
          console.log(`  SKIP: ${file} — app-content too short (${content} chars), likely empty`);
          errors++;
          await context.close();
          continue;
        }
      }

      // For admin: verify app-screen is active (login was bypassed)
      if (admin) {
        const appActive = await page.evaluate(() => {
          const el = document.getElementById('app-screen');
          return el ? el.classList.contains('active') : false;
        });
        if (!appActive) {
          console.log(`  SKIP: ${file} — admin app-screen not active (login not bypassed)`);
          errors++;
          await context.close();
          continue;
        }
      }

      const filePath = path.join(outDir, file);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`  OK: ${file} (title: ${title})`);

    } catch (err) {
      console.error(`  ERROR: ${file}: ${err.message}`);
      errors++;
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log(`\nDone. ${errors} errors.`);
  process.exit(errors > 0 ? 1 : 0);
})();