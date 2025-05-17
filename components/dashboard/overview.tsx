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
  type TooltipProps,
} from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data
const data = [
  {
    month: "Jan",
    assets: 42000,
    liabilities: 25000,
  },
  {
    month: "Feb",
    assets: 43500,
    liabilities: 24800,
  },
  {
    month: "Mar",
    assets: 45000,
    liabilities: 24500,
  },
  {
    month: "Apr",
    assets: 47500,
    liabilities: 24200,
  },
  {
    month: "May",
    assets: 51000,
    liabilities: 24000,
  },
  {
    month: "Jun",
    assets: 54000,
    liabilities: 23800,
  },
  {
    month: "Jul",
    assets: 56500,
    liabilities: 23600,
  },
  {
    month: "Aug",
    assets: 59000,
    liabilities: 23400,
  },
  {
    month: "Sep",
    assets: 62000,
    liabilities: 23300,
  },
  {
    month: "Oct",
    assets: 65000,
    liabilities: 23200,
  },
  {
    month: "Nov",
    assets: 67500,
    liabilities: 23100,
  },
  {
    month: "Dec",
    assets: 68500,
    liabilities: 23268,
  },
]

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Card className="p-3 border shadow-sm bg-background">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-emerald-500">
          Assets: ${payload[0].value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="text-sm text-rose-500">
          Liabilities: ${payload[1].value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
      </Card>
    )
  }

  return null
}

export function Overview() {
  const [timeRange, setTimeRange] = useState("12m")

  // In a real app, we would filter data based on the selected time range
  const filteredData = data

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
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
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
