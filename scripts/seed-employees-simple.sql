-- Simple seed script to add 40 employees
-- This script uses straightforward INSERTs without complex logic

-- Get existing department IDs (assuming they exist from previous seeds)
-- Engineering: should be first department
-- HR: should be second department  
-- Sales: should be third department
-- Marketing: should be fourth department
-- Operations: should be fifth department

-- Insert 40 employees with unique IDs starting from EMP100
INSERT INTO profiles (id, email, full_name, role, department_id, employee_id, phone, is_active)
SELECT 
  gen_random_uuid(),
  'employee' || n || '@dagattendance.com',
  CASE 
    WHEN n % 10 = 1 THEN 'John Doe ' || n
    WHEN n % 10 = 2 THEN 'Jane Smith ' || n
    WHEN n % 10 = 3 THEN 'Michael Johnson ' || n
    WHEN n % 10 = 4 THEN 'Emily Williams ' || n
    WHEN n % 10 = 5 THEN 'David Brown ' || n
    WHEN n % 10 = 6 THEN 'Sarah Davis ' || n
    WHEN n % 10 = 7 THEN 'James Wilson ' || n
    WHEN n % 10 = 8 THEN 'Lisa Anderson ' || n
    WHEN n % 10 = 9 THEN 'Robert Taylor ' || n
    ELSE 'Jennifer Martinez ' || n
  END,
  CASE 
    WHEN n % 15 = 0 THEN 'hr'
    WHEN n % 10 = 0 THEN 'manager'
    ELSE 'employee'
  END,
  (SELECT id FROM departments ORDER BY created_at LIMIT 1 OFFSET (n % 5)),
  'EMP' || LPAD((100 + n)::text, 3, '0'),
  '+234' || LPAD((8000000000 + n * 12345)::text, 10, '0'),
  true
FROM generate_series(1, 40) AS n;

-- Add attendance records for the new employees for the last 7 days
INSERT INTO attendance_records (user_id, date, check_in, check_out, status, recorded_by)
SELECT 
  p.id,
  CURRENT_DATE - day_offset,
  -- Check-in time (8:00 AM to 9:30 AM)
  (CURRENT_DATE - day_offset + TIME '08:00:00' + (random() * INTERVAL '90 minutes'))::timestamp,
  -- Check-out time (5:00 PM to 6:30 PM)
  (CURRENT_DATE - day_offset + TIME '17:00:00' + (random() * INTERVAL '90 minutes'))::timestamp,
  -- Status based on check-in time
  CASE 
    WHEN random() < 0.1 THEN 'absent'
    WHEN random() < 0.25 THEN 'late'
    ELSE 'present'
  END,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
FROM profiles p
CROSS JOIN generate_series(0, 6) AS day_offset
WHERE p.employee_id LIKE 'EMP1%'
AND p.employee_id != 'EMP001';
