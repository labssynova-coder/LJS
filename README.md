# 💎 LJS — Luxury Jewelry Shop

A modern, elegant e-commerce website for jewelry built with **Django 4.2**, featuring a white/black/golden theme, a polished admin panel, and a complete storefront experience.

> Inspired by [vijaythapa333/django-jewelry-shop](https://github.com/vijaythapa333/django-jewelry-shop) — reimagined with security hardening, UI/UX overhaul, and a cohesive golden theme across storefront and admin.

---

## 🌐 Live Demo

| Demo | URL | Description |
|------|-----|-------------|
| 🛍️ **Storefront** | [labssynova-coder.github.io/LJS/](https://labssynova-coder.github.io/LJS/) | Browse products, cart, search, wishlist, account, and policy pages — fully interactive with mock data |
| ⚙️ **Admin Panel** | [labssynova-coder.github.io/LJS/admin/](https://labssynova-coder.github.io/LJS/admin/) | Dashboard, products, orders, categories — demo mode, no login needed |

> The public demo works entirely in the browser with embedded mock data. The Django backend is the production-capable app for real accounts, carts, checkout, orders, and admin management.

---

## ✨ Features

### Storefront
- **Responsive design** — mobile-first Bootstrap 4 layout with golden accent theme
- **Product catalog** — browse by category, search, or view all products
- **Product detail pages** — image lightbox, descriptions, reviews, related products
- **Shopping cart** — add/remove items, quantity controls, shipping calculation
- **Wishlist** — save favorite items, heart icon toggle, dedicated wishlist page in the static demo
- **Blog** — jewelry guides, trends, and care tips in the static demo
- **My Account** — simulated profile, order history, address book in the static demo
- **User accounts** — register, login, profile management, address book, order history
- **Search** — real-time product search with pagination
- **Policy pages** — Terms & Conditions, Privacy Policy, Returns & Refunds, Shipping Info in the static demo

### Admin Panel (Jazzmin)
- **Dark navy sidebar** with golden accent theme matching the storefront
- **Dashboard** — at-a-glance stats with recent actions timeline
- **Category management** — inline editing, search, filters
- **Product management** — inline editing, image uploads, category filters
- **Order management** — inline order items, status updates
- **Cart viewer** — see what's in users' carts

### Security & Quality
- **POST + CSRF** for add-to-cart (not GET — prevents CSRF attacks)
- **`|intcomma`** price formatting (prevents injection via template)
- **Image-less products excluded** from storefront (no broken placeholder images)
- **Safe OrderItem handling** — no crash on deleted product references
- **62 passing tests** covering models, views, cart flow, checkout, and search

---

## 🎨 Theme

| Element | Color |
|---------|-------|
| Primary dark | `#212529` |
| Golden accent | `#dcb14a` |
| Background | `#ffffff` / `#f8f9fa` |
| Muted text | `#6c757d` |

The golden accent (`#dcb14a`) is applied to:
- Button hovers (btn-dark → gold)
- Form focus borders
- Pagination active states
- Card header borders
- Hero section accents
- Admin sidebar highlights

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 4.2 (Python 3.12) |
| Database | SQLite 3 (dev) |
| Frontend | Bootstrap 4, jQuery, Owl Carousel, Lightbox2, noUiSlider |
| Admin | django-jazzmin with AdminLTE theme |
| Fonts | Libre Franklin, Martel Sans |

---

## 📸 Screenshots

### 🛍️ Storefront

<table>
  <tr>
    <td align="center"><b>Homepage</b></td>
    <td align="center"><b>Shop</b></td>
  </tr>
  <tr>
    <td><img src="docs/demo/01-homepage.png" width="480"></td>
    <td><img src="docs/demo/02-shop.png" width="480"></td>
  </tr>
  <tr>
    <td align="center"><b>Categories</b></td>
    <td align="center"><b>Product Detail</b></td>
  </tr>
  <tr>
    <td><img src="docs/demo/03-categories.png" width="480"></td>
    <td><img src="docs/demo/04-product-detail.png" width="480"></td>
  </tr>
  <tr>
    <td align="center"><b>Login</b></td>
    <td align="center"><b>Register</b></td>
  </tr>
  <tr>
    <td><img src="docs/demo/05-login.png" width="480"></td>
    <td><img src="docs/demo/06-register.png" width="480"></td>
  </tr>
  <tr>
    <td align="center"><b>Search Results</b></td>
    <td align="center"><b>Checkout</b></td>
  </tr>
  <tr>
    <td><img src="docs/demo/07-search.png" width="480"></td>
    <td><img src="docs/demo/08-checkout.png" width="480"></td>
  </tr>
  <tr>
    <td align="center"><b>Shopping Cart</b></td>
    <td align="center"><b>Contact</b></td>
  </tr>
  <tr>
    <td><img src="docs/demo/09-cart.png" width="480"></td>
    <td><img src="docs/demo/14-contact.png" width="480"></td>
  </tr>
  <tr>
    <td align="center"><b>FAQ</b></td>
    <td align="center"><b>About Us</b></td>
  </tr>
  <tr>
    <td><img src="docs/demo/15-faq.png" width="480"></td>
    <td><img src="docs/demo/16-about.png" width="480"></td>
  </tr>
  <tr>
    <td align="center"><b>Terms & Conditions</b></td>
    <td align="center"><b>Privacy Policy</b></td>
  </tr>
  <tr>
    <td><img src="docs/demo/18-terms.png" width="480"></td>
    <td><img src="docs/demo/19-privacy.png" width="480"></td>
  </tr>
  <tr>
    <td align="center"><b>Returns & Refunds</b></td>
    <td align="center"><b>Shipping Info</b></td>
  </tr>
  <tr>
    <td><img src="docs/demo/20-returns.png" width="480"></td>
    <td><img src="docs/demo/21-shipping.png" width="480"></td>
  </tr>
  <tr>
    <td align="center"><b>Wishlist</b></td>
    <td align="center"><b>Blog</b></td>
  </tr>
  <tr>
    <td><img src="docs/demo/22-wishlist.png" width="480"></td>
    <td><img src="docs/demo/23-blog.png" width="480"></td>
  </tr>
  <tr>
    <td align="center"><b>My Account</b></td>
    <td align="center"><b>Order Placed</b></td>
  </tr>
  <tr>
    <td><img src="docs/demo/24-account.png" width="480"></td>
    <td><img src="docs/demo/17-order-placed.png" width="480"></td>
  </tr>
</table>

### ⚙️ Admin Panel

<table>
  <tr>
    <td align="center"><b>Dashboard</b></td>
    <td align="center"><b>Products</b></td>
  </tr>
  <tr>
    <td><img src="docs/demo/10-admin-dashboard.png" width="480"></td>
    <td><img src="docs/demo/11-admin-products.png" width="480"></td>
  </tr>
  <tr>
    <td align="center"><b>Categories</b></td>
    <td align="center"><b>Orders</b></td>
  </tr>
  <tr>
    <td><img src="docs/demo/12-admin-categories.png" width="480"></td>
    <td><img src="docs/demo/13-admin-orders.png" width="480"></td>
  </tr>
  <tr>
    <td align="center"><b>Settings</b></td>
    <td></td>
  </tr>
  <tr>
    <td><img src="docs/demo/25-admin-settings.png" width="480"></td>
    <td></td>
  </tr>
</table>

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- pip

### 1. Clone & Setup
```bash
git clone https://github.com/labssynova-coder/LJS.git
cd LJS

python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your secret key and settings
```

### 3. Initialize Database
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py loaddata store/fixtures/demo_data.json   # optional: demo products & categories
```

### 4. Run
```bash
python manage.py runserver
```
- **Storefront**: http://127.0.0.1:8000/
- **Admin panel**: http://127.0.0.1:8000/admin/

---

## 📁 Project Structure

```
LJS/
├── jewelryshop/          # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── static/
│       ├── css/          # style.default.css, custom.css, admin_custom.css
│       ├── img/          # hero, categories, placeholder images
│       └── vendor/      # Bootstrap, Owl Carousel, Lightbox2, noUiSlider
├── store/                # Main app
│   ├── models.py         # Category, Product, Cart, Order, OrderItem, Address
│   ├── views.py          # All storefront views
│   ├── admin.py         # Jazzmin admin configuration
│   ├── forms.py          # Registration, Address forms
│   ├── tests.py          # 62 tests
│   └── fixtures/         # demo_data.json
├── templates/            # Django templates
│   ├── base.html         # Base layout with theme CSS
│   ├── navbar.html
│   ├── footer.html
│   ├── scripts.html
│   ├── store/            # index, shop, detail, cart, checkout, orders, search
│   ├── account/          # register, login, profile, address, password reset
│   └── partials/         # _hero_breadcrumb, _add_to_cart_btn, _product_image
├── docs/demo/            # Screenshots for README
├── public/               # GitHub Pages static demo
├── .github/workflows/    # GitHub Pages deployment
├── media/                # User-uploaded images (gitignored)
├── .env.example
├── requirements.txt
└── manage.py
```

---

## 🧪 Running Tests

```bash
python manage.py test store -v 2
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `Django>=4.2,<5.0` | Web framework |
| `Pillow>=10.0` | Image handling |
| `django-jazzmin>=3.0` | Admin theme |
| `gunicorn>=21.0` | Production WSGI server |

---

## 🚢 Deployment

### GitHub Pages (Demo)
The `public/` directory contains a static showcase page. Pushing to `main` automatically deploys it via GitHub Actions to `https://labssynova-coder.github.io/LJS/`.

### Render / Railway (Production)
For a live Django deployment:
```bash
pip install gunicorn
gunicorn jewelryshop.wsgi:application
```
Set environment variables: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, `DJANGO_ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com`, and `DJANGO_CSRF_TRUSTED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com`.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Credits

- Original project by [Vijay Thapa](https://github.com/vijaythapa333)
- Enhanced and maintained by [Synovalabs](https://synovalabs.tech)
