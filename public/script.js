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

/* ---- Wishlist (localStorage) ---- */
function getWishlist() {
  try {
    var raw = localStorage.getItem("ljs_wishlist");
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveWishlist(wishlist) {
  localStorage.setItem("ljs_wishlist", JSON.stringify(wishlist));
}

function toggleWishlist(productId) {
  productId = String(productId);
  var wishlist = getWishlist();
  var index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    _showToast("Removed from wishlist", "info");
  } else {
    wishlist.push(productId);
    _showToast("Added to wishlist", "success");
  }
  saveWishlist(wishlist);
  updateWishlistUI();
}

function removeFromWishlist(productId) {
  productId = String(productId);
  var wishlist = getWishlist();
  var index = wishlist.indexOf(productId);
  if (index > -1) wishlist.splice(index, 1);
  saveWishlist(wishlist);
  updateWishlistUI();
  route();
}

function updateWishlistUI() {
  var wishlist = getWishlist();
  var count = wishlist.length;
  var badge = document.getElementById("wishlist-badge");
  if (badge) { badge.textContent = count; badge.style.display = count > 0 ? "inline" : "none"; }
  var badgeMobile = document.getElementById("wishlist-badge-mobile");
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
            '<li class="list-inline-item m-0 p-0"><a class="btn btn-sm btn-outline-dark" href="#" onclick="event.preventDefault();toggleWishlist(' + product.id + ')">' + ICONS.heart + '</a></li>' +
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

/* ---- Terms & Conditions page ---- */
function renderTermsConditions() {
  var html = breadcrumb([{ label: "Terms & Conditions", href: "#/terms" }]);
  html += '<section class="py-5"><div class="container">' +
    '<div class="row">' +
      '<div class="col-lg-8">' +
        '<p class="small text-muted mb-4">Last updated: June 1, 2026</p>' +
        '<h3 class="text-uppercase mb-4">Terms & Conditions</h3>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">1. Introduction</h5>' +
          '<p class="text-muted">Welcome to LJS — Luxury Jewelry Shop. By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this website.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">2. Eligibility</h5>' +
          '<p class="text-muted">You must be at least 18 years of age to use this website. By placing an order, you represent that the products ordered will be used only in a lawful manner and in accordance with all applicable laws and regulations.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">3. Products & Pricing</h5>' +
          '<p class="text-muted">All products are subject to availability. We make every effort to display accurate product images, descriptions, and pricing. However, we do not guarantee that product images or descriptions are entirely accurate, complete, or error-free. Prices are subject to change without prior notice.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">4. Payment Terms</h5>' +
          '<p class="text-muted">We accept Cash on Delivery and PayPal as payment methods. All transactions are processed securely. Payment must be received in full before goods are dispatched, unless paying by Cash on Delivery.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">5. Intellectual Property</h5>' +
          '<p class="text-muted">All content on this website, including text, graphics, logos, images, and software, is the property of LJS and is protected by international copyright laws. Unauthorized use or reproduction is strictly prohibited.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">6. Limitation of Liability</h5>' +
          '<p class="text-muted">LJS shall not be held liable for any indirect, incidental, or consequential damages arising from the use of this website or the purchase of any products. Our total liability shall not exceed the purchase price of the product in question.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">7. Governing Law</h5>' +
          '<p class="text-muted">These terms and conditions shall be governed by and construed in accordance with applicable local laws. Any disputes arising from these terms shall be resolved through binding arbitration.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">8. Changes to Terms</h5>' +
          '<p class="text-muted">We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website constitutes acceptance of any modifications.</p></div>' +
      '</div>' +
      '<div class="col-lg-4">' +
        '<div class="bg-light p-4 mb-4">' +
          '<h6 class="text-uppercase mb-3">Questions?</h6>' +
          '<p class="text-small text-muted mb-1">If you have any questions about these terms, please contact us.</p>' +
          '<a href="#/contact" class="btn btn-sm btn-dark mt-2">Contact Us</a>' +
        '</div>' +
        '<div class="bg-light p-4">' +
          '<h6 class="text-uppercase mb-3">Related pages</h6>' +
          '<ul class="list-unstyled mb-0">' +
            '<li class="mb-2"><a href="#/privacy">Privacy Policy</a></li>' +
            '<li class="mb-2"><a href="#/returns">Returns & Refunds</a></li>' +
            '<li class="mb-2"><a href="#/shipping">Shipping Info</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</div></div></section>';
  return html;
}

/* ---- Privacy Policy page ---- */
function renderPrivacyPolicy() {
  var html = breadcrumb([{ label: "Privacy Policy", href: "#/privacy" }]);
  html += '<section class="py-5"><div class="container">' +
    '<div class="row">' +
      '<div class="col-lg-8">' +
        '<p class="small text-muted mb-4">Last updated: June 1, 2026</p>' +
        '<h3 class="text-uppercase mb-4">Privacy Policy</h3>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">1. Information We Collect</h5>' +
          '<p class="text-muted">We collect personal information that you provide when placing an order, creating an account, or contacting us. This includes your name, email address, shipping address, phone number, and payment details.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">2. How We Use Your Information</h5>' +
          '<p class="text-muted">We use your information to process orders, provide customer support, send order confirmations and shipping updates, and improve our website experience. We will never sell your personal information to third parties.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">3. Cookies</h5>' +
          '<p class="text-muted">Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You may configure your browser to reject cookies, though some features may not function properly as a result.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">4. Third-Party Sharing</h5>' +
          '<p class="text-muted">We may share your information with trusted third-party service providers who assist us in operating our website, processing payments, and delivering orders. These parties are contractually obligated to protect your data.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">5. Data Security</h5>' +
          '<p class="text-muted">We implement industry-standard security measures to protect your personal information, including SSL encryption for all transactions and secure data storage. However, no method of internet transmission is 100% secure.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">6. Your Rights</h5>' +
          '<p class="text-muted">You have the right to access, correct, or delete your personal information at any time. You may also opt out of marketing communications. To exercise these rights, please contact our customer service team.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">7. Contact Us</h5>' +
          '<p class="text-muted">If you have any questions about our privacy practices, please reach out to us at <a href="#/contact">our contact page</a> or email support@ljs-jewelry.com.</p></div>' +
      '</div>' +
      '<div class="col-lg-4">' +
        '<div class="bg-light p-4 mb-4">' +
          '<h6 class="text-uppercase mb-3">Your rights</h6>' +
          '<ul class="list-unstyled mb-0 text-small text-muted">' +
            '<li class="mb-2">&#10003; Access your data</li>' +
            '<li class="mb-2">&#10003; Request correction</li>' +
            '<li class="mb-2">&#10003; Delete your account</li>' +
            '<li class="mb-2">&#10003; Opt out of marketing</li>' +
          '</ul>' +
        '</div>' +
        '<div class="bg-light p-4">' +
          '<h6 class="text-uppercase mb-3">Related pages</h6>' +
          '<ul class="list-unstyled mb-0">' +
            '<li class="mb-2"><a href="#/terms">Terms & Conditions</a></li>' +
            '<li class="mb-2"><a href="#/returns">Returns & Refunds</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</div></div></section>';
  return html;
}

/* ---- Returns & Refunds page ---- */
function renderReturnsRefunds() {
  var html = breadcrumb([{ label: "Returns & Refunds", href: "#/returns" }]);
  html += '<section class="py-5"><div class="container">' +
    '<div class="row">' +
      '<div class="col-lg-8">' +
        '<h3 class="text-uppercase mb-4">Returns & Refunds Policy</h3>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">30-Day Return Window</h5>' +
          '<p class="text-muted">We offer a 30-day return window on all items from the date of delivery. Items must be returned in their original condition with all tags attached and original packaging intact.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">Eligibility Conditions</h5>' +
          '<p class="text-muted">To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging. Custom or personalized jewelry, earrings for hygiene reasons, and gift cards are non-returnable.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">How to Initiate a Return</h5>' +
          '<p class="text-muted">To start a return, contact our customer service team via our <a href="#/contact">contact page</a> or email support@ljs-jewelry.com with your order number. We will provide you with a return shipping label and instructions.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">Refund Process</h5>' +
          '<p class="text-muted">Once your return is received and inspected, we will notify you of the approval or rejection. If approved, your refund will be processed to your original method of payment within 5–7 business days.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">Exchanges</h5>' +
          '<p class="text-muted">If you need to exchange an item for a different size or style, contact us within 30 days of delivery. We will arrange the exchange once we receive the original item back.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">Damaged or Defective Items</h5>' +
          '<p class="text-muted">If you receive a damaged or defective item, please contact us immediately with photos of the damage. We will arrange a replacement or full refund at no additional cost to you.</p></div>' +
      '</div>' +
      '<div class="col-lg-4">' +
        '<div class="bg-light p-4 mb-4">' +
          '<h6 class="text-uppercase mb-3">Key details</h6>' +
          '<div class="d-flex justify-content-between mb-2"><span class="text-muted">Return window</span><strong>30 days</strong></div>' +
          '<div class="d-flex justify-content-between mb-2"><span class="text-muted">Refund timeline</span><strong>5–7 business days</strong></div>' +
          '<div class="d-flex justify-content-between mb-2"><span class="text-muted">Return shipping</span><strong>Free for defects</strong></div>' +
          '<hr>' +
          '<p class="text-small text-muted mb-2"><strong>Email:</strong> support@ljs-jewelry.com</p>' +
          '<p class="text-small text-muted mb-0"><strong>Phone:</strong> +1 (555) 123-4567</p>' +
        '</div>' +
        '<div class="bg-light p-4 mb-4">' +
          '<h6 class="text-uppercase mb-3">Non-returnable items</h6>' +
          '<ul class="list-unstyled mb-0 text-small text-muted">' +
            '<li class="mb-2">&times; Custom/personalized jewelry</li>' +
            '<li class="mb-2">&times; Earrings (hygiene)</li>' +
            '<li class="mb-0">&times; Gift cards</li>' +
          '</ul>' +
        '</div>' +
        '<a href="#/contact" class="btn btn-dark btn-block">Contact Support</a>' +
      '</div>' +
    '</div></div></section>';
  return html;
}

/* ---- Shipping Info page ---- */
function renderShippingInfo() {
  var html = breadcrumb([{ label: "Shipping Information", href: "#/shipping" }]);
  html += '<section class="py-5"><div class="container">' +
    '<div class="row">' +
      '<div class="col-lg-8">' +
        '<h3 class="text-uppercase mb-4">Shipping Information</h3>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-3">Shipping Methods</h5>' +
          '<table class="table table-bordered">' +
            '<thead class="bg-dark text-white"><tr><th>Method</th><th>Delivery Time</th><th>Cost</th></tr></thead>' +
            '<tbody>' +
              '<tr><td>Standard Shipping</td><td>5–7 business days</td><td>Free</td></tr>' +
              '<tr><td>Express Shipping</td><td>2–3 business days</td><td>' + formatPrice(15) + '</td></tr>' +
              '<tr><td>Overnight Shipping</td><td>1 business day</td><td>' + formatPrice(30) + '</td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">International Shipping</h5>' +
          '<p class="text-muted">We ship to most countries worldwide. International shipping times and costs vary by destination. Standard international delivery takes 10–15 business days. Express international delivery takes 5–7 business days. Customs duties and import taxes are the responsibility of the recipient.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">Order Processing</h5>' +
          '<p class="text-muted">Orders placed before 2:00 PM EST on business days are processed the same day. Orders placed after 2:00 PM or on weekends/holidays will be processed the next business day.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">Tracking Your Order</h5>' +
          '<p class="text-muted">Once your order ships, you will receive a confirmation email with a tracking number. You can use this number to track your package on the carrier\'s website. Track your order from your <a href="#/account">account page</a>.</p></div>' +
        '<div class="mb-4"><h5 class="text-uppercase mb-2">Shipping Restrictions</h5>' +
          '<p class="text-muted">Some items may have shipping restrictions due to value or size. High-value items (over ' + formatPrice(1000) + ') require a signature upon delivery. We cannot ship to P.O. boxes for express or overnight orders.</p></div>' +
      '</div>' +
      '<div class="col-lg-4">' +
        '<div class="bg-light p-4 mb-4 text-center">' +
          ICONS.delivery +
          '<h6 class="text-uppercase mt-3 mb-3">Quick facts</h6>' +
          '<p class="text-small text-muted mb-2">Free standard shipping on all orders</p>' +
          '<p class="text-small text-muted mb-2">Same-day processing before 2 PM EST</p>' +
          '<p class="text-small text-muted mb-0">Tracking included on all orders</p>' +
        '</div>' +
        '<div class="bg-light p-4">' +
          '<h6 class="text-uppercase mb-3">Related pages</h6>' +
          '<ul class="list-unstyled mb-0">' +
            '<li class="mb-2"><a href="#/returns">Returns & Refunds</a></li>' +
            '<li class="mb-2"><a href="#/contact">Contact Us</a></li>' +
            '<li class="mb-2"><a href="#/faq">FAQs</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
    '</div></div></section>';
  return html;
}

/* ---- Wishlist page ---- */
function renderWishlist() {
  var products = window._products || [];
  var wishlist = getWishlist();
  var ids = wishlist;

  var html = breadcrumb([{ label: "Wishlist", href: "#/wishlist" }]);

  if (ids.length === 0) {
    html += '<section class="py-5"><div class="container text-center">' +
      '<h2 class="mb-3">Your wishlist is empty</h2>' +
      '<p class="text-muted mb-4">Save your favorite pieces by clicking the heart icon on any product.</p>' +
      '<a href="#/shop" class="btn btn-dark">Browse Products</a>' +
    '</div></section>';
    return html;
  }

  html += '<section class="py-5"><div class="container">' +
    '<div class="d-flex align-items-center mb-4">' +
      '<h3 class="text-uppercase mb-0">Your Wishlist</h3>' +
      '<span class="ml-3 badge badge-pill bg-dark text-white">' + ids.length + ' item' + (ids.length !== 1 ? 's' : '') + '</span>' +
    '</div>' +
    '<div class="row">';

  ids.forEach(function (id) {
    var p = products.find(function (pr) { return String(pr.id) === id; });
    if (!p) return;
    html += '<div class="col-xl-3 col-lg-4 col-sm-6">' +
      '<div class="product text-center">' +
        '<div class="position-relative mb-3">' +
          '<a class="d-block" href="#/product/' + p.slug + '">' +
            '<img class="img-fluid w-100" src="' + p.image + '" alt="' + p.title + '" loading="lazy">' +
          '</a>' +
          '<div class="product-overlay">' +
            '<ul class="mb-0 list-inline">' +
              '<li class="list-inline-item m-0 p-0"><button class="btn btn-sm btn-dark" onclick="addToCart(' + p.id + ')">Add to Cart</button></li>' +
              '<li class="list-inline-item m-0 p-0"><button class="btn btn-sm btn-outline-dark" onclick="removeFromWishlist(' + p.id + ')">' + ICONS.close + '</button></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<h6><a class="reset-anchor" href="#/product/' + p.slug + '">' + p.title + '</a></h6>' +
        '<p class="small text-muted">' + formatPrice(p.price) + '</p>' +
      '</div>' +
    '</div>';
  });

  html += '</div></div></section>';
  return html;
}

/* ---- Blog page ---- */
function renderBlog() {
  var posts = [
    {
      title: "The Art of Choosing the Perfect Engagement Ring",
      category: "Guides",
      date: "May 28, 2026",
      image: "assets/images/hero/hero.jpg",
      excerpt: "Selecting an engagement ring is one of the most meaningful purchases you will ever make. From understanding the 4 Cs of diamond quality to choosing the right metal and setting, our comprehensive guide walks you through every consideration to find a ring as unique as your love story."
    },
    {
      title: "2026 Jewelry Trends: What's Hot This Season",
      category: "Trends",
      date: "May 15, 2026",
      image: "assets/images/hero/banner.jpg",
      excerpt: "This year's jewelry scene is all about bold individuality. Layered gold necklaces, oversized hoop earrings, and colorful gemstone rings are dominating runways and street style alike. Discover the key pieces to elevate your collection this season."
    },
    {
      title: "Caring for Your Gold Jewelry: Expert Tips",
      category: "Care",
      date: "April 30, 2026",
      image: "assets/images/hero/shop-hero.jpg",
      excerpt: "Gold jewelry is an investment that can last generations with proper care. Learn how to clean, store, and protect your precious pieces — from daily maintenance routines to professional servicing schedules that keep your jewelry looking brand new."
    }
  ];

  var html = breadcrumb([{ label: "Blog", href: "#/blog" }]);
  html += '<section class="py-5"><div class="container">' +
    '<h3 class="text-uppercase mb-4">From the Blog</h3>' +
    '<div class="row">';

  posts.forEach(function (post) {
    html += '<div class="col-lg-4 mb-4">' +
      '<div class="card border-0 shadow-sm h-100">' +
        '<img class="card-img-top" src="' + post.image + '" alt="' + post.title + '" style="height:200px;object-fit:cover;">' +
        '<div class="card-body">' +
          '<span class="small text-uppercase font-weight-bold" style="color:var(--gold);">' + post.category + '</span>' +
          '<h5 class="text-uppercase mt-2 mb-2">' + post.title + '</h5>' +
          '<p class="text-muted text-small mb-3">' + post.excerpt + '</p>' +
          '<p class="text-small text-muted mb-0">' + post.date + '</p>' +
        '</div>' +
        '<div class="card-footer border-0 bg-white pb-3">' +
          '<a href="#" class="btn btn-sm btn-outline-dark" onclick="event.preventDefault();_showToast(\'Demo mode — blog articles are simulated\',\'info\')">Read More</a>' +
        '</div>' +
      '</div>' +
    '</div>';
  });

  html += '</div></div></section>';
  return html;
}

/* ---- My Account page ---- */
function renderAccount() {
  var html = breadcrumb([{ label: "My Account", href: "#/account" }]);
  html += '<section class="py-5"><div class="container">' +
    '<div class="alert alert-info mb-4"><small>You are viewing a simulated account in demo mode. Changes will not persist.</small></div>' +
    '<div class="row">' +
      '<div class="col-lg-8">' +
        /* Profile card */
        '<div class="bg-light p-4 mb-4">' +
          '<div class="d-flex align-items-center mb-3">' +
            '<div class="mr-3" style="width:64px;height:64px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;">' +
              '<svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
            '</div>' +
            '<div>' +
              '<h5 class="mb-1">Alexandra Sterling</h5>' +
              '<p class="text-muted mb-0 small">alexandra@example.com</p>' +
              '<p class="text-muted mb-0 small">Member since January 2024</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        /* Order history */
        '<div class="bg-light p-4 mb-4">' +
          '<h5 class="text-uppercase mb-3">Recent Orders</h5>' +
          '<div class="d-none d-md-flex py-2 border-bottom font-weight-bold small text-uppercase">' +
            '<div class="col-md-2">Order</div><div class="col-md-3">Date</div><div class="col-md-3">Status</div><div class="col-md-2">Total</div><div class="col-md-2"></div>' +
          '</div>' +
          '<div class="d-flex align-items-center py-3 border-bottom">' +
            '<div class="col-md-2"><strong>#47</strong></div><div class="col-md-3"><span class="text-muted small">Jun 2, 2026</span></div><div class="col-md-3"><span class="badge badge-pending">Pending</span></div><div class="col-md-2">' + formatPrice(1299) + '</div><div class="col-md-2"><a href="#" class="small" onclick="event.preventDefault();_showToast(\'Demo mode\',\'info\')">View</a></div>' +
          '</div>' +
          '<div class="d-flex align-items-center py-3 border-bottom">' +
            '<div class="col-md-2"><strong>#39</strong></div><div class="col-md-3"><span class="text-muted small">Apr 15, 2026</span></div><div class="col-md-3"><span class="badge badge-delivered">Delivered</span></div><div class="col-md-2">' + formatPrice(780) + '</div><div class="col-md-2"><a href="#" class="small" onclick="event.preventDefault();_showToast(\'Demo mode\',\'info\')">View</a></div>' +
          '</div>' +
          '<div class="d-flex align-items-center py-3">' +
            '<div class="col-md-2"><strong>#28</strong></div><div class="col-md-3"><span class="text-muted small">Feb 8, 2026</span></div><div class="col-md-3"><span class="badge badge-delivered">Delivered</span></div><div class="col-md-2">' + formatPrice(1999) + '</div><div class="col-md-2"><a href="#" class="small" onclick="event.preventDefault();_showToast(\'Demo mode\',\'info\')">View</a></div>' +
          '</div>' +
        '</div>' +
        /* Address book */
        '<div class="bg-light p-4">' +
          '<h5 class="text-uppercase mb-3">Saved Address</h5>' +
          '<div class="border p-3">' +
            '<p class="mb-1"><strong>Home</strong></p>' +
            '<p class="text-muted small mb-0">742 Evergreen Terrace<br>Springfield, IL 62704<br>United States</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="col-lg-4">' +
        '<div class="bg-light p-4 mb-4">' +
          '<h6 class="text-uppercase mb-3">Account actions</h6>' +
          '<a href="#" class="btn btn-outline-dark btn-block btn-sm mb-2" onclick="event.preventDefault();_showToast(\'Demo mode — profile editing is simulated\',\'info\')">Edit Profile</a>' +
          '<a href="#" class="btn btn-outline-dark btn-block btn-sm mb-2" onclick="event.preventDefault();_showToast(\'Demo mode — password change is simulated\',\'info\')">Change Password</a>' +
          '<a href="#/wishlist" class="btn btn-outline-dark btn-block btn-sm mb-2">View Wishlist</a>' +
          '<a href="#/orders" class="btn btn-outline-dark btn-block btn-sm mb-2" onclick="event.preventDefault();_showToast(\'Demo mode — view orders in admin panel\',\'info\')">Order History</a>' +
          '<hr>' +
          '<a href="#/login" class="btn btn-dark btn-block btn-sm">Sign Out</a>' +
        '</div>' +
        '<div class="bg-light p-4">' +
          '<h6 class="text-uppercase mb-3">Need help?</h6>' +
          '<p class="text-small text-muted mb-2">Visit our FAQ or contact support.</p>' +
          '<a href="#/faq" class="btn btn-sm btn-outline-dark btn-block mb-2">FAQs</a>' +
          '<a href="#/contact" class="btn btn-sm btn-outline-dark btn-block">Contact Us</a>' +
        '</div>' +
      '</div>' +
    '</div></div></section>';
  return html;
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
  var parts = hash.substring(1).split("?");
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
  } else if (path === "/terms") {
    document.title = "Terms & Conditions | LJS";
    app.innerHTML = renderTermsConditions();
  } else if (path === "/privacy") {
    document.title = "Privacy Policy | LJS";
    app.innerHTML = renderPrivacyPolicy();
  } else if (path === "/returns") {
    document.title = "Returns & Refunds | LJS";
    app.innerHTML = renderReturnsRefunds();
  } else if (path === "/shipping") {
    document.title = "Shipping Information | LJS";
    app.innerHTML = renderShippingInfo();
  } else if (path === "/wishlist") {
    document.title = "Wishlist | LJS";
    app.innerHTML = renderWishlist();
  } else if (path === "/blog") {
    document.title = "Blog | LJS";
    app.innerHTML = renderBlog();
  } else if (path === "/account") {
    document.title = "My Account | LJS";
    app.innerHTML = renderAccount();
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
    updateWishlistUI();

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