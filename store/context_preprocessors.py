from .models import Category, Cart


def store_menu(request):
    categories = Category.objects.filter(is_active=True).only('title', 'slug')
    return {'categories_menu': categories}


def cart_menu(request):
    if request.user.is_authenticated:
        cart_items = Cart.objects.filter(user=request.user).select_related('product')
        return {'cart_items': cart_items}
    return {}