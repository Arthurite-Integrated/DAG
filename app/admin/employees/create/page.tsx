"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { createEmployeeProfile, generateEmployeeId } from "@/lib/utils/employee-id"
import { ArrowLeft, UserPlus } from "lucide-react"

interface Department {
  id: string
  name: string
}

export default function CreateEmployeePage() {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<string>("employee")
  const [departmentId, setDepartmentId] = useState<string>("none")
  const [departments, setDepartments] = useState<Department[]>([])
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [nextEmployeeId, setNextEmployeeId] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    const isStaticAdmin = localStorage.getItem("isStaticAdmin") === "true"
    if (!isStaticAdmin) {
      window.location.href = "/dashboard"
      return
    }

    loadDepartments()
    loadNextEmployeeId()
  }, [])

  // Update next Employee ID when role changes
  useEffect(() => {
    if (role === "employee") {
      loadNextEmployeeId()
    } else {
      setNextEmployeeId("")
    }
  }, [role])

  const loadNextEmployeeId = async () => {
    try {
      if (role === "employee") {
        const nextId = await generateEmployeeId()
        setNextEmployeeId(nextId)
      } else {
        setNextEmployeeId("")
      }
    } catch (error) {
      console.error("Error loading next Employee ID:", error)
    }
  }

  const loadDepartments = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("departments")
        .select("id, name")
        .eq("is_active", true)
        .order("name")

      if (error) throw error
      setDepartments(data || [])
    } catch (error) {
      console.error("Error loading departments:", error)
    }
  }

  const generateRandomPassword = () => {
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
    setPassword(password)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()

      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          role: role,
        }
      })

      if (authError) throw authError

      // Create employee profile with auto-generated Employee ID
      if (authData.user) {
        const { employee_id } = await createEmployeeProfile(authData.user.id, {
          email,
          full_name: fullName,
          role,
          phone,
          department_id: departmentId === "none" ? undefined : departmentId,
        })

        const employeeIdMessage = employee_id ? `Employee ID: ${employee_id}` : "No Employee ID (Admin/HR role)"
        setSuccess(`Employee created successfully! ${employeeIdMessage}. Temporary password: ${password}`)
      }
      
      // Reset form
      setEmail("")
      setFullName("")
      setPhone("")
      setRole("employee")
      setDepartmentId("none")
      setPassword("")

    } catch (error: any) {
      console.error("Error creating employee:", error)
      setError(error.message || "Failed to create employee")
    } finally {
      setIsLoading(false)
    }
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Employee</h1>
            <p className="text-muted-foreground">Add a new employee to the system</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Employee Information
              </CardTitle>
              <CardDescription>
                Fill in the details to create a new employee account. An Employee ID will be automatically generated.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@dagindustries.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {role === "employee" && nextEmployeeId && (
                      <p className="text-xs text-blue-600 font-mono">
                        Next Employee ID: {nextEmployeeId}
                      </p>
                    )}
                    {role !== "employee" && (
                      <p className="text-xs text-muted-foreground">
                        No Employee ID assigned for Admin/HR roles
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={departmentId || "none"} onValueChange={(value) => setDepartmentId(value === "none" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Department</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Temporary Password *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="password"
                      type="text"
                      placeholder="Temporary password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateRandomPassword}
                    >
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Employee should change this password on first login
                  </p>
                </div>

                {error && (
                  <div className="rounded-md bg-destructive/10 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="rounded-md bg-green-500/10 p-3">
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#15356E] hover:bg-[#15356E]/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Employee"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}