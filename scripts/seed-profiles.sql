-- Insert staff profiles
INSERT INTO profiles (id, email, full_name, role, department_id, created_at, updated_at)
VALUES
  ('p1111111-1111-1111-1111-111111111111', 'admin@school.edu', 'Sarah Johnson', 'admin', 'd1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('p2222222-2222-2222-2222-222222222222', 'john.smith@school.edu', 'John Smith', 'teacher', 'd1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('p3333333-3333-3333-3333-333333333333', 'emily.davis@school.edu', 'Emily Davis', 'teacher', 'd2222222-2222-2222-2222-222222222222', NOW(), NOW()),
  ('p4444444-4444-4444-4444-444444444444', 'michael.brown@school.edu', 'Michael Brown', 'teacher', 'd3333333-3333-3333-3333-333333333333', NOW(), NOW()),
  ('p5555555-5555-5555-5555-555555555555', 'lisa.wilson@school.edu', 'Lisa Wilson', 'teacher', 'd4444444-4444-4444-4444-444444444444', NOW(), NOW()),
  ('p6666666-6666-6666-6666-666666666666', 'david.moore@school.edu', 'David Moore', 'teacher', 'd5555555-5555-5555-5555-555555555555', NOW(), NOW()),
  ('p7777777-7777-7777-7777-777777777777', 'jennifer.taylor@school.edu', 'Jennifer Taylor', 'staff', 'd6666666-6666-6666-6666-666666666666', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
