"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { Profile } from "@/lib/types"

interface SettingsViewProps {
  profile: Profile
}

export function SettingsView({ profile }: SettingsViewProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [profileData, setProfileData] = useState({
    fullName: profile.full_name,
    phone: profile.phone || "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: profileData.fullName,
          phone: profileData.phone || null,
        })
        .eq("id", profile.id)

      if (updateError) throw updateError

      setSuccess("Profile updated successfully")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (updateError) throw updateError

      setSuccess("Password updated successfully")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Profile Information</CardTitle>
          <CardDescription className="text-muted-foreground">Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile}>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile.email} disabled className="bg-muted" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" value={profile.employee_id || "Not assigned"} disabled className="bg-muted" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={profile.role.toUpperCase()} disabled className="bg-muted" />
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-md bg-green-500/10 p-3">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              <Button type="submit" className="bg-[#15356E] text-white hover:bg-[#15356E]/90" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Change Password</CardTitle>
          <CardDescription className="text-muted-foreground">Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword}>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="bg-[#15356E] text-white hover:bg-[#15356E]/90" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
