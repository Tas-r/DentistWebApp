from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, Patient, Staff, Dentist

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=8)  # Added min_length for security
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 
                  'user_type', 'phone_number', 'address', 'date_of_birth', 'is_active']
        read_only_fields = ['is_staff', 'is_superuser']  # Prevents manual override of staff/superuser status
    
    def validate_user_type(self, value):
        # Ensure user_type is valid
        valid_types = [choice[0] for choice in User.USER_TYPES]
        if value not in valid_types:
            raise serializers.ValidationError(f"Invalid user_type. Must be one of: {valid_types}")
        return value
    
    def validate_email(self, value):
        # Ensure email is unique (optional, since model already enforces it)
        if self.instance is None and User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        # Use CustomUserManager's create_user method for consistency
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=password,
            **{k: v for k, v in validated_data.items() if k not in ['username', 'email']}
        )
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        # Update fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Handle password update
        if password:
            try:
                validate_password(password, instance)
                instance.set_password(password)
            except ValidationError as e:
                raise serializers.ValidationError({'password': e.messages})
        
        instance.save()
        return instance

# Login Serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        
        if not user:
            raise serializers.ValidationError("Invalid username or password")
        
        if not user.is_active:
            raise serializers.ValidationError("This account is inactive")
        
        refresh = RefreshToken.for_user(user)
        
        return {
            'user_id': user.id,
            'username': user.username,
            'user_type': user.user_type,
            'email': user.email,
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
        }

# Patient Serializer
class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Patient
        fields = ['id', 'user', 'emergency_contact_name', 'emergency_contact_phone', 
                  'medical_history', 'insurance_provider', 'insurance_policy_number']
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_data['user_type'] = 'patient'
        
        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        
        patient = Patient.objects.create(user=user, **validated_data)
        return patient
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

# Staff Serializer
class StaffSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Staff
        fields = ['id', 'user', 'position', 'department', 'hire_date']
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_data['user_type'] = 'staff'
        user_data['is_staff'] = True
        
        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        
        staff = Staff.objects.create(user=user, **validated_data)
        return staff
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

# Dentist Serializer (Added for completeness)
class DentistSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Dentist
        fields = ['id', 'user', 'specialization', 'license_number', 'years_of_experience', 
                  'bio', 'profile_image']
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_data['user_type'] = 'dentist'
        
        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        
        dentist = Dentist.objects.create(user=user, **validated_data)
        return dentist
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        
        if user_data:
            user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance