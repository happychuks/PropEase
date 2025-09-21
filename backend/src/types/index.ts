import { UserRole, EmploymentStatus, AccommodationType, ApplicationStatus, PaymentStatus, ComplaintStatus } from '@prisma/client';
import { Request } from 'express';

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
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
  employmentStatus: EmploymentStatus;
  employerName?: string;
  familySize: number;
  desiredAccommodationType: AccommodationType;
  previousAddress: string;
  reasonForLeaving: string;
  yearlyRentCapacity: number;
}

export interface ApplicationReviewRequest {
  applicationStatus: ApplicationStatus;
  reviewNotes?: string;
}

export interface PropertyRequest {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  description?: string;
}

export interface LeaseAgreementRequest {
  startDate: string;
  endDate: string;
  rent: number;
  deposit?: number;
  terms?: string;
  propertyId: string;
  tenantId: string;
}

export interface PaymentRequest {
  amount: number;
  dueDate: string;
  paymentMethod?: string;
  reference?: string;
  notes?: string;
  propertyId: string;
  tenantId: string;
  leaseAgreementId: string;
}

export interface ComplaintRequest {
  title: string;
  description: string;
  priority?: string;
  propertyId: string;
  tenantId: string;
}

export interface ComplaintResponseRequest {
  response: string;
  status: ComplaintStatus;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}
