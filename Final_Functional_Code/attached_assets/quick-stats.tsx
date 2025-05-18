"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Landmark, PiggyBank } from "lucide-react"
import { useFinanceStore } from "@/components/store/finance-store"

export function QuickStats() {
  const [isLoading, setIsLoading] = useState(false)
  const { getTotalAssets, getTotalLiabilities, getNetWorth, getTotalIncome, getTotalExpenses, getSurplus } =
    useFinanceStore()

  // Format currency with ₹ symbol
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString("en-IN")}`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Net Worth</p>
            <div className="rounded-full bg-primary/10 p-1">
              <Landmark className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                formatCurrency(getNetWorth())
              )}
            </h3>
            <p className="text-xs text-emerald-500 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12.5%
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Compared to last month</p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Total Assets</p>
            <div className="rounded-full bg-emerald-500/10 p-1">
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                formatCurrency(getTotalAssets())
              )}
            </h3>
            <p className="text-xs text-emerald-500 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              +8.2%
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Compared to last month</p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Total Liabilities</p>
            <div className="rounded-full bg-rose-500/10 p-1">
              <CreditCard className="h-4 w-4 text-rose-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                formatCurrency(getTotalLiabilities())
              )}
            </h3>
            <p className="text-xs text-rose-500 flex items-center">
              <TrendingDown className="mr-1 h-3 w-3" />
              -2.5%
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Compared to last month</p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium">Monthly Surplus</p>
            <div className="rounded-full bg-primary/10 p-1">
              <PiggyBank className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                formatCurrency(getSurplus())
              )}
            </h3>
            <p className="text-xs text-emerald-500 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              +5.1%
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Compared to last month</p>
        </CardContent>
      </Card>
    </div>
  )
}
