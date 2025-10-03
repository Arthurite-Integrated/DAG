import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // If table doesn't exist, redirect to setup page
  if (error && error.code === "PGRST204") {
    redirect("/setup")
  }

  if (!profile) {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar profile={profile} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
