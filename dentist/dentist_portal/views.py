from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .models import PatientProfile
from .serializers import PatientProfileSerializer

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError

class PatientProfileViewSet(ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer

    def create(self, request, *args, **kwargs):
        # Custom validation or pre-processing logic
        # For example, ensure some required fields are not empty or other logic
        data = request.data
        if 'some_field' not in data:  # Example check
            raise ValidationError("Missing some_field.")

        # Proceed with the default create behavior
        return super().create(request, *args, **kwargs)
