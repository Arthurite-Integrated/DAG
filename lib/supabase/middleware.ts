import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // IMPORTANT: Do not run code between createServerClient and getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check for static admin session (from localStorage, passed via client-side redirect)
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isStaticAdmin = request.headers.get('x-static-admin') === 'true'

  // Allow access to admin routes if it's a static admin session
  if (isAdminRoute && isStaticAdmin) {
    return supabaseResponse
  }

  // Redirect to login if not authenticated and not already on auth pages
  if (!user && !request.nextUrl.pathname.startsWith("/auth") && request.nextUrl.pathname !== "/" && !isAdminRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Redirect non-admin users away from admin routes
  if (isAdminRoute && !isStaticAdmin && user) {
    // Check if regular user has admin/hr role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
    
    if (profile?.role !== "admin" && profile?.role !== "hr") {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
