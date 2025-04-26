"use client"

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { WalletConnect } from "@/components/wallet/wallet-connect";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Wallet, 
  FileText, 
  BookOpen, 
  Target, 
  PieChart, 
  Settings, 
  HelpCircle,
  CreditCard,
  FileCheck,
  BarChart3,
  Coins,
  DollarSign,
  Briefcase,
  GraduationCap,
  Wrench,
  LogOut,
  User,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon,
  children,
  isActive = false,
}) => {
  return (
    <Link href={href} className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
      isActive 
        ? "text-primary" 
        : "text-muted-foreground hover:text-primary"
    )}>
      {icon}
      {children}
    </Link>
  );
};

export const Sidebar = () => {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  return (
    <aside className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72 fixed top-0 bottom-0 left-0 overflow-visible">
      <div className="flex flex-col h-screen overflow-y-auto">
        {/* Top Section with Wallet and User Profile */}
        <div className="flex items-center justify-between px-4 py-4 border-b sticky top-0 bg-muted/40 z-10">
          <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="font-bold">FinVault</span>
          </Link>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user ? `Hello, ${user.username}` : 'My Account'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isLoading}>
                  {logoutMutation.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Wallet Connection Section */}
        <div className="flex flex-col gap-4 px-4 py-4 sticky top-[73px] bg-muted/40 z-10">
          {/* FinVault Logo - Added above Wallet Connect */}
          <Link href="/" className="flex items-center justify-center gap-2 bg-primary/10 p-3 rounded-lg w-full transition-colors hover:bg-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="font-bold text-lg">FinVault</span>
          </Link>

          <div className="w-full">
            <WalletConnect />
          </div>
        </div>

        {/* Main Navigation */}
        <div className="py-2 flex-1 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium gap-2 pb-16">
            <SidebarLink 
              href="/dashboard" 
              icon={<LayoutDashboard className="h-4 w-4" />}
              isActive={location === "/dashboard" || location === "/"}
            >
              Dashboard
            </SidebarLink>

            <SidebarLink 
              href="/assets" 
              icon={<Wallet className="h-4 w-4" />}
              isActive={location === "/assets"}
            >
              Assets
            </SidebarLink>

            <SidebarLink 
              href="/liabilities" 
              icon={<Coins className="h-4 w-4" />}
              isActive={location === "/liabilities"}
            >
              Liabilities
            </SidebarLink>

            <SidebarLink 
              href="/credit-score" 
              icon={<CreditCard className="h-4 w-4" />}
              isActive={location === "/credit-score"}
            >
              Credit Score
            </SidebarLink>

            <SidebarLink 
              href="/compare" 
              icon={<BarChart3 className="h-4 w-4" />}
              isActive={location === "/compare"}
            >
              Compare
            </SidebarLink>

            <SidebarLink 
              href="/budget" 
              icon={<DollarSign className="h-4 w-4" />}
              isActive={location === "/budget"}
            >
              Budget
            </SidebarLink>

            <SidebarLink 
              href="/learning-hub" 
              icon={<GraduationCap className="h-4 w-4" />}
              isActive={location === "/learning-hub"}
            >
              Learning Hub
            </SidebarLink>

            <SidebarLink 
              href="/tools" 
              icon={<Wrench className="h-4 w-4" />}
              isActive={location === "/tools"}
            >
              Tools
            </SidebarLink>

            <SidebarLink 
              href="/blockchain" 
              icon={<Briefcase className="h-4 w-4" />}
              isActive={location === "/blockchain"}
            >
              Blockchain
            </SidebarLink>

            <SidebarLink 
              href="/settings" 
              icon={<Settings className="h-4 w-4" />}
              isActive={location === "/settings"}
            >
              Settings
            </SidebarLink>

            <SidebarLink 
              href="/reports" 
              icon={<PieChart className="h-4 w-4" />}
              isActive={location === "/reports"}
            >
              Reports
            </SidebarLink>

            {/* KYC Link - Added as requested */}
            <SidebarLink 
              href="/kyc" 
              icon={<FileCheck className="h-4 w-4" />}
              isActive={location === "/kyc"}
            >
              KYC
            </SidebarLink>
          </nav>
        </div>
      </div>
    </aside>
  );
};