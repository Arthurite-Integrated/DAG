-- Clear existing departments and insert new ones
DELETE FROM departments;

-- Insert the requested departments
INSERT INTO departments (id, name, description, is_active, created_at, updated_at)
VALUES
  ('d1111111-1111-1111-1111-111111111111', 'Administration', 'Administrative and executive management department', true, NOW(), NOW()),
  ('d2222222-2222-2222-2222-222222222222', 'IT', 'Information Technology and systems department', true, NOW(), NOW()),
  ('d3333333-3333-3333-3333-333333333333', 'HR', 'Human Resources and personnel management department', true, NOW(), NOW()),
  ('d4444444-4444-4444-4444-444444444444', 'Finance', 'Finance and accounting department', true, NOW(), NOW()),
  ('d5555555-5555-5555-5555-555555555555', 'Maintenance', 'Facilities and maintenance department', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
