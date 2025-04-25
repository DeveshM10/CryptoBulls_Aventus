"use client"

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { WalletConnect } from "@/components/wallet/wallet-connect";
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
  Wrench
} from "lucide-react";

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
  const [location] = useLocation();
  
  return (
    <aside className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72 fixed h-full">
      <div className="flex flex-col h-full">
        {/* Wallet Connection Section */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="w-full">
            <WalletConnect />
          </div>
        </div>
        
        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          <nav className="grid items-start px-2 text-sm font-medium gap-1">
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
              Blockchain Settings
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
