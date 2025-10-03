"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { createEmployeeProfile } from "@/lib/utils/employee-id"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<string>("employee")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [supabaseError, setSupabaseError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      createClient()
    } catch (err) {
      console.error("[v0] Failed to initialize Supabase:", err)
      setSupabaseError(err instanceof Error ? err.message : "Failed to connect to authentication service")
    }
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })

      if (authError) throw authError

      // Create employee profile with auto-generated Employee ID
      if (authData.user) {
        await createEmployeeProfile(authData.user.id, {
          email,
          full_name: fullName,
          role,
        })
      }

      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      console.error("[v0] Sign up error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (supabaseError) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Connection Error</CardTitle>
            <CardDescription>Unable to connect to the authentication service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{supabaseError}</p>
            </div>
            <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-200 font-medium mb-1">Setup Required</p>
                  <p className="text-xs text-amber-300/80 mb-2">
                    Please ensure your Supabase integration is configured and the database is set up.
                  </p>
                </div>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <img src="/dag-logo.png" alt="DAG Industries" className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">DAG Industries</h1>
          <p className="mt-2 text-sm text-muted-foreground">Create New Employee Account</p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-card-foreground">Sign Up</CardTitle>
            <CardDescription className="text-muted-foreground">Register a new employee account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="text-card-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border-input bg-background text-foreground"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-card-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="employee@dagindustries.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-input bg-background text-foreground"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role" className="text-card-foreground">
                    Role
                  </Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="border-input bg-background text-foreground">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-card-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-input bg-background text-foreground"
                  />
                </div>
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#15356E] text-white hover:bg-[#15356E]/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-[#15356E] hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
