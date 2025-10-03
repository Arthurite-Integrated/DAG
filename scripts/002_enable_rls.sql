-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometric_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can insert profiles" 
  ON public.profiles FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" 
  ON public.profiles FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Departments policies
CREATE POLICY "Users can view departments" 
  ON public.departments FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and HR can manage departments" 
  ON public.departments FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'hr')
    )
  );

-- Biometric devices policies
CREATE POLICY "Users can view devices" 
  ON public.biometric_devices FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage devices" 
  ON public.biometric_devices FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Attendance records policies
CREATE POLICY "Users can view own attendance" 
  ON public.attendance_records FOR SELECT 
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'hr')
    )
  );

CREATE POLICY "Users can insert own attendance" 
  ON public.attendance_records FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins and HR can manage all attendance" 
  ON public.attendance_records FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'hr')
    )
  );

-- Attendance corrections policies
CREATE POLICY "Users can view own corrections" 
  ON public.attendance_corrections FOR SELECT 
  USING (
    user_id = auth.uid() OR
    requested_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'hr')
    )
  );

CREATE POLICY "Users can request corrections" 
  ON public.attendance_corrections FOR INSERT 
  WITH CHECK (requested_by = auth.uid());

CREATE POLICY "Admins and HR can manage corrections" 
  ON public.attendance_corrections FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'hr')
    )
  );

-- Audit logs policies
CREATE POLICY "Admins can view audit logs" 
  ON public.audit_logs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert audit logs" 
  ON public.audit_logs FOR INSERT 
  WITH CHECK (true);
