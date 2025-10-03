-- Reset script to clean up any existing database objects
-- This script safely removes all objects even if some don't exist

DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on all tables
    FOR r IN (SELECT schemaname, tablename, policyname 
              FROM pg_policies 
              WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
    END LOOP;

    -- Disable RLS on all tables
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'ALTER TABLE IF EXISTS public.' || r.tablename || ' DISABLE ROW LEVEL SECURITY';
    END LOOP;

    -- Drop all triggers
    FOR r IN (SELECT trigger_name, event_object_table 
              FROM information_schema.triggers 
              WHERE trigger_schema = 'public') 
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || r.trigger_name || ' ON public.' || r.event_object_table;
    END LOOP;

END $$;

-- Drop all functions in public schema
DROP FUNCTION IF EXISTS public.get_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.log_attendance_changes() CASCADE;
DROP FUNCTION IF EXISTS public.log_correction_changes() CASCADE;

-- Drop all tables with CASCADE to handle dependencies
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.attendance_corrections CASCADE;
DROP TABLE IF EXISTS public.attendance_records CASCADE;
DROP TABLE IF EXISTS public.biometric_devices CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.departments CASCADE;

-- Also drop any tables from previous incorrect schema
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.attendance CASCADE;
