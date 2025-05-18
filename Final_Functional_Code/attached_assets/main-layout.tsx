"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  PieChart,
  ArrowLeftRight,
  BookOpen,
  Trophy,
  BarChart4,
  Settings,
  LogOut,
  User,
  Bell,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarMain,
  SidebarFooter,
  SidebarNav,
  SidebarNavItem,
  SidebarTrigger,
  SidebarSection,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  // Only show the layout after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar>
          <SidebarHeader>
            <Link href="/dashboard" className="flex items-center gap-2">
              <PieChart className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">FinVault</span>
            </Link>
          </SidebarHeader>
          <SidebarMain>
            <SidebarSection>
              <div className="px-3 py-2">
                <div className="flex items-center gap-3 rounded-md bg-muted p-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">John Doe</span>
                    <span className="text-xs text-muted-foreground">Premium Plan</span>
                  </div>
                </div>
              </div>
            </SidebarSection>
            <SidebarSeparator />
            <SidebarNav>
              <SidebarNavItem
                href="/dashboard"
                title="Dashboard"
                icon={<LayoutDashboard className="h-5 w-5" />}
                isActive={pathname === "/dashboard"}
              />
              <SidebarNavItem
                href="/assets"
                title="Assets"
                icon={<Wallet className="h-5 w-5" />}
                isActive={pathname === "/assets"}
              />
              <SidebarNavItem
                href="/liabilities"
                title="Liabilities"
                icon={<CreditCard className="h-5 w-5" />}
                isActive={pathname === "/liabilities"}
              />
              <SidebarNavItem
                href="/budget"
                title="Budget"
                icon={<PieChart className="h-5 w-5" />}
                isActive={pathname === "/budget"}
              />
              <SidebarNavItem
                href="/score"
                title="Wallet Score"
                icon={<BarChart4 className="h-5 w-5" />}
                isActive={pathname === "/score"}
              />
              <SidebarNavItem
                href="/compare"
                title="Compare"
                icon={<ArrowLeftRight className="h-5 w-5" />}
                isActive={pathname === "/compare"}
              />
              <SidebarNavItem
                href="/learn"
                title="Learn"
                icon={<BookOpen className="h-5 w-5" />}
                isActive={pathname === "/learn"}
              />
              <SidebarNavItem
                href="/streaks"
                title="Streaks"
                icon={<Trophy className="h-5 w-5" />}
                isActive={pathname === "/streaks"}
              />
              <SidebarNavItem
                href="/blockchain"
                title="Blockchain"
                icon={<BarChart4 className="h-5 w-5" />}
                isActive={pathname === "/blockchain"}
              />
            </SidebarNav>
            <SidebarSeparator />
            <SidebarNav>
              <SidebarNavItem
                href="/settings"
                title="Settings"
                icon={<Settings className="h-5 w-5" />}
                isActive={pathname === "/settings"}
              />
              <SidebarNavItem
                href="/reports"
                title="Reports"
                icon={<BarChart4 className="h-5 w-5" />}
                isActive={pathname === "/reports"}
              />
            </SidebarNav>
          </SidebarMain>
          <SidebarFooter>
            <SidebarNavItem href="/login" title="Logout" icon={<LogOut className="h-5 w-5" />} />
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <SidebarTrigger />
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full appearance-none bg-background pl-8 md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
              <ModeToggle />
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
