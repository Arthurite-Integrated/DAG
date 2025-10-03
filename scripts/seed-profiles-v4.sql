-- Seed profiles (employees)
-- Note: In production, these would be created through Supabase Auth
-- For testing, we're inserting directly with generated UUIDs

INSERT INTO profiles (id, full_name, email, phone, employee_id, role, department_id, is_active, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  full_name,
  email,
  phone,
  employee_id,
  role,
  (SELECT id FROM departments WHERE name = dept_name ORDER BY created_at LIMIT 1),
  true,
  now(),
  now()
FROM (VALUES
  ('John Smith', 'john.smith@company.com', '+1234567890', 'EMP001', 'admin', 'Administration'),
  ('Sarah Johnson', 'sarah.johnson@company.com', '+1234567891', 'EMP002', 'hr', 'HR'),
  ('Michael Brown', 'michael.brown@company.com', '+1234567892', 'EMP003', 'manager', 'IT'),
  ('Emily Davis', 'emily.davis@company.com', '+1234567893', 'EMP004', 'employee', 'IT'),
  ('David Wilson', 'david.wilson@company.com', '+1234567894', 'EMP005', 'employee', 'IT'),
  ('Lisa Anderson', 'lisa.anderson@company.com', '+1234567895', 'EMP006', 'manager', 'Finance'),
  ('James Taylor', 'james.taylor@company.com', '+1234567896', 'EMP007', 'employee', 'Finance'),
  ('Jennifer Martinez', 'jennifer.martinez@company.com', '+1234567897', 'EMP008', 'employee', 'Finance'),
  ('Robert Garcia', 'robert.garcia@company.com', '+1234567898', 'EMP009', 'manager', 'HR'),
  ('Mary Rodriguez', 'mary.rodriguez@company.com', '+1234567899', 'EMP010', 'employee', 'HR'),
  ('William Lee', 'william.lee@company.com', '+1234567800', 'EMP011', 'employee', 'HR'),
  ('Patricia White', 'patricia.white@company.com', '+1234567801', 'EMP012', 'manager', 'Maintenance'),
  ('Christopher Harris', 'christopher.harris@company.com', '+1234567802', 'EMP013', 'employee', 'Maintenance'),
  ('Barbara Clark', 'barbara.clark@company.com', '+1234567803', 'EMP014', 'employee', 'Maintenance'),
  ('Daniel Lewis', 'daniel.lewis@company.com', '+1234567804', 'EMP015', 'employee', 'Administration'),
  ('Susan Walker', 'susan.walker@company.com', '+1234567805', 'EMP016', 'employee', 'Administration'),
  ('Matthew Hall', 'matthew.hall@company.com', '+1234567806', 'EMP017', 'employee', 'IT'),
  ('Nancy Allen', 'nancy.allen@company.com', '+1234567807', 'EMP018', 'employee', 'Finance'),
  ('Joseph Young', 'joseph.young@company.com', '+1234567808', 'EMP019', 'employee', 'HR'),
  ('Karen King', 'karen.king@company.com', '+1234567809', 'EMP020', 'employee', 'Maintenance')
) AS t(full_name, email, phone, employee_id, role, dept_name)
ON CONFLICT (employee_id) DO NOTHING;
