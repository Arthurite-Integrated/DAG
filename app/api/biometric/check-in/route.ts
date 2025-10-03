import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()

    const { device_id, employee_id, biometric_data, action } = body

    // Validate required fields
    if (!device_id || !employee_id || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify device exists and is active
    const { data: device, error: deviceError } = await supabase
      .from("biometric_devices")
      .select("*")
      .eq("device_id", device_id)
      .eq("status", "active")
      .single()

    if (deviceError || !device) {
      return NextResponse.json({ error: "Invalid or inactive device" }, { status: 403 })
    }

    // Find employee by employee_id
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("employee_id", employee_id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    // Check if employee already has attendance for today
    const today = new Date().toISOString().split("T")[0]
    const { data: existingAttendance } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("user_id", profile.id)
      .gte("check_in_time", `${today}T00:00:00`)
      .lte("check_in_time", `${today}T23:59:59`)
      .order("check_in_time", { ascending: false })
      .limit(1)
      .single()

    if (action === "check-in") {
      if (existingAttendance && !existingAttendance.check_out_time) {
        return NextResponse.json({ error: "Already checked in today" }, { status: 400 })
      }

      // Create new attendance record
      const { data: attendance, error: attendanceError } = await supabase
        .from("attendance_records")
        .insert({
          user_id: profile.id,
          check_in_time: new Date().toISOString(),
          status: "present",
          check_in_method: "biometric",
          device_id: device.id,
        })
        .select()
        .single()

      if (attendanceError) {
        return NextResponse.json({ error: "Failed to record check-in" }, { status: 500 })
      }

      // Update device last sync
      await supabase.from("biometric_devices").update({ last_sync: new Date().toISOString() }).eq("id", device.id)

      return NextResponse.json({
        success: true,
        message: "Check-in successful",
        employee: {
          name: profile.full_name,
          employee_id: profile.employee_id,
        },
        attendance: attendance,
      })
    } else if (action === "check-out") {
      if (!existingAttendance) {
        return NextResponse.json({ error: "No check-in record found for today" }, { status: 400 })
      }

      if (existingAttendance.check_out_time) {
        return NextResponse.json({ error: "Already checked out today" }, { status: 400 })
      }

      // Update attendance record with check-out time
      const { data: attendance, error: attendanceError } = await supabase
        .from("attendance_records")
        .update({
          check_out_time: new Date().toISOString(),
        })
        .eq("id", existingAttendance.id)
        .select()
        .single()

      if (attendanceError) {
        return NextResponse.json({ error: "Failed to record check-out" }, { status: 500 })
      }

      // Update device last sync
      await supabase.from("biometric_devices").update({ last_sync: new Date().toISOString() }).eq("id", device.id)

      return NextResponse.json({
        success: true,
        message: "Check-out successful",
        employee: {
          name: profile.full_name,
          employee_id: profile.employee_id,
        },
        attendance: attendance,
      })
    } else {
      return NextResponse.json({ error: 'Invalid action. Must be "check-in" or "check-out"' }, { status: 400 })
    }
  } catch (error: any) {
    console.error("[v0] Biometric check-in error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
