# api/views.py
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from .models import Product, Order 
from .serializers import RegisterSerializer, UserSerializer, ProductSerializer, OrderSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email' 
    
    def validate(self, attrs):
        
        data = super().validate(attrs)
        
        
        user = self.user
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role
        }
        
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
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
    products_count = Product.objects.count()
    
    
    sample_product = Product.objects.first()
    
    data = {
        'name': sample_product.name if sample_product else 'No products',
        'category': sample_product.category if sample_product else 'No products',
        'price': sample_product.price if sample_product else 0,
        'stock': sample_product.quantity if sample_product else 0
    }
    return Response(data)


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