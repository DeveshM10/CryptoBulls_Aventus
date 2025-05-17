"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from "recharts"
import { Download, BarChart3, PieChartIcon, LineChartIcon, Lightbulb, Edit } from "lucide-react"
import { DialogForm } from "@/components/ui/dialog-form"

// Sample data for comparison
// In a real app, this would come from an API
const initialMonthlyData = [
  { month: "Jan", assets: 42000, liabilities: 25000, netWorth: 17000 },
  { month: "Feb", assets: 43500, liabilities: 24800, netWorth: 18700 },
  { month: "Mar", assets: 45000, liabilities: 24500, netWorth: 20500 },
  { month: "Apr", assets: 47500, liabilities: 24200, netWorth: 23300 },
  { month: "May", assets: 51000, liabilities: 24000, netWorth: 27000 },
  { month: "Jun", assets: 54000, liabilities: 23800, netWorth: 30200 },
  { month: "Jul", assets: 56500, liabilities: 23600, netWorth: 32900 },
  { month: "Aug", assets: 59000, liabilities: 23400, netWorth: 35600 },
  { month: "Sep", assets: 62000, liabilities: 23300, netWorth: 38700 },
  { month: "Oct", assets: 65000, liabilities: 23200, netWorth: 41800 },
  { month: "Nov", assets: 67500, liabilities: 23100, netWorth: 44400 },
  { month: "Dec", assets: 68500, liabilities: 23268, netWorth: 45232 },
]

// Asset breakdown data
const initialAssetBreakdown = [
  { name: "Real Estate", value: 425000, color: "#8b5cf6" },
  { name: "Stocks", value: 85750, color: "#3b82f6" },
  { name: "Cash", value: 32450, color: "#10b981" },
  { name: "Retirement", value: 128300, color: "#f59e0b" },
  { name: "Vehicle", value: 18500, color: "#ef4444" },
]

// Liability breakdown data
const initialLiabilityBreakdown = [
  { name: "Mortgage", value: 320000, color: "#ef4444" },
  { name: "Auto Loan", value: 18500, color: "#f59e0b" },
  { name: "Credit Card", value: 4250, color: "#8b5cf6" },
  { name: "Student Loan", value: 22800, color: "#3b82f6" },
]

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card className="p-3 border shadow-sm bg-background">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={`tooltip-${index}`}
            className={`text-sm ${
              entry.dataKey === "assets"
                ? "text-emerald-500"
                : entry.dataKey === "liabilities"
                  ? "text-rose-500"
                  : "text-primary"
            }`}
          >
            {entry.name}: ${entry.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
        ))}
      </Card>
    )
  }
  return null
}

export default function ComparePage() {
  // State for time period and chart type
  const [timePeriod, setTimePeriod] = useState("1y")
  const [chartType, setChartType] = useState("bar")
  const [monthlyData, setMonthlyData] = useState(initialMonthlyData)
  const [assetBreakdown, setAssetBreakdown] = useState(initialAssetBreakdown)
  const [liabilityBreakdown, setLiabilityBreakdown] = useState(initialLiabilityBreakdown)

  // Get data based on selected time period
  const getFilteredData = () => {
    switch (timePeriod) {
      case "3m":
        return monthlyData.slice(-3)
      case "6m":
        return monthlyData.slice(-6)
      case "1y":
        return monthlyData
      default:
        return monthlyData
    }
  }

  const filteredData = getFilteredData()

  // Calculate totals
  const totalAssets = assetBreakdown.reduce((sum, item) => sum + item.value, 0)
  const totalLiabilities = liabilityBreakdown.reduce((sum, item) => sum + item.value, 0)
  const netWorth = totalAssets - totalLiabilities
  const debtToAssetRatio = ((totalLiabilities / totalAssets) * 100).toFixed(1)

  // Handle adding new asset
  const handleAddAsset = (formData) => {
    const newAsset = {
      name: formData.name,
      value: Number(formData.value),
      color: formData.color || "#8b5cf6", // Default color if not provided
    }
    setAssetBreakdown([...assetBreakdown, newAsset])
  }

  // Handle adding new liability
  const handleAddLiability = (formData) => {
    const newLiability = {
      name: formData.name,
      value: Number(formData.value),
      color: formData.color || "#ef4444", // Default color if not provided
    }
    setLiabilityBreakdown([...liabilityBreakdown, newLiability])
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Compare</h2>
          <p className="text-muted-foreground">Compare your assets and liabilities to gain financial insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Assets vs Liabilities Overview */}
      <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Assets vs Liabilities</CardTitle>
            <CardDescription>Compare your total assets and liabilities</CardDescription>
          </div>
          <div className="flex gap-2">
            <DialogForm
              title="Update Assets"
              description="Add or modify your assets"
              triggerButton={
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Assets
                </Button>
              }
              fields={[
                {
                  id: "name",
                  label: "Asset Name",
                  type: "text",
                  placeholder: "e.g., Real Estate",
                  required: true,
                },
                {
                  id: "value",
                  label: "Value",
                  type: "number",
                  placeholder: "e.g., 100000",
                  required: true,
                },
                {
                  id: "color",
                  label: "Color (Hex)",
                  type: "text",
                  placeholder: "e.g., #8b5cf6",
                },
              ]}
              onSubmit={handleAddAsset}
              submitLabel="Add Asset"
            />
            
            <DialogForm
              title="Update Liabilities"
              description="Add or modify your liabilities"
              triggerButton={
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Liabilities
                </Button>
              }
              fields={[
                {
                  id: "name",
                  label: "Liability Name",
                  type: "text",
                  placeholder: "e.g., Mortgage",
                  required: true,
                },
                {
                  id: "value",
                  label: "Value",
                  type: "number",
                  placeholder: "e.g., 100000",
                  required: true,
                },
                {
                  id: "color",
                  label: "Color (Hex)",
                  type: "text",
                  placeholder: "e.g., #ef4444",
                },
              ]}
              onSubmit={handleAddLiability}
              submitLabel="Add Liability"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md h-8 bg-muted rounded-full overflow-hidden mb-4">
                <div
                  className="absolute top-0 left-0 h-full bg-emerald-500"
                  style={{ width: `${(totalAssets / (totalAssets + totalLiabilities)) * 100}%` }}
                ></div>
                <div
                  className="absolute top-0 right-0 h-full bg-rose-500"
                  style={{ width: `${(totalLiabilities / (totalAssets + totalLiabilities)) * 100}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Assets</p>
                  <p className="text-2xl font-bold text-emerald-500">${totalAssets.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Liabilities</p>
                  <p className="text-2xl font-bold text-rose-500">${totalLiabilities.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Net Worth</p>
                <p className="text-3xl font-bold text-primary">${netWorth.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Debt-to-Asset Ratio:{" "}
                  <span
                    className={
                      debtToAssetRatio < 40
                        ? "text-emerald-500"
                        : debtToAssetRatio < 60
                          ? "text-amber-500"
                          : "text-rose-500"
                    }
                  >
                    {debtToAssetRatio}%
                  </span>
                </p>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="bg-muted/30 p-4 rounded-lg border border-dashed">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-6 w-6 text-amber-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">Financial Insight</h3>
                    <p className="text-sm text-muted-foreground">
                      {debtToAssetRatio < 40
                        ? "Your debt-to-asset ratio is healthy. Consider investing more of your surplus funds to accelerate wealth growth."
                        : debtToAssetRatio < 60
                          ? "Your debt-to-asset ratio is moderate. Focus on paying down high-interest debt while maintaining your investment strategy."
                          : "Your debt-to-asset ratio is high. Prioritize debt reduction to improve your financial stability and reduce risk."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart Comparison */}
      <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Financial Trends</CardTitle>
            <CardDescription>Track your financial progress over time</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setChartType("bar")}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="sr-only">Bar Chart</span>
            </Button>
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setChartType("line")}
            >
              <LineChartIcon className="h-4 w-4" />
              <span className="sr-only">Line Chart</span>
            </Button>
            <Button
              variant={chartType === "pie" ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setChartType("pie")}
            >
              <PieChartIcon className="h-4 w-4" />
              <span className="sr-only">Pie Chart</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {chartType === "bar" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="assets" name="Assets" fill="#10b981" />
                  <Bar dataKey="liabilities" name="Liabilities" fill="#ef4444" />
                  <Bar dataKey="netWorth" name="Net Worth" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {chartType === "line" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  \
