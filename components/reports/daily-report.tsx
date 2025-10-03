"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Search } from "lucide-react"
import type { Profile, Department, AttendanceRecord } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DailyReportProps {
  employees: Pick<Profile, "id" | "full_name" | "employee_id">[]
  departments: Department[]
}

export function DailyReport({ employees, departments }: DailyReportProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<
    (AttendanceRecord & { profiles?: Pick<Profile, "full_name" | "employee_id"> })[] | null
  >(null)

  const [filters, setFilters] = useState({
    date: new Date().toISOString().split("T")[0],
    departmentId: "all", // Updated default value to "all"
  })

  const handleGenerateReport = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const startDate = new Date(filters.date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(filters.date)
      endDate.setHours(23, 59, 59, 999)

      const query = supabase
        .from("attendance_records")
        .select(
          `
          *,
          profiles!attendance_records_user_id_fkey (
            full_name,
            employee_id,
            department_id
          )
        `,
        )
        .gte("check_in_time", startDate.toISOString())
        .lte("check_in_time", endDate.toISOString())
        .order("check_in_time")

      const { data, error } = await query

      if (error) throw error

      // Filter by department if selected
      let filteredData = data
      if (filters.departmentId !== "all") {
        filteredData = data.filter((record: { profiles?: { department_id?: string } }) => {
          return record.profiles?.department_id === filters.departmentId
        })
      }

      setReportData(filteredData as (AttendanceRecord & { profiles?: Pick<Profile, "full_name" | "employee_id"> })[])
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

  const calculateDuration = (checkIn: string, checkOut: string | null) => {
    if (!checkOut) return "In Progress"

    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = end.getTime() - start.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
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
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Present</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {reportData.filter((r) => r.status === "present").length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Late Arrivals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {reportData.filter((r) => r.status === "late").length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">On Leave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {reportData.filter((r) => r.status === "on_leave").length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {employees.length > 0 ? Math.round((reportData.length / employees.length) * 100) : 0}%
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Employee ID</TableHead>
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Check In</TableHead>
                  <TableHead className="text-muted-foreground">Check Out</TableHead>
                  <TableHead className="text-muted-foreground">Duration</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No attendance records found for this date
                    </TableCell>
                  </TableRow>
                ) : (
                  reportData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-sm">{record.profiles?.employee_id || "—"}</TableCell>
                      <TableCell className="font-medium">{record.profiles?.full_name}</TableCell>
                      <TableCell>{formatTime(record.check_in_time)}</TableCell>
                      <TableCell>{record.check_out_time ? formatTime(record.check_out_time) : "—"}</TableCell>
                      <TableCell>{calculateDuration(record.check_in_time, record.check_out_time)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(record.status)}>{record.status.replace("_", " ")}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
