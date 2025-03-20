from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import User, Patient, Dentist, Staff  # Updated imports
from .serializers import UserSerializer, PatientSerializer, DentistSerializer, StaffSerializer, LoginSerializer  # Updated serializers
from django.contrib.auth import get_user_model

UserModel = get_user_model()  # Should resolve to User

# Signup View
class SignupView(generics.CreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer  # Using UserSerializer directly
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Only allow staff with is_staff=True to create new users (assuming 'staff' replaces 'admin')
        if not request.user.is_staff:  # Changed from role == 'admin' to is_staff
            return Response({"error": "Only staff can create new users."}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

# Login View
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Optional: Filter based on user_type for non-staff users
        user = self.request.user
        if user.is_staff:
            return UserModel.objects.all()
        return UserModel.objects.filter(id=user.id)  # Regular users only see themselves

# Patient ViewSet
class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Patient.objects.all()
        elif user.user_type == 'patient':
            return Patient.objects.filter(user=user)
        return Patient.objects.none()

# Dentist ViewSet
class DentistViewSet(viewsets.ModelViewSet):
    queryset = Dentist.objects.all()
    serializer_class = DentistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Dentist.objects.all()
        elif user.user_type == 'dentist':
            return Dentist.objects.filter(user=user)
        return Dentist.objects.none()

# Staff ViewSet (Added for completeness)
class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Staff.objects.all()
        elif user.user_type == 'staff':
            return Staff.objects.filter(user=user)
        return Staff.objects.none()