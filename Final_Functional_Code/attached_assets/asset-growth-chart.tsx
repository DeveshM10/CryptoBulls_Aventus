"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function AssetGrowthChart() {
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

  // Sample data for asset growth over 6 months
  // In a real app, this would come from an API or database
  const data = [
    { month: "Jan", property: 4250000, investments: 857500, cash: 324500, retirement: 1283000, personal: 185000 },
    { month: "Feb", property: 4275000, investments: 872000, cash: 335000, retirement: 1295000, personal: 180000 },
    { month: "Mar", property: 4300000, investments: 890000, cash: 342000, retirement: 1310000, personal: 175000 },
    { month: "Apr", property: 4325000, investments: 915000, cash: 350000, retirement: 1330000, personal: 170000 },
    { month: "May", property: 4350000, investments: 935000, cash: 360000, retirement: 1350000, personal: 165000 },
    { month: "Jun", property: 4375000, investments: 950000, cash: 370000, retirement: 1370000, personal: 160000 },
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
        <Line type="monotone" dataKey="property" stroke="#0088FE" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="investments" stroke="#00C49F" />
        <Line type="monotone" dataKey="cash" stroke="#FFBB28" />
        <Line type="monotone" dataKey="retirement" stroke="#FF8042" />
        <Line type="monotone" dataKey="personal" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  )
}
