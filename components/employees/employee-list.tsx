"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { AddEmployeeDialog } from "./add-employee-dialog"
import { EditEmployeeDialog } from "./edit-employee-dialog"
import type { Profile, Department } from "@/lib/types"

interface EmployeeListProps {
  employees: (Profile & { departments?: Department | null })[]
  departments: Department[]
  currentUserRole: string
}

export function EmployeeList({ employees, departments, currentUserRole }: EmployeeListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Profile | null>(null)

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employee_id?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-[#DA291C] text-white"
      case "hr":
        return "bg-[#15356E] text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground">Employees</CardTitle>
              <CardDescription className="text-muted-foreground">
                {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            {currentUserRole === "admin" && (
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-[#15356E] text-white hover:bg-[#15356E]/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or employee ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Employee ID</TableHead>
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Department</TableHead>
                  <TableHead className="text-muted-foreground">Role</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  {currentUserRole === "admin" && (
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={currentUserRole === "admin" ? 7 : 6}
                      className="text-center text-muted-foreground"
                    >
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-mono text-sm">{employee.employee_id || "—"}</TableCell>
                      <TableCell className="font-medium">{employee.full_name}</TableCell>
                      <TableCell className="text-muted-foreground">{employee.email}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {employee.departments?.name || "Unassigned"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(employee.role)}>{employee.role.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={employee.is_active ? "default" : "secondary"}>
                          {employee.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      {currentUserRole === "admin" && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingEmployee(employee)}
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddEmployeeDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} departments={departments} />

      {editingEmployee && (
        <EditEmployeeDialog
          open={!!editingEmployee}
          onOpenChange={(open) => !open && setEditingEmployee(null)}
          employee={editingEmployee}
          departments={departments}
        />
      )}
    </>
  )
}
