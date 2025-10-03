-- Seed profiles (employees) with dummy data
-- Version 3: Updated to work with proper auth.users integration

-- Note: In a real application, profiles would be created when users sign up via Supabase Auth
-- For testing purposes, we'll insert directly into profiles table
-- WARNING: This assumes you have corresponding auth.users records or RLS is disabled for testing

-- Clear existing data
TRUNCATE TABLE profiles CASCADE;

-- Insert dummy employees
-- Note: Using deterministic UUIDs for testing (in production, these would come from auth.users)
INSERT INTO profiles (id, email, full_name, employee_id, role, department_id, phone, is_active) VALUES
-- Administration Department
('00000000-0000-0000-0000-000000000001', 'john.smith@company.com', 'John Smith', 'EMP001', 'admin', 
  (SELECT id FROM departments WHERE name = 'Administration'), '+1-555-0101', true),
('00000000-0000-0000-0000-000000000002', 'sarah.johnson@company.com', 'Sarah Johnson', 'EMP002', 'hr', 
  (SELECT id FROM departments WHERE name = 'Administration'), '+1-555-0102', true),
('00000000-0000-0000-0000-000000000003', 'michael.brown@company.com', 'Michael Brown', 'EMP003', 'employee', 
  (SELECT id FROM departments WHERE name = 'Administration'), '+1-555-0103', true),
('00000000-0000-0000-0000-000000000004', 'emily.davis@company.com', 'Emily Davis', 'EMP004', 'employee', 
  (SELECT id FROM departments WHERE name = 'Administration'), '+1-555-0104', true),

-- IT Department
('00000000-0000-0000-0000-000000000005', 'david.wilson@company.com', 'David Wilson', 'EMP005', 'employee', 
  (SELECT id FROM departments WHERE name = 'IT'), '+1-555-0105', true),
('00000000-0000-0000-0000-000000000006', 'jennifer.martinez@company.com', 'Jennifer Martinez', 'EMP006', 'employee', 
  (SELECT id FROM departments WHERE name = 'IT'), '+1-555-0106', true),
('00000000-0000-0000-0000-000000000007', 'robert.garcia@company.com', 'Robert Garcia', 'EMP007', 'employee', 
  (SELECT id FROM departments WHERE name = 'IT'), '+1-555-0107', true),
('00000000-0000-0000-0000-000000000008', 'lisa.rodriguez@company.com', 'Lisa Rodriguez', 'EMP008', 'employee', 
  (SELECT id FROM departments WHERE name = 'IT'), '+1-555-0108', true),

-- HR Department
('00000000-0000-0000-0000-000000000009', 'james.hernandez@company.com', 'James Hernandez', 'EMP009', 'hr', 
  (SELECT id FROM departments WHERE name = 'HR'), '+1-555-0109', true),
('00000000-0000-0000-0000-000000000010', 'patricia.lopez@company.com', 'Patricia Lopez', 'EMP010', 'hr', 
  (SELECT id FROM departments WHERE name = 'HR'), '+1-555-0110', true),
('00000000-0000-0000-0000-000000000011', 'william.gonzalez@company.com', 'William Gonzalez', 'EMP011', 'employee', 
  (SELECT id FROM departments WHERE name = 'HR'), '+1-555-0111', true),
('00000000-0000-0000-0000-000000000012', 'mary.wilson@company.com', 'Mary Wilson', 'EMP012', 'employee', 
  (SELECT id FROM departments WHERE name = 'HR'), '+1-555-0112', true),

-- Finance Department
('00000000-0000-0000-0000-000000000013', 'charles.anderson@company.com', 'Charles Anderson', 'EMP013', 'employee', 
  (SELECT id FROM departments WHERE name = 'Finance'), '+1-555-0113', true),
('00000000-0000-0000-0000-000000000014', 'barbara.thomas@company.com', 'Barbara Thomas', 'EMP014', 'employee', 
  (SELECT id FROM departments WHERE name = 'Finance'), '+1-555-0114', true),
('00000000-0000-0000-0000-000000000015', 'joseph.taylor@company.com', 'Joseph Taylor', 'EMP015', 'employee', 
  (SELECT id FROM departments WHERE name = 'Finance'), '+1-555-0115', true),
('00000000-0000-0000-0000-000000000016', 'susan.moore@company.com', 'Susan Moore', 'EMP016', 'employee', 
  (SELECT id FROM departments WHERE name = 'Finance'), '+1-555-0116', true),

-- Maintenance Department
('00000000-0000-0000-0000-000000000017', 'thomas.jackson@company.com', 'Thomas Jackson', 'EMP017', 'employee', 
  (SELECT id FROM departments WHERE name = 'Maintenance'), '+1-555-0117', true),
('00000000-0000-0000-0000-000000000018', 'karen.white@company.com', 'Karen White', 'EMP018', 'employee', 
  (SELECT id FROM departments WHERE name = 'Maintenance'), '+1-555-0118', true),
('00000000-0000-0000-0000-000000000019', 'daniel.harris@company.com', 'Daniel Harris', 'EMP019', 'employee', 
  (SELECT id FROM departments WHERE name = 'Maintenance'), '+1-555-0119', true),
('00000000-0000-0000-0000-000000000020', 'nancy.martin@company.com', 'Nancy Martin', 'EMP020', 'employee', 
  (SELECT id FROM departments WHERE name = 'Maintenance'), '+1-555-0120', true);

-- Update department managers
UPDATE departments SET manager_id = '00000000-0000-0000-0000-000000000001' WHERE name = 'Administration';
UPDATE departments SET manager_id = '00000000-0000-0000-0000-000000000005' WHERE name = 'IT';
UPDATE departments SET manager_id = '00000000-0000-0000-0000-000000000009' WHERE name = 'HR';
UPDATE departments SET manager_id = '00000000-0000-0000-0000-000000000013' WHERE name = 'Finance';
UPDATE departments SET manager_id = '00000000-0000-0000-0000-000000000017' WHERE name = 'Maintenance';
