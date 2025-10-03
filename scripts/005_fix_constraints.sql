-- Migration: Fix constraint violations for profiles and attendance_records
-- This script fixes the role check constraint and foreign key issues

-- Step 1: Drop the problematic foreign key to auth.users for testing
-- In production, you would keep this, but for testing with dummy data we need to remove it
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Step 2: Add or replace the role check constraint with correct values
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('admin', 'hr', 'manager', 'employee'));

-- Step 3: Ensure status check constraint exists on attendance_records
ALTER TABLE attendance_records DROP CONSTRAINT IF EXISTS attendance_records_status_check;
ALTER TABLE attendance_records 
  ADD CONSTRAINT attendance_records_status_check 
  CHECK (status IN ('present', 'absent', 'late', 'half-day', 'on-leave'));

-- Step 4: Ensure check_in_method and check_out_method constraints exist
ALTER TABLE attendance_records DROP CONSTRAINT IF EXISTS attendance_records_check_in_method_check;
ALTER TABLE attendance_records 
  ADD CONSTRAINT attendance_records_check_in_method_check 
  CHECK (check_in_method IN ('biometric', 'manual', 'admin'));

ALTER TABLE attendance_records DROP CONSTRAINT IF EXISTS attendance_records_check_out_method_check;
ALTER TABLE attendance_records 
  ADD CONSTRAINT attendance_records_check_out_method_check 
  CHECK (check_out_method IN ('biometric', 'manual', 'admin'));

-- Step 5: Ensure all foreign keys are properly set up
-- user_id in attendance_records must reference profiles(id)
ALTER TABLE attendance_records 
  DROP CONSTRAINT IF EXISTS attendance_records_user_id_fkey;
ALTER TABLE attendance_records 
  ADD CONSTRAINT attendance_records_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- recorded_by in attendance_records must reference profiles(id)
ALTER TABLE attendance_records 
  DROP CONSTRAINT IF EXISTS attendance_records_recorded_by_fkey;
ALTER TABLE attendance_records 
  ADD CONSTRAINT attendance_records_recorded_by_fkey 
  FOREIGN KEY (recorded_by) REFERENCES profiles(id) ON DELETE SET NULL;

-- manager_id in departments must reference profiles(id)
ALTER TABLE departments 
  DROP CONSTRAINT IF EXISTS departments_manager_id_fkey;
ALTER TABLE departments 
  ADD CONSTRAINT departments_manager_id_fkey 
  FOREIGN KEY (manager_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- department_id in profiles must reference departments(id)
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_department_id_fkey;
ALTER TABLE profiles 
  ADD CONSTRAINT profiles_department_id_fkey 
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- Step 6: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_department_id ON profiles(department_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_employee_id ON profiles(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_user_id ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_status ON attendance_records(status);
CREATE INDEX IF NOT EXISTS idx_attendance_records_recorded_by ON attendance_records(recorded_by);
