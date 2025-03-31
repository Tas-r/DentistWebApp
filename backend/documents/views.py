from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Documents
from .serializers import DocumentSerializer

class IsPatient(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'patient'

class DocumentListCreateView(generics.ListCreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsPatient]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Documents.objects.filter(user=self.request.user.patient_profile)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user.patient_profile)

class DocumentRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsPatient]

    def get_queryset(self):
        return Documents.objects.filter(user=self.request.user.patient_profile)