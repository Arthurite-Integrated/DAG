import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { redirect } from "next/navigation"
import { SettingsView } from "@/components/settings/settings-view"

export default async function SettingsPage() {
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

  return (
    <div className="flex flex-col">
      <Header title="Settings" description="Manage your account settings" />

      <div className="flex-1 p-6">
        <SettingsView profile={profile} />
      </div>
    </div>
  )
}
