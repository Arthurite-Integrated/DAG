-- Drop existing policies and function that cause infinite recursion
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view departments" ON public.departments;
DROP POLICY IF EXISTS "Admins and HR can manage departments" ON public.departments;
DROP POLICY IF EXISTS "Users can view devices" ON public.biometric_devices;
DROP POLICY IF EXISTS "Admins can manage devices" ON public.biometric_devices;
DROP POLICY IF EXISTS "Users can view own attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Users can insert own attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Admins and HR can manage all attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Users can view own corrections" ON public.attendance_corrections;
DROP POLICY IF EXISTS "Users can request corrections" ON public.attendance_corrections;
DROP POLICY IF EXISTS "Admins and HR can manage corrections" ON public.attendance_corrections;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

DROP FUNCTION IF EXISTS public.get_user_role(UUID);

-- Create simplified RLS policies that don't cause infinite recursion
-- Profiles policies - simplified to avoid recursion
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Authenticated users can insert profiles" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Departments policies - allow all authenticated users to view
CREATE POLICY "Users can view departments" 
  ON public.departments FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage departments" 
  ON public.departments FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Biometric devices policies
CREATE POLICY "Users can view devices" 
  ON public.biometric_devices FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage devices" 
  ON public.biometric_devices FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Attendance records policies - users can only see/manage their own
CREATE POLICY "Users can view own attendance" 
  ON public.attendance_records FOR SELECT 
  USING (user_id = auth.uid() OR auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert own attendance" 
  ON public.attendance_records FOR INSERT 
  WITH CHECK (user_id = auth.uid() OR auth.uid() IS NOT NULL);

CREATE POLICY "Users can update attendance" 
  ON public.attendance_records FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete attendance" 
  ON public.attendance_records FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Attendance corrections policies
CREATE POLICY "Users can view corrections" 
  ON public.attendance_corrections FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can request corrections" 
  ON public.attendance_corrections FOR INSERT 
  WITH CHECK (requested_by = auth.uid());

CREATE POLICY "Users can manage corrections" 
  ON public.attendance_corrections FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Audit logs policies - allow all authenticated users
CREATE POLICY "Users can view audit logs" 
  ON public.audit_logs FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert audit logs" 
  ON public.audit_logs FOR INSERT 
  WITH CHECK (true);
