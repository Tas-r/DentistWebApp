def setUp(self):
    """Set up test users and authentication"""

    # Create a test patient user
    self.patient_user = User.objects.create_user(
        username="hello",
        email="patient@example.com",  # ✅ Add email
        password="test4321",
        user_type="patient"
    )
    self.patient_profile = Patient.objects.create(user=self.patient_user)

    # Create a test dentist user
    self.dentist_user = User.objects.create_user(
        username="dentist1",
        email="dentist@example.com",  # ✅ Add email
        password="test4321",
        user_type="dentist"
    )
    self.dentist_profile = Dentist.objects.create(user=self.dentist_user)

    # Authenticate as patient to get JWT token
    response = self.client.post("/login/", {
        "username": "hello",
        "password": "test4321"
    })
    self.access_token = response.data["access"]

    # Set authentication header for future requests
    self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

    # Create a test appointment
    self.appointment = Appointment.objects.create(
        patient=self.patient_profile,
        dentist=self.dentist_profile,
        appointment_date=timezone.now() + datetime.timedelta(days=1),
        service="Teeth Cleaning",
    )
