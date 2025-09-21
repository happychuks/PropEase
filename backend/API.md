# PropEase API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Access**: Public
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "LANDLORD" | "TENANT"
}
```

#### Login User
- **POST** `/auth/login`
- **Access**: Public
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
- **GET** `/auth/me`
- **Access**: Private

#### Refresh Token
- **POST** `/auth/refresh`
- **Access**: Public
- **Body**:
```json
{
  "refreshToken": "your-refresh-token"
}
```

### Prospective Tenant Applications

#### Submit Application
- **POST** `/applications`
- **Access**: Public
- **Body**:
```json
{
  "applicantEmail": "applicant@example.com",
  "applicantName": "Jane Doe",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "employmentStatus": "EMPLOYED",
  "employerName": "Company Inc",
  "familySize": 2,
  "desiredAccommodationType": "TWO_BEDROOM",
  "previousAddress": "123 Old Street",
  "reasonForLeaving": "Looking for better location",
  "yearlyRentCapacity": 24000
}
```

#### Get Application Status
- **GET** `/applications/status?email=applicant@example.com`
- **Access**: Public

#### Get All Applications (Landlord)
- **GET** `/applications`
- **Access**: Private (Landlord only)
- **Query Parameters**:
  - `status`: Filter by application status
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

#### Get Application by ID (Landlord)
- **GET** `/applications/:id`
- **Access**: Private (Landlord only)

#### Review Application
- **PUT** `/applications/:id/review`
- **Access**: Private (Landlord only)
- **Body**:
```json
{
  "applicationStatus": "APPROVED" | "REJECTED" | "UNDER_REVIEW",
  "reviewNotes": "Optional review notes"
}
```

### Properties (Placeholder)
- **GET** `/properties` - Get all properties
- **POST** `/properties` - Create property (Landlord only)
- **GET** `/properties/:id` - Get property by ID
- **PUT** `/properties/:id` - Update property (Landlord only)
- **DELETE** `/properties/:id` - Delete property (Landlord only)

### Payments (Placeholder)
- **GET** `/payments` - Get payments
- **POST** `/payments` - Create payment record (Landlord only)
- **PUT** `/payments/:id/status` - Update payment status

### Complaints (Placeholder)
- **GET** `/complaints` - Get complaints
- **POST** `/complaints` - Create complaint (Tenant only)
- **PUT** `/complaints/:id/response` - Respond to complaint (Landlord only)

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Data Models

### User Roles
- `LANDLORD` - Property owner/manager
- `TENANT` - Property renter

### Employment Status
- `EMPLOYED` - Currently employed
- `SELF_EMPLOYED` - Self-employed
- `UNEMPLOYED` - Currently unemployed
- `STUDENT` - Student
- `RETIRED` - Retired

### Accommodation Types
- `STUDIO` - Studio apartment
- `ONE_BEDROOM` - 1 bedroom
- `TWO_BEDROOM` - 2 bedrooms
- `THREE_BEDROOM` - 3 bedrooms
- `MINI_FLAT` - Mini flat (room/parlor)
- `SELF_CONTAINED` - Self-contained unit
- `DUPLEX` - Duplex

### Application Status
- `PENDING` - Awaiting review
- `UNDER_REVIEW` - Currently being reviewed
- `APPROVED` - Application approved
- `REJECTED` - Application rejected
- `WITHDRAWN` - Application withdrawn by applicant

### Payment Status
- `PENDING` - Payment pending
- `PAID` - Payment completed
- `OVERDUE` - Payment overdue

### Complaint Status
- `OPEN` - Complaint submitted
- `IN_PROGRESS` - Complaint being addressed
- `CLOSED` - Complaint resolved
