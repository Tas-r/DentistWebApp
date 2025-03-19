from rest_framework import viewsets
from .models import CustomUser, PatientProfile, DentistProfile
from .serializers import UserSerializer, PatientProfileSerializer, DentistProfileSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

# VI CHANGE
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
# END VI CHANGE

class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated]

class DentistProfileViewSet(viewsets.ModelViewSet):
    queryset = DentistProfile.objects.all()
    serializer_class = DentistProfileSerializer
    permission_classes = [IsAuthenticated]
