from decimal import Decimal
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class Address(models.Model):
    user = models.ForeignKey(User, verbose_name="User", on_delete=models.CASCADE)
    locality = models.CharField(max_length=150, verbose_name="Nearest Location")
    city = models.CharField(max_length=150, verbose_name="City")
    state = models.CharField(max_length=150, verbose_name="State")
    phone = models.CharField(max_length=20, blank=True, default='', verbose_name='Phone Number')

    def __str__(self):
        if self.phone:
            return f"{self.locality}, {self.city}, {self.state} - {self.phone}"
        return f"{self.locality}, {self.city}, {self.state}"

    class Meta:
        verbose_name_plural = 'Addresses'


class Category(models.Model):
    title = models.CharField(max_length=50, verbose_name="Category Title")
    slug = models.SlugField(max_length=55, verbose_name="Category Slug", unique=True)
    description = models.TextField(blank=True, verbose_name="Category Description")
    category_image = models.ImageField(upload_to='category', blank=True, null=True, verbose_name="Category Image")
    is_active = models.BooleanField(default=False, verbose_name="Is Active?")
    is_featured = models.BooleanField(default=False, verbose_name="Is Featured?")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created Date")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated Date")

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ('-created_at',)

    def __str__(self):
        return self.title


class Product(models.Model):
    title = models.CharField(max_length=150, verbose_name="Product Title")
    slug = models.SlugField(max_length=160, verbose_name="Product Slug", unique=True)
    sku = models.CharField(max_length=255, unique=True, verbose_name="Unique Product ID (SKU)")
    short_description = models.TextField(verbose_name="Short Description")
    detail_description = models.TextField(blank=True, null=True, verbose_name="Detail Description")
    product_image = models.ImageField(upload_to='product', blank=True, null=True, verbose_name="Product Image")
    price = models.DecimalField(
        max_digits=8, decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name="Price"
    )
    category = models.ForeignKey(Category, verbose_name="Product Category", on_delete=models.PROTECT)
    is_active = models.BooleanField(default=False, verbose_name="Is Active?")
    is_featured = models.BooleanField(default=False, verbose_name="Is Featured?")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created Date")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated Date")

    class Meta:
        verbose_name_plural = 'Products'
        ordering = ('-created_at',)

    def __str__(self):
        return self.title


class Cart(models.Model):
    user = models.ForeignKey(User, verbose_name="User", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, verbose_name="Product", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(
        default=1, verbose_name="Quantity",
        validators=[MinValueValidator(1)]
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created Date")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated Date")

    class Meta:
        unique_together = ('user', 'product')
        verbose_name_plural = 'Cart Items'

    def __str__(self):
        return f"{self.user.username} - {self.product.title}"

    @property
    def total_price(self):
        return self.quantity * self.product.price


class OrderStatus(models.TextChoices):
    PENDING = 'Pending', 'Pending'
    ACCEPTED = 'Accepted', 'Accepted'
    PACKED = 'Packed', 'Packed'
    ON_THE_WAY = 'On The Way', 'On The Way'
    DELIVERED = 'Delivered', 'Delivered'
    CANCELLED = 'Cancelled', 'Cancelled'


class Order(models.Model):
    user = models.ForeignKey(User, verbose_name="User", on_delete=models.CASCADE)
    address = models.ForeignKey(Address, verbose_name="Shipping Address", on_delete=models.PROTECT)
    ordered_date = models.DateTimeField(auto_now_add=True, verbose_name="Ordered Date")
    status = models.CharField(
        max_length=50,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
        verbose_name="Order Status"
    )
    total_amount = models.DecimalField(
        max_digits=10, decimal_places=2,
        default=Decimal('0.00'),
        verbose_name="Total Amount"
    )

    class Meta:
        verbose_name_plural = 'Orders'
        ordering = ('-ordered_date',)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"

    def calculate_total(self):
        total = sum(item.subtotal for item in self.items.all())
        self.total_amount = total
        self.save(update_fields=['total_amount'])
        return total


class OrderItem(models.Model):
    order = models.ForeignKey(Order, verbose_name="Order", on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, verbose_name="Product", on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(
        default=1, verbose_name="Quantity",
        validators=[MinValueValidator(1)]
    )
    price = models.DecimalField(
        max_digits=8, decimal_places=2,
        verbose_name="Price at time of order"
    )

    class Meta:
        verbose_name_plural = 'Order Items'

    def __str__(self):
        try:
            return f"{self.product.title} x {self.quantity}"
        except Exception:
            return f"OrderItem #{self.pk} x {self.quantity}"

    @property
    def subtotal(self):
        if self.price is None:
            return Decimal('0.00')
        return self.price * self.quantity