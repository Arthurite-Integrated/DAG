-- Insert attendance records for the past 30 days with varied statuses
INSERT INTO attendance (id, student_id, date, status, recorded_by, notes, created_at, updated_at)
SELECT
  gen_random_uuid(),
  s.id,
  d.date,
  CASE 
    WHEN random() < 0.85 THEN 'present'
    WHEN random() < 0.92 THEN 'late'
    ELSE 'absent'
  END,
  'p2222222-2222-2222-2222-222222222222',
  CASE 
    WHEN random() < 0.1 THEN 'Excused absence - medical appointment'
    WHEN random() < 0.2 THEN 'Late due to transportation'
    ELSE NULL
  END,
  d.date + TIME '08:00:00',
  d.date + TIME '08:00:00'
FROM 
  (SELECT id FROM students WHERE status = 'active') s
CROSS JOIN 
  (SELECT generate_series(CURRENT_DATE - INTERVAL '29 days', CURRENT_DATE, '1 day')::date AS date) d
WHERE 
  EXTRACT(DOW FROM d.date) NOT IN (0, 6) -- Exclude weekends
ON CONFLICT DO NOTHING;

-- Add some specific patterns for realistic data
-- Student with perfect attendance
INSERT INTO attendance (id, student_id, date, status, recorded_by, created_at, updated_at)
SELECT
  gen_random_uuid(),
  's1111111-1111-1111-1111-111111111111',
  d.date,
  'present',
  'p2222222-2222-2222-2222-222222222222',
  d.date + TIME '08:00:00',
  d.date + TIME '08:00:00'
FROM 
  (SELECT generate_series(CURRENT_DATE - INTERVAL '29 days', CURRENT_DATE, '1 day')::date AS date) d
WHERE 
  EXTRACT(DOW FROM d.date) NOT IN (0, 6)
ON CONFLICT DO NOTHING;

-- Student with frequent absences
INSERT INTO attendance (id, student_id, date, status, recorded_by, notes, created_at, updated_at)
SELECT
  gen_random_uuid(),
  's3333333-3333-3333-3333-333333333333',
  d.date,
  CASE WHEN random() < 0.4 THEN 'absent' ELSE 'present' END,
  'p2222222-2222-2222-2222-222222222222',
  CASE WHEN random() < 0.4 THEN 'Chronic illness' ELSE NULL END,
  d.date + TIME '08:00:00',
  d.date + TIME '08:00:00'
FROM 
  (SELECT generate_series(CURRENT_DATE - INTERVAL '29 days', CURRENT_DATE, '1 day')::date AS date) d
WHERE 
  EXTRACT(DOW FROM d.date) NOT IN (0, 6)
ON CONFLICT DO NOTHING;
