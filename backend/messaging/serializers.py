from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Messaging
from users.serializers import UserSerializer
from users.models import User


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)
    recipient_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='recipient',
        write_only=True
    )

    class Meta:
        model = Messaging
        fields = ['id', 'sender', 'recipient', 'recipient_id', 'subject', 'body', 
                  'created_at', 'is_read', 'parent_message']
        read_only_fields = ['sender', 'created_at', 'is_read']

    def create(self, validated_data):
        # Set the sender as the current user
        validated_data['sender'] = self.context['request'].user
        return Messaging.objects.create(**validated_data)