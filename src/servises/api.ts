import axios from 'axios';

// Use environment variable for API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData: any) => api.post('/auth/signup', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) => 
    api.post('/auth/reset-password', { token, newPassword }),
  verifyOtp: (email: string, otp: string) => api.post('/auth/verify-otp', { email, otp }),
};

// Listings API
export const listingsAPI = {
  getAll: () => api.get('/listings'),
  getById: (id: string) => api.get(`/listings/${id}`),
  getUserListings: () => api.get('/listings/user/my-listings'),
  create: (listingData: any) => api.post('/listings', listingData),
  update: (id: string, listingData: any) => api.put(`/listings/${id}`, listingData),
  delete: (id: string) => api.delete(`/listings/${id}`),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
};

export default api;