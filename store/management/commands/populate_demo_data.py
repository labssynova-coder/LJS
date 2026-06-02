from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from decimal import Decimal
from store.models import Category, Product, Address, Order, OrderItem, Cart


class Command(BaseCommand):
    help = 'Populate the database with demo data for live testing'

    def handle(self, *args, **options):
        # Create categories with realistic jewelry data
        categories_data = [
            {"title": "Rings", "slug": "rings", "description": "Exquisite rings crafted with precious metals and gemstones", "is_active": True, "is_featured": True},
            {"title": "Necklaces", "slug": "necklaces", "description": "Elegant necklaces for every occasion", "is_active": True, "is_featured": True},
            {"title": "Earrings", "slug": "earrings", "description": "Stunning earrings from delicate studs to statement drops", "is_active": True, "is_featured": True},
            {"title": "Bracelets", "slug": "bracelets", "description": "Beautiful bracelets in gold, silver, and platinum", "is_active": True, "is_featured": True},
            {"title": "Watches", "slug": "watches", "description": "Luxury timepieces from world-renowned makers", "is_active": True, "is_featured": True},
            {"title": "Gifts", "slug": "gifts", "description": "Curated gift collections for special occasions", "is_active": True, "is_featured": False},
            {"title": "Bead Necklaces", "slug": "bead-necklaces", "description": "Handcrafted bead necklaces with unique patterns", "is_active": True, "is_featured": False},
        ]

        for cat_data in categories_data:
            Category.objects.get_or_create(slug=cat_data["slug"], defaults=cat_data)

        self.stdout.write(self.style.SUCCESS('Categories populated'))

        # Create demo customer users
        customers = []
        customer_data = [
            {"username": "sarah.miller", "email": "sarah@example.com", "first_name": "Sarah", "last_name": "Miller"},
            {"username": "james.wilson", "email": "james@example.com", "first_name": "James", "last_name": "Wilson"},
            {"username": "emily.chen", "email": "emily@example.com", "first_name": "Emily", "last_name": "Chen"},
            {"username": "michael.brown", "email": "michael@example.com", "first_name": "Michael", "last_name": "Brown"},
            {"username": "olivia.davis", "email": "olivia@example.com", "first_name": "Olivia", "last_name": "Davis"},
        ]

        for data in customer_data:
            user, created = User.objects.get_or_create(username=data["username"], defaults={**data, "is_active": True})
            if created:
                user.set_password("demo1234")
                user.save()
            customers.append(user)

        self.stdout.write(self.style.SUCCESS(f'{len(customers)} demo customers created'))

        # Create addresses for customers
        addresses_data = [
            {"user": customers[0], "locality": "123 Diamond Lane", "city": "New York", "state": "NY", "phone": "212-555-0101"},
            {"user": customers[0], "locality": "456 Gold Ave", "city": "Los Angeles", "state": "CA", "phone": "310-555-0202"},
            {"user": customers[1], "locality": "789 Ruby St", "city": "Chicago", "state": "IL", "phone": "312-555-0303"},
            {"user": customers[2], "locality": "321 Pearl Blvd", "city": "Houston", "state": "TX", "phone": "713-555-0404"},
            {"user": customers[3], "locality": "654 Emerald Dr", "city": "Phoenix", "state": "AZ", "phone": "602-555-0505"},
            {"user": customers[4], "locality": "987 Sapphire Way", "city": "Seattle", "state": "WA", "phone": "206-555-0606"},
        ]

        for addr_data in addresses_data:
            Address.objects.get_or_create(
                locality=addr_data["locality"],
                city=addr_data["city"],
                user=addr_data["user"],
                defaults={"state": addr_data["state"], "phone": addr_data.get("phone", "")}
            )

        self.stdout.write(self.style.SUCCESS('Addresses populated'))

        # Create products with realistic jewelry data
        rings = Category.objects.get(slug="rings")
        necklaces = Category.objects.get(slug="necklaces")
        earrings = Category.objects.get(slug="earrings")
        bracelets = Category.objects.get(slug="bracelets")
        watches_cat = Category.objects.get(slug="watches")

        products_data = [
            # Rings
            {"title": "Diamond Solitaire Ring", "slug": "diamond-solitaire-ring", "sku": "RG001", "category": rings, "price": Decimal("2499.99"), "is_active": True, "is_featured": True, "short_description": "A timeless diamond solitaire ring set in 18k white gold"},
            {"title": "Rose Gold Engagement Ring", "slug": "rose-gold-engagement-ring", "sku": "RG002", "category": rings, "price": Decimal("1899.99"), "is_active": True, "is_featured": True, "short_description": "Stunning rose gold engagement ring with halo setting"},
            {"title": "Vintage Emerald Ring", "slug": "vintage-emerald-ring", "sku": "RG003", "category": rings, "price": Decimal("3250.00"), "is_active": True, "is_featured": False, "short_description": "Art deco inspired emerald and diamond ring"},
            {"title": "Sterling Silver Band", "slug": "sterling-silver-band", "sku": "RG004", "category": rings, "price": Decimal("89.99"), "is_active": True, "is_featured": False, "short_description": "Classic sterling silver wedding band"},
            # Necklaces
            {"title": "Pearl Pendant Necklace", "slug": "pearl-pendant-necklace", "sku": "NK001", "category": necklaces, "price": Decimal("459.99"), "is_active": True, "is_featured": True, "short_description": "Elegant freshwater pearl pendant on 18k gold chain"},
            {"title": "Diamond Tennis Necklace", "slug": "diamond-tennis-necklace", "sku": "NK002", "category": necklaces, "price": Decimal("5999.99"), "is_active": True, "is_featured": True, "short_description": "3-carat total weight diamond tennis necklace in platinum"},
            {"title": "Gold Chain Necklace", "slug": "gold-chain-necklace", "sku": "NK003", "category": necklaces, "price": Decimal("349.99"), "is_active": True, "is_featured": False, "short_description": "22k gold cable chain necklace"},
            # Earrings
            {"title": "Diamond Stud Earrings", "slug": "diamond-stud-earrings", "sku": "ER001", "category": earrings, "price": Decimal("799.99"), "is_active": True, "is_featured": True, "short_description": "Classic 0.5ct diamond stud earrings in white gold"},
            {"title": "Pearl Drop Earrings", "slug": "pearl-drop-earrings", "sku": "ER002", "category": earrings, "price": Decimal("199.99"), "is_active": True, "is_featured": False, "short_description": "Elegant South Sea pearl drop earrings"},
            # Bracelets
            {"title": "Gold Bangle Bracelet", "slug": "gold-bangle-bracelet", "sku": "BR001", "category": bracelets, "price": Decimal("699.99"), "is_active": True, "is_featured": True, "short_description": "18k gold hammered bangle bracelet"},
            {"title": "Silver Charm Bracelet", "slug": "silver-charm-bracelet", "sku": "BR002", "category": bracelets, "price": Decimal("149.99"), "is_active": True, "is_featured": False, "short_description": "Sterling silver charm bracelet with 5 heart charms"},
            # Watches
            {"title": "Luxury Chronograph Watch", "slug": "luxury-chronograph-watch", "sku": "WT001", "category": watches_cat, "price": Decimal("4500.00"), "is_active": True, "is_featured": True, "short_description": "Swiss-made chronograph with sapphire crystal"},
            {"title": "Rose Gold Dress Watch", "slug": "rose-gold-dress-watch", "sku": "WT002", "category": watches_cat, "price": Decimal("1899.99"), "is_active": True, "is_featured": False, "short_description": "Elegant rose gold dress watch with leather strap"},
        ]

        for prod_data in products_data:
            Product.objects.get_or_create(slug=prod_data["slug"], defaults=prod_data)

        self.stdout.write(self.style.SUCCESS(f'{len(products_data)} products created'))

        # Create demo orders with various statuses
        orders_data = [
            {"user": customers[0], "status": "Delivered", "total": Decimal("2959.98"), "items": [("Diamond Solitaire Ring", 1), ("Pearl Pendant Necklace", 1)]},
            {"user": customers[1], "status": "On The Way", "total": Decimal("799.99"), "items": [("Diamond Stud Earrings", 1)]},
            {"user": customers[2], "status": "Accepted", "total": Decimal("1899.99"), "items": [("Rose Gold Engagement Ring", 1)]},
            {"user": customers[0], "status": "Pending", "total": Decimal("5999.99"), "items": [("Diamond Tennis Necklace", 1)]},
            {"user": customers[3], "status": "Delivered", "total": Decimal("789.98"), "items": [("Gold Bangle Bracelet", 1), ("Sterling Silver Band", 1)]},
            {"user": customers[4], "status": "Cancelled", "total": Decimal("349.99"), "items": [("Gold Chain Necklace", 1)]},
            {"user": customers[1], "status": "Delivered", "total": Decimal("4500.00"), "items": [("Luxury Chronograph Watch", 1)]},
            {"user": customers[2], "status": "Pending", "total": Decimal("199.99"), "items": [("Pearl Drop Earrings", 1)]},
        ]

        for order_data in orders_data:
            user_address = Address.objects.filter(user=order_data["user"]).first()
            order, created = Order.objects.get_or_create(
                user=order_data["user"],
                status=order_data["status"],
                total_amount=order_data["total"],
                defaults={
                    "address": user_address,
                },
            )
            if created:
                for item_title, qty in order_data["items"]:
                    product = Product.objects.filter(title=item_title).first()
                    if product:
                        OrderItem.objects.create(
                            order=order,
                            product=product,
                            quantity=qty,
                            price=product.price,
                        )

        self.stdout.write(self.style.SUCCESS(f'{len(orders_data)} demo orders created'))

        # Create some cart items for the admin user
        admin_user = User.objects.filter(is_superuser=True).first()
        if admin_user:
            for product in Product.objects.filter(is_active=True)[:3]:
                Cart.objects.get_or_create(
                    user=admin_user,
                    product=product,
                    defaults={"quantity": 1}
                )

        self.stdout.write(self.style.SUCCESS('Demo data populated successfully!'))
        self.stdout.write(self.style.WARNING('Note: Product images are not included. Upload images via the admin panel or add them manually.'))