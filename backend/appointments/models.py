from django.db import models
from users.models import Patient, Dentist

class Service(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="patient_appointments")
    dentist = models.ForeignKey(Dentist, on_delete=models.CASCADE, related_name="dentist_appointments")
    appointment_date = models.DateTimeField()
    services = models.ManyToManyField(Service)  # Many-to-many relationship
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Appointment: {self.patient.user.username} with Dr. {self.dentist.user.username} on {self.appointment_date}"

    class Meta:
        ordering = ['appointment_date']