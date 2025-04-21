from django.db import models
from django.core.mail import send_mail
from users.models import User  # Import the User model

class Messaging(models.Model):
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_messages',
        null=True,  # Allow setting sender in admin programmatically
        blank=True
    )
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_messages'
    )
    subject = models.CharField(max_length=200)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    parent_message = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='replies'
    )

    def __str__(self):
        return f"{self.sender.username if self.sender else 'Unknown'} to {self.recipient.username}: {self.subject}"

    def save(self, *args, **kwargs):
        # Check if this is a new message (not an update)
        is_new = self._state.adding
        super().save(*args, **kwargs)  # Save the instance first

        # Send email notification if it's a new message or reply
        if is_new and self.recipient and self.recipient.email:
            try:
                # Determine if this is a reply or a new message
                email_subject = (
                    f"New Reply to '{self.parent_message.subject}'" 
                    if self.parent_message else f"New Message: {self.subject}"
                )
                email_body = (
                    f"Dear {self.recipient.first_name or self.recipient.username},\n\n"
                    f"You have received a {'reply to an existing message' if self.parent_message else 'new message'} "
                    f"from {self.sender.username if self.sender else 'Unknown'}.\n\n"
                    f"Subject: {self.subject}\n"
                    f"Message: {self.body}\n\n"
                    f"Please log in to your account to view and respond to this message.\n\n"
                    f"Best regards,\nDental Studio Team"
                )
                send_mail(
                    subject=email_subject,
                    message=email_body,
                    from_email='dentalstudiosandiego@gmail.com',
                    recipient_list=[self.recipient.email],
                    fail_silently=False,
                )
            except Exception as e:
                # Log the error if email sending fails (you can enhance logging as needed)
                print(f"Failed to send email to {self.recipient.email}: {str(e)}")

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['sender', 'recipient']),
            models.Index(fields=['created_at']),
        ]