from django.db import models
from django.core.validators import FileExtensionValidator
from users.models import Patient  # Import Patient from users app

class Documents(models.Model):
    user = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='documents')
    description = models.CharField(max_length=100)
    document_file = models.FileField(
        upload_to='documents/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf'])]
    )
    upload_date = models.DateTimeField(auto_now_add=True)
   
    def __str__(self):
        return f"{self.user.user.username} - {self.description}"