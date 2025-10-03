"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  Settings,
  Fingerprint,
  LogOut,
  CheckSquare,
  Building2,
  ScanLine,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"

interface SidebarProps {
  profile: Profile
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "hr", "employee"],
    },
    {
      name: "Quick Check-In",
      href: "/check-in",
      icon: ScanLine,
      roles: ["admin", "hr", "employee"],
    },
    {
      name: "My Attendance",
      href: "/dashboard/attendance",
      icon: Clock,
      roles: ["admin", "hr", "employee"],
    },
    {
      name: "Employees",
      href: "/dashboard/employees",
      icon: Users,
      roles: ["admin", "hr"],
    },
    {
      name: "Departments",
      href: "/dashboard/departments",
      icon: Building2,
      roles: ["admin", "hr"],
    },
    {
      name: "Corrections",
      href: "/dashboard/corrections",
      icon: CheckSquare,
      roles: ["admin", "hr", "employee"],
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: FileText,
      roles: ["admin", "hr"],
    },
    {
      name: "Devices",
      href: "/dashboard/devices",
      icon: Fingerprint,
      roles: ["admin"],
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["admin", "hr", "employee"],
    },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.includes(profile.role))

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <img src="/logo.png" alt="DAG Industries" className="h-8 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#15356E] text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#15356E] text-white">
            <span className="text-sm font-semibold">{profile.full_name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-card-foreground">{profile.full_name}</p>
            <p className="truncate text-xs text-muted-foreground capitalize">{profile.role}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
