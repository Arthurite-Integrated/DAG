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
import { Switch } from "@/components/ui/switch"
import type { BiometricDevice } from "@/lib/types"

interface EditDeviceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  device: BiometricDevice
}

export function EditDeviceDialog({ open, onOpenChange, device }: EditDeviceDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    deviceName: device.device_name,
    location: device.location,
    deviceType: device.device_type,
    ipAddress: device.ip_address || "",
    isActive: device.is_active,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: updateError } = await supabase
        .from("biometric_devices")
        .update({
          device_name: formData.deviceName,
          location: formData.location,
          device_type: formData.deviceType,
          ip_address: formData.ipAddress || null,
          is_active: formData.isActive,
        })
        .eq("id", device.id)

      if (updateError) throw updateError

      onOpenChange(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update device")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncDevice = async () => {
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: updateError } = await supabase
        .from("biometric_devices")
        .update({
          last_sync: new Date().toISOString(),
        })
        .eq("id", device.id)

      if (updateError) throw updateError

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sync device")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Device</DialogTitle>
          <DialogDescription>Update device information and settings</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">Device ID:</p>
              <p className="font-mono text-xs text-muted-foreground">{device.device_id}</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deviceName">Device Name</Label>
              <Input
                id="deviceName"
                value={formData.deviceName}
                onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
              <Label htmlFor="ipAddress">IP Address</Label>
              <Input
                id="ipAddress"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active Status</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button type="button" variant="outline" onClick={handleSyncDevice} disabled={isLoading}>
              Sync Device
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#15356E] text-white hover:bg-[#15356E]/90" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
