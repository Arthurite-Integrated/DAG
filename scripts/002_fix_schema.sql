-- Migration script to fix missing columns in departments and profiles tables

-- Add missing columns to departments table
ALTER TABLE departments
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL;

-- Add missing columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS employee_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true NOT NULL;

-- Create index on employee_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_employee_id ON profiles(employee_id);

-- Create index on department_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_department_id ON profiles(department_id);

-- Create index on manager_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_departments_manager_id ON departments(manager_id);

-- Update existing profiles to have employee_ids if they don't have them
-- This generates employee IDs in the format EMP001, EMP002, etc.
DO $$
DECLARE
  profile_record RECORD;
  counter INTEGER := 1;
BEGIN
  FOR profile_record IN 
    SELECT id FROM profiles WHERE employee_id IS NULL ORDER BY created_at
  LOOP
    UPDATE profiles 
    SET employee_id = 'EMP' || LPAD(counter::TEXT, 3, '0')
    WHERE id = profile_record.id;
    counter := counter + 1;
  END LOOP;
END $$;

-- Set all existing records to active by default
UPDATE departments SET is_active = true WHERE is_active IS NULL;
UPDATE profiles SET is_active = true WHERE is_active IS NULL;
