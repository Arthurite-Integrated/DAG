-- Seed departments
INSERT INTO departments (id, name, description, manager_id, is_active, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Administration', 'Administrative and executive management', NULL, true, now(), now()),
  (gen_random_uuid(), 'IT', 'Information Technology and Systems', NULL, true, now(), now()),
  (gen_random_uuid(), 'HR', 'Human Resources', NULL, true, now(), now()),
  (gen_random_uuid(), 'Finance', 'Finance and Accounting', NULL, true, now(), now()),
  (gen_random_uuid(), 'Maintenance', 'Facilities and Maintenance', NULL, true, now(), now())
ON CONFLICT DO NOTHING;
