import { createClient } from "@/lib/supabase/client"
import { generateEmployeeId } from "./employee-id"

/**
 * Assign Employee IDs to existing employees who don't have them
 */
export async function assignMissingEmployeeIds(): Promise<{ updated: number; errors: string[] }> {
  const supabase = createClient()
  let updated = 0
  const errors: string[] = []

  try {
    // Get all employees without Employee IDs
    const { data: employeesWithoutIds, error } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "employee")
      .is("employee_id", null)

    if (error) {
      throw error
    }

    if (!employeesWithoutIds || employeesWithoutIds.length === 0) {
      return { updated: 0, errors: [] }
    }

    console.log(`Found ${employeesWithoutIds.length} employees without Employee IDs`)

    // Process each employee
    for (const employee of employeesWithoutIds) {
      try {
        const employeeId = await generateEmployeeId()
        
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ employee_id: employeeId })
          .eq("id", employee.id)

        if (updateError) {
          errors.push(`Failed to update ${employee.full_name}: ${updateError.message}`)
        } else {
          updated++
          console.log(`Assigned ${employeeId} to ${employee.full_name}`)
        }
      } catch (error) {
        errors.push(`Error processing ${employee.full_name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return { updated, errors }
  } catch (error) {
    console.error("Error in assignMissingEmployeeIds:", error)
    throw error
  }
}

/**
 * Get next available Employee ID (for preview/testing)
 */
export async function getNextEmployeeId(): Promise<string> {
  try {
    const nextId = await generateEmployeeId()
    return nextId
  } catch (error) {
    console.error("Error getting next Employee ID:", error)
    throw error
  }
}