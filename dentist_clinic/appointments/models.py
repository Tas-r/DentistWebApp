from django.db import models
from users.models import PatientProfile,DentistProfile
# Create your models here.


class Appointment(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name="patient_appointments")
    dentist = models.ForeignKey(DentistProfile, on_delete=models.CASCADE, related_name="dentist_appointments")
    date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Appointment: {self.patient.user.username} with Dr. {self.dentist.user.username} on {self.date}"

