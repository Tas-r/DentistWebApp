from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, PatientProfile, DentistProfile

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('user_id', 'username', 'email', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('user_id', 'username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Roles & Permissions', {'fields': ('role', 'is_active', 'is_staff', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

# VI CHANGE: ADDED user_firstName and user_lastName
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('user_firstName', 'user_lastName','user_id', 'username', 'email', 'role', 'password1', 'password2', 'is_active', 'is_staff')}
        ),
    )
    search_fields = ('username', 'email', 'role')
    ordering = ('user_id',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(PatientProfile)
admin.site.register(DentistProfile)

