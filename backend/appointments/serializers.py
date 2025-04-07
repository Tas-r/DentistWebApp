from rest_framework import serializers
from .models import Appointment, Services
from users.models import Patient, Dentist
from django.contrib.auth import get_user_model
from notifications.models import Notification

User = get_user_model()

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

# Service Serializer
class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = ['id', 'name']

# Appointment Serializer
class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    dentist = DentistSerializer(read_only=True)
    services = ServicesSerializer(many=True, read_only=True)
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
    service_ids = serializers.PrimaryKeyRelatedField(
        queryset=Services.objects.all(),
        source='services',
        many=True,
        write_only=True
    )
    appointment_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'dentist', 'patient_id', 'dentist_id',
                  'appointment_date', 'services', 'service_ids', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        services = validated_data.pop('services', [])
        appointment = Appointment.objects.create(**validated_data)
        appointment.services.set(services)  # Set the many-to-many relationship
        return appointment

    def update(self, instance, validated_data):
        services = validated_data.pop('services', None)
        instance.patient = validated_data.get('patient', instance.patient)
        instance.dentist = validated_data.get('dentist', instance.dentist)
        instance.appointment_date = validated_data.get('appointment_date', instance.appointment_date)
        if services is not None:
            instance.services.set(services)
        instance.save()
        return instance
    
    # Add the new simplified serializer for the dentist list
class SimpleDentistSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = Dentist
        fields = ['id', 'first_name', 'last_name']


class AppointmentRescheduleSerializer(serializers.ModelSerializer):
    appointment_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M")

    class Meta:
        model = Appointment
        fields = ['id', 'appointment_date']
        read_only_fields = ['id']

    def update(self, instance, validated_data):
        # Only update the appointment_date
        instance.appointment_date = validated_data.get('appointment_date', instance.appointment_date)
        instance.save()
        
        # Update or create notification using your Notification model
        Notification.objects.filter(related_appointment=instance).delete()  # Remove old notification
        Notification.objects.create(
            user=instance.patient.user,
            notification_type='appointment_reminder',
            message=f"Your appointment with Dr. {instance.dentist.user.username} has been rescheduled to {instance.appointment_date.strftime('%Y-%m-%d %H:%M')}",
            related_appointment=instance,
            is_read=False
        )
        
        return instance