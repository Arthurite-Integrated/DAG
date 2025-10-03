"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { AttendanceCorrection } from "@/lib/types"

interface ReviewCorrectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  correction: AttendanceCorrection
  reviewerId: string
}

export function ReviewCorrectionDialog({ open, onOpenChange, correction, reviewerId }: ReviewCorrectionDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")

  const handleReview = async (status: "approved" | "rejected") => {
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Update correction status
      const { error: updateError } = await supabase
        .from("attendance_corrections")
        .update({
          status,
          reviewed_by: reviewerId,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes || null,
        })
        .eq("id", correction.id)

      if (updateError) throw updateError

      // If approved, update the attendance record
      if (status === "approved") {
        const updateData: Record<string, string | null> = {}
        if (correction.corrected_check_in) updateData.check_in_time = correction.corrected_check_in
        if (correction.corrected_check_out) updateData.check_out_time = correction.corrected_check_out

        const { error: attendanceError } = await supabase
          .from("attendance_records")
          .update(updateData)
          .eq("id", correction.attendance_id)

        if (attendanceError) throw attendanceError
      }

      onOpenChange(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to review correction")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review Correction Request</DialogTitle>
          <DialogDescription>Approve or reject this attendance correction</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="mb-2 font-medium">Requested Changes:</p>
            <div className="space-y-1 text-muted-foreground">
              {correction.original_check_in && (
                <p>
                  Original Check In: {new Date(correction.original_check_in).toLocaleString()}
                  {correction.corrected_check_in && (
                    <span className="ml-2 font-medium text-foreground">
                      → {new Date(correction.corrected_check_in).toLocaleString()}
                    </span>
                  )}
                </p>
              )}
              {correction.original_check_out && (
                <p>
                  Original Check Out: {new Date(correction.original_check_out).toLocaleString()}
                  {correction.corrected_check_out && (
                    <span className="ml-2 font-medium text-foreground">
                      → {new Date(correction.corrected_check_out).toLocaleString()}
                    </span>
                  )}
                </p>
              )}
            </div>
            <p className="mt-3 font-medium">Reason:</p>
            <p className="text-muted-foreground">{correction.reason}</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reviewNotes">Review Notes (Optional)</Label>
            <Textarea
              id="reviewNotes"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={3}
              placeholder="Add any notes about your decision..."
            />
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleReview("rejected")}
            disabled={isLoading}
            className="text-destructive"
          >
            {isLoading ? "Processing..." : "Reject"}
          </Button>
          <Button
            type="button"
            onClick={() => handleReview("approved")}
            disabled={isLoading}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {isLoading ? "Processing..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
