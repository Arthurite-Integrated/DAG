"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Building2, Plus, ArrowLeft, Edit, Trash2 } from "lucide-react"

interface Department {
  id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  manager_id: string | null
  profiles?: {
    full_name: string
    employee_id: string
  }
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newDepartment, setNewDepartment] = useState({ name: "", description: "" })
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    const isStaticAdmin = localStorage.getItem("isStaticAdmin") === "true"
    if (!isStaticAdmin) {
      window.location.href = "/dashboard"
      return
    }

    loadDepartments()
  }, [])

  const loadDepartments = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("departments")
        .select(`
          *,
          profiles!departments_manager_id_fkey (
            full_name,
            employee_id
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setDepartments(data || [])
    } catch (error) {
      console.error("Error loading departments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDepartment.name.trim()) return

    setIsCreating(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("departments")
        .insert({
          name: newDepartment.name.trim(),
          description: newDepartment.description.trim() || null,
        })

      if (error) throw error

      // Reload departments
      await loadDepartments()
      
      // Reset form
      setNewDepartment({ name: "", description: "" })
      setShowCreateForm(false)
    } catch (error: any) {
      console.error("Error creating department:", error)
      setError(error.message || "Failed to create department")
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading departments...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
            <p className="text-muted-foreground">Manage company departments and organizational structure</p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#15356E] hover:bg-[#15356E]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Create Department Form */}
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Department</CardTitle>
              <CardDescription>Add a new department to your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateDepartment} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Department Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Human Resources"
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of the department"
                      value={newDepartment.description}
                      onChange={(e) => setNewDepartment(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-destructive/10 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="bg-[#15356E] hover:bg-[#15356E]/90"
                  >
                    {isCreating ? "Creating..." : "Create Department"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false)
                      setNewDepartment({ name: "", description: "" })
                      setError(null)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Departments List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              All Departments ({departments.length})
            </CardTitle>
            <CardDescription>
              View and manage all departments in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No departments found.</p>
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="mt-4 bg-[#15356E] hover:bg-[#15356E]/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Department
                  </Button>
                </div>
              ) : (
                departments.map((department) => (
                  <div
                    key={department.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{department.name}</h3>
                        <Badge variant={department.is_active ? "default" : "secondary"}>
                          {department.is_active ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </div>
                      {department.description && (
                        <p className="text-sm text-muted-foreground mb-2">{department.description}</p>
                      )}
                      {department.profiles && (
                        <p className="text-xs text-muted-foreground">
                          Manager: {department.profiles.full_name} ({department.profiles.employee_id})
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(department.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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