DO $$
DECLARE
    dept_ids UUID[];
    dept_id UUID;
    emp_id UUID;
    emp_counter INTEGER := 100; -- Start from EMP100 to avoid conflicts
    i INTEGER;
BEGIN
    -- Get all department IDs
    SELECT ARRAY_AGG(id) INTO dept_ids FROM departments;
    
    -- Insert 40 employees with unique IDs starting from EMP100
    FOR i IN 1..40 LOOP
        dept_id := dept_ids[1 + (i % array_length(dept_ids, 1))];
        emp_id := gen_random_uuid();
        
        INSERT INTO profiles (
            id,
            employee_id,
            full_name,
            email,
            phone,
            role,
            department_id,
            is_active,
            created_at,
            updated_at
        ) VALUES (
            emp_id,
            'EMP' || LPAD(emp_counter::TEXT, 3, '0'), -- EMP100, EMP101, etc.
            CASE (i % 20)
                WHEN 0 THEN 'Michael Chen'
                WHEN 1 THEN 'Sarah Williams'
                WHEN 2 THEN 'David Martinez'
                WHEN 3 THEN 'Emily Taylor'
                WHEN 4 THEN 'James Anderson'
                WHEN 5 THEN 'Jessica Thomas'
                WHEN 6 THEN 'Robert Jackson'
                WHEN 7 THEN 'Maria Garcia'
                WHEN 8 THEN 'Christopher White'
                WHEN 9 THEN 'Amanda Harris'
                WHEN 10 THEN 'Daniel Martin'
                WHEN 11 THEN 'Lisa Thompson'
                WHEN 12 THEN 'Matthew Moore'
                WHEN 13 THEN 'Jennifer Lee'
                WHEN 14 THEN 'Andrew Clark'
                WHEN 15 THEN 'Michelle Lewis'
                WHEN 16 THEN 'Joshua Walker'
                WHEN 17 THEN 'Elizabeth Hall'
                WHEN 18 THEN 'Ryan Allen'
                ELSE 'Nicole Young'
            END,
            'emp' || emp_counter || '@company.com',
            '+234' || LPAD((8000000000 + emp_counter)::TEXT, 10, '0'),
            CASE 
                WHEN i % 10 = 0 THEN 'manager'
                WHEN i % 15 = 0 THEN 'hr'
                ELSE 'employee'
            END,
            dept_id,
            true,
            NOW(),
            NOW()
        );
        
        emp_counter := emp_counter + 1;
    END LOOP;
    
    RAISE NOTICE '40 employees added successfully with IDs EMP100-EMP139';
END $$;
