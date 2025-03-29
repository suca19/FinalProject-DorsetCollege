from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    ProductViewSet, 
    OrderViewSet, 
    register_user, 
    user_profile, 
    dashboard_data, 
    product,
    CustomTokenObtainPairView  # Asegúrate de importar esta vista
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    # Rutas de autenticación - Actualiza estas para que coincidan con el frontend
    path('auth/register/', register_user, name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Otras rutas - Actualiza estas para que coincidan con el frontend
    path('users/profile/', user_profile, name='user_profile'),
    path('dashboard/data/', dashboard_data, name='dashboard_data'),
    path('product/', product, name='product'),
]