from django.contrib import admin
from .models import Appointment, Services

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['patient', 'dentist', 'appointment_date', 'get_services']  # Use a custom method

    def get_services(self, obj):
        # Join the names of all related services into a single string
        return ", ".join(service.name for service in obj.services.all())
    
    get_services.short_description = "Services"  # Display name in admin

@admin.register(Services)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name']