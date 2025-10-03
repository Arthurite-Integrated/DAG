-- Comprehensive seed script for attendance system
-- This script populates the database with realistic dummy data
-- Run this after departments are created

-- First, let's add more employee profiles
-- We'll create 15 employees across different departments and roles

DO $$
DECLARE
    dept_ids uuid[];
    admin_id uuid;
    hr_id uuid;
    manager1_id uuid;
    manager2_id uuid;
    manager3_id uuid;
BEGIN
    -- Get existing department IDs
    SELECT ARRAY_AGG(id) INTO dept_ids FROM departments LIMIT 5;
    
    -- Create HR Manager
    INSERT INTO profiles (id, email, full_name, role, employee_id, department_id, phone, is_active)
    VALUES (
        gen_random_uuid(),
        'hr.manager@company.com',
        'Sarah Johnson',
        'hr',
        'EMP002',
        dept_ids[1], -- Assign to first department (HR)
        '+1234567890',
        true
    ) RETURNING id INTO hr_id;
    
    -- Create Department Managers
    INSERT INTO profiles (id, email, full_name, role, employee_id, department_id, phone, is_active)
    VALUES (
        gen_random_uuid(),
        'john.smith@company.com',
        'John Smith',
        'manager',
        'EMP003',
        dept_ids[2], -- Engineering
        '+1234567891',
        true
    ) RETURNING id INTO manager1_id;
    
    INSERT INTO profiles (id, email, full_name, role, employee_id, department_id, phone, is_active)
    VALUES (
        gen_random_uuid(),
        'emily.davis@company.com',
        'Emily Davis',
        'manager',
        'EMP004',
        dept_ids[3], -- Sales
        '+1234567892',
        true
    ) RETURNING id INTO manager2_id;
    
    INSERT INTO profiles (id, email, full_name, role, employee_id, department_id, phone, is_active)
    VALUES (
        gen_random_uuid(),
        'michael.brown@company.com',
        'Michael Brown',
        'manager',
        'EMP005',
        dept_ids[4], -- Marketing
        '+1234567893',
        true
    ) RETURNING id INTO manager3_id;
    
    -- Update departments with manager IDs
    UPDATE departments SET manager_id = hr_id WHERE id = dept_ids[1];
    UPDATE departments SET manager_id = manager1_id WHERE id = dept_ids[2];
    UPDATE departments SET manager_id = manager2_id WHERE id = dept_ids[3];
    UPDATE departments SET manager_id = manager3_id WHERE id = dept_ids[4];
    
    -- Create regular employees
    -- Engineering team (5 employees)
    INSERT INTO profiles (id, email, full_name, role, employee_id, department_id, phone, is_active)
    VALUES 
        (gen_random_uuid(), 'alex.wilson@company.com', 'Alex Wilson', 'employee', 'EMP006', dept_ids[2], '+1234567894', true),
        (gen_random_uuid(), 'lisa.anderson@company.com', 'Lisa Anderson', 'employee', 'EMP007', dept_ids[2], '+1234567895', true),
        (gen_random_uuid(), 'david.martinez@company.com', 'David Martinez', 'employee', 'EMP008', dept_ids[2], '+1234567896', true),
        (gen_random_uuid(), 'sophia.garcia@company.com', 'Sophia Garcia', 'employee', 'EMP009', dept_ids[2], '+1234567897', true),
        (gen_random_uuid(), 'james.rodriguez@company.com', 'James Rodriguez', 'employee', 'EMP010', dept_ids[2], '+1234567898', true);
    
    -- Sales team (4 employees)
    INSERT INTO profiles (id, email, full_name, role, employee_id, department_id, phone, is_active)
    VALUES 
        (gen_random_uuid(), 'olivia.lee@company.com', 'Olivia Lee', 'employee', 'EMP011', dept_ids[3], '+1234567899', true),
        (gen_random_uuid(), 'william.taylor@company.com', 'William Taylor', 'employee', 'EMP012', dept_ids[3], '+1234567900', true),
        (gen_random_uuid(), 'emma.thomas@company.com', 'Emma Thomas', 'employee', 'EMP013', dept_ids[3], '+1234567901', true),
        (gen_random_uuid(), 'noah.white@company.com', 'Noah White', 'employee', 'EMP014', dept_ids[3], '+1234567902', true);
    
    -- Marketing team (3 employees)
    INSERT INTO profiles (id, email, full_name, role, employee_id, department_id, phone, is_active)
    VALUES 
        (gen_random_uuid(), 'ava.harris@company.com', 'Ava Harris', 'employee', 'EMP015', dept_ids[4], '+1234567903', true),
        (gen_random_uuid(), 'liam.clark@company.com', 'Liam Clark', 'employee', 'EMP016', dept_ids[4], '+1234567904', true),
        (gen_random_uuid(), 'mia.lewis@company.com', 'Mia Lewis', 'employee', 'EMP017', dept_ids[4], '+1234567905', true);
    
    -- HR team (2 employees)
    INSERT INTO profiles (id, email, full_name, role, employee_id, department_id, phone, is_active)
    VALUES 
        (gen_random_uuid(), 'ethan.walker@company.com', 'Ethan Walker', 'employee', 'EMP018', dept_ids[1], '+1234567906', true),
        (gen_random_uuid(), 'isabella.hall@company.com', 'Isabella Hall', 'employee', 'EMP019', dept_ids[1], '+1234567907', true);
    
    -- Support team (2 employees)
    INSERT INTO profiles (id, email, full_name, role, employee_id, department_id, phone, is_active)
    VALUES 
        (gen_random_uuid(), 'mason.allen@company.com', 'Mason Allen', 'employee', 'EMP020', dept_ids[5], '+1234567908', true),
        (gen_random_uuid(), 'charlotte.young@company.com', 'Charlotte Young', 'employee', 'EMP021', dept_ids[5], '+1234567909', true);

END $$;

-- Now create attendance records for the past 7 days
-- We'll create realistic attendance patterns with some variations

DO $$
DECLARE
    employee_record RECORD;
    day_offset INT;
    check_in_hour INT;
    check_in_minute INT;
    check_out_hour INT;
    check_out_minute INT;
    attendance_date DATE;
    recorder_id uuid;
    attendance_status TEXT;
BEGIN
    -- Get a recorder ID (use the HR manager)
    SELECT id INTO recorder_id FROM profiles WHERE role = 'hr' LIMIT 1;
    
    -- Loop through each employee
    FOR employee_record IN SELECT id, employee_id FROM profiles WHERE role IN ('employee', 'manager', 'hr') LOOP
        -- Create attendance for the past 7 days
        FOR day_offset IN 0..6 LOOP
            -- Using attendance_date variable instead of current_date
            attendance_date := CURRENT_DATE - day_offset;
            
            -- Skip weekends (Saturday = 6, Sunday = 0)
            IF EXTRACT(DOW FROM attendance_date) NOT IN (0, 6) THEN
                -- Randomize check-in time (8-9 AM with variations)
                check_in_hour := 8 + (RANDOM() * 2)::INT; -- 8-9 AM
                check_in_minute := (RANDOM() * 60)::INT;
                
                -- Randomize check-out time (5-6 PM with variations)
                check_out_hour := 17 + (RANDOM() * 2)::INT; -- 5-6 PM
                check_out_minute := (RANDOM() * 60)::INT;
                
                -- Determine status based on check-in time
                IF check_in_hour < 9 OR (check_in_hour = 9 AND check_in_minute = 0) THEN
                    attendance_status := 'present';
                ELSIF check_in_hour = 9 AND check_in_minute <= 15 THEN
                    attendance_status := 'present';
                ELSE
                    attendance_status := 'late';
                END IF;
                
                -- 5% chance of being absent
                IF RANDOM() < 0.05 THEN
                    attendance_status := 'absent';
                END IF;
                
                -- Insert attendance record
                IF attendance_status != 'absent' THEN
                    -- Using attendance_date variable in INSERT statements
                    INSERT INTO attendance_records (
                        id,
                        user_id,
                        date,
                        check_in_time,
                        check_out_time,
                        status,
                        check_in_method,
                        check_out_method,
                        recorded_by,
                        notes
                    ) VALUES (
                        gen_random_uuid(),
                        employee_record.id,
                        attendance_date,
                        attendance_date + (check_in_hour || ' hours ' || check_in_minute || ' minutes')::INTERVAL,
                        attendance_date + (check_out_hour || ' hours ' || check_out_minute || ' minutes')::INTERVAL,
                        attendance_status,
                        CASE WHEN RANDOM() < 0.7 THEN 'biometric' ELSE 'manual' END,
                        CASE WHEN RANDOM() < 0.7 THEN 'biometric' ELSE 'manual' END,
                        recorder_id,
                        CASE 
                            WHEN attendance_status = 'late' THEN 'Arrived late due to traffic'
                            ELSE NULL
                        END
                    );
                ELSE
                    -- Record absence
                    INSERT INTO attendance_records (
                        id,
                        user_id,
                        date,
                        status,
                        recorded_by,
                        notes
                    ) VALUES (
                        gen_random_uuid(),
                        employee_record.id,
                        attendance_date,
                        'absent',
                        recorder_id,
                        'Sick leave'
                    );
                END IF;
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- Verify the data
SELECT 'Profiles created:' as info, COUNT(*) as count FROM profiles;
SELECT 'Attendance records created:' as info, COUNT(*) as count FROM attendance_records;
SELECT 'Departments with managers:' as info, COUNT(*) as count FROM departments WHERE manager_id IS NOT NULL;
