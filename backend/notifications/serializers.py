from rest_framework import serializers
from .models import Notification
from appointments.serializers import AppointmentSerializer

class NotificationSerializer(serializers.ModelSerializer):
    related_appointment = AppointmentSerializer(read_only=True)
    notification_type = serializers.CharField(source='get_notification_type_display')

    class Meta:
        model = Notification
        fields = ['id', 'user', 'notification_type', 'message', 'related_appointment', 'is_read', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']