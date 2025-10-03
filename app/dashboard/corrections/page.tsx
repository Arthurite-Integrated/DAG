import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { redirect } from "next/navigation"
import { CorrectionsView } from "@/components/corrections/corrections-view"

export default async function CorrectionsPage() {
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

  // Fetch corrections based on role
  let correctionsQuery = supabase
    .from("attendance_corrections")
    .select(
      `
      *,
      attendance_records (*),
      profiles!attendance_corrections_user_id_fkey (full_name, employee_id),
      requester:profiles!attendance_corrections_requested_by_fkey (full_name),
      reviewer:profiles!attendance_corrections_reviewed_by_fkey (full_name)
    `,
    )
    .order("created_at", { ascending: false })

  // Employees only see their own corrections
  if (profile.role === "employee") {
    correctionsQuery = correctionsQuery.eq("user_id", user.id)
  }

  const { data: corrections } = await correctionsQuery

  // Fetch user's attendance records for creating corrections
  const { data: attendanceRecords } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("user_id", user.id)
    .order("check_in_time", { ascending: false })
    .limit(30)

  return (
    <div className="flex flex-col">
      <Header title="Attendance Corrections" description="Request and manage attendance corrections" />

      <div className="flex-1 p-6">
        <CorrectionsView
          profile={profile}
          corrections={corrections || []}
          attendanceRecords={attendanceRecords || []}
        />
      </div>
    </div>
  )
}
