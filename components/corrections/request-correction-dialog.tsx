"use client"

import type React from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { AttendanceRecord } from "@/lib/types"

interface RequestCorrectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  attendanceRecords: AttendanceRecord[]
}

export function RequestCorrectionDialog({
  open,
  onOpenChange,
  userId,
  attendanceRecords,
}: RequestCorrectionDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    attendanceId: "",
    correctedCheckIn: "",
    correctedCheckOut: "",
    reason: "",
  })

  const selectedRecord = attendanceRecords.find((r) => r.id === formData.attendanceId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      if (!selectedRecord) throw new Error("Please select an attendance record")

      const { error: insertError } = await supabase.from("attendance_corrections").insert({
        attendance_id: formData.attendanceId,
        user_id: userId,
        requested_by: userId,
        original_check_in: selectedRecord.check_in_time,
        original_check_out: selectedRecord.check_out_time,
        corrected_check_in: formData.correctedCheckIn || null,
        corrected_check_out: formData.correctedCheckOut || null,
        reason: formData.reason,
        status: "pending",
      })

      if (insertError) throw insertError

      onOpenChange(false)
      router.refresh()

      setFormData({
        attendanceId: "",
        correctedCheckIn: "",
        correctedCheckOut: "",
        reason: "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to request correction")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Attendance Correction</DialogTitle>
          <DialogDescription>Submit a request to correct your attendance record</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="attendance">Select Attendance Record</Label>
              <Select
                value={formData.attendanceId}
                onValueChange={(value) => setFormData({ ...formData, attendanceId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select record" />
                </SelectTrigger>
                <SelectContent>
                  {attendanceRecords.map((record) => (
                    <SelectItem key={record.id} value={record.id}>
                      {new Date(record.check_in_time).toLocaleDateString()} -{" "}
                      {new Date(record.check_in_time).toLocaleTimeString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRecord && (
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="font-medium">Current Record:</p>
                <p className="text-muted-foreground">
                  Check In: {new Date(selectedRecord.check_in_time).toLocaleString()}
                </p>
                {selectedRecord.check_out_time && (
                  <p className="text-muted-foreground">
                    Check Out: {new Date(selectedRecord.check_out_time).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="correctedCheckIn">Corrected Check In Time</Label>
              <Input
                id="correctedCheckIn"
                type="datetime-local"
                value={formData.correctedCheckIn}
                onChange={(e) => setFormData({ ...formData, correctedCheckIn: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="correctedCheckOut">Corrected Check Out Time</Label>
              <Input
                id="correctedCheckOut"
                type="datetime-local"
                value={formData.correctedCheckOut}
                onChange={(e) => setFormData({ ...formData, correctedCheckOut: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for Correction</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
                required
                placeholder="Explain why this correction is needed..."
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#15356E] text-white hover:bg-[#15356E]/90" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
