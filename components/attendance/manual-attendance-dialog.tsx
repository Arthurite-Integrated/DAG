"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import type { Profile } from "@/lib/types"

interface ManualAttendanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUserId: string
}

export function ManualAttendanceDialog({ open, onOpenChange, currentUserId }: ManualAttendanceDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [employees, setEmployees] = useState<Profile[]>([])

  const [formData, setFormData] = useState({
    userId: "",
    checkInDate: "",
    checkInTime: "",
    checkOutTime: "",
    status: "present",
    notes: "",
  })

  useEffect(() => {
    const fetchEmployees = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("profiles").select("*").eq("is_active", true).order("full_name")
      if (data) setEmployees(data)
    }
    if (open) fetchEmployees()
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const checkInDateTime = new Date(`${formData.checkInDate}T${formData.checkInTime}`)
      const checkOutDateTime = formData.checkOutTime
        ? new Date(`${formData.checkInDate}T${formData.checkOutTime}`)
        : null

      const { error: insertError } = await supabase.from("attendance_records").insert({
        user_id: formData.userId,
        check_in_time: checkInDateTime.toISOString(),
        check_out_time: checkOutDateTime?.toISOString() || null,
        check_in_method: "admin",
        check_out_method: checkOutDateTime ? "admin" : null,
        status: formData.status,
        notes: formData.notes || null,
        created_by: currentUserId,
      })

      if (insertError) throw insertError

      onOpenChange(false)
      router.refresh()

      setFormData({
        userId: "",
        checkInDate: "",
        checkInTime: "",
        checkOutTime: "",
        status: "present",
        notes: "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create attendance record")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manual Attendance Entry</DialogTitle>
          <DialogDescription>Create an attendance record manually</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">Employee</Label>
              <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.full_name} - {emp.employee_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.checkInDate}
                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="checkIn">Check In Time</Label>
                <Input
                  id="checkIn"
                  type="time"
                  value={formData.checkInTime}
                  onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="checkOut">Check Out Time</Label>
                <Input
                  id="checkOut"
                  type="time"
                  value={formData.checkOutTime}
                  onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="half_day">Half Day</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
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
              {isLoading ? "Creating..." : "Create Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
