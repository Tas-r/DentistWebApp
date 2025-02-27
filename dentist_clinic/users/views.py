from rest_framework import viewsets
from .models import CustomUser, PatientProfile, DentistProfile
from .serializers import UserSerializer, PatientProfileSerializer, DentistProfileSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated]

class DentistProfileViewSet(viewsets.ModelViewSet):
    queryset = DentistProfile.objects.all()
    serializer_class = DentistProfileSerializer
    permission_classes = [IsAuthenticated]
