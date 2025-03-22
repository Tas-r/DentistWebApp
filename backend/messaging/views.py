from django.shortcuts import render

# messaging/views.py
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Messaging  # This line is causing the error
from .serializers import MessageSerializer
from django.db.models import Q

# Rest of your views code...

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
            return Message.objects.all()
        else:
            # Regular users see their sent or received messages
            return Message.objects.filter(
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
            return Message.objects.all()
        else:
            return Message.objects.filter(
                Q(sender=user) | Q(recipient=user)
            )

    def perform_update(self, serializer):
        # Mark message as read when viewed
        serializer.save(is_read=True)

class ReplyMessageView(generics.CreateAPIView):
    """
    Reply to an existing message.
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        parent_message = Message.objects.get(id=self.kwargs['pk'])
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
            messages = Message.objects.filter(is_read=False)
        else:
            messages = Message.objects.filter(recipient=user, is_read=False)
        
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)