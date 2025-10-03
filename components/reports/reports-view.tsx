"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DailyReport } from "./daily-report"
import { MonthlyReport } from "./monthly-report"
import { EmployeeReport } from "./employee-report"
import type { Profile, Department } from "@/lib/types"

interface ReportsViewProps {
  employees: Pick<Profile, "id" | "full_name" | "employee_id">[]
  departments: Department[]
}

export function ReportsView({ employees, departments }: ReportsViewProps) {
  const [activeTab, setActiveTab] = useState("daily")

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Attendance Reports</CardTitle>
        <CardDescription className="text-muted-foreground">
          Generate and view attendance reports and analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily Report</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
            <TabsTrigger value="employee">Employee Report</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-6">
            <DailyReport employees={employees} departments={departments} />
          </TabsContent>

          <TabsContent value="monthly" className="mt-6">
            <MonthlyReport employees={employees} departments={departments} />
          </TabsContent>

          <TabsContent value="employee" className="mt-6">
            <EmployeeReport employees={employees} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
