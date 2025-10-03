"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

interface Employee {
  id: string
  full_name: string
  email: string
  role: string
  employee_id: string | null
  created_at: string
}

interface RecentEmployeesTableProps {
  employees: Employee[]
}

export function RecentEmployeesTable({ employees }: RecentEmployeesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Recent Employees
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {employees.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent employees found
            </p>
          ) : (
            employees.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium text-sm">{employee.full_name}</p>
                  <p className="text-xs text-muted-foreground">{employee.email}</p>
                  {employee.employee_id && (
                    <p className="text-xs text-blue-600 font-mono">{employee.employee_id}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge 
                    variant={employee.role === 'admin' ? 'destructive' : employee.role === 'hr' ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    {employee.role.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(employee.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}