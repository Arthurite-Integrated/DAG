-- Clear existing profiles (except auth users)
DELETE FROM profiles WHERE id NOT IN (SELECT id FROM auth.users);

-- Insert dummy employee profiles
-- Administration Department
INSERT INTO profiles (id, email, full_name, employee_id, role, department_id, phone, is_active, created_at, updated_at)
VALUES
  ('p1111111-1111-1111-1111-111111111111', 'john.smith@company.com', 'John Smith', 'EMP001', 'admin', 'd1111111-1111-1111-1111-111111111111', '555-0101', true, NOW(), NOW()),
  ('p1111112-1111-1111-1111-111111111111', 'sarah.johnson@company.com', 'Sarah Johnson', 'EMP002', 'admin', 'd1111111-1111-1111-1111-111111111111', '555-0102', true, NOW(), NOW()),
  ('p1111113-1111-1111-1111-111111111111', 'michael.williams@company.com', 'Michael Williams', 'EMP003', 'employee', 'd1111111-1111-1111-1111-111111111111', '555-0103', true, NOW(), NOW()),
  
  -- IT Department
  ('p2222221-2222-2222-2222-222222222222', 'david.brown@company.com', 'David Brown', 'EMP004', 'employee', 'd2222222-2222-2222-2222-222222222222', '555-0104', true, NOW(), NOW()),
  ('p2222222-2222-2222-2222-222222222222', 'emily.davis@company.com', 'Emily Davis', 'EMP005', 'employee', 'd2222222-2222-2222-2222-222222222222', '555-0105', true, NOW(), NOW()),
  ('p2222223-2222-2222-2222-222222222222', 'james.miller@company.com', 'James Miller', 'EMP006', 'employee', 'd2222222-2222-2222-2222-222222222222', '555-0106', true, NOW(), NOW()),
  ('p2222224-2222-2222-2222-222222222222', 'lisa.wilson@company.com', 'Lisa Wilson', 'EMP007', 'employee', 'd2222222-2222-2222-2222-222222222222', '555-0107', true, NOW(), NOW()),
  
  -- HR Department
  ('p3333331-3333-3333-3333-333333333333', 'jennifer.moore@company.com', 'Jennifer Moore', 'EMP008', 'hr', 'd3333333-3333-3333-3333-333333333333', '555-0108', true, NOW(), NOW()),
  ('p3333332-3333-3333-3333-333333333333', 'robert.taylor@company.com', 'Robert Taylor', 'EMP009', 'hr', 'd3333333-3333-3333-3333-333333333333', '555-0109', true, NOW(), NOW()),
  ('p3333333-3333-3333-3333-333333333333', 'amanda.anderson@company.com', 'Amanda Anderson', 'EMP010', 'employee', 'd3333333-3333-3333-3333-333333333333', '555-0110', true, NOW(), NOW()),
  
  -- Finance Department
  ('p4444441-4444-4444-4444-444444444444', 'william.thomas@company.com', 'William Thomas', 'EMP011', 'employee', 'd4444444-4444-4444-4444-444444444444', '555-0111', true, NOW(), NOW()),
  ('p4444442-4444-4444-4444-444444444444', 'patricia.jackson@company.com', 'Patricia Jackson', 'EMP012', 'employee', 'd4444444-4444-4444-4444-444444444444', '555-0112', true, NOW(), NOW()),
  ('p4444443-4444-4444-4444-444444444444', 'charles.white@company.com', 'Charles White', 'EMP013', 'employee', 'd4444444-4444-4444-4444-444444444444', '555-0113', true, NOW(), NOW()),
  ('p4444444-4444-4444-4444-444444444444', 'linda.harris@company.com', 'Linda Harris', 'EMP014', 'employee', 'd4444444-4444-4444-4444-444444444444', '555-0114', true, NOW(), NOW()),
  
  -- Maintenance Department
  ('p5555551-5555-5555-5555-555555555555', 'thomas.martin@company.com', 'Thomas Martin', 'EMP015', 'employee', 'd5555555-5555-5555-5555-555555555555', '555-0115', true, NOW(), NOW()),
  ('p5555552-5555-5555-5555-555555555555', 'barbara.garcia@company.com', 'Barbara Garcia', 'EMP016', 'employee', 'd5555555-5555-5555-5555-555555555555', '555-0116', true, NOW(), NOW()),
  ('p5555553-5555-5555-5555-555555555555', 'daniel.rodriguez@company.com', 'Daniel Rodriguez', 'EMP017', 'employee', 'd5555555-5555-5555-5555-555555555555', '555-0117', true, NOW(), NOW()),
  ('p5555554-5555-5555-5555-555555555555', 'susan.martinez@company.com', 'Susan Martinez', 'EMP018', 'employee', 'd5555555-5555-5555-5555-555555555555', '555-0118', true, NOW(), NOW()),
  ('p5555555-5555-5555-5555-555555555555', 'joseph.hernandez@company.com', 'Joseph Hernandez', 'EMP019', 'employee', 'd5555555-5555-5555-5555-555555555555', '555-0119', true, NOW(), NOW()),
  ('p5555556-5555-5555-5555-555555555555', 'nancy.lopez@company.com', 'Nancy Lopez', 'EMP020', 'employee', 'd5555555-5555-5555-5555-555555555555', '555-0120', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  employee_id = EXCLUDED.employee_id,
  role = EXCLUDED.role,
  department_id = EXCLUDED.department_id,
  phone = EXCLUDED.phone,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
