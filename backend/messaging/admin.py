from django.contrib import admin
from django.urls import reverse
from django.http import HttpResponseRedirect
from .models import Messaging
from django.contrib.auth import get_user_model

User = get_user_model()

class MessageReplyInline(admin.StackedInline):
    model = Messaging
    fk_name = 'parent_message'
    extra = 1
    fields = ('recipient', 'subject', 'body', 'is_read')
    readonly_fields = ('recipient', 'subject')  # Make both recipient and subject read-only
    verbose_name = "Reply"
    verbose_name_plural = "Replies"
    exclude = ('sender',)

    def get_formset(self, request, obj=None, **kwargs):
        self.request = request
        self.parent_obj = obj  # Store the parent object (original message)
        formset = super().get_formset(request, obj, **kwargs)
        return formset

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "recipient" and self.parent_obj:
            # Pre-set the recipient to the original message's sender
            kwargs["initial"] = self.parent_obj.sender
            kwargs["queryset"] = User.objects.filter(id=self.parent_obj.sender.id)  # Limit choices to the sender
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if self.parent_obj and "subject" in form.base_fields:
            # Pre-set the subject to "Re: [Original Subject]"
            form.base_fields["subject"].initial = f"Re: {self.parent_obj.subject}"
        return form

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for instance in instances:
            if not instance.sender_id:
                instance.sender = request.user
            if not instance.recipient_id and instance.parent_message:
                # Ensure recipient is always set to the original message's sender
                instance.recipient = instance.parent_message.sender
            if instance.parent_message:
                # Ensure subject is set to "Re: [Original Subject]"
                instance.subject = f"Re: {instance.parent_message.subject}"
            instance.save()
        formset.save_m2m()

class MessagingAdmin(admin.ModelAdmin):
    list_display = ('subject', 'sender', 'recipient', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at', 'sender', 'recipient')
    search_fields = ('subject', 'body', 'sender__username', 'recipient__username')
    readonly_fields = ('created_at', 'sender', 'recipient', 'subject', 'body')  # Original message fields read-only
    inlines = [MessageReplyInline]
    actions = ['reply_to_message', 'mark_as_read']

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "recipient" and not request.user.is_superuser:
            kwargs["queryset"] = User.objects.filter(user_type='patient')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        if request.user.user_type in ['staff', 'dentist']:
            return qs.filter(recipient=request.user) | qs.filter(sender=request.user)
        return qs.none()

    def has_add_permission(self, request):
        return request.user.user_type in ['staff', 'dentist'] or request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.user_type in ['staff', 'dentist'] or request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.user_type in ['staff', 'dentist'] or request.user.is_superuser

    def save_model(self, request, obj, form, change):
        if not change and (request.user.user_type in ['staff', 'dentist'] or request.user.is_superuser):
            obj.sender = request.user
        super().save_model(request, obj, form, change)

    def get_changeform_initial_data(self, request):
        initial = super().get_changeform_initial_data(request)
        if 'recipient' in request.GET:
            initial['recipient'] = request.GET['recipient']
        if 'parent_message' in request.GET:
            initial['parent_message'] = request.GET['parent_message']
        return initial

    def reply_to_message(self, request, queryset):
        if queryset.count() != 1:
            self.message_user(request, "Please select exactly one message to reply to.")
            return
        message = queryset.first()
        add_url = reverse('admin:messaging_messaging_add')
        return HttpResponseRedirect(
            f"{add_url}?recipient={message.sender.id}&parent_message={message.id}"
        )
    reply_to_message.short_description = "Reply to selected message"

    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
        self.message_user(request, "Selected messages have been marked as read.")
    mark_as_read.short_description = "Mark selected messages as read"

admin.site.register(Messaging, MessagingAdmin)