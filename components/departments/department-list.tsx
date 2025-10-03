"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit } from "lucide-react"
import { AddDepartmentDialog } from "./add-department-dialog"
import { EditDepartmentDialog } from "./edit-department-dialog"
import type { Department, Profile } from "@/lib/types"

interface DepartmentListProps {
  departments: (Department & { manager?: Pick<Profile, "id" | "full_name"> | null })[]
  employees: Pick<Profile, "id" | "full_name">[]
  currentUserRole: string
}

export function DepartmentList({ departments, employees, currentUserRole }: DepartmentListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground">Departments</CardTitle>
              <CardDescription className="text-muted-foreground">
                {departments.length} department{departments.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            {currentUserRole === "admin" && (
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-[#15356E] text-white hover:bg-[#15356E]/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <Card key={dept.id} className="border-border bg-background">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-card-foreground">{dept.name}</CardTitle>
                      <CardDescription className="mt-1 text-muted-foreground">{dept.description}</CardDescription>
                    </div>
                    {currentUserRole === "admin" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingDepartment(dept)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Manager:</span>
                      <span className="font-medium text-card-foreground">
                        {dept.manager?.full_name || "Unassigned"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={dept.is_active ? "default" : "secondary"}>
                        {dept.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddDepartmentDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} employees={employees} />

      {editingDepartment && (
        <EditDepartmentDialog
          open={!!editingDepartment}
          onOpenChange={(open) => !open && setEditingDepartment(null)}
          department={editingDepartment}
          employees={employees}
        />
      )}
    </>
  )
}
