from django.contrib import admin
from .models import Documents

@admin.register(Documents)
class DocumentsAdmin(admin.ModelAdmin):
    list_display = ('user', 'description', 'upload_date', 'document_file_link')
    list_filter = ('upload_date',)
    search_fields = ('user__user__username', 'description')
   
    def document_file_link(self, obj):
        if obj.document_file:
            return f'<a href="{obj.document_file.url}" target="_blank">View Document</a>'
        return "No file uploaded"
    document_file_link.allow_tags = True
    document_file_link.short_description = "Document File"

    def has_add_permission(self, request):
        return request.user.is_superuser
   
    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser
   
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser