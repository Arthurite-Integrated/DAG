-- Insert default departments
INSERT INTO public.departments (name, description) VALUES
  ('Engineering', 'Engineering and Development Team'),
  ('Human Resources', 'HR and People Operations'),
  ('Operations', 'Operations and Manufacturing'),
  ('Sales', 'Sales and Business Development'),
  ('Finance', 'Finance and Accounting')
ON CONFLICT (name) DO NOTHING;

-- Insert sample biometric devices
INSERT INTO public.biometric_devices (device_id, device_name, location, device_type, ip_address) VALUES
  ('DEV-001', 'Main Entrance Scanner', 'Building A - Main Entrance', 'fingerprint', '192.168.1.101'),
  ('DEV-002', 'Office Floor Scanner', 'Building A - 2nd Floor', 'face_recognition', '192.168.1.102'),
  ('DEV-003', 'Warehouse Scanner', 'Warehouse - Entry Gate', 'card_reader', '192.168.1.103')
ON CONFLICT (device_id) DO NOTHING;
