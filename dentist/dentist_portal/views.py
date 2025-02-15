from rest_framework.viewsets import ModelViewSet
from .models import PatientProfile
from .serializers import PatientProfileSerializer

class PatientProfileViewSet(ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer

