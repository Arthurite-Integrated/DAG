"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Building2, TrendingUp, CheckCircle2, Clock, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { AdminMetricsChart } from "@/components/dashboard/admin-metrics-chart"
import { RecentEmployeesTable } from "@/components/dashboard/recent-employees-table"

interface DashboardStats {
  totalEmployees: number
  newEmployeesThisMonth: number
  totalDepartments: number
  todayAttendance: number
  attendanceRate: number
  activeEmployees: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    newEmployeesThisMonth: 0,
    totalDepartments: 0,
    todayAttendance: 0,
    attendanceRate: 0,
    activeEmployees: 0,
  })
  const [recentEmployees, setRecentEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is admin
    const isStaticAdmin = localStorage.getItem("isStaticAdmin") === "true"
    if (!isStaticAdmin) {
      // Redirect non-admin users
      window.location.href = "/dashboard"
      return
    }

    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const supabase = createClient()
      const today = new Date().toISOString().split("T")[0]
      const thisMonth = new Date().toISOString().slice(0, 7) // YYYY-MM

      // Fetch dashboard statistics
      const [
        { count: totalEmployees },
        { count: totalDepartments },
        recentSignupsResult,
        { data: todayAttendanceData },
        activeEmployeesResult,
        { data: latestEmployees },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("departments").select("*", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", `${thisMonth}-01T00:00:00`),
        supabase
          .from("attendance_records")
          .select("*")
          .gte("check_in_time", `${today}T00:00:00`)
          .lte("check_in_time", `${today}T23:59:59`),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
      ])

      const presentToday = todayAttendanceData?.filter((a) => a.status === "present").length || 0
      const attendanceRate = totalEmployees ? Math.round((presentToday / totalEmployees) * 100) : 0

      setStats({
        totalEmployees: totalEmployees || 0,
        newEmployeesThisMonth: recentSignupsResult?.count || 0,
        totalDepartments: totalDepartments || 0,
        todayAttendance: todayAttendanceData?.length || 0,
        attendanceRate,
        activeEmployees: activeEmployeesResult?.count || 0,
      })

      setRecentEmployees(latestEmployees || [])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="border-b bg-background/95 p-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">System Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">{stats.activeEmployees} active</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{stats.newEmployeesThisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">Recent signups</p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.todayAttendance} checked in
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDepartments}</div>
              <p className="text-xs text-muted-foreground mt-1">Active departments</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <AdminMetricsChart />
          <RecentEmployeesTable employees={recentEmployees} />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <a
                href="/admin/employees/create"
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
              >
                <UserPlus className="h-5 w-5 text-[#15356E]" />
                <div>
                  <p className="font-medium">Add New Employee</p>
                  <p className="text-sm text-muted-foreground">Create employee account</p>
                </div>
              </a>
              
              <a
                href="/admin/departments"
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
              >
                <Building2 className="h-5 w-5 text-[#15356E]" />
                <div>
                  <p className="font-medium">Manage Departments</p>
                  <p className="text-sm text-muted-foreground">Department settings</p>
                </div>
              </a>
              
              <a
                href="/admin/reports"
                className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
              >
                <TrendingUp className="h-5 w-5 text-[#15356E]" />
                <div>
                  <p className="font-medium">View Reports</p>
                  <p className="text-sm text-muted-foreground">Attendance analytics</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}