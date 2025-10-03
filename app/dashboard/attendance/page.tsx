import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { redirect } from "next/navigation"
import { AttendanceView } from "@/components/attendance/attendance-view"

export default async function AttendancePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Fetch attendance records for the current user
  const { data: attendanceRecords } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30)

  // Fetch biometric devices for check-in
  // const { data: devices } = await supabase.from("biometric_devices").select("*").eq("is_active", true)

  return (
    <div className="flex flex-col">
      <Header title="My Attendance" description="Track your attendance and check-in/out" />

      <div className="flex-1 p-6">
        <AttendanceView
          profile={profile}
          attendanceRecords={attendanceRecords || []}
          devices={[]}
          isAdminView={false}
        />
      </div>
    </div>
  )
}
