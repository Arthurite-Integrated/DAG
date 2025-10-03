-- Seed attendance records for the past 7 days
-- Generate realistic attendance data

DO $$
DECLARE
  emp_record RECORD;
  day_offset INTEGER;
  check_in_hour INTEGER;
  check_out_hour INTEGER;
  attendance_status TEXT;
  current_date DATE;
BEGIN
  -- Loop through each employee
  FOR emp_record IN SELECT id, employee_id FROM profiles WHERE is_active = true
  LOOP
    -- Generate attendance for past 7 days
    FOR day_offset IN 0..6
    LOOP
      current_date := CURRENT_DATE - day_offset;
      
      -- 85% chance of being present, 10% late, 5% absent
      IF random() < 0.85 THEN
        -- Present - check in between 8:00 and 9:00
        check_in_hour := 8;
        attendance_status := 'present';
      ELSIF random() < 0.95 THEN
        -- Late - check in between 9:01 and 10:00
        check_in_hour := 9 + floor(random() * 2)::INTEGER;
        attendance_status := 'late';
      ELSE
        -- Absent - no check in
        attendance_status := 'absent';
        check_in_hour := NULL;
      END IF;
      
      -- Check out between 17:00 and 18:00 if present or late
      IF attendance_status != 'absent' THEN
        check_out_hour := 17 + floor(random() * 2)::INTEGER;
        
        INSERT INTO attendance_records (
          id,
          user_id,
          date,
          check_in_time,
          check_out_time,
          status,
          check_in_method,
          check_out_method,
          recorded_by,
          created_at,
          updated_at
        ) VALUES (
          gen_random_uuid(),
          emp_record.id,
          current_date,
          current_date + (check_in_hour || ' hours')::INTERVAL + (floor(random() * 60) || ' minutes')::INTERVAL,
          current_date + (check_out_hour || ' hours')::INTERVAL + (floor(random() * 60) || ' minutes')::INTERVAL,
          attendance_status,
          'manual',
          'manual',
          emp_record.id,
          now(),
          now()
        );
      ELSE
        -- Absent record
        INSERT INTO attendance_records (
          id,
          user_id,
          date,
          check_in_time,
          check_out_time,
          status,
          recorded_by,
          created_at,
          updated_at
        ) VALUES (
          gen_random_uuid(),
          emp_record.id,
          current_date,
          NULL,
          NULL,
          attendance_status,
          emp_record.id,
          now(),
          now()
        );
      END IF;
    END LOOP;
  END LOOP;
END $$;
