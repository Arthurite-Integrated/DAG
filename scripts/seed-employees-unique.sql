-- Seed script with unique employee IDs
-- This script safely adds employees by first cleaning up any existing test data

-- Step 1: Delete existing test employees (keep only EMP001 which is the admin)
DELETE FROM attendance_records 
WHERE user_id IN (
  SELECT id FROM profiles WHERE employee_id != 'EMP001'
);

DELETE FROM profiles WHERE employee_id != 'EMP001';

-- Step 2: Get department IDs for reference
DO $$
DECLARE
  dept_hr UUID;
  dept_it UUID;
  dept_sales UUID;
  dept_ops UUID;
  dept_finance UUID;
BEGIN
  -- Get department IDs
  SELECT id INTO dept_hr FROM departments WHERE name = 'Human Resources' LIMIT 1;
  SELECT id INTO dept_it FROM departments WHERE name = 'IT' LIMIT 1;
  SELECT id INTO dept_sales FROM departments WHERE name = 'Sales' LIMIT 1;
  SELECT id INTO dept_ops FROM departments WHERE name = 'Operations' LIMIT 1;
  SELECT id INTO dept_finance FROM departments WHERE name = 'Finance' LIMIT 1;

  -- Insert 40 unique employees with guaranteed unique employee_ids
  -- HR Department (8 employees)
  INSERT INTO profiles (id, employee_id, full_name, email, phone, role, department_id, created_at) VALUES
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Sarah Johnson', 'sarah.johnson@company.com', '+1-555-0101', 'hr', dept_hr, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Michael Chen', 'michael.chen@company.com', '+1-555-0102', 'hr', dept_hr, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Emily Rodriguez', 'emily.rodriguez@company.com', '+1-555-0103', 'employee', dept_hr, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'David Kim', 'david.kim@company.com', '+1-555-0104', 'employee', dept_hr, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Jessica Martinez', 'jessica.martinez@company.com', '+1-555-0105', 'employee', dept_hr, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Robert Taylor', 'robert.taylor@company.com', '+1-555-0106', 'employee', dept_hr, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Amanda White', 'amanda.white@company.com', '+1-555-0107', 'employee', dept_hr, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'James Anderson', 'james.anderson@company.com', '+1-555-0108', 'employee', dept_hr, NOW());

  -- IT Department (10 employees)
  INSERT INTO profiles (id, employee_id, full_name, email, phone, role, department_id, created_at) VALUES
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Alex Thompson', 'alex.thompson@company.com', '+1-555-0201', 'manager', dept_it, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Maria Garcia', 'maria.garcia@company.com', '+1-555-0202', 'employee', dept_it, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Kevin Lee', 'kevin.lee@company.com', '+1-555-0203', 'employee', dept_it, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Lisa Wang', 'lisa.wang@company.com', '+1-555-0204', 'employee', dept_it, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Daniel Brown', 'daniel.brown@company.com', '+1-555-0205', 'employee', dept_it, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Sophie Miller', 'sophie.miller@company.com', '+1-555-0206', 'employee', dept_it, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Ryan Davis', 'ryan.davis@company.com', '+1-555-0207', 'employee', dept_it, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Emma Wilson', 'emma.wilson@company.com', '+1-555-0208', 'employee', dept_it, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Chris Moore', 'chris.moore@company.com', '+1-555-0209', 'employee', dept_it, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Olivia Taylor', 'olivia.taylor@company.com', '+1-555-0210', 'employee', dept_it, NOW());

  -- Sales Department (10 employees)
  INSERT INTO profiles (id, employee_id, full_name, email, phone, role, department_id, created_at) VALUES
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'John Smith', 'john.smith@company.com', '+1-555-0301', 'manager', dept_sales, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Rachel Green', 'rachel.green@company.com', '+1-555-0302', 'employee', dept_sales, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Tom Harris', 'tom.harris@company.com', '+1-555-0303', 'employee', dept_sales, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Nina Patel', 'nina.patel@company.com', '+1-555-0304', 'employee', dept_sales, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Mark Johnson', 'mark.johnson@company.com', '+1-555-0305', 'employee', dept_sales, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Laura Martinez', 'laura.martinez@company.com', '+1-555-0306', 'employee', dept_sales, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Steve Clark', 'steve.clark@company.com', '+1-555-0307', 'employee', dept_sales, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Jennifer Lopez', 'jennifer.lopez@company.com', '+1-555-0308', 'employee', dept_sales, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Paul Walker', 'paul.walker@company.com', '+1-555-0309', 'employee', dept_sales, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Michelle Obama', 'michelle.obama@company.com', '+1-555-0310', 'employee', dept_sales, NOW());

  -- Operations Department (7 employees)
  INSERT INTO profiles (id, employee_id, full_name, email, phone, role, department_id, created_at) VALUES
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Brian Wilson', 'brian.wilson@company.com', '+1-555-0401', 'manager', dept_ops, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Catherine Lee', 'catherine.lee@company.com', '+1-555-0402', 'employee', dept_ops, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'George Martin', 'george.martin@company.com', '+1-555-0403', 'employee', dept_ops, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Hannah Scott', 'hannah.scott@company.com', '+1-555-0404', 'employee', dept_ops, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Ian Cooper', 'ian.cooper@company.com', '+1-555-0405', 'employee', dept_ops, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Julia Roberts', 'julia.roberts@company.com', '+1-555-0406', 'employee', dept_ops, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Kyle Adams', 'kyle.adams@company.com', '+1-555-0407', 'employee', dept_ops, NOW());

  -- Finance Department (5 employees)
  INSERT INTO profiles (id, employee_id, full_name, email, phone, role, department_id, created_at) VALUES
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Linda Chen', 'linda.chen@company.com', '+1-555-0501', 'manager', dept_finance, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Nathan Brooks', 'nathan.brooks@company.com', '+1-555-0502', 'employee', dept_finance, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Patricia Hill', 'patricia.hill@company.com', '+1-555-0503', 'employee', dept_finance, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Quinn Foster', 'quinn.foster@company.com', '+1-555-0504', 'employee', dept_finance, NOW()),
  (gen_random_uuid(), 'EMP' || LPAD((FLOOR(RANDOM() * 9000) + 1000)::TEXT, 4, '0'), 'Rebecca Turner', 'rebecca.turner@company.com', '+1-555-0505', 'employee', dept_finance, NOW());

  -- Now add attendance records for the last 7 days for all employees
  -- Get the admin user ID for recorded_by
  DECLARE
    admin_id UUID;
    emp_record RECORD;
    day_offset INT;
    attendance_date DATE;
    random_val FLOAT;
  BEGIN
    SELECT id INTO admin_id FROM profiles WHERE employee_id = 'EMP001' LIMIT 1;

    -- Loop through each employee (except admin)
    FOR emp_record IN SELECT id FROM profiles WHERE employee_id != 'EMP001' LOOP
      -- Create attendance for last 7 days
      FOR day_offset IN 0..6 LOOP
        attendance_date := CURRENT_DATE - day_offset;
        random_val := RANDOM();

        -- 80% present, 15% late, 5% absent
        IF random_val < 0.80 THEN
          -- Present - check in between 8:00-9:00, check out between 17:00-18:00
          INSERT INTO attendance_records (user_id, date, status, check_in_time, check_out_time, recorded_by)
          VALUES (
            emp_record.id,
            attendance_date,
            'present',
            attendance_date + TIME '08:00:00' + (RANDOM() * INTERVAL '1 hour'),
            attendance_date + TIME '17:00:00' + (RANDOM() * INTERVAL '1 hour'),
            admin_id
          );
        ELSIF random_val < 0.95 THEN
          -- Late - check in between 9:15-10:00, check out between 17:00-18:00
          INSERT INTO attendance_records (user_id, date, status, check_in_time, check_out_time, recorded_by)
          VALUES (
            emp_record.id,
            attendance_date,
            'late',
            attendance_date + TIME '09:15:00' + (RANDOM() * INTERVAL '45 minutes'),
            attendance_date + TIME '17:00:00' + (RANDOM() * INTERVAL '1 hour'),
            admin_id
          );
        -- 5% absent (no record inserted)
        END IF;
      END LOOP;
    END LOOP;
  END;
END $$;
