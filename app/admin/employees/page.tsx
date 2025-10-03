"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Users, Search, Plus, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface Employee {
  id: string
  full_name: string
  email: string
  role: string
  employee_id: string | null
  phone: string | null
  is_active: boolean
  created_at: string
  departments?: {
    name: string
  }
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    const isStaticAdmin = localStorage.getItem("isStaticAdmin") === "true"
    if (!isStaticAdmin) {
      window.location.href = "/dashboard"
      return
    }

    loadEmployees()
  }, [])

  useEffect(() => {
    // Filter employees based on search term
    const filtered = employees.filter(
      (employee) =>
        employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredEmployees(filtered)
  }, [employees, searchTerm])

  const loadEmployees = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          departments (
            name
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setEmployees(data || [])
    } catch (error) {
      console.error("Error loading employees:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading employees...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">Manage employee accounts and information</p>
          </div>
          <Button
            onClick={() => router.push("/admin/employees/create")}
            className="bg-[#15356E] hover:bg-[#15356E]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Employees ({filteredEmployees.length})
            </CardTitle>
            <CardDescription>
              View and manage all employee accounts in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search employees by name, email, or Employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? "No employees found matching your search." : "No employees found."}
                  </p>
                </div>
              ) : (
                filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{employee.full_name}</h3>
                        <Badge
                          variant={
                            employee.role === "admin"
                              ? "destructive"
                              : employee.role === "hr"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {employee.role.toUpperCase()}
                        </Badge>
                        {!employee.is_active && (
                          <Badge variant="outline" className="text-red-500">
                            INACTIVE
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{employee.email}</p>
                      {employee.employee_id && (
                        <p className="text-sm font-mono text-blue-600">{employee.employee_id}</p>
                      )}
                      {employee.phone && (
                        <p className="text-xs text-muted-foreground">{employee.phone}</p>
                      )}
                      {employee.departments && (
                        <p className="text-xs text-muted-foreground">
                          Department: {employee.departments.name}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground">
                        Joined {new Date(employee.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}