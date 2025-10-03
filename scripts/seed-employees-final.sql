-- Disable RLS on profiles table to allow inserts
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Delete existing test employees (keep only EMP001 admin)
DELETE FROM attendance_records WHERE user_id IN (
    SELECT id FROM profiles WHERE employee_id != 'EMP001'
);
DELETE FROM profiles WHERE employee_id != 'EMP001';

-- Insert 40 employees across departments
-- IT Department (8 employees)
INSERT INTO profiles (id, employee_id, full_name, email, phone, role, department_id, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    'EMP' || (1000 + generate_series)::text,
    CASE generate_series
        WHEN 1 THEN 'John Smith'
        WHEN 2 THEN 'Sarah Johnson'
        WHEN 3 THEN 'Michael Brown'
        WHEN 4 THEN 'Emily Davis'
        WHEN 5 THEN 'David Wilson'
        WHEN 6 THEN 'Jessica Martinez'
        WHEN 7 THEN 'James Anderson'
        WHEN 8 THEN 'Jennifer Taylor'
    END,
    'employee' || (1000 + generate_series)::text || '@company.com',
    '+234' || (8000000000 + generate_series * 111111)::text,
    CASE WHEN generate_series = 1 THEN 'manager' ELSE 'employee' END,
    (SELECT id FROM departments WHERE name = 'IT' LIMIT 1),
    NOW(),
    NOW()
FROM generate_series(1, 8);

-- HR Department (8 employees)
INSERT INTO profiles (id, employee_id, full_name, email, phone, role, department_id, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    'EMP' || (1010 + generate_series)::text,
    CASE generate_series
        WHEN 1 THEN 'Robert Thomas'
        WHEN 2 THEN 'Linda Jackson'
        WHEN 3 THEN 'William White'
        WHEN 4 THEN 'Barbara Harris'
        WHEN 5 THEN 'Richard Martin'
        WHEN 6 THEN 'Susan Thompson'
        WHEN 7 THEN 'Joseph Garcia'
        WHEN 8 THEN 'Karen Martinez'
    END,
    'employee' || (1010 + generate_series)::text || '@company.com',
    '+234' || (8100000000 + generate_series * 111111)::text,
    CASE WHEN generate_series = 1 THEN 'hr' ELSE 'employee' END,
    (SELECT id FROM departments WHERE name = 'HR' LIMIT 1),
    NOW(),
    NOW()
FROM generate_series(1, 8);

-- Finance Department (8 employees)
INSERT INTO profiles (id, employee_id, full_name, email, phone, role, department_id, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    'EMP' || (1020 + generate_series)::text,
    CASE generate_series
        WHEN 1 THEN 'Charles Robinson'
        WHEN 2 THEN 'Nancy Clark'
        WHEN 3 THEN 'Daniel Rodriguez'
        WHEN 4 THEN 'Betty Lewis'
        WHEN 5 THEN 'Matthew Lee'
        WHEN 6 THEN 'Dorothy Walker'
        WHEN 7 THEN 'Anthony Hall'
        WHEN 8 THEN 'Sandra Allen'
    END,
    'employee' || (1020 + generate_series)::text || '@company.com',
    '+234' || (8200000000 + generate_series * 111111)::text,
    CASE WHEN generate_series = 1 THEN 'manager' ELSE 'employee' END,
    (SELECT id FROM departments WHERE name = 'Finance' LIMIT 1),
    NOW(),
    NOW()
FROM generate_series(1, 8);

-- Operations Department (8 employees)
INSERT INTO profiles (id, employee_id, full_name, email, phone, role, department_id, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    'EMP' || (1030 + generate_series)::text,
    CASE generate_series
        WHEN 1 THEN 'Mark Young'
        WHEN 2 THEN 'Lisa Hernandez'
        WHEN 3 THEN 'Donald King'
        WHEN 4 THEN 'Ashley Wright'
        WHEN 5 THEN 'Steven Lopez'
        WHEN 6 THEN 'Kimberly Hill'
        WHEN 7 THEN 'Paul Scott'
        WHEN 8 THEN 'Donna Green'
    END,
    'employee' || (1030 + generate_series)::text || '@company.com',
    '+234' || (8300000000 + generate_series * 111111)::text,
    CASE WHEN generate_series = 1 THEN 'manager' ELSE 'employee' END,
    (SELECT id FROM departments WHERE name = 'Operations' LIMIT 1),
    NOW(),
    NOW()
FROM generate_series(1, 8);

-- Sales Department (8 employees)
INSERT INTO profiles (id, employee_id, full_name, email, phone, role, department_id, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    'EMP' || (1040 + generate_series)::text,
    CASE generate_series
        WHEN 1 THEN 'Kenneth Adams'
        WHEN 2 THEN 'Michelle Baker'
        WHEN 3 THEN 'Edward Nelson'
        WHEN 4 THEN 'Carol Carter'
        WHEN 5 THEN 'Brian Mitchell'
        WHEN 6 THEN 'Amanda Perez'
        WHEN 7 THEN 'George Roberts'
        WHEN 8 THEN 'Melissa Turner'
    END,
    'employee' || (1040 + generate_series)::text || '@company.com',
    '+234' || (8400000000 + generate_series * 111111)::text,
    CASE WHEN generate_series = 1 THEN 'manager' ELSE 'employee' END,
    (SELECT id FROM departments WHERE name = 'Sales' LIMIT 1),
    NOW(),
    NOW()
FROM generate_series(1, 8);

-- Update departments with managers
UPDATE departments SET manager_id = (SELECT id FROM profiles WHERE employee_id = 'EMP1001' LIMIT 1) WHERE name = 'IT';
UPDATE departments SET manager_id = (SELECT id FROM profiles WHERE employee_id = 'EMP1011' LIMIT 1) WHERE name = 'HR';
UPDATE departments SET manager_id = (SELECT id FROM profiles WHERE employee_id = 'EMP1021' LIMIT 1) WHERE name = 'Finance';
UPDATE departments SET manager_id = (SELECT id FROM profiles WHERE employee_id = 'EMP1031' LIMIT 1) WHERE name = 'Operations';
UPDATE departments SET manager_id = (SELECT id FROM profiles WHERE employee_id = 'EMP1041' LIMIT 1) WHERE name = 'Sales';

-- Create attendance records for the last 7 days for all employees
INSERT INTO attendance_records (id, user_id, date, check_in, check_out, status, recorded_by, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    p.id,
    CURRENT_DATE - day_offset,
    -- Check-in time (8:00 AM to 9:30 AM)
    (CURRENT_DATE - day_offset + TIME '08:00:00' + (random() * INTERVAL '90 minutes'))::timestamp,
    -- Check-out time (5:00 PM to 6:30 PM)
    (CURRENT_DATE - day_offset + TIME '17:00:00' + (random() * INTERVAL '90 minutes'))::timestamp,
    -- Status: 80% present, 15% late, 5% absent
    CASE 
        WHEN random() < 0.05 THEN 'absent'
        WHEN random() < 0.20 THEN 'late'
        ELSE 'present'
    END,
    (SELECT id FROM profiles WHERE employee_id = 'EMP001' LIMIT 1),
    NOW(),
    NOW()
FROM profiles p
CROSS JOIN generate_series(0, 6) AS day_offset
WHERE p.employee_id != 'EMP001';

-- Re-enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
