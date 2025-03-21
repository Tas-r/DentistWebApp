import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Appointment } from './types';

const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Request Interceptor: Add access token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('401 detected, attempting token refresh...');
      try {
        const newAccessToken = await refreshToken();
        console.log('New access token obtained:', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Only clear tokens and redirect if refresh fails
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 403) {
      console.error('403 Forbidden - Check permissions or token validity');
      // Don't redirect automatically on 403, let the component handle it
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export const login = async (username: string = 'ratim', password: string = '123') => {
  try {
    const response = await api.post('/users/login/', { username, password });
    const { access, refresh } = response.data;
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    console.log('Login successful. Access:', access, 'Refresh:', refresh);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const refreshToken = async (): Promise<string> => {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) {
    throw new Error('No refresh token available');
  }
  try {
    const response = await axios.post(`${API_URL}/users/token/refresh/`, { refresh });
    const newAccessToken = response.data.access;
    localStorage.setItem('access', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Refresh token request failed:', error);
    throw error;
  }
};

export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await api.get('/appointments/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    throw error;
  }
};

export const getUpcomingAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get('/appointments/upcoming/');
  return response.data;
};

export const createAppointment = async (data: {
  patient_id?: number;
  dentist_id?: number;
  appointment_date: string;
  service: string;
}): Promise<Appointment> => {
  const response = await api.post('/appointments/', data);
  return response.data;
};

// Assuming you might need these for dropdowns
export const getPatients = async () => {
  const response = await axios.get('http://localhost:8000/users/patients/', {
    headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
  });
  return response.data;
};

export const getDentists = async () => {
  const response = await axios.get('http://localhost:8000/users/dentists/', {
    headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
  });
  return response.data;
};

export const updateAppointment = async (
  id: number,
  data: Partial<Appointment>
): Promise<Appointment> => {
  const response = await api.put(`/appointments/${id}/`, data);
  return response.data;
};

export const deleteAppointment = async (id: number): Promise<void> => {
  await api.delete(`/appointments/${id}/`);
};