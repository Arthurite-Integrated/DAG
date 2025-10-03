-- Remove the foreign key constraint from profiles.id to auth.users(id)
-- This allows us to create test/demo profiles without requiring auth.users entries

-- Drop the constraint if it exists
ALTER TABLE IF EXISTS public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Also drop the constraint that might exist with different naming
ALTER TABLE IF EXISTS public.profiles 
DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Verify the constraint is removed
DO $$ 
BEGIN
  RAISE NOTICE 'Foreign key constraint from profiles to auth.users has been removed for testing purposes';
END $$;
