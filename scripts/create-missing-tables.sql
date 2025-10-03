-- Create missing tables that were defined but not created

-- Create biometric devices table
CREATE TABLE IF NOT EXISTS public.biometric_devices (
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

-- Create attendance corrections table
CREATE TABLE IF NOT EXISTS public.attendance_corrections (
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
CREATE TABLE IF NOT EXISTS public.audit_logs (
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
CREATE INDEX IF NOT EXISTS idx_corrections_status ON public.attendance_corrections(status);
CREATE INDEX IF NOT EXISTS idx_corrections_user ON public.attendance_corrections(user_id);
CREATE INDEX IF NOT EXISTS idx_corrections_attendance ON public.attendance_corrections(attendance_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_biometric_devices_active ON public.biometric_devices(is_active);
