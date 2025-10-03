"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function AdminMetricsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Monthly Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Employee Growth</span>
            <span className="text-sm font-medium text-green-500">+12%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Attendance Rate</span>
            <span className="text-sm font-medium text-blue-500">94%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Department Efficiency</span>
            <span className="text-sm font-medium text-green-500">+8%</span>
          </div>
          <div className="h-32 rounded-lg bg-muted/50 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Chart visualization coming soon</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}