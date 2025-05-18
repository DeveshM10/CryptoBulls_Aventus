"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { useMobile } from "@/hooks/use-mobile"
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  Menu,
  PieChart,
  Settings,
  TrendingUp,
  Wallet,
  BookOpen,
  Award,
  Database,
  FileText,
  User,
  Bell,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  section?: string
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    section: "Main",
  },
  {
    title: "Assets",
    href: "/assets",
    icon: <Wallet className="h-5 w-5" />,
    section: "Finance",
  },
  {
    title: "Liabilities",
    href: "/liabilities",
    icon: <CreditCard className="h-5 w-5" />,
    section: "Finance",
  },
  {
    title: "Budget & Surplus",
    href: "/budget",
    icon: <DollarSign className="h-5 w-5" />,
    section: "Finance",
  },
  {
    title: "Score Simulator",
    href: "/score",
    icon: <TrendingUp className="h-5 w-5" />,
    section: "Analysis",
  },
  {
    title: "Compare",
    href: "/compare",
    icon: <BarChart3 className="h-5 w-5" />,
    section: "Analysis",
  },
  {
    title: "Learn",
    href: "/learn",
    icon: <BookOpen className="h-5 w-5" />,
    section: "Extra",
  },
  {
    title: "Streaks",
    href: "/streaks",
    icon: <Award className="h-5 w-5" />,
    section: "Extra",
  },
  {
    title: "Blockchain",
    href: "/blockchain",
    icon: <Database className="h-5 w-5" />,
    section: "Extra",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: <FileText className="h-5 w-5" />,
    section: "Extra",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
    section: "Extra",
  },
]

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [date, setDate] = useState<string>("")

  useEffect(() => {
    const now = new Date()
    setDate(now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }))
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                <PieChart className="h-6 w-6" />
                <span>FinVault</span>
              </Link>
              <div className="grid gap-1">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary",
                      pathname === item.href && "bg-muted font-semibold text-primary",
                    )}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <PieChart className="h-6 w-6" />
          <span className="hidden md:inline-block">FinVault</span>
        </Link>
        <div className="flex-1 flex justify-center">
          <span className="text-sm text-muted-foreground hidden md:inline-block">{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <ModeToggle />
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </header>
      <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <nav className="grid gap-6 p-6">
            <div className="grid gap-1">
              {Object.entries(
                navItems.reduce<Record<string, NavItem[]>>((acc, item) => {
                  const section = item.section || "Other"
                  acc[section] = acc[section] || []
                  acc[section].push(item)
                  return acc
                }, {}),
              ).map(([section, items]) => (
                <div key={section} className="mb-4">
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{section}</h3>
                  {items.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href && "bg-accent text-accent-foreground",
                      )}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
