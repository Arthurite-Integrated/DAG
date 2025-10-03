-- Insert sample attendance records for the past week to make dashboard interactive
-- This will create realistic attendance data for all employees

-- Helper: Generate attendance for the last 7 days
DO $$
DECLARE
  emp_record RECORD;
  day_offset INTEGER;
  check_in_hour INTEGER;
  check_in_minute INTEGER;
  check_out_hour INTEGER;
  check_out_minute INTEGER;
  attendance_status TEXT;
BEGIN
  -- Loop through each employee
  FOR emp_record IN SELECT id FROM profiles WHERE is_active = true LOOP
    -- Create attendance for last 7 days
    FOR day_offset IN 0..6 LOOP
      -- Randomize check-in time (8:00 AM to 9:30 AM)
      check_in_hour := 8 + (CASE WHEN random() > 0.7 THEN 1 ELSE 0 END);
      check_in_minute := (random() * 59)::INTEGER;
      
      -- Randomize check-out time (5:00 PM to 6:30 PM)
      check_out_hour := 17 + (CASE WHEN random() > 0.5 THEN 1 ELSE 0 END);
      check_out_minute := (random() * 59)::INTEGER;
      
      -- Determine status based on check-in time
      IF check_in_hour >= 9 THEN
        attendance_status := 'late';
      ELSE
        attendance_status := 'present';
      END IF;
      
      -- 10% chance of being absent
      IF random() > 0.9 THEN
        attendance_status := 'absent';
      END IF;
      
      -- Insert attendance record (skip if absent)
      IF attendance_status != 'absent' THEN
        INSERT INTO attendance_records (
          user_id,
          check_in_time,
          check_out_time,
          check_in_method,
          check_out_method,
          status,
          created_at,
          updated_at
        ) VALUES (
          emp_record.id,
          (CURRENT_DATE - day_offset) + (check_in_hour || ' hours ' || check_in_minute || ' minutes')::INTERVAL,
          (CURRENT_DATE - day_offset) + (check_out_hour || ' hours ' || check_out_minute || ' minutes')::INTERVAL,
          'biometric',
          'biometric',
          attendance_status,
          NOW(),
          NOW()
        )
        ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  END LOOP;
END $$;
