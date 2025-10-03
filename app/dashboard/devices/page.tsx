import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { redirect } from "next/navigation"
import { DeviceList } from "@/components/devices/device-list"

export default async function DevicesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Only admin can access this page
  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  const { data: devices } = await supabase.from("biometric_devices").select("*").order("device_name")

  return (
    <div className="flex flex-col">
      <Header title="Device Management" description="Manage biometric devices and scanners" />

      <div className="flex-1 p-6">
        <DeviceList devices={devices || []} />
      </div>
    </div>
  )
}
