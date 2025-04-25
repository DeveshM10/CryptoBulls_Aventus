import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddAssetForm } from "@/components/asset/add-asset-form";
import { AddLiabilityForm } from "@/components/liability/add-liability-form";
import { AddExpenseForm } from "@/components/budget/add-expense-form";
import { AssetDistributionChart } from "@/components/asset/asset-distribution-chart";
import { LiabilityDistributionChart } from "@/components/liability/liability-distribution-chart";
import { ComparisonChart } from "@/components/comparison-chart";
import { BudgetChart } from "@/components/budget/budget-chart";
import { useQuery } from "@tanstack/react-query";
import { ModeToggle } from "@/components/mode-toggle";
import { User } from "lucide-react";

export function DashboardPage({ initialTab = "assets" }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Fetch the current user
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    queryFn: async () => {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return response.json();
    }
  });

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - made scrollable */}
      <div className="w-64 border-r bg-card overflow-y-auto fixed h-full">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span className="font-bold text-xl">FinVault</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg border mb-6">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.username || "User"}</span>
                <span className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</span>
              </div>
            </div>
          </div>
          <nav className="flex-1">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight">Dashboard</h2>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab("assets")}
                  className={`w-full flex items-center justify-start rounded-lg px-4 py-2 text-sm font-medium ${activeTab === "assets" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  Assets
                </button>
                <button
                  onClick={() => setActiveTab("liabilities")}
                  className={`w-full flex items-center justify-start rounded-lg px-4 py-2 text-sm font-medium ${activeTab === "liabilities" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  Liabilities
                </button>
                <button
                  onClick={() => setActiveTab("comparison")}
                  className={`w-full flex items-center justify-start rounded-lg px-4 py-2 text-sm font-medium ${activeTab === "comparison" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  Comparison
                </button>
                <button
                  onClick={() => setActiveTab("budget")}
                  className={`w-full flex items-center justify-start rounded-lg px-4 py-2 text-sm font-medium ${activeTab === "budget" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  Budget
                </button>
              </div>
            </div>
          </nav>
          <div className="p-6">
            <ModeToggle />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Main content */}
        <main className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">
              {activeTab === "assets" ? "Assets" : 
               activeTab === "liabilities" ? "Liabilities" : 
               activeTab === "comparison" ? "Financial Overview" : 
               "Budget Management"}
            </h1>
            <div>
              {activeTab === "assets" && <AddAssetForm />}
              {activeTab === "liabilities" && <AddLiabilityForm />}
              {activeTab === "budget" && <AddExpenseForm />}
            </div>
          </div>
          
          {/* Dynamically show content based on active tab */}
          <div className="grid gap-6">
            {activeTab === "assets" && (
              <AssetDistributionChart />
            )}
            
            {activeTab === "liabilities" && (
              <LiabilityDistributionChart />
            )}
            
            {activeTab === "comparison" && (
              <ComparisonChart />
            )}
            
            {activeTab === "budget" && (
              <BudgetChart />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}