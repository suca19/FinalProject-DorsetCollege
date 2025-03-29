from rest_framework import serializers
from .models import Category, Product, ProductImage, Supplier, StockMovement

class CategorySerializer(serializers.ModelSerializer):
    """Serializer for the Category model."""
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'slug', 'parent', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']

class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for the ProductImage model."""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'image', 'is_primary', 'created_at']
        read_only_fields = ['id', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    """Serializer for the Product model."""
    
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')
    profit_margin = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'category', 'category_name', 'price', 'cost_price',
                  'sku', 'barcode', 'stock_quantity', 'low_stock_threshold', 'weight', 'dimensions',
                  'is_active', 'created_by', 'created_at', 'updated_at', 'images', 'profit_margin',
                  'is_low_stock']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class SupplierSerializer(serializers.ModelSerializer):
    """Serializer for the Supplier model."""
    
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'contact_name', 'email', 'phone', 'address', 'website',
                  'notes', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class StockMovementSerializer(serializers.ModelSerializer):
    """Serializer for the StockMovement model."""
    
    product_name = serializers.ReadOnlyField(source='product.name')
    performed_by_name = serializers.ReadOnlyField(source='performed_by.get_full_name')
    
    class Meta:
        model = StockMovement
        fields = ['id', 'product', 'product_name', 'quantity', 'movement_type',
                  'reference', 'notes', 'performed_by', 'performed_by_name', 'created_at']
        read_only_fields = ['id', 'performed_by', 'created_at']
    
    def create(self, validated_data):
        validated_data['performed_by'] = self.context['request'].user
        return super().create(validated_data)

