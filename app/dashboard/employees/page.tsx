import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { redirect } from "next/navigation"
import { EmployeeList } from "@/components/employees/employee-list"

export default async function EmployeesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Only admin and HR can access this page
  if (profile?.role !== "admin" && profile?.role !== "hr") {
    redirect("/dashboard")
  }

  // Fetch employees with department info
  const { data: employees } = await supabase
    .from("profiles")
    .select(
      `
      *,
      departments (
        id,
        name
      )
    `,
    )
    .order("full_name")

  // Fetch departments for the form
  const { data: departments } = await supabase.from("departments").select("*").order("name")

  return (
    <div className="flex flex-col">
      <Header title="Employee Management" description="Manage employee accounts and information" />

      <div className="flex-1 p-6">
        <EmployeeList employees={employees || []} departments={departments || []} currentUserRole={profile.role} />
      </div>
    </div>
  )
}
