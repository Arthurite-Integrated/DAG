"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, CheckCircle2, XCircle, Clock } from "lucide-react"
import { RequestCorrectionDialog } from "./request-correction-dialog"
import { ReviewCorrectionDialog } from "./review-correction-dialog"
import type { Profile, AttendanceCorrection, AttendanceRecord } from "@/lib/types"

interface CorrectionsViewProps {
  profile: Profile
  corrections: (AttendanceCorrection & {
    attendance_records?: AttendanceRecord
    profiles?: { full_name: string; employee_id: string | null }
    requester?: { full_name: string }
    reviewer?: { full_name: string }
  })[]
  attendanceRecords: AttendanceRecord[]
}

export function CorrectionsView({ profile, corrections, attendanceRecords }: CorrectionsViewProps) {
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [reviewingCorrection, setReviewingCorrection] = useState<AttendanceCorrection | null>(null)

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: React.ReactNode }> = {
      pending: { color: "bg-yellow-500 text-white", icon: <Clock className="mr-1 h-3 w-3" /> },
      approved: { color: "bg-green-500 text-white", icon: <CheckCircle2 className="mr-1 h-3 w-3" /> },
      rejected: { color: "bg-red-500 text-white", icon: <XCircle className="mr-1 h-3 w-3" /> },
    }
    const { color, icon } = config[status] || config.pending
    return (
      <Badge className={color}>
        <span className="flex items-center">
          {icon}
          {status}
        </span>
      </Badge>
    )
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const canReview = profile.role === "admin" || profile.role === "hr"

  return (
    <>
      <div className="space-y-6">
        {/* Actions */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-card-foreground">Corrections</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {corrections.length} correction request{corrections.length !== 1 ? "s" : ""}
                </CardDescription>
              </div>
              <Button onClick={() => setIsRequestOpen(true)} className="bg-[#15356E] text-white hover:bg-[#15356E]/90">
                <Plus className="mr-2 h-4 w-4" />
                Request Correction
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Corrections List */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Correction Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {canReview && <TableHead className="text-muted-foreground">Employee</TableHead>}
                    <TableHead className="text-muted-foreground">Original Check In</TableHead>
                    <TableHead className="text-muted-foreground">Original Check Out</TableHead>
                    <TableHead className="text-muted-foreground">Corrected Check In</TableHead>
                    <TableHead className="text-muted-foreground">Corrected Check Out</TableHead>
                    <TableHead className="text-muted-foreground">Reason</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    {canReview && <TableHead className="text-right text-muted-foreground">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {corrections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={canReview ? 8 : 7} className="text-center text-muted-foreground">
                        No correction requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    corrections.map((correction) => (
                      <TableRow key={correction.id}>
                        {canReview && (
                          <TableCell className="font-medium">
                            {correction.profiles?.full_name}
                            {correction.profiles?.employee_id && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({correction.profiles.employee_id})
                              </span>
                            )}
                          </TableCell>
                        )}
                        <TableCell className="text-sm">{formatDateTime(correction.original_check_in)}</TableCell>
                        <TableCell className="text-sm">{formatDateTime(correction.original_check_out)}</TableCell>
                        <TableCell className="text-sm font-medium">
                          {formatDateTime(correction.corrected_check_in)}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {formatDateTime(correction.corrected_check_out)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                          {correction.reason}
                        </TableCell>
                        <TableCell>{getStatusBadge(correction.status)}</TableCell>
                        {canReview && (
                          <TableCell className="text-right">
                            {correction.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setReviewingCorrection(correction)}
                                className="text-xs"
                              >
                                Review
                              </Button>
                            )}
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
      </div>

      <RequestCorrectionDialog
        open={isRequestOpen}
        onOpenChange={setIsRequestOpen}
        userId={profile.id}
        attendanceRecords={attendanceRecords}
      />

      {reviewingCorrection && canReview && (
        <ReviewCorrectionDialog
          open={!!reviewingCorrection}
          onOpenChange={(open) => !open && setReviewingCorrection(null)}
          correction={reviewingCorrection}
          reviewerId={profile.id}
        />
      )}
    </>
  )
}
