"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, LogIn, LogOut, Calendar } from "lucide-react"
import { CheckInDialog } from "./check-in-dialog"
import { CheckOutDialog } from "./check-out-dialog"
import { ManualAttendanceDialog } from "./manual-attendance-dialog"
import type { Profile, AttendanceRecord, BiometricDevice } from "@/lib/types"

interface AttendanceViewProps {
  profile: Profile
  attendanceRecords: AttendanceRecord[]
  devices: BiometricDevice[]
  isAdminView: boolean
}

export function AttendanceView({ profile, attendanceRecords, devices, isAdminView }: AttendanceViewProps) {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false)
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false)
  const [isManualOpen, setIsManualOpen] = useState(false)

  // Check if user has checked in today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayAttendance = attendanceRecords.find((record) => {
    const recordDate = new Date(record.check_in_time)
    recordDate.setHours(0, 0, 0, 0)
    return recordDate.getTime() === today.getTime()
  })

  const hasCheckedIn = !!todayAttendance
  const hasCheckedOut = todayAttendance?.check_out_time

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      present: "bg-green-500 text-white",
      late: "bg-yellow-500 text-white",
      absent: "bg-red-500 text-white",
      half_day: "bg-blue-500 text-white",
      on_leave: "bg-purple-500 text-white",
    }
    return colors[status] || "bg-muted text-muted-foreground"
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const calculateDuration = (checkIn: string, checkOut: string | null) => {
    if (!checkOut) return "In Progress"

    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diff = end.getTime() - start.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  return (
    <>
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
            <CardDescription className="text-muted-foreground">
              {hasCheckedIn
                ? hasCheckedOut
                  ? "You have completed your attendance for today"
                  : "You are currently checked in"
                : "Check in to mark your attendance"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {!hasCheckedIn && (
                <Button
                  onClick={() => setIsCheckInOpen(true)}
                  className="bg-[#15356E] text-white hover:bg-[#15356E]/90"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Check In
                </Button>
              )}

              {hasCheckedIn && !hasCheckedOut && (
                <Button
                  onClick={() => setIsCheckOutOpen(true)}
                  className="bg-[#DA291C] text-white hover:bg-[#DA291C]/90"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Check Out
                </Button>
              )}

              {(profile.role === "admin" || profile.role === "hr") && (
                <Button onClick={() => setIsManualOpen(true)} variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manual Entry
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Attendance History</CardTitle>
            <CardDescription className="text-muted-foreground">Your recent attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-muted-foreground">Check In</TableHead>
                    <TableHead className="text-muted-foreground">Check Out</TableHead>
                    <TableHead className="text-muted-foreground">Duration</TableHead>
                    <TableHead className="text-muted-foreground">Method</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No attendance records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{formatDate(record.check_in_time)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatTime(record.check_in_time)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {record.check_out_time ? (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {formatTime(record.check_out_time)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>{calculateDuration(record.check_in_time, record.check_out_time)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {record.check_in_method}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(record.status)}>{record.status.replace("_", " ")}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <CheckInDialog open={isCheckInOpen} onOpenChange={setIsCheckInOpen} userId={profile.id} devices={devices} />

      {todayAttendance && (
        <CheckOutDialog
          open={isCheckOutOpen}
          onOpenChange={setIsCheckOutOpen}
          attendanceId={todayAttendance.id}
          devices={devices}
        />
      )}

      {(profile.role === "admin" || profile.role === "hr") && (
        <ManualAttendanceDialog open={isManualOpen} onOpenChange={setIsManualOpen} currentUserId={profile.id} />
      )}
    </>
  )
}
