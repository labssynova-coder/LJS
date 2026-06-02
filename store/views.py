from django.conf import settings
from django.shortcuts import redirect, render, get_object_or_404
from django.contrib import messages
from django.views import View
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.decorators.http import require_POST
from django.db import transaction
from django.db.models import Sum, F, DecimalField
from django.core.paginator import Paginator

from store.models import Address, Cart, Category, Order, OrderItem, Product
from .forms import RegistrationForm, AddressForm


def home(request):
    products = Product.objects.filter(is_active=True).select_related('category')[:8]
    featured_products = Product.objects.filter(is_active=True, is_featured=True).select_related('category')[:4]
    categories = Category.objects.filter(is_active=True, is_featured=True).only('title', 'slug', 'category_image')
    if not categories.exists():
        categories = Category.objects.filter(is_active=True).only('title', 'slug', 'category_image')
    context = {
        'products': products,
        'featured_products': featured_products,
        'categories': categories,
    }
    return render(request, 'store/index.html', context)


def contact(request):
    return render(request, 'store/contact.html')


def detail(request, slug):
    product = get_object_or_404(Product.objects.select_related('category'), slug=slug, is_active=True)
    related_products = Product.objects.exclude(id=product.id).filter(is_active=True, category=product.category)[:4]
    context = {
        'product': product,
        'related_products': related_products,
    }
    return render(request, 'store/detail.html', context)


def all_categories(request):
    categories = Category.objects.filter(is_active=True)
    return render(request, 'store/categories.html', {'categories': categories})


def category_products(request, slug):
    category = get_object_or_404(Category, slug=slug)
    product_list = Product.objects.filter(is_active=True, category=category).select_related('category')
    paginator = Paginator(product_list, 12)
    page_number = request.GET.get('page')
    products = paginator.get_page(page_number)
    context = {
        'category': category,
        'products': products,
    }
    return render(request, 'store/category_products.html', context)


def search(request):
    query = request.GET.get('q', '')
    if query:
        product_list = Product.objects.filter(is_active=True, title__icontains=query).select_related('category')
    else:
        product_list = Product.objects.none()
    paginator = Paginator(product_list, 12)
    page_number = request.GET.get('page')
    products = paginator.get_page(page_number)
    context = {
        'products': products,
        'query': query,
    }
    return render(request, 'store/search_results.html', context)


class RegistrationView(View):
    def get(self, request):
        form = RegistrationForm()
        return render(request, 'account/register.html', {'form': form})

    def post(self, request):
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Congratulations! Registration Successful.")
            return redirect('store:login')
        return render(request, 'account/register.html', {'form': form})


@login_required
def profile(request):
    addresses = Address.objects.filter(user=request.user)
    orders = Order.objects.filter(user=request.user).prefetch_related('items__product')
    return render(request, 'account/profile.html', {'addresses': addresses, 'orders': orders})


class AddressView(LoginRequiredMixin, View):
    def get(self, request):
        form = AddressForm()
        return render(request, 'account/add_address.html', {'form': form})

    def post(self, request):
        form = AddressForm(request.POST)
        if form.is_valid():
            address = form.save(commit=False)
            address.user = request.user
            address.save()
            messages.success(request, "New Address Added Successfully.")
            return redirect('store:profile')
        return render(request, 'account/add_address.html', {'form': form})


@require_POST
@login_required
def remove_address(request, address_id):
    a = get_object_or_404(Address, user=request.user, id=address_id)
    a.delete()
    messages.success(request, "Address removed.")
    return redirect('store:profile')


@require_POST
@login_required
def add_to_cart(request):
    user = request.user
    product_id = request.POST.get('prod_id')
    product = get_object_or_404(Product, id=product_id)
    cart_item, created = Cart.objects.get_or_create(product=product, user=user)
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    return redirect('store:cart')


@login_required
def cart(request):
    user = request.user
    cart_products = Cart.objects.filter(user=user).select_related('product')

    agg = cart_products.aggregate(total=Sum(F('quantity') * F('product__price'), output_field=DecimalField()))
    amount = agg['total'] or 0
    shipping_amount = getattr(settings, 'DEFAULT_SHIPPING_FEE', 10)

    addresses = Address.objects.filter(user=user)

    context = {
        'cart_products': cart_products,
        'amount': amount,
        'shipping_amount': shipping_amount,
        'total_amount': amount + shipping_amount,
        'addresses': addresses,
    }
    return render(request, 'store/cart.html', context)


@require_POST
@login_required
def remove_cart(request, cart_id):
    c = get_object_or_404(Cart, id=cart_id, user=request.user)
    c.delete()
    messages.success(request, "Product removed from Cart.")
    return redirect('store:cart')


@require_POST
@login_required
def plus_cart(request, cart_id):
    cp = get_object_or_404(Cart, id=cart_id, user=request.user)
    cp.quantity += 1
    cp.save()
    return redirect('store:cart')


@require_POST
@login_required
def minus_cart(request, cart_id):
    cp = get_object_or_404(Cart, id=cart_id, user=request.user)
    if cp.quantity == 1:
        cp.delete()
    else:
        cp.quantity -= 1
        cp.save()
    return redirect('store:cart')


@login_required
def checkout(request):
    user = request.user
    cart_items = Cart.objects.filter(user=user).select_related('product')

    if request.method == 'GET':
        if not cart_items.exists():
            messages.error(request, "Your cart is empty.")
            return redirect('store:cart')
        amount = sum(item.product.price * item.quantity for item in cart_items)
        shipping_amount = getattr(settings, 'DEFAULT_SHIPPING_FEE', 10)
        total_amount = amount + shipping_amount
        addresses = Address.objects.filter(user=user)
        context = {
            'cart_items': cart_items,
            'amount': amount,
            'shipping_amount': shipping_amount,
            'total_amount': total_amount,
            'addresses': addresses,
        }
        return render(request, 'store/checkout.html', context)

    # POST — process the order
    address_id = request.POST.get('address')
    address = get_object_or_404(Address, id=address_id, user=request.user)
    if not cart_items.exists():
        messages.error(request, "Your cart is empty.")
        return redirect('store:cart')

    with transaction.atomic():
        order = Order.objects.create(user=user, address=address)
        OrderItem.objects.bulk_create([
            OrderItem(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price,
            )
            for item in cart_items
        ])
        cart_items.delete()
        order.calculate_total()
    messages.success(request, "Order placed successfully!")
    return redirect('store:orders')


@login_required
def orders(request):
    all_orders = Order.objects.filter(user=request.user).prefetch_related('items__product').order_by('-ordered_date')
    shipping_amount = getattr(settings, 'DEFAULT_SHIPPING_FEE', 10)
    return render(request, 'store/orders.html', {'orders': all_orders, 'shipping_amount': shipping_amount})


@login_required
def order_detail(request, order_id):
    """Show details of a specific order."""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    shipping_amount = getattr(settings, 'DEFAULT_SHIPPING_FEE', 10)
    return render(request, 'store/order_detail.html', {
        'order': order,
        'shipping_amount': shipping_amount,
        'total_amount': order.total_amount + shipping_amount,
    })


def page_not_found(request, exception):
    return render(request, '404.html', status=404)


def server_error(request):
    return render(request, '500.html', status=500)


def shop(request):
    product_list = Product.objects.filter(is_active=True).select_related('category').order_by('-created_at')
    paginator = Paginator(product_list, 12)
    page_number = request.GET.get('page')
    products = paginator.get_page(page_number)
    context = {
        'products': products,
    }
    return render(request, 'store/shop.html', context)