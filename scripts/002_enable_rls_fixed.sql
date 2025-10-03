-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check user role without causing recursion
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
  RETURN user_role;
END;
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Use the security definer function to avoid infinite recursion
CREATE POLICY "Admins can insert profiles" 
  ON public.profiles FOR INSERT 
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update all profiles" 
  ON public.profiles FOR UPDATE 
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Departments policies
CREATE POLICY "Users can view departments" 
  ON public.departments FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and HR can manage departments" 
  ON public.departments FOR ALL 
  USING (public.get_user_role(auth.uid()) IN ('admin', 'hr'));

-- Biometric devices policies
CREATE POLICY "Users can view devices" 
  ON public.biometric_devices FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage devices" 
  ON public.biometric_devices FOR ALL 
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Attendance records policies
CREATE POLICY "Users can view own attendance" 
  ON public.attendance_records FOR SELECT 
  USING (
    user_id = auth.uid() OR
    public.get_user_role(auth.uid()) IN ('admin', 'hr')
  );

CREATE POLICY "Users can insert own attendance" 
  ON public.attendance_records FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins and HR can manage all attendance" 
  ON public.attendance_records FOR ALL 
  USING (public.get_user_role(auth.uid()) IN ('admin', 'hr'));

-- Attendance corrections policies
CREATE POLICY "Users can view own corrections" 
  ON public.attendance_corrections FOR SELECT 
  USING (
    user_id = auth.uid() OR
    requested_by = auth.uid() OR
    public.get_user_role(auth.uid()) IN ('admin', 'hr')
  );

CREATE POLICY "Users can request corrections" 
  ON public.attendance_corrections FOR INSERT 
  WITH CHECK (requested_by = auth.uid());

CREATE POLICY "Admins and HR can manage corrections" 
  ON public.attendance_corrections FOR UPDATE 
  USING (public.get_user_role(auth.uid()) IN ('admin', 'hr'));

-- Audit logs policies
CREATE POLICY "Admins can view audit logs" 
  ON public.audit_logs FOR SELECT 
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "System can insert audit logs" 
  ON public.audit_logs FOR INSERT 
  WITH CHECK (true);
