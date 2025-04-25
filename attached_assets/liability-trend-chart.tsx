"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function LiabilityTrendChart() {
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

  // Sample data for liability payoff projection over 12 months
  // In a real app, this would come from an API or database
  const data = [
    { month: "Jan", mortgage: 3200000, autoLoan: 185000, creditCard: 42500, studentLoan: 228000 },
    { month: "Feb", mortgage: 3190000, autoLoan: 180000, creditCard: 38000, studentLoan: 225000 },
    { month: "Mar", mortgage: 3180000, autoLoan: 175000, creditCard: 34000, studentLoan: 222000 },
    { month: "Apr", mortgage: 3170000, autoLoan: 170000, creditCard: 30000, studentLoan: 219000 },
    { month: "May", mortgage: 3160000, autoLoan: 165000, creditCard: 26000, studentLoan: 216000 },
    { month: "Jun", mortgage: 3150000, autoLoan: 160000, creditCard: 22000, studentLoan: 213000 },
    { month: "Jul", mortgage: 3140000, autoLoan: 155000, creditCard: 18000, studentLoan: 210000 },
    { month: "Aug", mortgage: 3130000, autoLoan: 150000, creditCard: 14000, studentLoan: 207000 },
    { month: "Sep", mortgage: 3120000, autoLoan: 145000, creditCard: 10000, studentLoan: 204000 },
    { month: "Oct", mortgage: 3110000, autoLoan: 140000, creditCard: 6000, studentLoan: 201000 },
    { month: "Nov", mortgage: 3100000, autoLoan: 135000, creditCard: 2000, studentLoan: 198000 },
    { month: "Dec", mortgage: 3090000, autoLoan: 130000, creditCard: 0, studentLoan: 195000 },
  ]

  // Format the value for the tooltip
  const formatValue = (value: number) => {
    return `₹${value.toLocaleString("en-IN")}`
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
        <Tooltip formatter={(value: number) => formatValue(value)} />
        <Legend />
        <Line type="monotone" dataKey="mortgage" stroke="#FF8042" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="autoLoan" stroke="#FFBB28" />
        <Line type="monotone" dataKey="creditCard" stroke="#00C49F" />
        <Line type="monotone" dataKey="studentLoan" stroke="#0088FE" />
      </LineChart>
    </ResponsiveContainer>
  )
}
