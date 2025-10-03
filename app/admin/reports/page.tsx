"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { FileText, Download, Calendar, Users, Building2, ArrowLeft, Filter } from "lucide-react"

interface ReportData {
  title: string
  description: string
  data: any[]
  type: "attendance" | "employee" | "department"
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState("attendance")
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [departments, setDepartments] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    const isStaticAdmin = localStorage.getItem("isStaticAdmin") === "true"
    if (!isStaticAdmin) {
      window.location.href = "/dashboard"
      return
    }

    loadReports()
    loadDepartments()
  }, [selectedReport, selectedPeriod, selectedDepartment])

  const loadDepartments = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("departments")
        .select("id, name")
        .eq("is_active", true)

      if (error) throw error
      setDepartments(data || [])
    } catch (error) {
      console.error("Error loading departments:", error)
    }
  }

  const loadReports = async () => {
    try {
      const supabase = createClient()
      
      // Calculate date range based on selected period
      const now = new Date()
      let startDate: Date
      
      switch (selectedPeriod) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case "thisWeek":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "thisMonth":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case "lastMonth":
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          break
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      }

      let reportsData: ReportData[] = []

      if (selectedReport === "attendance") {
        // Attendance Report
        let query = supabase
          .from("attendance_records")
          .select(`
            *,
            profiles (
              full_name,
              employee_id,
              departments (name)
            )
          `)
          .gte("check_in_time", startDate.toISOString())
          .order("check_in_time", { ascending: false })

        if (selectedDepartment !== "all") {
          // Note: This would need a join through profiles table in a real implementation
        }

        const { data: attendanceData, error } = await query
        if (error) throw error

        reportsData.push({
          title: "Attendance Report",
          description: `Attendance records for ${selectedPeriod.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          data: attendanceData || [],
          type: "attendance"
        })

      } else if (selectedReport === "employee") {
        // Employee Report
        let query = supabase
          .from("profiles")
          .select(`
            *,
            departments (name)
          `)
          .order("created_at", { ascending: false })

        if (selectedDepartment !== "all") {
          query = query.eq("department_id", selectedDepartment)
        }

        const { data: employeeData, error } = await query
        if (error) throw error

        reportsData.push({
          title: "Employee Report",
          description: "Complete employee directory and information",
          data: employeeData || [],
          type: "employee"
        })

      } else if (selectedReport === "department") {
        // Department Report
        const { data: departmentData, error } = await supabase
          .from("departments")
          .select(`
            *,
            profiles!profiles_department_id_fkey (
              id,
              full_name,
              role
            )
          `)
          .order("created_at", { ascending: false })

        if (error) throw error

        reportsData.push({
          title: "Department Report",
          description: "Department structure and employee distribution",
          data: departmentData || [],
          type: "department"
        })
      }

      setReports(reportsData)
    } catch (error) {
      console.error("Error loading reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = (report: ReportData) => {
    // Create CSV content
    let csvContent = ""
    
    if (report.type === "attendance") {
      csvContent = "Date,Employee,Employee ID,Check In,Check Out,Status,Department\n"
      report.data.forEach((record: any) => {
        const checkIn = new Date(record.check_in_time).toLocaleString()
        const checkOut = record.check_out_time ? new Date(record.check_out_time).toLocaleString() : "N/A"
        csvContent += `"${checkIn}","${record.profiles?.full_name || 'N/A'}","${record.profiles?.employee_id || 'N/A'}","${checkIn}","${checkOut}","${record.status}","${record.profiles?.departments?.name || 'N/A'}"\n`
      })
    } else if (report.type === "employee") {
      csvContent = "Employee ID,Full Name,Email,Role,Department,Phone,Status,Created Date\n"
      report.data.forEach((employee: any) => {
        csvContent += `"${employee.employee_id || 'N/A'}","${employee.full_name}","${employee.email}","${employee.role}","${employee.departments?.name || 'N/A'}","${employee.phone || 'N/A'}","${employee.is_active ? 'Active' : 'Inactive'}","${new Date(employee.created_at).toLocaleDateString()}"\n`
      })
    }

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${report.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading reports...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Generate and export comprehensive reports</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Report Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Report Filters
            </CardTitle>
            <CardDescription>Configure your report parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attendance">Attendance Report</SelectItem>
                    <SelectItem value="employee">Employee Report</SelectItem>
                    <SelectItem value="department">Department Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time Period</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="thisWeek">This Week</SelectItem>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                    <SelectItem value="lastMonth">Last Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((report, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {report.title}
                    </CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                  <Button
                    onClick={() => exportReport(report)}
                    className="bg-[#15356E] hover:bg-[#15356E]/90"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Records: <strong>{report.data.length}</strong></span>
                    <span>Generated: {new Date().toLocaleString()}</span>
                  </div>

                  {/* Sample Data Preview */}
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-medium mb-2">Data Preview</h4>
                    {report.data.length > 0 ? (
                      <div className="text-sm text-muted-foreground">
                        {report.type === "attendance" && (
                          <p>Latest entry: {report.data[0]?.profiles?.full_name || 'N/A'} - {new Date(report.data[0]?.check_in_time).toLocaleDateString()}</p>
                        )}
                        {report.type === "employee" && (
                          <p>Showing {report.data.length} employees across {departments.length} departments</p>
                        )}
                        {report.type === "department" && (
                          <p>Showing {report.data.length} departments with employee assignments</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No data available for the selected criteria</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}