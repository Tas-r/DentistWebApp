export interface User {
  id: number;
  username: string;
  email: string;
  user_type: 'patient' | 'dentist' | 'staff';
  first_name: string;
  last_name: string;
}

export interface Patient {
  id: number;
  username: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  medical_history: string;
  insurance_provider: string;
  insurance_policy_number: string;
}

export interface Dentist {
  id: number;
  username: string;
  specialization: string;
  license_number: string;
  years_of_experience: number;
}

export interface Appointment {
  id: number;
  patient: Patient;
  dentist: Dentist;
  appointment_date: string;
  service: string;
  created_at: string;
  updated_at: string;
}