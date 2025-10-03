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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { BiometricDevice } from "@/lib/types"

interface CheckInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  devices: BiometricDevice[]
}

export function CheckInDialog({ open, onOpenChange, userId, devices }: CheckInDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    method: "manual",
    deviceId: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: insertError } = await supabase.from("attendance_records").insert({
        user_id: userId,
        check_in_time: new Date().toISOString(),
        check_in_method: formData.method,
        device_id: formData.deviceId || null,
        status: "present",
        notes: formData.notes || null,
      })

      if (insertError) throw insertError

      onOpenChange(false)
      router.refresh()

      setFormData({ method: "manual", deviceId: "", notes: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Check In</DialogTitle>
          <DialogDescription>Mark your attendance for today</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="method">Check-In Method</Label>
              <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="biometric">Biometric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.method === "biometric" && (
              <div className="grid gap-2">
                <Label htmlFor="device">Device</Label>
                <Select
                  value={formData.deviceId}
                  onValueChange={(value) => setFormData({ ...formData, deviceId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.device_name} - {device.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Add any notes about your check-in..."
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
              {isLoading ? "Checking In..." : "Check In"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
