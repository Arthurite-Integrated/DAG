# Database Setup Guide

## Current Issue
The Supabase database has an incorrect schema that doesn't match the application code.

**Current (Incorrect) Schema:**
- `attendance` table with columns: `student_id`, `date`, `status`, `notes`, `recorded_by`
- `students` table
- `profiles` table (partially correct)

**Required (Correct) Schema:**
- `attendance_records` table with columns: `user_id`, `check_in_time`, `check_out_time`, `status`, etc.
- `profiles` table with employee information
- `departments` table
- `biometric_devices` table
- `attendance_corrections` table
- `audit_logs` table

## Setup Instructions

Run the SQL scripts in this exact order:

### 1. Reset Database (Clean Slate)
\`\`\`
scripts/000_reset_database.sql
\`\`\`
This will drop all existing tables, functions, and policies including the incorrect `attendance` and `students` tables.

### 2. Create Tables
\`\`\`
scripts/001_create_tables.sql
\`\`\`
This creates the correct schema with all required tables.

### 3. Create Functions
\`\`\`
scripts/003_create_functions.sql
\`\`\`
This creates utility functions for triggers and automation.

### 4. Seed Data (Optional)
\`\`\`
scripts/004_seed_data.sql
\`\`\`
This adds sample data for testing.

### 5. Disable RLS (Temporary)
\`\`\`
scripts/006_disable_rls_temporarily.sql
\`\`\`
This disables Row Level Security to get the app working. We can add proper RLS policies later.

## Verification

After running the scripts, verify the schema by checking that these tables exist:
- ✅ `profiles`
- ✅ `departments`
- ✅ `biometric_devices`
- ✅ `attendance_records`
- ✅ `attendance_corrections`
- ✅ `audit_logs`

And these tables should NOT exist:
- ❌ `students`
- ❌ `attendance`

## Next Steps

Once the database schema is correct, the application will work properly with:
- Employee check-in/check-out functionality
- Dashboard with attendance statistics
- Biometric device integration
- Attendance correction requests
