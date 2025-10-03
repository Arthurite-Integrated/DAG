import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, TrendingUp, Clock, CheckCircle2 } from "lucide-react"
import { redirect } from "next/navigation"
import { AttendanceTrendChart } from "@/components/dashboard/attendance-trend-chart"
import { DepartmentBreakdownChart } from "@/components/dashboard/department-breakdown-chart"
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    redirect("/auth/login")
  }

  const user = data.user

  // Fetch profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  console.log("[v0] Dashboard - User profile:", profile)

  // Check if user is admin or HR - redirect to admin dashboard
  const isAdmin = profile?.role === "admin" || profile?.role === "hr"

  if (isAdmin) {
    redirect("/admin")
  }

  // Employee dashboard
  const today = new Date().toISOString().split("T")[0]
  const { data: todayAttendance } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("user_id", user.id)
    .gte("check_in_time", `${today}T00:00:00`)
    .lte("check_in_time", `${today}T23:59:59`)
    .maybeSingle()

  return (
    <div className="flex flex-col">
      <Header title="Employee Dashboard" description={`Welcome back, ${profile?.full_name || user.email}`} />
      <div className="flex-1 space-y-6 p-6">
        {/* Employee ID Display */}
        {profile?.employee_id && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#15356E]/10">
                  <Users className="h-6 w-6 text-[#15356E]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Employee ID</p>
                  <p className="text-2xl font-bold font-mono text-[#15356E]">{profile.employee_id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Status */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Status</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayAttendance ? (
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Checked In</p>
                  <p className="text-sm text-muted-foreground">Status: {todayAttendance.status}</p>
                  <p className="text-xs text-muted-foreground">
                    Check-in: {new Date(todayAttendance.check_in_time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                  <Clock className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="font-medium">Not Checked In</p>
                  <p className="text-sm text-muted-foreground">Please check in to mark your attendance</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <a
                href="/check-in"
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
              >
                <Clock className="h-5 w-5 text-[#15356E]" />
                <div>
                  <p className="font-medium">Check In/Out</p>
                  <p className="text-sm text-muted-foreground">Mark your attendance</p>
                </div>
              </a>
              
              <a
                href="/dashboard/attendance"
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
              >
                <TrendingUp className="h-5 w-5 text-[#15356E]" />
                <div>
                  <p className="font-medium">View History</p>
                  <p className="text-sm text-muted-foreground">Your attendance record</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
