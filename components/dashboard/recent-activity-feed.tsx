"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

interface RecentActivityFeedProps {
  activities: Array<{
    id: string
    check_in_time: string
    status: string
    created_at: string
    profiles: {
      full_name: string
      employee_id: string
    } | null
  }>
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "late":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "text-green-500"
      case "absent":
        return "text-red-500"
      case "late":
        return "text-yellow-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest attendance records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {activity.profiles ? activity.profiles.full_name : "Unknown Employee"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.profiles?.employee_id && (
                        <span className="mr-2">ID: {activity.profiles.employee_id}</span>
                      )}
                      <span className={getStatusColor(activity.status)}>{activity.status}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{new Date(activity.created_at).toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">{new Date(activity.created_at).toLocaleTimeString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
