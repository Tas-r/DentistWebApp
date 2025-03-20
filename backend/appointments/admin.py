from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'dentist', 'appointment_date', 'service', 'created_at')
    list_filter = ('appointment_date', 'dentist', 'patient')
    search_fields = ('patient__user__username', 'dentist__user__username', 'service')
    ordering = ('appointment_date',)
