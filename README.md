# DAG Industries Attendance Monitoring System

A comprehensive, production-ready attendance monitoring system built with Next.js, Supabase, and TypeScript.

## Features

### Core Functionality
- **Biometric & Manual Check-In/Check-Out**: Support for both biometric devices and manual attendance entry
- **Role-Based Access Control (RBAC)**: Three user roles - Admin, HR, and Employee with appropriate permissions
- **Employee Management**: Complete CRUD operations for managing employees and departments
- **Attendance Tracking**: Real-time attendance monitoring with check-in/check-out functionality
- **Correction Workflow**: Employees can request attendance corrections, HR/Admin can review and approve
- **Reports & Analytics**: Daily, monthly, and employee-specific attendance reports with visual charts
- **Device Management**: Register and manage biometric devices with API integration
- **Audit Logging**: Comprehensive audit trail for all system actions

### User Interfaces
- **Admin Dashboard**: Full-featured dashboard with statistics, employee management, and system settings
- **Employee Check-In Portal**: Simple, focused interface for quick attendance marking
- **Reports Module**: Detailed analytics with exportable data and visual charts

### Security Features
- **Row Level Security (RLS)**: Database-level security policies
- **Supabase Authentication**: Secure email/password authentication
- **API Key Authentication**: Secure biometric device integration
- **Middleware Protection**: Route-level authentication and authorization

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Charts**: Recharts

## Brand Colors

- Primary Blue: `#15356E`
- Accent Red: `#DA291C`
- Background: `#000000` (Black)
- Text: `#FFFFFF` (White)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Git

### Installation

1. **Clone or download the project**
   \`\`\`bash
   # If using GitHub integration
   git clone <your-repo-url>
   cd dag-attendance-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   
   The following environment variables are already configured in your v0 project:
   - `SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

   For local development, create a `.env.local` file:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
   \`\`\`

4. **Run database migrations**
   
   Execute the SQL scripts in order from the `scripts/` folder:
   - `001_create_tables.sql` - Creates all database tables
   - `002_enable_rls.sql` - Enables Row Level Security policies
   - `003_create_functions.sql` - Creates database functions and triggers
   - `004_seed_data.sql` - Seeds initial data (departments and admin user)

   You can run these directly in the Supabase SQL Editor or use the v0 script runner.

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Access the application**
   - Main app: `http://localhost:3000`
   - Login page: `http://localhost:3000/auth/login`
   - Employee check-in: `http://localhost:3000/check-in`

### Default Admin Credentials

After running the seed script, you can log in with:
- **Email**: `admin@dagindustries.com`
- **Password**: `Admin@123456`

**Important**: Change this password immediately after first login!

## Project Structure

\`\`\`
dag-attendance-system/
├── app/
│   ├── api/
│   │   └── biometric/          # Biometric device API endpoints
│   ├── auth/                   # Authentication pages
│   ├── dashboard/              # Admin dashboard pages
│   ├── check-in/               # Employee check-in portal
│   └── page.tsx                # Landing page
├── components/
│   ├── dashboard/              # Dashboard components
│   ├── employees/              # Employee management components
│   ├── attendance/             # Attendance tracking components
│   ├── corrections/            # Correction workflow components
│   ├── reports/                # Reporting components
│   ├── devices/                # Device management components
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── supabase/               # Supabase client utilities
│   ├── types.ts                # TypeScript type definitions
│   └── utils/                  # Utility functions
├── scripts/                    # Database migration scripts
└── middleware.ts               # Next.js middleware for auth
\`\`\`

## User Roles & Permissions

### Admin
- Full system access
- Manage employees and departments
- Manage biometric devices
- View all reports and analytics
- Approve attendance corrections
- System settings

### HR
- Manage employees and departments
- View all reports and analytics
- Approve attendance corrections
- Cannot manage biometric devices

### Employee
- View own attendance
- Check in/check out
- Request attendance corrections
- View own profile

## Biometric Device Integration

The system provides REST API endpoints for biometric device integration. See `BIOMETRIC_API.md` for complete documentation.

### Quick Start for Devices

1. Register device in Admin Dashboard → Devices
2. Note the `device_id` and `api_key`
3. Use the API endpoints:
   - `POST /api/biometric/verify` - Verify device credentials
   - `POST /api/biometric/check-in` - Record attendance

Example request:
\`\`\`bash
curl -X POST https://your-domain.com/api/biometric/check-in \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "BIO-001",
    "employee_id": "EMP001",
    "action": "check-in"
  }'
\`\`\`

## Database Schema

### Main Tables
- `profiles` - User profiles with role-based access
- `departments` - Company departments
- `attendance` - Attendance records (check-in/check-out)
- `attendance_corrections` - Correction requests and approvals
- `biometric_devices` - Registered biometric devices
- `audit_logs` - System audit trail

All tables are protected with Row Level Security (RLS) policies.

## Deployment

### Deploy to Vercel

1. **Push to GitHub** (if not already done)
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Click the "Publish" button in v0
   - Or connect your GitHub repo to Vercel
   - Add environment variables in Vercel dashboard

3. **Configure Supabase**
   - Add your production URL to Supabase allowed URLs
   - Update redirect URLs in Supabase Auth settings

## Development

### Adding New Features

1. **Database Changes**: Add migration scripts in `scripts/` folder
2. **API Routes**: Add in `app/api/` directory
3. **UI Components**: Add in `components/` directory
4. **Pages**: Add in `app/` directory

### Code Style

- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Use Server Components by default, Client Components when needed
- Implement proper error handling
- Add loading states for async operations

## Troubleshooting

### Common Issues

1. **Authentication errors**
   - Verify Supabase environment variables
   - Check Supabase Auth settings
   - Ensure redirect URLs are configured

2. **Database errors**
   - Verify all migration scripts have been run
   - Check RLS policies are enabled
   - Ensure user has proper role assigned

3. **Biometric device connection**
   - Verify device is registered and active
   - Check API key is correct
   - Ensure device has network connectivity

## Support

For technical support or questions:
- Check the documentation in `BIOMETRIC_API.md`
- Review the code comments
- Contact IT department at DAG Industries

## License

Proprietary - DAG Industries © 2025

---

Built with ❤️ for DAG Industries
