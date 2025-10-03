import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { redirect } from "next/navigation"
import { ReportsView } from "@/components/reports/reports-view"

export default async function ReportsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.role !== "admin" && profile?.role !== "hr") {
    redirect("/dashboard")
  }

  // Fetch all employees for filtering
  const { data: employees } = await supabase.from("profiles").select("id, full_name, employee_id").order("full_name")

  // Fetch departments for filtering
  const { data: departments } = await supabase.from("departments").select("*").order("name")

  return (
    <div className="flex flex-col">
      <Header title="Reports & Analytics" description="View attendance reports and analytics" />

      <div className="flex-1 p-6">
        <ReportsView employees={employees || []} departments={departments || []} />
      </div>
    </div>
  )
}
