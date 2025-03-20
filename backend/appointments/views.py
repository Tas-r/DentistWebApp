from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import Appointment
from .serializers import AppointmentSerializer
from users.models import Patient, Dentist

class AppointmentListCreateView(generics.ListCreateAPIView):
    """
    List all appointments or create a new appointment based on user type.
    """
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filter appointments based on user type:
        - Patients see their own appointments.
        - Dentists see their own appointments.
        - Staff see all appointments.
        """
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient__user=user)
        elif user.user_type == 'dentist':
            return Appointment.objects.filter(dentist__user=user)
        elif user.user_type == 'staff':
            return Appointment.objects.all()
        return Appointment.objects.none()

    def perform_create(self, serializer):
        """
        Automatically set patient or dentist based on user type:
        - Patients set themselves as the patient.
        - Dentists set themselves as the dentist.
        - Staff can specify both via patient_id and dentist_id.
        """
        user = self.request.user
        if user.user_type == 'patient':
            serializer.save(patient=user.patient_profile)
        elif user.user_type == 'dentist':
            serializer.save(dentist=user.dentist_profile)
        else:  # Staff can create with full control
            serializer.save()

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific appointment.
    """
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Restrict access based on user type:
        - Patients can only access their own appointments.
        - Dentists can only access their own appointments.
        - Staff can access all appointments.
        """
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient__user=user)
        elif user.user_type == 'dentist':
            return Appointment.objects.filter(dentist__user=user)
        elif user.user_type == 'staff':
            return Appointment.objects.all()
        return Appointment.objects.none()

class UpcomingAppointmentsView(APIView):
    """
    List upcoming appointments for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Return appointments from now onward based on user type.
        """
        user = request.user
        now = timezone.now()

        if user.user_type == 'patient':
            appointments = Appointment.objects.filter(
                patient__user=user,
                appointment_date__gte=now
            )
        elif user.user_type == 'dentist':
            appointments = Appointment.objects.filter(
                dentist__user=user,
                appointment_date__gte=now
            )
        elif user.user_type == 'staff':
            appointments = Appointment.objects.filter(
                appointment_date__gte=now
            )
        else:
            appointments = Appointment.objects.none()

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

class MyAppointmentsView(generics.ListAPIView):
    """
    List the authenticated user's appointments (read-only).
    """
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filter appointments based on user type:
        - Patients see their own appointments.
        - Dentists see their own appointments.
        - Staff see all appointments.
        """
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient__user=user)
        elif user.user_type == 'dentist':
            return Appointment.objects.filter(dentist__user=user)
        elif user.user_type == 'staff':
            return Appointment.objects.all()
        return Appointment.objects.none()