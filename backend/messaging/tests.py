from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from users.models import User, CustomUserManager
from messaging.models import Messaging
import datetime

class MessagingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create a patient user
        self.patient = User.objects.create_user(
            email='patient@example.com',
            username='patient1',
            password='testpass123',
            user_type='patient',
            first_name='Patient',
            last_name='One'
        )
        
        # Create a dentist user
        self.dentist = User.objects.create_user(
            email='dentist@example.com',
            username='dentist1',
            password='testpass123',
            user_type='dentist',
            first_name='Dentist',
            last_name='One'
        )
        
        # Authenticate as patient
        self.client.force_authenticate(user=self.patient)
        
        # Create a test message from patient to dentist
        self.message = Messaging.objects.create(
            sender=self.patient,
            recipient=self.dentist,
            subject='Consultation Request',
            body='I need a dental checkup.',
            is_read=False
        )

    def test_create_message_patient_to_dentist(self):
        """Test that a patient can send a message to a dentist."""
        self.client.force_authenticate(user=self.patient)
        url = reverse('message-list-create')
        data = {
            'recipient_id': self.dentist.id,
            'subject': 'New Appointment',
            'body': 'Can we schedule an appointment?'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Messaging.objects.count(), 2)  # One from setUp, one new
        self.assertEqual(response.data['subject'], 'New Appointment')
        self.assertEqual(response.data['sender']['username'], 'patient1')
        self.assertEqual(response.data['recipient']['username'], 'dentist1')

    def test_create_message_dentist_to_patient(self):
        """Test that a dentist can send a message to a patient."""
        self.client.force_authenticate(user=self.dentist)
        url = reverse('message-list-create')
        data = {
            'recipient_id': self.patient.id,
            'subject': 'Appointment Confirmation',
            'body': 'Your appointment is confirmed for tomorrow.'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Messaging.objects.count(), 2)
        self.assertEqual(response.data['subject'], 'Appointment Confirmation')
        self.assertEqual(response.data['sender']['username'], 'dentist1')
        self.assertEqual(response.data['recipient']['username'], 'patient1')

    def test_reply_to_message(self):
        """Test that a dentist can reply to a patient's message."""
        self.client.force_authenticate(user=self.dentist)
        url = reverse('message-reply', kwargs={'pk': self.message.id})
        data = {
            'recipient_id': self.patient.id,
            'subject': 'Re: Consultation Request',
            'body': 'Please come in tomorrow at 10 AM.'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        reply = Messaging.objects.get(parent_message=self.message)
        self.assertEqual(reply.sender, self.dentist)
        self.assertEqual(reply.recipient, self.patient)
        self.assertEqual(reply.subject, 'Re: Consultation Request')

    def test_view_inbox_patient(self):
        """Test that a patient can view their unread messages."""
        self.client.force_authenticate(user=self.patient)
        url = reverse('inbox')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # No unread messages to patient yet
        
        # Send a message from dentist to patient
        Messaging.objects.create(
            sender=self.dentist,
            recipient=self.patient,
            subject='Follow-up',
            body='Please schedule a follow-up.',
            is_read=False
        )
        
        response = self.client.get(url)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['subject'], 'Follow-up')

    def test_view_inbox_dentist(self):
        """Test that a dentist can view their unread messages."""
        self.client.force_authenticate(user=self.dentist)
        url = reverse('inbox')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # One unread message from setUp
        self.assertEqual(response.data[0]['subject'], 'Consultation Request')

    def test_mark_message_as_read(self):
        """Test that viewing a message marks it as read."""
        self.client.force_authenticate(user=self.dentist)
        url = reverse('message-detail', kwargs={'pk': self.message.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.message.refresh_from_db()
        self.assertTrue(self.message.is_read)

    def test_unauthorized_access(self):
        """Test that a user cannot access another user's messages."""
        # Create another patient
        other_patient = User.objects.create_user(
            email='other@example.com',
            username='otherpatient',
            password='testpass123',
            user_type='patient'
        )
        self.client.force_authenticate(user=other_patient)
        url = reverse('message-detail', kwargs={'pk': self.message.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)