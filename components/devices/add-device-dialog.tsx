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

export function AddDeviceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    deviceId: "",
    deviceName: "",
    location: "",
    deviceType: "fingerprint",
    ipAddress: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: insertError } = await supabase.from("biometric_devices").insert({
        device_id: formData.deviceId,
        device_name: formData.deviceName,
        location: formData.location,
        device_type: formData.deviceType,
        ip_address: formData.ipAddress || null,
        is_active: true,
      })

      if (insertError) throw insertError

      onOpenChange(false)
      router.refresh()

      setFormData({
        deviceId: "",
        deviceName: "",
        location: "",
        deviceType: "fingerprint",
        ipAddress: "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add device")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription>Register a new biometric device</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="deviceId">Device ID</Label>
              <Input
                id="deviceId"
                value={formData.deviceId}
                onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                placeholder="DEV-001"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deviceName">Device Name</Label>
              <Input
                id="deviceName"
                value={formData.deviceName}
                onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                placeholder="Main Entrance Scanner"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Building A - Main Entrance"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deviceType">Device Type</Label>
              <Select
                value={formData.deviceType}
                onValueChange={(value) => setFormData({ ...formData, deviceType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fingerprint">Fingerprint Scanner</SelectItem>
                  <SelectItem value="face_recognition">Face Recognition</SelectItem>
                  <SelectItem value="card_reader">Card Reader</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ipAddress">IP Address (Optional)</Label>
              <Input
                id="ipAddress"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                placeholder="192.168.1.100"
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
              {isLoading ? "Adding..." : "Add Device"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
