"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface Liability {
  id: string
  title: string
  amount: string
  type: string
}

interface LiabilityDistributionChartProps {
  liabilities: Liability[]
}

export function LiabilityDistributionChart({ liabilities }: LiabilityDistributionChartProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only show the chart after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    )
  }

  // Extract numeric value from formatted currency string
  const extractNumericValue = (value: string): number => {
    // Remove ₹ and commas, then parse as float
    const numericString = value.replace(/[₹,]/g, "")
    return Number.parseFloat(numericString) || 0
  }

  // Group liabilities by type and calculate total value
  const liabilitiesByType = liabilities.reduce(
    (acc, liability) => {
      const type = liability.type
      const value = extractNumericValue(liability.amount)

      if (!acc[type]) {
        acc[type] = { name: type, value: 0 }
      }

      acc[type].value += value
      return acc
    },
    {} as Record<string, { name: string; value: number }>,
  )

  const chartData = Object.values(liabilitiesByType)

  // Colors for the chart
  const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE", "#8884d8", "#82ca9d"]

  // Format the value for the tooltip
  const formatValue = (value: number) => {
    return `₹${value.toLocaleString("en-IN")}`
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatValue(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
