"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Expense } from "@/components/budget/add-expense-form"

interface BudgetChartProps {
  expenses: Expense[]
}

export function BudgetChart({ expenses }: BudgetChartProps) {
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

  // Prepare data for chart
  const chartData = expenses.map((expense) => ({
    name: expense.title,
    budgeted: extractNumericValue(expense.budgeted),
    spent: extractNumericValue(expense.spent),
  }))

  // Format the value for the tooltip
  const formatValue = (value: number) => {
    return `₹${value.toLocaleString("en-IN")}`
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
        <Tooltip formatter={(value: number) => formatValue(value)} />
        <Legend />
        <Bar dataKey="budgeted" fill="#0088FE" name="Budgeted" />
        <Bar dataKey="spent" fill="#00C49F" name="Spent" />
      </BarChart>
    </ResponsiveContainer>
  )
}
