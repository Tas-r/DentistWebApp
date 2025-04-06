// api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/appointments/';

// Create an axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch available dentists
export const fetchDentists = async () => {
  try {
    const response = await api.get('dentists/'); // Adjust endpoint if needed
    return response.data;
  } catch (error) {
    console.error('Error fetching dentists:', error);
    throw error;
  }
};

// Fetch available services
export const fetchServices = async () => {
  try {
    const response = await api.get('services/');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Fetch available time slots for a dentist on a specific date
export const fetchAvailableTimeSlots = async (dentistId, date) => {
  try {
    const response = await api.get('time-slots/', {
      params: { dentist_id: dentistId, date },
    });
    return response.data.available_slots;
  } catch (error) {
    console.error('Error fetching time slots:', error);
    throw error;
  }
};

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post('', appointmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};