"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, Download, RefreshCw, Calendar, TrendingUp, BarChart3, Filter, ChevronRight, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
 
// Dummy content for now - this will be replaced with real components
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

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Net Worth Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹125,800.32</div>
                <p className="text-xs text-muted-foreground">
                  +8.1% <span className="ml-1">from last month</span>
                </p>
                <Progress value={57} className="mt-2 h-1" />
              </CardContent>
            </Card>

            {/* Total Income Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹8,450.00</div>
                <p className="text-xs text-muted-foreground">
                  +2.3% <span className="ml-1">from last month</span>
                </p>
                <Progress value={65} className="mt-2 h-1" />
              </CardContent>
            </Card>

            {/* Total Expenses Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹3,280.75</div>
                <p className="text-xs text-muted-foreground">
                  -5.2% <span className="ml-1">from last month</span>
                </p>
                <Progress value={42} className="mt-2 h-1" />
              </CardContent>
            </Card>

            {/* Savings Rate Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">61.2%</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% <span className="ml-1">from last month</span>
                </p>
                <Progress value={61} className="mt-2 h-1" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Monthly Overview Card */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-lg">
                  <p className="text-sm text-muted-foreground">Monthly financial chart will display here</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>You have 8 transactions this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Transaction Item */}
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-primary/10 p-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Investment Deposit</p>
                      <p className="text-xs text-muted-foreground">Today, 11:32 AM</p>
                    </div>
                    <div className="text-sm font-medium text-green-600">+$1,500.00</div>
                  </div>

                  {/* Transaction Item */}
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-red-100 p-2 dark:bg-red-900">
                      <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Utility Bill</p>
                      <p className="text-xs text-muted-foreground">Yesterday, 3:45 PM</p>
                    </div>
                    <div className="text-sm font-medium text-red-600">-$128.75</div>
                  </div>

                  {/* Transaction Item */}
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-primary/10 p-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Salary Deposit</p>
                      <p className="text-xs text-muted-foreground">Apr 22, 9:00 AM</p>
                    </div>
                    <div className="text-sm font-medium text-green-600">+$4,250.00</div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Transactions
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
              <CardDescription>Breakdown of your investment portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-lg">
                <p className="text-sm text-muted-foreground">Asset allocation pie chart will display here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Generate and download financial reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-4">
                    <label className="text-sm font-medium">Report Type</label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                        <SelectItem value="csv">CSV Export</SelectItem>
                        <SelectItem value="excel">Excel Workbook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-medium">Date Range</label>
                    <Select value={timePeriod} onValueChange={setTimePeriod}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select time period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full mt-2">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-2">Available Reports</h4>
                  <ul className="space-y-2">
                    <li className="text-sm border-b pb-2">
                      <div className="flex justify-between items-center">
                        <span>Monthly Summary - March 2023</span>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                    <li className="text-sm border-b pb-2">
                      <div className="flex justify-between items-center">
                        <span>Q1 Financial Report</span>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                    <li className="text-sm">
                      <div className="flex justify-between items-center">
                        <span>Annual Tax Statement 2022</span>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}