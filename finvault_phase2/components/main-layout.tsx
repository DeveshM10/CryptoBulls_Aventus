"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
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
  LogOut,
  Search,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Navigation items - each item has a title, href, icon, and section for grouping
const navItems = [
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

export function MainLayout({ children }) {
  const pathname = usePathname()
  const [date, setDate] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Set date
  useEffect(() => {
    const now = new Date()
    setDate(now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }))
  }, [])

  // Group nav items by section
  const navSections = Object.entries(
    navItems.reduce((acc, item) => {
      const section = item.section || "Other"
      acc[section] = acc[section] || []
      acc[section].push(item)
      return acc
    }, {}),
  )

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b backdrop-blur-sm bg-background/80 px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="border-b p-6">
              <Link href="/" className="flex items-center gap-2 text-lg font-bold">
                <PieChart className="h-6 w-6 text-primary" />
                <span>FinVault</span>
              </Link>
            </div>
            <nav className="grid gap-2 p-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors
                    ${pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <PieChart className="h-6 w-6 text-primary" />
          <span className="hidden md:inline-block">FinVault</span>
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full bg-muted/50 border-muted focus-visible:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex-1 md:flex-none flex justify-center">
          <span className="text-sm text-muted-foreground hidden md:inline-block">{date}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-5 w-5 md:hidden" />
            <span className="sr-only">Search</span>
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                {notifications}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile search bar - only shows when search is clicked */}
      {isSearchOpen && (
        <div className="p-4 border-b md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full bg-muted/50 border-muted focus-visible:ring-primary/20"
              autoFocus
            />
          </div>
        </div>
      )}

      <div className="grid flex-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="hidden border-r bg-muted/20 backdrop-blur-sm md:block">
          <div className="flex h-full flex-col">
            <nav className="grid gap-2 p-4">
              {navSections.map(([section, items]) => (
                <div key={section} className="mb-4">
                  <h3 className="mb-2 px-4 text-sm font-semibold text-muted-foreground">{section}</h3>
                  <div className="grid gap-1">
                    {items.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors
                          ${pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-auto p-4">
              <div className="rounded-lg bg-primary/10 p-4">
                <h4 className="mb-2 text-sm font-medium">Need Help?</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Check our documentation or contact support for assistance.
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  View Help Center
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
