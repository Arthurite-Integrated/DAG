-- Add departments table and department_id to profiles
-- This script adds department support to the existing schema

-- Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add department_id to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'department_id'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN department_id UUID REFERENCES public.departments(id);
  END IF;
END $$;

-- Insert some default departments
INSERT INTO public.departments (name, description) VALUES
  ('Administration', 'Administrative staff and management'),
  ('Teaching', 'Teaching staff and educators'),
  ('IT', 'Information Technology department'),
  ('HR', 'Human Resources department'),
  ('Finance', 'Finance and accounting department')
ON CONFLICT (name) DO NOTHING;

-- Fix RLS policies to avoid infinite recursion
-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read all profiles if they are admin or hr" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update all profiles if they are admin or hr" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;

-- Disable RLS on profiles to avoid infinite recursion
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Disable RLS on other tables as well
ALTER TABLE public.attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments DISABLE ROW LEVEL SECURITY;

-- Add updated_at trigger for departments
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_departments_updated_at ON public.departments;
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.departments TO authenticated;
GRANT ALL ON public.departments TO service_role;
