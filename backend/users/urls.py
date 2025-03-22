# users/urls.py (partial)
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PatientViewSet, DentistViewSet, StaffViewSet, SignupView, LoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'dentists', DentistViewSet)
router.register(r'staff', StaffViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT Login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh Token
]