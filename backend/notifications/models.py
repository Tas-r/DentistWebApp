from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth import get_user_model
from appointments.models import Appointment

User = get_user_model()

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('message', 'New Message'),
        ('alert', 'Alert'),
        ('appointment_reminder', 'Appointment Reminder'),
        ('general', 'General Notification'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    related_appointment = models.ForeignKey(
        Appointment,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_notification_type_display()} for {self.user.username}: {self.message}"

    class Meta:
        ordering = ['-created_at']