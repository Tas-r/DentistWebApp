from rest_framework import serializers
from .models import Appointment
from users.models import DentistProfile  # ensure this is correct

class AppointmentSerializer(serializers.ModelSerializer):
    patient_username = serializers.CharField(source="patient.user.username", read_only=True)
    dentist_username = serializers.CharField(source="dentist.user.username", read_only=True)

    class Meta:
        model = Appointment
        fields = ["id", "patient", "dentist", "date", "patient_username", "dentist_username"]

class DentistSerializer(serializers.ModelSerializer):
    class Meta:
        model = DentistProfile
        fields = ["id", "user", "specialty"]
