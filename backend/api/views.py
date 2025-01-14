from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Product, Order
from .serializers import UserSerializer, ProductSerializer, OrderSerializer, RegisterSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=serializer.context).data,
            "message": "User created successfully",
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    total_products = Product.objects.count()
    low_stock_items = Product.objects.filter(quantity__lt=10).count()
    total_value = sum(product.quantity * product.price for product in Product.objects.all())

    data = {
        'totalProducts': total_products,
        'lowStockItems': low_stock_items,
        'totalValue': total_value,
    }
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def product(request):
    name = Product.objects.count()
    category = Product.objects.count()
    price = product.price
    stock = Product.objects.filter(quantity__lt=10).count()

    data = {
        'name': 'sample',
        'category': 'sample',
        'price': 'sample',
        'stock': 'sample'
    }
    return Response(data)


