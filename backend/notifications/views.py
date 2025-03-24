from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer

# List all notifications for the authenticated user
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

# Mark a notification as read
class MarkNotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            notification = Notification.objects.get(id=pk, user=request.user)
            notification.is_read = True
            notification.save()
            return Response({"message": "Notification marked as read"})
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=404)

# Mark all notifications as read
class MarkAllNotificationsReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        notifications = Notification.objects.filter(user=request.user, is_read=False)
        notifications.update(is_read=True)
        return Response({"message": "All notifications marked as read"})