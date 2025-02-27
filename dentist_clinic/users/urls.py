from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PatientProfileViewSet, DentistProfileViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Setup DRF router for automatic URL routing
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'patients', PatientProfileViewSet)
router.register(r'dentists', DentistProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Include the API routes
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
