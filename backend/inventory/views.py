import logging
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from .models import Category, Product, ProductImage, Supplier, StockMovement
from .serializers import (
    CategorySerializer, ProductSerializer, ProductImageSerializer,
    SupplierSerializer, StockMovementSerializer
)
from users.permissions import IsAdminUser, IsWorkerOrAdmin
from .tasks import check_low_stock_levels

logger = logging.getLogger('inventory')

class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing Category instances."""
    
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsWorkerOrAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    
    def get_permissions(self):
        """
        Override to ensure only admins can create, update or delete categories.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        category = serializer.save()
        logger.info(f"Category created: {category.id} - {category.name}")
    
    def perform_update(self, serializer):
        category = serializer.save()
        logger.info(f"Category updated: {category.id} - {category.name}")
    
    def perform_destroy(self, instance):
        logger.info(f"Category deleted: {instance.id} - {instance.name}")
        instance.delete()

class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing Product instances."""
    
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsWorkerOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'description', 'sku', 'barcode']
    ordering_fields = ['name', 'price', 'stock_quantity', 'created_at']
    
    def get_permissions(self):
        """
        Override to ensure only admins can create, update or delete products.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        product = serializer.save()
        logger.info(f"Product created: {product.id} - {product.name}")
    
    def perform_update(self, serializer):
        product = serializer.save()
        logger.info(f"Product updated: {product.id} - {product.name}")
    
    def perform_destroy(self, instance):
        logger.info(f"Product deleted: {instance.id} - {instance.name}")
        instance.delete()
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated, IsAdminUser])
    def check_low_stock(self, request):
        """Trigger background task to check low stock levels."""
        task = check_low_stock_levels.delay()
        return Response({"task_id": task.id, "status": "Low stock check initiated"})
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get products with low stock."""
        products = Product.objects.filter(stock_quantity__lte=models.F('low_stock_threshold'))
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

class ProductImageViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing ProductImage instances."""
    
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticated, IsWorkerOrAdmin]
    
    def get_permissions(self):
        """
        Override to ensure only admins can create, update or delete product images.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        # If this is set as primary, unset any existing primary images for this product
        if serializer.validated_data.get('is_primary', False):
            product = serializer.validated_data['product']
            ProductImage.objects.filter(product=product, is_primary=True).update(is_primary=False)
        
        image = serializer.save()
        logger.info(f"Product image created: {image.id} for product {image.product.name}")

class SupplierViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing Supplier instances."""
    
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticated, IsWorkerOrAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'contact_name', 'email', 'phone']
    ordering_fields = ['name', 'created_at']
    
    def get_permissions(self):
        """
        Override to ensure only admins can create, update or delete suppliers.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUser()]
        return super().get_permissions()

class StockMovementViewSet(viewsets.ModelViewSet):
    """ViewSet for viewing and editing StockMovement instances."""
    
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated, IsWorkerOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['product', 'movement_type']
    ordering_fields = ['created_at']
    
    def get_permissions(self):
        """
        Override to ensure only admins can delete stock movements.
        Workers can create stock movements (for recording stock in/out)
        but cannot modify or delete them.
        """
        if self.action == 'destroy':
            return [IsAuthenticated(), IsAdminUser()]
        if self.action in ['update', 'partial_update']:
            return [IsAuthenticated(), IsAdminUser()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        movement = serializer.save()
        logger.info(f"Stock movement created: {movement.id} - {movement.product.name} ({movement.quantity})")

