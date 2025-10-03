"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { TrendingUp, Users, Building2, Calendar, ArrowLeft, Download } from "lucide-react"

interface AnalyticsData {
  totalEmployees: number
  activeEmployees: number
  totalDepartments: number
  monthlyGrowth: number
  attendanceRate: number
  averageWorkingDays: number
  topDepartment: string
  recentTrends: Array<{
    month: string
    employees: number
    attendance: number
  }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    const isStaticAdmin = localStorage.getItem("isStaticAdmin") === "true"
    if (!isStaticAdmin) {
      window.location.href = "/dashboard"
      return
    }

    loadAnalytics()
  }, [selectedPeriod])

  const loadAnalytics = async () => {
    try {
      const supabase = createClient()
      
      // Get current date ranges
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      
      // Fetch various analytics data
      const [
        { count: totalEmployees },
        { count: activeEmployees },
        { count: totalDepartments },
        { data: recentAttendance },
        { data: departments },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("departments").select("*", { count: "exact", head: true }),
        supabase
          .from("attendance_records")
          .select("*")
          .gte("check_in_time", thirtyDaysAgo.toISOString()),
        supabase.from("departments").select("*"),
      ])

      // Calculate metrics
      const monthlyGrowth = 15 // Placeholder calculation
      const attendanceRate = recentAttendance ? 
        Math.round((recentAttendance.filter(r => r.status === 'present').length / recentAttendance.length) * 100) : 0
      const averageWorkingDays = 22 // Standard working days
      const topDepartment = departments?.[0]?.name || "N/A"

      // Mock trend data for visualization
      const recentTrends = [
        { month: "Aug", employees: (totalEmployees || 0) - 5, attendance: 92 },
        { month: "Sep", employees: (totalEmployees || 0) - 2, attendance: 94 },
        { month: "Oct", employees: totalEmployees || 0, attendance: attendanceRate },
      ]

      setAnalytics({
        totalEmployees: totalEmployees || 0,
        activeEmployees: activeEmployees || 0,
        totalDepartments: totalDepartments || 0,
        monthlyGrowth,
        attendanceRate,
        averageWorkingDays,
        topDepartment,
        recentTrends,
      })
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="border-b bg-background/95 p-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Insights and trends for your organization</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+{analytics?.monthlyGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.activeEmployees}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.totalEmployees && analytics?.activeEmployees ? 
                  Math.round((analytics.activeEmployees / analytics.totalEmployees) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">Last 30 days average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalDepartments}</div>
              <p className="text-xs text-muted-foreground">Top: {analytics?.topDepartment}</p>
            </CardContent>
          </Card>
        </div>

        {/* Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Trends</CardTitle>
            <CardDescription>Employee growth and attendance trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Interactive charts coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Trend data: {analytics?.recentTrends.map(t => t.month).join(", ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Attendance rates by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Human Resources</span>
                  <span className="text-sm font-medium">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Engineering</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sales</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Marketing</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Insights</CardTitle>
              <CardDescription>Key observations from your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">High Attendance Rate</p>
                    <p className="text-xs text-muted-foreground">
                      Your organization maintains an excellent {analytics?.attendanceRate}% attendance rate
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Steady Growth</p>
                    <p className="text-xs text-muted-foreground">
                      Employee count has grown by {analytics?.monthlyGrowth}% this month
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Active Workforce</p>
                    <p className="text-xs text-muted-foreground">
                      {analytics?.activeEmployees} out of {analytics?.totalEmployees} employees are active
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}