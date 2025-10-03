-- Direct insert of 30 test employees
-- Get department IDs first
WITH dept_ids AS (
  SELECT 
    id,
    name,
    ROW_NUMBER() OVER (ORDER BY name) as rn
  FROM departments
  LIMIT 5
)
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  employee_id,
  department_id,
  phone,
  is_active,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  'employee' || n || '@company.com',
  CASE 
    WHEN n <= 6 THEN (ARRAY['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson', 'Lisa Anderson'])[n]
    WHEN n <= 12 THEN (ARRAY['James Taylor', 'Jennifer Martinez', 'Robert Garcia', 'Mary Rodriguez', 'William Lee', 'Patricia White'])[n-6]
    WHEN n <= 18 THEN (ARRAY['Christopher Harris', 'Linda Clark', 'Daniel Lewis', 'Barbara Walker', 'Matthew Hall', 'Susan Allen'])[n-12]
    WHEN n <= 24 THEN (ARRAY['Joseph Young', 'Jessica King', 'Thomas Wright', 'Nancy Lopez', 'Charles Hill', 'Karen Scott'])[n-18]
    ELSE (ARRAY['Mark Green', 'Betty Adams', 'Donald Baker', 'Helen Nelson', 'Paul Carter', 'Sandra Mitchell'])[n-24]
  END,
  CASE 
    WHEN n % 10 = 0 THEN 'hr'
    WHEN n % 7 = 0 THEN 'manager'
    ELSE 'employee'
  END,
  'EMP' || LPAD((1000 + n)::text, 4, '0'),
  (SELECT id FROM dept_ids WHERE rn = ((n - 1) % 5) + 1),
  '+234' || LPAD((8000000000 + n * 12345)::text, 10, '0'),
  true,
  NOW() - (n || ' days')::interval,
  NOW()
FROM generate_series(1, 30) AS n;

-- Verify insertion
SELECT COUNT(*) as total_employees FROM profiles;
