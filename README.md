# CareerHub – Job Portal

[![Next.js](https://img.shields.io/badge/Next.js-14.2.24-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)

> **"Connect Talent with Opportunity"**  
> A centralized, production-grade recruitment platform connecting ambitious job seekers with leading companies. Built as a comprehensive, modern full-stack web application with role-based access control, rich candidate profiles, resume management, advanced job discovery, visual recruitment pipelines, and recruitment analytics.

---

## 🌟 Key Features & Architecture

### 🔐 1. Authentication & Role-Based Access Control (RBAC)
- **Three Core User Roles**:
  - **Candidate**: Search jobs, build profile, upload resumes, 1-click apply, track application status, save jobs.
  - **Recruiter**: Manage company branding, post & manage jobs, review applicants, visual pipeline kanban, schedule interviews, view hiring analytics.
  - **Admin**: Platform-wide user management, job moderation, platform analytics, system health monitoring.
- **Secure Password Hashing**: Passwords encrypted using `bcryptjs` with salt rounds.
- **Session Tokens**: JWT HTTP-only secure cookie session handling with Bearer token compatibility.
- **1-Click Demo Login Bar**: The login page provides instant one-click login buttons for Candidate, Recruiter, and Admin roles for seamless review and demonstration.

---

### 🌐 2. Modern Landing Page (`/`)
- **Hero Section**: High-converting search bar for instant title, skill, and location filtering.
- **Statistics Counter**: Real-time platform counters (Active Jobs, Partner Companies, Candidates Placed, Success Rate).
- **Popular Categories Grid**: Software Engineering, Data Science, Product Management, Design, DevOps, Cybersecurity, Sales, Marketing.
- **Featured Jobs Carousel**: Direct cards with company logos, salary brackets, tags, and bookmarking.
- **How CareerHub Works**: Step-by-step interactive workflow for candidates and recruiters.
- **Benefits Section**: Dedicated value propositions for job seekers and hiring teams.
- **Top Companies Section**: Showcase verified hiring companies with open position counts.

---

### 💼 3. Advanced Job Discovery (`/jobs`)
- **Multi-parameter Search**: Full-text keyword and location filtering.
- **Faceted Sidebar Filters**:
  - **Job Types**: Full-time, Part-time, Internship, Contract.
  - **Work Modes**: Remote, Hybrid, On-site.
  - **Experience Levels**: Entry Level, Mid Level, Senior Level, Lead / Executive.
  - **Categories**: Dynamic category selection with real-time job counts.
- **Dynamic Sorting**: Newest first, Salary: High to Low, Salary: Low to High.
- **Save/Bookmark System**: Save jobs to candidate dashboard with instant feedback.
- **Comprehensive Job Details (`/jobs/[id]`)**:
  - Full job description, responsibilities, requirements, and company perks.
  - Application deadline countdown and company overview card.
  - Interactive **"Apply Now"** modal with resume selector and custom cover letter.
  - **Similar Jobs Recommendations** based on category and tags.

---

### 🎓 4. Candidate Portal (`/candidate/*`)
- **Executive Dashboard (`/candidate/dashboard`)**:
  - Profile completion percentage indicator with missing field alerts.
  - Metric summary cards (Total Applications, In Review, Shortlisted, Interviews).
  - Recommended jobs matched to candidate's skills.
  - Recent applications log and saved jobs preview.
- **360° Profile Management (`/candidate/profile`)**:
  - Profile photo, headline, bio, location, phone, social links (LinkedIn, GitHub, Portfolio).
  - Multi-entry **Education History** (Degree, Field, Institution, Years, Grade).
  - Multi-entry **Work Experience** (Title, Company, Location, Duration, Description).
  - **Skills Management**: Skill tagging with years of experience.
- **Resume Management (`/candidate/resumes`)**:
  - Upload PDF, DOC, DOCX resumes with file size validation.
  - View, download, set default resume, or delete.
  - Cloud storage abstraction supporting local file serving and easily swappable to AWS S3 or Cloudinary.
- **Application Tracker (`/candidate/applications`)**:
  - Filter applications by stage (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `SELECTED`, `REJECTED`).
  - Interactive modal displaying application timeline, cover letter, and interview details (interview type, date & time, Google Meet / Zoom link, recruiter notes).
- **Saved Jobs (`/candidate/saved-jobs`)**: Quick management of bookmarked positions with direct apply buttons.
- **In-App Notifications (`/candidate/notifications`)**: Live notification feed for status updates, interview schedules, and new job alerts.

---

### 🏢 5. Recruiter Portal (`/recruiter/*`)
- **Hiring Analytics Dashboard (`/recruiter/dashboard`)**:
  - Key KPIs: Active Jobs, Total Applicants, Candidates in Review, Scheduled Interviews.
  - Recent applicants table with quick review action triggers.
- **Company Profile (`/recruiter/company`)**:
  - Manage company name, logo, industry, company size, website, founded year, location, and description.
  - Public company profile page (`/companies/[id]`) showing company overview and all open roles.
- **Job Management (`/recruiter/jobs`)**:
  - View all posted jobs with applicant counter and views.
  - Edit job postings, toggle between **Active**, **Draft**, and **Closed**.
  - Delete jobs with confirmation modals.
- **Post a Job (`/recruiter/jobs/new`)**:
  - Comprehensive form: Title, category, job type, work mode, experience level, location, salary range, application deadline.
  - Multi-tag skills input, structured responsibilities, requirements, and company benefits.
  - Save as Draft or Publish immediately.
- **Application Management (`/recruiter/applications`)**:
  - Search applicants by candidate name or job title.
  - Filter by pipeline status.
  - Open candidate 360° profile drawer: view resume document, candidate skills, work history, and cover letter.
  - 1-click status advancement: Move to Under Review, Shortlist, Schedule Interview, Select/Hire, or Reject.
- **Visual Recruitment Pipeline Kanban (`/recruiter/pipeline`)**:
  - Interactive visual column board with all 6 stages:
    `Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Interview` ➔ `Selected` ➔ `Rejected`.
  - Candidate cards showing contact info, headline, applied date, and resume link.
  - 1-click stage advancement buttons to progress or decline candidates instantly.
- **Interview Scheduling Modal**:
  - Set interview round (Screening, Technical Round, System Design, HR).
  - Set date and time, video call link (Google Meet / Zoom), and private notes.
  - Automatically notifies candidate with interview details.
- **Recruitment Analytics (`/recruiter/analytics`)**:
  - Interactive Recharts charts: Applications by status breakdown, job posting performance comparison, and conversion metrics.

---

### 🛡️ 6. Administrator Portal (`/admin/*`)
- **Executive Platform Dashboard (`/admin/dashboard`)**:
  - System KPIs: Total Registered Users, Candidates, Recruiters, Total Jobs, Active Postings, Total Applications.
  - Quick actions and recent activity logs.
- **User Management (`/admin/users`)**:
  - Directory of all registered users with role badges.
  - Search by name or email, filter by role (Candidate, Recruiter, Admin) or status (Active, Inactive).
  - Activate or Deactivate user accounts.
  - Delete accounts with confirmation modal.
- **Job Moderation (`/admin/jobs`)**:
  - Oversee all job listings across all companies.
  - Delete spam or inappropriate job listings.
- **Platform Analytics (`/admin/analytics`)**:
  - Platform distribution charts and applicant metrics.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Recharts |
| **Backend** | Next.js Server Route Handlers (RESTful API), Node.js, TypeScript |
| **Database** | PostgreSQL 18, Prisma ORM |
| **Authentication** | JWT (`jsonwebtoken`), `bcryptjs`, Secure HTTP-Only Cookie Session |
| **Storage** | Pluggable Storage Abstraction (`LocalStorageProvider` with S3/Cloudinary ready interface) |
| **Styling** | Tailwind CSS with responsive modern recruitment UI design |

---

## 📁 Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login/               # Universal Login Page with 1-Click Demo Buttons
│   │   └── register/            # Role-aware Registration Page (Candidate / Recruiter)
│   ├── admin/                   # Administrator Portal
│   │   ├── dashboard/           # Platform metrics & summary
│   │   ├── users/               # Search, filter, activate/deactivate, delete users
│   │   ├── jobs/                # Job moderation & deletion
│   │   ├── analytics/           # Platform-wide Recharts visualizations
│   │   └── settings/            # System configuration
│   ├── candidate/               # Candidate Portal
│   │   ├── dashboard/           # Profile completion, recent apps, recommended jobs
│   │   ├── profile/             # Profile, education, experience, skills editor
│   │   ├── resumes/             # Resume upload, preview, download, set default
│   │   ├── applications/        # Application tracking, status modal, interview details
│   │   ├── saved-jobs/          # Bookmarked jobs
│   │   ├── notifications/       # Candidate alerts feed
│   │   └── settings/            # Password update & preferences
│   ├── recruiter/               # Recruiter Portal
│   │   ├── dashboard/           # Hiring metrics & quick actions
│   │   ├── company/             # Company branding & profile editor
│   │   ├── jobs/                # Job management & status toggles
│   │   │   └── new/             # Post a Job form
│   │   ├── applications/        # Candidate screening table & profile review
│   │   ├── pipeline/            # Visual Recruitment Kanban Pipeline (6 stages)
│   │   ├── analytics/           # Hiring funnel charts & metrics
│   │   └── settings/            # Company recruitment settings
│   ├── companies/               # Public Companies directory & Company profile ([id])
│   ├── jobs/                    # Public Job search, faceted filters & Job details ([id])
│   ├── about/                   # About CareerHub page
│   ├── api/                     # REST API Route Handlers
│   │   ├── auth/                # login, register, logout, me
│   │   ├── jobs/                # search, create, get, edit, delete, save/bookmark
│   │   ├── applications/        # submit application, update status, schedule interview
│   │   ├── candidates/          # profile, education, experience, skills, resumes
│   │   ├── companies/           # list companies, get company profile, update
│   │   ├── recruiter/           # hiring analytics & metrics
│   │   ├── admin/               # platform stats, users management, moderation
│   │   ├── notifications/       # user notifications, mark read
│   │   ├── categories/          # job categories
│   │   └── upload/              # file & resume upload API
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/
│   ├── layout/                  # Navbar, Footer, AppLayout, Role Sidebars
│   └── ui/                      # Button, Input, Modal, Badge, Card, Toast
├── lib/
│   ├── auth.ts                  # Session resolution & role authorization
│   ├── jwt.ts                   # Token creation & verification
│   ├── prisma.ts                # Prisma singleton instance
│   └── storage.ts               # Storage Provider abstraction (Local / S3 / Cloudinary)
├── prisma/
│   ├── schema.prisma            # PostgreSQL schema with full relational models
│   └── seed.ts                  # Comprehensive demo seed script (Companies, Jobs, Users, Applications)
├── types/                       # Shared TypeScript interfaces & types
└── middleware.ts                # Next.js Route Guard middleware
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ supported)
- **npm** or **yarn**

### 1. Clone & Install Dependencies
```bash
git clone <repository_url>
cd "student management"
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:password@127.0.0.1:5432/careerhub?schema=public"
DIRECT_URL="postgresql://postgres:password@127.0.0.1:5432/careerhub?schema=public"

AUTH_SECRET="careerhub-super-secret-jwt-key-production-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Start Database & Seed Demo Data
CareerHub comes equipped with an embedded zero-configuration PostgreSQL engine or can connect to any remote PostgreSQL server (Supabase, Neon, AWS RDS).

To run the embedded PostgreSQL engine:
```bash
npm run db:start
```

Push schema to PostgreSQL:
```bash
npx prisma db push
```

Generate Prisma Client:
```bash
npx prisma generate
```

Seed rich sample data (Companies, 16+ Jobs, Candidates, Resumes, Applications across stages):
```bash
npm run seed
```

### 4. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Demo Login Credentials

For quick evaluation and testing, the application includes pre-configured demo accounts:

| Portal | Email | Password | Role | Redirect Path |
| :--- | :--- | :--- | :--- | :--- |
| **Candidate** | `candidate@careerhub.com` | `CareerHub@123` | `CANDIDATE` | `/candidate/dashboard` |
| **Recruiter** | `recruiter@careerhub.com` | `CareerHub@123` | `RECRUITER` | `/recruiter/dashboard` |
| **Administrator** | `admin@careerhub.com` | `CareerHub@123` | `ADMIN` | `/admin/dashboard` |

> 💡 **Quick Access**: On the `/login` page, you can click any of the **Quick Demo Access** buttons to automatically fill in the credentials and log in instantly with one click!

---

## 📡 REST API Reference

All API routes return standardized JSON: `{ "success": boolean, "data"?: any, "error"?: string, "message"?: string }`.

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & issue session cookie | Public |
| `POST` | `/api/auth/register` | Register candidate or recruiter account | Public |
| `POST` | `/api/auth/logout` | Clear session cookie | Authenticated |
| `GET` | `/api/auth/me` | Fetch active user profile and roles | Authenticated |
| `GET` | `/api/jobs` | Search & filter jobs with pagination & sorting | Public |
| `POST` | `/api/jobs` | Create a new job posting | Recruiter |
| `GET` | `/api/jobs/:id` | Fetch detailed job view with company info | Public |
| `PUT, DELETE` | `/api/jobs/:id` | Update or delete job posting | Recruiter / Admin |
| `POST` | `/api/jobs/:id/save` | Toggle save / bookmark job | Candidate |
| `GET` | `/api/saved-jobs` | List candidate's saved jobs | Candidate |
| `GET` | `/api/applications` | List applications (for Candidate or Recruiter) | Authenticated |
| `POST` | `/api/applications` | Submit application with resume & cover letter | Candidate |
| `GET` | `/api/applications/:id`| Get application details & interview status | Authenticated |
| `PUT` | `/api/applications/:id/status` | Advance candidate stage & schedule interview | Recruiter |
| `GET, PUT` | `/api/candidates/me` | Get / update candidate 360° profile | Candidate |
| `POST, DELETE`| `/api/candidates/education` | Add / delete education record | Candidate |
| `POST, DELETE`| `/api/candidates/experience` | Add / delete work experience | Candidate |
| `POST, DELETE`| `/api/candidates/skills` | Add / delete skills with years of exp | Candidate |
| `GET, POST` | `/api/candidates/resumes` | Upload & list uploaded resumes | Candidate |
| `DELETE` | `/api/candidates/resumes/:id` | Delete resume document | Candidate |
| `POST` | `/api/candidates/resumes/:id/default` | Set resume as primary default | Candidate |
| `GET` | `/api/companies` | List hiring companies | Public |
| `GET, PUT` | `/api/companies/:id` | View company profile / update info | Public / Recruiter |
| `GET` | `/api/recruiter/analytics` | Recruiter hiring metrics & Recharts data | Recruiter |
| `GET` | `/api/admin/stats` | Platform-wide KPIs & distribution | Admin |
| `GET` | `/api/admin/users` | Admin user directory with search & filters | Admin |
| `PUT, DELETE` | `/api/admin/users/:id` | Activate/deactivate user or delete | Admin |
| `GET` | `/api/notifications` | User notifications feed | Authenticated |
| `PUT` | `/api/notifications/:id/read` | Mark notification as read | Authenticated |

---

## 🔒 Security Best Practices Implemented

1. **Password Encryption**: All passwords stored using standard `bcrypt` hashing with salt rounds.
2. **Access Control**: Role authorization validated on both client middleware and backend API route handlers.
3. **SQL Injection Defense**: All database queries executed via Prisma ORM parameterized statements.
4. **Data Integrity**: Foreign key constraints and unique constraints prevent duplicate applications to the same job.
5. **Session Safety**: HTTP-only, `sameSite='lax'` cookies prevent cross-site scripting (XSS) token exposure.
6. **File Type & Size Restrictions**: Upload endpoints enforce strict MIME type matching (PDF, DOC, DOCX, PNG, JPG) and size limits.

---

## 📜 License
CareerHub is open-source recruitment software released under the [MIT License](LICENSE).
