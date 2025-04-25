import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, LineChart, PieChart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ComparePage() {
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
            <a className="font-medium transition-colors hover:text-primary" href="/compare">Compare</a>
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
            <h1 className="text-2xl font-bold">Financial Comparisons</h1>
            <div className="flex gap-2">
              <Select defaultValue="monthly">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Income vs. Expenses</CardTitle>
                <CardDescription>Compare your income against expenses over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center relative">
                <LineChart className="h-16 w-16 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground absolute">Income vs expenses chart will display here</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation Comparison</CardTitle>
                <CardDescription>Compare your asset allocation against recommended</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center relative">
                <PieChart className="h-16 w-16 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground absolute">Asset allocation comparison chart will display here</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>This month vs previous month</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center relative">
                <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground absolute">Spending comparison chart will display here</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Net Worth Growth</CardTitle>
                <CardDescription>Your progress compared to average</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center relative">
                <LineChart className="h-16 w-16 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground absolute">Net worth comparison chart will display here</p>
              </CardContent>
            </Card>

            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Your Financial Health</CardTitle>
                <CardDescription>How your finances compare to recommended benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="text-sm font-medium mb-2">Debt-to-Income Ratio</div>
                      <div className="flex items-end gap-2">
                        <div className="text-2xl font-bold">24%</div>
                        <div className="text-sm text-muted-foreground">(Recommended: &lt;36%)</div>
                      </div>
                      <div className="text-xs text-green-500 mt-2">Excellent</div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="text-sm font-medium mb-2">Emergency Fund</div>
                      <div className="flex items-end gap-2">
                        <div className="text-2xl font-bold">4.2 months</div>
                        <div className="text-sm text-muted-foreground">(Recommended: 3-6 months)</div>
                      </div>
                      <div className="text-xs text-green-500 mt-2">Good</div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="text-sm font-medium mb-2">Savings Rate</div>
                      <div className="flex items-end gap-2">
                        <div className="text-2xl font-bold">18%</div>
                        <div className="text-sm text-muted-foreground">(Recommended: &gt;20%)</div>
                      </div>
                      <div className="text-xs text-yellow-500 mt-2">Almost There</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}