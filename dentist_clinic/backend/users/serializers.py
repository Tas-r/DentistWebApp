from rest_framework import serializers
from .models import CustomUser, PatientProfile, DentistProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'user_id', 'username', 'role', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = PatientProfile
        fields = '__all__'

class DentistProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = DentistProfile
        fields = '__all__'
