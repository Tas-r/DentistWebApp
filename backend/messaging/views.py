from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Messaging
from .serializers import MessageSerializer
from django.db.models import Q
import logging

# Set up logging
logger = logging.getLogger(__name__)

class MessageListCreateView(generics.ListCreateAPIView):
    """
    List all messages for the user or create a new message.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'staff':
            # Staff can see all messages
            return Messaging.objects.all()
        else:
            # Regular users see their sent or received messages
            return Messaging.objects.filter(
                Q(sender=user) | Q(recipient=user)
            )

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class MessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update (mark as read), or delete a message.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'staff':
            return Messaging.objects.all()
        else:
            return Messaging.objects.filter(
                Q(sender=user) | Q(recipient=user)
            )

    def get(self, request, *args, **kwargs):
        # Mark the message as read when retrieved
        instance = self.get_object()
        logger.debug(f"Before marking as read: is_read={instance.is_read}, message_id={instance.id}")
        instance.is_read = True
        instance.save()
        logger.debug(f"After marking as read: is_read={instance.is_read}, message_id={instance.id}")
        return super().get(request, *args, **kwargs)

    def perform_update(self, serializer):
        # Mark message as read when updated (e.g., via PATCH)
        serializer.save(is_read=True)

class ReplyMessageView(generics.CreateAPIView):
    """
    Reply to an existing message.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        parent_message = Messaging.objects.get(id=self.kwargs['pk'])
        serializer.save(
            sender=self.request.user,
            recipient=parent_message.sender,  # Reply goes to original sender
            parent_message=parent_message
        )

class InboxView(APIView):
    """
    Show unread messages for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.user_type == 'staff':
            messages = Messaging.objects.filter(is_read=False)
        else:
            messages = Messaging.objects.filter(recipient=user, is_read=False)
        
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)