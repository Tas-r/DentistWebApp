# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicalHistoryViewSet

# Create a router and register the MedicalHistoryViewSet
router = DefaultRouter()
router.register(r'medical-history', MedicalHistoryViewSet, basename='medical-history')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Includes all default ViewSet routes
    # Custom action route is automatically included via the router (e.g., /medical-history/my_history/)
]