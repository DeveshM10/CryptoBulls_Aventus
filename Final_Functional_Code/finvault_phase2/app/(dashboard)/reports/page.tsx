"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  BarChart4,
  PieChart,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  LineChart,
  CreditCard,
  Wallet,
} from "lucide-react"

export default function ReportsPage() {
  const [timePeriod, setTimePeriod] = useState("month")
  const [reportFormat, setReportFormat] = useState("pdf")

  const handleGenerateReport = (reportType: string) => {
    // In a real app, this would call an API to generate and download the report
    console.log(`Generating ${reportType} report for ${timePeriod} in ${reportFormat} format`)

    // Simulate download delay
    setTimeout(() => {
      alert(`Your ${reportType} report has been generated and is ready for download.`)
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Generate and download financial reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList className="h-auto flex flex-wrap md:flex-nowrap">
          <TabsTrigger value="financial" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Financial Reports
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center">
            <Wallet className="h-4 w-4 mr-2" />
            Assets & Liabilities
          </TabsTrigger>
          <TabsTrigger value="spending" className="flex items-center">
            <BarChart4 className="h-4 w-4 mr-2" />
            Spending Analysis
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Tax Reports
          </TabsTrigger>
        </TabsList>

        {/* Financial Reports Section */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <LineChart className="mr-2 h-5 w-5 text-primary" />
                  Monthly Summary
                </CardTitle>
                <CardDescription>Complete overview of your monthly finances</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    This report includes income, expenses, savings, and investments for the selected month.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Income</span>
                      <span className="font-medium">$5,250.00</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Expenses</span>
                      <span className="font-medium">$3,840.00</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Savings</span>
                      <span className="font-medium">$1,410.00</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Investments</span>
                      <span className="font-medium">$800.00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full gap-2">
                  <Select defaultValue="pdf" onValueChange={setReportFormat} className="w-1/2">
                    <SelectTrigger>
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-1/2" onClick={() => handleGenerateReport("monthly summary")}>
                    <Download className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Income Statement
                </CardTitle>
                <CardDescription>Detailed income and expense statement</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    This report breaks down your income sources and expense categories in detail.
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: "70%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Income: 70%</span>
                      <span className="text-muted-foreground">Expenses: 30%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full gap-2">
                  <Select defaultValue="pdf" onValueChange={setReportFormat} className="w-1/2">
                    <SelectTrigger>
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-1/2" onClick={() => handleGenerateReport("income statement")}>
                    <Download className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Financial Calendar
                </CardTitle>
                <CardDescription>Timeline of financial activities</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    This report provides a day-by-day calendar of your financial activities, including bill due dates.
                  </p>
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs">Mortgage Payment</span>
                      <span className="text-xs font-medium">Apr 15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">Credit Card Payment</span>
                      <span className="text-xs font-medium">Apr 20</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs">Salary Deposit</span>
                      <span className="text-xs font-medium">Apr 30</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full gap-2">
                  <Select defaultValue="pdf" onValueChange={setReportFormat} className="w-1/2">
                    <SelectTrigger>
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-1/2" onClick={() => handleGenerateReport("financial calendar")}>
                    <Download className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>Previously generated reports</CardDescription>
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

        {/* Assets & Liabilities Section */}
        <TabsContent value="assets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Assets Report</CardTitle>
                <CardDescription>Detailed breakdown of your assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <PieChart className="h-20 w-20 text-muted-foreground/20" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleGenerateReport("assets")}>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Assets Report
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liabilities Report</CardTitle>
                <CardDescription>Detailed breakdown of your liabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <BarChart4 className="h-20 w-20 text-muted-foreground/20" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleGenerateReport("liabilities")}>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Liabilities Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Spending Analysis Section */}
        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending Analysis</CardTitle>
              <CardDescription>Analyze your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <TrendingUp className="h-20 w-20 text-muted-foreground/20" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleGenerateReport("spending analysis")}>
                <Download className="mr-2 h-4 w-4" />
                Generate Spending Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tax Reports Section */}
        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Reports</CardTitle>
              <CardDescription>Generate reports for tax filing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <FileText className="h-20 w-20 text-muted-foreground/20" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleGenerateReport("tax")}>
                <Download className="mr-2 h-4 w-4" />
                Generate Tax Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
