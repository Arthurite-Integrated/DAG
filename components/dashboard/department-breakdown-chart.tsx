"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"

interface DepartmentBreakdownChartProps {
  departments: Array<{
    id: string
    name: string
    description: string | null
  }>
}

export function DepartmentBreakdownChart({ departments }: DepartmentBreakdownChartProps) {
  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Departments</CardTitle>
        <CardDescription>Active departments in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {departments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No departments found</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Add departments to organize your staff</p>
            </div>
          ) : (
            departments.map((dept) => (
              <div
                key={dept.id}
                className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{dept.name}</p>
                    {dept.description && <p className="text-xs text-muted-foreground">{dept.description}</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
