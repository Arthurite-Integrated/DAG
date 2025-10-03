-- Fix the profiles_role_check constraint
-- This script drops the existing constraint and recreates it with the correct allowed values

-- Drop the existing constraint if it exists
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add the correct role check constraint
-- Allowed roles: admin, hr, manager, employee
ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'hr', 'manager', 'employee'));

-- Verify the constraint was added
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conname = 'profiles_role_check';
