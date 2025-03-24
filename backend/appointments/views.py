from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import Appointment, Service
from .serializers import AppointmentSerializer, ServiceSerializer
from users.models import Patient, Dentist

# Service List View (to display available services in the frontend)
class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

# Appointment List/Create View
class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient__user=user)
        elif user.user_type == 'dentist':
            return Appointment.objects.filter(dentist__user=user)
        elif user.user_type == 'staff':
            return Appointment.objects.all()
        return Appointment.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.user_type == 'patient':
            serializer.save(patient=user.patient_profile)
        elif user.user_type == 'dentist':
            serializer.save(dentist=user.dentist_profile)
        else:  # Staff can create with full control
            serializer.save()

# Appointment Detail View
class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient__user=user)
        elif user.user_type == 'dentist':
            return Appointment.objects.filter(dentist__user=user)
        elif user.user_type == 'staff':
            return Appointment.objects.all()
        return Appointment.objects.none()

# Upcoming Appointments View
class UpcomingAppointmentsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
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

# My Appointments View
class MyAppointmentsView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient__user=user)
        elif user.user_type == 'dentist':
            return Appointment.objects.filter(dentist__user=user)
        elif user.user_type == 'staff':
            return Appointment.objects.all()
        return Appointment.objects.none()

# Available Time Slots View (for a specific dentist and date)
class AvailableTimeSlotsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        dentist_id = request.query_params.get('dentist_id')
        date = request.query_params.get('date')  # Expected format: YYYY-MM-DD

        if not dentist_id or not date:
            return Response({"error": "dentist_id and date are required"}, status=400)

        try:
            dentist = Dentist.objects.get(id=dentist_id)
        except Dentist.DoesNotExist:
            return Response({"error": "Dentist not found"}, status=404)

        # Parse the date
        from datetime import datetime
        try:
            selected_date = datetime.strptime(date, '%Y-%m-%d')
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"}, status=400)

        # Define available time slots (e.g., 9:00 AM to 5:00 PM, 30-minute intervals)
        from datetime import timedelta
        start_time = selected_date.replace(hour=9, minute=0)
        end_time = selected_date.replace(hour=17, minute=0)
        time_slots = []
        current_time = start_time
        while current_time < end_time:
            time_slots.append(current_time.strftime('%I:%M %p').lower())  # e.g., "9:00 am"
            current_time += timedelta(minutes=30)

        # Get booked time slots for the dentist on the selected date
        booked_slots = Appointment.objects.filter(
            dentist=dentist,
            appointment_date__date=selected_date
        ).values_list('appointment_date__time', flat=True)

        # Convert booked slots to the same format
        booked_times = [slot.strftime('%I:%M %p').lower() for slot in booked_slots]

        # Filter out booked slots
        available_slots = [slot for slot in time_slots if slot not in booked_times]

        return Response({"available_slots": available_slots})