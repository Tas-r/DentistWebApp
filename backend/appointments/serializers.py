from rest_framework import serializers
from .models import Appointment
from users.models import Patient, Dentist  # Updated to match your models
from django.contrib.auth import get_user_model

User = get_user_model()  # Should resolve to your User model

# User Serializer (Base for Patient and Dentist)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'user_type', 'first_name', 'last_name']
        read_only_fields = ['is_staff', 'is_superuser']

# Patient Serializer
class PatientSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Patient
        fields = ['id', 'username', 'emergency_contact_name', 'emergency_contact_phone', 
                  'medical_history', 'insurance_provider', 'insurance_policy_number']

# Dentist Serializer
class DentistSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Dentist
        fields = ['id', 'username', 'specialization', 'license_number', 'years_of_experience']

# Appointment Serializer
class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    dentist = DentistSerializer(read_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(),
        source='patient',
        write_only=True
    )
    dentist_id = serializers.PrimaryKeyRelatedField(
        queryset=Dentist.objects.all(),
        source='dentist',
        write_only=True
    )
    appointment_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'dentist', 'patient_id', 'dentist_id',
                  'appointment_date', 'service', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        return Appointment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.patient = validated_data.get('patient', instance.patient)
        instance.dentist = validated_data.get('dentist', instance.dentist)
        instance.appointment_date = validated_data.get('appointment_date', instance.appointment_date)
        instance.service = validated_data.get('service', instance.service)
        instance.save()
        return instance