# appointments/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # List and create appointments
    path('', views.AppointmentListCreateView.as_view(), name='appointment-list-create'),
    
    # Detail view for a specific appointment
    path('<int:pk>/', views.AppointmentDetailView.as_view(), name='appointment-detail'),
    
    # Upcoming appointments
    path('upcoming/', views.UpcomingAppointmentsView.as_view(), name='upcoming-appointments'),
    
    # User's own appointments
    path('my-appointments/', views.AppointmentListCreateView.as_view(), name='my-appointments'),
]