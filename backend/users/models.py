# users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
        
    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, username, password, **extra_fields)

class User(AbstractUser):
    USER_TYPES = (
        ('patient', 'Patient'),
        ('dentist', 'Dentist'),
        ('staff', 'Staff'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='patient')
    phone_number = models.CharField(max_length=15, blank=True, null=True)  # Added
    address = models.TextField(blank=True, null=True)  # Added
    date_of_birth = models.DateField(blank=True, null=True)  # Added

    # Override groups and user_permissions with unique related_name
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',  # Unique related_name
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',  # Unique related_name
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    objects = CustomUserManager()

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=15, blank=True)
    medical_history = models.TextField(blank=True)
    insurance_provider = models.CharField(max_length=100, blank=True)
    insurance_policy_number = models.CharField(max_length=50, blank=True)
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class Staff(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')
    position = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    hire_date = models.DateField()
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.position}"
    
class Dentist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='dentist_profile')
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50)
    years_of_experience = models.PositiveIntegerField(default=0)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='dentists/', default='default-dentist.png')
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.specialization}"
    

