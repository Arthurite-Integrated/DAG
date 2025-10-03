export type UserRole = "admin" | "hr" | "employee"

export type AttendanceStatus = "present" | "late" | "absent" | "half_day" | "on_leave"

export type CheckInMethod = "biometric" | "manual" | "admin"

export type CorrectionStatus = "pending" | "approved" | "rejected"

export type DeviceType = "fingerprint" | "face_recognition" | "card_reader"

export interface Profile {
  id: string
  email: string
  full_name: string
  employee_id: string | null
  role: UserRole
  department_id: string | null
  phone: string | null
  avatar_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  name: string
  description: string | null
  manager_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BiometricDevice {
  id: string
  device_id: string
  device_name: string
  location: string
  device_type: DeviceType
  ip_address: string | null
  is_active: boolean
  last_sync: string | null
  created_at: string
  updated_at: string
}

export interface AttendanceRecord {
  id: string
  user_id: string
  check_in_time: string
  check_out_time: string | null
  check_in_method: CheckInMethod
  check_out_method: CheckInMethod | null
  device_id: string | null
  status: AttendanceStatus
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface AttendanceCorrection {
  id: string
  attendance_id: string
  user_id: string
  requested_by: string
  original_check_in: string | null
  original_check_out: string | null
  corrected_check_in: string | null
  corrected_check_out: string | null
  reason: string
  status: CorrectionStatus
  reviewed_by: string | null
  reviewed_at: string | null
  review_notes: string | null
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}
