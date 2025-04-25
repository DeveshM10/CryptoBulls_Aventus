import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Plus, TrendingDown, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LiabilitiesPage() {
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
            <a className="font-medium transition-colors hover:text-primary text-primary" href="/liabilities">Liabilities</a>
            <a className="font-medium transition-colors hover:text-primary" href="/budget">Budget</a>
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
            <h1 className="text-2xl font-bold">Liabilities</h1>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Liability
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$38,520.50</div>
                <p className="text-xs text-muted-foreground">
                  -3.2% <span className="ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mortgage</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$32,150.75</div>
                <p className="text-xs text-muted-foreground">
                  -0.8% <span className="ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credit Cards</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$3,850.25</div>
                <p className="text-xs text-muted-foreground">
                  -15.3% <span className="ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Personal Loans</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,519.50</div>
                <p className="text-xs text-muted-foreground">
                  -5.2% <span className="ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Liability Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center border rounded-lg">
              <p className="text-sm text-muted-foreground">Liability distribution chart will display here</p>
            </CardContent>
          </Card>
          
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Liability Payoff Projections</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center border rounded-lg">
              <p className="text-sm text-muted-foreground">Liability reduction projection chart will display here</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}