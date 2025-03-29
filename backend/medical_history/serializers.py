# users/serializers.py
from users.models import Patient, Dentist
from rest_framework import serializers
from medical_history.models import MedicalHistory
from users.serializers import PatientSerializer, DentistSerializer


class MedicalHistorySerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    dentist = DentistSerializer(read_only=True)
    
    class Meta:
        model = MedicalHistory
        fields = ['id', 'patient', 'dentist', 'diagnosis', 'date_of_diagnosis', 
                  'treatment_plan', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        # Ensure only authorized users (dentists or staff) can create records
        request = self.context.get('request')
        if not request or (not hasattr(request.user, 'dentist_profile') and not hasattr(request.user, 'staff_profile')):
            raise serializers.ValidationError("Only dentists or staff can create medical history records.")
        
        # If the user is a dentist, set them as the diagnosing dentist
        if hasattr(request.user, 'dentist_profile'):
            validated_data['dentist'] = request.user.dentist_profile
        # If the user is staff, dentist field can remain optional (null=True in model)
        
        return MedicalHistory.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        # Ensure only the diagnosing dentist or any staff can update
        request = self.context.get('request')
        if request:
            # Allow update if user is staff or the diagnosing dentist
            is_staff = hasattr(request.user, 'staff_profile')
            is_diagnosing_dentist = hasattr(request.user, 'dentist_profile') and instance.dentist == request.user.dentist_profile
            if not (is_staff or is_diagnosing_dentist):
                raise serializers.ValidationError("Only the diagnosing dentist or staff can update this record.")
        
        # Update fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance