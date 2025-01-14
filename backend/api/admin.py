from django.contrib import admin
from .models import Product, Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'quantity', 'category')
    search_fields = ['name']

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'created_at')
    inlines = [OrderItemInline]
    list_filter = ('created_at',)
    search_fields = ['user__username']

admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)

