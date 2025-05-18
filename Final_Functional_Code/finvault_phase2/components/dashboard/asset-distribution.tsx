"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for asset distribution
// In a real app, this would come from an API
const assetData = [
  { name: "Real Estate", value: 425000, color: "#8b5cf6" },
  { name: "Stocks", value: 85750, color: "#3b82f6" },
  { name: "Cash", value: 32450, color: "#10b981" },
  { name: "Retirement", value: 128300, color: "#f59e0b" },
  { name: "Vehicle", value: 18500, color: "#ef4444" },
]

// Custom tooltip component for the pie chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-sm p-2 text-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-primary">${payload[0].value.toLocaleString()}</p>
        <p className="text-muted-foreground text-xs">
          {((payload[0].value / assetData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}% of total
        </p>
      </div>
    )
  }
  return null
}

export function AssetDistribution() {
  const [chartType, setChartType] = useState("value")

  // Calculate total value of all assets
  const totalValue = assetData.reduce((sum, item) => sum + item.value, 0)

  // Format data based on selected chart type
  const data =
    chartType === "value"
      ? assetData
      : assetData.map((item) => ({
          ...item,
          value: (item.value / totalValue) * 100,
        }))

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value">Value ($)</SelectItem>
            <SelectItem value="percentage">Percentage (%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) =>
                chartType === "percentage" ? `${name}: ${(percent * 100).toFixed(0)}%` : name
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center text-sm text-muted-foreground">Total Assets: ${totalValue.toLocaleString()}</div>
    </div>
  )
}
