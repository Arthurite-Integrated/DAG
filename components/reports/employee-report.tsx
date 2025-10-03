"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Search } from "lucide-react"
import type { Profile, AttendanceRecord } from "@/lib/types"

interface EmployeeReportProps {
  employees: Pick<Profile, "id" | "full_name" | "employee_id">[]
}

export function EmployeeReport({ employees }: EmployeeReportProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<{
    employee: Pick<Profile, "full_name" | "employee_id"> | null
    records: AttendanceRecord[]
    stats: {
      totalDays: number
      presentDays: number
      lateDays: number
      totalHours: number
      avgHours: number
    }
  } | null>(null)

  const [filters, setFilters] = useState({
    employeeId: "",
    startDate: new Date(new Date().setDate(1)).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })

  const handleGenerateReport = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const startDate = new Date(filters.startDate)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(filters.endDate)
      endDate.setHours(23, 59, 59, 999)

      const { data: records, error } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("user_id", filters.employeeId)
        .gte("check_in_time", startDate.toISOString())
        .lte("check_in_time", endDate.toISOString())
        .order("check_in_time", { ascending: false })

      if (error) throw error

      const employee = employees.find((e) => e.id === filters.employeeId)

      // Calculate stats
      const totalDays = records.length
      const presentDays = records.filter((r) => r.status === "present").length
      const lateDays = records.filter((r) => r.status === "late").length

      let totalHours = 0
      records.forEach((record) => {
        if (record.check_out_time) {
          const start = new Date(record.check_in_time)
          const end = new Date(record.check_out_time)
          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
          totalHours += hours
        }
      })

      const avgHours = totalDays > 0 ? totalHours / totalDays : 0

      setReportData({
        employee: employee || null,
        records,
        stats: {
          totalDays,
          presentDays,
          lateDays,
          totalHours: Math.round(totalHours * 10) / 10,
          avgHours: Math.round(avgHours * 10) / 10,
        },
      })
    } catch (error) {
      console.error("[v0] Error generating report:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      present: "bg-green-500 text-white",
      late: "bg-yellow-500 text-white",
      absent: "bg-red-500 text-white",
      half_day: "bg-blue-500 text-white",
      on_leave: "bg-purple-500 text-white",
    }
    return colors[status] || "bg-muted text-muted-foreground"
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="grid gap-2">
          <Label htmlFor="employee">Employee</Label>
          <Select value={filters.employeeId} onValueChange={(value) => setFilters({ ...filters, employeeId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.full_name} {emp.employee_id && `(${emp.employee_id})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>

        <div className="flex items-end gap-2">
          <Button
            onClick={handleGenerateReport}
            disabled={isLoading || !filters.employeeId}
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
          <Card className="border-border bg-background">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                {reportData.employee?.full_name}
                {reportData.employee?.employee_id && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({reportData.employee.employee_id})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div>
                  <p className="text-sm text-muted-foreground">Total Days</p>
                  <p className="text-2xl font-bold text-card-foreground">{reportData.stats.totalDays}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Present</p>
                  <p className="text-2xl font-bold text-green-600">{reportData.stats.presentDays}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Late</p>
                  <p className="text-2xl font-bold text-yellow-600">{reportData.stats.lateDays}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold text-card-foreground">{reportData.stats.totalHours}h</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Hours/Day</p>
                  <p className="text-2xl font-bold text-card-foreground">{reportData.stats.avgHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Check In</TableHead>
                  <TableHead className="text-muted-foreground">Check Out</TableHead>
                  <TableHead className="text-muted-foreground">Hours</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No attendance records found
                    </TableCell>
                  </TableRow>
                ) : (
                  reportData.records.map((record) => {
                    const hours = record.check_out_time
                      ? Math.round(
                          ((new Date(record.check_out_time).getTime() - new Date(record.check_in_time).getTime()) /
                            (1000 * 60 * 60)) *
                            10,
                        ) / 10
                      : 0

                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{formatDate(record.check_in_time)}</TableCell>
                        <TableCell>{formatTime(record.check_in_time)}</TableCell>
                        <TableCell>{record.check_out_time ? formatTime(record.check_out_time) : "—"}</TableCell>
                        <TableCell>{hours > 0 ? `${hours}h` : "—"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(record.status)}>{record.status.replace("_", " ")}</Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
