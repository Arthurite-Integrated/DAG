-- Add more dummy employees to the database
-- This script adds 40 additional employees across all departments

DO $$
DECLARE
  dept_ids UUID[];
  dept_id UUID;
  emp_count INT := 0;
  first_names TEXT[] := ARRAY['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Emma', 'Robert', 'Olivia', 
                                'William', 'Ava', 'Richard', 'Sophia', 'Joseph', 'Isabella', 'Thomas', 'Mia', 'Charles', 'Charlotte',
                                'Daniel', 'Amelia', 'Matthew', 'Harper', 'Anthony', 'Evelyn', 'Mark', 'Abigail', 'Donald', 'Emily',
                                'Steven', 'Elizabeth', 'Paul', 'Sofia', 'Andrew', 'Avery', 'Joshua', 'Ella', 'Kenneth', 'Scarlett'];
  last_names TEXT[] := ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                              'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
                              'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
                              'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'];
  roles TEXT[] := ARRAY['employee', 'employee', 'employee', 'employee', 'manager', 'employee', 'employee', 'employee'];
  new_profile_id UUID;
BEGIN
  -- Get all department IDs
  SELECT ARRAY_AGG(id) INTO dept_ids FROM departments;
  
  -- Add 40 employees
  FOR i IN 1..40 LOOP
    -- Cycle through departments
    dept_id := dept_ids[(i % array_length(dept_ids, 1)) + 1];
    
    -- Generate employee
    INSERT INTO profiles (
      id,
      email,
      full_name,
      role,
      department_id,
      employee_id,
      phone,
      is_active,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      lower(first_names[(i % array_length(first_names, 1)) + 1] || '.' || last_names[(i % array_length(last_names, 1)) + 1] || i || '@company.com'),
      first_names[(i % array_length(first_names, 1)) + 1] || ' ' || last_names[(i % array_length(last_names, 1)) + 1],
      roles[(i % array_length(roles, 1)) + 1],
      dept_id,
      'EMP' || LPAD((i + 1)::TEXT, 3, '0'),
      '+1-555-' || LPAD((1000 + i)::TEXT, 4, '0'),
      true,
      NOW() - (random() * INTERVAL '90 days'),
      NOW()
    )
    RETURNING id INTO new_profile_id;
    
    emp_count := emp_count + 1;
  END LOOP;
  
  RAISE NOTICE 'Added % new employees', emp_count;
END $$;
