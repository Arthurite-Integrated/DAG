-- Simple direct insert of employees without complex logic
-- This script adds 30 test employees with unique IDs

-- Insert employees for IT Department
INSERT INTO profiles (id, email, full_name, employee_id, role, department_id, phone, is_active)
SELECT 
  gen_random_uuid(),
  'emp' || series || '@dagindustries.com',
  CASE 
    WHEN series % 5 = 1 THEN 'John Doe ' || series
    WHEN series % 5 = 2 THEN 'Jane Smith ' || series
    WHEN series % 5 = 3 THEN 'Mike Johnson ' || series
    WHEN series % 5 = 4 THEN 'Sarah Williams ' || series
    ELSE 'David Brown ' || series
  END,
  'EMP' || LPAD(series::text, 4, '0'),
  CASE 
    WHEN series <= 2 THEN 'hr'
    WHEN series <= 8 THEN 'employee'
    ELSE 'employee'
  END,
  (SELECT id FROM departments WHERE name = 'IT' LIMIT 1),
  '+234-' || LPAD((8000000000 + series)::text, 10, '0'),
  true
FROM generate_series(2001, 2010) AS series;

-- Insert employees for HR Department
INSERT INTO profiles (id, email, full_name, employee_id, role, department_id, phone, is_active)
SELECT 
  gen_random_uuid(),
  'hr' || series || '@dagindustries.com',
  'HR Staff ' || series,
  'EMP' || LPAD(series::text, 4, '0'),
  'hr',
  (SELECT id FROM departments WHERE name = 'HR' LIMIT 1),
  '+234-' || LPAD((8000000000 + series)::text, 10, '0'),
  true
FROM generate_series(3001, 3005) AS series;

-- Insert employees for Finance Department
INSERT INTO profiles (id, email, full_name, employee_id, role, department_id, phone, is_active)
SELECT 
  gen_random_uuid(),
  'finance' || series || '@dagindustries.com',
  'Finance Staff ' || series,
  'EMP' || LPAD(series::text, 4, '0'),
  'employee',
  (SELECT id FROM departments WHERE name = 'Finance' LIMIT 1),
  '+234-' || LPAD((8000000000 + series)::text, 10, '0'),
  true
FROM generate_series(4001, 4008) AS series;

-- Insert employees for Operations Department
INSERT INTO profiles (id, email, full_name, employee_id, role, department_id, phone, is_active)
SELECT 
  gen_random_uuid(),
  'ops' || series || '@dagindustries.com',
  'Operations Staff ' || series,
  'EMP' || LPAD(series::text, 4, '0'),
  'employee',
  (SELECT id FROM departments WHERE name = 'Operations' LIMIT 1),
  '+234-' || LPAD((8000000000 + series)::text, 10, '0'),
  true
FROM generate_series(5001, 5007) AS series;
