-- Insert departments
INSERT INTO departments (id, name, description, created_at, updated_at)
VALUES
  ('d1111111-1111-1111-1111-111111111111', 'Computer Science', 'Department of Computer Science and Information Technology', NOW(), NOW()),
  ('d2222222-2222-2222-2222-222222222222', 'Mathematics', 'Department of Mathematics and Statistics', NOW(), NOW()),
  ('d3333333-3333-3333-3333-333333333333', 'English', 'Department of English Language and Literature', NOW(), NOW()),
  ('d4444444-4444-4444-4444-444444444444', 'Science', 'Department of Natural Sciences', NOW(), NOW()),
  ('d5555555-5555-5555-5555-555555555555', 'History', 'Department of History and Social Studies', NOW(), NOW()),
  ('d6666666-6666-6666-6666-666666666666', 'Physical Education', 'Department of Physical Education and Sports', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
