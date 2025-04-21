
from django.contrib import admin
from medical_history.models import MedicalHistory
from users.models import Patient, Dentist

@admin.register(MedicalHistory)
class MedicalHistoryAdmin(admin.ModelAdmin):
    list_display = ('patient', 'diagnosis', 'date_of_diagnosis', 'dentist', 'created_at')
    list_filter = ('date_of_diagnosis', 'dentist')
    search_fields = ('patient__user__first_name', 'patient__user__last_name', 'diagnosis', 'treatment_plan')
    date_hierarchy = 'date_of_diagnosis'
    ordering = ('-date_of_diagnosis',)
    raw_id_fields = ('patient', 'dentist')  # Improves performance for ForeignKey fields with many records
    readonly_fields = ('created_at', 'updated_at')

    # Customize form fields for better usability
    fieldsets = (
        (None, {
            'fields': ('patient', 'dentist', 'diagnosis', 'date_of_diagnosis', 'treatment_plan')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)  # Collapsible section for timestamps
        }),
    )

    def get_queryset(self, request):
        """
        Restrict queryset for non-superusers (staff) to records they are allowed to see.
        Staff can see all records, but this can be modified if needed.
        """
        qs = super().get_queryset(request)
        return qs

    def has_view_or_change_permission(self, request, obj=None):
        """
        Allow superusers and staff to view/change medical history records.
        """
        if request.user.is_superuser:
            return True
        if hasattr(request.user, 'staff_profile'):
            return True
        return False

    def has_add_permission(self, request):
        """
        Allow superusers and staff to add medical history records.
        """
        if request.user.is_superuser:
            return True
        if hasattr(request.user, 'staff_profile'):
            return True
        return False

    def has_delete_permission(self, request, obj=None):
        """
        Allow superusers and staff to delete medical history records.
        """
        if request.user.is_superuser:
            return True
        if hasattr(request.user, 'staff_profile'):
            return True
        return False

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """
        Optimize ForeignKey fields by limiting choices for staff users if needed.
        For example, limit dentists to active dentists only.
        """
        if db_field.name == 'dentist':
            kwargs['queryset'] = Dentist.objects.filter(user__is_active=True)
        if db_field.name == 'patient':
            kwargs['queryset'] = Patient.objects.filter(user__is_active=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
