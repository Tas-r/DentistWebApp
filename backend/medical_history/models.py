from django.db import models
from users.models import Patient, Dentist  


# users/models.py


class MedicalHistory(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_histories')
    dentist = models.ForeignKey(Dentist, on_delete=models.SET_NULL, null=True, related_name='diagnoses')
    diagnosis = models.TextField()
    date_of_diagnosis = models.DateField()
    treatment_plan = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date_of_diagnosis']
    
    def __str__(self):
        return f"{self.patient} - {self.diagnosis} ({self.date_of_diagnosis})"