import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const body = await request.json()

    const { device_id, api_key } = body

    if (!device_id || !api_key) {
      return NextResponse.json({ error: "Missing device_id or api_key" }, { status: 400 })
    }

    // Verify device credentials
    const { data: device, error } = await supabase
      .from("biometric_devices")
      .select("*")
      .eq("device_id", device_id)
      .eq("api_key", api_key)
      .single()

    if (error || !device) {
      return NextResponse.json({ error: "Invalid device credentials" }, { status: 403 })
    }

    // Update last sync time
    await supabase.from("biometric_devices").update({ last_sync: new Date().toISOString() }).eq("id", device.id)

    return NextResponse.json({
      success: true,
      device: {
        id: device.id,
        device_id: device.device_id,
        name: device.name,
        location: device.location,
        status: device.status,
      },
    })
  } catch (error) {
    console.error("[v0] Device verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
