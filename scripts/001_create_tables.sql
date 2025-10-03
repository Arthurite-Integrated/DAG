-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.attendance_corrections CASCADE;
DROP TABLE IF EXISTS public.attendance_records CASCADE;
DROP TABLE IF EXISTS public.biometric_devices CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.departments CASCADE;

-- Create departments table first (without manager_id foreign key)
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  manager_id UUID, -- Temporarily without foreign key constraint
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  employee_id TEXT UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'hr', 'employee')),
  department_id UUID REFERENCES public.departments(id),
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Now add the foreign key constraint for manager_id after profiles exists
ALTER TABLE public.departments 
  ADD CONSTRAINT departments_manager_id_fkey 
  FOREIGN KEY (manager_id) REFERENCES public.profiles(id);

-- Create biometric devices table
CREATE TABLE public.biometric_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT NOT NULL UNIQUE,
  device_name TEXT NOT NULL,
  location TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('fingerprint', 'face_recognition', 'card_reader')),
  ip_address TEXT,
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create attendance records table
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ NOT NULL,
  check_out_time TIMESTAMPTZ,
  check_in_method TEXT NOT NULL CHECK (check_in_method IN ('biometric', 'manual', 'admin')),
  check_out_method TEXT CHECK (check_out_method IN ('biometric', 'manual', 'admin')),
  device_id UUID REFERENCES public.biometric_devices(id),
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'late', 'absent', 'half_day', 'on_leave')),
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create attendance corrections table
CREATE TABLE public.attendance_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_id UUID NOT NULL REFERENCES public.attendance_records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES public.profiles(id),
  original_check_in TIMESTAMPTZ,
  original_check_out TIMESTAMPTZ,
  corrected_check_in TIMESTAMPTZ,
  corrected_check_out TIMESTAMPTZ,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_department ON public.profiles(department_id);
CREATE INDEX idx_profiles_employee_id ON public.profiles(employee_id);
CREATE INDEX idx_departments_manager ON public.departments(manager_id);
CREATE INDEX idx_attendance_user_date ON public.attendance_records(user_id, check_in_time);
CREATE INDEX idx_attendance_status ON public.attendance_records(status);
CREATE INDEX idx_corrections_status ON public.attendance_corrections(status);
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id, created_at);
