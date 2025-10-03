import { createClient } from "@/lib/supabase/server"
import type { Profile } from "@/lib/types"

export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Return null if table doesn't exist or profile not found
  if (error) {
    return null
  }

  return profile
}

export async function hasRole(allowedRoles: string[]): Promise<boolean> {
  const profile = await getCurrentProfile()

  if (!profile) {
    return false
  }

  return allowedRoles.includes(profile.role)
}
