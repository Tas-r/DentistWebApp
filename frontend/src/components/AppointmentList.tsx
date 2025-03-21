import React, { useEffect, useState } from 'react';
import { getAppointments, getUpcomingAppointments, deleteAppointment, createAppointment, getPatients, getDentists } from '../api';
import { Appointment, Patient, Dentist } from '../types';
import { Calendar, Clock, Trash2, RefreshCw, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    dentist_id: '',
    appointment_date: '',
    service: '',
  });

  const fetchAppointments = async (upcoming: boolean) => {
    try {
      setLoading(true);
      const data = upcoming ? await getUpcomingAppointments() : await getAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

// AppointmentList.tsx (partial update)
const fetchDropdownData = async () => {
  try {
    const [patientsData, dentistsData] = await Promise.all([getPatients(), getDentists()]);
    setPatients(patientsData);
    setDentists(dentistsData);
  } catch (error) {
    console.error('Error fetching dropdown data:', error);
    toast.error('Please log in to view patients and dentists');
    // Optionally redirect to login page
  }
};

useEffect(() => {
  fetchAppointments(showUpcoming);
  fetchDropdownData();
}, [showUpcoming]);

  useEffect(() => {
    fetchAppointments(showUpcoming);
    fetchDropdownData();
  }, [showUpcoming]);

  const handleDelete = async (id: number) => {
    try {
      await deleteAppointment(id);
      toast.success('Appointment deleted successfully');
      fetchAppointments(showUpcoming);
    } catch (error) {
      toast.error('Failed to delete appointment');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAppointment({
        ...(formData.patient_id && { patient_id: Number(formData.patient_id) }),
        ...(formData.dentist_id && { dentist_id: Number(formData.dentist_id) }),
        appointment_date: formData.appointment_date,
        service: formData.service,
      });
      toast.success('Appointment created successfully');
      setFormData({ patient_id: '', dentist_id: '', appointment_date: '', service: '' });
      setShowForm(false);
      fetchAppointments(showUpcoming);
    } catch (error) {
      toast.error('Failed to create appointment');
      console.error('Error creating appointment:', error);
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Appointments</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowUpcoming(!showUpcoming)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            {showUpcoming ? 'Show All' : 'Show Upcoming'}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {showForm ? 'Cancel' : 'New Appointment'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient</label>
              <select
                value={formData.patient_id}
                onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.user.username}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dentist</label>
              <select
                value={formData.dentist_id}
                onChange={(e) => setFormData({ ...formData, dentist_id: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Select Dentist</option>
                {dentists.map((dentist) => (
                  <option key={dentist.id} value={dentist.id}>
                    Dr. {dentist.user.username}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date & Time</label>
              <input
                type="datetime-local"
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Service</label>
              <input
                type="text"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Appointment
          </button>
        </form>
      )}

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No appointments found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-semibold">
                    {formatDateTime(appointment.appointment_date)}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(appointment.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Dentist:</span>{' '}
                  Dr. {appointment.dentist.username}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Patient:</span>{' '}
                  {appointment.patient.username}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Service:</span> {appointment.service}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Created: {new Date(appointment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}