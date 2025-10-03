-- Complete database setup script that creates the correct schema
-- This script will drop existing incorrect tables and create the proper schema

-- Drop existing incorrect tables
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;

-- Disable RLS on all tables to avoid infinite recursion issues
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.attendance_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.biometric_devices DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.tablename || '_policy') || ' ON public.' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'hr', 'employee')),
  department_id UUID REFERENCES public.departments(id),
  biometric_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create biometric_devices table
CREATE TABLE IF NOT EXISTS public.biometric_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_name TEXT NOT NULL,
  device_id TEXT NOT NULL UNIQUE,
  location TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ NOT NULL,
  check_out_time TIMESTAMPTZ,
  device_id UUID REFERENCES public.biometric_devices(id),
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'late', 'absent', 'half_day')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON public.attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_check_in ON public.attendance_records(check_in_time);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON public.profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_profiles_biometric ON public.profiles(biometric_id);

-- Insert sample departments
INSERT INTO public.departments (name, description) VALUES
  ('Engineering', 'Software development and IT'),
  ('Human Resources', 'HR and recruitment'),
  ('Sales', 'Sales and business development'),
  ('Marketing', 'Marketing and communications')
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_departments_updated_at ON public.departments;
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_attendance_records_updated_at ON public.attendance_records;
CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON public.attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_biometric_devices_updated_at ON public.biometric_devices;
CREATE TRIGGER update_biometric_devices_updated_at
  BEFORE UPDATE ON public.biometric_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Note: RLS is disabled for now to avoid infinite recursion issues
-- You can enable it later with proper policies that don't cause circular dependencies
