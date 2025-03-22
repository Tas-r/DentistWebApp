from django.urls import path
from . import views

urlpatterns = [
    # List messages or send a new one
    path('list_create/', views.MessageListCreateView.as_view(), name='message-list-create'),
    
    # View, update, or delete a specific message
    path('<int:pk>/view_update_delete/', views.MessageDetailView.as_view(), name='message-detail'),
    
    # Reply to a specific message
    path('<int:pk>/reply/', views.ReplyMessageView.as_view(), name='message-reply'),
    
    # View unread messages (inbox)
    path('inbox/', views.InboxView.as_view(), name='inbox'),
]