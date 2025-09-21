import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (data: RegisterRequest) => api.post('/auth/register', data),
  login: (data: LoginRequest) => api.post('/auth/login', data),
  refreshToken: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  getMe: () => api.get('/auth/me'),
};

export const applicationAPI = {
  submit: (data: ProspectiveTenantApplicationRequest) => api.post('/applications', data),
  getStatus: (email: string) => api.get(`/applications/status?email=${email}`),
  getAll: (params?: { status?: string; page?: number; limit?: number }) => 
    api.get('/applications', { params }),
  getById: (id: string) => api.get(`/applications/${id}`),
  review: (id: string, data: ApplicationReviewRequest) => 
    api.put(`/applications/${id}/review`, data),
};

// Types
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'LANDLORD' | 'TENANT';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ProspectiveTenantApplicationRequest {
  applicantEmail: string;
  applicantName: string;
  phoneNumber: string;
  dateOfBirth: string;
  employmentStatus: 'EMPLOYED' | 'SELF_EMPLOYED' | 'UNEMPLOYED' | 'STUDENT' | 'RETIRED';
  employerName?: string;
  familySize: number;
  desiredAccommodationType: 'STUDIO' | 'ONE_BEDROOM' | 'TWO_BEDROOM' | 'THREE_BEDROOM' | 'MINI_FLAT' | 'SELF_CONTAINED' | 'DUPLEX';
  previousAddress: string;
  reasonForLeaving: string;
  yearlyRentCapacity: number;
}

export interface ApplicationReviewRequest {
  applicationStatus: 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  reviewNotes?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'LANDLORD' | 'TENANT';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProspectiveTenantApplication {
  id: string;
  applicantEmail: string;
  applicantName: string;
  phoneNumber: string;
  dateOfBirth: string;
  employmentStatus: string;
  employerName?: string;
  familySize: number;
  desiredAccommodationType: string;
  previousAddress: string;
  reasonForLeaving: string;
  yearlyRentCapacity: string;
  applicationStatus: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
  landlord?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
