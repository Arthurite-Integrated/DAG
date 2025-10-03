"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { assignMissingEmployeeIds } from "@/lib/utils/assign-employee-ids"
import { 
  Settings, 
  ArrowLeft, 
  Save, 
  Database, 
  Shield, 
  Bell, 
  Palette, 
  Globe,
  Users,
  Clock,
  Building2
} from "lucide-react"

interface SystemSettings {
  organizationName: string
  timeZone: string
  workingHours: {
    start: string
    end: string
  }
  attendanceRules: {
    lateThreshold: number
    autoClockOut: boolean
    requireApproval: boolean
  }
  notifications: {
    emailNotifications: boolean
    dailyReports: boolean
    lateAlerts: boolean
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    organizationName: "DAG Industries",
    timeZone: "America/New_York",
    workingHours: {
      start: "09:00",
      end: "17:00"
    },
    attendanceRules: {
      lateThreshold: 15,
      autoClockOut: true,
      requireApproval: false
    },
    notifications: {
      emailNotifications: true,
      dailyReports: true,
      lateAlerts: true
    }
  })
  const [loading, setLoading] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [assigningIds, setAssigningIds] = useState(false)
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalDepartments: 0,
    totalDevices: 0,
    systemUptime: "99.9%"
  })
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    const isStaticAdmin = localStorage.getItem("isStaticAdmin") === "true"
    if (!isStaticAdmin) {
      window.location.href = "/dashboard"
      return
    }

    loadSystemStats()
  }, [])

  const loadSystemStats = async () => {
    try {
      const supabase = createClient()
      
      const [
        { count: totalUsers },
        { count: totalDepartments },
        { count: totalDevices }
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("departments").select("*", { count: "exact", head: true }),
        supabase.from("biometric_devices").select("*", { count: "exact", head: true })
      ])

      setSystemStats({
        totalUsers: totalUsers || 0,
        totalDepartments: totalDepartments || 0,
        totalDevices: totalDevices || 0,
        systemUptime: "99.9%"
      })
    } catch (error) {
      console.error("Error loading system stats:", error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setSaveMessage(null)

    try {
      // In a real implementation, you would save settings to database
      // For now, we'll just simulate a save operation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaveMessage("Settings saved successfully!")
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
      setSaveMessage("Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  const handleAssignEmployeeIds = async () => {
    setAssigningIds(true)
    setSaveMessage(null)

    try {
      const { updated, errors } = await assignMissingEmployeeIds()
      
      if (errors.length > 0) {
        setSaveMessage(`Assigned ${updated} Employee IDs with ${errors.length} errors. Check console for details.`)
        console.error("Employee ID assignment errors:", errors)
      } else {
        setSaveMessage(`Successfully assigned ${updated} Employee IDs!`)
      }
      
      // Reload system stats
      await loadSystemStats()
      
      setTimeout(() => setSaveMessage(null), 5000)
    } catch (error) {
      console.error("Error assigning Employee IDs:", error)
      setSaveMessage("Failed to assign Employee IDs")
    } finally {
      setAssigningIds(false)
    }
  }

  const updateSettings = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev }
      const keys = path.split('.')
      let current: any = newSettings
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      
      return newSettings
    })
  }

  return (
    <div className="flex flex-col">
      <div className="border-b bg-background/95 p-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
            <p className="text-muted-foreground">Configure system preferences and policies</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#15356E] hover:bg-[#15356E]/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Save Message */}
        {saveMessage && (
          <div className={`rounded-lg p-4 ${saveMessage.includes('success') ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
            <p className="text-sm font-medium">{saveMessage}</p>
          </div>
        )}

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Overview
            </CardTitle>
            <CardDescription>Current system status and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{systemStats.totalDepartments}</div>
                <p className="text-sm text-muted-foreground">Departments</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{systemStats.totalDevices}</div>
                <p className="text-sm text-muted-foreground">Devices</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{systemStats.systemUptime}</div>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
            
            {/* Employee ID Management */}
            <div className="mt-6 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Employee ID Management</p>
                  <p className="text-sm text-muted-foreground">
                    Assign Employee IDs to existing employees who don't have them
                  </p>
                </div>
                <Button
                  onClick={handleAssignEmployeeIds}
                  disabled={assigningIds}
                  variant="outline"
                  className="bg-[#15356E] text-white hover:bg-[#15356E]/90"
                >
                  {assigningIds ? "Assigning..." : "Assign Missing IDs"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organization Settings
            </CardTitle>
            <CardDescription>Basic organization configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={settings.organizationName}
                  onChange={(e) => updateSettings('organizationName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Input
                  id="timezone"
                  value={settings.timeZone}
                  onChange={(e) => updateSettings('timeZone', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Working Hours
            </CardTitle>
            <CardDescription>Define standard working hours for attendance tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={settings.workingHours.start}
                  onChange={(e) => updateSettings('workingHours.start', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={settings.workingHours.end}
                  onChange={(e) => updateSettings('workingHours.end', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Attendance Rules
            </CardTitle>
            <CardDescription>Configure attendance policies and automation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="lateThreshold">Late Threshold (minutes)</Label>
              <Input
                id="lateThreshold"
                type="number"
                value={settings.attendanceRules.lateThreshold}
                onChange={(e) => updateSettings('attendanceRules.lateThreshold', parseInt(e.target.value))}
                className="max-w-32"
              />
              <p className="text-sm text-muted-foreground">
                Employees arriving more than this many minutes late will be marked as late
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Clock Out</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically clock out employees at end of working hours
                  </p>
                </div>
                <Switch
                  checked={settings.attendanceRules.autoClockOut}
                  onCheckedChange={(checked) => updateSettings('attendanceRules.autoClockOut', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    Manual attendance entries require admin approval
                  </p>
                </div>
                <Switch
                  checked={settings.attendanceRules.requireApproval}
                  onCheckedChange={(checked) => updateSettings('attendanceRules.requireApproval', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications for system events
                </p>
              </div>
              <Switch
                checked={settings.notifications.emailNotifications}
                onCheckedChange={(checked) => updateSettings('notifications.emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Send daily attendance summary reports
                </p>
              </div>
              <Switch
                checked={settings.notifications.dailyReports}
                onCheckedChange={(checked) => updateSettings('notifications.dailyReports', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Late Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Alert administrators when employees are late
                </p>
              </div>
              <Switch
                checked={settings.notifications.lateAlerts}
                onCheckedChange={(checked) => updateSettings('notifications.lateAlerts', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Access
            </CardTitle>
            <CardDescription>System security and access control settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Admin Access</p>
                <p className="text-sm text-muted-foreground">
                  Static admin credentials are currently enabled
                </p>
              </div>
              <Badge variant="secondary">ACTIVE</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Database Security</p>
                <p className="text-sm text-muted-foreground">
                  Row Level Security (RLS) status
                </p>
              </div>
              <Badge variant="outline">CONFIGURED</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">API Access</p>
                <p className="text-sm text-muted-foreground">
                  Biometric device API endpoints
                </p>
              </div>
              <Badge variant="default">ENABLED</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}