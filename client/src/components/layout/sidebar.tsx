"use client"

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { WalletConnect } from "@/components/wallet/wallet-connect";
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  Globe, 
  Target, 
  PieChart, 
  Settings, 
  HelpCircle,
  CreditCard,
  FileCheck
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
    <Link href={href}>
      <a
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
          isActive 
            ? "text-primary" 
            : "text-muted-foreground hover:text-primary"
        )}
      >
        {icon}
        {children}
      </a>
    </Link>
  );
};

export const Sidebar = () => {
  const [location] = useLocation();
  
  return (
    <aside className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72">
      <div className="flex h-full max-h-screen flex-col pb-12">
        {/* Wallet Connection Section */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="w-full">
            <WalletConnect />
          </div>
        </div>
        
        {/* Main Navigation */}
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <SidebarLink 
              href="/dashboard" 
              icon={<LayoutDashboard className="h-4 w-4" />}
              isActive={location === "/dashboard"}
            >
              Dashboard
            </SidebarLink>
            
            <SidebarLink 
              href="/accounts" 
              icon={<PlusCircle className="h-4 w-4" />}
              isActive={location === "/accounts"}
            >
              Accounts
            </SidebarLink>
            
            <SidebarLink 
              href="/transactions" 
              icon={<FileText className="h-4 w-4" />}
              isActive={location === "/transactions"}
            >
              Transactions
            </SidebarLink>
            
            <SidebarLink 
              href="/budget" 
              icon={<Globe className="h-4 w-4" />}
              isActive={location === "/budget"}
            >
              Budget
            </SidebarLink>
            
            <SidebarLink 
              href="/goals" 
              icon={<Target className="h-4 w-4" />}
              isActive={location === "/goals"}
            >
              Goals
            </SidebarLink>
            
            <SidebarLink 
              href="/reports" 
              icon={<PieChart className="h-4 w-4" />}
              isActive={location === "/reports"}
            >
              Reports
            </SidebarLink>
            
            <SidebarLink 
              href="/settings" 
              icon={<Settings className="h-4 w-4" />}
              isActive={location === "/settings"}
            >
              Settings
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
        
        {/* Support/Help Link at bottom */}
        <div className="mt-auto">
          <nav className="grid items-start px-2 text-sm font-medium">
            <SidebarLink 
              href="/help" 
              icon={<HelpCircle className="h-4 w-4" />}
              isActive={location === "/help"}
            >
              Help & Support
            </SidebarLink>
          </nav>
        </div>
      </div>
    </aside>
  );
};
