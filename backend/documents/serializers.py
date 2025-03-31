from rest_framework import serializers
from .models import Documents

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documents
        fields = ['id', 'description', 'document_file', 'upload_date']
        read_only_fields = ['upload_date']

    def validate_document_file(self, value):
        max_size = 5 * 1024 * 1024  # 5MB limit
        if value.size > max_size:
            raise serializers.ValidationError("File size must not exceed 5MB.")
        return value

    def create(self, validated_data):
        patient = self.context['request'].user.patient_profile
        return Documents.objects.create(user=patient, **validated_data)