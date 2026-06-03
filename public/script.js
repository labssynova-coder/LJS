/* ============================================================
   LJS — Luxury Jewelry Shop: SPA Interactivity
   Hash-based routing, cart, rendering — no backend needed
   ============================================================ */

/* ---- Toast notifications ---- */
function _showToast(message, type) {
  type = type || "info";
  var container = document.getElementById("toast-container");
  if (!container) return;
  var toast = document.createElement("div");
  toast.className = "toast toast-" + type;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(function () {
    toast.classList.add("toast-fade-out");
    setTimeout(function () { toast.remove(); }, 400);
  }, 2600);
}
window._showToast = _showToast;

/* ---- Cart (localStorage) ---- */
function getCart() {
  try {
    var raw = localStorage.getItem("ljs_cart");
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

function saveCart(cart) {
  localStorage.setItem("ljs_cart", JSON.stringify(cart));
}

function addToCart(productId) {
  productId = String(productId);
  var cart = getCart();
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart(cart);
  updateCartUI();
  _showToast("Added to cart", "success");
}

function removeFromCart(productId) {
  productId = String(productId);
  var cart = getCart();
  delete cart[productId];
  saveCart(cart);
  updateCartUI();
  renderCartDrawer();
}

function updateCartQty(productId, delta) {
  productId = String(productId);
  var cart = getCart();
  if (!cart[productId]) return;
  cart[productId] += delta;
  if (cart[productId] <= 0) delete cart[productId];
  saveCart(cart);
  updateCartUI();
  renderCartDrawer();
}

function updateCartUI() {
  var cart = getCart();
  var count = Object.values(cart).reduce(function (s, n) { return s + n; }, 0);
  var badge = document.getElementById("cart-badge");
  if (badge) { badge.textContent = count; badge.style.display = count > 0 ? "inline" : "none"; }
  var badgeMobile = document.getElementById("cart-badge-mobile");
  if (badgeMobile) { badgeMobile.textContent = count; badgeMobile.style.display = count > 0 ? "inline-block" : "none"; }
}

/* ---- Price formatter ---- */
function formatPrice(n) {
  return "$" + n.toLocaleString("en-US");
}

/* ---- SVG icons (inline, no external dependency) ---- */
var ICONS = {
  heart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  cart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  delivery: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dcb14a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  support: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dcb14a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  tag: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dcb14a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
  star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="#dcb14a" stroke="#dcb14a" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  minus: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  plus: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
};

/* ---- Product card renderer ---- */
function renderProductCard(product) {
  return '<div class="col-xl-3 col-lg-4 col-sm-6">' +
    '<div class="product text-center">' +
      '<div class="position-relative mb-3">' +
        '<a class="d-block" href="#/product/' + product.slug + '">' +
          '<img class="img-fluid w-100" src="' + product.image + '" alt="' + product.title + '" loading="lazy">' +
        '</a>' +
        '<div class="product-overlay">' +
          '<ul class="mb-0 list-inline">' +
            '<li class="list-inline-item m-0 p-0"><a class="btn btn-sm btn-outline-dark" href="#" onclick="event.preventDefault()">' + ICONS.heart + '</a></li>' +
            '<li class="list-inline-item m-0 p-0"><button class="btn btn-sm btn-dark" onclick="addToCart(' + product.id + ')">Add to Cart</button></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<h6><a class="reset-anchor" href="#/product/' + product.slug + '">' + product.title + '</a></h6>' +
      '<p class="small text-muted">' + formatPrice(product.price) + '</p>' +
    '</div>' +
  '</div>';
}

/* ---- Homepage ---- */
function renderHomepage(products) {
  var trending = products.slice(0, 8);
  var categories = FALLBACK_CATEGORIES;

  var hero = '<div class="container">' +
    '<section class="hero pb-3 bg-cover bg-center d-flex align-items-center" style="background-image:url(assets/images/hero/banner.jpg)">' +
      '<div class="container py-5">' +
        '<div class="row px-4 px-lg-5">' +
          '<div class="col-lg-6 hero-content">' +
            '<p class="text-muted small text-uppercase mb-2">New Inspiration 2020</p>' +
            '<h1 class="h2 text-uppercase mb-3">20% off on new season</h1>' +
            '<a class="btn btn-dark" href="#/shop">Browse collections</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +
  '</div>';

  var catHTML = '<section class="pt-5"><div class="container"><header class="text-center">' +
    '<p class="small text-muted small text-uppercase mb-1">Carefully created collections</p>' +
    '<h2 class="h5 text-uppercase mb-4">Browse our categories</h2>' +
  '</header><div class="row">';

  categories.forEach(function (cat) {
    catHTML += '<div class="col-md-4 mb-4 mb-md-0">' +
      '<a class="category-item" href="#/shop?category=' + cat.slug + '">' +
        '<img class="img-fluid" src="' + cat.image + '" alt="' + cat.title + '">' +
        '<strong class="category-item-title">' + cat.title + '</strong>' +
      '</a>' +
    '</div>';
  });
  catHTML += '</div></div></section>';

  var trendingHTML = '<section class="py-5"><div class="container"><header>' +
    '<p class="small text-muted small text-uppercase mb-1">Made the hard way</p>' +
    '<h2 class="h5 text-uppercase mb-4">Top trending products</h2>' +
  '</header><div class="row">';

  trending.forEach(function (p) { trendingHTML += renderProductCard(p); });
  trendingHTML += '</div></div></section>';

  var services = '<section class="py-5 bg-light"><div class="container"><div class="row text-center">' +
    '<div class="col-lg-4 mb-3 mb-lg-0"><div class="d-inline-block"><div class="media align-items-end">' +
      ICONS.delivery +
      '<div class="media-body text-left ml-3"><h6 class="text-uppercase mb-1">Free shipping</h6><p class="text-small mb-0 text-muted">Free shipping worldwide</p></div>' +
    '</div></div></div>' +
    '<div class="col-lg-4 mb-3 mb-lg-0"><div class="d-inline-block"><div class="media align-items-end">' +
      ICONS.support +
      '<div class="media-body text-left ml-3"><h6 class="text-uppercase mb-1">24 x 7 service</h6><p class="text-small mb-0 text-muted">Free shipping worldwide</p></div>' +
    '</div></div></div>' +
    '<div class="col-lg-4"><div class="d-inline-block"><div class="media align-items-end">' +
      ICONS.tag +
      '<div class="media-body text-left ml-3"><h6 class="text-uppercase mb-1">Festival offer</h6><p class="text-small mb-0 text-muted">Free shipping worldwide</p></div>' +
    '</div></div></div>' +
  '</div></div></section>';

  var newsletter = '<section class="py-5"><div class="container p-0"><div class="row">' +
    '<div class="col-lg-6 mb-3 mb-lg-0">' +
      '<h5 class="text-uppercase">Let\'s be friends!</h5>' +
      '<p class="text-small text-muted mb-0">Nisi nisi tempor consequat laboris nisi.</p>' +
    '</div>' +
    '<div class="col-lg-6">' +
      '<form class="newsletter-form" onsubmit="event.preventDefault();_showToast(\'Demo mode — newsletter is simulated\',\'info\')">' +
        '<div class="input-group flex-column flex-sm-row mb-3">' +
          '<input class="form-control form-control-lg py-3" type="email" placeholder="Enter your email address" required>' +
          '<div class="input-group-append">' +
            '<button class="btn btn-dark btn-block" type="submit">Subscribe</button>' +
          '</div>' +
        '</div>' +
      '</form>' +
    '</div>' +
  '</div></div></section>';

  return hero + catHTML + trendingHTML + services + newsletter;
}

/* ---- Catalog / Shop page ---- */
function renderCatalog(products, categoryFilter) {
  var filtered = categoryFilter
    ? products.filter(function (p) { return p.categorySlug === categoryFilter; })
    : products;

  var catName = "";
  if (categoryFilter) {
    var found = FALLBACK_CATEGORIES.find(function (c) { return c.slug === categoryFilter; });
    catName = found ? found.title : categoryFilter;
  }

  var breadcrumb = '<section class="py-5 bg-light breadcrumb-section"><div class="container"><div class="row px-4 px-lg-5 py-lg-4 align-items-center">' +
    '<div class="col-lg-6"><h1 class="h2 text-uppercase mb-0">Shop' + (catName ? " - " + catName : "") + '</h1></div>' +
    '<div class="col-lg-6 text-lg-right"><nav aria-label="breadcrumb"><ol class="breadcrumb justify-content-lg-end mb-0 px-0">' +
      '<li class="breadcrumb-item"><a href="#/">Home</a></li>' +
      '<li class="breadcrumb-item active" aria-current="page">' + (catName || "Shop") + '</li>' +
    '</ol></nav></div></div></div></section>';

  var sidebar = '<div class="col-lg-3 order-2 order-lg-1 sidebar">' +
    '<h5 class="text-uppercase mb-4">Categories</h5>';

  FALLBACK_CATEGORIES.forEach(function (cat) {
    var active = categoryFilter === cat.slug ? " bg-dark text-white" : " bg-light";
    sidebar += '<a href="#/shop?category=' + cat.slug + '">' +
      '<div class="py-2 px-4 mb-3' + active + '">' +
        '<strong class="small text-uppercase font-weight-bold">' + cat.title + '</strong>' +
      '</div></a>';
  });

  sidebar += '<div class="mt-4"><a href="#/shop" class="btn btn-sm btn-outline-dark">View All Products</a></div></div>';

  var productGrid = '<div class="col-lg-9 order-1 order-lg-2 mb-5 mb-lg-0">' +
    '<div class="row mb-3 align-items-center">' +
      '<div class="col-lg-6 mb-2 mb-lg-0"><p class="text-small text-muted mb-0">Showing ' + filtered.length + ' of ' + filtered.length + ' results</p></div>' +
    '</div>' +
    '<div class="row">';

  filtered.forEach(function (p) { productGrid += renderProductCard(p); });

  if (filtered.length === 0) {
    productGrid += '<div class="col-12"><p class="text-muted">No products found in this category.</p></div>';
  }

  productGrid += '</div></div>';

  return breadcrumb + '<section class="py-5"><div class="container p-0"><div class="row">' +
    sidebar + productGrid + '</div></div></section>';
}

/* ---- Product detail page ---- */
function renderProductDetail(products, slug) {
  var product = products.find(function (p) { return p.slug === slug; });
  if (!product) return '<div class="container py-5"><h2>Product not found</h2><a href="#/shop" class="btn btn-dark mt-3">Back to Shop</a></div>';

  var related = products.filter(function (p) {
    return p.categorySlug === product.categorySlug && p.id !== product.id;
  }).slice(0, 4);

  var breadcrumb = '<section class="py-5 bg-light breadcrumb-section"><div class="container"><div class="row px-4 px-lg-5 py-lg-4 align-items-center">' +
    '<div class="col-lg-6"><h1 class="h2 text-uppercase mb-0">' + product.title + '</h1></div>' +
    '<div class="col-lg-6 text-lg-right"><nav aria-label="breadcrumb"><ol class="breadcrumb justify-content-lg-end mb-0 px-0">' +
      '<li class="breadcrumb-item"><a href="#/">Home</a></li>' +
      '<li class="breadcrumb-item"><a href="#/shop">Shop</a></li>' +
      '<li class="breadcrumb-item active" aria-current="page">' + product.title + '</li>' +
    '</ol></nav></div></div></div></section>';

  var stars = "";
  for (var i = 0; i < 5; i++) stars += ICONS.star + " ";

  var detail = '<section class="py-5"><div class="container"><div class="row mb-5">' +
    '<div class="col-lg-6">' +
      '<div class="product-detail-img">' +
        '<img class="img-fluid" src="' + product.image + '" alt="' + product.title + '">' +
      '</div>' +
    '</div>' +
    '<div class="col-lg-6">' +
      '<ul class="list-inline mb-2">' + stars + '</ul>' +
      '<h1>' + product.title + '</h1>' +
      '<p class="text-muted lead">' + formatPrice(product.price) + '</p>' +
      '<p class="text-small mb-4">' + product.shortDescription + '</p>' +
      '<div class="row align-items-stretch mb-4">' +
        '<div class="col-sm-5 pr-sm-0">' +
          '<div class="border d-flex align-items-center justify-content-between py-1 px-3 bg-white quantity-control">' +
            '<span class="small text-uppercase text-gray mr-4 no-select">Quantity</span>' +
            '<div class="quantity">' +
              '<button class="dec-btn p-0" onclick="updateDetailQty(-1)">' + ICONS.minus + '</button>' +
              '<input id="detail-qty" class="form-control border-0 shadow-0 p-0" type="text" value="1" readonly>' +
              '<button class="inc-btn p-0" onclick="updateDetailQty(1)">' + ICONS.plus + '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="col-sm-3 pl-sm-0">' +
          '<button class="btn btn-dark btn-lg btn-block h-100 d-flex align-items-center justify-content-center px-0" onclick="addToCartWithQty(' + product.id + ')">Add to Cart</button>' +
        '</div>' +
      '</div>' +
      '<ul class="list-unstyled small d-inline-block">' +
        '<li class="px-3 py-2 mb-1 bg-white"><strong class="text-uppercase">Category:</strong><a class="reset-anchor ml-2" href="#/shop?category=' + product.categorySlug + '">' + product.category + '</a></li>' +
      '</ul>' +
    '</div>' +
  '</div>';

  if (related.length > 0) {
    detail += '<h2 class="h5 text-uppercase mb-4">Related products</h2><div class="row">';
    related.forEach(function (rp) { detail += renderProductCard(rp); });
    detail += '</div>';
  }

  detail += '</div></section>';

  return breadcrumb + detail;
}

/* Detail page quantity helpers */
function updateDetailQty(delta) {
  var input = document.getElementById("detail-qty");
  if (!input) return;
  var val = parseInt(input.value, 10) + delta;
  if (val < 1) val = 1;
  if (val > 99) val = 99;
  input.value = val;
}

function addToCartWithQty(productId) {
  var input = document.getElementById("detail-qty");
  var qty = input ? parseInt(input.value, 10) : 1;
  if (isNaN(qty) || qty < 1) qty = 1;
  productId = String(productId);
  var cart = getCart();
  cart[productId] = (cart[productId] || 0) + qty;
  saveCart(cart);
  updateCartUI();
  _showToast("Added " + qty + " item(s) to cart", "success");
}

/* ---- Search results ---- */
function renderSearchResults(products, query) {
  var q = (query || "").toLowerCase().trim();
  var results = q ? products.filter(function (p) {
    return p.title.toLowerCase().indexOf(q) !== -1 ||
           p.category.toLowerCase().indexOf(q) !== -1 ||
           p.shortDescription.toLowerCase().indexOf(q) !== -1;
  }) : [];

  var breadcrumb = '<section class="py-5 bg-light breadcrumb-section"><div class="container"><div class="row px-4 px-lg-5 py-lg-4 align-items-center">' +
    '<div class="col-lg-6"><h1 class="h2 text-uppercase mb-0">Search Results</h1></div>' +
    '<div class="col-lg-6 text-lg-right"><nav aria-label="breadcrumb"><ol class="breadcrumb justify-content-lg-end mb-0 px-0">' +
      '<li class="breadcrumb-item"><a href="#/">Home</a></li>' +
      '<li class="breadcrumb-item active" aria-current="page">Search</li>' +
    '</ol></nav></div></div></div></section>';

  var content = '<section class="py-5"><div class="container">';
  if (q) {
    content += '<h2 class="h5 text-uppercase mb-4">Results for "' + query + '" (' + results.length + ')</h2>';
  } else {
    content += '<h2 class="h5 text-uppercase mb-4">Please enter a search term</h2>';
  }

  if (results.length > 0) {
    content += '<div class="row">';
    results.forEach(function (p) { content += renderProductCard(p); });
    content += '</div>';
  } else if (q) {
    content += '<p class="text-muted">No products found matching "' + query + '".</p>';
  }

  content += '</div></section>';
  return breadcrumb + content;
}

/* ---- Cart drawer ---- */
function renderCartDrawer() {
  var products = window._products || [];
  var cart = getCart();
  var drawer = document.getElementById("cart-drawer-body");
  if (!drawer) return;

  var ids = Object.keys(cart);
  if (ids.length === 0) {
    drawer.innerHTML = '<p class="text-muted text-center py-4">Your cart is empty</p>';
    var totalEl = document.getElementById("cart-drawer-total");
    if (totalEl) totalEl.textContent = formatPrice(0);
    return;
  }

  var total = 0;
  var html = "";
  ids.forEach(function (id) {
    var p = products.find(function (pr) { return String(pr.id) === id; });
    if (!p) return;
    var subtotal = p.price * cart[id];
    total += subtotal;
    html += '<div class="cart-item d-flex align-items-center mb-3 pb-3 border-bottom">' +
      '<img src="' + p.image + '" alt="' + p.title + '" class="cart-item-img mr-3">' +
      '<div class="flex-grow-1">' +
        '<h6 class="mb-1"><a class="reset-anchor" href="#/product/' + p.slug + '">' + p.title + '</a></h6>' +
        '<p class="small text-muted mb-1">' + formatPrice(p.price) + ' x ' + cart[id] + '</p>' +
        '<div class="d-flex align-items-center">' +
          '<button class="btn btn-sm btn-outline-dark py-0 px-2" onclick="updateCartQty(' + id + ',-1)">' + ICONS.minus + '</button>' +
          '<span class="mx-2">' + cart[id] + '</span>' +
          '<button class="btn btn-sm btn-outline-dark py-0 px-2" onclick="updateCartQty(' + id + ',1)">' + ICONS.plus + '</button>' +
          '<button class="btn btn-sm text-danger ml-auto" onclick="removeFromCart(' + id + ')">&times;</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  });

  drawer.innerHTML = html;
  var totalEl = document.getElementById("cart-drawer-total");
  if (totalEl) totalEl.textContent = formatPrice(total);
}

function toggleCartDrawer() {
  var drawer = document.getElementById("cart-drawer");
  var overlay = document.getElementById("cart-overlay");
  if (drawer) drawer.classList.toggle("open");
  if (overlay) overlay.classList.toggle("open");
  renderCartDrawer();
}

/* ---- Router ---- */
function parseHash() {
  var hash = window.location.hash || "#/";
  var parts = hash.substring(2).split("?");
  var path = parts[0];
  var queryStr = parts[1] || "";
  var params = {};
  if (queryStr) {
    queryStr.split("&").forEach(function (pair) {
      var kv = pair.split("=");
      params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || "");
    });
  }
  return { path: path, params: params };
}

function route() {
  var parsed = parseHash();
  var path = parsed.path;
  var params = parsed.params;
  var products = window._products || [];
  var app = document.getElementById("app-content");
  if (!app) return;

  if (path === "" || path === "/") {
    document.title = "LJS — Luxury Jewelry Shop";
    app.innerHTML = renderHomepage(products);
  } else if (path === "/shop") {
    var cat = params.category || "";
    document.title = cat ? "Shop - " + cat + " | LJS" : "Shop | LJS";
    app.innerHTML = renderCatalog(products, cat);
  } else if (path.indexOf("/product/") === 0) {
    var slug = path.replace("/product/", "");
    var prod = products.find(function (p) { return p.slug === slug; });
    document.title = prod ? prod.title + " | LJS" : "Product | LJS";
    app.innerHTML = renderProductDetail(products, slug);
  } else if (path === "/search") {
    var q = params.q || "";
    document.title = q ? "Search: " + q + " | LJS" : "Search | LJS";
    app.innerHTML = renderSearchResults(products, q);
  } else {
    document.title = "LJS — Luxury Jewelry Shop";
    app.innerHTML = '<div class="container py-5 text-center"><h2>Page not found</h2><a href="#/" class="btn btn-dark mt-3">Go Home</a></div>';
  }

  window.scrollTo(0, 0);
}

/* ---- Search handler ---- */
function handleSearch(e) {
  e.preventDefault();
  var input = document.getElementById("search-input") || document.getElementById("mobile-search-input");
  if (!input) return;
  var q = input.value.trim();
  if (q) {
    window.location.hash = "#/search?q=" + encodeURIComponent(q);
    closeMobileSearch();
    /* Clear search inputs */
    var desktop = document.getElementById("search-input");
    var mobile = document.getElementById("mobile-search-input");
    if (desktop) desktop.value = "";
    if (mobile) mobile.value = "";
  }
}

function toggleMobileSearch() {
  var bar = document.getElementById("mobile-search-bar");
  if (bar) bar.classList.toggle("active");
}

function closeMobileSearch() {
  var bar = document.getElementById("mobile-search-bar");
  if (bar) bar.classList.remove("active");
}

/* ---- Mobile nav toggle ---- */
function toggleMobileNav() {
  var nav = document.getElementById("navbar-collapse");
  if (nav) nav.classList.toggle("show");
}

/* ---- Categories dropdown ---- */
function toggleCategoriesDropdown() {
  var dd = document.getElementById("categories-dropdown");
  if (dd) dd.classList.toggle("show");
}

/* Close dropdowns on outside click */
document.addEventListener("click", function (e) {
  var dd = document.getElementById("categories-dropdown");
  var trigger = document.querySelector("[onclick*='toggleCategoriesDropdown']");
  if (dd && dd.classList.contains("show") && !dd.contains(e.target) && !(trigger && trigger.contains(e.target))) {
    dd.classList.remove("show");
  }
});

/* ---- Initialize ---- */
async function initApp() {
  try {
    /* Default hash to homepage if missing */
    if (!window.location.hash || window.location.hash === "#" || window.location.hash === "#/") {
      window.location.hash = "#/";
    }

    /* Show demo banner if in demo mode */
    var banner = document.getElementById("demo-banner");
    if (banner) banner.style.display = "block";

    /* Load data */
    await detectDemoMode();
    var products = await loadProducts();
    window._products = products;

    /* Remove loading state */
    var loader = document.getElementById("app-loader");
    if (loader) loader.style.display = "none";

    /* Update cart badge */
    updateCartUI();

    /* Route */
    route();
    window.addEventListener("hashchange", route);

    /* Search forms */
    var searchForm = document.getElementById("search-form");
    if (searchForm) searchForm.addEventListener("submit", handleSearch);
    var mobileForm = document.querySelector("#mobile-search-bar form");
    if (mobileForm) mobileForm.addEventListener("submit", handleSearch);
  } catch (err) {
    console.error("initApp failed:", err);
    /* Force-remove loading state so the page isn't stuck */
    var loader = document.getElementById("app-loader");
    if (loader) loader.style.display = "none";
    var app = document.getElementById("app-content");
    if (app) app.innerHTML = '<div class="container py-5 text-center"><h2>Something went wrong</h2><p class="text-muted">Unable to load products. Please refresh the page.</p><a href="#/" class="btn btn-dark mt-3">Try Again</a></div>';
  }
}

document.addEventListener("DOMContentLoaded", initApp);