from decimal import Decimal
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.core.exceptions import ValidationError

from store.models import Address, Category, Product, Cart, Order, OrderItem, OrderStatus


class ModelTests(TestCase):
    """Test model constraints, properties, and methods."""

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username='modeluser', password='testpass123')
        cls.category = Category.objects.create(
            title='Necklaces',
            slug='necklaces',
            is_active=True,
        )
        cls.product = Product.objects.create(
            title='Gold Necklace',
            slug='gold-necklace',
            sku='GN-001',
            short_description='A beautiful gold necklace',
            price=Decimal('199.99'),
            category=cls.category,
            is_active=True,
        )

    def test_cart_unique_together_constraint(self):
        """Cart must enforce unique_together constraint on (user, product)."""
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        with self.assertRaises(IntegrityError):
            Cart.objects.create(user=self.user, product=self.product, quantity=2)

    def test_cart_total_price_property(self):
        """Cart.total_price should return quantity * product.price."""
        cart = Cart.objects.create(user=self.user, product=self.product, quantity=3)
        expected = Decimal('599.97')  # 3 * 199.99
        self.assertEqual(cart.total_price, expected)

    def test_order_item_subtotal_property(self):
        """OrderItem.subtotal should return price * quantity."""
        order = Order.objects.create(
            user=self.user,
            address=Address.objects.create(
                user=self.user, locality='Downtown', city='NYC', state='NY'
            ),
        )
        item = OrderItem.objects.create(
            order=order,
            product=self.product,
            quantity=2,
            price=Decimal('199.99'),
        )
        self.assertEqual(item.subtotal, Decimal('399.98'))

    def test_order_calculate_total(self):
        """Order.calculate_total() should sum all OrderItem subtotals and update total_amount."""
        address = Address.objects.create(
            user=self.user, locality='Downtown', city='NYC', state='NY'
        )
        order = Order.objects.create(user=self.user, address=address)

        product2 = Product.objects.create(
            title='Silver Ring',
            slug='silver-ring',
            sku='SR-001',
            short_description='A silver ring',
            price=Decimal('49.99'),
            category=self.category,
            is_active=True,
        )

        OrderItem.objects.create(
            order=order, product=self.product, quantity=2, price=Decimal('199.99')
        )
        OrderItem.objects.create(
            order=order, product=product2, quantity=1, price=Decimal('49.99')
        )

        total = order.calculate_total()
        expected = Decimal('449.97')  # 2*199.99 + 1*49.99
        self.assertEqual(total, expected)

        order.refresh_from_db()
        self.assertEqual(order.total_amount, expected)

    def test_product_price_min_value_validator_rejects_zero(self):
        """Product.price MinValueValidator should reject 0."""
        product = Product(
            title='Free Item',
            slug='free-item',
            sku='FI-001',
            short_description='Should not be free',
            price=Decimal('0.00'),
            category=self.category,
        )
        with self.assertRaises(ValidationError):
            product.full_clean()

    def test_product_price_min_value_validator_rejects_negative(self):
        """Product.price MinValueValidator should reject negative values."""
        product = Product(
            title='Negative Item',
            slug='negative-item',
            sku='NI-001',
            short_description='Should not be negative',
            price=Decimal('-5.00'),
            category=self.category,
        )
        with self.assertRaises(ValidationError):
            product.full_clean()

    def test_category_slug_uniqueness(self):
        """Category slug must be unique."""
        with self.assertRaises(IntegrityError):
            Category.objects.create(
                title='Necklaces Duplicate',
                slug='necklaces',  # same slug as setUpTestData category
                is_active=True,
            )

    def test_product_slug_uniqueness(self):
        """Product slug must be unique."""
        with self.assertRaises(IntegrityError):
            Product.objects.create(
                title='Gold Necklace Duplicate',
                slug='gold-necklace',  # same slug as setUpTestData product
                sku='GN-002',
                short_description='Duplicate slug',
                price=Decimal('299.99'),
                category=self.category,
            )

    def test_order_status_choices(self):
        """OrderStatus choices should work correctly."""
        self.assertEqual(OrderStatus.PENDING, 'Pending')
        self.assertEqual(OrderStatus.ACCEPTED, 'Accepted')
        self.assertEqual(OrderStatus.PACKED, 'Packed')
        self.assertEqual(OrderStatus.ON_THE_WAY, 'On The Way')
        self.assertEqual(OrderStatus.DELIVERED, 'Delivered')
        self.assertEqual(OrderStatus.CANCELLED, 'Cancelled')

        # Verify choices list contains all statuses
        choice_values = [choice[0] for choice in OrderStatus.choices]
        self.assertIn('Pending', choice_values)
        self.assertIn('Accepted', choice_values)
        self.assertIn('Packed', choice_values)
        self.assertIn('On The Way', choice_values)
        self.assertIn('Delivered', choice_values)
        self.assertIn('Cancelled', choice_values)

    def test_order_default_status_is_pending(self):
        """New Order should default to Pending status."""
        address = Address.objects.create(
            user=self.user, locality='Downtown', city='NYC', state='NY'
        )
        order = Order.objects.create(user=self.user, address=address)
        self.assertEqual(order.status, OrderStatus.PENDING)


class ViewSecurityTests(TestCase):
    """Test security hardening: HTTP method restrictions, auth, and IDOR."""

    def setUp(self):
        self.client = Client()
        self.user_a = User.objects.create_user(username='usera', password='pass12345')
        self.user_b = User.objects.create_user(username='userb', password='pass12345')
        self.category = Category.objects.create(
            title='Rings', slug='rings', is_active=True
        )
        self.product = Product.objects.create(
            title='Diamond Ring',
            slug='diamond-ring',
            sku='DR-001',
            short_description='A diamond ring',
            price=Decimal('499.99'),
            category=self.category,
            is_active=True,
        )
        self.address_a = Address.objects.create(
            user=self.user_a, locality='Main St', city='Boston', state='MA'
        )
        self.address_b = Address.objects.create(
            user=self.user_b, locality='Elm St', city='Chicago', state='IL'
        )

    def test_add_to_cart_rejects_get(self):
        """add_to_cart should reject GET requests with 405."""
        self.client.login(username='usera', password='pass12345')
        url = reverse('store:add-to-cart')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 405)

    def test_remove_cart_rejects_get(self):
        """remove_cart should reject GET requests with 405."""
        self.client.login(username='usera', password='pass12345')
        cart = Cart.objects.create(user=self.user_a, product=self.product, quantity=1)
        url = reverse('store:remove-cart', kwargs={'cart_id': cart.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 405)

    def test_plus_cart_rejects_get(self):
        """plus_cart should reject GET requests with 405."""
        self.client.login(username='usera', password='pass12345')
        cart = Cart.objects.create(user=self.user_a, product=self.product, quantity=1)
        url = reverse('store:plus-cart', kwargs={'cart_id': cart.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 405)

    def test_minus_cart_rejects_get(self):
        """minus_cart should reject GET requests with 405."""
        self.client.login(username='usera', password='pass12345')
        cart = Cart.objects.create(user=self.user_a, product=self.product, quantity=2)
        url = reverse('store:minus-cart', kwargs={'cart_id': cart.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 405)

    def test_checkout_get_requires_login(self):
        """checkout GET should redirect unauthenticated users to login."""
        url = reverse('store:checkout')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.url.startswith('/accounts/login/'))

    def test_remove_address_rejects_get(self):
        """remove_address should reject GET requests with 405."""
        self.client.login(username='usera', password='pass12345')
        url = reverse('store:remove-address', kwargs={'address_id': self.address_a.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 405)

    def test_add_to_cart_requires_login(self):
        """add_to_cart should redirect unauthenticated users to login."""
        url = reverse('store:add-to-cart')
        response = self.client.post(url, {'prod_id': self.product.id})
        # Should redirect to login page
        self.assertEqual(response.status_code, 302)
        self.assertIn('/accounts/login/', response.url)

    def test_remove_cart_requires_login(self):
        """remove_cart should redirect unauthenticated users to login."""
        url = reverse('store:remove-cart', kwargs={'cart_id': 999})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 302)
        self.assertIn('/accounts/login/', response.url)

    def test_plus_cart_requires_login(self):
        """plus_cart should redirect unauthenticated users to login."""
        url = reverse('store:plus-cart', kwargs={'cart_id': 999})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 302)
        self.assertIn('/accounts/login/', response.url)

    def test_minus_cart_requires_login(self):
        """minus_cart should redirect unauthenticated users to login."""
        url = reverse('store:minus-cart', kwargs={'cart_id': 999})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 302)
        self.assertIn('/accounts/login/', response.url)

    def test_checkout_requires_login(self):
        """checkout should redirect unauthenticated users to login."""
        url = reverse('store:checkout')
        response = self.client.post(url, {'address': self.address_a.id})
        self.assertEqual(response.status_code, 302)
        self.assertIn('/accounts/login/', response.url)

    def test_idor_user_cannot_delete_other_users_cart_item(self):
        """User A should not be able to delete User B's cart item (IDOR protection)."""
        # User B adds product to cart
        cart_b = Cart.objects.create(user=self.user_b, product=self.product, quantity=1)

        # User A tries to delete User B's cart item
        self.client.login(username='usera', password='pass12345')
        url = reverse('store:remove-cart', kwargs={'cart_id': cart_b.id})
        response = self.client.post(url)
        # get_object_or_404 with user filter returns 404
        self.assertEqual(response.status_code, 404)
        # Cart item should still exist
        self.assertTrue(Cart.objects.filter(id=cart_b.id).exists())

    def test_idor_user_cannot_remove_other_users_address(self):
        """User A should not be able to remove User B's address (IDOR protection)."""
        # User A tries to delete User B's address
        self.client.login(username='usera', password='pass12345')
        url = reverse('store:remove-address', kwargs={'address_id': self.address_b.id})
        response = self.client.post(url)
        # get_object_or_404 with user filter returns 404
        self.assertEqual(response.status_code, 404)
        # Address should still exist
        self.assertTrue(Address.objects.filter(id=self.address_b.id).exists())


class CartFlowTests(TestCase):
    """Test cart and checkout flows end-to-end."""

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='shopper', password='pass12345')
        self.category = Category.objects.create(
            title='Bracelets', slug='bracelets', is_active=True
        )
        self.product = Product.objects.create(
            title='Silver Bracelet',
            slug='silver-bracelet',
            sku='SB-001',
            short_description='A silver bracelet',
            price=Decimal('89.99'),
            category=self.category,
            is_active=True,
        )
        self.product2 = Product.objects.create(
            title='Gold Bracelet',
            slug='gold-bracelet',
            sku='GB-001',
            short_description='A gold bracelet',
            price=Decimal('299.99'),
            category=self.category,
            is_active=True,
        )
        self.address = Address.objects.create(
            user=self.user, locality='Oak Ave', city='Portland', state='OR'
        )
        self.client.login(username='shopper', password='pass12345')

    def test_add_to_cart_creates_new_cart_item(self):
        """add_to_cart should create a new cart item."""
        url = reverse('store:add-to-cart')
        response = self.client.post(url, {'prod_id': self.product.id})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(Cart.objects.count(), 1)
        cart_item = Cart.objects.first()
        self.assertEqual(cart_item.user, self.user)
        self.assertEqual(cart_item.product, self.product)
        self.assertEqual(cart_item.quantity, 1)

    def test_add_to_cart_increments_quantity_if_product_already_in_cart(self):
        """add_to_cart should increment quantity if product is already in cart."""
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        url = reverse('store:add-to-cart')
        response = self.client.post(url, {'prod_id': self.product.id})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(Cart.objects.count(), 1)
        cart_item = Cart.objects.get(user=self.user, product=self.product)
        self.assertEqual(cart_item.quantity, 2)

    def test_remove_cart_deletes_cart_item(self):
        """remove_cart should delete the cart item."""
        cart = Cart.objects.create(user=self.user, product=self.product, quantity=1)
        url = reverse('store:remove-cart', kwargs={'cart_id': cart.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Cart.objects.filter(id=cart.id).exists())

    def test_plus_cart_increments_quantity(self):
        """plus_cart should increment the cart item quantity."""
        cart = Cart.objects.create(user=self.user, product=self.product, quantity=1)
        url = reverse('store:plus-cart', kwargs={'cart_id': cart.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 302)
        cart.refresh_from_db()
        self.assertEqual(cart.quantity, 2)

    def test_minus_cart_decrements_quantity(self):
        """minus_cart should decrement the cart item quantity."""
        cart = Cart.objects.create(user=self.user, product=self.product, quantity=3)
        url = reverse('store:minus-cart', kwargs={'cart_id': cart.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 302)
        cart.refresh_from_db()
        self.assertEqual(cart.quantity, 2)

    def test_minus_cart_deletes_if_quantity_reaches_zero(self):
        """minus_cart should delete the cart item if quantity reaches 0."""
        cart = Cart.objects.create(user=self.user, product=self.product, quantity=1)
        url = reverse('store:minus-cart', kwargs={'cart_id': cart.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Cart.objects.filter(id=cart.id).exists())

    def test_checkout_creates_order_with_items_and_clears_cart(self):
        """checkout should create Order with OrderItems and clear the cart."""
        cart1 = Cart.objects.create(user=self.user, product=self.product, quantity=2)
        cart2 = Cart.objects.create(user=self.user, product=self.product2, quantity=1)

        url = reverse('store:checkout')
        response = self.client.post(url, {'address': self.address.id})
        self.assertEqual(response.status_code, 302)

        # Cart should be cleared
        self.assertEqual(Cart.objects.filter(user=self.user).count(), 0)

        # Order should be created
        order = Order.objects.get(user=self.user)
        self.assertEqual(order.address, self.address)
        self.assertEqual(order.status, OrderStatus.PENDING)

        # OrderItems should be created
        items = order.items.all()
        self.assertEqual(items.count(), 2)

        # Verify total was calculated
        expected_total = Decimal('89.99') * 2 + Decimal('299.99') * 1
        order.refresh_from_db()
        self.assertEqual(order.total_amount, expected_total)

    def test_checkout_redirects_with_error_if_cart_is_empty(self):
        """checkout should redirect with error if cart is empty."""
        url = reverse('store:checkout')
        response = self.client.post(url, {'address': self.address.id}, follow=True)
        self.assertEqual(response.status_code, 200)
        # Check error message is in the response
        messages = list(response.context.get('messages', []))
        error_texts = [m.message for m in messages]
        self.assertTrue(any('empty' in str(m).lower() for m in messages))

    def test_checkout_redirects_with_error_if_address_not_owned(self):
        """checkout should redirect with error if address doesn't belong to user."""
        other_user = User.objects.create_user(username='other', password='pass12345')
        other_address = Address.objects.create(
            user=other_user, locality='Pine St', city='Seattle', state='WA'
        )
        Cart.objects.create(user=self.user, product=self.product, quantity=1)

        url = reverse('store:checkout')
        response = self.client.post(url, {'address': other_address.id})
        # get_object_or_404 with user filter should return 404
        self.assertEqual(response.status_code, 404)


class ViewTests(TestCase):
    """Test basic view responses."""

    @classmethod
    def setUpTestData(cls):
        cls.category = Category.objects.create(
            title='Earrings', slug='earrings', is_active=True
        )
        cls.product = Product.objects.create(
            title='Pearl Earrings',
            slug='pearl-earrings',
            sku='PE-001',
            short_description='Beautiful pearl earrings',
            price=Decimal('59.99'),
            category=cls.category,
            is_active=True,
        )
        cls.inactive_product = Product.objects.create(
            title='Hidden Earrings',
            slug='hidden-earrings',
            sku='HE-001',
            short_description='Not visible',
            price=Decimal('39.99'),
            category=cls.category,
            is_active=False,
        )

    def test_home_returns_200(self):
        """home view should return 200."""
        url = reverse('store:home')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_shop_returns_200(self):
        """shop view should return 200."""
        url = reverse('store:shop')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_product_detail_returns_200_for_valid_slug(self):
        """Product detail should return 200 for a valid slug."""
        url = reverse('store:product-detail', kwargs={'slug': 'pearl-earrings'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_product_detail_returns_404_for_invalid_slug(self):
        """Product detail should return 404 for an invalid slug."""
        url = reverse('store:product-detail', kwargs={'slug': 'nonexistent-product'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_search_with_query_returns_results(self):
        """Search with a query should return matching results."""
        url = reverse('store:search')
        response = self.client.get(url, {'q': 'Pearl'})
        self.assertEqual(response.status_code, 200)
        # The product list in context should contain the matching product
        products = response.context['products']
        product_ids = [p.id for p in products.object_list]
        self.assertIn(self.product.id, product_ids)

    def test_search_without_query_returns_empty(self):
        """Search without a query should return empty results."""
        url = reverse('store:search')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        products = response.context['products']
        self.assertEqual(len(products.object_list), 0)


class RegistrationViewTests(TestCase):
    """Test the registration view."""

    def setUp(self):
        self.client = Client()
        self.url = reverse('store:register')

    def test_registration_page_loads(self):
        """GET /accounts/register/ should return 200."""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_registration_creates_user(self):
        """POST with valid data should create a new user and redirect."""
        user_count_before = User.objects.count()
        response = self.client.post(self.url, {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password1': 'StrongPass123!',
            'password2': 'StrongPass123!',
        })
        self.assertEqual(User.objects.count(), user_count_before + 1)
        new_user = User.objects.get(username='newuser')
        self.assertEqual(new_user.email, 'newuser@example.com')
        # Should redirect to login page after successful registration
        self.assertEqual(response.status_code, 302)
        self.assertIn('/accounts/login/', response.url)

    def test_registration_duplicate_email(self):
        """POST with an email that already exists should return the form with errors."""
        User.objects.create_user(
            username='existinguser', password='pass12345', email='taken@example.com'
        )
        response = self.client.post(self.url, {
            'username': 'anotheruser',
            'email': 'taken@example.com',
            'password1': 'StrongPass123!',
            'password2': 'StrongPass123!',
        })
        # Should re-render the form (200), not redirect (302)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(User.objects.filter(username='anotheruser').exists())

    def test_registration_invalid_password(self):
        """POST with mismatched passwords should return the form with errors."""
        response = self.client.post(self.url, {
            'username': 'badpassuser',
            'email': 'badpass@example.com',
            'password1': 'StrongPass123!',
            'password2': 'DifferentPass456!',
        })
        # Should re-render the form (200), not redirect (302)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(User.objects.filter(username='badpassuser').exists())


class AddressViewTests(TestCase):
    """Test the address views."""

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='addressuser', password='pass12345')
        self.add_url = reverse('store:add-address')

    def test_add_address_page_loads(self):
        """GET /accounts/add-address/ should redirect unauthenticated users to login."""
        response = self.client.get(self.add_url)
        self.assertEqual(response.status_code, 302)
        self.assertIn('/accounts/login/', response.url)

    def test_add_address_authenticated(self):
        """Authenticated GET should return 200."""
        self.client.login(username='addressuser', password='pass12345')
        response = self.client.get(self.add_url)
        self.assertEqual(response.status_code, 200)

    def test_add_address_post(self):
        """POST with valid data should create an address and redirect to profile."""
        self.client.login(username='addressuser', password='pass12345')
        address_count_before = Address.objects.count()
        response = self.client.post(self.add_url, {
            'locality': '123 Main St',
            'city': 'Springfield',
            'state': 'IL',
            'phone': '555-1234',
        })
        self.assertEqual(Address.objects.count(), address_count_before + 1)
        new_address = Address.objects.latest('id')
        self.assertEqual(new_address.user, self.user)
        self.assertEqual(new_address.locality, '123 Main St')
        self.assertEqual(new_address.city, 'Springfield')
        self.assertEqual(new_address.state, 'IL')
        # Should redirect to profile
        self.assertEqual(response.status_code, 302)
        self.assertIn('/accounts/profile/', response.url)

    def test_remove_address(self):
        """POST to remove_address should delete the address and redirect."""
        self.client.login(username='addressuser', password='pass12345')
        address = Address.objects.create(
            user=self.user, locality='Elm St', city='Boston', state='MA'
        )
        remove_url = reverse('store:remove-address', kwargs={'address_id': address.id})
        response = self.client.post(remove_url)
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Address.objects.filter(id=address.id).exists())


class ProfileViewTests(TestCase):
    """Test the profile view."""

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='profileuser', password='pass12345')
        self.url = reverse('store:profile')

    def test_profile_page_loads(self):
        """GET /accounts/profile/ should redirect unauthenticated users to login."""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 302)
        self.assertIn('/accounts/login/', response.url)

    def test_profile_authenticated(self):
        """Authenticated GET should return 200 with addresses and orders in context."""
        self.client.login(username='profileuser', password='pass12345')
        address = Address.objects.create(
            user=self.user, locality='Oak Ave', city='Portland', state='OR'
        )
        category = Category.objects.create(title='Pendants', slug='pendants', is_active=True)
        product = Product.objects.create(
            title='Gold Pendant',
            slug='gold-pendant',
            sku='GP-001',
            short_description='A gold pendant',
            price=Decimal('149.99'),
            category=category,
            is_active=True,
        )
        order = Order.objects.create(user=self.user, address=address)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('addresses', response.context)
        self.assertIn('orders', response.context)
        self.assertEqual(list(response.context['addresses']), [address])
        self.assertEqual(list(response.context['orders']), [order])


class SearchViewTests(TestCase):
    """Test the search view."""

    @classmethod
    def setUpTestData(cls):
        cls.category = Category.objects.create(
            title='Rings', slug='rings-search', is_active=True
        )
        cls.product_ring = Product.objects.create(
            title='Silver Ring',
            slug='silver-ring-search',
            sku='SRS-001',
            short_description='A silver ring',
            price=Decimal('79.99'),
            category=cls.category,
            is_active=True,
        )
        cls.product_necklace = Product.objects.create(
            title='Gold Necklace',
            slug='gold-necklace-search',
            sku='GNS-001',
            short_description='A gold necklace',
            price=Decimal('199.99'),
            category=cls.category,
            is_active=True,
        )

    def test_search_with_query(self):
        """GET /search/?q=ring should return 200 and find products matching 'ring'."""
        url = reverse('store:search')
        response = self.client.get(url, {'q': 'ring'})
        self.assertEqual(response.status_code, 200)
        product_ids = [p.id for p in response.context['products'].object_list]
        self.assertIn(self.product_ring.id, product_ids)
        self.assertNotIn(self.product_necklace.id, product_ids)

    def test_search_no_results(self):
        """GET /search/?q=zzzzz should return 200 with empty results."""
        url = reverse('store:search')
        response = self.client.get(url, {'q': 'zzzzz'})
        self.assertEqual(response.status_code, 200)
        products = response.context['products'].object_list
        self.assertEqual(len(products), 0)

    def test_search_empty_query(self):
        """GET /search/ (no q param) should return 200 with empty results."""
        url = reverse('store:search')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        products = response.context['products'].object_list
        self.assertEqual(len(products), 0)


class InactiveProductTests(TestCase):
    """Test that inactive products are excluded from storefront views."""

    @classmethod
    def setUpTestData(cls):
        cls.category = Category.objects.create(
            title='Watches', slug='watches-inactive', is_active=True
        )
        cls.active_product = Product.objects.create(
            title='Active Watch',
            slug='active-watch',
            sku='AW-001',
            short_description='An active watch',
            price=Decimal('299.99'),
            category=cls.category,
            is_active=True,
        )
        cls.inactive_product = Product.objects.create(
            title='Inactive Watch',
            slug='inactive-watch',
            sku='IW-001',
            short_description='Not for sale',
            price=Decimal('199.99'),
            category=cls.category,
            is_active=False,
        )

    def test_home_excludes_inactive(self):
        """Home page context should not include inactive products."""
        url = reverse('store:home')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        product_ids = [p.id for p in response.context['products']]
        self.assertIn(self.active_product.id, product_ids)
        self.assertNotIn(self.inactive_product.id, product_ids)

    def test_shop_excludes_inactive(self):
        """Shop page should not include inactive products."""
        url = reverse('store:shop')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        product_ids = [p.id for p in response.context['products'].object_list]
        self.assertIn(self.active_product.id, product_ids)
        self.assertNotIn(self.inactive_product.id, product_ids)

    def test_search_excludes_inactive(self):
        """Search should not find inactive products."""
        url = reverse('store:search')
        response = self.client.get(url, {'q': 'Watch'})
        self.assertEqual(response.status_code, 200)
        product_ids = [p.id for p in response.context['products'].object_list]
        self.assertIn(self.active_product.id, product_ids)
        self.assertNotIn(self.inactive_product.id, product_ids)


class ShippingFeeTests(TestCase):
    """Test that shipping fees come from settings, not hardcoded values."""

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='shipuser', password='pass12345')
        self.category = Category.objects.create(
            title='Charms', slug='charms-ship', is_active=True
        )
        self.product = Product.objects.create(
            title='Lucky Charm',
            slug='lucky-charm',
            sku='LC-001',
            short_description='A lucky charm',
            price=Decimal('49.99'),
            category=self.category,
            is_active=True,
        )
        self.address = Address.objects.create(
            user=self.user, locality='Main St', city='Austin', state='TX'
        )
        self.client.login(username='shipuser', password='pass12345')

    def test_cart_uses_settings_shipping(self):
        """Cart page should use DEFAULT_SHIPPING_FEE from settings."""
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        url = reverse('store:cart')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        from django.conf import settings
        expected_shipping = settings.DEFAULT_SHIPPING_FEE
        self.assertEqual(response.context['shipping_amount'], expected_shipping)

    def test_checkout_uses_settings_shipping(self):
        """Checkout page should use DEFAULT_SHIPPING_FEE from settings."""
        Cart.objects.create(user=self.user, product=self.product, quantity=1)
        url = reverse('store:checkout')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        from django.conf import settings
        expected_shipping = settings.DEFAULT_SHIPPING_FEE
        self.assertEqual(response.context['shipping_amount'], expected_shipping)


class ContextProcessorTests(TestCase):
    """Test context processors for menu and cart data."""

    @classmethod
    def setUpTestData(cls):
        cls.category = Category.objects.create(
            title='Anklets', slug='anklets-ctx', is_active=True
        )
        cls.product = Product.objects.create(
            title='Silver Anklet',
            slug='silver-anklet',
            sku='SA-001',
            short_description='A silver anklet',
            price=Decimal('39.99'),
            category=cls.category,
            is_active=True,
        )

    def test_categories_menu_in_context(self):
        """Every page response should have categories_menu in context."""
        url = reverse('store:home')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('categories_menu', response.context)
        category_ids = [c.id for c in response.context['categories_menu']]
        self.assertIn(self.category.id, category_ids)

    def test_cart_items_authenticated(self):
        """Authenticated user should have their cart items in context."""
        user = User.objects.create_user(username='ctxuser', password='pass12345')
        self.client.login(username='ctxuser', password='pass12345')
        Cart.objects.create(user=user, product=self.product, quantity=2)

        url = reverse('store:home')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # cart_menu context processor adds cart_items
        self.assertIn('cart_items', response.context)
        self.assertEqual(len(response.context['cart_items']), 1)
        self.assertEqual(response.context['cart_items'][0].product, self.product)

    def test_cart_items_anonymous(self):
        """Anonymous user should have empty cart context."""
        url = reverse('store:home')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # cart_menu returns {} for anonymous users, so cart_items may not be in context
        # or may be empty
        cart_items = response.context.get('cart_items')
        if cart_items is not None:
            self.assertEqual(len(cart_items), 0)


class OrderDetailViewTests(TestCase):
    """Test the order detail view."""

    def setUp(self):
        self.client = Client()
        self.user_a = User.objects.create_user(username='orderusera', password='pass12345')
        self.user_b = User.objects.create_user(username='orderuserb', password='pass12345')
        self.category = Category.objects.create(
            title='Brooches', slug='brooches-od', is_active=True
        )
        self.product = Product.objects.create(
            title='Ruby Brooch',
            slug='ruby-brooch',
            sku='RB-001',
            short_description='A ruby brooch',
            price=Decimal('599.99'),
            category=self.category,
            is_active=True,
        )
        self.address_a = Address.objects.create(
            user=self.user_a, locality='First St', city='Denver', state='CO'
        )
        self.address_b = Address.objects.create(
            user=self.user_b, locality='Second St', city='Miami', state='FL'
        )
        self.order_a = Order.objects.create(user=self.user_a, address=self.address_a)
        OrderItem.objects.create(
            order=self.order_a, product=self.product, quantity=1, price=Decimal('599.99')
        )
        self.order_a.calculate_total()

    def test_order_detail_authenticated(self):
        """Authenticated user can view their own order detail."""
        self.client.login(username='orderusera', password='pass12345')
        url = reverse('store:order-detail', kwargs={'order_id': self.order_a.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['order'], self.order_a)

    def test_order_detail_other_user(self):
        """User cannot view another user's order detail (404)."""
        self.client.login(username='orderuserb', password='pass12345')
        url = reverse('store:order-detail', kwargs={'order_id': self.order_a.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_order_detail_unauthenticated(self):
        """Unauthenticated user is redirected to login."""
        url = reverse('store:order-detail', kwargs={'order_id': self.order_a.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)
        self.assertIn('/accounts/login/', response.url)