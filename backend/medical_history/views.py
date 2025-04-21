# users/views.py
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import MedicalHistory, Patient
from .serializers import MedicalHistorySerializer
from rest_framework import serializers

# Custom permission for dentists or staff
class IsDentistOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.user_type == 'dentist' or request.user.user_type == 'staff'
        )

class MedicalHistoryViewSet(viewsets.ModelViewSet):
    queryset = MedicalHistory.objects.all()
    serializer_class = MedicalHistorySerializer
    
    def get_permissions(self):
        """
        Define permissions based on the action:
        - 'list' and 'retrieve': Any authenticated user (patients, dentists, staff).
        - 'create', 'update', 'partial_update', 'destroy': Only dentists or staff.
        """
        if self.action in ['list', 'retrieve', 'my_history']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated, IsDentistOrStaff]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """
        Filter queryset based on user type:
        - Patients see only their own medical history.
        - Dentists and staff see all records.
        """
        user = self.request.user
        if user.user_type == 'patient':
            return MedicalHistory.objects.filter(patient=user.patient_profile)
        return MedicalHistory.objects.all()
    
    def perform_create(self, serializer):
        """
        Ensure a valid patient ID is provided when creating a record.
        """
        patient_id = self.request.data.get('patient')
        if not patient_id:
            raise serializers.ValidationError("Patient ID is required.")
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            raise serializers.ValidationError("Invalid patient ID.")
        serializer.save(patient=patient)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_history(self, request):
        """
        Custom action for patients to view their own medical history.
        """
        if request.user.user_type != 'patient':
            return Response({"detail": "Only patients can access their own history."}, status=400)
        history = MedicalHistory.objects.filter(patient=request.user.patient_profile)
        serializer = self.get_serializer(history, many=True)
        return Response(serializer.data)