/* ============================================================
   LJS — Luxury Jewelry Shop: Mock Data & API Layer
   Static storefront demo — no backend required
   ============================================================ */

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    title: "Anne Klein Gold Watch",
    slug: "anne-klein-gold-watch",
    price: 300,
    category: "Watches",
    categorySlug: "watches",
    image: "assets/images/products/Anne-Klein-Gold-Watch.jpg",
    shortDescription: "Elegant gold watch by Anne Klein with a timeless design perfect for any occasion.",
    isFeatured: true
  },
  {
    id: 2,
    title: "Gold Rado Watch",
    slug: "gold-rado-watch",
    price: 400,
    category: "Watches",
    categorySlug: "watches",
    image: "assets/images/products/Gold-and-Steel-Rado-Watch-with-Black-Dial.jpg",
    shortDescription: "Luxurious gold Rado watch combining Swiss precision with stunning aesthetics.",
    isFeatured: true
  },
  {
    id: 3,
    title: "Colorful Beads Necklace",
    slug: "colorful-beads-necklace",
    price: 20,
    category: "Bead Necklaces",
    categorySlug: "bead-necklaces",
    image: "assets/images/products/Beads-Necklace.jpg",
    shortDescription: "Vibrant and playful bead necklace that adds a pop of color to any outfit.",
    isFeatured: false
  },
  {
    id: 4,
    title: "Thick Gold and Diamond Ring",
    slug: "thick-gold-and-diamond-ring",
    price: 500,
    category: "Rings",
    categorySlug: "rings",
    image: "assets/images/products/gold-and-diamond-ring.jpg",
    shortDescription: "Bold thick gold ring adorned with dazzling diamonds for a statement look.",
    isFeatured: true
  },
  {
    id: 5,
    title: "Gold Bracelet Indian Style",
    slug: "gold-bracelet-indian-style",
    price: 550,
    category: "Bracelets",
    categorySlug: "bracelets",
    image: "assets/images/products/Gold-Bracelet.jpg",
    shortDescription: "Traditional Indian-style gold bracelet with intricate patterns and rich heritage.",
    isFeatured: true
  },
  {
    id: 6,
    title: "Gold Bracelet Thin",
    slug: "gold-bracelet-thin",
    price: 340,
    category: "Bracelets",
    categorySlug: "bracelets",
    image: "assets/images/products/Gold-Bracelets.jpg",
    shortDescription: "Delicate thin gold bracelet for a subtle touch of elegance on any wrist.",
    isFeatured: false
  },
  {
    id: 7,
    title: "Gold Casio Touch Watch",
    slug: "gold-casio-touch-watch",
    price: 600,
    category: "Watches",
    categorySlug: "watches",
    image: "assets/images/products/Gold-Casio-Touch-Watch.jpg",
    shortDescription: "Modern Casio touch-screen watch with a luxurious gold finish and smart features.",
    isFeatured: true
  },
  {
    id: 8,
    title: "Gold Leafy Earrings",
    slug: "gold-leafy-earrings",
    price: 230,
    category: "Earrings",
    categorySlug: "earrings",
    image: "assets/images/products/Gold-Leafy-Earrings.jpg",
    shortDescription: "Graceful leaf-inspired gold earrings that bring nature's beauty to your look.",
    isFeatured: false
  },
  {
    id: 9,
    title: "Gold Necklace with Diamonds",
    slug: "gold-necklace-with-diamonds",
    price: 900,
    category: "Necklaces",
    categorySlug: "necklaces",
    image: "assets/images/products/Gold-Necklace-with-Diamonds.jpg",
    shortDescription: "Stunning gold necklace set with brilliant diamonds for an unforgettable presence.",
    isFeatured: true
  },
  {
    id: 10,
    title: "Gold Ring with Blue Stones",
    slug: "gold-ring-with-blue-stones",
    price: 480,
    category: "Rings",
    categorySlug: "rings",
    image: "assets/images/products/Gold-Ring-with-Blue-Stones.jpg",
    shortDescription: "Elegant gold ring featuring vibrant blue stones that catch the light beautifully.",
    isFeatured: true
  },
  {
    id: 11,
    title: "Gold Ring with Pink Stone",
    slug: "gold-ring-with-pink-stone",
    price: 499,
    category: "Rings",
    categorySlug: "rings",
    image: "assets/images/products/Gold-ring-with-pink-stone-and-diamonds.jpg",
    shortDescription: "Romantic gold ring with a delicate pink stone center for a feminine touch.",
    isFeatured: false
  },
  {
    id: 12,
    title: "Gold Ring with Diamond",
    slug: "gold-ring-with-diamond",
    price: 990,
    category: "Rings",
    categorySlug: "rings",
    image: "assets/images/products/Gold-Ring-with-White-Stone.jpg",
    shortDescription: "Classic gold ring crowned with a brilliant diamond — the epitome of luxury.",
    isFeatured: true
  },
  {
    id: 13,
    title: "Gold Star Earrings",
    slug: "gold-star-earrings",
    price: 420,
    category: "Earrings",
    categorySlug: "earrings",
    image: "assets/images/products/Gold-Star-Earrings.jpg",
    shortDescription: "Celestial-inspired star earrings in gold that sparkle with every movement.",
    isFeatured: false
  },
  {
    id: 14,
    title: "Gold Watch with White Dial and Diamonds",
    slug: "gold-watch-with-white-dial-and-diamonds",
    price: 780,
    category: "Watches",
    categorySlug: "watches",
    image: "assets/images/products/Gold-Watch-with-White-Dial-and-Diamonds.jpg",
    shortDescription: "Sophisticated gold watch featuring a white dial and diamond accents for pure elegance.",
    isFeatured: true
  },
  {
    id: 15,
    title: "Gold Watch with White Dial",
    slug: "gold-watch-with-white-dial",
    price: 650,
    category: "Watches",
    categorySlug: "watches",
    image: "assets/images/products/Gold-Watch-with-White-Dial.jpg",
    shortDescription: "Refined gold watch with a clean white dial that exudes understated sophistication.",
    isFeatured: false
  },
  {
    id: 16,
    title: "Gold Mangalsutra",
    slug: "gold-mangalsutra",
    price: 500,
    category: "Bead Necklaces",
    categorySlug: "bead-necklaces",
    image: "assets/images/products/Mangalsutra-with-Gold-Locket.jpg",
    shortDescription: "Traditional gold mangalsutra with black beads, a symbol of sacred marital bond.",
    isFeatured: false
  },
  {
    id: 17,
    title: "Mr Boho Gold Watch",
    slug: "mr-boho-gold-watch",
    price: 680,
    category: "Watches",
    categorySlug: "watches",
    image: "assets/images/products/Mr-Boho-Gold-Watch.jpg",
    shortDescription: "Chic bohemian-inspired gold watch for the free-spirited fashion enthusiast.",
    isFeatured: true
  },
  {
    id: 18,
    title: "Platinum Ring with Diamonds",
    slug: "platinum-ring-with-diamonds",
    price: 1999,
    category: "Rings",
    categorySlug: "rings",
    image: "assets/images/products/Platinum-Ring-with-Diamonds.jpg",
    shortDescription: "Exquisite platinum ring encrusted with diamonds — the ultimate symbol of prestige.",
    isFeatured: true
  },
  {
    id: 19,
    title: "Silver Earrings with Blue Stones",
    slug: "silver-earrings-with-blue-stones",
    price: 270,
    category: "Earrings",
    categorySlug: "earrings",
    image: "assets/images/products/Silver-Earrings-with-Blue-Stone.jpg",
    shortDescription: "Elegant silver earrings with mesmerizing blue stones for a cool, sophisticated look.",
    isFeatured: false
  },
  {
    id: 20,
    title: "Silver Necklace with Big Diamond",
    slug: "silver-necklace-with-big-diamond",
    price: 800,
    category: "Necklaces",
    categorySlug: "necklaces",
    image: "assets/images/products/Silver-Necklace-with-Big-Diamond.jpg",
    shortDescription: "Breathtaking silver necklace featuring a show-stopping large diamond centerpiece.",
    isFeatured: true
  },
  {
    id: 21,
    title: "Silver Ring with Blue Stone",
    slug: "silver-ring-with-blue-stone",
    price: 350,
    category: "Rings",
    categorySlug: "rings",
    image: "assets/images/products/Silver-Ring-with-Blue-Stone-and-Diamonds.jpg",
    shortDescription: "Striking silver ring with a vivid blue stone that commands attention.",
    isFeatured: false
  },
  {
    id: 22,
    title: "Silver Ring with Small Diamonds",
    slug: "silver-ring-with-small-diamonds",
    price: 550,
    category: "Rings",
    categorySlug: "rings",
    image: "assets/images/products/SIlver-Ring-with-Diamonds.jpg",
    shortDescription: "Elegant silver ring adorned with small diamonds for a delicate, refined sparkle.",
    isFeatured: false
  },
  {
    id: 23,
    title: "Silver Ring with Red Stone",
    slug: "silver-ring-with-red-stone",
    price: 488,
    category: "Rings",
    categorySlug: "rings",
    image: "assets/images/products/Silver-Ring-with-Red-Stone.jpg",
    shortDescription: "Bold silver ring featuring a striking red stone for passionate elegance.",
    isFeatured: false
  },
  {
    id: 24,
    title: "Gold BitCoin",
    slug: "gold-bitcoin",
    price: 500,
    category: "Gifts",
    categorySlug: "gifts",
    image: "assets/images/products/gold-bitcoin.jpg",
    shortDescription: "Unique gold Bitcoin collectible — a perfect gift for the modern luxury enthusiast.",
    isFeatured: true
  }
];

const FALLBACK_CATEGORIES = [
  { id: 1, title: "Necklaces", slug: "necklaces", image: "assets/images/categories/necklaces.jpg" },
  { id: 2, title: "Rings", slug: "rings", image: "assets/images/categories/rings.jpg" },
  { id: 3, title: "Bracelets", slug: "bracelets", image: "assets/images/categories/bracelets.jpg" },
  { id: 4, title: "Earrings", slug: "earrings", image: "assets/images/categories/ear-rings.jpg" },
  { id: 5, title: "Watches", slug: "watches", image: "assets/images/categories/watches.jpg" },
  { id: 6, title: "Bead Necklaces", slug: "bead-necklaces", image: "assets/images/categories/bead-necklace.jpg" },
  { id: 7, title: "Gifts", slug: "gifts", image: "assets/images/categories/gifts.jpg" }
];

/* ---- Static hosting detection ---- */
const IS_STATIC_HOST =
  window.location.hostname.endsWith('.github.io') ||
  window.location.protocol === 'file:' ||
  (window.location.port === '' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');

let DEMO_MODE = IS_STATIC_HOST;

async function detectDemoMode() {
  if (IS_STATIC_HOST) {
    DEMO_MODE = true;
    return true;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('/api/health', { signal: controller.signal });
    clearTimeout(timeout);
    DEMO_MODE = !res.ok;
  } catch {
    DEMO_MODE = true;
  }
  return DEMO_MODE;
}

/* ---- Data loaders ---- */
async function loadProducts() {
  if (IS_STATIC_HOST) return FALLBACK_PRODUCTS;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('/api/products/', { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch { /* fall through to fallback */ }
  return FALLBACK_PRODUCTS;
}

async function loadCategories() {
  if (IS_STATIC_HOST) return FALLBACK_CATEGORIES;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('/api/categories/', { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch { /* fall through to fallback */ }
  return FALLBACK_CATEGORIES;
}

/* ---- API object (demo stubs) ---- */
const Api = {
  addToCart(productId) {
    showToast("Demo mode — cart is simulated", "info");
  },
  placeOrder() {
    showToast("Demo mode — orders are not processed", "info");
  }
};

/* ---- Toast helper (used by api.js, script.js adds its own) ---- */
function showToast(message, type) {
  if (typeof window._showToast === "function") {
    window._showToast(message, type);
  }
}