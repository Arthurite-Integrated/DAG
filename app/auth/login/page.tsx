"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Check for static admin credentials first
      if (email === "admin@dagindustries.com" && password === "AdminDAG2025!") {
        console.log("[v0] Login: Static admin login successful")
        // Store admin session in localStorage for identification
        localStorage.setItem("isStaticAdmin", "true")
        window.location.href = "/admin"
        return
      }

      // Regular Supabase authentication for employees
      const supabase = createClient()

      console.log("[v0] Login: Attempting sign in for", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("[v0] Login: Sign in error:", error)
        throw error
      }

      console.log("[v0] Login: Sign in successful, user:", data.user?.email)
      console.log("[v0] Login: Session:", data.session ? "exists" : "missing")

      // Fetch user profile to determine redirect
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profile?.role === "admin" || profile?.role === "hr") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/dashboard"
      }
    } catch (error: unknown) {
      console.error("[v0] Login error:", error)
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
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-amber-800 text-amber-200 hover:bg-amber-950/50 bg-transparent"
                  >
                    <Link href="/setup">View Setup Instructions</Link>
                  </Button>
                </div>
              </div>
            </div>
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
            <img src="/logo.png" alt="DAG Industries" className="h-16 w-auto" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Attendance Monitoring System</p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-card-foreground">Sign In</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-card-foreground">
                      Password
                    </Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
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
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/sign-up" className="text-[#15356E] hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Admin Login Hint */}
            <div className="mt-4 rounded-lg border border-blue-900/50 bg-blue-950/20 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-200 font-medium mb-1">Admin Access</p>
                  <p className="text-xs text-blue-300/80 mb-2">
                    <strong>Email:</strong> admin@dagindustries.com<br />
                    <strong>Password:</strong> AdminDAG2025!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">© 2025 DAG Industries. All rights reserved.</p>
      </div>
    </div>
  )
}
