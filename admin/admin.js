/* ============================================================
   LJS Admin Panel - SPA with Mock Data & Demo Mode
   ============================================================ */

// ---- Demo Data ----
const DEMO_DATA = {
  dashboard: {
    stats: {
      totalOrders: 47,
      totalRevenue: 28560,
      pendingOrders: 8,
      totalProducts: 24
    },
    recentOrders: [
      { id: 47, customer: 'Marie Dupont', total: '$1,299.00', status: 'Pending', date: '2026-06-02' },
      { id: 46, customer: 'Ahmed Benali', total: '$580.00', status: 'Processing', date: '2026-06-01' },
      { id: 45, customer: 'Sarah Johnson', total: '$2,150.00', status: 'Shipped', date: '2026-05-31' },
      { id: 44, customer: 'Li Wei', total: '$340.00', status: 'Delivered', date: '2026-05-30' },
      { id: 43, customer: 'Emma Davis', total: '$890.00', status: 'Pending', date: '2026-05-29' }
    ],
    topProducts: [
      { name: 'Gold Star Earrings', sold: 15, revenue: '$6,300' },
      { name: 'Gold Necklace with Diamonds', sold: 8, revenue: '$7,200' },
      { name: 'Gold Rado Watch', sold: 12, revenue: '$4,800' }
    ]
  },
  products: [
    { id: 1, title: 'Anne Klein Gold Watch', slug: 'anne-klein-gold-watch', price: '$300.00', category: 'Watches', image: '../assets/images/products/Anne-Klein-Gold-Watch.jpg', isFeatured: false, is_active: true, shortDescription: 'Elegant gold watch from Anne Klein with a classic design.' },
    { id: 2, title: 'Gold Rado Watch', slug: 'gold-rado-watch', price: '$400.00', category: 'Watches', image: '../assets/images/products/Gold-and-Steel-Rado-Watch-with-Black-Dial.jpg', isFeatured: true, is_active: true, shortDescription: 'Premium gold Rado watch with a black dial and steel accents.' },
    { id: 3, title: 'Colorful Beads Necklace', slug: 'colorful-beads-necklace', price: '$20.00', category: 'Bead Necklaces', image: '../assets/images/products/Beads-Necklace.jpg', isFeatured: false, is_active: true, shortDescription: 'Vibrant and colorful beads necklace for everyday wear.' },
    { id: 4, title: 'Thick Gold and Diamond Ring', slug: 'thick-gold-diamond-ring', price: '$500.00', category: 'Rings', image: '../assets/images/products/gold-and-diamond-ring.jpg', isFeatured: true, is_active: true, shortDescription: 'Thick gold ring adorned with brilliant diamonds.' },
    { id: 5, title: 'Gold Bracelet Indian Style', slug: 'gold-bracelet-indian-style', price: '$550.00', category: 'Bracelets', image: '../assets/images/products/Gold-Bracelets.jpg', isFeatured: true, is_active: true, shortDescription: 'Traditional Indian style gold bracelet with intricate patterns.' },
    { id: 6, title: 'Gold Bracelet Thin', slug: 'gold-bracelet-thin', price: '$340.00', category: 'Bracelets', image: '../assets/images/products/Gold-Bracelet.jpg', isFeatured: false, is_active: true, shortDescription: 'Thin and elegant gold bracelet for subtle sophistication.' },
    { id: 7, title: 'Gold Casio Touch Watch', slug: 'gold-casio-touch-watch', price: '$600.00', category: 'Watches', image: '../assets/images/products/Gold-Casio-Touch-Watch.jpg', isFeatured: false, is_active: true, shortDescription: 'Modern Casio touch watch in a luxurious gold finish.' },
    { id: 8, title: 'Gold Leafy Earrings', slug: 'gold-leafy-earrings', price: '$230.00', category: 'Earrings', image: '../assets/images/products/Gold-Leafy-Earrings.jpg', isFeatured: false, is_active: true, shortDescription: 'Delicate leafy design gold earrings for a nature-inspired look.' },
    { id: 9, title: 'Gold Necklace with Diamonds', slug: 'gold-necklace-diamonds', price: '$900.00', category: 'Necklaces', image: '../assets/images/products/Gold-Necklace-with-Diamonds.jpg', isFeatured: true, is_active: true, shortDescription: 'Stunning gold necklace embellished with sparkling diamonds.' },
    { id: 10, title: 'Gold Ring with Blue Stones', slug: 'gold-ring-blue-stones', price: '$480.00', category: 'Rings', image: '../assets/images/products/Gold-Ring-with-Blue-Stones.jpg', isFeatured: false, is_active: true, shortDescription: 'Gold ring featuring striking blue stones in an elegant setting.' },
    { id: 11, title: 'Gold Ring with Pink Stone', slug: 'gold-ring-pink-stone', price: '$499.00', category: 'Rings', image: '../assets/images/products/Gold-ring-with-pink-stone-and-diamonds.jpg', isFeatured: false, is_active: true, shortDescription: 'Beautiful gold ring with a pink stone and diamond accents.' },
    { id: 12, title: 'Gold Ring with Diamond', slug: 'gold-ring-diamond', price: '$990.00', category: 'Rings', image: '../assets/images/products/Gold-Ring-with-White-Stone.jpg', isFeatured: true, is_active: true, shortDescription: 'Luxurious gold ring featuring a prominent diamond centerpiece.' },
    { id: 13, title: 'Gold Star Earrings', slug: 'gold-star-earrings', price: '$420.00', category: 'Earrings', image: '../assets/images/products/Gold-Star-Earrings.jpg', isFeatured: true, is_active: true, shortDescription: 'Eye-catching star-shaped gold earrings for a glamorous look.' },
    { id: 14, title: 'Gold Watch with White Dial and Diamonds', slug: 'gold-watch-white-dial-diamonds', price: '$780.00', category: 'Watches', image: '../assets/images/products/Gold-Watch-with-White-Dial-and-Diamonds.jpg', isFeatured: true, is_active: true, shortDescription: 'Gold watch featuring a white dial and diamond-encrusted bezel.' },
    { id: 15, title: 'Gold Watch with White Dial', slug: 'gold-watch-white-dial', price: '$650.00', category: 'Watches', image: '../assets/images/products/Gold-Watch-with-White-Dial.jpg', isFeatured: false, is_active: true, shortDescription: 'Classic gold watch with a clean white dial for timeless elegance.' },
    { id: 16, title: 'Gold Mangalsutra', slug: 'gold-mangalsutra', price: '$500.00', category: 'Bead Necklaces', image: '../assets/images/products/Mangalsutra-with-Gold-Locket.jpg', isFeatured: false, is_active: true, shortDescription: 'Traditional gold mangalsutra with a beautiful gold locket.' },
    { id: 17, title: 'Mr Boho Gold Watch', slug: 'mr-boho-gold-watch', price: '$680.00', category: 'Watches', image: '../assets/images/products/Mr-Boho-Gold-Watch.jpg', isFeatured: false, is_active: true, shortDescription: 'Trendy Mr Boho gold watch for the fashion-forward individual.' },
    { id: 18, title: 'Platinum Ring with Diamonds', slug: 'platinum-ring-diamonds', price: '$1,999.00', category: 'Rings', image: '../assets/images/products/platinum-ring-with-diamonds.jpg', isFeatured: true, is_active: true, shortDescription: 'Premium platinum ring adorned with brilliant-cut diamonds.' },
    { id: 19, title: 'Silver Earrings with Blue Stones', slug: 'silver-earrings-blue-stones', price: '$270.00', category: 'Earrings', image: '../assets/images/products/Silver-Earrings-with-Blue-Stone.jpg', isFeatured: false, is_active: true, shortDescription: 'Elegant silver earrings featuring beautiful blue stones.' },
    { id: 20, title: 'Silver Necklace with Big Diamond', slug: 'silver-necklace-big-diamond', price: '$800.00', category: 'Necklaces', image: '../assets/images/products/Silver-Necklace-with-Big-Diamond.jpg', isFeatured: true, is_active: true, shortDescription: 'Sophisticated silver necklace with a stunning large diamond.' },
    { id: 21, title: 'Silver Ring with Blue Stone', slug: 'silver-ring-blue-stone', price: '$350.00', category: 'Rings', image: '../assets/images/products/Silver-Ring-with-Blue-Stone-and-Diamonds.jpg', isFeatured: false, is_active: true, shortDescription: 'Silver ring with a captivating blue stone and diamond details.' },
    { id: 22, title: 'Silver Ring with Small Diamonds', slug: 'silver-ring-small-diamonds', price: '$550.00', category: 'Rings', image: '../assets/images/products/SIlver-Ring-with-Diamonds.jpg', isFeatured: false, is_active: true, shortDescription: 'Refined silver ring accented with small brilliant diamonds.' },
    { id: 23, title: 'Silver Ring with Red Stone', slug: 'silver-ring-red-stone', price: '$488.00', category: 'Rings', image: '../assets/images/products/Silver-Ring-with-Red-Stone.jpg', isFeatured: false, is_active: true, shortDescription: 'Striking silver ring featuring a vivid red stone.' },
    { id: 24, title: 'Gold BitCoin', slug: 'gold-bitcoin', price: '$500.00', category: 'Gifts', image: '../assets/images/products/gold-bitcoin.jpg', isFeatured: false, is_active: true, shortDescription: 'Unique gold Bitcoin collectible, a perfect luxury gift.' }
  ],
  categories: [
    { id: 1, title: 'Necklaces', slug: 'necklaces', image: '../assets/images/categories/necklaces.jpg', is_active: true, is_featured: true },
    { id: 2, title: 'Rings', slug: 'rings', image: '../assets/images/categories/rings.jpg', is_active: true, is_featured: true },
    { id: 3, title: 'Bracelets', slug: 'bracelets', image: '../assets/images/categories/bracelets.jpg', is_active: true, is_featured: false },
    { id: 4, title: 'Earrings', slug: 'earrings', image: '../assets/images/categories/ear-rings.jpg', is_active: true, is_featured: true },
    { id: 5, title: 'Watches', slug: 'watches', image: '../assets/images/categories/watches.jpg', is_active: true, is_featured: true },
    { id: 6, title: 'Bead Necklaces', slug: 'bead-necklaces', image: '../assets/images/categories/bead-necklace.jpg', is_active: true, is_featured: false },
    { id: 7, title: 'Gifts', slug: 'gifts', image: '../assets/images/categories/gifts.jpg', is_active: true, is_featured: false }
  ],
  orders: [
    { id: 47, customer: 'Marie Dupont', email: 'marie@example.com', total: '$1,299.00', status: 'Pending', date: '2026-06-02', items: [{ product: 'Gold Necklace with Diamonds', quantity: 1, price: '$900.00' }, { product: 'Gold Leafy Earrings', quantity: 1, price: '$230.00' }, { product: 'Colorful Beads Necklace', quantity: 1, price: '$20.00' }, { product: 'Shipping', quantity: 1, price: '$10.00' }] },
    { id: 46, customer: 'Ahmed Benali', email: 'ahmed@example.com', total: '$580.00', status: 'Processing', date: '2026-06-01', items: [{ product: 'Gold Rado Watch', quantity: 1, price: '$400.00' }, { product: 'Gold Mangalsutra', quantity: 1, price: '$500.00' }, { product: 'Shipping', quantity: 1, price: '$10.00' }] },
    { id: 45, customer: 'Sarah Johnson', email: 'sarah@example.com', total: '$2,150.00', status: 'Shipped', date: '2026-05-31', items: [{ product: 'Platinum Ring with Diamonds', quantity: 1, price: '$1,999.00' }, { product: 'Silver Ring with Blue Stone', quantity: 1, price: '$350.00' }, { product: 'Shipping', quantity: 1, price: '$10.00' }] },
    { id: 44, customer: 'Li Wei', email: 'liwei@example.com', total: '$340.00', status: 'Delivered', date: '2026-05-30', items: [{ product: 'Gold Bracelet Thin', quantity: 1, price: '$340.00' }, { product: 'Shipping', quantity: 1, price: '$10.00' }] },
    { id: 43, customer: 'Emma Davis', email: 'emma@example.com', total: '$890.00', status: 'Pending', date: '2026-05-29', items: [{ product: 'Gold Watch with White Dial and Diamonds', quantity: 1, price: '$780.00' }, { product: 'Gold Leafy Earrings', quantity: 1, price: '$230.00' }, { product: 'Shipping', quantity: 1, price: '$10.00' }] },
    { id: 42, customer: 'Carlos Rivera', email: 'carlos@example.com', total: '$1,420.00', status: 'Shipped', date: '2026-05-28', items: [{ product: 'Gold Ring with Diamond', quantity: 1, price: '$990.00' }, { product: 'Gold Star Earrings', quantity: 1, price: '$420.00' }, { product: 'Shipping', quantity: 1, price: '$10.00' }] }
  ]
};


// ---- Global State ----
let DEMO_MODE = false;
let isAuthenticated = false;
let currentRoute = '';


// ---- Static hosting detection ----
var IS_STATIC_HOST =
  window.location.hostname.endsWith('.github.io') ||
  window.location.protocol === 'file:' ||
  (window.location.port === '' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

// ---- Demo Detection ----
function detectDemoMode() {
  if (IS_STATIC_HOST) {
    enableDemoMode();
    return;
  }
  // Try to reach the real backend; if unreachable, enable demo mode
  var controller = new AbortController();
  var timeout = setTimeout(function () { controller.abort(); }, 2000);
  fetch('/api/health', { method: 'GET', signal: controller.signal })
    .then(function (res) {
      clearTimeout(timeout);
      if (res.ok) {
        DEMO_MODE = false;
      } else {
        enableDemoMode();
      }
    })
    .catch(function () {
      clearTimeout(timeout);
      enableDemoMode();
    });
}

function enableDemoMode() {
  DEMO_MODE = true;
  var banner = document.getElementById('demo-banner');
  if (banner) {
    banner.classList.add('visible');
  }
  document.body.classList.add('demo-mode');
  // Auto-authenticate in demo mode
  autoLogin();
}


// ---- API Fetch Wrapper ----
function apiFetch(path, options) {
  if (DEMO_MODE) {
    return demoApiFetch(path, options);
  }
  // Real backend fetch
  return fetch(path, options).then(function (res) {
    if (res.status === 401) {
      logout();
      throw new Error('Unauthorized');
    }
    return res.json();
  });
}

function demoApiFetch(path, options) {
  options = options || {};
  var method = (options.method || 'GET').toUpperCase();
  var body = options.body ? JSON.parse(options.body) : null;

  return new Promise(function (resolve) {
    // Simulate network delay
    setTimeout(function () {
      // GET routes
      if (method === 'GET') {
        if (/\/api\/products(\/|$)/.test(path) && !/\/\d+$/.test(path)) {
          resolve({ ok: true, json: function () { return Promise.resolve(DEMO_DATA.products); } });
          return;
        }
        if (/\/api\/categories(\/|$)/.test(path) && !/\/\d+$/.test(path)) {
          resolve({ ok: true, json: function () { return Promise.resolve(DEMO_DATA.categories); } });
          return;
        }
        if (/\/api\/orders(\/|$)/.test(path) && !/\/\d+$/.test(path)) {
          resolve({ ok: true, json: function () { return Promise.resolve(DEMO_DATA.orders); } });
          return;
        }
        if (/\/api\/dashboard/.test(path)) {
          resolve({ ok: true, json: function () { return Promise.resolve(DEMO_DATA.dashboard); } });
          return;
        }
        // Single resource lookups
        var productIdMatch = path.match(/\/api\/products\/(\d+)$/);
        if (productIdMatch) {
          var product = DEMO_DATA.products.find(function (p) { return p.id === parseInt(productIdMatch[1]); });
          resolve({ ok: true, json: function () { return Promise.resolve(product || null); } });
          return;
        }
        var categoryIdMatch = path.match(/\/api\/categories\/(\d+)$/);
        if (categoryIdMatch) {
          var category = DEMO_DATA.categories.find(function (c) { return c.id === parseInt(categoryIdMatch[1]); });
          resolve({ ok: true, json: function () { return Promise.resolve(category || null); } });
          return;
        }
        var orderIdMatch = path.match(/\/api\/orders\/(\d+)$/);
        if (orderIdMatch) {
          var order = DEMO_DATA.orders.find(function (o) { return o.id === parseInt(orderIdMatch[1]); });
          resolve({ ok: true, json: function () { return Promise.resolve(order || null); } });
          return;
        }
      }

      // POST — create
      if (method === 'POST') {
        if (/\/api\/products/.test(path) && body) {
          body.id = DEMO_DATA.products.length + 1;
          DEMO_DATA.products.unshift(body);
          showToast('Product created (simulated in demo mode)', 'success');
          resolve({ ok: true, json: function () { return Promise.resolve(body); } });
          return;
        }
        if (/\/api\/categories/.test(path) && body) {
          body.id = DEMO_DATA.categories.length + 1;
          DEMO_DATA.categories.unshift(body);
          showToast('Category created (simulated in demo mode)', 'success');
          resolve({ ok: true, json: function () { return Promise.resolve(body); } });
          return;
        }
      }

      // PUT — update
      if (method === 'PUT') {
        if (/\/api\/products\/\d+/.test(path) && body) {
          var pid = parseInt(path.match(/\/api\/products\/(\d+)/)[1]);
          var pidx = DEMO_DATA.products.findIndex(function (p) { return p.id === pid; });
          if (pidx >= 0) {
            Object.assign(DEMO_DATA.products[pidx], body);
            showToast('Product updated (simulated in demo mode)', 'success');
            resolve({ ok: true, json: function () { return Promise.resolve(DEMO_DATA.products[pidx]); } });
            return;
          }
        }
        if (/\/api\/orders\/\d+/.test(path) && body) {
          var oid = parseInt(path.match(/\/api\/orders\/(\d+)/)[1]);
          var oidx = DEMO_DATA.orders.findIndex(function (o) { return o.id === oid; });
          if (oidx >= 0) {
            Object.assign(DEMO_DATA.orders[oidx], body);
            showToast('Order updated (simulated in demo mode)', 'success');
            resolve({ ok: true, json: function () { return Promise.resolve(DEMO_DATA.orders[oidx]); } });
            return;
          }
        }
        showToast('Change simulated in demo mode', 'info');
        resolve({ ok: true, json: function () { return Promise.resolve(body); } });
        return;
      }

      // DELETE
      if (method === 'DELETE') {
        showToast('Item deleted (simulated in demo mode)', 'success');
        resolve({ ok: true, json: function () { return Promise.resolve({ success: true }); } });
        return;
      }

      // Fallback
      resolve({ ok: true, json: function () { return Promise.resolve({}); } });
    }, 150);
  });
}


// ---- Toast Notifications ----
function showToast(message, type) {
  type = type || 'info';
  var container = document.getElementById('toast-container');
  if (!container) return;

  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(function () {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}


// ---- Authentication ----
function autoLogin() {
  isAuthenticated = true;
  var loginScreen = document.getElementById('login-screen');
  var appScreen = document.getElementById('app-screen');
  var adminName = document.getElementById('admin-name');
  if (loginScreen) loginScreen.style.display = 'none';
  if (appScreen) appScreen.classList.add('active');
  if (adminName) adminName.textContent = 'Admin User';
  navigateTo(window.location.hash || '#/');
}

function handleLogin(e) {
  e.preventDefault();
  var username = document.getElementById('login-username').value.trim();
  var password = document.getElementById('login-password').value.trim();

  if (!username || !password) {
    showToast('Please enter both username and password.', 'error');
    return;
  }

  if (DEMO_MODE) {
    autoLogin();
    return;
  }

  // Real auth would go here
  fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, password: password })
  })
    .then(function (res) {
      if (res.ok) {
        isAuthenticated = true;
        var loginScreen = document.getElementById('login-screen');
        var appScreen = document.getElementById('app-screen');
        var adminName = document.getElementById('admin-name');
        if (loginScreen) loginScreen.style.display = 'none';
        if (appScreen) appScreen.classList.add('active');
        if (adminName) adminName.textContent = username;
        navigateTo('#/');
      } else {
        showToast('Invalid credentials.', 'error');
      }
    })
    .catch(function () {
      showToast('Login failed. Server unreachable.', 'error');
    });
}

function logout() {
  isAuthenticated = false;
  var loginScreen = document.getElementById('login-screen');
  var appScreen = document.getElementById('app-screen');
  if (loginScreen) loginScreen.style.display = '';
  if (appScreen) appScreen.classList.remove('active');
  window.location.hash = '';
}


// ---- Routing ----
function navigateTo(hash) {
  window.location.hash = hash;
}

function handleRoute() {
  var hash = window.location.hash || '#/';
  currentRoute = hash;

  // Update active nav link
  var navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
  navLinks.forEach(function (link) {
    link.classList.remove('active');
    if (link.getAttribute('data-route') === hash) {
      link.classList.add('active');
    }
  });

  // Update page title
  var pageTitle = document.getElementById('page-title');
  var titles = {
    '#/': 'Dashboard',
    '#/products': 'Products',
    '#/categories': 'Categories',
    '#/orders': 'Orders'
  };

  if (pageTitle) {
    pageTitle.textContent = titles[hash] || 'Dashboard';
  }

  // Render appropriate view
  switch (hash) {
    case '#/':
      renderDashboard();
      break;
    case '#/products':
      renderProducts();
      break;
    case '#/categories':
      renderCategories();
      break;
    case '#/orders':
      renderOrders();
      break;
    default:
      renderDashboard();
  }
}


// ---- Render Dashboard ----
function renderDashboard() {
  var content = document.getElementById('app-content');
  if (!content) return;

  apiFetch('/api/dashboard').then(function (res) {
    return res.json();
  }).then(function (data) {
    var stats = data.stats;
    var recentOrders = data.recentOrders;
    var topProducts = data.topProducts;

    var html = '';

    // Page header
    html += '<div class="page-header">';
    html += '  <h1>Dashboard</h1>';
    html += '  <p>Overview of your jewelry store performance</p>';
    html += '</div>';

    // Stats grid
    html += '<div class="stats-grid">';
    html += '  <div class="stat-card">';
    html += '    <div class="stat-icon">&#x1F6D2;</div>';
    html += '    <div class="stat-value">' + stats.totalOrders + '</div>';
    html += '    <div class="stat-label">Total Orders</div>';
    html += '  </div>';
    html += '  <div class="stat-card">';
    html += '    <div class="stat-icon">&#x1F4B0;</div>';
    html += '    <div class="stat-value">$' + stats.totalRevenue.toLocaleString() + '</div>';
    html += '    <div class="stat-label">Total Revenue</div>';
    html += '  </div>';
    html += '  <div class="stat-card">';
    html += '    <div class="stat-icon">&#x23F3;</div>';
    html += '    <div class="stat-value">' + stats.pendingOrders + '</div>';
    html += '    <div class="stat-label">Pending Orders</div>';
    html += '  </div>';
    html += '  <div class="stat-card">';
    html += '    <div class="stat-icon">&#x1F48E;</div>';
    html += '    <div class="stat-value">' + stats.totalProducts + '</div>';
    html += '    <div class="stat-label">Total Products</div>';
    html += '  </div>';
    html += '</div>';

    // Dashboard grid: Recent Orders + Top Products
    html += '<div class="dashboard-grid">';

    // Recent Orders
    html += '  <div class="content-card">';
    html += '    <div class="card-header">';
    html += '      <h2>Recent Orders</h2>';
    html += '      <a href="#/orders" class="btn btn-outline btn-sm">View All</a>';
    html += '    </div>';
    html += '    <div class="card-body">';
    recentOrders.forEach(function (order) {
      html += '      <div class="recent-order-item">';
      html += '        <div class="order-info">';
      html += '          <div class="order-id">#' + order.id + ' &mdash; ' + escapeHtml(order.customer) + '</div>';
      html += '          <div class="order-date">' + formatDate(order.date) + '</div>';
      html += '        </div>';
      html += '        <div class="order-meta">';
      html += '          <div class="order-total price">' + order.total + '</div>';
      html += '          ' + statusBadge(order.status);
      html += '        </div>';
      html += '      </div>';
    });
    html += '    </div>';
    html += '  </div>';

    // Top Products
    html += '  <div class="content-card">';
    html += '    <div class="card-header">';
    html += '      <h2>Top Products</h2>';
    html += '      <a href="#/products" class="btn btn-outline btn-sm">View All</a>';
    html += '    </div>';
    html += '    <div class="card-body">';
    topProducts.forEach(function (product, index) {
      html += '      <div class="top-product-item">';
      html += '        <div class="product-rank">' + (index + 1) + '</div>';
      html += '        <div class="product-details">';
      html += '          <div class="product-name">' + escapeHtml(product.name) + '</div>';
      html += '          <div class="product-stats">' + product.sold + ' sold</div>';
      html += '        </div>';
      html += '        <div class="product-revenue">' + product.revenue + '</div>';
      html += '      </div>';
    });
    html += '    </div>';
    html += '  </div>';

    html += '</div>';

    content.innerHTML = html;
  });
}


// ---- Render Products ----
var productSearchQuery = '';
var productCategoryFilter = '';

function renderProducts() {
  var content = document.getElementById('app-content');
  if (!content) return;

  apiFetch('/api/products').then(function (res) {
    return res.json();
  }).then(function (products) {
    // Apply filters
    var filtered = products;
    if (productCategoryFilter) {
      filtered = filtered.filter(function (p) { return p.category === productCategoryFilter; });
    }
    if (productSearchQuery) {
      var q = productSearchQuery.toLowerCase();
      filtered = filtered.filter(function (p) {
        return p.title.toLowerCase().indexOf(q) !== -1 ||
               p.shortDescription.toLowerCase().indexOf(q) !== -1;
      });
    }

    var html = '';

    // Page header
    html += '<div class="page-header">';
    html += '  <h1>Products</h1>';
    html += '  <p>Manage your jewelry catalog (' + products.length + ' total)</p>';
    html += '</div>';

    // Content card with toolbar
    html += '<div class="content-card">';
    html += '  <div class="toolbar">';
    html += '    <input type="text" class="search-input" placeholder="Search products..." value="' + escapeAttr(productSearchQuery) + '" id="product-search" />';
    html += '    <select id="product-category-filter">';
    html += '      <option value="">All Categories</option>';
    DEMO_DATA.categories.forEach(function (cat) {
      var selected = productCategoryFilter === cat.title ? ' selected' : '';
      html += '      <option value="' + escapeAttr(cat.title) + '"' + selected + '>' + escapeHtml(cat.title) + '</option>';
    });
    html += '    </select>';
    html += '    <button class="btn btn-gold" onclick="showToast(\'Product creation is available in the full admin\', \'info\')">&#x2795; Add Product</button>';
    html += '  </div>';
    html += '  <div class="card-body no-padding">';

    if (filtered.length === 0) {
      html += '    <div class="empty-state">';
      html += '      <div class="empty-icon">&#x1F50D;</div>';
      html += '      <p>No products found matching your search.</p>';
      html += '    </div>';
    } else {
      html += '    <div style="overflow-x:auto;">';
      html += '      <table class="data-table">';
      html += '        <thead>';
      html += '          <tr>';
      html += '            <th>Product</th>';
      html += '            <th>Category</th>';
      html += '            <th>Price</th>';
      html += '            <th>Status</th>';
      html += '            <th>Featured</th>';
      html += '          </tr>';
      html += '        </thead>';
      html += '        <tbody>';
      filtered.forEach(function (product) {
        html += '          <tr>';
        html += '            <td>';
        html += '              <div class="product-title-cell">';
        html += '                <img src="' + escapeAttr(product.image) + '" alt="' + escapeAttr(product.title) + '" class="product-thumb" onerror="this.style.display=\'none\'" />';
        html += '                <div class="product-info">';
        html += '                  <div class="product-name">' + escapeHtml(product.title) + '</div>';
        html += '                  <div class="product-slug">' + escapeHtml(product.slug) + '</div>';
        html += '                </div>';
        html += '              </div>';
        html += '            </td>';
        html += '            <td>' + escapeHtml(product.category) + '</td>';
        html += '            <td class="price">' + escapeHtml(product.price) + '</td>';
        html += '            <td>' + (product.is_active ? '<span class="badge badge-active">Active</span>' : '<span class="badge badge-inactive">Inactive</span>') + '</td>';
        html += '            <td>' + (product.isFeatured ? '<span class="badge badge-featured">&#x2B50; Featured</span>' : '&mdash;') + '</td>';
        html += '          </tr>';
      });
      html += '        </tbody>';
      html += '      </table>';
      html += '    </div>';
    }

    html += '  </div>';
    html += '</div>';

    content.innerHTML = html;

    // Bind search/filter events
    var searchInput = document.getElementById('product-search');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        productSearchQuery = this.value;
        renderProducts();
      });
    }

    var categoryFilter = document.getElementById('product-category-filter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', function () {
        productCategoryFilter = this.value;
        renderProducts();
      });
    }
  });
}


// ---- Render Categories ----
function renderCategories() {
  var content = document.getElementById('app-content');
  if (!content) return;

  apiFetch('/api/categories').then(function (res) {
    return res.json();
  }).then(function (categories) {
    var html = '';

    // Page header
    html += '<div class="page-header">';
    html += '  <h1>Categories</h1>';
    html += '  <p>Manage your product categories (' + categories.length + ' total)</p>';
    html += '</div>';

    // Content card
    html += '<div class="content-card">';
    html += '  <div class="card-header">';
    html += '    <h2>All Categories</h2>';
    html += '    <span class="badge-count">' + categories.length + '</span>';
    html += '  </div>';
    html += '  <div class="card-body no-padding">';

    html += '    <div style="overflow-x:auto;">';
    html += '      <table class="data-table">';
    html += '        <thead>';
    html += '          <tr>';
    html += '            <th>Image</th>';
    html += '            <th>Title</th>';
    html += '            <th>Slug</th>';
    html += '            <th>Products</th>';
    html += '            <th>Status</th>';
    html += '            <th>Featured</th>';
    html += '          </tr>';
    html += '        </thead>';
    html += '        <tbody>';

    categories.forEach(function (category) {
      var productCount = DEMO_DATA.products.filter(function (p) { return p.category === category.title; }).length;
      html += '        <tr>';
      html += '          <td><img src="' + escapeAttr(category.image) + '" alt="' + escapeAttr(category.title) + '" class="category-thumb" onerror="this.style.display=\'none\'" /></td>';
      html += '          <td><strong>' + escapeHtml(category.title) + '</strong></td>';
      html += '          <td>' + escapeHtml(category.slug) + '</td>';
      html += '          <td>' + productCount + '</td>';
      html += '          <td>' + (category.is_active ? '<span class="badge badge-active">Active</span>' : '<span class="badge badge-inactive">Inactive</span>') + '</td>';
      html += '          <td>' + (category.is_featured ? '<span class="badge badge-featured">&#x2B50; Featured</span>' : '&mdash;') + '</td>';
      html += '        </tr>';
    });

    html += '        </tbody>';
    html += '      </table>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    content.innerHTML = html;
  });
}


// ---- Render Orders ----
function renderOrders() {
  var content = document.getElementById('app-content');
  if (!content) return;

  apiFetch('/api/orders').then(function (res) {
    return res.json();
  }).then(function (orders) {
    var html = '';

    // Page header
    html += '<div class="page-header">';
    html += '  <h1>Orders</h1>';
    html += '  <p>Track and manage customer orders (' + orders.length + ' total)</p>';
    html += '</div>';

    // Content card
    html += '<div class="content-card">';
    html += '  <div class="card-header">';
    html += '    <h2>All Orders</h2>';
    html += '    <span class="badge-count">' + orders.length + '</span>';
    html += '  </div>';
    html += '  <div class="card-body no-padding">';

    if (orders.length === 0) {
      html += '    <div class="empty-state">';
      html += '      <div class="empty-icon">&#x1F4E6;</div>';
      html += '      <p>No orders yet.</p>';
      html += '    </div>';
    } else {
      html += '    <div style="overflow-x:auto;">';
      html += '      <table class="data-table">';
      html += '        <thead>';
      html += '          <tr>';
      html += '            <th>Order ID</th>';
      html += '            <th>Customer</th>';
      html += '            <th>Date</th>';
      html += '            <th>Items</th>';
      html += '            <th>Total</th>';
      html += '            <th>Status</th>';
      html += '          </tr>';
      html += '        </thead>';
      html += '        <tbody>';

      orders.forEach(function (order) {
        var itemCount = order.items ? order.items.filter(function (i) { return i.product !== 'Shipping'; }).length : 0;
        html += '        <tr>';
        html += '          <td><strong>#' + order.id + '</strong></td>';
        html += '          <td>' + escapeHtml(order.customer) + '</td>';
        html += '          <td>' + formatDate(order.date) + '</td>';
        html += '          <td>' + itemCount + ' item' + (itemCount !== 1 ? 's' : '') + '</td>';
        html += '          <td class="price">' + escapeHtml(order.total) + '</td>';
        html += '          <td>' + statusBadge(order.status) + '</td>';
        html += '        </tr>';
      });

      html += '        </tbody>';
      html += '      </table>';
      html += '    </div>';
    }

    html += '  </div>';
    html += '</div>';

    content.innerHTML = html;
  });
}


// ---- Utility Functions ----
function statusBadge(status) {
  var map = {
    'Pending': 'badge-pending',
    'Processing': 'badge-processing',
    'Shipped': 'badge-shipped',
    'Delivered': 'badge-delivered',
    'Cancelled': 'badge-cancelled',
    'Accepted': 'badge-processing',
    'Packed': 'badge-shipped',
    'On The Way': 'badge-shipped'
  };
  var cls = map[status] || 'badge-pending';
  return '<span class="badge ' + cls + '">' + escapeHtml(status) + '</span>';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  var parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var month = months[parseInt(parts[1], 10) - 1] || parts[1];
  return month + ' ' + parseInt(parts[2], 10) + ', ' + parts[0];
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}


// ---- Mobile Sidebar Toggle ----
function toggleSidebar() {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
  if (overlay) {
    overlay.classList.toggle('active');
  }
}

function closeSidebar() {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  if (sidebar) {
    sidebar.classList.remove('open');
  }
  if (overlay) {
    overlay.classList.remove('active');
  }
}


// ---- Initialization ----
document.addEventListener('DOMContentLoaded', function () {
  // Login form handler
  var loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Hash routing
  window.addEventListener('hashchange', handleRoute);

  // Sidebar overlay click to close
  var overlay = document.getElementById('sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // Demo banner close
  var bannerClose = document.getElementById('demo-banner-close');
  if (bannerClose) {
    bannerClose.addEventListener('click', function () {
      var banner = document.getElementById('demo-banner');
      if (banner) {
        banner.style.display = 'none';
      }
      document.body.classList.remove('demo-mode');
    });
  }

  // Detect demo mode
  detectDemoMode();

  // If not in demo mode and not authenticated, show login
  // (demo mode calls autoLogin which triggers navigation)
});