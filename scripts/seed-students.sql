-- Insert students
INSERT INTO students (id, student_id, first_name, last_name, email, phone, grade_level, section, status, created_by, created_at, updated_at)
VALUES
  ('s1111111-1111-1111-1111-111111111111', 'STU001', 'Alex', 'Anderson', 'alex.anderson@student.edu', '555-0101', 'Grade 10', 'A', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('s2222222-2222-2222-2222-222222222222', 'STU002', 'Emma', 'Martinez', 'emma.martinez@student.edu', '555-0102', 'Grade 10', 'A', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('s3333333-3333-3333-3333-333333333333', 'STU003', 'Oliver', 'Garcia', 'oliver.garcia@student.edu', '555-0103', 'Grade 10', 'B', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('s4444444-4444-4444-4444-444444444444', 'STU004', 'Sophia', 'Rodriguez', 'sophia.rodriguez@student.edu', '555-0104', 'Grade 10', 'B', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('s5555555-5555-5555-5555-555555555555', 'STU005', 'Liam', 'Hernandez', 'liam.hernandez@student.edu', '555-0105', 'Grade 11', 'A', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('s6666666-6666-6666-6666-666666666666', 'STU006', 'Ava', 'Lopez', 'ava.lopez@student.edu', '555-0106', 'Grade 11', 'A', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('s7777777-7777-7777-7777-777777777777', 'STU007', 'Noah', 'Gonzalez', 'noah.gonzalez@student.edu', '555-0107', 'Grade 11', 'B', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('s8888888-8888-8888-8888-888888888888', 'STU008', 'Isabella', 'Wilson', 'isabella.wilson@student.edu', '555-0108', 'Grade 11', 'B', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('s9999999-9999-9999-9999-999999999999', 'STU009', 'Ethan', 'Anderson', 'ethan.anderson@student.edu', '555-0109', 'Grade 12', 'A', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('sa111111-1111-1111-1111-111111111111', 'STU010', 'Mia', 'Thomas', 'mia.thomas@student.edu', '555-0110', 'Grade 12', 'A', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('sb111111-1111-1111-1111-111111111111', 'STU011', 'James', 'Taylor', 'james.taylor@student.edu', '555-0111', 'Grade 12', 'B', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('sc111111-1111-1111-1111-111111111111', 'STU012', 'Charlotte', 'Moore', 'charlotte.moore@student.edu', '555-0112', 'Grade 12', 'B', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('sd111111-1111-1111-1111-111111111111', 'STU013', 'Benjamin', 'Jackson', 'benjamin.jackson@student.edu', '555-0113', 'Grade 9', 'A', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('se111111-1111-1111-1111-111111111111', 'STU014', 'Amelia', 'Martin', 'amelia.martin@student.edu', '555-0114', 'Grade 9', 'A', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('sf111111-1111-1111-1111-111111111111', 'STU015', 'Lucas', 'Lee', 'lucas.lee@student.edu', '555-0115', 'Grade 9', 'B', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('sg111111-1111-1111-1111-111111111111', 'STU016', 'Harper', 'Perez', 'harper.perez@student.edu', '555-0116', 'Grade 9', 'B', 'inactive', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('sh111111-1111-1111-1111-111111111111', 'STU017', 'Mason', 'White', 'mason.white@student.edu', '555-0117', 'Grade 10', 'A', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('si111111-1111-1111-1111-111111111111', 'STU018', 'Evelyn', 'Harris', 'evelyn.harris@student.edu', '555-0118', 'Grade 10', 'B', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('sj111111-1111-1111-1111-111111111111', 'STU019', 'Logan', 'Clark', 'logan.clark@student.edu', '555-0119', 'Grade 11', 'A', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('sk111111-1111-1111-1111-111111111111', 'STU020', 'Abigail', 'Lewis', 'abigail.lewis@student.edu', '555-0120', 'Grade 11', 'B', 'active', 'p1111111-1111-1111-1111-111111111111', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
