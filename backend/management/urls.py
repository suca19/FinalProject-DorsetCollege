from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import ProductViewSet, OrderViewSet, register_user, user_profile, dashboard_data, product
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Stock Management API")

# Configurar el router para las vistas basadas en viewsets
router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', home, name='home'),
    # Solo una definición de admin
    path('admin/', admin.site.urls), 
    
    # Rutas de API
    path('api/', include(router.urls)),
    path('api/auth/register/', register_user, name='register'),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/profile/', user_profile, name='user_profile'),
    path('api/dashboard/', dashboard_data, name='dashboard_data'),
    path('api/product/', product, name='product'),
    
    # Si necesitas incluir otras URLs de la app api, usa esto:
    # path('api/', include('api.urls')),
]