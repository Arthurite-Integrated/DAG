"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Wifi, WifiOff } from "lucide-react"
import { AddDeviceDialog } from "./add-device-dialog"
import { EditDeviceDialog } from "./edit-device-dialog"
import type { BiometricDevice } from "@/lib/types"

interface DeviceListProps {
  devices: BiometricDevice[]
}

export function DeviceList({ devices }: DeviceListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingDevice, setEditingDevice] = useState<BiometricDevice | null>(null)

  const getDeviceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      fingerprint: "bg-blue-500 text-white",
      face_recognition: "bg-purple-500 text-white",
      card_reader: "bg-green-500 text-white",
    }
    return colors[type] || "bg-muted text-muted-foreground"
  }

  const formatLastSync = (lastSync: string | null) => {
    if (!lastSync) return "Never"
    const date = new Date(lastSync)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
    return date.toLocaleDateString()
  }

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground">Biometric Devices</CardTitle>
              <CardDescription className="text-muted-foreground">
                {devices.length} device{devices.length !== 1 ? "s" : ""} registered
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#15356E] text-white hover:bg-[#15356E]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Device
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <Card key={device.id} className="border-border bg-background">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg text-card-foreground">{device.device_name}</CardTitle>
                        {device.is_active ? (
                          <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <CardDescription className="mt-1 text-muted-foreground">{device.location}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setEditingDevice(device)} className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Device ID:</span>
                      <span className="font-mono text-xs text-card-foreground">{device.device_id}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge className={getDeviceTypeColor(device.device_type)}>
                        {device.device_type.replace("_", " ")}
                      </Badge>
                    </div>

                    {device.ip_address && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">IP Address:</span>
                        <span className="font-mono text-xs text-card-foreground">{device.ip_address}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span className="text-xs text-card-foreground">{formatLastSync(device.last_sync)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={device.is_active ? "default" : "secondary"}>
                        {device.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {devices.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
                <p className="text-sm text-muted-foreground">No devices registered yet</p>
                <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" className="mt-4" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Device
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddDeviceDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      {editingDevice && (
        <EditDeviceDialog
          open={!!editingDevice}
          onOpenChange={(open) => !open && setEditingDevice(null)}
          device={editingDevice}
        />
      )}
    </>
  )
}
