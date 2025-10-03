-- Seed attendance records with dummy data for the past 7 days
-- Version 3: Updated to use user_id instead of profile_id

-- Clear existing attendance data
TRUNCATE TABLE attendance_records CASCADE;

-- Generate attendance records for the past 7 days for all employees
INSERT INTO attendance_records (user_id, date, check_in_time, check_out_time, status, check_in_method, check_out_method, recorded_by, notes)
SELECT 
  p.id as user_id,
  d.date,
  -- Check-in time: 8:00 AM to 9:30 AM (some late arrivals)
  d.date + (TIME '08:00:00' + (random() * INTERVAL '90 minutes')) as check_in_time,
  -- Check-out time: 5:00 PM to 6:30 PM
  d.date + (TIME '17:00:00' + (random() * INTERVAL '90 minutes')) as check_out_time,
  -- Status based on check-in time
  CASE 
    WHEN random() < 0.05 THEN 'absent'
    WHEN random() < 0.1 THEN 'on-leave'
    WHEN random() < 0.15 THEN 'half-day'
    WHEN EXTRACT(HOUR FROM (d.date + (TIME '08:00:00' + (random() * INTERVAL '90 minutes')))) > 9 THEN 'late'
    ELSE 'present'
  END as status,
  'biometric' as check_in_method,
  'biometric' as check_out_method,
  '00000000-0000-0000-0000-000000000001' as recorded_by, -- Admin user
  CASE 
    WHEN random() < 0.1 THEN 'Meeting with client'
    WHEN random() < 0.2 THEN 'Working from home'
    ELSE NULL
  END as notes
FROM 
  profiles p
  CROSS JOIN (
    SELECT generate_series(
      CURRENT_DATE - INTERVAL '6 days',
      CURRENT_DATE,
      INTERVAL '1 day'
    )::date as date
  ) d
WHERE 
  p.is_active = true
  AND random() > 0.05; -- 5% chance of no record (absent)
