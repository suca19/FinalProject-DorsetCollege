from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

class Product(models.Model):
    name = models.CharField(
        max_length=200,
        verbose_name="Product Name",
        help_text="Enter the name of the product"
    )
    category = models.CharField(
        max_length=100,
        verbose_name="Category",
        help_text="Enter the product category"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name="Price",
        help_text="Enter the price of the product"
    )
    quantity = models.IntegerField(
        validators=[MinValueValidator(0)],
        verbose_name="Quantity",
        help_text="Enter the available quantity"
    )

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ['name']

    def __str__(self):
        return self.name

class Order(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name="User",
        help_text="Select the user who placed the order"
    )
    products = models.ManyToManyField(
        Product,
        through='OrderItem',
        verbose_name="Products",
        help_text="Select products for this order"
    )
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name="Total Price",
        help_text="Total price of the order"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At",
        help_text="Date and time when the order was created"
    )

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Orders"
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        verbose_name="Order",
        help_text="Select the order"
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        verbose_name="Product",
        help_text="Select the product"
    )
    quantity = models.IntegerField(
        validators=[MinValueValidator(1)],
        verbose_name="Quantity",
        help_text="Enter the quantity of the product"
    )

    class Meta:
        verbose_name = "Order Item"
        verbose_name_plural = "Order Items"
        unique_together = ['order', 'product']

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Order {self.order.id}"

    def get_total_price(self):
        return self.quantity * self.product.price