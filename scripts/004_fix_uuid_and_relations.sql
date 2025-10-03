-- Migration: Fix UUID syntax in profiles and relate user_id with attendance_records
-- This script ensures profiles.id references auth.users and fixes attendance_records to use user_id

-- Step 1: Fix profiles table to properly reference auth.users
-- First, we need to ensure the profiles table id is a foreign key to auth.users
-- Drop the existing profiles table and recreate it with proper constraints
ALTER TABLE IF EXISTS attendance_records DROP CONSTRAINT IF EXISTS attendance_records_profile_id_fkey;
ALTER TABLE IF EXISTS attendance_records DROP CONSTRAINT IF EXISTS attendance_records_recorded_by_fkey;
ALTER TABLE IF EXISTS departments DROP CONSTRAINT IF EXISTS departments_manager_id_fkey;

-- Recreate profiles table with proper auth.users reference
-- Note: We're using CREATE OR REPLACE to handle existing data
DO $$ 
BEGIN
  -- Check if profiles table exists and doesn't have the auth.users foreign key
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    -- Add foreign key constraint to auth.users if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'profiles_id_fkey' AND table_name = 'profiles'
    ) THEN
      -- First, ensure all profile IDs exist in auth.users
      -- If not, this will fail and you'll need to clean up orphaned records
      ALTER TABLE profiles 
        ADD CONSTRAINT profiles_id_fkey 
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Step 2: Fix attendance_records table to use user_id instead of profile_id
-- Rename profile_id column to user_id if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'attendance_records' AND column_name = 'profile_id'
  ) THEN
    ALTER TABLE attendance_records RENAME COLUMN profile_id TO user_id;
  END IF;
END $$;

-- Step 3: Add proper foreign key constraints
ALTER TABLE attendance_records 
  DROP CONSTRAINT IF EXISTS attendance_records_user_id_fkey,
  ADD CONSTRAINT attendance_records_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE attendance_records 
  DROP CONSTRAINT IF EXISTS attendance_records_created_by_fkey,
  ADD CONSTRAINT attendance_records_created_by_fkey 
    FOREIGN KEY (recorded_by) REFERENCES profiles(id) ON DELETE SET NULL;

-- Step 4: Re-add department manager foreign key
ALTER TABLE departments 
  DROP CONSTRAINT IF EXISTS departments_manager_id_fkey,
  ADD CONSTRAINT departments_manager_id_fkey 
    FOREIGN KEY (manager_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Step 5: Recreate indexes with correct column names
DROP INDEX IF EXISTS idx_attendance_records_profile_id;
DROP INDEX IF EXISTS idx_attendance_records_profile_date;
DROP INDEX IF EXISTS idx_attendance_records_profile_date_unique;

CREATE INDEX IF NOT EXISTS idx_attendance_records_user_id ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_user_date ON attendance_records(user_id, date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_records_user_date_unique 
  ON attendance_records(user_id, date);

-- Step 6: Add missing columns if they don't exist
ALTER TABLE attendance_records 
  ADD COLUMN IF NOT EXISTS check_in_method TEXT DEFAULT 'manual' 
    CHECK (check_in_method IN ('biometric', 'manual', 'admin'));

ALTER TABLE attendance_records 
  ADD COLUMN IF NOT EXISTS check_out_method TEXT 
    CHECK (check_out_method IN ('biometric', 'manual', 'admin'));

ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add comments for clarity
COMMENT ON COLUMN profiles.id IS 'References auth.users(id) - Supabase auth user ID';
COMMENT ON COLUMN attendance_records.user_id IS 'References profiles(id) - Employee who this attendance record belongs to';
COMMENT ON COLUMN attendance_records.recorded_by IS 'References profiles(id) - Employee who recorded this attendance';
