-- Function to generate unique Employee ID in DAG##### format
CREATE OR REPLACE FUNCTION public.generate_employee_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_id TEXT;
  id_number INTEGER;
  max_attempts INTEGER := 100;
  attempt INTEGER := 0;
BEGIN
  LOOP
    -- Get the highest existing employee ID number
    SELECT COALESCE(
      MAX(CAST(SUBSTRING(employee_id FROM 4) AS INTEGER)), 
      0
    ) + 1 
    INTO id_number
    FROM public.profiles 
    WHERE employee_id LIKE 'DAG%' 
    AND LENGTH(employee_id) = 8
    AND SUBSTRING(employee_id FROM 4) ~ '^[0-9]+$';
    
    -- Format as DAG##### (5 digits)
    new_id := 'DAG' || LPAD(id_number::TEXT, 5, '0');
    
    -- Check if this ID already exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE employee_id = new_id) THEN
      RETURN new_id;
    END IF;
    
    -- Safety check to prevent infinite loop
    attempt := attempt + 1;
    IF attempt >= max_attempts THEN
      RAISE EXCEPTION 'Could not generate unique employee ID after % attempts', max_attempts;
    END IF;
  END LOOP;
END;
$$;

-- Updated function to automatically create profile with Employee ID
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_employee_id TEXT;
BEGIN
  -- Generate Employee ID only for employees (not admin users)
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'employee') = 'employee' THEN
    new_employee_id := public.generate_employee_id();
  ELSE
    new_employee_id := NULL;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, employee_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee'),
    new_employee_id
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    employee_id = COALESCE(profiles.employee_id, EXCLUDED.employee_id);
  
  RETURN NEW;
END;
$$;

-- Re-create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();