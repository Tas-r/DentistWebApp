from django.urls import path
from .views import DocumentListCreateView, DocumentRetrieveDestroyView

urlpatterns = [
    path('', DocumentListCreateView.as_view(), name='document-list-create'),
    path('<int:pk>/', DocumentRetrieveDestroyView.as_view(), name='document-retrieve-destroy'),
] 
