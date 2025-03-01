from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Appointment
from users.models import DentistProfile
from .serializers import AppointmentSerializer, DentistSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class DentistViewSet(viewsets.ModelViewSet):
    queryset = DentistProfile.objects.all()
    serializer_class = DentistSerializer

    @action(detail=True, methods=["get"])
    def availability(self, request, pk=None):
        dentist = self.get_object()
        return Response({"available_times": ["09:00 AM", "10:00 AM", "11:00 AM"]})  # placeholder times
