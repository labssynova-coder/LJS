from django.contrib import admin
from .models import Address, Category, Product, Cart, Order, OrderItem


class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'locality', 'city', 'state')
    list_filter = ('city', 'state')
    list_per_page = 10
    search_fields = ('locality', 'city', 'state', 'user__username')


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_active', 'is_featured', 'updated_at')
    list_editable = ('slug', 'is_active', 'is_featured')
    list_filter = ('is_active', 'is_featured')
    list_per_page = 10
    search_fields = ('title', 'description')
    prepopulated_fields = {"slug": ("title",)}


class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'category', 'price', 'is_active', 'is_featured', 'updated_at')
    list_editable = ('slug', 'category', 'is_active', 'is_featured')
    list_filter = ('category', 'is_active', 'is_featured')
    list_per_page = 10
    search_fields = ('title', 'category__title', 'short_description')
    prepopulated_fields = {"slug": ("title",)}
    list_select_related = ('category',)


class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'quantity', 'created_at')
    list_editable = ('quantity',)
    list_filter = ('created_at',)
    list_per_page = 20
    search_fields = ('user__username', 'product__title')
    list_select_related = ('user', 'product')


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price', 'subtotal')


class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'ordered_date', 'status', 'total_amount')
    list_editable = ('status',)
    list_filter = ('status', 'ordered_date')
    list_per_page = 20
    search_fields = ('user__username', 'id')
    inlines = [OrderItemInline]
    list_select_related = ('user',)


admin.site.register(Address, AddressAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Cart, CartAdmin)
admin.site.register(Order, OrderAdmin)