import { createClient } from "@/lib/supabase/client"

/**
 * Generate a unique Employee ID in DAG##### format
 */
export async function generateEmployeeId(): Promise<string> {
  const supabase = createClient()
  
  try {
    // Get all existing employee IDs that match our pattern
    const { data: existingIds, error } = await supabase
      .from("profiles")
      .select("employee_id")
      .like("employee_id", "DAG%")
      .not("employee_id", "is", null)

    if (error) {
      console.error("Error fetching existing employee IDs:", error)
      throw error
    }

    // Extract numbers from existing IDs and find the highest
    let maxNumber = 0
    if (existingIds && existingIds.length > 0) {
      existingIds.forEach((record) => {
        const id = record.employee_id
        if (id && id.startsWith("DAG") && id.length === 8) {
          const numberPart = id.substring(3) // Remove "DAG" prefix
          const num = parseInt(numberPart, 10)
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num
          }
        }
      })
    }

    // Generate next sequential ID
    const nextNumber = maxNumber + 1
    const newEmployeeId = `DAG${nextNumber.toString().padStart(5, "0")}`

    // Double-check this ID doesn't exist (race condition safety)
    const { data: existingCheck } = await supabase
      .from("profiles")
      .select("id")
      .eq("employee_id", newEmployeeId)
      .single()

    if (existingCheck) {
      // If somehow this ID exists, recursively try again
      return generateEmployeeId()
    }

    return newEmployeeId
  } catch (error) {
    console.error("Error generating employee ID:", error)
    throw new Error("Failed to generate employee ID")
  }
}

/**
 * Create a new employee profile with auto-generated Employee ID
 */
export async function createEmployeeProfile(
  userId: string,
  userData: {
    email: string
    full_name: string
    role: string
    phone?: string
    department_id?: string
  }
): Promise<{ employee_id: string | null }> {
  const supabase = createClient()

  try {
    // Generate Employee ID only for employees (not admin/hr)
    let employeeId: string | null = null
    if (userData.role === "employee") {
      employeeId = await generateEmployeeId()
    }

    // Create the profile
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
        employee_id: employeeId,
        phone: userData.phone || null,
        department_id: userData.department_id || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating employee profile:", error)
      throw error
    }

    return { employee_id: employeeId }
  } catch (error) {
    console.error("Error in createEmployeeProfile:", error)
    throw error
  }
}