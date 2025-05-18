"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for financial overview
// In a real app, this would come from an API
const data = [
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

// Custom tooltip component for the chart
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

export function Overview() {
  // State for time range and chart type
  const [timeRange, setTimeRange] = useState("12m")
  const [chartType, setChartType] = useState("line")

  // Filter data based on time range
  const getFilteredData = () => {
    switch (timeRange) {
      case "3m":
        return data.slice(-3)
      case "6m":
        return data.slice(-6)
      case "ytd":
        // Simulate YTD (assuming current month is December)
        return data
      default:
        return data
    }
  }

  const filteredData = getFilteredData()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="line" onValueChange={setChartType} className="w-[200px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="area">Area</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3m">Last 3 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
            <SelectItem value="ytd">Year to date</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[300px]">
        {chartType === "line" ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="assets"
                stroke="#10b981"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                name="Assets"
              />
              <Line type="monotone" dataKey="liabilities" stroke="#ef4444" strokeWidth={2} name="Liabilities" />
              <Line
                type="monotone"
                dataKey="netWorth"
                stroke="#8b5cf6"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                name="Net Worth"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="assets"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Assets"
              />
              <Area
                type="monotone"
                dataKey="liabilities"
                stackId="2"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
                name="Liabilities"
              />
              <Area
                type="monotone"
                dataKey="netWorth"
                stackId="3"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
                name="Net Worth"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
