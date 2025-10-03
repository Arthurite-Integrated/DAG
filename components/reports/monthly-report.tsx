"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Search } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Profile, Department } from "@/lib/types"

interface MonthlyReportProps {
  employees: Pick<Profile, "id" | "full_name" | "employee_id">[]
  departments: Department[]
}

export function MonthlyReport({ employees, departments }: MonthlyReportProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<{
    summary: { present: number; late: number; absent: number; onLeave: number }
    chartData: { date: string; present: number; late: number; absent: number }[]
  } | null>(null)

  const [filters, setFilters] = useState({
    month: new Date().toISOString().slice(0, 7),
    departmentId: "all", // Updated default value to "all"
  })

  const handleGenerateReport = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const [year, month] = filters.month.split("-")
      const startDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)
      const endDate = new Date(Number.parseInt(year), Number.parseInt(month), 0, 23, 59, 59)

      const query = supabase
        .from("attendance_records")
        .select(
          `
          *,
          profiles!attendance_records_user_id_fkey (
            department_id
          )
        `,
        )
        .gte("check_in_time", startDate.toISOString())
        .lte("check_in_time", endDate.toISOString())

      const { data, error } = await query

      if (error) throw error

      // Filter by department if selected
      let filteredData = data
      if (filters.departmentId !== "all") {
        // Updated condition to check for "all"
        filteredData = data.filter((record: { profiles?: { department_id?: string } }) => {
          return record.profiles?.department_id === filters.departmentId
        })
      }

      // Calculate summary
      const summary = {
        present: filteredData.filter((r: { status: string }) => r.status === "present").length,
        late: filteredData.filter((r: { status: string }) => r.status === "late").length,
        absent: filteredData.filter((r: { status: string }) => r.status === "absent").length,
        onLeave: filteredData.filter((r: { status: string }) => r.status === "on_leave").length,
      }

      // Group by date for chart
      const dateGroups: Record<string, { present: number; late: number; absent: number }> = {}
      filteredData.forEach((record: { check_in_time: string; status: string }) => {
        const date = new Date(record.check_in_time).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        if (!dateGroups[date]) {
          dateGroups[date] = { present: 0, late: 0, absent: 0 }
        }
        if (record.status === "present") dateGroups[date].present++
        if (record.status === "late") dateGroups[date].late++
        if (record.status === "absent") dateGroups[date].absent++
      })

      const chartData = Object.entries(dateGroups).map(([date, counts]) => ({
        date,
        ...counts,
      }))

      setReportData({ summary, chartData })
    } catch (error) {
      console.error("[v0] Error generating report:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="month">Month</Label>
          <Input
            id="month"
            type="month"
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="department">Department</Label>
          <Select
            value={filters.departmentId}
            onValueChange={(value) => setFilters({ ...filters, departmentId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem> {/* Updated value prop to "all" */}
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2">
          <Button
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="flex-1 bg-[#15356E] text-white hover:bg-[#15356E]/90"
          >
            <Search className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate Report"}
          </Button>
          {reportData && (
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Report Results */}
      {reportData && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Present</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{reportData.summary.present}</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Late Arrivals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{reportData.summary.late}</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Absent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{reportData.summary.absent}</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">On Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{reportData.summary.onLeave}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-background">
            <CardHeader>
              <CardTitle className="text-card-foreground">Daily Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#22c55e" name="Present" />
                  <Bar dataKey="late" fill="#eab308" name="Late" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
