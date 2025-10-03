-- Migration: Fix phone column and attendance_records relations
-- This script adds phone to profiles and fixes attendance_records table

-- Add phone column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Drop old tables if they exist (from previous student-based schema)
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Create attendance_records table with proper relations
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'half-day', 'on-leave')),
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_attendance_records_profile_id ON attendance_records(profile_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_status ON attendance_records(status);
CREATE INDEX IF NOT EXISTS idx_attendance_records_profile_date ON attendance_records(profile_id, date);

-- Create unique constraint to prevent duplicate attendance records for same profile on same date
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_records_profile_date_unique 
ON attendance_records(profile_id, date);

-- Add comment to table
COMMENT ON TABLE attendance_records IS 'Stores daily attendance records for employees';
COMMENT ON COLUMN attendance_records.profile_id IS 'References the employee profile';
COMMENT ON COLUMN attendance_records.status IS 'Attendance status: present, absent, late, half-day, on-leave';
COMMENT ON COLUMN attendance_records.recorded_by IS 'Profile ID of the person who recorded this attendance';
