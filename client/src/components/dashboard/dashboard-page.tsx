"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, TrendingUp, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuickStats } from "./quick-stats"
 
export function DashboardPage() {
  // State for refresh animation and time period filter
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timePeriod, setTimePeriod] = useState("30d")

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

      {/* Quick stats cards showing key financial metrics */}
      <QuickStats />

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
                <div className="text-sm font-medium text-green-600">+₹1,500.00</div>
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
                <div className="text-sm font-medium text-red-600">-₹128.75</div>
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
                <div className="text-sm font-medium text-green-600">+₹4,250.00</div>
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
    </div>
  )
}