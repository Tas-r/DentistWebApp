from django.contrib.auth.models import AbstractUser
from django.db import models

from django.contrib.auth.models import AbstractUser, Permission
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('dentist', 'Dentist'),
        ('patient', 'Patient'),
    )
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    user_id = models.CharField(max_length=20, unique=True)

# VI CHANGE
    user_firstName = models.CharField(max_length=50, null=True, blank=True)
    user_lastName = models.CharField(max_length=50, null=True, blank=True) 

    USERNAME_FIELD = 'username' 
    REQUIRED_FIELDS = ['user_id'] 
# END VI CHANGE

    # Fix related_name conflicts
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_users",  # Change the related name to avoid conflicts
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_users_permissions",  # Change the related name to avoid conflicts
        blank=True,
    )

    def __str__(self):
        return f"{self.username} ({self.role})"


class PatientProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="patient_profile")
    date_of_birth = models.DateField(null=True, blank=True)
    contact_number = models.CharField(max_length=15, null=True, blank=True)

    def __str__(self):
        return self.user.username

class DentistProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="dentist_profile")
    specialization = models.CharField(max_length=100, null=True, blank=True)
    contact_number = models.CharField(max_length=15, null=True, blank=True)

    def __str__(self):
        return self.user.username
