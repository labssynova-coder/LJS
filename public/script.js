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

/* ---- Breadcrumb helper ---- */
function breadcrumb(items) {
  var ol = '<li class="breadcrumb-item"><a href="#/">Home</a></li>';
  items.forEach(function (item, i) {
    if (i === items.length - 1) {
      ol += '<li class="breadcrumb-item active" aria-current="page">' + item.label + '</li>';
    } else {
      ol += '<li class="breadcrumb-item"><a href="' + item.href + '">' + item.label + '</a></li>';
    }
  });
  return '<section class="py-5 bg-light breadcrumb-section"><div class="container"><div class="row px-4 px-lg-5 py-lg-4 align-items-center">' +
    '<div class="col-lg-6"><h1 class="h2 text-uppercase mb-0">' + items[items.length - 1].label + '</h1></div>' +
    '<div class="col-lg-6 text-lg-right"><nav aria-label="breadcrumb"><ol class="breadcrumb justify-content-lg-end mb-0 px-0">' + ol + '</ol></nav></div></div></div></section>';
}

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
      '<a class="category-item" href="#/categories">' +
        '<img class="img-fluid" src="' + cat.image + '" alt="' + cat.title + '">' +
        '<strong class="category-item-title">' + cat.title + '</strong>' +
      '</a>' +
    '</div>';
  });
  catHTML += '</div><div class="text-center mt-4"><a class="btn btn-outline-dark" href="#/categories">View All Categories</a></div></div></section>';

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

/* ---- Categories page ---- */
function renderCategories(products) {
  var html = breadcrumb([{ label: "Categories", href: "#/categories" }]);

  html += '<section class="py-5"><div class="container">' +
    '<header class="text-center mb-5">' +
      '<p class="small text-muted text-uppercase mb-1">Browse our collection</p>' +
      '<h2 class="h5 text-uppercase">All Categories</h2>' +
    '</header>' +
    '<div class="row">';

  FALLBACK_CATEGORIES.forEach(function (cat) {
    var count = products.filter(function (p) { return p.categorySlug === cat.slug; }).length;
    html += '<div class="col-lg-4 col-md-6 mb-4">' +
      '<a class="category-card" href="#/shop?category=' + cat.slug + '">' +
        '<div class="category-card-img">' +
          '<img class="img-fluid" src="' + cat.image + '" alt="' + cat.title + '">' +
        '</div>' +
        '<div class="category-card-body">' +
          '<h4 class="text-uppercase">' + cat.title + '</h4>' +
          '<p class="text-muted mb-0">' + count + ' product' + (count !== 1 ? 's' : '') + '</p>' +
          '<span class="btn btn-sm btn-outline-dark mt-2">Browse ' + cat.title + '</span>' +
        '</div>' +
      '</a>' +
    '</div>';
  });

  html += '</div></div></section>';
  return html;
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

  var bc = [{ label: "Shop", href: "#/shop" }];
  if (catName) bc.push({ label: catName, href: "#/shop?category=" + categoryFilter });

  var breadcrumbHTML = breadcrumb(bc);

  var sidebar = '<div class="col-lg-3 order-2 order-lg-1 sidebar">' +
    '<h5 class="text-uppercase mb-4">Categories</h5>';

  FALLBACK_CATEGORIES.forEach(function (cat) {
    var active = categoryFilter === cat.slug ? " bg-dark text-white" : " bg-light";
    sidebar += '<a href="#/shop?category=' + cat.slug + '">' +
      '<div class="py-2 px-4 mb-3' + active + '">' +
        '<strong class="small text-uppercase font-weight-bold">' + cat.title + '</strong>' +
      '</div></a>';
  });

  sidebar += '<div class="mt-4"><a href="#/shop" class="btn btn-sm btn-outline-dark">View All Products</a></div>' +
    '<div class="mt-3"><a href="#/categories" class="btn btn-sm btn-outline-dark">Browse Categories</a></div></div>';

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

  return breadcrumbHTML + '<section class="py-5"><div class="container p-0"><div class="row">' +
    sidebar + productGrid + '</div></div></section>';
}

/* ---- Product detail page ---- */
function renderProductDetail(products, slug) {
  var product = products.find(function (p) { return p.slug === slug; });
  if (!product) return breadcrumb([{ label: "Product Not Found", href: "#/shop" }]) +
    '<section class="py-5"><div class="container text-center">' +
      '<h2>Product not found</h2>' +
      '<p class="text-muted mb-4">The product you are looking for does not exist.</p>' +
      '<a href="#/shop" class="btn btn-dark">Back to Shop</a>' +
    '</div></section>';

  var related = products.filter(function (p) {
    return p.categorySlug === product.categorySlug && p.id !== product.id;
  }).slice(0, 4);

  var bc = breadcrumb([
    { label: "Shop", href: "#/shop" },
    { label: product.category, href: "#/shop?category=" + product.categorySlug },
    { label: product.title, href: "#/product/" + product.slug }
  ]);

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

  return bc + detail;
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

  var bc = breadcrumb([{ label: "Search", href: "#/search" }]);

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
  return bc + content;
}

/* ---- Cart page (full page, not just drawer) ---- */
function renderCartPage() {
  var products = window._products || [];
  var cart = getCart();
  var ids = Object.keys(cart);

  var bc = breadcrumb([{ label: "Shopping Cart", href: "#/cart" }]);

  if (ids.length === 0) {
    return bc + '<section class="py-5"><div class="container text-center">' +
      '<h2 class="mb-3">Your cart is empty</h2>' +
      '<p class="text-muted mb-4">Looks like you haven\'t added anything to your cart yet.</p>' +
      '<a href="#/shop" class="btn btn-dark">Continue Shopping</a>' +
    '</div></section>';
  }

  var total = 0;
  var shipping = 10;
  var html = '<section class="py-5"><div class="container">' +
    '<div class="row">' +
      '<div class="col-lg-8 mb-4 mb-lg-0">' +
        '<div class="cart-table-header d-none d-md-flex py-3 border-bottom font-weight-bold small text-uppercase">' +
          '<div class="col-md-4">Product</div>' +
          '<div class="col-md-2 text-center">Price</div>' +
          '<div class="col-md-3 text-center">Quantity</div>' +
          '<div class="col-md-2 text-center">Subtotal</div>' +
          '<div class="col-md-1"></div>' +
        '</div>';

  ids.forEach(function (id) {
    var p = products.find(function (pr) { return String(pr.id) === id; });
    if (!p) return;
    var subtotal = p.price * cart[id];
    total += subtotal;
    html += '<div class="cart-table-row d-flex align-items-center py-3 border-bottom">' +
      '<div class="col-md-4">' +
        '<div class="d-flex align-items-center">' +
          '<a href="#/product/' + p.slug + '"><img src="' + p.image + '" alt="' + p.title + '" class="cart-item-img mr-3"></a>' +
          '<a class="reset-anchor" href="#/product/' + p.slug + '">' + p.title + '</a>' +
        '</div>' +
      '</div>' +
      '<div class="col-md-2 text-center">' + formatPrice(p.price) + '</div>' +
      '<div class="col-md-3 text-center">' +
        '<div class="d-inline-flex align-items-center border">' +
          '<button class="btn btn-sm py-0 px-2" onclick="updateCartQty(' + id + ',-1)">' + ICONS.minus + '</button>' +
          '<span class="px-3">' + cart[id] + '</span>' +
          '<button class="btn btn-sm py-0 px-2" onclick="updateCartQty(' + id + ',1)">' + ICONS.plus + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="col-md-2 text-center">' + formatPrice(subtotal) + '</div>' +
      '<div class="col-md-1 text-center"><button class="btn btn-sm text-danger" onclick="removeFromCart(' + id + ');route()">&times;</button></div>' +
    '</div>';
  });

  html += '</div>' +
    '<div class="col-lg-4">' +
      '<div class="bg-light p-4">' +
        '<h5 class="text-uppercase mb-4">Order summary</h5>' +
        '<div class="d-flex justify-content-between mb-2"><span>Subtotal</span><span>' + formatPrice(total) + '</span></div>' +
        '<div class="d-flex justify-content-between mb-2"><span>Shipping</span><span>' + formatPrice(shipping) + '</span></div>' +
        '<hr>' +
        '<div class="d-flex justify-content-between mb-4"><strong class="text-uppercase">Total</strong><strong>' + formatPrice(total + shipping) + '</strong></div>' +
        '<a href="#/checkout" class="btn btn-dark btn-block">Proceed to Checkout</a>' +
        '<a href="#/shop" class="btn btn-outline-dark btn-block mt-2">Continue Shopping</a>' +
      '</div>' +
    '</div>' +
  '</div></div></section>';

  return bc + html;
}

/* ---- Checkout page ---- */
function renderCheckout() {
  var cart = getCart();
  var products = window._products || [];
  var ids = Object.keys(cart);

  if (ids.length === 0) {
    return breadcrumb([{ label: "Checkout", href: "#/checkout" }]) +
      '<section class="py-5"><div class="container text-center">' +
        '<h2 class="mb-3">Your cart is empty</h2>' +
        '<p class="text-muted mb-4">Add some products before checking out.</p>' +
        '<a href="#/shop" class="btn btn-dark">Continue Shopping</a>' +
      '</div></section>';
  }

  var total = 0;
  var shipping = 10;
  ids.forEach(function (id) {
    var p = products.find(function (pr) { return String(pr.id) === id; });
    if (p) total += p.price * cart[id];
  });

  var bc = breadcrumb([{ label: "Cart", href: "#/cart" }, { label: "Checkout", href: "#/checkout" }]);

  var html = '<section class="py-5"><div class="container">' +
    '<div class="row">' +
      '<div class="col-lg-8 mb-4 mb-lg-0">' +
        '<h3 class="text-uppercase mb-4">Billing details</h3>' +
        '<form onsubmit="event.preventDefault();_showToast(\'Demo mode — order placement is simulated\',\'success\');localStorage.removeItem(\'ljs_cart\');updateCartUI();window.location.hash=\'#/order-placed\'">' +
          '<div class="row">' +
            '<div class="col-md-6 mb-3"><label class="text-uppercase small">First Name</label><input class="form-control" type="text" required></div>' +
            '<div class="col-md-6 mb-3"><label class="text-uppercase small">Last Name</label><input class="form-control" type="text" required></div>' +
          '</div>' +
          '<div class="mb-3"><label class="text-uppercase small">Email</label><input class="form-control" type="email" required></div>' +
          '<div class="mb-3"><label class="text-uppercase small">Address</label><input class="form-control" type="text" required></div>' +
          '<div class="row">' +
            '<div class="col-md-6 mb-3"><label class="text-uppercase small">City</label><input class="form-control" type="text" required></div>' +
            '<div class="col-md-6 mb-3"><label class="text-uppercase small">Phone</label><input class="form-control" type="tel" required></div>' +
          '</div>' +
          '<h4 class="text-uppercase mt-4 mb-3">Payment method</h4>' +
          '<div class="bg-light p-3 mb-3">' +
            '<div class="form-check mb-2"><input class="form-check-input" type="radio" name="payment" id="pay-cod" checked><label class="form-check-label" for="pay-cod">Cash on Delivery</label></div>' +
            '<div class="form-check"><input class="form-check-input" type="radio" name="payment" id="pay-paypal"><label class="form-check-label" for="pay-paypal">PayPal</label></div>' +
          '</div>' +
          '<button type="submit" class="btn btn-dark btn-lg btn-block">Place Order</button>' +
        '</form>' +
      '</div>' +
      '<div class="col-lg-4">' +
        '<div class="bg-light p-4">' +
          '<h5 class="text-uppercase mb-4">Your order</h5>';

  ids.forEach(function (id) {
    var p = products.find(function (pr) { return String(pr.id) === id; });
    if (!p) return;
    html += '<div class="d-flex justify-content-between mb-2 small">' +
      '<span>' + p.title + ' x ' + cart[id] + '</span>' +
      '<span>' + formatPrice(p.price * cart[id]) + '</span></div>';
  });

  html += '<hr>' +
    '<div class="d-flex justify-content-between mb-2"><span>Subtotal</span><span>' + formatPrice(total) + '</span></div>' +
    '<div class="d-flex justify-content-between mb-2"><span>Shipping</span><span>' + formatPrice(shipping) + '</span></div>' +
    '<hr>' +
    '<div class="d-flex justify-content-between"><strong>Total</strong><strong>' + formatPrice(total + shipping) + '</strong></div>' +
  '</div></div>' +
  '</div></div></section>';

  return bc + html;
}

/* ---- Order placed page ---- */
function renderOrderPlaced() {
  return breadcrumb([{ label: "Order Placed", href: "#/order-placed" }]) +
    '<section class="py-5"><div class="container text-center">' +
      '<div class="py-5">' +
        '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#dcb14a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
        '<h2 class="mt-4 mb-3">Order placed successfully!</h2>' +
        '<p class="text-muted mb-4">Thank you for your purchase. In demo mode, this is a simulated order.</p>' +
        '<a href="#/shop" class="btn btn-dark">Continue Shopping</a>' +
      '</div>' +
    '</div></section>';
}

/* ---- Contact page ---- */
function renderContact() {
  return breadcrumb([{ label: "Contact", href: "#/contact" }]) +
    '<section class="py-5"><div class="container">' +
      '<div class="row">' +
        '<div class="col-lg-8 mb-4 mb-lg-0">' +
          '<h3 class="text-uppercase mb-4">Get in touch</h3>' +
          '<form onsubmit="event.preventDefault();_showToast(\'Demo mode — message sending is simulated\',\'success\')">' +
            '<div class="row">' +
              '<div class="col-md-6 mb-3"><label class="text-uppercase small">First Name</label><input class="form-control" type="text" required></div>' +
              '<div class="col-md-6 mb-3"><label class="text-uppercase small">Last Name</label><input class="form-control" type="text" required></div>' +
            '</div>' +
            '<div class="mb-3"><label class="text-uppercase small">Email</label><input class="form-control" type="email" required></div>' +
            '<div class="mb-3"><label class="text-uppercase small">Subject</label><input class="form-control" type="text" required></div>' +
            '<div class="mb-3"><label class="text-uppercase small">Message</label><textarea class="form-control" rows="5" required></textarea></div>' +
            '<button type="submit" class="btn btn-dark">Send Message</button>' +
          '</form>' +
        '</div>' +
        '<div class="col-lg-4">' +
          '<div class="bg-light p-4 mb-4">' +
            '<h6 class="text-uppercase mb-3">Customer service</h6>' +
            '<p class="text-small text-muted mb-1"><strong>Email:</strong> support@ljs-jewelry.com</p>' +
            '<p class="text-small text-muted mb-1"><strong>Phone:</strong> +1 (555) 123-4567</p>' +
            '<p class="text-small text-muted mb-0"><strong>Hours:</strong> Mon-Fri 9am-6pm</p>' +
          '</div>' +
          '<div class="bg-light p-4">' +
            '<h6 class="text-uppercase mb-3">Return policy</h6>' +
            '<p class="text-small text-muted mb-0">We offer a 30-day return policy on all items. Products must be in original condition with tags attached.</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div></section>';
}

/* ---- Login page ---- */
function renderLogin() {
  return breadcrumb([{ label: "Login", href: "#/login" }]) +
    '<section class="py-5"><div class="container">' +
      '<div class="row justify-content-center">' +
        '<div class="col-lg-5">' +
          '<div class="bg-light p-5">' +
            '<h3 class="text-uppercase text-center mb-4">Sign in</h3>' +
            '<form onsubmit="event.preventDefault();_showToast(\'Demo mode — login is simulated\',\'success\')">' +
              '<div class="mb-3"><label class="text-uppercase small">Email</label><input class="form-control form-control-lg" type="email" placeholder="Enter your email" required></div>' +
              '<div class="mb-4"><label class="text-uppercase small">Password</label><input class="form-control form-control-lg" type="password" placeholder="Enter your password" required></div>' +
              '<button type="submit" class="btn btn-dark btn-lg btn-block">Login</button>' +
            '</form>' +
            '<p class="text-center mt-3 mb-0 text-muted small">Don\'t have an account? <a href="#/register">Register here</a></p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div></section>';
}

/* ---- Register page ---- */
function renderRegister() {
  return breadcrumb([{ label: "Register", href: "#/register" }]) +
    '<section class="py-5"><div class="container">' +
      '<div class="row justify-content-center">' +
        '<div class="col-lg-6">' +
          '<div class="bg-light p-5">' +
            '<h3 class="text-uppercase text-center mb-4">Create account</h3>' +
            '<form onsubmit="event.preventDefault();_showToast(\'Demo mode — registration is simulated\',\'success\')">' +
              '<div class="row">' +
                '<div class="col-md-6 mb-3"><label class="text-uppercase small">First Name</label><input class="form-control form-control-lg" type="text" required></div>' +
                '<div class="col-md-6 mb-3"><label class="text-uppercase small">Last Name</label><input class="form-control form-control-lg" type="text" required></div>' +
              '</div>' +
              '<div class="mb-3"><label class="text-uppercase small">Email</label><input class="form-control form-control-lg" type="email" required></div>' +
              '<div class="mb-3"><label class="text-uppercase small">Username</label><input class="form-control form-control-lg" type="text" required></div>' +
              '<div class="mb-3"><label class="text-uppercase small">Password</label><input class="form-control form-control-lg" type="password" required></div>' +
              '<div class="mb-4"><label class="text-uppercase small">Confirm Password</label><input class="form-control form-control-lg" type="password" required></div>' +
              '<button type="submit" class="btn btn-dark btn-lg btn-block">Register</button>' +
            '</form>' +
            '<p class="text-center mt-3 mb-0 text-muted small">Already have an account? <a href="#/login">Sign in</a></p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div></section>';
}

/* ---- FAQ / Help page ---- */
function renderFAQ() {
  var faqs = [
    { q: "How do I place an order?", a: "Browse our products, add items to your cart, then proceed to checkout. Fill in your billing details and select a payment method." },
    { q: "What payment methods do you accept?", a: "We accept Cash on Delivery and PayPal. All transactions are secure and encrypted." },
    { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping (where available) takes 2-3 business days." },
    { q: "What is your return policy?", a: "We offer a 30-day return policy on all items. Products must be in their original condition with tags attached. Contact our customer service to initiate a return." },
    { q: "Do you offer international shipping?", a: "Yes, we ship worldwide. International shipping times and costs vary by destination." },
    { q: "How can I track my order?", a: "Once your order ships, you'll receive a tracking number via email. Use this to track your package on the carrier's website." }
  ];

  var html = breadcrumb([{ label: "FAQs", href: "#/faq" }]) +
    '<section class="py-5"><div class="container">' +
      '<div class="row justify-content-center"><div class="col-lg-8">';

  faqs.forEach(function (faq, i) {
    html += '<div class="faq-item mb-3">' +
      '<div class="faq-question bg-light p-3 cursor-pointer" onclick="toggleFaq(' + i + ')">' +
        '<strong class="text-uppercase small">' + faq.q + '</strong>' +
        '<span class="faq-toggle float-right" id="faq-toggle-' + i + '">+</span>' +
      '</div>' +
      '<div class="faq-answer p-3 border" id="faq-answer-' + i + '" style="display:none;">' +
        '<p class="text-muted mb-0">' + faq.a + '</p>' +
      '</div>' +
    '</div>';
  });

  html += '</div></div></div></section>';
  return html;
}

function toggleFaq(i) {
  var answer = document.getElementById("faq-answer-" + i);
  var toggle = document.getElementById("faq-toggle-" + i);
  if (!answer) return;
  if (answer.style.display === "none") {
    answer.style.display = "block";
    if (toggle) toggle.textContent = "−";
  } else {
    answer.style.display = "none";
    if (toggle) toggle.textContent = "+";
  }
}

/* ---- About page ---- */
function renderAbout() {
  return breadcrumb([{ label: "About Us", href: "#/about" }]) +
    '<section class="py-5 about-section"><div class="container">' +
      '<div class="row mb-5">' +
        '<div class="col-lg-6 mb-4 mb-lg-0">' +
          '<h3 class="text-uppercase mb-3">About LJS</h3>' +
          '<p class="text-muted">Luxury Jewelry Shop (LJS) is a premium jewelry retailer offering a curated collection of fine jewelry, watches, and accessories. Our pieces are crafted with meticulous attention to detail, using only the finest materials — gold, platinum, diamonds, and precious gemstones.</p>' +
          '<p class="text-muted">Founded with a passion for timeless elegance, we believe that every piece of jewelry tells a story. From delicate everyday pieces to statement creations, our collections are designed to celebrate life\'s most meaningful moments.</p>' +
        '</div>' +
        '<div class="col-lg-6">' +
          '<img class="img-fluid" src="assets/images/hero/shop-hero.jpg" alt="LJS Jewelry Collection">' +
        '</div>' +
      '</div>' +
      '<div class="row text-center py-4 border-top border-bottom">' +
        '<div class="col-md-3 col-6 mb-3 mb-md-0 about-value"><h4>10+</h4><p>Years of Excellence</p></div>' +
        '<div class="col-md-3 col-6 mb-3 mb-md-0 about-value"><h4>5000+</h4><p>Happy Customers</p></div>' +
        '<div class="col-md-3 col-6 about-value"><h4>200+</h4><p>Unique Designs</p></div>' +
        '<div class="col-md-3 col-6 about-value"><h4>7</h4><p>Collections</p></div>' +
      '</div>' +
      '<div class="row mt-5">' +
        '<div class="col-md-4 mb-4 text-center">' +
          '<h5 class="text-uppercase mb-2">Quality</h5>' +
          '<p class="text-muted text-small">Every piece undergoes rigorous quality inspection to ensure it meets our exacting standards.</p>' +
        '</div>' +
        '<div class="col-md-4 mb-4 text-center">' +
          '<h5 class="text-uppercase mb-2">Craftsmanship</h5>' +
          '<p class="text-muted text-small">Our master artisans bring decades of experience to every handcrafted piece.</p>' +
        '</div>' +
        '<div class="col-md-4 mb-4 text-center">' +
          '<h5 class="text-uppercase mb-2">Service</h5>' +
          '<p class="text-muted text-small">From purchase to aftercare, our dedicated team ensures your complete satisfaction.</p>' +
        '</div>' +
      '</div>' +
    '</div></section>';
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
  } else if (path === "/categories") {
    document.title = "Categories | LJS";
    app.innerHTML = renderCategories(products);
  } else if (path.indexOf("/product/") === 0) {
    var slug = path.replace("/product/", "");
    var prod = products.find(function (p) { return p.slug === slug; });
    document.title = prod ? prod.title + " | LJS" : "Product | LJS";
    app.innerHTML = renderProductDetail(products, slug);
  } else if (path === "/search") {
    var q = params.q || "";
    document.title = q ? "Search: " + q + " | LJS" : "Search | LJS";
    app.innerHTML = renderSearchResults(products, q);
  } else if (path === "/cart") {
    document.title = "Shopping Cart | LJS";
    app.innerHTML = renderCartPage();
  } else if (path === "/checkout") {
    document.title = "Checkout | LJS";
    app.innerHTML = renderCheckout();
  } else if (path === "/order-placed") {
    document.title = "Order Placed | LJS";
    app.innerHTML = renderOrderPlaced();
  } else if (path === "/contact") {
    document.title = "Contact | LJS";
    app.innerHTML = renderContact();
  } else if (path === "/login") {
    document.title = "Login | LJS";
    app.innerHTML = renderLogin();
  } else if (path === "/register") {
    document.title = "Register | LJS";
    app.innerHTML = renderRegister();
  } else if (path === "/faq") {
    document.title = "FAQs | LJS";
    app.innerHTML = renderFAQ();
  } else if (path === "/about") {
    document.title = "About | LJS";
    app.innerHTML = renderAbout();
  } else {
    document.title = "Page Not Found | LJS";
    app.innerHTML = '<section class="py-5"><div class="container text-center">' +
      '<h2 class="mb-3">Page not found</h2>' +
      '<p class="text-muted mb-4">The page you are looking for does not exist.</p>' +
      '<a href="#/" class="btn btn-dark">Go Home</a>' +
      '<a href="#/shop" class="btn btn-outline-dark ml-2">Browse Shop</a>' +
    '</div></section>';
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
    var loader = document.getElementById("app-loader");
    if (loader) loader.style.display = "none";
    var app = document.getElementById("app-content");
    if (app) app.innerHTML = '<div class="container py-5 text-center"><h2>Something went wrong</h2><p class="text-muted">Unable to load products. Please refresh the page.</p><a href="#/" class="btn btn-dark mt-3">Try Again</a></div>';
  }
}

document.addEventListener("DOMContentLoaded", initApp);