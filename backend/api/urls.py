from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, OrderViewSet, register_user, user_profile, dashboard_data, product


router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
    path('profile/', user_profile, name='user_profile'),
    path('Admindashboard/', dashboard_data, name='dashboard_data'),
    path('product/', product, name='product'),
]
