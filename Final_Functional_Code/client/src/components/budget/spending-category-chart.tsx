import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { Expense } from "./add-expense-form"

interface SpendingCategoryChartProps {
  expenses: Expense[]
}

export function SpendingCategoryChart({ expenses }: SpendingCategoryChartProps) {
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

  // Prepare data for chart - using spent amount
  const chartData = expenses.map((expense) => ({
    name: expense.title,
    value: extractNumericValue(expense.spent),
  }))

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57']

  // Format the value for the tooltip
  const formatValue = (value: number) => {
    return `₹${value.toLocaleString("en-IN")}`
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded p-2 shadow-md">
          <p className="font-semibold">{payload[0].name}</p>
          <p>{formatValue(payload[0].value)}</p>
        </div>
      )
    }
    return null
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
          nameKey="name"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}