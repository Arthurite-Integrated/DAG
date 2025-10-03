"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, LogOut, User } from "lucide-react"
import type { Profile } from "@/lib/types"

export default function CheckInPage() {
  const [employeeId, setEmployeeId] = useState("")
  const [profile, setProfile] = useState<Profile | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [todayAttendance, setTodayAttendance] = useState<any>(null)

  const supabase = createBrowserClient()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (profile) {
      fetchTodayAttendance()
    }
  }, [profile])

  const fetchTodayAttendance = async () => {
    if (!profile) return

    const today = new Date().toISOString().split("T")[0]
    const { data } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("user_id", profile.id)
      .gte("check_in_time", `${today}T00:00:00`)
      .lte("check_in_time", `${today}T23:59:59`)
      .order("check_in_time", { ascending: false })
      .limit(1)
      .single()

    setTodayAttendance(data)
  }

  const handleEmployeeIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      console.log("Searching for Employee ID:", employeeId)
      
      // First, just get the profile without departments join
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("employee_id", employeeId.trim())
        .single()

      console.log("Query result:", { data, error })

      if (error || !data) {
        setMessage({ type: "error", text: "Employee ID not found" })
        setProfile(null)
      } else {
        // If we found the profile, get the department separately if needed
        let profileWithDept = data
        if (data.department_id) {
          const { data: deptData } = await supabase
            .from("departments")
            .select("name")
            .eq("id", data.department_id)
            .single()
          
          if (deptData) {
            profileWithDept = { ...data, departments: deptData }
          }
        }
        
        setProfile(profileWithDept)
        setMessage({ type: "success", text: `Welcome, ${data.full_name}!` })
      }
    } catch (error) {
      console.error("Error searching for employee:", error)
      setMessage({ type: "error", text: "An error occurred" })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    if (!profile) return

    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.from("attendance_records").insert({
        user_id: profile.id,
        check_in_time: new Date().toISOString(),
        status: "present",
        check_in_method: "manual",
      })

      if (error) throw error

      setMessage({ type: "success", text: "Checked in successfully!" })
      await fetchTodayAttendance()
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to check in" })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async () => {
    if (!profile || !todayAttendance) return

    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from("attendance_records")
        .update({
          check_out_time: new Date().toISOString(),
        })
        .eq("id", todayAttendance.id)

      if (error) throw error

      setMessage({ type: "success", text: "Checked out successfully!" })
      await fetchTodayAttendance()
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to check out" })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setProfile(null)
    setEmployeeId("")
    setMessage(null)
    setTodayAttendance(null)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/logo.png" alt="DAG Industries" className="h-16 w-auto" />
          </div>
          <p className="text-gray-400">Attendance Check-In System</p>
        </div>

        {/* Current Time Display */}
        <Card className="bg-zinc-900 border-zinc-800 p-6 mb-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Current Time</p>
            <p className="text-4xl font-bold text-white font-mono">
              {currentTime.toLocaleTimeString("en-US", { hour12: false })}
            </p>
            <p className="text-gray-400 mt-2">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </Card>

        {/* Main Card */}
        <Card className="bg-zinc-900 border-zinc-800 p-8">
          {!profile ? (
            <form onSubmit={handleEmployeeIdSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="employeeId" className="text-white">
                  Employee ID
                </Label>
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="Enter your employee ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white h-14 text-lg"
                  required
                  autoFocus
                />
              </div>

              <Button type="submit" className="w-full h-14 text-lg bg-dag-blue hover:bg-dag-blue/90" disabled={loading}>
                {loading ? "Verifying..." : "Continue"}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Employee Info */}
              <div className="bg-zinc-800 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-dag-blue rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{profile.full_name}</h2>
                    <p className="text-gray-400">{profile.employee_id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-700">
                  <div>
                    <p className="text-gray-400 text-sm">Department</p>
                    <p className="text-white font-medium">{(profile as any).departments?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Role</p>
                    <p className="text-white font-medium capitalize">{profile.role}</p>
                  </div>
                </div>
              </div>

              {/* Today's Attendance Status */}
              {todayAttendance && (
                <div className="bg-zinc-800 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-4">Today's Attendance</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Check In</p>
                      <p className="text-white font-medium">
                        {new Date(todayAttendance.check_in_time).toLocaleTimeString("en-US", {
                          hour12: false,
                        })}
                      </p>
                    </div>
                    {todayAttendance.check_out_time && (
                      <div>
                        <p className="text-gray-400 text-sm">Check Out</p>
                        <p className="text-white font-medium">
                          {new Date(todayAttendance.check_out_time).toLocaleTimeString("en-US", {
                            hour12: false,
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {!todayAttendance && (
                  <Button
                    onClick={handleCheckIn}
                    className="w-full h-14 text-lg bg-dag-blue hover:bg-dag-blue/90"
                    disabled={loading}
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Check In
                  </Button>
                )}

                {todayAttendance && !todayAttendance.check_out_time && (
                  <Button
                    onClick={handleCheckOut}
                    className="w-full h-14 text-lg bg-dag-red hover:bg-dag-red/90"
                    disabled={loading}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Check Out
                  </Button>
                )}

                {todayAttendance && todayAttendance.check_out_time && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                    <p className="text-green-400 font-medium">You have completed your attendance for today</p>
                  </div>
                )}

                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full h-12 border-zinc-700 text-white hover:bg-zinc-800 bg-transparent"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">Need help? Contact IT Support</p>
        </div>
      </div>
    </div>
  )
}
