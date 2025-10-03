import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { redirect } from "next/navigation"
import { DepartmentList } from "@/components/departments/department-list"

export default async function DepartmentsPage() {
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

  const { data: departments } = await supabase.from("departments").select("*").order("name")

  const { data: employees } = await supabase.from("profiles").select("id, full_name").order("full_name")

  return (
    <div className="flex flex-col">
      <Header title="Departments" description="Manage company departments" />

      <div className="flex-1 p-6">
        <DepartmentList departments={departments || []} employees={employees || []} currentUserRole={profile.role} />
      </div>
    </div>
  )
}
