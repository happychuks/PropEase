# 📌 PropEase Project Plan

## 1. 🎯 Project Overview

**Project Name:** PropEase – Real Estate Property Management System  
**Goal:** Build a comprehensive web application that enables landlords to manage properties/tenants, allows prospective tenants to apply for accommodation, and provides active tenants with tools to handle payments, documents, and communications.  
**Approach:** Use AI to accelerate planning, development, and testing — ensuring faster iterations and better code quality.  

---

## 2. 🛠 Tech Stack

- **Language:** TypeScript
- **Frontend:** Next.js  
- **Backend:** Node.js + Express.js  
- **Database:** PostgreSQL with Prisma ORM  
- **Authentication:** JWT (JSON Web Tokens)  
- **File Storage:** Cloudinary / AWS S3  
- **Deployment:**  
  - Frontend → Vercel  
  - Backend → Heroku / Render  
  - Database → Supabase / Railway / AWS RDS (PostgreSQL)  

---

## 3. 📅 Phases & Milestones

### Phase 1: Planning & Design

- Define detailed scope (landlord vs prospective tenant vs active tenant features).  
- Design database schema with Prisma models (User, Property, Payment, Complaint, LeaseAgreement, ProspectiveTenantApplication).  
- Map out REST API endpoints and authorization rules.  
- Design prospective tenant application form and review workflow.  
- Document AI-assisted workflow (code generation, testing, PR review).  

✅ **Deliverables:**  

- ERD (Entity Relationship Diagram)  
- API Specification (OpenAPI / Swagger)  
- Prospective Tenant Application Form Design  
- AI Usage Guidelines  

---

### Phase 2: Backend Foundation

- Initialize Express.js backend with TypeScript support.  
- Setup PostgreSQL + Prisma ORM with migrations.  
- Implement JWT-based authentication & role-based access control (landlord vs tenant).  
- Define Prisma models:  
  - `User` (landlord, tenant)  
  - `Property`  
  - `Payment`  
  - `Complaint`  
  - `LeaseAgreement`  
  - `ProspectiveTenantApplication`  

✅ **Deliverables:**  

- Secure auth service  
- User, Property, Payment, Complaint, Lease, Application CRUD APIs  
- Prisma migration setup  

---

### Phase 3: Frontend Foundation

- Bootstrap Next.js project with TypeScript support.  
- Setup authentication flow (login/register with JWT).  
- Build public application form for prospective tenants.  
- Build landlord dashboard (manage properties, view tenants, review applications, track payments).  
- Build tenant dashboard (view rent, upload payment receipts, submit complaints).  

✅ **Deliverables:**  

- Public prospective tenant application form  
- Landlord dashboard prototype  
- Tenant dashboard prototype  
- API integration with backend  

---

### Phase 4: AI-Enhanced Development (Ongoing)

- Use AI tools (Gemini, GitHub Copilot, CodeRabbit) to:  
  - Generate boilerplate React components, Express routes, and Prisma queries.  
  - Generate Jest + Supertest test cases (unit + integration).  
  - Review PRs and suggest improvements.  

✅ **Deliverables:**  

- AI-assisted code scaffolding  
- Auto-generated test coverage reports  
- PR quality gate automation  

---

### Phase 5: Advanced Features

- Payment tracking (with status: Pending, Paid, Overdue).  
- Complaint system with status workflow (Open → In Progress → Closed).  
- Document uploads (Cloudinary / S3).  
- Notifications (email/SMS for payments, complaints, application status).  
- Application review workflow (Pending → Under Review → Approved/Rejected).  
- Tenant onboarding process (convert approved applications to active tenants).  

✅ **Deliverables:**  

- Payment module  
- Complaint module  
- File upload system  
- Notification service  
- Application review system  
- Tenant onboarding workflow  

---

### Phase 6: Deployment & Monitoring

- Deploy backend (Heroku / Render) and frontend (Vercel).  
- Provision managed PostgreSQL (Supabase / Railway / AWS RDS).  
- Add logging + monitoring (Winston, PM2, Datadog / Logtail).  
- Setup CI/CD (GitHub Actions for testing & deployment).  

✅ **Deliverables:**  

- Live staging environment  
- Monitoring dashboard  
- Automated deployment pipeline  

---

## 4. 📡 AI Integration Strategy

1. **Scaffolding:** Use AI to generate React components, Express routes, Prisma models.  
2. **Logic Assistance:** Describe business rules (e.g., rent overdue calculation) → AI drafts functions.  
3. **Testing:** AI generates Jest + Supertest unit & integration tests.  
4. **Consistency:** Feed Prisma models to AI for CRUD API + frontend integration.  
5. **Code Review:** CodeRabbit provides PR summaries & improvement suggestions.  

---

## 5. 🔑 Risks & Mitigation

| Risk | Mitigation |
|------|-------------|
| Over-reliance on AI | Always review and refactor AI-generated code before merging |
| Data inconsistency | Strict schema validation with Prisma + Zod |
| Authentication vulnerabilities | Enforce JWT expiration, refresh tokens, role-based access |
| Vendor lock-in (Cloudinary/S3/Heroku) | Abstract storage + deployment layer, keep migration docs |
| Scaling issues | Plan for PostgreSQL indexing, caching (Redis), and load balancer support |

---

## 6. 🚀 Success Criteria

- Functional landlord + tenant dashboards.  
- Public prospective tenant application form with review workflow.  
- Secure authentication and role management.  
- Smooth handling of payments, complaints, and documents.  
- Application-to-tenant conversion workflow.  
- AI-assisted tests with >80% coverage.  
- CI/CD-enabled deployment.

---

## 7. 👥 User Types & Workflows

### **Prospective Tenant**
1. Visit public application form (`/apply`)
2. Fill out application with personal info, employment status, family size, desired accommodation type, previous residence details, and yearly rent capacity
3. Submit application and receive confirmation email
4. Check application status at `/application-status`
5. If approved → Receive login credentials and become active tenant
6. If rejected → Receive rejection email with optional feedback

### **Landlord**
1. Login to dashboard
2. View new prospective tenant applications in queue
3. Review application details (personal info, employment, financial capacity, housing preferences)
4. Make decision (approve/reject) with optional review notes
5. System automatically sends appropriate email to applicant
6. If approved → System creates tenant account and sends credentials
7. Manage active tenants, properties, payments, and complaints

### **Active Tenant**
1. Login with credentials received after application approval
2. View rent information and payment history
3. Upload payment receipts
4. Submit complaints or maintenance requests
5. Access lease documents and property information
6. Communicate with landlord through the platform

---

## 8. 📊 Application Form Fields

### **Personal Information**
- Full Name
- Email Address
- Phone Number
- Date of Birth

### **Employment & Financial**
- Employment Status (Employed, Self-employed, Unemployed, Student, Retired)
- Employer Name (if employed)
- Yearly Rent Capacity

### **Housing Preferences**
- Family Size
- Desired Accommodation Type (Studio, 1-bedroom, 2-bedroom, 3-bedroom, Mini-flat, Self-contained, Duplex)

### **Previous Residence**
- Previous Address
- Reason for Leaving  
