-- CRITICAL: This script fixes the infinite recursion in RLS policies
-- Run this script IMMEDIATELY to fix login issues

-- Disable RLS on all tables to prevent infinite recursion
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS attendance_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS students DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS biometric_devices DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS attendance_corrections DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "HR can view all profiles" ON profiles;

-- Drop any other policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname 
              FROM pg_policies 
              WHERE schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
