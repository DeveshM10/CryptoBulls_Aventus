"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuickStats } from "./quick-stats"
import { FinancialTips } from "./financial-tips"
 
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
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={[
                    { month: 'Jan', income: 48000, expenses: 35000, savings: 13000 },
                    { month: 'Feb', income: 52000, expenses: 37000, savings: 15000 },
                    { month: 'Mar', income: 49000, expenses: 36000, savings: 13000 },
                    { month: 'Apr', income: 53000, expenses: 34000, savings: 19000 },
                    { month: 'May', income: 55000, expenses: 38000, savings: 17000 },
                    { month: 'Jun', income: 54000, expenses: 36000, savings: 18000 }
                  ]}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${(value/1000)}k`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-md">
                            <p className="font-medium">{label}</p>
                            {payload.map((entry) => (
                              <p key={entry.name} style={{ color: entry.color }}>
                                {entry.name}: ₹{entry.value.toLocaleString()}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    fill="#4ade80"
                    stroke="#4ade80"
                    fillOpacity={0.2}
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    fill="#f43f5e"
                    stroke="#f43f5e"
                    fillOpacity={0.2}
                    name="Expenses"
                  />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6" }}
                    name="Savings"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Financial Tips */}
        <div className="lg:col-span-3">
          <FinancialTips />
        </div>
      </div>
    </div>
  )
}