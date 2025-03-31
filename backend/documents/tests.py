from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from users.models import User, Patient
from .models import Document

class DocumentModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='patient1', email='p1@example.com', password='securepass123', user_type='patient')
        self.patient = Patient.objects.create(user=self.user)
    
    def test_upload_pdf_document(self):
        pdf_file = SimpleUploadedFile("test.pdf", b"%PDF-1.4 test content", content_type="application/pdf")
        document = Document.objects.create(
            patient=self.patient,
            document_type='xray',
            document_file=pdf_file
        )
        self.assertEqual(document.patient, self.patient)
        self.assertTrue(document.document_file.name.endswith(".pdf"))
