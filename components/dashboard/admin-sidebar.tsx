"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  Building2,
  Settings,
  Users,
  UserPlus,
  TrendingUp,
  FileText,
  Shield,
  LogOut,
  Home
} from "lucide-react"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Employees",
    href: "/admin/employees",
    icon: Users,
  },
  {
    title: "Create Employee",
    href: "/admin/employees/create",
    icon: UserPlus,
  },
  {
    title: "Departments",
    href: "/admin/departments",
    icon: Building2,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: TrendingUp,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem("isStaticAdmin")
    // For regular users, we'd also call supabase.auth.signOut()
    window.location.href = "/auth/login"
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-[#15356E]" />
          <span className="text-lg font-semibold">Admin Panel</span>
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-4 py-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive && "bg-[#15356E]/10 text-[#15356E]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="mb-3 text-center">
          <p className="text-sm font-medium">System Administrator</p>
          <p className="text-xs text-muted-foreground">admin@dagindustries.com</p>
        </div>
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}