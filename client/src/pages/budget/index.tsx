import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Plus, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function BudgetPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <a className="mr-6 flex items-center gap-2 md:mr-8" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="font-bold">FinVault</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="font-medium transition-colors hover:text-primary" href="/">Dashboard</a>
            <a className="font-medium transition-colors hover:text-primary" href="/assets">Assets</a>
            <a className="font-medium transition-colors hover:text-primary" href="/liabilities">Liabilities</a>
            <a className="font-medium transition-colors hover:text-primary text-primary" href="/budget">Budget</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area with padding for fixed sidebar */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 ml-0 md:ml-64 lg:ml-72">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Monthly Budget</h1>
            <div className="flex gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Budget Item
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$5,240.00</div>
                <div className="flex items-center space-x-2 text-xs mt-1">
                  <span className="text-muted-foreground">Monthly allocation</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$3,185.25</div>
                <div className="flex items-center space-x-2 text-xs mt-1">
                  <div className="flex items-center text-green-500">
                    <span>60.8% of budget used</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,054.75</div>
                <div className="flex items-center space-x-2 text-xs mt-1">
                  <div className="flex items-center text-green-500">
                    <span>39.2% of budget remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Budget Categories</CardTitle>
              <CardDescription>Track your spending against your budget by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Housing */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium">Housing</span>
                    </div>
                    <span className="text-sm font-medium">$1,200 / $1,500</span>
                  </div>
                  <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: "80%" }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">80% used</span>
                    <span className="text-xs text-muted-foreground">$300 remaining</span>
                  </div>
                </div>

                {/* Groceries */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium">Groceries</span>
                    </div>
                    <span className="text-sm font-medium">$425 / $600</span>
                  </div>
                  <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: "70.8%" }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">70.8% used</span>
                    <span className="text-xs text-muted-foreground">$175 remaining</span>
                  </div>
                </div>

                {/* Utilities */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium">Utilities</span>
                    </div>
                    <span className="text-sm font-medium">$310.25 / $350</span>
                  </div>
                  <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: "88.6%" }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">88.6% used</span>
                    <span className="text-xs text-muted-foreground">$39.75 remaining</span>
                  </div>
                </div>

                {/* Transportation */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium">Transportation</span>
                    </div>
                    <span className="text-sm font-medium">$285 / $400</span>
                  </div>
                  <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: "71.25%" }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">71.25% used</span>
                    <span className="text-xs text-muted-foreground">$115 remaining</span>
                  </div>
                </div>

                {/* Entertainment */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="font-medium">Entertainment</span>
                    </div>
                    <span className="text-sm font-medium text-red-500">$350 / $300</span>
                  </div>
                  <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: "116.7%" }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-red-500">116.7% used</span>
                    <span className="text-xs text-red-500">$50 over budget</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Where your money is going this month</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center relative">
                <PieChart className="h-16 w-16 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground absolute">Spending by category chart will display here</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trend</CardTitle>
                <CardDescription>Your spending patterns over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Monthly spending trend chart will display here</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}