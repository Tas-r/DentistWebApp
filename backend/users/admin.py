# users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Patient, Dentist, Staff

class UserAdmin(BaseUserAdmin):
    # Fields to display in the list view
    list_display = ('id','username', 'email', 'user_type', 'phone_number', 'is_staff', 'is_active')
    # Fields to filter by in the sidebar
    list_filter = ('user_type', 'is_staff', 'is_active', 'is_superuser')
    # Fields to search
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone_number')
    # Ordering of the list
    ordering = ('username',)

    # Fields to display in the edit form
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'phone_number', 'address', 'date_of_birth')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('User Type', {'fields': ('user_type',)}),
    )

    # Fields for adding a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'user_type', 'phone_number', 'address', 'date_of_birth', 'is_staff', 'is_active'),
        }),
    )

    # Ensure the custom manager is used
    filter_horizontal = ('groups', 'user_permissions',)

# Register the custom User model with the custom UserAdmin
admin.site.register(User, UserAdmin)

# Register related models with basic admin interfaces
@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('user', 'emergency_contact_name', 'emergency_contact_phone', 'insurance_provider')
    search_fields = ('user__username', 'user__email', 'emergency_contact_name')
    list_filter = ('insurance_provider',)

@admin.register(Dentist)
class DentistAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'license_number', 'years_of_experience')
    search_fields = ('user__username', 'user__email', 'specialization', 'license_number')
    list_filter = ('specialization',)

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('user', 'position', 'department', 'hire_date')
    search_fields = ('user__username', 'user__email', 'position', 'department')
    list_filter = ('department', 'hire_date')