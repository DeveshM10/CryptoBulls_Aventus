"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Overview } from "@/components/dashboard/overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { AssetDistribution } from "@/components/dashboard/asset-distribution"
import { FinancialGoals } from "@/components/dashboard/financial-goals"
import {
  PlusCircle,
  Download,
  RefreshCw,
  Calendar,
  TrendingUp,
  BarChart3,
  Filter,
  ChevronRight,
  FileText,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { DialogForm } from "@/components/ui/dialog-form"

export function DashboardPage() {
  // State for refresh animation and time period filter
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timePeriod, setTimePeriod] = useState("30d")
  const [reportType, setReportType] = useState("pdf")

  // Handle refresh button click
  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh with timeout
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  // Handle report generation
  const handleGenerateReport = (reportName: string) => {
    alert(`Generating ${reportName} report in ${reportType} format. This would download in a real application.`)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Dashboard header with title and action buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your finances.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick stats cards showing key financial metrics */}
      <QuickStats />

      {/* Main dashboard content with tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto md:h-10">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Overview tab content */}
        <TabsContent value="overview" className="space-y-4">
          {/* Financial overview chart and alerts */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-5 overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Financial Overview</CardTitle>
                  <CardDescription>View your assets vs liabilities over time</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <DialogForm
                    title="Add Financial Data Point"
                    description="Add a new data point to your financial overview"
                    triggerButton={
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PlusCircle className="h-4 w-4" />
                        <span className="sr-only">Add</span>
                      </Button>
                    }
                    fields={[
                      {
                        id: "date",
                        label: "Date",
                        type: "text",
                        placeholder: "e.g., Jan 2025",
                        required: true,
                      },
                      {
                        id: "assets",
                        label: "Assets Value",
                        type: "number",
                        placeholder: "e.g., 50000",
                        required: true,
                      },
                      {
                        id: "liabilities",
                        label: "Liabilities Value",
                        type: "number",
                        placeholder: "e.g., 25000",
                        required: true,
                      },
                    ]}
                    onSubmit={(data) => {
                      alert(
                        `Added new data point: ${data.date} - Assets: $${data.assets}, Liabilities: $${data.liabilities}`,
                      )
                    }}
                    submitLabel="Add Data Point"
                  />
                </div>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Smart Alerts</CardTitle>
                <CardDescription>AI-generated suggestions for your finances</CardDescription>
              </CardHeader>
              <CardContent>
                <AlertsPanel />
              </CardContent>
            </Card>
          </div>

          {/* Asset distribution and financial goals */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Asset Distribution</CardTitle>
                <CardDescription>Breakdown of your assets by category</CardDescription>
              </CardHeader>
              <CardContent>
                <AssetDistribution />
              </CardContent>
            </Card>

            <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Financial Goals</CardTitle>
                  <CardDescription>Track your progress towards financial goals</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <FinancialGoals />
              </CardContent>
            </Card>
          </div>

          {/* Recent transactions */}
          <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your recent financial activities</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics tab content */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Monthly Spending Trends
                </CardTitle>
                <CardDescription>Your spending patterns over time</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-[200px] flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Housing</span>
                        <span className="font-medium">$1,450.00</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "35%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Food & Dining</span>
                        <span className="font-medium">$580.00</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "18%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Transportation</span>
                        <span className="font-medium">$325.00</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: "10%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Entertainment</span>
                        <span className="font-medium">$350.00</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: "12%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  View Details <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Income Analysis
                </CardTitle>
                <CardDescription>Your income sources and trends</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-[200px] flex flex-col justify-center">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                        <span className="text-sm">Salary</span>
                      </div>
                      <span className="text-sm font-medium">$4,800.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                        <span className="text-sm">Freelance</span>
                      </div>
                      <span className="text-sm font-medium">$450.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm">Investments</span>
                      </div>
                      <span className="text-sm font-medium">$320.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                        <span className="text-sm">Other</span>
                      </div>
                      <span className="text-sm font-medium">$180.00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  View Details <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-5 w-5 text-primary" />
                  Spending Insights
                </CardTitle>
                <CardDescription>AI-powered spending analysis</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-[200px] flex flex-col justify-center space-y-4">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="text-sm font-medium mb-1">Unusual Spending</h4>
                    <p className="text-xs text-muted-foreground">
                      Your entertainment spending is 25% higher than last month. Consider reviewing your subscriptions.
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="text-sm font-medium mb-1">Savings Opportunity</h4>
                    <p className="text-xs text-muted-foreground">
                      You could save $120/month by refinancing your auto loan at current rates.
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="text-sm font-medium mb-1">Budget Alert</h4>
                    <p className="text-xs text-muted-foreground">
                      You've reached 85% of your dining out budget with 10 days left in the month.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  View All Insights <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Financial Health Score</CardTitle>
              <CardDescription>A comprehensive analysis of your financial health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative mb-4">
                    <svg className="w-32 h-32">
                      <circle
                        className="text-muted stroke-current"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="56"
                        cx="64"
                        cy="64"
                      />
                      <circle
                        className="text-primary stroke-current"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="56"
                        cx="64"
                        cy="64"
                        strokeDasharray="264 352"
                        strokeDashoffset="88"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-bold">75</span>
                      <span className="text-sm text-muted-foreground">out of 100</span>
                    </div>
                  </div>
                  <div className="text-lg font-medium text-primary">Good</div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Debt-to-Income Ratio</span>
                      <span className="font-medium text-emerald-500">Good (28%)</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Emergency Fund</span>
                      <span className="font-medium text-amber-500">Fair (3 months)</span>
                    </div>
                    <Progress value={60} className="h-2" indicatorClassName="bg-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Retirement Savings</span>
                      <span className="font-medium text-emerald-500">Good (15% of income)</span>
                    </div>
                    <Progress value={75} className="h-2" indicatorClassName="bg-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Credit Utilization</span>
                      <span className="font-medium text-rose-500">Needs Improvement (45%)</span>
                    </div>
                    <Progress value={40} className="h-2" indicatorClassName="bg-rose-500" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Personalized Improvement Plan</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Reports tab content */}
        <TabsContent value="reports" className="space-y-4">
          <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Generate and download financial reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border border-dashed hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Calendar className="h-10 w-10 text-primary/60 mb-4" />
                    <h3 className="font-medium mb-1">Monthly Summary</h3>
                    <p className="text-sm text-muted-foreground mb-4">Complete overview of your monthly finances</p>
                    <div className="flex w-full gap-2 mt-auto">
                      <Select defaultValue="pdf" onValueChange={setReportType} className="w-1/2">
                        <SelectTrigger>
                          <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="xlsx">Excel</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-1/2"
                        onClick={() => handleGenerateReport("Monthly Summary")}
                      >
                        Generate
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-dashed hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <BarChart3 className="h-10 w-10 text-primary/60 mb-4" />
                    <h3 className="font-medium mb-1">Expense Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">Detailed breakdown of all your expenses</p>
                    <div className="flex w-full gap-2 mt-auto">
                      <Select defaultValue="pdf" onValueChange={setReportType} className="w-1/2">
                        <SelectTrigger>
                          <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="xlsx">Excel</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-1/2"
                        onClick={() => handleGenerateReport("Expense Report")}
                      >
                        Generate
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-dashed hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <TrendingUp className="h-10 w-10 text-primary/60 mb-4" />
                    <h3 className="font-medium mb-1">Growth Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-4">Track your financial growth over time</p>
                    <div className="flex w-full gap-2 mt-auto">
                      <Select defaultValue="pdf" onValueChange={setReportType} className="w-1/2">
                        <SelectTrigger>
                          <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="xlsx">Excel</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-1/2"
                        onClick={() => handleGenerateReport("Growth Analysis")}
                      >
                        Generate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Create a customized financial report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Select Report Sections</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="income" className="mr-2" defaultChecked />
                        <label htmlFor="income" className="text-sm">
                          Income Summary
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="expenses" className="mr-2" defaultChecked />
                        <label htmlFor="expenses" className="text-sm">
                          Expense Breakdown
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="assets" className="mr-2" defaultChecked />
                        <label htmlFor="assets" className="text-sm">
                          Assets Overview
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="liabilities" className="mr-2" defaultChecked />
                        <label htmlFor="liabilities" className="text-sm">
                          Liabilities Summary
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="networth" className="mr-2" defaultChecked />
                        <label htmlFor="networth" className="text-sm">
                          Net Worth Calculation
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="goals" className="mr-2" />
                        <label htmlFor="goals" className="text-sm">
                          Financial Goals Progress
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="recommendations" className="mr-2" />
                        <label htmlFor="recommendations" className="text-sm">
                          AI Recommendations
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Report Options</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="timeframe" className="text-sm">
                          Time Period
                        </label>
                        <Select defaultValue="month">
                          <SelectTrigger id="timeframe">
                            <SelectValue placeholder="Select time period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="month">Current Month</SelectItem>
                            <SelectItem value="quarter">Current Quarter</SelectItem>
                            <SelectItem value="year">Current Year</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="format" className="text-sm">
                          Report Format
                        </label>
                        <Select defaultValue="pdf">
                          <SelectTrigger id="format">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF Document</SelectItem>
                            <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                            <SelectItem value="csv">CSV File</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="charts" className="text-sm">
                          Include Charts
                        </label>
                        <Select defaultValue="yes">
                          <SelectTrigger id="charts">
                            <SelectValue placeholder="Include charts?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleGenerateReport("Custom Report")}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Custom Report
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Your previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Monthly Summary - April 2025</p>
                    <p className="text-sm text-muted-foreground">Generated on Apr 15, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Income Statement - Q1 2025</p>
                    <p className="text-sm text-muted-foreground">Generated on Apr 10, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Tax Summary - 2024</p>
                    <p className="text-sm text-muted-foreground">Generated on Mar 20, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
