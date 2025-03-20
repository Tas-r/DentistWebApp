# from django.urls import reverse
# from rest_framework import status
# from rest_framework.test import APITestCase, APIClient
# from django.contrib.auth import get_user_model
# from .models import User, Patient, Dentist, Staff
# from .serializers import UserSerializer, PatientSerializer, DentistSerializer, StaffSerializer

# UserModel = get_user_model()

# class TestAPIViews(APITestCase):
#     def setUp(self):
#         self.client = APIClient()
        
#         # Create a staff user for testing (to simulate staff-only actions)
#         self.staff_user = UserModel.objects.create_user(
#             username='staffuser',
#             email='staff@example.com',
#             password='staffpass123',
#             user_type='staff',
#             is_staff=True
#         )
        
#         # Create a patient user
#         self.patient_user = UserModel.objects.create_user(
#             username='patientuser',
#             email='patient@example.com',
#             password='patientpass123',
#             user_type='patient'
#         )
        
#         # Create a dentist user
#         self.dentist_user = UserModel.objects.create_user(
#             username='dentistuser',
#             email='dentist@example.com',
#             password='dentistpass123',
#             user_type='dentist'
#         )
        
#         # Create related profiles
#         self.patient_profile = Patient.objects.create(
#             user=self.patient_user,
#             emergency_contact_name='John Doe',
#             emergency_contact_phone='1234567890'
#         )
        
#         self.dentist_profile = Dentist.objects.create(
#             user=self.dentist_user,
#             specialization='Orthodontics',
#             license_number='DEN123'
#         )
        
#         self.staff_profile = Staff.objects.create(
#             user=self.staff_user,
#             position='Manager',
#             department='Admin',
#             hire_date='2023-01-01'
#         )

#     # Test SignupView
#     def test_signup_as_staff(self):
#         self.client.force_authenticate(user=self.staff_user)
#         url = reverse('signup')  # Ensure this matches your URL name in urls.py
#         data = {
#             'username': 'newuser',
#             'email': 'newuser@example.com',
#             'password': 'newpass123',
#             'user_type': 'patient',
#             'first_name': 'New',
#             'last_name': 'User'
#         }
#         response = self.client.post(url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(response.data['message'], 'User registered successfully')
#         self.assertTrue(UserModel.objects.filter(username='newuser').exists())

#     def test_signup_as_non_staff(self):
#         self.client.force_authenticate(user=self.patient_user)
#         url = reverse('signup')
#         data = {
#             'username': 'anotheruser',
#             'email': 'another@example.com',
#             'password': 'anotherpass123',
#             'user_type': 'patient'
#         }
#         response = self.client.post(url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
#         self.assertEqual(response.data['error'], 'Only staff can create new users.')

#     # Test LoginView
#     def test_login_success(self):
#         url = reverse('login')  # Ensure this matches your URL name in urls.py
#         data = {
#             'username': 'patientuser',
#             'password': 'patientpass123'
#         }
#         response = self.client.post(url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertIn('access_token', response.data)
#         self.assertIn('refresh_token', response.data)
#         self.assertEqual(response.data['username'], 'patientuser')

#     def test_login_invalid_credentials(self):
#         url = reverse('login')
#         data = {
#             'username': 'patientuser',
#             'password': 'wrongpass'
#         }
#         response = self.client.post(url, data, format='json')
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#         self.assertIn('non_field_errors', response.data)

#     # Test UserViewSet
#     def test_user_list_as_staff(self):
#         self.client.force_authenticate(user=self.staff_user)
#         url = reverse('user-list')  # Ensure this matches your ViewSet URL name
#         response = self.client.get(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), UserModel.objects.count())

#     def test_user_list_as_patient(self):
#         self.client.force_authenticate(user=self.patient_user)
#         url = reverse('user-list')
#         response = self.client.get(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 1)  # Patient only sees themselves
#         self.assertEqual(response.data[0]['username'], 'patientuser')

#     # Test PatientViewSet
#     def test_patient_list_as_staff(self):
#         self.client.force_authenticate(user=self.staff_user)
#         url = reverse('patient-list')  # Ensure this matches your ViewSet URL name
#         response = self.client.get(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), Patient.objects.count())

#     def test_patient_list_as_patient(self):
#         self.client.force_authenticate(user=self.patient_user)
#         url = reverse('patient-list')
#         response = self.client.get(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 1)  # Patient only sees their profile
#         self.assertEqual(response.data[0]['user']['username'], 'patientuser')

#     # Test DentistViewSet
#     def test_dentist_list_as_staff(self):
#         self.client.force_authenticate(user=self.staff_user)
#         url = reverse('dentist-list')  # Ensure this matches your ViewSet URL name
#         response = self.client.get(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), Dentist.objects.count())

#     def test_dentist_list_as_dentist(self):
#         self.client.force_authenticate(user=self.dentist_user)
#         url = reverse('dentist-list')
#         response = self.client.get(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 1)  # Dentist only sees their profile
#         self.assertEqual(response.data[0]['user']['username'], 'dentistuser')

#     # Test StaffViewSet
#     def test_staff_list_as_staff(self):
#         self.client.force_authenticate(user=self.staff_user)
#         url = reverse('staff-list')  # Ensure this matches your ViewSet URL name
#         response = self.client.get(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), Staff.objects.count())

#     def test_staff_list_as_non_staff(self):
#         self.client.force_authenticate(user=self.patient_user)
#         url = reverse('staff-list')
#         response = self.client.get(url, format='json')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(len(response.data), 0)  # Non-staff sees nothing
